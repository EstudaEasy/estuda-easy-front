import { components } from "./api";

export type GroupMember = GroupMemberResponse;
export type GroupMemberResponse = components["schemas"]["GroupMemberResponseDTO"];
export type GroupMembersResponse = components["schemas"]["FindGroupMembersResponseDTO"];
export type UpdateGroupMemberRoleRequest = components["schemas"]["ChangeMemberRoleBodyDTO"];
export type AddGroupMemberRequest = components["schemas"]["AddGroupMemberBodyDTO"];
