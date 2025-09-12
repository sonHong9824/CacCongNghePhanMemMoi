import React from "react";
import Button from "./Button";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode; // Cho phép truyền nhiều nút tuỳ ý
  showFooter?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  showFooter = true,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform animate-scaleIn">
        {title && <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>}
        <div className="mb-4 text-gray-700">{children}</div>
        {showFooter && (
          <div className="flex justify-end gap-2">
            {actions}
            <Button variant="secondary" onClick={onClose}>
              Đóng
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
