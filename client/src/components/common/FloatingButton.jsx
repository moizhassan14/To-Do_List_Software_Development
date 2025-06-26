import React from "react";
import { FaPlus } from "react-icons/fa";

const FloatingButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-40"
      aria-label="Add new task"
    >
      <FaPlus />
    </button>
  );
};

export default FloatingButton;
