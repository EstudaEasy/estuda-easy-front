import { api } from "../api";
import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "@/types";

const AuthService = {
  login(data: LoginRequest) {
    return api.post<LoginResponse>("/auth/login", data);
  },

  logout(data: LogoutRequest) {
    return api.post("/auth/logout", data);
  },

  refreshToken(data: RefreshTokenRequest) {
    return api.post<RefreshTokenResponse>("/auth/refresh", data);
  },
};

export default AuthService;
