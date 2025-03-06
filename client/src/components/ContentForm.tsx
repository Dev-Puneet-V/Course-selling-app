import { XCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";

interface Content {
  contentType: "video" | "pdf";
  topic: string;
  content: File | null;
}

type ContentFormType = {
  handleCloseButton: () => void;
  id: string;
};

const ContentSchema = Yup.object().shape({
  contentType: Yup.string()
    .oneOf(["video", "pdf"], "Invalid content type")
    .required("Content type is required"),
  topic: Yup.string()
    .min(3, "Topic must be at least 3 characters")
    .required("Topic is required"),
  content: Yup.mixed().nullable().required("File is required"),
  // .test("fileSize", "File size too large (max 5MB)", (value) =>
  //   value ? (value as File).size <= 5 * 1024 * 1024 : true
  // ),
});

const ContentForm: React.FC<ContentFormType> = (props) => {
  const { handleCloseButton, id } = props;
  const initialValues: Content = {
    contentType: "video",
    topic: "",
    content: null,
  };

  const handleContentCreation = async (values: Content) => {
    const formData = new FormData();
    formData.append("contentType", values?.contentType);
    formData.append("topic", values?.topic);
    if (values?.content) {
      formData.append("content", values?.content);
    }

    const response = await axios.post(
      `http://localhost:3000/api/v1/course/${id}/content`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    const data = response.data;
    const status = response.status;
    if (status === 200) {
      alert("Data successfully added : " + data);
      handleCloseButton();
    }
    console.log("Form Submitted", formData);
  };

  return (
    <div className="p-4 relative w-[350px] max-sm:w-[100vw] max-sm:h-[100vh]">
      <button
        className="absolute top-1 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
        onClick={handleCloseButton}
      >
        <XCircleIcon className="h-6 w-6" />
      </button>
      <Formik
        initialValues={initialValues}
        onSubmit={handleContentCreation}
        validationSchema={ContentSchema}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="flex flex-col gap-3">
            <label htmlFor="contentType" className="font-medium">
              Content Type
            </label>
            <Field
              as="select"
              id="contentType"
              name="contentType"
              className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            >
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
            </Field>
            {errors.contentType && touched.contentType && (
              <div className="text-[12px] text-red-500">
                {errors.contentType}
              </div>
            )}

            <label htmlFor="topic" className="font-medium">
              Topic
            </label>
            <Field
              id="topic"
              name="topic"
              placeholder="Enter topic name"
              className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            />
            {errors.topic && touched.topic && (
              <div className="text-[12px] text-red-500">{errors.topic}</div>
            )}

            <label htmlFor="content" className="font-medium">
              Upload Content
            </label>
            <input
              id="content"
              name="content"
              type="file"
              className="cursor-pointer p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0] || null;
                setFieldValue("content", file);
              }}
            />
            {errors.content && touched.content && (
              <div className="text-[12px] text-red-500">{errors.content}</div>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white font-bold p-2 rounded-md shadow hover:bg-blue-700 mt-4 cursor-pointer"
            >
              Upload Content
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContentForm;
