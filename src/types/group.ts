import { components } from "./api";

export type Group = GroupResponse;
export type GroupResponse = components["schemas"]["GroupResponseDTO"];
export type GroupsResponse = components["schemas"]["FindGroupResponseDTO"];
export type CreateGroupRequest = components["schemas"]["CreateGroupBodyDTO"];
export type UpdateGroupRequest = components["schemas"]["UpdateGroupBodyDTO"];
