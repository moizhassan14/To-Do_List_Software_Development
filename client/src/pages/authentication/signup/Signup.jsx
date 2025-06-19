import React, { useEffect, useState } from "react";
import { FaUser, FaKey, FaSun, FaMoon } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUserThunk } from "../../../store/slice/user/user.thunk";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { toggleTheme } from "../../../store/slice/theme/theme.slice";

// Toggle switch component for theme change
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

// Animation variants
const inputVariants = {
  focus: {
    scale: 1.02,
    borderColor: "#6366F1",
    boxShadow: "0 0 8px rgba(99,102,241,0.6)",
    transition: { type: "spring", stiffness: 300 },
  },
  blur: {
    scale: 1,
    borderColor: "rgba(209, 213, 219, 1)",
    boxShadow: "none",
    transition: { duration: 0.25 },
  },
};

const errorVariants = {
  visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  hidden: { opacity: 0, height: 0, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0 6px 12px rgba(99, 102, 241, 0.6)",
    transition: { duration: 0.3 },
  },
  tap: { scale: 0.95 },
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, buttonLoading } = useSelector(
    (state) => state.userReducer
  );
  const isDark = useSelector((state) => state.themeReducer.mode === "dark");

  const [signupData, setSignupData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [focusState, setFocusState] = useState({
    email: false,
    password: false,
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email format";
        }
        break;
      case "password":
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(value)) {
          error =
            "Password must be 8+ chars with at least 1 letter and 1 number";
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleChangeData = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleFocus = (field) => {
    setFocusState((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocusState((prev) => ({ ...prev, [field]: false }));
    validateField(field, signupData[field]);
  };

  const handleSignup = async () => {
    const isEmailValid = validateField("email", signupData.email);
    const isPasswordValid = validateField("password", signupData.password);

    if (!isEmailValid || !isPasswordValid) {
      return toast.error("Please fix the validation errors");
    }

    try {
      const response = await dispatch(registerUserThunk(signupData));
      // Check if the response is fulfilled
      if (
        response.meta.requestStatus === "fulfilled" &&
        response.payload.success
      ) {
        toast.success("Login successful!"); // Show toast here
        navigate("/");
      } else {
        toast.error(response?.payload?.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred during registration");
      console.error("Registration error:", error);
    }
  };

  return (
    <motion.div
      className={`relative flex justify-center items-center min-h-screen px-4 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ToggleSwitch
          isOn={isDark}
          handleToggle={handleToggleTheme}
          label="Toggle Theme"
        />
      </div>

      {/* Signup Card */}
      <motion.div
        className={`w-full max-w-md p-8 rounded-xl shadow-xl border ${
          isDark
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-300 text-gray-800"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        role="form"
        aria-labelledby="signup-heading"
      >
        <h2 id="signup-heading" className="text-3xl font-bold mb-6 text-center">
          Create an Account
        </h2>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <motion.div
            className={`flex items-center border rounded-md px-3 py-2 ${
              isDark
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-300"
            }`}
            variants={inputVariants}
            animate={focusState.email ? "focus" : "blur"}
          >
            <FaUser className="text-gray-400" />
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={signupData.email}
              onChange={handleChangeData}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              className={`ml-2 w-full outline-none bg-transparent placeholder-gray-400 ${
                errors.email
                  ? "text-red-500"
                  : isDark
                  ? "text-white"
                  : "text-gray-800"
              }`}
              aria-invalid={!!errors.email}
              aria-describedby="emailError"
              required
              autoComplete="email"
            />
          </motion.div>
          <AnimatePresence>
            {errors.email && (
              <motion.p
                id="emailError"
                className="text-red-500 text-xs mt-1"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <motion.div
            className={`flex items-center border rounded-md px-3 py-2 ${
              isDark
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-300"
            }`}
            variants={inputVariants}
            animate={focusState.password ? "focus" : "blur"}
          >
            <FaKey className="text-gray-400" />
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={signupData.password}
              onChange={handleChangeData}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              className={`ml-2 w-full outline-none bg-transparent placeholder-gray-400 ${
                errors.password
                  ? "text-red-500"
                  : isDark
                  ? "text-white"
                  : "text-gray-800"
              }`}
              aria-invalid={!!errors.password}
              aria-describedby="passwordError"
              required
              autoComplete="new-password"
              minLength={8}
            />
          </motion.div>
          <AnimatePresence>
            {errors.password && (
              <motion.p
                id="passwordError"
                className="text-red-500 text-xs mt-1"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {errors.password}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Signup Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <motion.button
            type="submit"
            disabled={buttonLoading}
            className={`w-full font-semibold py-2 px-4 rounded-md flex justify-center items-center gap-2 transition ${
              isDark
                ? "bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-400 disabled:cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-400 disabled:cursor-not-allowed"
            }`}
            aria-busy={buttonLoading}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            // type="button" // Changed to button to prevent form submission
          >
            {buttonLoading ? (
              <>
                <span
                  className="loading loading-spinner"
                  aria-hidden="true"
                ></span>
                Signing up...
              </>
            ) : (
              "Signup"
            )}
          </motion.button>
        </form>

        {/* Redirect to Login */}
        <p
          className={`text-sm mt-4 text-center ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Signup;
