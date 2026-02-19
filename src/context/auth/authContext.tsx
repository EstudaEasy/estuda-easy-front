"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { IAuthContext, UserDataJWT } from "./authContext.types";
import { CreateUserRequest, LoginRequest, UserResponse } from "@/types";
import AuthService from "@/services/auth/AuthService";
import UserService from "@/services/user/UserService";

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("@EstudaEasy:accessToken");
    if (token) {
      try {
        const userData = extractUserFromJWT();
        if (userData) {
          const userResponse: UserResponse = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role as "user" | "admin",
            createdAt: "",
            updatedAt: "",
          };
          setUser(userResponse);
        }
      } catch (error) {
        console.log("Erro ao carregar usuário:", error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  async function login(request: LoginRequest) {
    try {
      const { data } = await AuthService.login(request);

      if (data.accessToken && data.refreshToken) {
        localStorage.setItem("@EstudaEasy:accessToken", data.accessToken);
        localStorage.setItem("@EstudaEasy:refreshToken", data.refreshToken);

        await fetch("/api/auth/set-cookies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          }),
        });

        const userData = extractUserFromJWT();
        if (userData) {
          const userResponse: UserResponse = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role as "user" | "admin",
            createdAt: "",
            updatedAt: "",
          };
          setUser(userResponse);
        }
      }
    } catch (error) {
      throw error;
    }
  }
  async function logout() {
    localStorage.removeItem("@EstudaEasy:accessToken");
    localStorage.removeItem("@EstudaEasy:refreshToken");

    await fetch("/api/auth/set-cookies", {
      method: "DELETE",
    });

    setUser(null);
    window.location.reload();
  }

  async function register(request: CreateUserRequest) {
    try {
      await UserService.createUser(request);
    } catch (error) {
      throw error;
    }
  }

  function extractUserFromJWT(): UserDataJWT | null {
    const accessToken = localStorage.getItem("@EstudaEasy:accessToken");

    if (!accessToken) throw new Error("Token de acesso não encontrado");

    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const userData: UserDataJWT = {
        id: payload.user.id,
        name: payload.user.name,
        email: payload.user.email,
        role: payload.user.role,
      };
      return userData;
    } catch (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ login, logout, register, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
