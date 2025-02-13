import React from "react";

interface ButtonProps {
    text: string,
    onClick?: () => void;
    type?: "submit" | "button";
}

const Button: React.FC<ButtonProps> = ({ text, onClick, type = "button" }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition"
        >
            {text}
        </button>
    );
};

export default Button;