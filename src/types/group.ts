import { components } from "./api";

export type Group = GroupResponse;
export type GroupResponse = components["schemas"]["GroupResponseDTO"];
export type GroupsResponse = components["schemas"]["FindGroupResponseDTO"];
export type CreateGroupRequest = components["schemas"]["CreateGroupBodyDTO"];
export type UpdateGroupRequest = components["schemas"]["UpdateGroupBodyDTO"];

export type GroupMember = GroupMemberResponse;
export type GroupMemberResponse = components["schemas"]["GroupMemberResponseDTO"];
export type GroupMembersResponse = components["schemas"]["FindGroupMembersResponseDTO"];
export type UpdateGroupMemberRoleRequest = components["schemas"]["ChangeMemberRoleBodyDTO"];
export type AddGroupMemberRequest = components["schemas"]["JoinGroupBodyDTO"];
