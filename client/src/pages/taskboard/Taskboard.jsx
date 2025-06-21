// TaskBoard.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";
import {
  getMyTasksThunk,
  reorderTasksThunk,
} from "../../store/slice/task/task.thunk";
import { toggleTheme } from "../../store/slice/theme/theme.slice";
import TaskCard from "../../components/task/TaskCard";
import TaskFilterBar from "../../components/task/TaskFilterBar";
import Loader from "../../components/common/Loader";

const ToggleSwitch = ({ isOn, handleToggle, label }) => {
  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={isOn}
      onClick={handleToggle}
      className={`flex items-center justify-between w-16 h-8 p-1 rounded-full
        ${isOn ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"}
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        shadow-md relative cursor-pointer transition-colors duration-300 ease-in-out`}
      whileTap={{ scale: 0.9 }}
      aria-label={label || "Toggle theme"}
    >
      <motion.div
        layout
        className="bg-white w-6 h-6 rounded-full shadow-md flex items-center justify-center text-indigo-600 dark:text-indigo-600"
        initial={false}
        animate={{ x: isOn ? 32 : 0 }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
      >
        {isOn ? (
          <FaMoon size={16} aria-hidden="true" />
        ) : (
          <FaSun size={16} aria-hidden="true" />
        )}
      </motion.div>
    </motion.button>
  );
};

const TaskBoard = () => {
  const dispatch = useDispatch();
  const {
    tasks = [],
    loading,
    filter,
    search,
    selectedTags,
  } = useSelector((state) => state.task || {});
  const themeMode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    dispatch(getMyTasksThunk());
  }, [dispatch]);

  const isDark = useSelector((state) => state.theme.mode === "dark");
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(tasks);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);

    const updatedOrder = reordered.map((task, index) => ({
      ...task,
      order: index,
    }));
    dispatch(reorderTasksThunk(updatedOrder));
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "active") return !task.isCompleted;
      if (filter === "completed") return task.isCompleted;
      return true;
    })
    .filter((task) =>
      search ? task.title.toLowerCase().includes(search.toLowerCase()) : true
    )
    .filter((task) =>
      selectedTags.length > 0
        ? selectedTags.every((tag) => task.tags.includes(tag))
        : true
    );

  if (loading) return <Loader />;

  return (
    <section
      className={`p-6 md:p-8 min-h-screen transition duration-300 ease-in-out ${
        themeMode === "dark"
          ? "bg-gray-950 text-white"
          : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <div className="absolute top-6 right-6">
          <ToggleSwitch
            isOn={isDark}
            handleToggle={handleToggleTheme}
            label="Toggle Theme"
          />
        </div>
      </div>

      <TaskFilterBar />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <motion.div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="mt-6 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {filteredTasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TaskCard task={task} />
                    </motion.div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </motion.div>
          )}
        </Droppable>
      </DragDropContext>
    </section>
  );
};

export default TaskBoard;
