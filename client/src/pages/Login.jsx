import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../images/register.jpg";
import { FaGoogle, FaApple, FaFacebook } from "react-icons/fa";
import "../pages/Login.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  auth,
  googleProvider,
  signInWithPopup,
} from "../firebase";
import { AuthContext } from "../contexts/AuthContextProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setRole } = useContext(AuthContext);

  // Email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // Store token & role
      localStorage.setItem("token", data.token);
      setRole(data.role);

      toast.success("Login Successful");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Send Google account to backend
      const { data } = await axios.post(
        "http://localhost:3000/api/google-auth",
        { name: user.displayName, email: user.email },
        { headers: { "Content-Type": "application/json" } }
      );

      // Store token & role
      localStorage.setItem("token", data.token);
      if (data.role) {
        setRole(data.role);
      } else {
        // If role not directly sent, decode it from token
        const decoded = JSON.parse(atob(data.token.split(".")[1]));
        setRole(decoded.role);
      }

      toast.success("Logged in with Google");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google login failed");
    }
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-form">
          <h1 className="title">Log In</h1>

          <form className="form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email Address"
              className="input-field"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="submit-btn">
              Sign In
            </button>
          </form>

          <div className="login-link">
            <p>
              Don't have an account yet?{" "}
              <Link to="/userTypeSelection" className="link">
                Register
              </Link>
            </p>
          </div>

          <div className="signup-options">
            <button className="google-btn" onClick={handleGoogleLogin}>
              <FaGoogle className="icon-spacing" />
              Continue with Google
            </button>
            <button className="apple-btn">
              <FaApple className="icon-spacing" />
              Continue with Apple
            </button>
            <button className="facebook-btn">
              <FaFacebook className="icon-spacing" />
              Continue with Facebook
            </button>
          </div>
        </div>

        <div className="image-container">
          <img
            src={loginImg}
            alt="Login Page Image"
            className="project-image"
          />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
