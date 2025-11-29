import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    // Reduced posts per page from 100 to 10 for better performance and user experience
    const [postsPerPage] = useState(10);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setError("No authentication token found. Please log in.");
            setLoading(false);
            navigate("/login");
            return;
        }

        const fetchPosts = async (page = 0, size = 8) => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/posts?page=${page}&size=${size}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPosts(response.data.content);
                setError("");
            } catch (err) {
                let errorMessage = "Failed to load posts";
                if (err.response) {
                    errorMessage = `Error: ${err.response.status} - ${err.response.data.message || "Unauthorized or server error"}`;
                    if (err.response.status === 401) {
                        localStorage.removeItem("token");
                        navigate("/login");
                        errorMessage = "Session expired. Please log in again.";
                    }
                } else if (err.request) {
                    errorMessage = "Network error. Please check your connection.";
                } else {
                    errorMessage = `Unexpected error: ${err.message}`;
                }
                setError(errorMessage);
                console.error("Error fetching posts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts(currentPage - 1, postsPerPage);
    }, [token, navigate, currentPage]);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.user?.username?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (post.user?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const handleDelete = async (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPosts(posts.filter(post => post.id !== postId));
                setError("");
            } catch (err) {
                let errorMessage = "Failed to delete post";
                if (err.response) {
                    errorMessage = `Error: ${err.response.status} - ${err.response.data.message || "Unauthorized or server error"}`;
                } else if (err.request) {
                    errorMessage = "Network error. Please check your connection.";
                } else {
                    errorMessage = `Unexpected error: ${err.message}`;
                }
                setError(errorMessage);
                console.error("Error deleting post:", err);
            }
        }
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-gray-500"></div>
                    <p className="text-gray-500 mt-2">Loading posts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Post Management</h1>
                    <p className="text-sm text-gray-500">Manage and curate your blog posts</p>
                </div>
                <div className="w-1/3">
                    <input
                        type="text"
                        placeholder="Search by title, author, or status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:shadow-md transition-all duration-200"
                    />
                </div>
            </div>

            {error && (
                <p className="text-red-500 text-center mb-4">
                    {error}
                    <button
                        onClick={() => fetchPosts(currentPage - 1, postsPerPage)}
                        className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition-all duration-200"
                    >
                        Retry
                    </button>
                </p>
            )}

            <div className="flex-1 overflow-auto">
                <div className="space-y-4">
                    {currentPosts.length > 0 ? (
                        currentPosts.map(post => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                            >
                                <div className="flex-1">
                                    <Link to={`/admin/posts/${post.id}`} className="text-gray-900 hover:text-blue-600">
                                        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                                        <p className="text-gray-600 text-sm">By {post.username || "Unknown"}</p>
                                        <p className="text-gray-600 text-sm">{post.email || "Unknown"}</p>
                                        <p className="text-gray-600 text-sm line-clamp-2 mt-2">{post.content}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Created: {new Date(post.createdAt).toLocaleString()}
                                        </p>
                                        {post.updatedAt && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Updated: {new Date(post.updatedAt).toLocaleString()}
                                            </p>
                                        )}
                                    </Link>
                                </div>
                                <div className="flex space-x-4 mt-4">
                                    <button
                                        onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition-all duration-200"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-center">No posts found.</p>
                    )}
                </div>
            </div>

            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentPage === i + 1
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                } text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Posts;