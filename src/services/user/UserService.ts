import { api } from "../api";
import { CreateUserRequest, UpdateUserRequest, UserResponse, UsersResponse } from "@/types";

const UserService = {
  createUser(user: CreateUserRequest) {
    return api.post<UserResponse>("/users", user);
  },

  getAll() {
    return api.get<UsersResponse>("/users");
  },

  getById(userId: string) {
    return api.get<UserResponse>(`/users/${userId}`);
  },

  updateUser(userId: string, user: UpdateUserRequest) {
    return api.patch<UserResponse>(`/users/${userId}`, user);
  },

  deleteUser(userId: string) {
    return api.delete<void>(`/users/${userId}`);
  },
};

export default UserService;
