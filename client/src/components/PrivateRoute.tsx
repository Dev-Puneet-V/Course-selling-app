import { useRecoilValue } from "recoil";
import authState from "../utils/atoms/auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import React from "react";

const PrivateRoute: React.FC = () => {
  const location = useLocation();
  const authenticationData = useRecoilValue(authState);

  if (location.pathname === "/" && authenticationData?.isAuthenticated) {
    return <Navigate to={"/home"} replace />;
  }

  if (!authenticationData?.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default PrivateRoute;
