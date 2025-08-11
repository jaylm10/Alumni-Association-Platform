import { useState } from "react";
import UserTypeselection from "./pages/UserTypeselection";
import Register from "./pages/Register";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import JobBoard from "./pages/JobBoard";
import EventsPage from "./pages/EventsPage";


function App() {
  return (
    <>
    
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/userTypeSelection" element={<UserTypeselection />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Jobs" element={<JobBoard />} />
          <Route path="/Events" element={<EventsPage />} />
        </Routes>

    </>
  );
}

export default App;
