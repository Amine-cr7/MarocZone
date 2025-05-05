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
import UserAds from "./pages/UserAds";
import UpdateAd from "./pages/UpdateAd";
function App() {

  return (


    <BrowserRouter>
      <div className=" container">
        <Header />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/ads/:_id" element={<AdDetails />} />
          <Route path="/ads/user" element={<UserAds />} />
          <Route path="/add" element={
            <PrivateRoute>
              <CreateAd />
            </PrivateRoute>
          } />
          <Route
            path="/update/:_id"
            element={
              <PrivateRoute>
                <UpdateAd />
              </PrivateRoute>
            }
          />

        </Routes>
        <ToastContainer />
      </div>

    </BrowserRouter>

  );
}

export default App;
