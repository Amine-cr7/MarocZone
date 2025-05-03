import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Register from "./pages/Register";
import Login from "./pages/Login";
import Header from "./components/Header";
import { ToastContainer } from 'react-toastify'
import CreateAd from "./pages/CreateAd";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import AdDetails from "./pages/AdDetails";
function App() {

  return (


    <BrowserRouter>
      <div className=" container">

        <Header />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ads/:_id" element={<AdDetails />} />
          <Route path="/add" element={
            <PrivateRoute>
              <CreateAd/>
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
