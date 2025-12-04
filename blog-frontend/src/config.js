// API Configuration
// Use environment variable for API base URL
// In Docker: VITE_API_URL will be set to "/api" at build time
// In development: defaults to "http://localhost:8080/api"
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// For image URLs and other full URL needs
// In Docker: use relative path "" since nginx serves everything
// In development: use full localhost URL
export const BASE_URL = import.meta.env.VITE_API_URL ? "" : "http://localhost:8080";
