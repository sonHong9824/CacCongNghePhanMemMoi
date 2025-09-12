import React from "react";

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, footer }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6">
      {title && (
        <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          {title}
        </h4>
      )}
      <div className="text-gray-700">{children}</div>
      {footer && <div className="mt-6 pt-4 border-t">{footer}</div>}
    </div>
  );
};

export default Card;
