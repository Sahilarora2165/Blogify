import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
// import { useTheme } from "../hooks/useTheme";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="flex justify-between p-4 bg-white dark:bg-gray-900 shadow-md">
      <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">Blogify</Link>
      <div className="flex gap-4">
        <Link to="/blogs" className="text-gray-700 dark:text-gray-300">Blogs</Link>
        <Link to="/about" className="text-gray-700 dark:text-gray-300">About</Link>
        <button onClick={toggleTheme} className="p-2">
          {theme === "dark" ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-700" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
