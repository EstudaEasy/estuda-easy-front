import { api } from "../api";
import { GroupMemberResponse, GroupMembersResponse, UpdateGroupMemberRoleRequest } from "@/types";

const GroupMemberService = {
  list(groupId: string) {
    return api.get<GroupMembersResponse>(`/groups/${groupId}/members`);
  },

  getById(groupId: string, memberId: string) {
    return api.get<GroupMemberResponse>(`/groups/${groupId}/members/${memberId}`);
  },

  updateRole(groupId: string, memberId: string, data: UpdateGroupMemberRoleRequest) {
    return api.patch<GroupMemberResponse>(`/groups/${groupId}/members/${memberId}/role`, data);
  },

  removeMember(groupId: string, memberId: string) {
    return api.delete<void>(`/groups/${groupId}/members/${memberId}`);
  },
};

export default GroupMemberService;
