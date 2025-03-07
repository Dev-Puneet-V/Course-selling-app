import React, { useState } from "react";
import UserCources from "./UserCources";
import { useNavigate } from "react-router-dom";
const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex relative">
      <div className="flex flex-col gap-2 bg-[#423737] text-white w-[200px] h-[90vh]">
        <div
          onClick={() => navigate("/course/explore")}
          className="text-center p-2 hover:bg-[#E6D6CE] w-full border-b-1 hover:border-l-4 hover:border-brown cursor-pointer hover:font-bold hover:text-black"
        >
          Cources
        </div>
        <div
          onClick={() => navigate("/course/me")}
          className="text-center p-2 hover:bg-[#E6D6CE] w-full border-b-1 hover:border-l-4 hover:border-brown cursor-pointer hover:font-bold hover:text-black"
        >
          purchases
        </div>
      </div>
      <div className="h-[90vh] overflow-y-auto">
        <UserCources />
      </div>
    </div>
  );
};

export default UserDashboard;
