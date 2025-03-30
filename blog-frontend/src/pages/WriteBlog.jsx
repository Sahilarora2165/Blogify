import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { Image, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const WriteBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const BASE_URL = "http://localhost:8080";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handlePublish = async () => {
    if (!token) {
      setError("Please log in to create a post.");
      navigate("/login");
      return;
    }

    if (!title || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    const formData = new FormData();
    formData.append(
      "blogPost",
      new Blob([JSON.stringify({ title, content })], { type: "application/json" })
    );

    if (image) {
      formData.append("file", image);
    }

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 text-sm font-cormorant font-medium"
        >
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-900 relative group transition-all duration-300 ease-in-out"
          >
            Home
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
          </Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-900">Write</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100"
        >
          {/* Error Message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm text-center mb-8 bg-red-50 p-4 rounded-xl shadow-inner"
            >
              {error}
            </motion.p>
          )}

          {/* Title Input */}
          <div className="relative mb-8">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-4xl font-playfair font-semibold text-gray-900 border-none focus:ring-0 placeholder-gray-400 bg-transparent p-0 tracking-wide"
              placeholder="Craft Your Title"
            />
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gray-900 to-gray-600"
              initial={{ width: "0%" }}
              whileFocus={{ width: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {/* Add Image Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 flex justify-start"
          >
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-200 text-gray-800 px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:from-gray-100 hover:to-gray-300 transition-all duration-300"
            >
              <Image size={20} className="text-gray-600" />
              <span className="text-sm font-cormorant font-medium tracking-wide">Add Cover Image</span>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </motion.div>

          {/* Image Preview */}
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative mb-10"
            >
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-full h-80 object-cover rounded-2xl shadow-lg border border-gray-100"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-4 right-4 bg-gray-900/80 text-white p-2 rounded-full hover:bg-gray-900 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <X size={18} />
              </button>
            </motion.div>
          )}

          {/* Content Textarea */}
          <div className="relative mb-12">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="text-lg font-cormorant text-gray-800 border-none focus:ring-0 placeholder-gray-400 bg-transparent p-0 resize-none h-96 leading-relaxed tracking-wide"
              placeholder="Weave your story here..."
            />
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gray-900 to-gray-600"
              initial={{ width: "0%" }}
              whileFocus={{ width: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-full shadow-md hover:shadow-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-300 font-cormorant text-sm font-medium tracking-wide"
              >
                Cancel
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handlePublish}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-full shadow-lg hover:shadow-xl hover:from-gray-800 hover:to-gray-600 transition-all duration-300 font-playfair text-sm font-semibold tracking-wide disabled:bg-gray-500 disabled:shadow-md disabled:cursor-not-allowed"
              >
                {loading ? "Publishing..." : "Publish Now"}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WriteBlog;