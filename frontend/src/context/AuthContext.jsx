import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ColorModeContext } from "./ThemeContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userLogginApi, profilefetch } from "../service/UserAuthApi";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const { mode, colorMode } = useContext(ColorModeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState({});

    const {
      isLoading,
      data: user,
      error,
    } = useQuery({ queryKey: ["userProfile"], queryFn: profilefetch,
    onError:()=>{
      toast.error("fetching profile failed .");

    }
    });

    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: profilefetch,
      onSuccess: () => {
        queryClient.invalidateQueries("userProfile");
      },
    });

    useEffect(() => {
      const initializeAuth = () => {
        setLoading(isLoading);
        if (!isLoading)
          if (user) {
            setUserProfile(user);
            setIsAuthenticated(true);
            setUserRole(user.role);
            setUsername(user.username);
          } else {
            setIsAuthenticated(false);
            setUserRole(null);
          }
      };
      initializeAuth();
    }, [isLoading, user, error]);

    const logout = () => {
      if (mode === "dark") colorMode.toggleColorMode();
      localStorage.removeItem("theme-mode");
      localStorage.removeItem("accessToken");
      navigate("/login", { replace: true, state: null });
    };

    const handleSubmit = async (values) => {
      try {
        await userLogginApi(values);
        const profile = await mutation.mutateAsync();
        toast.success('welcome')
        const from =
          location.state?.from?.pathname || profile.role === "admin"
            ? "/admin"
            : "/";
        navigate(from, { replace: true });
      } catch (error) {
        toast.error("Login failed. Please check your credentials and try again.");
      }
    };


    return (
      <AuthContext.Provider
        value={{
          isAuthenticated,
          userProfile,
          userRole,
          username,
          loading,
          logout,
          handleSubmit,
        }}
      >
        {children}
      </AuthContext.Provider>
    );

}



export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("out of boundary context");
  }
  return context;
};
