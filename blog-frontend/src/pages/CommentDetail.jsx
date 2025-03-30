import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Comment detail page for the admin dashboard, displaying full comment details.
 * Features a minimalist, aesthetic, and centered UI design.
 * Requires a valid JWT token stored in localStorage for authenticated API calls.
 */
const CommentDetail = () => {
    const { id } = useParams();
    const [comment, setComment] = useState(null);
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

        const fetchComment = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/comments/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setComment(response.data);
                setError("");
            } catch (err) {
                let errorMessage = "Failed to load comment";
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
                console.error("Error fetching comment:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchComment();
    }, [id, token, navigate]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-gray-500"></div>
                    <p className="text-gray-500 mt-2">Loading comment details...</p>
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
                        onClick={() => fetchComment()}
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
                    <h1 className="text-3xl font-extrabold text-gray-900">Comment Details</h1>
                    <p className="text-md text-gray-600">View full comment information</p>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <div className="space-y-6">
                        <div>
                            <p className="text-lg font-semibold text-gray-900">{comment.content}</p>
                        </div>
                        <div className="mt-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Author Information</h4>
                            <p className="text-gray-600 text-sm">Name: {comment.username || "Anonymous"}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Created: {new Date(comment.createdAt).toLocaleString()}
                            </p>
                            <p className="text-gray-600 text-sm mt-2">Post ID: {comment.blogPostId || "Unknown Post"}</p>
                            <p className="text-gray-600 text-sm mt-2">Post Title: {comment.blogPostTitle || "Unknown Post"}</p>
                        </div>
                    </div>
                    <div className="mt-6 flex space-x-3 justify-end">
                        <button
                            onClick={() => navigate(`/admin/comments/edit/${comment.id}`)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors duration-200 text-sm"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => navigate("/admin/comments")}
                            className="bg-gray-500 text-white px-3 py-1 rounded-full hover:bg-gray-600 transition-colors duration-200 text-sm"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentDetail;