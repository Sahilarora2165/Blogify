import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import HomeHeader from "../components/HomeHeader";
import { MessageCircle, X, ThumbsUp } from "lucide-react"; // Added ThumbsUp icon

const PostContent = () => {
    const { id } = useParams(); // Blog post ID from URL
    const navigate = useNavigate();

    // State variables
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likes, setLikes] = useState(0); // Changed initial value to number
    const [liked, setLiked] = useState(false); // Whether the user liked the post
    const [newComment, setNewComment] = useState(""); // New comment input
    const [showComments, setShowComments] = useState(false); // Control comment slide-in
    const token = localStorage.getItem("token"); // JWT token from localStorage

    // Disable body scrolling when comment panel is open
    useEffect(() => {
        if (showComments) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup function to reset overflow when component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showComments]);

    // Fetch post and comments
    useEffect(() => {
        const fetchPostAndComments = async () => {
            setLoading(true);
            setError(null);

            try {
                const postResponse = await axios.get(`http://localhost:8080/api/posts/${id}`, { timeout: 5000 });
                setPost(postResponse.data);

                const commentsResponse = await axios.get(`http://localhost:8080/api/comments/blog/${id}`, { timeout: 5000 });
                setComments(commentsResponse.data || []);
            } catch (err) {
                const errorDetails = {
                    message: err.message,
                    code: err.code,
                    status: err.response ? err.response.status : "No status",
                    data: err.response ? err.response.data : "No response data"
                };
                console.error("Error fetching post or comments:", errorDetails);
                if (err.code === "ERR_NETWORK") {
                    setError("Cannot connect to the server. Please check if it's running.");
                } else if (err.response?.status === 404) {
                    setError("Post or comments not found.");
                } else if (err.response?.status === 403) {
                    setError("Access denied. Please log in if required.");
                } else {
                    setError("An unexpected error occurred.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPostAndComments();
    }, [id]);

    // Fetch the like count and whether the user has liked it:
    useEffect(() => {
        const fetchLikes = async () => {
            try {
                // Fetch total like count for the post
                const likesResponse = await axios.get(`http://localhost:8080/api/likes/count/${id}`, {
                    timeout: 5000
                });
                // Convert likes to a number to ensure proper math operations
                setLikes(Number(likesResponse.data)); // Store total like count as number

                // Check if the user has liked the post (only if logged in)
                if (!token) return; // No token means user is not logged in

                // Get user ID from backend
                const userResponse = await axios.get("http://localhost:8080/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 5000
                });
                const userId = userResponse.data.id;

                // Check if user has liked the post
                const userLikeResponse = await axios.get(`http://localhost:8080/api/likes/status`, {
                    params: { userId, blogPostId: id },
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 5000
                });

                setLiked(userLikeResponse.data); // Boolean: true if liked, false otherwise
            } catch (err) {
                console.error("Error fetching likes:", {
                    message: err.message,
                    status: err.response ? err.response.status : "No status",
                    data: err.response ? err.response.data : "No response data"
                });

                if (err.response?.status === 403) {
                    setError("Session expired. Please log in again.");
                    navigate("/login");
                } else {
                    setError("Failed to fetch likes.");
                }
            }
        };

        fetchLikes();
    }, [id, token]); // Runs when 'id' or 'token' changes


    const handleLikeToggle = async () => {
        if (!token) {
            setError("Please log in to like posts.");
            navigate("/login");
            return;
        }

        try {
            // Step 1: Get user ID
            const userResponse = await axios.get("http://localhost:8080/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000
            });
            const userId = userResponse.data.id;

            // Calculate the new state before making the API call
            const newLikedState = !liked;
            const newLikeCount = newLikedState ? likes + 1 : likes - 1;
            
            // Update UI immediately (optimistic update)
            setLiked(newLikedState);
            setLikes(newLikeCount);

            // Step 2: Toggle like (API call)
            await axios.post(
                "http://localhost:8080/api/likes/toggle",
                null, // No request body, just params
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { userId, blogPostId: id }, // Send userId & postId as query params
                    timeout: 5000
                }
            );

            // No need to update UI again - we already did it optimistically
            // The server response doesn't actually tell us the new state reliably

        } catch (err) {
            console.error("Error toggling like:", {
                message: err.message,
                status: err.response ? err.response.status : "No status",
                data: err.response ? err.response.data : "No response data"
            });

            // Revert the optimistic update since the API call failed
            setLiked(liked); // Revert to original state
            setLikes(liked ? likes : likes - 1); // Revert like count

            if (err.response?.status === 403) {
                setError("Session expired. Please log in again.");
                navigate("/login");
            } else {
                setError("Failed to update like status.");
            }
        }
    };

    // Handle comment submission
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setError("Please log in to comment.");
            navigate("/login");
            return;
        }
        if (!newComment.trim()) return;

        try {
            const userResponse = await axios.get("http://localhost:8080/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000
            });
            const userId = userResponse.data.id;

            const commentResponse = await axios.post(
                "http://localhost:8080/api/comments",
                newComment, // Plain text body
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "text/plain" // Match backend expectation
                    },
                    params: { // Send userId and blogPostId as query params
                        userId,
                        blogPostId: id
                    },
                    timeout: 5000
                }
            );
            setComments([...comments, commentResponse.data]);
            setNewComment("");
            setError(null);
        } catch (err) {
            const errorDetails = {
                message: err.message,
                code: err.code,
                status: err.response ? err.response.status : "No status",
                data: err.response ? err.response.data : "No response data"
            };
            console.error("Error posting comment:", errorDetails);
            if (err.response?.status === 403) {
                setError("Forbidden: Invalid or expired token. Please log in again.");
                navigate("/login");
            } else if (err.response?.status === 400) {
                setError("Invalid comment data.");
            } else {
                setError("Failed to post comment.");
            }
        }
    };

    // Toggle comment section visibility
    const toggleComments = () => {
        setShowComments(!showComments);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    // Error or no post state
    if (error || !post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600">{error || "Post not found."}</p>
            </div>
        );
    }

    // Main content
    return (
        <div className="min-h-screen bg-white">
            <HomeHeader />

            {/* Main content with proper spacing to prevent header overlap */}
            <div className="max-w-3xl mx-auto pt-24 pb-12 px-4 sm:px-6">
                {/* Post Content */}
                <article className="mb-16">
                    {/* Title first */}
                    <h1 className="text-5xl font-bold text-gray-900 mb-6 font-serif leading-tight">
                        {post.title}
                    </h1>

                    {/* Author info with comment and like buttons */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                    {post.username ? post.username[0].toUpperCase() : "U"}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {post.username || "Unknown"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Buttons Container */}
                        <div className="flex items-center space-x-4">
                            {/* Like Button with ThumbsUp icon */}
                            <button 
                                onClick={handleLikeToggle} 
                                className="flex items-center space-x-2 transition-colors focus:outline-none"
                            >
                                <ThumbsUp 
                                    className={`w-5 h-5 ${liked ? 'text-blue-600 fill-blue-600' : 'text-gray-500 hover:text-gray-900'}`} 
                                />
                                <span className={`text-sm font-medium ${liked ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
                                    {likes}
                                </span>
                            </button>

                            {/* Comment Button */}
                            <button
                                onClick={toggleComments}
                                className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">{comments.length}</span>
                            </button>
                        </div>
                    </div>

                    {/* Image after author info */}
                    {post.imageUrl && (
                        <img
                            src={`http://localhost:8080${post.imageUrl}`}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-96 object-cover mb-8 rounded-xl"
                            onError={(e) => {
                                e.target.style.display = "none";
                                console.error("Failed to load image:", post.imageUrl);
                            }}
                        />
                    )}

                    {/* Content last */}
                    <div className="prose prose-lg max-w-none text-gray-700 font-serif">
                        <p
                            className="text-2xl leading-8 mb-8 text-gray-600"
                            style={{ whiteSpace: "pre-wrap" }}
                        >
                            {post.content}
                        </p>
                    </div>
                </article>

                {/* Slide-in Comments Panel */}
                <div
                    className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg transform transition-transform duration-300 z-50 ${showComments ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    style={{ overflowY: 'auto', overflowX: 'hidden' }}
                >
                    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Responses ({comments.length})
                            </h2>
                            <button
                                onClick={toggleComments}
                                className="text-gray-500 hover:text-gray-900"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Comment Form */}
                        <div className="mb-8">
                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    {token ? (
                                        <span className="text-sm font-medium text-gray-600">
                                            {localStorage.getItem("username")?.[0].toUpperCase() || "Y"}
                                        </span>
                                    ) : (
                                        <span className="text-sm font-medium text-gray-600">?</span>
                                    )}
                                </div>
                                <form onSubmit={handleCommentSubmit} className="flex-1">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="What are your thoughts?"
                                        className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 resize-none text-lg font-serif placeholder-gray-400"
                                        rows="3"
                                    />
                                    <div className="flex justify-end mt-4">
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50"
                                            disabled={!newComment.trim()}
                                        >
                                            Respond
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Comments List */}
                        {comments.length > 0 ? (
                            <div className="space-y-8 pb-12">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex items-start space-x-4">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-gray-600">
                                                {comment.username ? comment.username[0].toUpperCase() : "A"}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {comment.username || "Anonymous"}
                                                </p>
                                                <span className="text-gray-500 text-sm">·</span>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <p className="text-gray-700 font-serif leading-relaxed">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">
                                No responses yet. Be the first to share your thoughts.
                            </p>
                        )}
                    </div>
                </div>

                {/* Overlay that appears when comment panel is open */}
                {showComments && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:block"
                        onClick={toggleComments}
                    ></div>
                )}
            </div>
        </div>
    );
};

export default PostContent;