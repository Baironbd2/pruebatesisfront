import { useState, useRef } from "react";
import Webcam from "react-webcam";
import "./styles/App.css";
import Information from "./Information";

const URL = import.meta.env.VITE_URL;

function App() {

  let pCount = 1;
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
  const webcamRef = useRef(null);

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

  const handleCameraSwitch = () => {
    const devices = navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const currentDeviceIndex = videoDevices.findIndex(
          (device) => device.deviceId === selectedCamera
        );
        const nextDevice =
          videoDevices[(currentDeviceIndex + 1) % videoDevices.length];
        setSelectedCamera(nextDevice.deviceId);
      });
  };

  const handleUserId = async (event) => {
    event.preventDefault();
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
    console.log(`Usuario ${user} enviado`);
    // const response = await res.json();
    // setRespuesta(response);
    // console.log(response);
    setIsCamaraOn((prevIsCamaraOn) => !prevIsCamaraOn);
  };

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

  const handleParcialChange = (event) => {
    const value = event.target.value;
    if (value === "") {
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
  };
  return (
    <>
      <div className="page">
        {!isCamaraOn && (
          <div className="instruccion">
            <h1>ESPOCH SEDE ORELLANA TI</h1>
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
                <button disabled={isButtonDisabled}>Ingresar</button>
              </form>
            </div>
            <h3>INSTRUCCIÓN</h3>
            <Information />
          </div>
        )}
        {isCamaraOn && (
          <div className="camera">
            <div className="header" >
            </div>
            <h1>Preparados para predecir</h1>
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
                <button
                  onClick={handleCameraSwitch}
                  className="camera-switch-button"
                >
                  Cambiar Cámara
                </button>
              </div>
            </div>
            <Webcam
              audio={false}
              height={320}
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
                <button onClick={handleCamaraToggle}>Apagar cámara</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
