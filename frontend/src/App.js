import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateAd from "./pages/CreateAd";
import PrivateRoute from "./components/PrivateRoute";
import UserAds from "./pages/UserAds";
import Home from "./pages/Home";
import AdDetails from "./pages/AdDetails";
import UpdateAd from "./pages/UpdateAd";
import PopularAds from "./pages/PopulareAds";
function App() {
  return (
    <BrowserRouter>
      <div className=" container">
        <Header />
        <Routes>
          <Route
            path="/ads/add"
            element={
              <PrivateRoute>
                <CreateAd />
              </PrivateRoute>
            }
          />
          <Route
            path="/ads/myads"
            element={
              <PrivateRoute>
                <UserAds />
              </PrivateRoute>
            }
          />
          <Route path="/ads/:_id" element={<AdDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route
          path="/ads/update/:id"
          element={
            <PrivateRoute>
              <UpdateAd />
            </PrivateRoute>
          }
        />
        <Route path="/ads/populare" element={<PopularAds />} />
        </Routes>

        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
