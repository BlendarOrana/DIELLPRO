import axios from "axios";

// This is the core logic
const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
});

export default axiosInstance;