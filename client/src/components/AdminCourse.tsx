import React, { useEffect, useState } from "react";
import {
  UsersIcon,
  CurrencyDollarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import axios from "axios";

type Course = {
  _id: string;
  image: {
    url: string;
  };
  name: string;
  price: number;
  subscribers: string[];
  description: string;
};

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const [isConfirmModalVisible, setConfirmModalVisibility] =
    useState<boolean>(false);
    const navigate = useNavigate();
  const handleClick = () => {
    navigate("/course/watch/" + course?._id);
  };
  const handleDeleteCourse = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/course/${course._id}`,
        {
          withCredentials: true
        }
      );
      if (response.status !== 200) {
        throw new Error(response?.data?.message);
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    } finally {
      setConfirmModalVisibility(false);
      navigate("/home");
    }
  };
  return (
    <div className="max-w-sm mx-auto shadow-lg rounded-2xl overflow-hidden bg-white border border-gray-200">
      <img
        src={course.image.url}
        alt={course.name}
        width={300}
        height={250}
        className="w-full h-42 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {course.name}
            </h2>
            <p className="text-gray-600 mb-4 text-sm">{course.description}</p>
          </div>
          <TrashIcon
            className="w-5 h-5 text-red-400 hover:text-red-500 cursor-pointer mt-2"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmModalVisibility(true);
            }}
          />
        </div>
        <div className="flex items-center justify-between mb-4 text-gray-700">
          <div className="flex items-center gap-2">
            <CurrencyDollarIcon className="w-5 h-5 text-green-500" />
            <span className="text-lg font-medium">${course.price}</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-blue-500" />
            <span className="text-sm">
              {course.subscribers.length} Subscribers
            </span>
          </div>
        </div>
        <button
          className="cursor-pointer w-full bg-[#423737] hover:opacity-50 hover:text-white text-white py-2 rounded-lg font-medium"
          onClick={handleClick}
        >
          Detailed view
        </button>
      </div>
      <Modal isOpen={isConfirmModalVisible}>
        <div className="rounded p-2 text-black">
          <p className="font-bold text-lg pb-4">
            You are proceding to delete a course, Press <strong>confirm</strong>{" "}
            to agree
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleDeleteCourse}
              className="hover:opacity-50 cursor-pointer bg-red-500 text-white rounded font-bold w-[100px] p-2"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setConfirmModalVisibility(false);
              }}
              className="hover:opacity-50 cursor-pointer border border-[black] rounded font-bold w-[100px] p-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const AdminCourse: React.FC<Course> = (props) => {
  const course: Course = { ...props };
  return <CourseCard course={course} />;
};

export default AdminCourse;
