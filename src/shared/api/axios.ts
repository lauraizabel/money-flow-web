import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

let logoutCallback: (() => void) | null = null;
let redirectCallback: ((path: string) => void) | null = null;

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

export const setRedirectCallback = (callback: (path: string) => void) => {
  redirectCallback = callback;
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (logoutCallback) {
        logoutCallback();
      }
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        // Usar callback de redirect se disponível (React Router), senão usar window.location
        if (redirectCallback) {
          redirectCallback("/login");
        } else {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
