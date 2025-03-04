import React from "react";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
}

const Modal: React.FC<ModalProps> = (props) => {
  const { children, isOpen } = props;
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#423737] bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-md shadow-2xl shadow-slate-500">
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
