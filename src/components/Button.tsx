import React from "react";

type ButtonProps = {
  color: "red" | "blue" | "green"; // You can add more colors as needed
  text: string;
  onClick: () => void; // Callback function for button click
};

const Button: React.FC<ButtonProps> = ({ color, text, onClick }) => {
  const buttonStyles = {
    red: {
      background: "bg-red-600",
      shadow: "shadow-lg shadow-red-900",
    },
    blue: {
      background: "bg-blue-500",
      shadow: "shadow-lg shadow-blue-900",
    },
    green: {
      background: "bg-green-500",
      shadow: "shadow-lg shadow-green-800",
    },
  };

  const currentStyle = buttonStyles[color] || buttonStyles.red;

  return (
    <button
      onClick={onClick} // Trigger the callback when button is clicked
      className={`text-white text-3xl px-8 py-4 font-zcool ${currentStyle.background} ${currentStyle.shadow} hover:brightness-110 transition-all duration-300`}
    >
      {text}
    </button>
  );
};

export default Button;
