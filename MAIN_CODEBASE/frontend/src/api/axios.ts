import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false, // ✅ JWT auth does NOT use cookies
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sentinai_token");

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
