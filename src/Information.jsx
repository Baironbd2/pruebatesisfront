import React, { useEffect } from "react";
import SocialMediaIcons from "./Social";
import "./styles/Information.css";

export default function Information() {
  useEffect(() => {
    let tabHeader = document.getElementsByClassName("tab-header")[0];
    let tabIndicator = document.getElementsByClassName("tab-indicator")[0];
    let tabBody = document.getElementsByClassName("tab-body")[0];

    let tabsPane = tabHeader.getElementsByTagName("div");

    for (let i = 0; i < tabsPane.length; i++) {
      tabsPane[i].addEventListener("click", function () {
        tabHeader
          .getElementsByClassName("active")[0]
          .classList.remove("active");
        tabsPane[i].classList.add("active");
        tabBody.getElementsByClassName("active")[0].classList.remove("active");
        tabBody.getElementsByTagName("div")[i].classList.add("active");

        tabIndicator.style.left = `calc(calc(100% / 4) * ${i})`;
      });
    }
  }, []);

  return (
    <>
      <div className="tabs">
        <div className="tab-header">
          <div className="active">
            <i className="fa fa-exclamation-circle" /> Avisos Legales
          </div>
          <div>
            <i className="fa fa-cog fa-spin" /> ¿Como funciona?
          </div>
          <div>
            <i className="fa fa-bar-chart" /> Predicciones
          </div>
          <div>
            <i className="fa fa-book" /> Contacto
          </div>
        </div>
        <div className="tab-indicator" />
        <div className="tab-body">
          <div className="active">
            <h2>Avisos Legales</h2>
            <p>
              Acepto usar la aplicacion de forma etica y responsable unicamente
              para fines academicos 
              Uso.- La aplicacion esta echa para fines de
              mejora academica. Proporciona al docente una vision general del
              promedio de sus alumnos en el transcurso del PAO para poder
              mejorar su metodologia. 
              Fin.- Se pretende mejorar la calificacion
              promedio del curso mediante la mejora emocional de los alumnos.
              Responsabilidad.- No nos responsabilizamos por usos inadecuados de
              la aplicacion, teniendo en cuenta el uso y fin anteriormente
              mencionados.
            </p>
          </div>
          <div>
            <h2>¿Como funciona?</h2>
            <p>
              1.- Al momento de prender la cámara el usuario deberá proporcionar
              la nota que quiere alcansar (8,10,25), una vez proporcionada la
              nota, la aplicacion tomara al azar durande la clase 3 fotos las
              mismas que serán enviadas a los modelos para identificar los
              sujetos y sus emociones. 2.- Al final, después de la tercera foto,
              el modelo dará un estimado de su promedio basado en las emociones.
              3.- ¿Qué puede pasar? Sin rostros no hay predicción, sin nota no
              hay fotos, la predicción puede tener un margen de error de 1.8
              puntos a la calificación.
            </p>
          </div>
          <div>
            <h2>Predicciones</h2>
            <p>
              CNN.- Las imágenes serán analizadas con Redes Neuronales
              Convolucionales (2 CNN) previamente entrenadas, una para la
              detección del rostro y otra para la identificación de las
              emociones. PREDICCION.- Se entreno un modelo predictivo para dar
              un estimado del promedio de las notas de los sujetos analizados
              basado en los datos de las emociones.
            </p>
          </div>
          <div>
            <h2>Contactos</h2>
            <p>
              Contactate con nosotros para mas informacion puedes encontrarnos en nuestras redes sociales
            </p>
              <SocialMediaIcons />
          </div>
        </div>
      </div>
    </>
  );
}
