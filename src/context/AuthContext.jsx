import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const getRoleFromToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded?.role || null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(getRoleFromToken(localStorage.getItem("token")));


  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    setRole(getRoleFromToken(token));
  }, [token]);


  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
  };


  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };


  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
