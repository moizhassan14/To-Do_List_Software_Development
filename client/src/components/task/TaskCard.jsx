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
      className={`p-4 rounded-2xl shadow-md transition-all duration-300 ease-in-out flex flex-col gap-2
        ${task.isCompleted ? "opacity-60 line-through" : "opacity-100"}
        ${
          task.isCompleted
            ? "bg-gray-300 dark:bg-gray-700"
            : "bg-white dark:bg-gray-800"
        }
        text-gray-800 dark:text-gray-100
      `}
    >
      <div className="flex justify-between items-start">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          />
        ) : (
          <h3 className="text-lg font-semibold">{task.title}</h3>
        )}
        <div className="flex gap-2 ml-2">
          <button
            onClick={handleCompleteToggle}
            className={`text-sm px-3 py-1 rounded transition-colors ${
              task.isCompleted
                ? "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800 dark:hover:bg-yellow-700"
                : "bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700"
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
            className="text-sm px-3 py-1 rounded bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-700 dark:hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
          <button
            onClick={handleDelete}
            className="text-sm px-3 py-1 rounded bg-red-100 hover:bg-red-200 dark:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {task.description}
        </p>
      )}

      {/* Attachment Preview */}
      {task.attachments?.length > 0 && (
        <div className="mt-2">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Attachments:
          </h4>
          <div className="flex gap-2">
            {task.attachments.map((attachment) => (
              <div key={attachment._id} className="flex items-center gap-1">
                {attachment.fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={`${
                      import.meta.env.VITE_API_BASE_URL
                    }/${attachment.filePath.replace(/\\/g, "/")}`}
                    alt={attachment.fileName}
                    className="h-12 w-12 object-cover rounded"
                  />
                ) : (
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                    <span className="text-xs">{attachment.fileName}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs flex gap-2 flex-wrap text-gray-500 dark:text-gray-400">
        {task.tags?.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-full"
          >
            {tag}
          </span>
        ))}
        {task.dueDate && (
          <span>
            Due:{" "}
            {new Date(task.dueDate).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
        <span className="capitalize">Priority: {task.priority}</span>
      </div>
    </div>
  );
});

export default TaskCard;
