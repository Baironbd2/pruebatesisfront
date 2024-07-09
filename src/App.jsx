import { useState, useRef } from "react";
import Webcam from "react-webcam";
import "./App.css";
const URL = import.meta.env.VITE_URL;

function App() {
  const [isCamaraOn, setIsCamaraOn] = useState(false);
  const [parcial, setParcial] = useState(8);
  const [user, setUser] = useState("");
  const [parcialError, setParcialError] = useState("");
  const [userError, setUserError] = useState("");
  const [prediccion, setPrediccion] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeoutIds, setTimeoutIds] = useState([]);
  const [reset, setReset] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [respuestaupload, setRespuestaUpload] = useState("");
  const [text, setText] = useState("ESPOCH Sede Orellana TI.");
  const [intervalId, setIntervalId] = useState(null);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const webcamRef = useRef(null);
  let pCount = 1;

  const handleCamaraToggle = async () => {
    if (isCamaraOn) {
      const resp = await fetch(`${URL}/reset`, {
        method: "POST",
      });
      setParcial(0);
      setPrediccion(1);
      setRespuesta(0);
      setIsButtonDisabled(false);
      pCount = 1;
      const respreset = await resp.json();
      setReset(respreset);
      console.log(respreset);
      timeoutIds.forEach((id) => clearTimeout(id));
      setTimeoutIds([]);
    }
    setIsCamaraOn((prevIsCamaraOn) => !prevIsCamaraOn);
  };

  const handleUserId = async (event) =>{
    event.preventDefault()
    if (user === "") {
      setUserError("Ingrese un usuario");
      return;
    }
    // const res = await fetch(`${URL}/user`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ user: user }),
    // });
    console.log(`Usuario ${user} enviado`)
    // const response = await res.json();
    // setRespuesta(response);
    // console.log(response);
    setIsCamaraOn((prevIsCamaraOn) => !prevIsCamaraOn);
  }

  const videoConstraints = {
    width: 1024,
    height: 720,
    facingMode: "user",
  };

  const handleParcialSubmit = async (event) => {
    event.preventDefault();
    if (parcial === "") {
      setParcialError("Ingrese un valor");
      return;
    }
    if (isNaN(parcial)) {
      setParcialError("Solo se permiten números");
      return;
    }
    setParcialError("");
    setIsButtonDisabled(true);
    const res = await fetch(`${URL}/partial`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parcial: parcial }),
    });
    console.log(`Parcial ${parcial} enviado`);
    const response = await res.json();
    setRespuesta(response);
    console.log(response);
    setTimeout(() => {
      capturePhotos();
    }, 10 * 60 * 1000);
  };

  const handleSubmit = async (blob) => {
    const fileName = `photo${pCount}.jpg`;
    const formData = new FormData();
    formData.append("file", blob, fileName);
    const resimg = await fetch(`${URL}/upload`, {
      method: "POST",
      body: formData,
    });
    const responseData = await resimg.json();
    setRespuestaUpload(responseData);
    pCount++;
    console.log(responseData, pCount);
    if (pCount === 4) {
      const prediccionNota = await fetch(`${URL}/prediccion`, {
        method: "POST",
      });
      const prediccionData = await prediccionNota.json();
      setPrediccion(prediccionData.Prediction);
      console.log(prediccionData);
      setIsButtonDisabled(false);
    }
  };

  const capturePhotos = () => {
    const capture = async () => {
      const imageSrc = webcamRef.current.getScreenshot();
      const blob = await fetch(imageSrc).then((res) => res.blob());
      console.log("Foto capturada:", blob);
      handleSubmit(blob);
    };

    capture();

    const randomIntervals = Array.from({ length: 2 }, () =>
      Math.floor(Math.random() * (30 * 60 * 1000))
    );
    const newTimeoutIds = randomIntervals.map((interval) => {
      return setTimeout(capture, interval);
    });

    setTimeoutIds((prevTimeoutIds) => [...prevTimeoutIds, ...newTimeoutIds]);
  };

  const handleMouseOver = () => {
    let iteration = 0;
    clearInterval(intervalId);
    const newIntervalId = setInterval(() => {
      setText((prevText) =>
        prevText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return "Preparados para predecir"[index];
            }
            return letters[Math.floor(Math.random() * 26)];
          })
          .join("")
      );
      if (iteration >= "Preparados para analizar".length) {
        clearInterval(newIntervalId);
      }
      iteration += 1 / 3;
    }, 40);
    setIntervalId(newIntervalId);
  };

  const handleParcialChange = (event) => {
    const value = event.target.value;
    if (value === "" ) {
    setIsButtonDisabled(true);
      setParcialError("No se permiten valoes nulos");
    } else if (!isNaN(value)) {
    setIsButtonDisabled(false);
      setParcial(value);
      setParcialError("");
    } else {
      setParcialError("Solo se permiten números");
    }
  };

  const handleUserChange = (event) => {
    const value = event.target.value;
    if (value === "") {
      setUserError("Usuario requerido");
    } else if (/^[A-Za-z]*$/.test(value)) {
      setUser(value);
      setUserError("");
    } else {
      setUserError("Solo se permiten letras");
    }
  }
  return (
    <>
      {isCamaraOn && (
        <div className="page">
          <div className="camera">
            <h1 onMouseOver={handleMouseOver}>{text}</h1>
            <div className="border-top">
              <div className="card-body">
                <form onSubmit={handleParcialSubmit}>
                  <div className="form-group">
                    <h5>{user} seleciona (8,10,25)</h5>
                    <input
                      className={`form-control ${
                        parcialError ? "input-error" : "input-success"
                      }`}
                      type="number"
                      value={parcial}
                      onChange={handleParcialChange}
                    />
                    {parcialError && (
                      <div className="error-message">{parcialError}</div>
                    )}
                  </div>
                  <button disabled={isButtonDisabled}>
                    {isButtonDisabled ? "Esperando prediccion" : "Nota parcial"}
                  </button>
                </form>
              </div>
            </div>
            <Webcam
              audio={false}
              height={728}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={1024}
              videoConstraints={videoConstraints}
            />
            <div className="text-between">
              {prediccion === 0
                ? "No se detectaron emociones en las imagenes"
                : prediccion === 1
                ? "Esperando predicción"
                : `Se estima un promedio de ${prediccion} para este parcial`}
            </div>
            <div className="border-top">
              <div className="card-body">
                <button onClick={handleCamaraToggle}>"Apagar cámara"</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!isCamaraOn && (
        <div className="page">
          <div className="instruccion">
            <h1 onMouseOver={handleMouseOver}>{text}</h1>
            <div className="card-body">
                <form onSubmit={handleUserId}>
                  <div className="form-group">
                    <h5>Ingrese un Usuario</h5>
                    <input
                      className={`form-control ${
                        userError ? "input-error" : "input-success"
                      }`}
                      type="text"
                      value={user}
                      onChange={handleUserChange}
                    />
                    {userError && (
                    <div className="error-message">{userError}</div>
                  )}
                  </div>
                  <button disabled={isButtonDisabled}>
                    Ingresar
                  </button>
                </form>
              </div>
            <h1>INSTRUCCIÓN</h1>
            <div className="cards">
              <div className="border-top">
                <div className="card-body">
                  <h2>Avisos Legales</h2>
                  <h4>
                    Acepto usar la aplicacion de forma etica y responsable
                    unicamente para fines academicos
                  </h4>
                  <h4>
                    Uso.- La aplicacion esta echa para fines de mejora
                    academica. Proporciona al docente una vision general del
                    promedio de sus alumnos en el transcurso del PAO para poder
                    mejorar su metodologia.
                  </h4>
                  <h4>
                    Fin.- Se pretende mejorar la calificacion promedio del curso
                    mediante la mejora emocional de los alumnos.
                  </h4>
                  <h4>
                    Responsabilidad.- No nos responsabilizamos por usos
                    inadecuados de la aplicacion, teniendo en cuenta el uso y
                    fin anteriormente mencionados.
                  </h4>
                </div>
              </div>
              <div className="border-top">
                <div className="card-body">
                  <h2>¿Como funciona?</h2>
                  <h4>
                    1.- Al momento de prender la cámara el usuario deberá
                    proporcionar la nota que quiere alcansar (8,10,25), una vez
                    proporcionada la nota, la aplicacion tomara al azar durande
                    la clase 3 fotos las mismas que serán enviadas a los modelos
                    para identificar los sujetos y sus emociones.
                  </h4>
                  <h4>
                    2.- Al final, después de la tercera foto, el modelo dará un
                    estimado de su promedio basado en las emociones.
                  </h4>
                  <h4>
                    3.- ¿Qué puede pasar? Sin rostros no hay predicción, sin
                    nota no hay fotos, la predicción puede tener un margen de
                    error de 1.8 puntos a la calificación.
                  </h4>
                </div>
              </div>
              <div className="border-top">
                <div className="card-body">
                  <h2>Predicciones</h2>
                  <h4>
                    CNN.- Las imágenes serán analizadas con Redes Neuronales
                    Convolucionales (2 CNN) previamente entrenadas, una para la
                    detección del rostro y otra para la identificación de las
                    emociones.
                  </h4>
                  <h4>
                    PREDICCION.- Se entreno un modelo predictivo para dar un
                    estimado del promedio de las notas de los sujetos analizados
                    basado en los datos de las emociones.
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
