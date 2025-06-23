import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        // This endpoint should return user info if session is alive, or 401 if not
        const response = await axios.get(`${API_URL}/auth/session`, { withCredentials: true });
        if (response.data && response.data.userId) {
          // Session is alive, navigate to user page
          navigate(`/${response.data.userId}/notes`);
        } else {
          // User does not exist, navigate to signup
          navigate("/signup");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Session expired, navigate to login
          navigate("/login");
        } else if (error.response && error.response.status === 404) {
          // User does not exist, navigate to signup
          navigate("/signup");
        } else {
          // Fallback: navigate to login
          navigate("/login");
        }
      }
    };
    checkSession();
  }, [navigate]);

  return null;
};

export default AuthRedirect;