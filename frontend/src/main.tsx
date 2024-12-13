import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import store from "./app/store.ts";
import { Provider } from "react-redux";
import { SearchProvider } from "./contexts/SearchContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
