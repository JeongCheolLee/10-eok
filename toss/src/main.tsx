import { createRoot } from "react-dom/client";
import { TDSMobileAITProvider } from "@toss/tds-mobile-ait";
import "./tds.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <TDSMobileAITProvider brandPrimaryColor="#02a262">
    <App />
  </TDSMobileAITProvider>,
);
