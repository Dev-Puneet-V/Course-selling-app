import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { coursesState } from "../utils/atoms/info";
import { Course } from "../types/course";
import AdminCourse from "./AdminCourse";
import LoadingSpinner from "./common/LoadingSpinner";
import Toast from "./common/Toast";
import { AxiosError } from "axios";
import { ApiResponse } from "../types/course";
import api from "../utils/axios";

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useRecoilState<Course[]>(coursesState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get<ApiResponse<Course[]>>(`/user/cources`);

        if (!response.data?.data) {
          throw new Error("No data received from server");
        }

        setCourses(response.data.data);
      } catch (error) {
        let errorMessage = "Failed to load courses. Please try again.";
        if (error instanceof AxiosError && error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []); // Only fetch on component mount

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Toast message={error} type="error" onClose={() => setError(null)} />
        <div className="flex justify-center items-center min-h-[50vh] text-red-500">
          Failed to load courses. Please try again.
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 m-8">
      {courses.length === 0 ? (
        <div className="w-full text-center text-gray-400 py-8">
          No courses found. Create your first course!
        </div>
      ) : (
        courses.map((course) => (
          <AdminCourse key={course._id} course={course} />
        ))
      )}
    </div>
  );
};

export default AdminCourses;
