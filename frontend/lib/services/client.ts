import axios from "axios";

const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor — unwrap errors into a consistent shape
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
