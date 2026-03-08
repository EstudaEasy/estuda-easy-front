import { authApi } from "../api";
import {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResetPasswordRequest,
} from "@/types";

const AuthService = {
  login(data: LoginRequest) {
    return authApi.post<LoginResponse>("/auth/login", data);
  },

  logout(data: LogoutRequest) {
    return authApi.post<void>("/auth/logout", data);
  },

  refreshToken(data: RefreshTokenRequest) {
    return authApi.post<RefreshTokenResponse>("/auth/refresh", data);
  },

  forgotPassword(data: ForgotPasswordRequest) {
    return authApi.post<void>("/auth/password/forgot", data);
  },

  resetPassword(data: ResetPasswordRequest) {
    return authApi.post<void>("/auth/password/reset", data);
  },
};

export default AuthService;
