import React, { useState } from "react";
import Modal from "./Modal";
import CreateCourse from "./CreateCourse";
const AdminDashboard: React.FC = () => {
  const [isCreateCourseModalVisiblity, setCreateCourseModalVibility] =
    useState<boolean>(false);
  const handleModalVisibility = () => {
    setCreateCourseModalVibility(!isCreateCourseModalVisiblity);
    };
  return (
    <div className="flex relative">
      <div className="flex flex-col gap-2 bg-[#423737] text-white w-[200px] h-[90vh]">
        <div className="text-center p-2 hover:bg-[#E6D6CE] w-full border-b-1 hover:border-l-4 hover:border-brown cursor-pointer hover:font-bold hover:text-black">
          Cources
        </div>
      </div>
      <div>
        <button
          onClick={handleModalVisibility}
          className="bg-[#423737] w-45 max-sm:w-24 rounded-4xl py-2 font-bold cursor-pointer text-white shadow hover:opacity-75 absolute bottom-2 right-2"
        >
          Create New course +
        </button>
      </div>
      <Modal isOpen={isCreateCourseModalVisiblity}>
        <CreateCourse handleCloseButton={handleModalVisibility}/>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
