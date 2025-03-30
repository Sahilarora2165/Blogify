import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(8); // Increased to show more users per page
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setError("No authentication token found. Please log in.");
            setLoading(false);
            navigate("/login");
            return;
        }

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8080/api/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
                setError("");
            } catch (err) {
                let errorMessage = "Failed to load users";
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
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token, navigate]);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:8080/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(users.filter(user => user.id !== userId));
                setError("");
            } catch (err) {
                let errorMessage = "Failed to delete user";
                if (err.response) {
                    errorMessage = `Error: ${err.response.status} - ${err.response.data.message || "Unauthorized or server error"}`;
                } else if (err.request) {
                    errorMessage = "Network error. Please check your connection.";
                } else {
                    errorMessage = `Unexpected error: ${err.message}`;
                }
                setError(errorMessage);
                console.error("Error deleting user:", err);
            }
        }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="  text-center">
                    <div className="loading loading-spinner loading-lg text-gray-500"></div>
                    <p className="text-gray-500 mt-2">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">User Management Hub</h1>
                    <p className="text-md text-gray-600">Oversee your blog community</p>
                </div>
                <div className="w-1/3">
                    <input
                        type="text"
                        placeholder="Search by username, email, or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
                    />
                </div>
            </div>

            {error && (
                <p className="text-red-500 text-center mb-4">
                    {error}
                    <button
                        onClick={() => fetchUsers()}
                        className="ml-2 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                        Retry
                    </button>
                </p>
            )}

            <div className="flex-1 overflow-auto">
                <div className="space-y-4">
                    {currentUsers.length > 0 ? (
                        currentUsers.map(user => (
                            <div
                                key={user.id}
                                className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-between"
                            >
                                <div className="flex-1">
                                    <Link to={`/admin/users/${user.id}`} className="text-gray-900 hover:text-blue-600">
                                        <h3 className="text-lg font-semibold">{user.username}</h3>
                                        <p className="text-gray-600 text-sm">{user.email}</p>
                                        <p className="text-xs text-gray-500 mt-1">Role: {user.role}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Joined: {new Date(user.createdAt).toLocaleString()}
                                        </p>
                                    </Link>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                                        className="relative bg-gradient-to-r from-gray-200 to-white text-black px-2 py-0.5 rounded-full font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-800 hover:to-blue-600 hover:text-white transform hover:-translate-y-1 transition-all duration-300 ease-in-out border border-gray-300"
                                    >
                                        <span className="relative z-10">Edit</span>
                                        <div className="absolute inset-0 rounded-full bg-blue-800 opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="relative bg-gradient-to-r from-gray-200 to-white text-black px-2 py-0.5 rounded-full font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-xl hover:bg-gradient-to-r hover:from-red-800 hover:to-red-600 hover:text-white transform hover:-translate-y-1 transition-all duration-300 ease-in-out border border-gray-300"
                                    >
                                        <span className="relative z-10">Delete</span>
                                        <div className="absolute inset-0 rounded-full bg-red-800 opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-center">No users found.</p>
                    )}
                </div>
            </div>

            {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`w-8 h-8 rounded-full ${currentPage === i + 1
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                } text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Users;