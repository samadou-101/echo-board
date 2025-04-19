import { Moon, Sun } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@hooks/redux/redux-hooks";
import { setIsDarkTheme } from "@redux/slices/globalSlice"; // Adjust path to your actual slice

const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const isDarkTheme = useAppSelector((state) => state.global.isDarkTheme);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    dispatch(setIsDarkTheme(newTheme));

    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full p-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:focus:ring-offset-gray-900"
    >
      {isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;
