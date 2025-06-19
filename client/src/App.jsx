import "./App.css";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

function App() {
  const themeMode = useSelector((state) => state.themeReducer.mode); // 'light' or 'dark'

  // Theme-based styles
  const isDark = themeMode === "dark";

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: isDark ? "#1f2937" : "#f9fafb", // dark: slate-800, light: gray-50
            color: isDark ? "#f9fafb" : "#1f2937",      // light text on dark and vice versa
            border: isDark ? "1px solid #4b5563" : "1px solid #e5e7eb", // Optional border
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: isDark ? "#22c55e" : "#15803d", // Tailwind green-500 / green-800
              secondary: isDark ? "#111827" : "#ffffff", // gray-900 or white
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: isDark ? "#f87171" : "#b91c1c", // red-400 / red-700
              secondary: isDark ? "#111827" : "#ffffff",
            },
          },
        }}
      />
    </>
  );
}

export default App;
