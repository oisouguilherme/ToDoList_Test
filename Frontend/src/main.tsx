import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { TaskList } from "./pages/Task-List.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<TaskList />}></Route>
      </Routes>
    </Router>
    <ToastContainer />
  </React.StrictMode>
);
