import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import "./App.css";

// const baseUrl = process.env.REACT_APP_BASE_URL;
// const resetUrl = `${baseUrl}/reset`;
// const parcialUrl = `${baseUrl}/parcial`;
// const uploadUrl = `${baseUrl}/upload`;
// const prediccionUrl = `${baseUrl}/prediccion`;

function App() {
  const [isCamaraOn, setIsCamaraOn] = useState(false);
  const [parcial, setParcial] = useState(0);
  const [prediccion, setPrediccion] = useState(0);
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
      const resp = await fetch(`http://localhost:5000/reset`, {
        method: "POST",
      });
      setParcial(0);
      setPrediccion(0);
      setRespuesta(0);
      setReset(resp);
      console.log(reset);
    }
    setIsCamaraOn((prevIsCamaraOn) => !prevIsCamaraOn);
    console.log("Camara prendida");
  };

  const videoConstraints = {
    width: 1024,
    height: 720,
    facingMode: "user",
  };

  const handleParcialSubmit = async (event) => {
    event.preventDefault();
    const res = await fetch(`http://localhost:5000/parcial`, {
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
    }, 1 * 30 * 1000);
  };

  const handleSubmit = async (blob) => {
    const fileName = `photo${pCount}.jpg`;
    const formData = new FormData();
    formData.append("file", blob, fileName);
    const resimg = await fetch(`http://localhost:5000/upload`, {
      method: "POST",
      body: formData,
    });
    const responseData = await resimg.json();
    setRespuestaUpload(responseData);
    pCount++;
    console.log(responseData, pCount);
    if (pCount === 4) {
      const prediccionNota = await fetch(`http://localhost:5000/prediccion`, {
        method: "POST",
      });
      const prediccionData = await prediccionNota.json();
      setPrediccion(prediccionData.prediccion);
      console.log(prediccionData);
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
      Math.floor(Math.random() * (1 * 30 * 1000))
    );

    randomIntervals.forEach((interval) => {
      setTimeout(capture, interval);
    });
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
    setParcial(event.target.value);
    console.log(parcial);
  };

  return (
    <>
      <div className="page">
        <div className="camera">
          <h1 onMouseOver={handleMouseOver}>{text}</h1>
          <div className="border-top">
            <div className="card-body">
              {isCamaraOn && (
                <form onSubmit={handleParcialSubmit}>
                  <div className="form-group">
                    <h5>8-10-10-25</h5>
                    <input
                      className="form-control"
                      type="text"
                      value={parcial}
                      onChange={handleParcialChange}
                    />
                  </div>
                  <button>Nota parcial</button>
                </form>
              )}
            </div>
          </div>
          {isCamaraOn && (
            <Webcam
              audio={false}
              height={728}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={1024}
              videoConstraints={videoConstraints}
            />
          )}
          {isCamaraOn && (
            <div className="text-between">
              <p>
                Se estima un promedio de: {prediccion.toFixed(2)} para este
                parcial
              </p>
            </div>
          )}
          <div className="border-top">
            <div className="card-body">
              <button onClick={handleCamaraToggle}>
                {isCamaraOn
                  ? "Apagar cámara"
                  : "Acepto los terminos y prendo la cámara"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {!isCamaraOn && (
        <div className="page">
          <div className="instruccion">
            <h1>Instruccion</h1>
            <div className="cards">
              <div className="border-top">
                <div className="card-body">
                  <h2>Como funciona</h2>
                  <h4>
                    1.- Al momento de prender la camara el usuario debera elegir
                    el parcial en el que los sujetos estan, la aplicacion tomara
                    al azar 3 fotos las mismas que seran enviadas a los modelos
                    para identificar los sujetos y sus emociones.
                  </h4>
                  <h4>
                    2.- Una vez las imagenes sean analizadas y procesadas por
                    los modelos, la aplicacion web mostrara las imagenes con sus
                    respectivas prediciones, una imagen a la vez conforme sean
                    analizadas y devueltas
                  </h4>
                  <h4>
                    3.- Al final despues de la tercera foto, el modelo dara un
                    estimado de las emociones totales de los sujetos analizados
                    y dara un estimado de su promedio basado en las emociones
                  </h4>
                </div>
              </div>
              <div className="border-top">
                <div className="card-body">
                  <h2>Predicciones</h2>
                  <h4>
                    CNN.- Las imagenes seran analizadas con Redes Neuronales
                    Convolucionales (2 CNN) previamente entrenadas, una para la
                    deteccion del rostro y otra para la identificacion de las
                    emociones
                  </h4>
                  <h4>
                    PREDICCION.- Se entreno un modelo predictivo para dar un
                    estimado del promedio de las notas de los sujetos analizados
                    basado en los datos de las emociones.
                  </h4>
                </div>
              </div>
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
                    estado emocionalmente de sus alumnos durante su clase para
                    poder mejorar su metodologia.
                  </h4>
                  <h4>
                    Fin.- Se pretende mejorar la calificacion promedio del curso
                    mediante la mejorar emocional de los alumnos
                  </h4>
                  <h4>
                    Responsabilidad.- No nos responsabilizamos por usos
                    inadecuados de la aplicacion, teniendo en cuenta el uso y
                    fin anteriormente mencionados
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
