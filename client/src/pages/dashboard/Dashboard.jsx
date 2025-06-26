import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  getUsersByRoleThunk,
  logOutUserThunk,
  getOwnerDashboardThunk,
  getSharedDashboardThunk,
  assignUserRoleThunk,
} from "../../store/slice/user/user.thunk";
import { toggleTheme } from "../../store/slice/theme/theme.slice";
import toast from "react-hot-toast";
import { FaMoon, FaSun } from "react-icons/fa";

const ToggleSwitch = ({ isOn, handleToggle }) => (
  <motion.button
    type="button"
    onClick={handleToggle}
    className={`flex items-center justify-center w-10 h-10 rounded-full 
      ${isOn ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"} 
      focus:outline-none focus:ring-2 focus:ring-indigo-500`}
    whileTap={{ scale: 0.9 }}
    aria-label="Toggle Theme"
  >
    {isOn ? (
      <FaMoon className="text-white" />
    ) : (
      <FaSun className="text-yellow-500" />
    )}
  </motion.button>
);

const ITEMS_PER_PAGE = 5;

const Dashboard = () => {
  const dispatch = useDispatch();

  const {
    userProfile,
    owners,
    collaborators,
    roleMessage,
    buttonLoading,
    isAuthenticated,
    screenLoading,
  } = useSelector((state) => state.user);

  const isDark = useSelector((state) => state.theme.mode === "dark");

  const [activeTab, setActiveTab] = useState("owners");
  const [ownersPage, setOwnersPage] = useState(1);
  const [collaboratorsPage, setCollaboratorsPage] = useState(1);

  const hasFetchedDashboardRef = useRef(false);
  const hasFetchedUsersRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !userProfile) return;
    if (!hasFetchedDashboardRef.current) {
      if (userProfile.role === "owner") {
        dispatch(getOwnerDashboardThunk());
      } else {
        dispatch(getSharedDashboardThunk());
      }
      hasFetchedDashboardRef.current = true;
    }
    if (userProfile.role === "owner" && !hasFetchedUsersRef.current) {
      if (owners.length === 0) {
        dispatch(getUsersByRoleThunk()).finally(() => {
          hasFetchedUsersRef.current = true;
        });
      }
    }
  }, [userProfile, isAuthenticated, dispatch, owners.length]);

  const handleLogout = () => {
    hasFetchedDashboardRef.current = false;
    hasFetchedUsersRef.current = false;
    dispatch(logOutUserThunk());
  };

  const handleRoleChange = async (userId, newRole) => {
    await dispatch(assignUserRoleThunk({ userId, role: newRole }));
    await dispatch(getUsersByRoleThunk());
    toast.success(`Role updated to ${newRole}`, { id: "role-toast" });
  };

  const renderUserList = (allUsers, roleType, currentPage, setPageFn) => {
    const totalPages = Math.ceil(allUsers.length / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedUsers = allUsers.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    return (
      <>
        <ul className="space-y-3">
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <li
                key={user._id}
                className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white p-3 rounded-md"
              >
                <span>{user.email}</span>
                {user._id !== userProfile?._id && (
                  <select
                    value={roleType}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="ml-4 p-1 rounded bg-white dark:bg-gray-600 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="owner">Owner</option>
                    <option value="collaborator">Collaborator</option>
                  </select>
                )}
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-500 dark:text-gray-300">
              No {roleType}s found.
            </li>
          )}
        </ul>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2 flex-wrap">
            <button
              onClick={() => setPageFn(currentPage - 1)}
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
                onClick={() => setPageFn(idx + 1)}
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
              onClick={() => setPageFn(currentPage + 1)}
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
      </>
    );
  };

  if (!isAuthenticated) {
    return <div>Please log in to view the dashboard.</div>;
  }

  return (
    <motion.div
      className={`min-h-screen px-4 py-6 transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          {
            roleMessage &&(

          <h1 className="text-2xl font-bold">
            Welcome, <span className="text-indigo-600 dark:text-indigo-400">{roleMessage}</span>
          </h1>
            )
          }
          {/* {roleMessage && (
            <p className="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">{roleMessage}</p>
          )} */}
        </div>

        <div className="flex gap-4 items-center">
          <ToggleSwitch isOn={isDark} handleToggle={() => dispatch(toggleTheme())} />
          <button
            onClick={handleLogout}
            disabled={buttonLoading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {buttonLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

      {screenLoading ? (
        <div className="flex justify-center items-center mt-16">
          <div className="w-10 h-10 border-4 border-indigo-500 border-dashed rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
          <div className="flex gap-4 border-b mb-4">
            <button
              onClick={() => setActiveTab("owners")}
              className={`pb-2 font-semibold ${
                activeTab === "owners"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500 dark:text-gray-300"
              }`}
            >
              Owners
            </button>
            <button
              onClick={() => setActiveTab("collaborators")}
              className={`pb-2 font-semibold ${
                activeTab === "collaborators"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500 dark:text-gray-300"
              }`}
            >
              Collaborators
            </button>
          </div>

          {activeTab === "owners"
            ? renderUserList(owners, "owner", ownersPage, setOwnersPage)
            : renderUserList(collaborators, "collaborator", collaboratorsPage, setCollaboratorsPage)}
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;