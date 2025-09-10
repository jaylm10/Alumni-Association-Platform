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
import MessagesPage from "./pages/MessagesPage";
import Students from "./pages/Students";
import About from "./pages/About";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userTypeSelection" element={<UserTypeselection />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/students" element={<Students/>}/>
        <Route path="/alumni-profile" element={<AlumniProfile />} />
        <Route path="/alumni" element={<ProtectedRoutes><Alumni /></ProtectedRoutes>} />
        <Route path="/alumni/:alumniId" element={<AlumniPublicProfile />} />
        <Route path="/about" element={<About />} />
        {/* --- ADD THIS NEW ROUTE --- */}
        <Route path="/messages" element={<MessagesPage/>} />
        {/* Optional: A route to open a specific chat directly */}
        <Route path="/messages/:conversationId" element={<MessagesPage />} />
        <Route
          path="/Jobs"
          element={
            <ProtectedRoutes>
              <JobBoard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/Events"
          element={
            <ProtectedRoutes>
              <EventsPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/post-job"
          element={
            <ProtectedRoutes>
              <PostJob />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </>
  );
}

export default App;
