import React, { useEffect, useState } from "react";
import {
  UsersIcon,
  CurrencyDollarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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
    const handlePayment = async (courseId: string) => {
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
              alert("Payment Successful!");
            } else {
              alert("Payment Failed! Try again.");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed. Try again.");
          }
        },
        theme: { color: "#3399cc" },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
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
                  onClick={() => {
                      if (type === "explore") {
                          handlePayment(course._id)
                      } else {
                            navigate("/course/watch/" + course?._id);
                      }
                  }}
        >
         { type === "explore" ? "Purchase" : "Detailed View"}
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
