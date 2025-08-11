// contexts/AuthContextProvider.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  // Load role from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  // Save role to localStorage whenever it changes
  const updateRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem("role", newRole);
  };

  // Clear role on logout (optional utility)
  const clearRole = () => {
    setRole(null);
    localStorage.removeItem("role");
    localStorage.removeItem("token"); // clear token too if needed
  };

  return (
    <AuthContext.Provider value={{ role, setRole: updateRole, clearRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
