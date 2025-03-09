import axios from "axios";
import React, { Suspense, useEffect, useState } from "react";
import AdminCourse from "./AdminCourse";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { adminCourcesSelector } from "../utils/atoms/info";

const AdminCources: React.FC = () => {
  const data = useRecoilValue(adminCourcesSelector);

  return (
      <div className="flex flex-wrap gap-4 m-8">
        {data?.map((course: any) => {
          return <AdminCourse {...course} />;
        })}
      </div>
  );
};

export default AdminCources;
