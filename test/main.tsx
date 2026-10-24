import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UIProvider } from "../registry/components/ui/provider";
import { DesignSystem } from "../registry/examples/design-system";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UIProvider>
      <DesignSystem />
    </UIProvider>
  </StrictMode>,
);
