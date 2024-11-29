import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Spinner } from "@material-tailwind/react";

import { useAuth } from "../../context/AuthContext";


export default function ProtectedRoute({ role }) {
  const { isAuthenticated,loading,userRole} = useAuth();
  const location = useLocation();
  if (loading) {
    return <div className=" h-[100vh] flex justify-center items-center flex-col "><Spinner className=" w-[20rem]"/>
    <p>loading...</p></div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace={true} state={{ from: location }} />;
  }

  if (userRole !== role) {
    return <Navigate to="/unauthorized" replace={true} />;
  }

  return <Outlet />;
}
