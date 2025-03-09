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
        <div className="fixed inset-0 flex items-center justify-center bg-[#121212] bg-opacity-50 z-50">
          <div className=" bg-[#1E1E1E] p-8 rounded-xl shadow-lg border border-[#242424]">
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
