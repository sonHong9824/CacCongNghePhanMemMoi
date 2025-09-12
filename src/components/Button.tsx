import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  loading,
  ...props
}) => {
  const base =
    "px-4 py-2 rounded-xl font-medium focus:outline-none transition-all duration-200 active:scale-95 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-md",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
  };

  return (
    <button
      className={`${base} ${variants[variant]}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
      {children}
    </button>
  );
};

export default Button;
