import { authApi } from "../api";
import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "@/types";

const AuthService = {
  login(data: LoginRequest) {
    return authApi.post<LoginResponse>("/auth/login", data);
  },

  logout(data: LogoutRequest) {
    return authApi.post("/auth/logout", data);
  },

  refreshToken(data: RefreshTokenRequest) {
    return authApi.post<RefreshTokenResponse>("/auth/refresh", data);
  },
};

export default AuthService;
