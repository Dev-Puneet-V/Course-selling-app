import React, { useState } from "react";
import {
  UsersIcon,
  CurrencyDollarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import axios, { AxiosError } from "axios";
import { coursesState, courseOperations } from "../utils/atoms/info";
import { Course, ToastState } from "../types/course";
import Modal from "./Modal";
import Toast from "./common/Toast";
import LoadingSpinner from "./common/LoadingSpinner";

interface AdminCourseProps {
  course: Course;
}

const AdminCourse: React.FC<AdminCourseProps> = ({ course }) => {
  const [isConfirmModalVisible, setConfirmModalVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  const navigate = useNavigate();
  const setCourses = useSetRecoilState(coursesState);

  const handleClick = () => {
    navigate("/course/watch/" + course?._id);
  };

  const handleDeleteCourse = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/course/${course._id}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // Update Recoil state by removing the deleted course
        setCourses((currentCourses) =>
          courseOperations.removeCourse(currentCourses, course._id)
        );

        setToast({
          show: true,
          message: "Course deleted successfully",
          type: "success",
        });

        setTimeout(() => {
          setConfirmModalVisibility(false);
        }, 2000);
      }
    } catch (error) {
      let errorMessage = "Failed to delete course. Please try again.";
      if (error instanceof AxiosError && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setToast({
        show: true,
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className="max-w-sm mx-auto shadow-lg rounded-2xl overflow-hidden bg-[#1E1E1E] border border-[#242424]">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
        />
      )}

      {/* Course Image */}
      <img
        src={course.image.url}
        alt={course.name}
        width={300}
        height={250}
        className="w-full h-48 object-cover"
      />

      {/* Course Details */}
      <div className="p-4">
        <div className="flex justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#FFD700] mb-2">
              {course.name}
            </h2>
            <p className="text-gray-400 mb-4 text-sm">{course.description}</p>
          </div>
          <TrashIcon
            className="w-5 h-5 text-red-400 hover:text-red-500 cursor-pointer mt-2"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmModalVisibility(true);
            }}
          />
        </div>

        {/* Price and Subscribers */}
        <div className="flex items-center justify-between mb-4 text-gray-400">
          <div className="flex items-center gap-2">
            <CurrencyDollarIcon className="w-5 h-5 text-[#00FFAA]" />
            <span className="text-lg font-medium">${course.price}</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-[#00FFAA]" />
            <span className="text-sm">
              {course.subscribers.length} Subscribers
            </span>
          </div>
        </div>

        {/* Detailed View Button */}
        <button
          className="cursor-pointer w-full bg-[#00FFAA] hover:bg-[#FFD700] text-black py-2 rounded-lg font-medium transition-colors duration-300"
          onClick={handleClick}
        >
          Detailed View
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isConfirmModalVisible}>
        <div className="rounded p-4 bg-[#1E1E1E] text-white border border-[#242424]">
          <p className="font-bold text-lg pb-4 text-[#FFD700]">
            You are proceeding to delete a course. Press{" "}
            <strong className="text-[#00FFAA]">Confirm</strong> to agree.
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleDeleteCourse}
              disabled={isLoading}
              className={`hover:opacity-80 cursor-pointer bg-red-500 text-white rounded font-bold w-[100px] p-2 transition-colors duration-300 flex items-center justify-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : "Confirm"}
            </button>
            <button
              onClick={() => setConfirmModalVisibility(false)}
              disabled={isLoading}
              className="hover:opacity-80 cursor-pointer border border-[#00FFAA] text-[#00FFAA] rounded font-bold w-[100px] p-2 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCourse;
