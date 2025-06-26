// File: components/task/CreateTaskModal.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTaskThunk } from "../../store/slice/task/task.thunk";

const initialTask = {
  title: "",
  description: "",
  dueDate: "",
  priority: "medium",
  tags: [],
  attachments: [],
};

const CreateTaskModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialTask);
  const { buttonLoading } = useSelector((state) => state.task);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, attachments: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataPayload = new FormData();

      // Append basic fields (exclude tags and attachments)
      for (const key in formData) {
        if (key !== "tags" && key !== "attachments") {
          formDataPayload.append(key, formData[key]);
        }
      }

      // Append each tag separately
      if (Array.isArray(formData.tags)) {
        formData.tags.forEach((tag) => {
          formDataPayload.append("tags[]", tag.trim());
        });
      }

      // Append attachments if any
      if (formData.attachments && formData.attachments.length > 0) {
        for (const file of formData.attachments) {
          formDataPayload.append("attachments", file);
        }
      }

      await dispatch(createTaskThunk(formDataPayload)).unwrap();

      // Reset form and close modal
      setFormData(initialTask);
      onClose();
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
        encType="multipart/form-data"
      >
        <h2 className="text-xl font-semibold">Create New Task</h2>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
        />

        <input
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
        />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          name="tags"
          onChange={handleTagsChange}
          placeholder="Tags (comma separated)"
          className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
        />

        <input
          name="attachments"
          type="file"
          onChange={handleFileChange}
          multiple
          className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={buttonLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {buttonLoading ? "Saving..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskModal;
