import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Unauthorized() {
  const { userRole } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">403 Forbidden</h1>
        <p className="mt-4 text-lg text-gray-700">
          You do not have permission to access this page.
        </p>

        {userRole === "user" && (
          <p>
            <Link to="/" className="text-blue-500 hover:underline">
              Go to Home
            </Link>
          </p>
        )}
        {userRole === "admin" && (
          <p>
            <Link to="/admin" className="text-blue-500 hover:underline">
              Go to Admin Dashorad
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
