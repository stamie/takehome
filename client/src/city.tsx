import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { CitySelect } from "./CitySelect";
import { Footer } from "./Footer";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CitySelect />
    <Footer />
  </StrictMode>,
);
