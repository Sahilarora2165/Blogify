import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import HomeHeader from "../components/HomeHeader";
import Footer from "../components/Footer"; // Import the Footer component

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/posts");
        const fetchedPosts = response.data.content || response.data;
        // Add random height to each post for dynamic sizing
        const postsWithRandomHeight = fetchedPosts.map(post => ({
          ...post,
          cardHeight: Math.floor(Math.random() * (400 - 300 + 1)) + 300, // Random height between 300px and 400px
        }));
        setPosts(postsWithRandomHeight);
        setError("");
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <h1 className="text-5xl font-playfair font-light text-gray-900 mb-4 tracking-wider animate-pulse">
            Blogify
          </h1>
          <p className="text-lg font-cormorant text-gray-500">Loading your stories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <p className="text-gray-700 font-cormorant text-lg text-center bg-gray-100 p-4 rounded-xl shadow-md border border-gray-200">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <HomeHeader onSearch={setSearchQuery} />
      
      {/* Main content should expand to push the footer down */}
      <div className="flex-grow max-w-7xl mx-auto pt-20">
        {/* Pinterest-like grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-min">
          {filteredPosts.map(post => (
            <Link
              key={post.id}
              to={`/posts/${post.id}`}
              className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden group relative"
              style={{ minHeight: `${post.cardHeight}px` }}
            >
              {/* Image Section */}
              {post.imageUrl ? (
                <div className="relative w-full h-64 mb-5 overflow-hidden">
                  <img
                    src={`http://localhost:8080${post.imageUrl}`}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                      console.error("Image failed to load:", `http://localhost:8080${post.imageUrl}`);
                    }}
                  />
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </div>
              ) : (
                <div className="relative w-full h-64 mb-5 flex items-center justify-center bg-gray-100 rounded-xl">
                  <span className="text-gray-400 font-cormorant text-sm">No Image Available</span>
                </div>
              )}
  
              {/* Content Section */}
              <div className="p-6">
                <p className="text-sm font-cormorant font-medium text-gray-600 mb-2">
                  By {post.username || post.author || "Unknown Author"}
                </p>
                <h2 className="text-xl font-playfair font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-700 font-cormorant text-base line-clamp-3 leading-relaxed">
                  {post.content}
                </p>
                <p className="text-gray-500 font-cormorant text-xs mt-3">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
  
              {/* Hover Effect: Read More Button */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-full bg-white text-black text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-md">
                  Read More
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
  
      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};  

export default HomePage;