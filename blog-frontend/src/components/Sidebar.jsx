import { Home, Users, FileText, MessageSquare, HomeIcon, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-screen w-64 bg-black text-white p-5 flex flex-col">
      {/* Logo */}
      <h1 className="text-2xl font-bold mb-6 text-gray-200">Admin Panel</h1>
      
      {/* Navigation Links */}
      <nav className="flex flex-col gap-4">
        <SidebarItem icon={<HomeIcon size={20} />} text="Dashboard" link="/admin/dashboard" />
        <SidebarItem icon={<Users size={20} />} text="Users" link="/admin/users" />
        <SidebarItem icon={<FileText size={20} />} text="Posts" link="/admin/posts" />
        <SidebarItem icon={<MessageSquare size={20} />} text="Comments" link="/admin/comments" />
        <SidebarItem icon={<LogOut size={20} />} text="Logout" onClick={handleLogout} />
      </nav>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, text, link, onClick }) => {
  return (
    <Link
      to={link || "#"}
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-all"
    >
      {icon}
      <span className="text-gray-300">{text}</span>
    </Link>
  );
};

export default Sidebar;
