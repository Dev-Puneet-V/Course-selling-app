import React, { useEffect, useState } from "react";
import UserCourse from "./UserCource";
import { useParams } from "react-router-dom";
import api from "../utils/axios";

const UserCources: React.FC = () => {
  const [data, setData] = useState([]);
  const { type } = useParams();

  const fetchData = async () => {
    try {
      const response = await api.get(
        `/course/all?type=${type === "explore" ? "unpurchased" : "me"}`
      );
      if (response.status === 200) {
        console.log(response.data?.data);
        setData(response.data?.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  return (
    <div className="flex flex-wrap gap-4 m-8">
      {data?.map((course: any) => {
        return <UserCourse {...course} key={course._id} />;
      })}
    </div>
  );
};

export default UserCources;
