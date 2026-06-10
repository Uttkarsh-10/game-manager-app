import { Link } from "react-router-dom";
import useThemeStore from "../store/useThemeStore";


function Navbar() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDarkMode = theme === "dark";
  

  return (
    <nav className="navbar">
      <div className="navbar-title">
        My Games
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/create">Create Game</Link>

        <label className="theme-switch">
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
            aria-label="Toggle dark mode"
          />
          <span className="slider round"></span>
        </label>
      </div>
    </nav>
  );
}

export default Navbar;