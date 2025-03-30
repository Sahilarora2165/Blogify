import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

/**
 * Admin comments page for the admin dashboard, displaying all comments with actions.
 * Features a minimalist, aesthetic, and centered UI design.
 * Requires a valid JWT token stored in localStorage for authenticated API calls.
 */
const Comments = () => {
    const [comments, setComments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setError("No authentication token found. Please log in.");
            setLoading(false);
            navigate("/login");
            return;
        }

        const fetchComments = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/comments`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setComments(response.data.content || response.data); // Handle both Page and List responses
                setError("");
                console.log("Fetched comments:", response.data); // Add this line to log the response data
            } catch (err) {
                let errorMessage = "Failed to load comments";
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
                console.error("Error fetching comments:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [token, navigate]);

    // Filter comments based on search term (client-side filtering)
    const filteredComments = comments.filter(comment =>
        comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.blogPost?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle comment deletion (hard delete)
    const handleDelete = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            if (!token || token.trim() === "") {
                setError("No valid authentication token found. Please log in.");
                navigate("/login");
                return;
            }

            console.log("Deleting comment with ID:", commentId);
            console.log("Token:", token);

            try {
                await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setComments(comments.filter(comment => comment.id !== commentId));
                setError("");
            } catch (err) {
                let errorMessage = "Failed to delete comment";
                if (err.response) {
                    errorMessage = `Error: ${err.response.status} - ${err.response.data.message || "Unauthorized or server error"}`;
                    console.log("Delete error response:", err.response);
                } else if (err.request) {
                    errorMessage = "Network error. Please check your connection.";
                } else {
                    errorMessage = `Unexpected error: ${err.message}`;
                }
                setError(errorMessage);
                console.error("Error deleting comment:", err);
            }
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-gray-500"></div>
                    <p className="text-gray-500 mt-2">Loading comments...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => fetchComments()}
                        className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Comment Management Hub</h1>
                    <p className="text-md text-gray-600">Manage all comments across posts</p>
                </div>
                <div className="w-1/3">
                    <input
                        type="text"
                        placeholder="Search by content, author, or post title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="space-y-4">
                    {filteredComments.length > 0 ? (
                        filteredComments.map(comment => (
                            <div
                                key={comment.id}
                                className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-between"
                            >
                                <div className="flex-1">
                                    <Link to={`/admin/comments/${comment.id}`} className="text-gray-900 hover:text-blue-600">
                                        <p className="text-lg font-semibold">{comment.content}</p>
                                        <p className="text-gray-600 text-sm">Post: {comment.blogPostTitle ? comment.blogPostTitle : "Unknown Post"}</p>
                                        <p className="text-gray-600 text-sm">By {comment.username || comment.email || "Anonymous"}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Created: {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "Unknown"}
                                        </p>
                                    </Link>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => navigate(`/admin/comments/edit/${comment.id}`)}
                                        className="relative bg-gradient-to-r from-gray-200 to-white text-black px-3 py-1 rounded-full font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-800 hover:to-blue-600 hover:text-white transform hover:-translate-y-1 transition-all duration-300 ease-in-out border border-gray-300"
                                    >
                                        <span className="relative z-10">Edit</span>
                                        <div className="absolute inset-0 rounded-full bg-blue-800 opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="relative bg-gradient-to-r from-gray-200 to-white text-black px-3 py-1 rounded-full font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-xl hover:bg-gradient-to-r hover:from-red-800 hover:to-red-600 hover:text-white transform hover:-translate-y-1 transition-all duration-300 ease-in-out border border-gray-300"
                                    >
                                        <span className="relative z-10">Delete</span>
                                        <div className="absolute inset-0 rounded-full bg-red-800 opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-center">No comments found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Comments;