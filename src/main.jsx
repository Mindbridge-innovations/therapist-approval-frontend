import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";

// import './index.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SnackbarProvider maxSnack={3} anchorOrigin={{
      vertical: 'bottom', // or 'top'
      horizontal: 'right',
    }}>
        <App />
      </SnackbarProvider>
    </BrowserRouter>
  </React.StrictMode>
);
