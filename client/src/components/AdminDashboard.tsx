import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ToastState } from "../types/course";
import Modal from "./Modal";
import CreateCourse from "./CreateCourse";
import AdminCourses from "./AdminCources";
import Toast from "./common/Toast";

const AdminDashboard: React.FC = () => {
  const [isCreateCourseModalVisible, setCreateCourseModalVisibility] =
    useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  const handleModalVisibility = (): void => {
    setCreateCourseModalVisibility(!isCreateCourseModalVisible);
  };

  const handleCreateSuccess = (message: string): void => {
    setToast({
      show: true,
      message,
      type: "success",
    });
    handleModalVisibility();
  };

  const handleToastClose = (): void => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className="relative min-h-screen">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
        />
      )}

      {/* Main Content */}
      <div className="p-4">
        <AdminCourses />
      </div>

      {/* Create Course Button - Fixed Position */}
      <div className="fixed bottom-8 right-8" style={{ zIndex: 9999 }}>
        <button
          onClick={handleModalVisibility}
          className="flex items-center gap-2 px-8 py-4 bg-[#00FFAA] hover:bg-[#FFD700] text-black font-bold rounded-full shadow-xl transition-all duration-300 hover:scale-105 border-2 border-black"
        >
          <PlusIcon className="w-6 h-6" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Create Course Modal */}
      <Modal isOpen={isCreateCourseModalVisible}>
        <CreateCourse
          handleCloseButton={handleModalVisibility}
          onSuccess={handleCreateSuccess}
        />
      </Modal>
    </div>
  );
};

export default AdminDashboard;
