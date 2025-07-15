import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../images/register.jpg";
import { FaGoogle } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import "../pages/Login.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  auth,
  googleProvider,
  facebookProvider,
  signInWithPopup,
} from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);

      const token = response.data.token;
      localStorage.setItem("token", token);

      console.log("Login successful:", response.data);
      toast.success("Login Successful");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);
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
