import { Moon, Sun } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@hooks/redux/redux-hooks";
import { setIsDarkTheme } from "@redux/slices/globalSlice";
import { Canvas, Circle, IText, Polygon, Rect, Triangle } from "fabric";
import { FC } from "react";

interface IThemeToggle {
  canvas: Canvas | null;
}

const ThemeToggle: FC<IThemeToggle> = ({ canvas }) => {
  const dispatch = useAppDispatch();
  const isDarkTheme = useAppSelector((state) => state.global.isDarkTheme);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    dispatch(setIsDarkTheme(newTheme));

    if (canvas) {
      // Update canvas background color
      // canvas.backgroundColor = newTheme ? "#1f2937" : "#e5e7eb";

      // Update objects
      canvas.getObjects().forEach((obj) => {
        if (
          obj instanceof Rect ||
          obj instanceof Circle ||
          obj instanceof Triangle ||
          obj instanceof Polygon
        ) {
          obj.set("stroke", newTheme ? "white" : "black");
        } else if (obj instanceof IText) {
          obj.set({
            fill: newTheme ? "#ffffff" : "#000000", // Update text fill color
            stroke: null, // Remove stroke to prevent thickening
            fontWeight: "400", // Ensure normal weight
          });
        }
      });
      canvas.requestRenderAll();
    }

    // Update document theme
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="cursor-pointer rounded-full p-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:focus:ring-offset-gray-900"
    >
      {isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;
