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
import StudentProfile from "./pages/StudentProfile";
import Alumni from "./pages/Alumni";
import AlumniPublicProfile from "./pages/AlumniPublicProfile";


function App() {
  return (
    <>
    
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/userTypeSelection" element={<UserTypeselection/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student-profile" element={<StudentProfile/>} />
          <Route path="/alumni-profile" element={<AlumniProfile/>} />
          <Route path="/alumni" element={<Alumni/>} />
          <Route path="/alumni/:alumniId" element={<AlumniPublicProfile />} />
          <Route path="/Jobs" element={<ProtectedRoutes><JobBoard/></ProtectedRoutes>} />
          <Route path="/Events" element={<ProtectedRoutes><EventsPage/></ProtectedRoutes>} />
          <Route path="/post-job" element={<ProtectedRoutes><PostJob/></ProtectedRoutes>} />
        </Routes>

    </>
  );
}

export default App;
