import { Field, Formik, Form } from "formik";
import React from "react";
import * as Yup from "yup";
import { XCircleIcon } from "@heroicons/react/20/solid";
import axios from "axios";

interface CourseInitial {
  name: string;
  price: number;
  description: string;
  course: File | null;
}

interface CreateCourseProps {
  handleCloseButton: () => void;
}

const CourseSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  price: Yup.number()
    .min(0, "Price must be minimum 0")
    .required("Price is required"),
  description: Yup.string()
    .min(5, "Description must be minimum 5 characters")
    .required("Description is required"),
  course: Yup.mixed().nullable().required("Attachment is required"),
});

const CreateCourse: React.FC<CreateCourseProps> = ({ handleCloseButton }) => {
  const initialValues: CourseInitial = {
    name: "",
    price: 0,
    description: "",
    course: null,
  };

  const handleCourseCreation = async (values: CourseInitial) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price.toString());
    formData.append("description", values.description);
    if (values.course) {
      formData.append("course", values.course);
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/course`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        console.log("Course created successfully:", response.data);
        handleCloseButton();
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className="p-4 relative w-[300px] max-sm:w-[100vw] max-sm:h-[100vh]">
      <button
        className="absolute top-1 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
        onClick={handleCloseButton}
      >
        <XCircleIcon className="h-6 w-6" />
      </button>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => handleCourseCreation(values)}
        validationSchema={CourseSchema}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="flex flex-col gap-3">
            <label htmlFor="name" className="font-medium">
              Course Name
            </label>
            <Field
              id="name"
              name="name"
              placeholder="Enter full name"
              className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            />
            {errors.name && touched.name && (
              <div className="text-[12px] text-red-500">{errors.name}</div>
            )}

            <label htmlFor="price" className="font-medium">
              Price
            </label>
            <Field
              id="price"
              name="price"
              placeholder="Enter price of course"
              className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              type="number"
            />
            {errors.price && touched.price && (
              <div className="text-[12px] text-red-500">{errors.price}</div>
            )}

            <label htmlFor="description" className="font-medium">
              Description
            </label>
            <Field
              id="description"
              name="description"
              className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              placeholder="Enter description"
            />
            {errors.description && touched.description && (
              <div className="text-[12px] text-red-500">
                {errors.description}
              </div>
            )}

            <label htmlFor="course-file" className="font-medium">
              Course File
            </label>
            <input
              id="course-file"
              name="course"
              type="file"
              className="cursor-pointer p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0] || null;
                setFieldValue("course", file);
              }}
            />
            {errors.course && touched.course && (
              <div className="text-[12px] text-red-500">{errors.course}</div>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white font-bold p-2 rounded-md shadow hover:bg-blue-700 mt-4 cursor-pointer"
            >
              Create course
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateCourse;
