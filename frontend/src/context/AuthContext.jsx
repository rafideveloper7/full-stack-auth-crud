import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create context
export const AuthContext = createContext(null);


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get token from localStorage
  const getToken = () => {
    const token = localStorage.getItem("token");
    return token || null;
  };

  // Setting auth header
  const authHeader = () => {
    const token = getToken();
    return {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    };
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(
        `${API_BASE_URL}/api/user/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        const userData = extractUserFromToken(response.data.token);
        setUser(userData);
        setTimeout(() => navigate("/"), 0);
        return { success: true, user: userData };
      }
      return { success: false, error: "Invalid response from server" };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post(
        `${API_BASE_URL}/api/user/register`,
        userData,
        { headers: { "Content-Type": "application/json" } },
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        const userData = extractUserFromToken(response.data.token);
        setUser(userData);
        setTimeout(() => navigate("/"), 0);
        return { success: true, user: userData };
      }
      return { success: false, error: "Invalid response from server" };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  // Extract user from token
  const extractUserFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.id || payload._id || payload.userId,
        name: payload.name,
        email: payload.email,
        profileImage: payload.profileImage || '',
      };
    } catch (error) {
      console.error("Error parsing token:", error);
      return null;
    }
  };

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const userData = extractUserFromToken(token);
          if (userData?.id) {
            setUser(userData);
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await axios.put(
        `${API_BASE_URL}/api/user/profile`,
        profileData,
        authHeader()
      );

      if (response.data.isSuccess) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          const userData = extractUserFromToken(response.data.token);
          setUser(userData);
        }
        return { success: true, user: response.data.user };
      }
      return { success: false, error: response.data.message || "Update failed" };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Profile update failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    getToken,
    authHeader,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};