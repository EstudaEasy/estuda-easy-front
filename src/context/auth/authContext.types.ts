import { CreateUserRequest, LoginRequest, UserResponse } from "@/types";

export interface IAuthContext {
  user: UserResponse | null;
  isLoading: boolean;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => void;
  register: (request: CreateUserRequest) => Promise<void>;
}

export interface UserDataJWT {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}
