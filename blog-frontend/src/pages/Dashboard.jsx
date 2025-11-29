import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Dashboard component displaying statistics for users, posts, and comments, along with recent activities.
 * Requires a valid JWT token stored in localStorage for authenticated API calls.
 * 
 * Performance optimization: Uses consolidated /api/dashboard/stats endpoint instead of 4 separate API calls.
 * This reduces network overhead and improves page load time.
 */
const Dashboard = () => {
    const [stats, setStats] = useState([
        { title: "Total Users", value: "Loading...", link: "/admin/users" },
        { title: "Total Posts", value: "Loading...", link: "/admin/posts" },
        { title: "Total Comments", value: "Loading...", link: "/admin/comments" },
    ]);
    const [recentActivities, setRecentActivities] = useState([]);
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

        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Single API call instead of 4 separate calls - Performance optimization
                const response = await axios.get("http://localhost:8080/api/dashboard/stats", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const { userCount, postCount, commentCount, recentActivities: activities } = response.data;

                setStats([
                    { title: "Total Users", value: userCount.toLocaleString(), link: "/admin/users" },
                    { title: "Total Posts", value: postCount.toLocaleString(), link: "/admin/posts" },
                    { title: "Total Comments", value: commentCount.toLocaleString(), link: "/admin/comments" },
                ]);
                setRecentActivities(activities.slice(0, 5));
                setError("");
            } catch (err) {
                let errorMessage = "Failed to load dashboard data";
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
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-black mb-4 tracking-wide">DASHBOARD</h1>
                    <p className="text-lg text-gray-400 animate-pulse">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-white p-8 flex flex-col">
            <h1 className="text-4xl font-extrabold text-center text-black mb-8 tracking-wide uppercase">
                Dashboard
            </h1>

            {error && (
                <p className="text-black text-center mb-6 bg-gray-200 p-3 rounded-lg shadow-md">
                    {error}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <Link
                        to={stat.link}
                        key={index}
                        className="bg-black text-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                        <h2 className="text-xl font-semibold mb-2 tracking-tight">{stat.title}</h2>
                        <p className="text-4xl font-bold">{stat.value}</p>
                    </Link>
                ))}
            </div>

            <div className="flex-1 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-black mb-6 tracking-wide">Recent Activity</h2>
                <div className="overflow-y-auto max-h-[calc(100vh-400px)] space-y-6">
                    {recentActivities.length > 0 ? (
                        recentActivities.map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-start p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200"
                            >
                                <span className="inline-block w-3 h-3 mt-2 mr-4 rounded-full bg-black flex-shrink-0"></span>
                                <div>
                                    <p className="text-black font-medium">
                                        <span className="font-semibold">{activity.type}:</span>{" "}
                                        {activity.description}
                                    </p>
                                    <span className="text-sm text-gray-500 block mt-1">
                                        {new Date(activity.timestamp).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-center p-4">No recent activity.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;