import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js") // Asegúrate de que el nombre del archivo sea correcto
      .then((registration) => {
        console.log("Service Worker registrado con éxito:", registration);
      })
      .catch((registrationError) => {
        console.error(
          "Error al registrar el Service Worker:",
          registrationError
        );
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);