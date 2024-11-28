import React, { useState } from "react";
import { Eye, EyeOff, Facebook, Twitter, Mail, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

const API_URL = "http://localhost:1337/api/user-ids";
const API_TOKEN =
  "958dab05804bdec2c3b535d313365a849cf623f0d0f43e22e64b9eaa5d0fb1583384ff43cd8ee0e759190cb0989687b509bdf941646adab38297655673d06e92181703dee84e530fa6b140c506ef36d3eabbce23dc20bfc3686782d046138284b347b2ba24e36f0c4b14db89f16eef9028346723d53c7b53178b7e9f4985b3e4";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const socialIcons = [
    { icon: <Facebook size={20} />, color: "hover:text-blue-600" },
    { icon: <Twitter size={20} />, color: "hover:text-blue-400" },
    { icon: <Mail size={20} />, color: "hover:text-red-500" },
    { icon: <Github size={20} />, color: "hover:text-gray-800" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email && password) {
      const hashedCredentials = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

      try {
        const response = await fetch(`${API_URL}?filters[Email][$eq]=${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_TOKEN}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          const userData = result.data?.find((user) => user.Email === email);

          if (userData && userData.credentials === hashedCredentials) {
            if (rememberMe) {
              Cookies.set("userEmail", email, { expires: 7 }); 
              Cookies.set("userPassword", hashedCredentials, { expires: 7 });
            } else {
              Cookies.set("userEmail", email);
              Cookies.set("userPassword", hashedCredentials); 
            }

            alert("Login successful!");
            navigate("/admin"); 
          } else {
            alert("Invalid email or password!");
          }
        } else {
          const error = await response.json();
          alert(`Error: ${error.error?.message || "Something went wrong"}`);
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("Failed to log in. Please try again.");
      }
    } else {
      alert("Please enter your email and password!");
    }
  };

  return (
    <div className="flex items-center justify-center mt-24 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">Login using social networks</p>
          <div className="flex justify-center space-x-4 mb-4">
            {socialIcons.map((social, index) => (
              <a
                key={index}
                href="#"
                className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center transition-colors ${social.color}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <div className="relative flex items-center justify-center mb-4">
            <div className="border-t border-gray-300 absolute w-full"></div>
            <span className="bg-white px-4 text-gray-500 relative">OR</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-yellow-500 hover:text-yellow-600">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">No account?</p>
          <a href="/register" className="text-yellow-500 hover:text-yellow-600">
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
