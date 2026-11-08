import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Greeter } from "./Greeter.tsx";
import { Footer } from "./Footer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Greeter />
    <Footer />
  </StrictMode>,
);
