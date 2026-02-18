import { components } from "./api";
import { User } from "./user";

export type LoginRequest = components["schemas"]["LoginBodyDTO"];
export type LoginResponse = components["schemas"]["LoginResponseDTO"];
export type LogoutRequest = components["schemas"]["LogoutBodyDTO"];
export type RefreshTokenRequest = components["schemas"]["RefreshTokensBodyDTO"];
export type RefreshTokenResponse = components["schemas"]["RefreshTokensResponseDTO"];
export type AccessTokenPayload = {
  iat: number;
  exp?: number;
  jti?: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: User["role"];
  };
};
