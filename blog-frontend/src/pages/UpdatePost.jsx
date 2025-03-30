import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { Image, X } from "lucide-react";
import { motion } from "framer-motion";

const UpdatePost = () => {
  const { postId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const post = response.data;
        setTitle(post.title);
        setContent(post.content);
        if (post.imageUrl) {
          setCurrentImage(`${BASE_URL}${post.imageUrl}`);
        }
      } catch (err) {
        setError("Failed to fetch post details.");
        console.error("Error fetching post:", err);
      }
    };
    fetchPost();
  }, [postId, token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setCurrentImage(null);
  };

  const handleUpdatePost = async () => {
    if (!token) {
      setError("Please log in to update the post.");
      navigate("/login");
      return;
    }
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    const formData = new FormData();
    formData.append("blogPost", new Blob([JSON.stringify({ title, content })], { type: "application/json" }));
    if (image instanceof File) {
      formData.append("file", image);
    }

    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/api/posts/${postId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });
      navigate("/profile");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update post.";
      setError(errorMessage);
      console.error("Error updating post:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-12 px-4">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="max-w-3xl w-full bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
  >
    {/* Header */}
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="text-3xl font-bold text-gray-900 mb-6 tracking-tight"
    >
      Update Post
    </motion.h1>

    {/* Error Message */}
    {error && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border-l-4 border-red-500"
      >
        {error}
      </motion.div>
    )}

    {/* Title */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="mb-6"
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
        className="text-xl font-medium text-gray-900 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg focus:border-gray-300 focus:ring-2 focus:ring-gray-100 focus:outline-none py-3 px-4 transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md"
      />
    </motion.div>

    {/* Image Section */}
    {(image || currentImage) && (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative mb-6"
      >
        <img
          src={image ? URL.createObjectURL(image) : currentImage}
          alt="Post preview"
          className="w-full h-60 object-cover rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRemoveImage}
          className="absolute top-2 right-2 bg-white text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-md"
        >
          <X size={16} />
        </motion.button>
      </motion.div>
    )}

    {/* Content Section */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mb-6 relative"
    >
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your content..."
        className="text-base text-gray-900 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-5 min-h-[200px] resize-y focus:border-gray-300 focus:ring-2 focus:ring-gray-100 focus:outline-none transition-all duration-300 placeholder-gray-400 shadow-sm hover:shadow-md leading-relaxed tracking-wide"
      />
      {/* Scrollbar Styling */}
      <style jsx>{`
        textarea::-webkit-scrollbar {
          width: 8px;
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        textarea::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </motion.div>

    {/* Image Upload */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="mb-6"
    >
      <label
        htmlFor="image-upload"
        className="flex items-center gap-2 bg-gradient-to-br from-gray-900 to-black text-white px-4 py-2 rounded-full hover:bg-gray-800 cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg"
      >
        <Image size={18} />
        <span className="text-sm font-medium">
          {image || currentImage ? "Change Image" : "Add Image"}
        </span>
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </motion.div>

    {/* Buttons */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="flex justify-end gap-3"
    >
      <Button
        variant="outline"
        onClick={() => navigate("/profile")}
        className="bg-white text-gray-700 border border-gray-200 rounded-full px-5 py-2 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        Cancel
      </Button>
      <Button
        onClick={handleUpdatePost}
        disabled={loading}
        className="bg-gradient-to-br from-gray-900 to-black text-white rounded-full px-5 py-2 hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Updating..." : "Update"}
      </Button>
    </motion.div>
  </motion.div>
</div>
  );
};

export default UpdatePost;