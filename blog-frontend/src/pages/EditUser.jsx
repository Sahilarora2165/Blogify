import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Edit user page for the admin dashboard, allowing updates with a success redirect.
 * Features a minimalist, aesthetic, and centered UI design.
 * Requires a valid JWT token stored in localStorage for authenticated API calls.
 */
const EditUser = () => {
    const { id } = useParams();
    const [user, setUser] = useState({ username: "", email: "", bio: "", profilePicture: null });
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

        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser({
                    username: response.data.username,
                    email: response.data.email,
                    bio: response.data.bio || "",
                    profilePicture: null, // Reset file input
                });
                setError("");
            } catch (err) {
                let errorMessage = "Failed to load user";
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
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("username", user.username);
        formData.append("email", user.email);
        formData.append("bio", user.bio || ""); // Optional bio field
        if (user.profilePicture instanceof File) {
            formData.append("profilePicture", user.profilePicture); // Append file only if updated
        }

        try {
            const response = await axios.put(`http://localhost:8080/api/users/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // ✅ Required for form-data
                },
            });

            console.log("User updated:", response.data);
            navigate(`/admin/users/${id}?success=User updated successfully!`);
            setError("");
        } catch (err) {
            console.error("Error updating user:", err.response ? err.response.data : err.message);
            let errorMessage = "Failed to update user";
            if (err.response) {
                errorMessage = `Error: ${err.response.status} - ${err.response.data.message || "Unauthorized or server error"}`;
            } else if (err.request) {
                errorMessage = "Network error. Please check your connection.";
            } else {
                errorMessage = `Unexpected error: ${err.message}`;
            }
            setError(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Edit User</h1>
                    <p className="text-lg text-gray-600 mb-4">Update user details effortlessly</p>
                    <div className="loading loading-spinner loading-lg text-gray-500"></div>
                    <p className="text-gray-500 mt-2">Loading user data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">Edit User Profile</h1>
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-700 mb-2">Username</label>
                            <input
                                type="text"
                                value={user.username}
                                onChange={(e) => setUser({ ...user, username: e.target.value })}
                                className="w-full p-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all duration-200"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                className="w-full p-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all duration-200"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Bio</label>
                            <textarea
                                value={user.bio}
                                onChange={(e) => setUser({ ...user, bio: e.target.value })}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setUser({ ...user, profilePicture: e.target.files[0] })}
                                className="w-full p-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex space-x-4 justify-center">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={() => navigate(`/admin/users/${id}`)}
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;
