import axios from "axios";
import React, { useEffect, useState } from "react";
import UserCourse from "./UserCource";
import { useParams } from "react-router-dom";

const UserCources: React.FC = () => {
  const [data, setData] = useState([]);

  const { type } = useParams();
  const fetchData = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/v1/course/all?type=${
        type === "explore" ? "unpurchased" : "me"
      }`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseData = response.data;
    const status = response.status;
    if (status === 200) {
      console.log(responseData?.data);
      setData(responseData?.data);
    }
  };
  useEffect(() => {
    fetchData();
  }, [type]);
  return (
    <div className="flex flex-wrap gap-4 m-8">
      {data?.map((course: any) => {
        return <UserCourse {...course} />;
      })}
    </div>
  );
};

export default UserCources;
