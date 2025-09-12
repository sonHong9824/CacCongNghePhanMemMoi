import React from "react";
import Button from "./Button";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform animate-scaleIn">
        {title && <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>}
        <div className="mb-4 text-gray-700">{children}</div>
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
