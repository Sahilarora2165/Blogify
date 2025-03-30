import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Posts from "./pages/Posts";
import Comments from "./pages/Comments";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/HomePage";
import UserDetail from "./pages/UserDetail";
import EditUser from "./pages/EditUser";
import PostDetail from "./pages/PostDetail";
import EditPost from "./pages/EditPost";
import CommentDetail from "./pages/CommentDetail";
import EditComment from "./pages/EditComment";
import RecentActivities from "./pages/RecentActivities";
import WriteBlog from "./pages/WriteBlog";
import PostContent from "./pages/PostContent";
import Profile from "./pages/Profile";
import UpdatePost from "./pages/UpdatePost";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes without Sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/write" element={<WriteBlog />} />
        <Route path="/posts/:id" element={<PostContent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update/:postId" element={<UpdatePost />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} /> 
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* Protected Admin Panel Routes with Sidebar */}
        <Route
          path="/admin/*"
          element={
            <div className="flex">
              <Sidebar />
              <div className="flex-1 max-w-7xl mx-auto">
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="users" element={<Users />} />
                  <Route path="users/:id" element={<UserDetail />} />
                  <Route path="users/edit/:id" element={<EditUser />} />
                  <Route path="posts" element={<Posts />} />
                  <Route path="posts/:id" element={<PostDetail />} />
                  <Route path="posts/edit/:id" element={<EditPost />} />
                  <Route path="comments" element={<Comments />} />
                  <Route path="comments/:id" element={<CommentDetail />} />
                  <Route path="comments/edit/:id" element={<EditComment />} />
                  <Route path="recent-activities" element={<RecentActivities />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;