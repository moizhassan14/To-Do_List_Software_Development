import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import {
  getUsersByRoleThunk,
  logOutUserThunk,
  getOwnerDashboardThunk,
  getSharedDashboardThunk,
  assignUserRoleThunk,
} from "../../store/slice/user/user.thunk";

const Dashboard = () => {
  const dispatch = useDispatch();
  const didFetch = useRef(false);

  const {
    userProfile,
    owners,
    collaborators,
    roleMessage,
    buttonLoading,
  } = useSelector((state) => state.userReducer);

  // 🔐 Role-based dashboard message fetch
  useEffect(() => {
    if (userProfile?.role === "owner") {
      dispatch(getOwnerDashboardThunk());
    } else if (userProfile?.role === "collaborator") {
      dispatch(getSharedDashboardThunk());
    }
  }, [userProfile, dispatch]);

  // 📥 Fetch role lists (owners/collaborators) if owner
  useEffect(() => {
    if (
      userProfile?.role === "owner" &&
      !didFetch.current &&
      owners.length === 0 &&
      collaborators.length === 0
    ) {
      didFetch.current = true;
      dispatch(getUsersByRoleThunk());
    }
  }, [userProfile, dispatch, owners.length, collaborators.length]);

  if (!userProfile) {
    return <div>Loading user data...</div>;
  }

  const handleLogout = () => {
    dispatch(logOutUserThunk());
  };

  const handleRoleChange = (userId, newRole) => {
    dispatch(assignUserRoleThunk({ userId, role: newRole }));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {userProfile.email}</h1>
        <button
          onClick={handleLogout}
          disabled={buttonLoading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonLoading ? "Logging out..." : "Logout"}
        </button>
      </div>

      {roleMessage && (
        <div className="mb-4 p-3 border border-blue-400 rounded bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
          {roleMessage}
        </div>
      )}

      {/* Owners List */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Owners</h2>
        <ul className="list-disc ml-6 mt-2">
          {owners.length > 0 ? (
            owners.map((user) => (
              <li key={user._id} className="flex justify-between items-center mb-1">
                {user.email}
                {userProfile.role === "owner" && user._id !== userProfile._id && (
                  <select
                    value="owner"
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="ml-4 p-1 border rounded bg-white text-black"
                  >
                    <option value="owner">Owner</option>
                    <option value="collaborator">Collaborator</option>
                  </select>
                )}
              </li>
            ))
          ) : (
            <li>No owners found</li>
          )}
        </ul>
      </div>

      {/* Collaborators List */}
      <div>
        <h2 className="text-xl font-semibold">Collaborators</h2>
        <ul className="list-disc ml-6 mt-2">
          {collaborators.length > 0 ? (
            collaborators.map((user) => (
              <li key={user._id} className="flex justify-between items-center mb-1">
                {user.email}
                {userProfile.role === "owner" && (
                  <select
                    value="collaborator"
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="ml-4 p-1 border rounded bg-white text-black"
                  >
                    <option value="owner">Owner</option>
                    <option value="collaborator">Collaborator</option>
                  </select>
                )}
              </li>
            ))
          ) : (
            <li>No collaborators found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

