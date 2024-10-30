import React, { useEffect, useState } from "react";
import "./styles/Home.css";
import App from "./App";

function Home() {
  const [theme, setTheme] = useState("light");

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  useEffect(() => {
    const hero = document.querySelector(".hero");
    const slider = document.querySelector(".slider");
    const logo = document.querySelector("#logo");
    const hamburger = document.querySelector(".hamburger");
    const headline = document.querySelector(".headline");

    const tl = new window.TimelineMax();

    tl.fromTo(
      hero,
      1,
      { height: "0%" },
      { height: "80%", ease: window.Power2.easeInOut }
    )

      .fromTo(
        hero,
        1.2,
        { width: "100%" },
        { width: "80%", ease: window.Power2.easeInOut }
      )

      .fromTo(
        slider,
        1.2,
        { x: "-100%" },
        { x: "0%", ease: window.Power2.easeInOut },
        "-=1.2"
      )

      .fromTo(logo, 0.5, { opacity: 0, x: 30 }, { opacity: 1, x: 0 }, "-=0.5")

      .fromTo(
        hamburger,
        0.5,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0 },
        "-=0.5"
      );
  }, []);

  return (
    <>
      <header className={`head ${theme}`}>
        <nav>
          <h3 id="logo">Bienvenidos</h3>
          <div className="hamburger" onClick={handleThemeToggle}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {theme === "light" ? (
                <path
                  d="M12 1.75V3.25M12 20.75V22.25M1.75 12H3.25M20.75 12H22.25M4.75216 4.75216L5.81282
       5.81282M18.1872 18.1872L19.2478 19.2478M4.75216 19.2478L5.81282 18.1872M18.1872 5.81282L19.2478
        4.75216M16.25 12C16.25 14.3472 14.3472 16.25 12 16.25C9.65279 16.25 7.75 14.3472 7.75 12C7.75
         9.65279 9.65279 7.75 12 7.75C14.3472 7.75 16.25 9.65279 16.25 12Z"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="sun"
                />
              ) : (
                <path
                  d="M2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C16.7154 21.25 20.6068 17.7216 21.1778
       13.161C20.1198 13.8498 18.8566 14.25 17.5 14.25C13.7721 14.25 10.75 11.2279 10.75 7.5C10.75 5.66012
        11.4861 3.99217 12.6799 2.77461C12.4554 2.7583 12.2287 2.75 12 2.75C6.89137 2.75 2.75 6.89137 
        2.75 12Z"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  className="moon"
                />
              )}
            </svg>
          </div>
        </nav>
        <section>
          <div className="hero">
            <App />
          </div>
        </section>
      </header>
      <div className={`slider ${theme}`} />
    </>
  );
}

export default Home;
