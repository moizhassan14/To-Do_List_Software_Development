// 📁 components/TaskCard.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteTaskThunk,
  updateTaskThunk,
} from "../../store/slice/task/task.thunk";
const TaskCard = React.memo(({ task }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleCompleteToggle = () => {
    dispatch(
      updateTaskThunk({
        id: task._id,
        data: { isCompleted: !task.isCompleted },
      })
    );
  };

  const handleDelete = () => {
    dispatch(deleteTaskThunk(task._id));
  };

  const handleEdit = () => {
    if (isEditing) {
      dispatch(updateTaskThunk({ id: task._id, data: { title: editedTitle } }));
    }
    setIsEditing(!isEditing);
  };

  return (
    <div
      className={`p-4 rounded-2xl shadow-md transition-transform duration-300 ease-in-out flex flex-col gap-2 ${
        task.isCompleted ? "opacity-50 line-through" : ""
      }`}
      style={{ backgroundColor: task.isCompleted ? "#f0f0f0" : "#ffffff" }}
    >
      <div className="flex justify-between items-center">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          />
        ) : (
          <h3 className="text-lg font-semibold">{task.title}</h3>
        )}
        <div className="flex gap-2">
          <button
            onClick={handleCompleteToggle}
            className={`text-sm px-3 py-1 rounded ${
              task.isCompleted
                ? "bg-yellow-100 hover:bg-yellow-200"
                : "bg-green-100 hover:bg-green-200"
            } focus:outline-none focus:ring-2 ${
              task.isCompleted
                ? "focus:ring-yellow-500"
                : "focus:ring-green-500"
            } focus:ring-offset-2`}
          >
            {task.isCompleted ? "Undo" : "Complete"}
          </button>

          <button
            onClick={handleEdit}
            className="text-sm px-3 py-1 rounded bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
          <button
            onClick={handleDelete}
            className="text-sm px-3 py-1 rounded bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>
      {task.description && (
        <p className="text-sm text-gray-600">{task.description}</p>
      )}
      <div className="text-xs text-gray-500 flex gap-2 flex-wrap">
        {task.tags?.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded-full"
          >
            {tag}
          </span>
        ))}
        {task.dueDate && (
          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        )}
        <span className="capitalize">Priority: {task.priority}</span>
      </div>
    </div>
  );
});

export default TaskCard;
