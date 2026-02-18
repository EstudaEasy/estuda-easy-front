import { components } from "./api";

export type User = UserResponse;
export type UserResponse = components["schemas"]["UserResponseDTO"];
export type UsersResponse = components["schemas"]["FindUserResponseDTO"];
export type CreateUserRequest = components["schemas"]["CreateUserBodyDTO"];
export type UpdateUserRequest = components["schemas"]["UpdateUserBodyDTO"];
