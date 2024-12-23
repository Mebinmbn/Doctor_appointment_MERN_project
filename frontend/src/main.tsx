import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./contexts/AuthContext";
import store from "./app/store.ts";
import { Provider } from "react-redux";
import { SearchProvider } from "./contexts/SearchContext.tsx";
import { SocketProvider } from "./contexts/SocketContexts.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <SearchProvider>
          <SocketProvider>
            <App />
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </SocketProvider>
        </SearchProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
