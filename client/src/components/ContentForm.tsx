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
      alert("Data successfully added: " + data);
      handleCloseButton();
    }
    console.log("Form Submitted", formData);
  };

  return (
    <div className="p-6 bg-[#1E1E1E] rounded-lg shadow-lg border border-[#242424] w-[350px] max-sm:w-[90vw] relative">
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-[#00FFAA] hover:text-[#FFD700] transition-colors duration-300"
        onClick={handleCloseButton}
      >
        <XCircleIcon className="h-6 w-6" />
      </button>

      {/* Form Title */}
      <h2 className="text-2xl font-bold text-[#FFD700] mb-6">Add Content</h2>

      {/* Formik Form */}
      <Formik
        initialValues={initialValues}
        onSubmit={handleContentCreation}
        validationSchema={ContentSchema}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="flex flex-col gap-4">
            {/* Content Type Field */}
            <div>
              <label
                htmlFor="contentType"
                className="text-[#00FFAA] font-medium"
              >
                Content Type
              </label>
              <Field
                as="select"
                id="contentType"
                name="contentType"
                className="w-full p-2 bg-[#242424] border border-[#00FFAA] rounded-md text-white focus:ring-2 focus:ring-[#FFD700] outline-none"
              >
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
              </Field>
              {errors.contentType && touched.contentType && (
                <div className="text-sm text-red-500">{errors.contentType}</div>
              )}
            </div>

            {/* Topic Field */}
            <div>
              <label htmlFor="topic" className="text-[#00FFAA] font-medium">
                Topic
              </label>
              <Field
                id="topic"
                name="topic"
                placeholder="Enter topic name"
                className="w-full p-2 bg-[#242424] border border-[#00FFAA] rounded-md text-white focus:ring-2 focus:ring-[#FFD700] outline-none"
              />
              {errors.topic && touched.topic && (
                <div className="text-sm text-red-500">{errors.topic}</div>
              )}
            </div>

            {/* File Upload Field */}
            <div>
              <label htmlFor="content" className="text-[#00FFAA] font-medium">
                Upload Content
              </label>
              <input
                id="content"
                name="content"
                type="file"
                className="w-full p-2 bg-[#242424] border border-[#00FFAA] rounded-md text-white focus:ring-2 focus:ring-[#FFD700] outline-none cursor-pointer"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0] || null;
                  setFieldValue("content", file);
                }}
              />
              {errors.content && touched.content && (
                <div className="text-sm text-red-500">{errors.content}</div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#00FFAA] text-black font-bold p-2 rounded-md shadow hover:bg-[#FFD700] transition-colors duration-300 mt-4"
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
