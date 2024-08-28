import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ Component }) {
  const token = JSON.parse(localStorage.getItem("token"));

  return token ? <Component /> : <Navigate to="/" />;
}

export default ProtectedRoute;
