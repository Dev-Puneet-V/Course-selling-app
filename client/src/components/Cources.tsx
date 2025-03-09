import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import authState from "../utils/atoms/auth";
import AdminCources from "./AdminCources";
import UserCources from "./UserCources";

const Cources: React.FC = () => {
  const authenticationData = useRecoilValue(authState);
  return (
    <div>
      {authenticationData?.user?.role === "admin" ? (
        <AdminCources />
      ) : (
        <UserCources />
      )}
    </div>
  );
};

export default Cources;
