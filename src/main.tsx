import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

window.NOTIFICATION_KEY = "NOTIFICATION";
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
