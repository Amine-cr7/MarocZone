import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateAd from "./pages/CreateAd";
import PrivateRoute from "./components/PrivateRoute";
function App() {
  return (
    <BrowserRouter>
      <div className=" container">

        <Header />
        <Routes>
          <Route path="/add" element={
            <PrivateRoute>
              <UserAds />
            </PrivateRoute>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <ToastContainer />
      </div>

    </BrowserRouter>
  );
}

export default App;
