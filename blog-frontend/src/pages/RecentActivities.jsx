import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecentActivities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchRecentActivities = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/api/activities/recent', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setActivities(response.data);
                setError("");
            } catch (err) {
                let errorMessage = "Failed to load recent activities";
                if (err.response) {
                    errorMessage = `Error: ${err.response.status} - ${err.response.data.message || "Unauthorized or server error"}`;
                } else if (err.request) {
                    errorMessage = "Network error. Please check your connection.";
                } else {
                    errorMessage = `Unexpected error: ${err.message}`;
                }
                setError(errorMessage);
                console.error("Error fetching recent activities:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentActivities();
    }, [token]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-gray-500"></div>
                    <p className="text-gray-500 mt-2">Loading recent activities...</p>
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
                        onClick={() => fetchRecentActivities()}
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
                    <h1 className="text-3xl font-extrabold text-gray-900">Recent Activities</h1>
                    <p className="text-md text-gray-600">Latest posts, comments, and user registrations</p>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <ul className="bg-white p-4 rounded-xl shadow-md space-y-4">
                    {activities.map((activity, index) => (
                        <li key={index} className="border-b border-gray-200 pb-4">
                            <p className="text-gray-700">{activity.description}</p>
                            <p className="text-gray-500 text-sm">Type: {activity.type}</p>
                            <p className="text-gray-500 text-sm">At: {new Date(activity.timestamp).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RecentActivities;