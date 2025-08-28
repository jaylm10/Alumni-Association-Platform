import { useState } from "react";
import UserTypeselection from "./pages/UserTypeselection";
import Register from "./pages/Register";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import JobBoard from "./pages/JobBoard";
import EventsPage from "./pages/EventsPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PostJob from "./pages/PostJob";
import AlumniProfile from "./pages/AlumniProfile";


function App() {
  return (
    <>
    
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/userTypeSelection" element={<UserTypeselection/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<AlumniProfile/>} />
          <Route path="/Jobs" element={<ProtectedRoutes><JobBoard/></ProtectedRoutes>} />
          <Route path="/Events" element={<ProtectedRoutes><EventsPage/></ProtectedRoutes>} />
          <Route path="/post-job" element={<ProtectedRoutes><PostJob/></ProtectedRoutes>} />
        </Routes>

    </>
  );
}

export default App;
