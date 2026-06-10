import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home";
import CreateGame from "./pages/CreateGame";
import UpdateGame from "./pages/UpdateGame";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

import useThemeStore from "./store/useThemeStore";

function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.remove(
      "light-theme",
      "dark-theme"
    );

    document.documentElement.classList.add(
      theme === "dark" ? "dark-theme" : "light-theme"
    );
  }, [theme]);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateGame />} />
        <Route path="/update/:id/edit" element={<UpdateGame />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;