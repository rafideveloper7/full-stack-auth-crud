import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create and export the context
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

      console.log("📥 Login response:", response.data);

      if (response.data.token) {
        // Store the token as-is
        localStorage.setItem("token", response.data.token);
        
        // Extract user from token
        const userData = extractUserFromToken(response.data.token);
        
        // 👉 IMPORTANT: Response se bhi user data le sakte ho
        if (response.data.user) {
          userData.profileImage = response.data.user.profileImage || userData.profileImage;
        }
        
        console.log("👤 User data after login:", userData);
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
      
      console.log("📤 Sending registration data:", userData);

      const response = await axios.post(
        `${API_BASE_URL}/api/user/register`,
        userData,
        { headers: { "Content-Type": "application/json" } },
      );

      console.log("📥 Register response:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        
        // Extract user from token
        const userFromToken = extractUserFromToken(response.data.token);
        
        // 👉 IMPORTANT: Response se bhi user data le lo
        if (response.data.user) {
          userFromToken.profileImage = response.data.user.profileImage || userFromToken.profileImage;
        }
        
        console.log("👤 User data after register:", userFromToken);
        setUser(userFromToken);
        
        setTimeout(() => navigate("/"), 0);
        return { success: true, user: userFromToken };
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
      console.log("🎫 Decoded token payload:", payload);
      
      // Return user object with all fields
      return {
        id: payload.id || payload._id || payload.userId,
        name: payload.name || '',
        email: payload.email || '',
        profileImage: payload.profileImage || '',  // 👈 Explicitly get profileImage
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
            console.log("👤 User restored from token:", userData);
            setUser(userData);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Auth check error:", error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // 👉 Debug user state changes
  useEffect(() => {
    console.log("🔄 AuthContext user updated:", user);
  }, [user]);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    getToken,
    authHeader,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};