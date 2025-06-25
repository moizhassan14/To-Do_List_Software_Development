// 📁 components/TaskList.jsx
import React from "react";
import { useSelector } from "react-redux";
import TaskCard from "./TaskCard";

const TaskList = () => {
  const { tasks, filter, selectedTags, search } = useSelector((state) => state.task);

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "completed"
        ? task.isCompleted
        : !task.isCompleted;

    const matchesTags =
      selectedTags.length === 0 ||
      (task.tags && selectedTags.every((tag) => task.tags.includes(tag)));

    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesTags && matchesSearch;
  });

  return (
    <div className="grid gap-4">
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => <TaskCard key={task._id} task={task} />)
      ) : (
        <p className="text-center text-gray-500">No tasks found.</p>
      )}
    </div>
  );
};

export default TaskList;