import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
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
                setUser(response.data);
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">USER DETAILS</h1>
                    <div className="loading loading-spinner loading-lg text-gray-500"></div>
                    <p className="text-gray-500 mt-2">Loading user details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => fetchUser()}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">USER DETAILS</h1>
                <div className="bg-white p-8 rounded-2xl shadow-md">
                    <div className="space-y-4">
                        <p className="text-gray-800"><strong>Username:</strong> {user.username}</p>
                        <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
                        <p className="text-gray-600"><strong>Role:</strong> {user.role}</p>
                        <p className="text-gray-500"><strong>Joined:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                        {user.lastLogin && <p className="text-gray-500"><strong>Last Login:</strong> {new Date(user.lastLogin).toLocaleString()}</p>}
                    </div>
                    <div className="mt-6 flex space-x-4 justify-center">
                        <button
                            onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => navigate("/admin/users")}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;  