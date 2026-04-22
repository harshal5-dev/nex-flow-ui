import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

import "./index.css";
import App from "./App";
import { ThemeProvider } from "@/components/theme/theme-provider.jsx";
import store from "./store/Store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);
