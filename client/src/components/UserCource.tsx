import React, { useState } from "react";
import { UsersIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "./common/LoadingSpinner";
import Toast from "./common/Toast";

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
  const { type } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const handlePayment = async (courseId: string) => {
    setIsLoading(true);
    setToast({ show: false, message: "", type: "success" });

    try {
      const { data: orderData } = await axios.post(
        "http://localhost:3000/api/v1/payment/request/" + courseId,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!orderData?.data) throw new Error("Order creation failed");

      const options = {
        key: "rzp_test_r9x0083Lr1W1nI",
        amount: orderData.data.amount,
        currency: "INR",
        name: "Your Website",
        description: "Course Purchase",
        order_id: orderData.data.id,
        handler: async (paymentData: any) => {
          try {
            setIsLoading(true);
            const { data: verifyData } = await axios.post(
              "http://localhost:3000/api/v1/payment/confirm",
              {
                orderId: paymentData.razorpay_order_id,
                paymentId: paymentData.razorpay_payment_id,
                signature: paymentData.razorpay_signature,
              },
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (verifyData.success) {
              setToast({
                show: true,
                message: "Payment successful! Redirecting...",
                type: "success",
              });
              setTimeout(() => {
                navigate("/course/me");
              }, 2000);
            } else {
              setToast({
                show: true,
                message: "Payment verification failed. Please try again.",
                type: "error",
              });
            }
          } catch (error: any) {
            setToast({
              show: true,
              message:
                error.response?.data?.message ||
                "Payment verification failed. Please try again.",
              type: "error",
            });
          } finally {
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
        theme: { color: "#00FFAA" },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (error: any) {
      setToast({
        show: true,
        message:
          error.response?.data?.message ||
          "Failed to initiate payment. Please try again.",
        type: "error",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto shadow-lg rounded-2xl overflow-hidden bg-[#1E1E1E] border border-[#242424]">
      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
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

        {/* Purchase/Detailed View Button */}
        <button
          disabled={isLoading}
          className={`w-full bg-[#00FFAA] hover:bg-[#FFD700] text-black py-3 rounded-lg font-medium transition-all duration-300 relative ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (type === "explore") {
              handlePayment(course._id);
            } else {
              navigate("/course/watch/" + course?._id);
            }
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              <span>{type === "explore" ? "Processing..." : "Loading..."}</span>
            </div>
          ) : type === "explore" ? (
            "Purchase"
          ) : (
            "Detailed View"
          )}
        </button>
      </div>
    </div>
  );
};

const UserCourse: React.FC<Course> = (props) => {
  const course: Course = { ...props };
  return <CourseCard course={course} />;
};

export default UserCourse;
