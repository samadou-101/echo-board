import { useAppSelector } from "@hooks/redux/redux-hooks";
import Home from "@pages/Home";
import { useEffect } from "react";

const App = () => {
  const isDarkTheme = useAppSelector((state) => state.global.isDarkTheme);

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkTheme]);
  return <Home />;
};

export default App;
