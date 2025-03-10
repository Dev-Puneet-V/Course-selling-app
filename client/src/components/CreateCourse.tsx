import { Field, Formik, Form, FormikHelpers } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { XCircleIcon } from "@heroicons/react/20/solid";
import api from "../utils/axios";
import { AxiosError } from "axios";
import { useSetRecoilState } from "recoil";
import { coursesState, courseOperations } from "../utils/atoms/info";
import {
  CourseFormData,
  ToastState,
  ApiResponse,
  Course,
} from "../types/course";
import LoadingSpinner from "./common/LoadingSpinner";
import Toast from "./common/Toast";

interface CreateCourseProps {
  handleCloseButton: () => void;
  onSuccess?: (message: string) => void;
}

const CourseSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),
  price: Yup.number()
    .min(0, "Price must be minimum 0")
    .required("Price is required"),
  description: Yup.string()
    .min(5, "Description must be minimum 5 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),
  course: Yup.mixed()
    .required("Thumbnail is required")
    .test("fileSize", "File size too large (max 5MB)", (value) => {
      if (!value) return true;
      return (value as File).size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Unsupported file type", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(
        (value as File).type
      );
    }),
});

const initialValues: CourseFormData = {
  name: "",
  price: 0,
  description: "",
  course: null,
};

const CreateCourse: React.FC<CreateCourseProps> = ({
  handleCloseButton,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  const setCourses = useSetRecoilState(coursesState);

  const handleCourseCreation = async (
    values: CourseFormData,
    { resetForm }: FormikHelpers<CourseFormData>
  ): Promise<void> => {
    setIsLoading(true);
    setToast({ show: false, message: "", type: "success" });

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price.toString());
    formData.append("description", values.description);
    if (values.course) {
      formData.append("course", values.course);
    }

    try {
      const response = await api.post<ApiResponse<Course>>(
        `/course`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200 && response.data?.data) {
        // Update Recoil state with new course
        setCourses((currentCourses) =>
          courseOperations.addCourse(currentCourses, response.data.data!)
        );

        const successMessage = "Course created successfully!";
        if (onSuccess) {
          onSuccess(successMessage);
        } else {
          setToast({
            show: true,
            message: successMessage,
            type: "success",
          });
          setTimeout(() => {
            handleCloseButton();
          }, 2000);
        }
        resetForm();
      }
    } catch (error) {
      let errorMessage = "Failed to create course. Please try again.";
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

  const handleToastClose = (): void => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className="p-6 relative w-[350px] max-sm:w-[90vw] max-sm:h-[90vh] bg-[#1E1E1E] rounded-lg">
      <button
        className="absolute top-4 right-4 text-[#00FFAA] hover:text-[#FFD700] transition-colors duration-300"
        onClick={handleCloseButton}
        type="button"
        aria-label="Close"
      >
        <XCircleIcon className="h-6 w-6" />
      </button>

      <h2 className="text-2xl font-bold text-[#FFD700] mb-6">Create Course</h2>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
        />
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={CourseSchema}
        onSubmit={handleCourseCreation}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="text-[#00FFAA] font-medium">
                Course Name
              </label>
              <Field
                id="name"
                name="name"
                type="text"
                placeholder="Enter course name"
                className="w-full p-2 bg-[#242424] border border-[#00FFAA] rounded-md text-white focus:ring-2 focus:ring-[#FFD700] outline-none"
              />
              {errors.name && touched.name && (
                <div className="text-sm text-red-500">{errors.name}</div>
              )}
            </div>

            <div>
              <label htmlFor="price" className="text-[#00FFAA] font-medium">
                Price
              </label>
              <Field
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter price"
                className="w-full p-2 bg-[#242424] border border-[#00FFAA] rounded-md text-white focus:ring-2 focus:ring-[#FFD700] outline-none"
              />
              {errors.price && touched.price && (
                <div className="text-sm text-red-500">{errors.price}</div>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="text-[#00FFAA] font-medium"
              >
                Description
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                placeholder="Enter description"
                className="w-full p-2 bg-[#242424] border border-[#00FFAA] rounded-md text-white focus:ring-2 focus:ring-[#FFD700] outline-none resize-none h-24"
              />
              {errors.description && touched.description && (
                <div className="text-sm text-red-500">{errors.description}</div>
              )}
            </div>

            <div>
              <label
                htmlFor="course-file"
                className="text-[#00FFAA] font-medium"
              >
                Course Thumbnail
              </label>
              <input
                id="course-file"
                name="course"
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0] || null;
                  setFieldValue("course", file);
                }}
                className="w-full p-2 bg-[#242424] border border-[#00FFAA] rounded-md text-white focus:ring-2 focus:ring-[#FFD700] outline-none cursor-pointer"
              />
              {errors.course && touched.course && (
                <div className="text-sm text-red-500">{errors.course}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#00FFAA] text-black font-bold p-3 rounded-lg shadow hover:bg-[#FFD700] transition-all duration-300 mt-4 relative ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Creating Course...</span>
                </div>
              ) : (
                "Create Course"
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateCourse;
