import React, { useEffect, useState } from "react";
import CreateTaskModal from "../../components/task/CreateTaskModal";
import FloatingButton from "../../components/common/FloatingButton";
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
import { logOutUserThunk } from "../../store/slice/user/user.thunk";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

const ITEMS_PER_PAGE = 5;

const TaskBoard = () => {
  const [showModal, setShowModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    tasks = [],
    loading,
    filter,
    search,
    selectedTags,
  } = useSelector((state) => state.task || {});
  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === "dark";
  const user = useSelector((state) => state.user.userProfile);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  // Fetch tasks only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMyTasksThunk());
    }
  }, [dispatch, isAuthenticated]);

  const handleToggleTheme = () => dispatch(toggleTheme());

  const handleLogout = async () => {
    try {
      setButtonLoading(true);
      await dispatch(logOutUserThunk()).unwrap();
      navigate("/login"); // Move away from protected route
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setButtonLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate("/");
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(filteredTasks);
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

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTasks = filteredTasks.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  if (loading) return <Loader />;

  return (
    <section
      className={`p-6 md:p-8 min-h-screen transition duration-300 ease-in-out ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="flex justify-between items-center mb-6 relative">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <div className="flex items-center space-x-4 absolute top-0 right-0">
          <ToggleSwitch
            isOn={isDark}
            handleToggle={handleToggleTheme}
            label="Toggle Theme"
          />
          {user?.role === "owner" && (
            <button
              onClick={handleGoToDashboard}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Dashboard
            </button>
          )}
          <button
            onClick={handleLogout}
            disabled={buttonLoading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {buttonLoading ? "Logging out..." : "Logout"}
          </button>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {paginatedTasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        transform: provided.draggableProps.style?.transform,
                        transition: snapshot.isDragging
                          ? "none"
                          : "transform 0.2s ease",
                        backgroundColor: snapshot.isDragging
                          ? isDark
                            ? "#1f2937"
                            : "#e0e7ff"
                          : isDark
                          ? "#111827"
                          : "#ffffff",
                        boxShadow: snapshot.isDragging
                          ? "0 6px 12px rgba(0, 0, 0, 0.2)"
                          : "none",
                        borderRadius: "0.75rem",
                        padding: "4px",
                        userSelect: "none",
                      }}
                    >
                      <TaskCard task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </motion.div>
          )}
        </Droppable>
      </DragDropContext>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-8 h-8 rounded-full ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white"
            }`}
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`w-8 h-8 rounded-full ${
                currentPage === idx + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 rounded-full ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white"
            }`}
          >
            →
          </button>
        </div>
      )}

      <CreateTaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <FloatingButton onClick={() => setShowModal(true)} />
    </section>
  );
};

export default TaskBoard;
