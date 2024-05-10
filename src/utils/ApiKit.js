import axios from "axios";
import localStorageKit from "./LocalStorageKit";

const apiKit = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

apiKit.interceptors.request.use(
  (config) => {
    const token = localStorageKit.getTokenFromStorage();
    if (token && token.access) {
      // Ensure token.access is used
      config.headers["Authorization"] = `Bearer ${token.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiKit;
