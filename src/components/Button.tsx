import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", ...props }) => {
  const baseStyle =
    "px-4 py-2 rounded-lg font-medium focus:outline-none transition-all duration-200 active:scale-95 shadow-md";

  const styles = {
    primary: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button className={`${baseStyle} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
