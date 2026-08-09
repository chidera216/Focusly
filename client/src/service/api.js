import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if ((status === 401 || status === 404) && message === "User not found") {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
