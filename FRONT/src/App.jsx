import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Home from "./component/Home";
import Login from "./component/Login";
import Register from "./component/Register"
import Admin from "./component/Admin"
import Seller from "./component/Seller"
import ProductDetails from "./component/ProductDetails"

const App = () => {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/seller" element={<Seller />} />
          <Route path="/product/:documentId" element={<ProductDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
