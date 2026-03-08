import axios from "axios";
import AuthService from "./auth/AuthService";

// Instância separada para chamadas de autenticação (sem interceptors)
export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Instância principal com interceptors
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@EstudaEasy:accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    if (error.response?.status === 401 && !config._retry) {
      config._retry = true;
      try {
        const refreshToken = localStorage.getItem("@EstudaEasy:refreshToken");
        if (refreshToken) {
          const { data: response } = await AuthService.refreshToken({ refreshToken });

          localStorage.setItem("@EstudaEasy:accessToken", response.accessToken);
          localStorage.setItem("@EstudaEasy:refreshToken", response.refreshToken);

          await fetch("/api/auth/set-cookies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
            }),
          });

          config.headers.Authorization = `Bearer ${response.accessToken}`;
          return api(config);
        }
      } catch (err) {
        // Limpar tudo em caso de erro
        localStorage.removeItem("@EstudaEasy:accessToken");
        localStorage.removeItem("@EstudaEasy:refreshToken");

        // Remover cookies via API route
        await fetch("/api/auth/set-cookies", { method: "DELETE" });

        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);
