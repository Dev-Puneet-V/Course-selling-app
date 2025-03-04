import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { XCircleIcon } from "@heroicons/react/20/solid";
import * as Yup from "yup";
import { useRecoilState } from "recoil";
import authState from "../utils/atoms/auth";
import axios from "axios";

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
  const [isLogin, setIsLogin] = useState<boolean>(
    authenticationData?.authenticationFormState.state === "signin"
  );
  const initialValues: MyFormValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
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
        }
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#E6D6CE] bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={handleCloseButton}
        >
          <XCircleIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            console.log({ values, actions });
            handleAuthentication(values);
          }}
          validationSchema={!isLogin ? SignupSchema : undefined}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col gap-3">
              {!isLogin && (
                <>
                  <label htmlFor="name" className="font-medium">
                    Full Name
                  </label>
                  <Field
                    id="name"
                    name="name"
                    placeholder="Enter full name"
                    className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                  />
                  {errors.name && touched.name ? (
                    <div className="text-[12px] text-red-500">
                      {errors.name}
                    </div>
                  ) : null}
                </>
              )}
              <label htmlFor="email" className="font-medium">
                Email
              </label>
              <Field
                id="email"
                name="email"
                placeholder="Enter email"
                className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                type="email"
              />
              {errors.email && touched.email ? (
                <div className="text-[12px] text-red-500">{errors.email}</div>
              ) : null}
              <label htmlFor="password" className="font-medium">
                Password
              </label>
              <Field
                id="password"
                name="password"
                className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                placeholder="Enter password"
                type="password"
              />
              {errors.password && touched.password ? (
                <div className="text-[12px] text-red-500">
                  {errors.password}
                </div>
              ) : null}
              {!isLogin && (
                <>
                  <label htmlFor="confirmPassword" className="font-medium">
                    Confirm Password
                  </label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className="p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                    type="password"
                  />
                  {errors.confirmPassword && touched.confirmPassword ? (
                    <div className="text-[12px] text-red-500">
                      {errors.confirmPassword}
                    </div>
                  ) : null}
                </>
              )}
              {!isLogin && (
                <>
                  <label className="font-medium">User Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <Field
                        type="radio"
                        name="role"
                        value="admin"
                        className="mr-2"
                      />
                      Admin
                    </label>
                    <label className="flex items-center">
                      <Field
                        type="radio"
                        name="role"
                        value="user"
                        className="mr-2"
                      />
                      Normal User
                    </label>
                  </div>
                  {errors.role && touched.role ? (
                    <div className="text-[12px] text-red-500">
                      {errors.role}
                    </div>
                  ) : null}
                </>
              )}
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold p-2 rounded-md shadow hover:bg-blue-700 mt-4 cursor-pointer"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
        <p className="text-center text-sm mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="text-blue-600 font-medium ml-1 hover:underline cursor-pointer"
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
