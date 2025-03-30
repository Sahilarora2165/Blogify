import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Edit comment page for the admin dashboard, allowing optional updates to comment content.
 * Features a minimalist, aesthetic, and centered UI design.
 * Requires a valid JWT token stored in localStorage for authenticated API calls.
 */
const EditComment = () => {
    const { id } = useParams();
    const [comment, setComment] = useState({ content: "" });
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
                setComment({ content: response.data.content || "" });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/api/comments/${id}`, comment.content, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'text/plain',
                },
            });
            navigate(`/admin/comments/${id}?success=Comment updated successfully!`);
            setError("");
        } catch (err) {
            let errorMessage = "Failed to update comment";
            if (err.response) {
                errorMessage = `Error: ${err.response.status} - ${err.response.data.message || "Unauthorized or server error"}`;
            } else if (err.request) {
                errorMessage = "Network error. Please check your connection.";
            } else {
                errorMessage = `Unexpected error: ${err.message}`;
            }
            setError(errorMessage);
            console.error("Error updating comment:", err);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-gray-500"></div>
                    <p className="text-gray-500 mt-2">Loading comment data...</p>
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
                    <h1 className="text-3xl font-extrabold text-gray-900">Edit Comment</h1>
                    <p className="text-md text-gray-600">Update comment details seamlessly </p>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Content</label>
                            <textarea
                                value={comment.content}
                                onChange={(e) => setComment({ ...comment, content: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 h-40"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex space-x-3 justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors duration-200 text-sm"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={() => navigate(`/comments/${id}`)}
                            className="bg-gray-500 text-white px-3 py-1 rounded-full hover:bg-gray-600 transition-colors duration-200 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditComment;