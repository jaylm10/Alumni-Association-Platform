import React , { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import "../pages/Register.css";
import registerImg from "../images/register.jpg"
import { FaGoogle } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const Register = () => {
    const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const location = useLocation();
   const navigate = useNavigate();
   
  //  const userType = location.state?.userType || null;
   
   
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:3000/api/register", {
      name,
      email,
      password
    });

    console.log("Registration successful:", response.data);
    toast.success("User Registered Successfully")
    setTimeout(()=>{
      navigate("/login"); 
    },3000)
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};

  return (
    <>
      <div className="signup-container">
      <div className="signup-form">
       
        <h1 className="title">Register</h1>

        <form className="form" onSubmit={handleSubmit}>
          <input
            type="name"
            placeholder="Name"
            className="input-field"
            required value={name} onChange={(e)=>setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            className="input-field"
            required value={email} onChange={(e)=>setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            required value={password} onChange={(e)=>setPassword(e.target.value)}
          />
          <button type="submit" className="submit-btn">Sign Up</button>
        </form>

        <div className="login-link">
          <p>
            Already have an account? <Link to="/login" className="link">Log In</Link>
          </p>
        </div>

        <div className="signup-options">
          <button className="google-btn">
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
        <img src={registerImg} alt="Register Page Image" className="project-image" />
      </div>
    </div>
    <ToastContainer/>
  
    </>
  )
}

export default Register
