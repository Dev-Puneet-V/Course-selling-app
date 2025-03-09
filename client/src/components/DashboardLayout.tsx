import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
