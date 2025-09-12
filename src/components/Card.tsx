import React from "react";

export interface CardProps {
  title?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "1rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {title && <h4 style={{ marginBottom: "0.5rem" }}>{title}</h4>}
      {children}
    </div>
  );
};

export default Card;
