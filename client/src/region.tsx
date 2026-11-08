import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RegionSelect } from "./RegionSelect";
import { Footer } from "./Footer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RegionSelect />
    <Footer />
  </StrictMode>,
);
