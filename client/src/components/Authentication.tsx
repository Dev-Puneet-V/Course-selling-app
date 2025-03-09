import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { XCircleIcon } from "@heroicons/react/20/solid";
import * as Yup from "yup";
import { useRecoilState } from "recoil";
import authState from "../utils/atoms/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Too Short!")
    .max(15, "Too Long!")
    .required("Required"),
  password: Yup.string()
    .matches(passwordRules, { message: "Please create a stronger password" })
    .required("Password is required"),
  email: Yup.string().email("Invalid email").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Required"),
  role: Yup.string()
    .oneOf(["admin", "user"], "Invalid role")
    .required("Role is required"),
});

interface MyFormValues {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: "admin" | "user";
}

const Authentication: React.FC = () => {
  const [authenticationData, setAuthenticationData] = useRecoilState(authState);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState<boolean>(
    authenticationData?.authenticationFormState.state === "signin"
  );
  const initialValues: MyFormValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  };

  const handleCloseButton = () => {
    setAuthenticationData((prev) => ({
      ...prev,
      authenticationFormState: {
        isVisible: false,
        state: null,
      },
    }));
  };

  const handleAuthentication = async (values: MyFormValues) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/user/${isLogin ? "signin" : "signup"}`,
        values,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      const status = response.status;
      if (status === 200) {
        if (!isLogin) {
          setIsLogin(true);
        } else {
          setAuthenticationData((prev) => ({
            ...prev,
            isAuthenticated: true,
            authenticationFormState: {
              isVisible: false,
              state: null,
            },
            user: data?.data,
          }));
          navigate("/course/explore");
        }
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#121212] bg-opacity-80 z-50">
      <div className="bg-[#1E1E1E] p-8 rounded-xl shadow-lg border border-[#242424] w-96 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-[#00FFAA] hover:text-[#FFD700] transition-colors duration-300"
          onClick={handleCloseButton}
        >
          <XCircleIcon className="h-6 w-6" />
        </button>

        {/* Form Title */}
        <h2 className="text-2xl font-bold text-[#FFD700] mb-6 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => handleAuthentication(values)}
          validationSchema={!isLogin ? SignupSchema : undefined}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col gap-4">
              {/* Name Field (for Sign Up) */}
              {!isLogin && (
                <>
                  <label htmlFor="name" className="text-[#00FFAA] font-medium">
                    Full Name
                  </label>
                  <Field
                    id="name"
                    name="name"
                    placeholder="Enter full name"
                    className="p-2 bg-[#242424] border border-[#00FFAA] rounded-md text-white focus:ring-2 focus:ring-[#FFD700] outline-none"
                  />
                  {errors.name && touched.name && (
                    <div className="text-sm text-red-500">{errors.name}</div>
                  )}
                </>
              )}

              {/* Email Field */}
              <label htmlFor="email" className="text-[#00FFAA] font-medium">
                Email
              </label>
              <Field
                id="email"
                name="email"
                placeholder="Enter email"
                className="p-2 bg-[#242424] border border-[#00FFAA] rounded-md text-white focus:ring-2 focus:ring-[#FFD700] outline-none"
                type="email"
              />
              {errors.email && touched.email && (
                <div className="text-sm text-red-500">{errors.email}</div>
              )}

              {/* Password Field */}
              <label htmlFor="password" className="text-[#00FFAA] font-medium">
                Password
              </label>
              <Field
                id="password"
                name="password"
                placeholder="Enter password"
                className="p-2 bg-[#242424] border border-[#00FFAA] rounded-md text-white focus:ring-2 focus:ring-[#FFD700] outline-none"
                type="password"
              />
              {errors.password && touched.password && (
                <div className="text-sm text-red-500">{errors.password}</div>
              )}

              {/* Confirm Password Field (for Sign Up) */}
              {!isLogin && (
                <>
                  <label
                    htmlFor="confirmPassword"
                    className="text-[#00FFAA] font-medium"
                  >
                    Confirm Password
                  </label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className="p-2 bg-[#242424] border border-[#00FFAA] rounded-md text-white focus:ring-2 focus:ring-[#FFD700] outline-none"
                    type="password"
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="text-sm text-red-500">
                      {errors.confirmPassword}
                    </div>
                  )}
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#00FFAA] text-black font-bold p-2 rounded-md shadow hover:bg-[#FFD700] hover:text-black transition-colors duration-300 mt-4"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Toggle Between Login and Sign Up */}
        <p className="text-center text-sm mt-4 text-gray-300">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="text-[#00FFAA] font-medium ml-1 hover:underline cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Authentication;
