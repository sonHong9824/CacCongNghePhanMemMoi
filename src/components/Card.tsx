import React from "react";

export interface CardProps {
  title?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-5">
      {title && <h4 className="text-lg font-semibold text-gray-800 mb-3">{title}</h4>}
      {children}
    </div>
  );
};

export default Card;
