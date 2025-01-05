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
import { ChatProvider } from "./contexts/ChatContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <ChatProvider>
        <Provider store={store}>
          <AuthProvider>
            <SearchProvider>
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
            </SearchProvider>
          </AuthProvider>
        </Provider>
      </ChatProvider>
    </SocketProvider>
  </StrictMode>
);
