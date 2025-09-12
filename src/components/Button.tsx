import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", ...props }) => {
  const baseStyle =
    "px-4 py-2 rounded font-medium focus:outline-none transition-colors";
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  };

  return (
    <button className={`${baseStyle} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
