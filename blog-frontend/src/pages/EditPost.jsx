import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Edit post page for the admin dashboard, allowing optional updates to post details including images.
 * Features a minimalist, aesthetic, and centered UI design with support for very long blog content.
 * Requires a valid JWT token stored in localStorage for authenticated API calls.
 */
const EditPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState({ title: "", content: "", imageUrl: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null); // State for the new image file
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const maxLength = 16777215; // Matches MEDIUMTEXT (~16MB)

    useEffect(() => {
        if (!token) {
            setError("No authentication token found. Please log in.");
            setLoading(false);
            navigate("/login");
            return;
        }

        const fetchPost = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/posts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPost({
                    title: response.data.title || "",
                    content: response.data.content || "",
                    imageUrl: response.data.imageUrl || "",
                });
                setError("");
            } catch (err) {
                let errorMessage = "Failed to load post";
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
                console.error("Error fetching post:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const uiWarnLength = 1048576; // 1MB in chars, adjust as needed
        if (post.content.length > uiWarnLength && !window.confirm(`Content is very long (${post.content.length} characters). Proceed anyway?`)) {
            return;
        }

        const formData = new FormData();
        const blogPostData = {};
        if (post.title) blogPostData.title = post.title;
        if (post.content) blogPostData.content = post.content;
        if (Object.keys(blogPostData).length > 0) {
            formData.append("blogPost", JSON.stringify(blogPostData));
        }
        if (imageFile) formData.append("file", imageFile);

        console.log("FormData entries:", Array.from(formData.entries()));
        console.log("Post state:", post);
        console.log("Image file:", imageFile);
        console.log("Token:", token);

        try {
            const response = await axios.put(`http://localhost:8080/api/posts/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Update response:", response.data);
            navigate(`/admin/posts/${id}?success=Post updated successfully!`);
            setError("");
        } catch (err) {
            let errorMessage = "Failed to update post";
            if (err.response) {
                errorMessage = `Error: ${err.response.status} - ${err.response.data.message || "Unauthorized or server error"}`;
                console.log("Error response:", err.response);
            } else if (err.request) {
                errorMessage = "Network error. Please check your connection.";
            } else {
                errorMessage = `Unexpected error: ${err.message}`;
            }
            setError(errorMessage);
            console.error("Error updating post:", err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setImageFile(file);
    };

    const removeNewImage = () => {
        setImageFile(null);
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-gray-500"></div>
                    <p className="text-gray-500 mt-2">Loading post data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => fetchPost()}
                        className="ml-2 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors"
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
                    <h1 className="text-3xl font-extrabold text-gray-900">Edit Post</h1>
                    <p className="text-md text-gray-600">Update post details seamlessly (optional fields)</p>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-gray-700 mb-2">Title (Optional)</label>
                            <input
                                id="title"
                                type="text"
                                value={post.title || ""}
                                onChange={(e) => setPost({ ...post, title: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="content" className="block text-gray-700 mb-2">Content (Optional)</label>
                            <textarea
                                id="content"
                                value={post.content || ""}
                                onChange={(e) => setPost({ ...post, content: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 h-64 resize-y"
                                placeholder="Write your blog post here..."
                            />
                            <p className="text-gray-500 text-sm mt-1">
                                {post.content.length.toLocaleString()} / {maxLength.toLocaleString()} characters
                            </p>
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-gray-700 mb-2">Image (Optional, Upload New)</label>
                            <div className="relative">
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                />
                            </div>
                            <div className="mt-4 space-y-2">
                                {imageFile && (
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={URL.createObjectURL(imageFile)}
                                            alt="New upload preview"
                                            className="w-24 h-24 object-cover rounded-lg shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeNewImage}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                                {post.imageUrl && !imageFile && (
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={`http://localhost:8080${post.imageUrl}`}
                                            alt="Current post"
                                            className="w-24 h-24 object-cover rounded-lg shadow-sm"
                                        />
                                        <p className="text-gray-600 text-sm">Current Image</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex space-x-3 justify-end">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-black to-gray-800 text-white px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-gray-700 hover:to-black transition-all duration-300 shadow-md"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/admin/posts/${id}`)}
                            className="bg-gradient-to-r from-gray-200 to-white text-black px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-100 transition-all duration-300 shadow-md"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPost;