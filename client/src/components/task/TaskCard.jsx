import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTaskThunk,
  updateTaskThunk,
} from "../../store/slice/task/task.thunk";

const TaskCard = React.memo(({ task }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [selectedImage, setSelectedImage] = useState(null);
  const { userProfile } = useSelector((state) => state.user);
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    setEditedTask((prev) => ({
      ...prev,
      tagsInput: task.tags?.join(", ") || "",
    }));
  }, [isEditing]);

  useEffect(() => {
    if (userProfile?._id && task.owner) {
      setIsOwner(userProfile._id === task.owner);
    }
  }, [userProfile, task.owner]);

  if (!userProfile) return null;

  

  console.log("userProfile", userProfile, "task.owner", task.owner);

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
    if (isEditing && isOwner) {
      dispatch(
        updateTaskThunk({
          id: task._id,
          data: {
            ...editedTask,
            dueDate: new Date(editedTask.dueDate).toISOString(),
          },
        })
      );
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
        {isEditing && userProfile?._id === task.owner ? (
          <div className="space-y-2 w-full">
            <input
              name="title"
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
              className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
            />

            <textarea
              name="description"
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
              className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
            />

            <input
              type="date"
              name="dueDate"
              value={editedTask.dueDate?.slice(0, 10)} // ISO format for input
              onChange={(e) =>
                setEditedTask({ ...editedTask, dueDate: e.target.value })
              }
              className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
            />

            <select
              name="priority"
              value={editedTask.priority}
              onChange={(e) =>
                setEditedTask({ ...editedTask, priority: e.target.value })
              }
              className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              name="tags"
              value={editedTask.tagsInput || ""}
              onChange={(e) => {
                setEditedTask((prev) => ({
                  ...prev,
                  tagsInput: e.target.value, // this is just a temp input field
                  tags: e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                }));
              }}
              placeholder="Tags (comma separated)"
              className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
            />
          </div>
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
          {task.sharedWith?.length > 0 && (
            <span className="text-purple-500 dark:text-purple-300">
              Shared with {task.sharedWith.length} user
              {task.sharedWith.length > 1 ? "s" : ""}
            </span>
          )}

        </div>
      </div>

      {!isEditing && task.description && (
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
                    src={`${import.meta.env.VITE_API_BASE_URL}/${
                      attachment.filePath
                    }`}
                    alt={attachment.fileName}
                    className="h-12 w-12 object-cover rounded cursor-pointer"
                    onClick={() =>
                      setSelectedImage(
                        `${import.meta.env.VITE_API_BASE_URL}/${
                          attachment.filePath
                        }`
                      )
                    }
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

      {/* Modal for full-size image preview */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className="relative max-w-3xl max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white text-xl bg-black bg-opacity-40 rounded-full px-3 py-1"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
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
