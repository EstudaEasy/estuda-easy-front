import { api } from "../api";
import { CreateGroupRequest, UpdateGroupRequest, GroupResponse, GroupsResponse } from "@/types";

const GroupService = {
  create(data: CreateGroupRequest) {
    return api.post<GroupResponse>("/groups", data);
  },

  getAll() {
    return api.get<GroupsResponse>("/groups");
  },

  getById(groupId: string) {
    return api.get<GroupResponse>(`/groups/${groupId}`);
  },

  update(groupId: string, data: UpdateGroupRequest) {
    return api.patch<GroupResponse>(`/groups/${groupId}`, data);
  },

  resetInviteCode(groupId: string) {
    return api.patch<GroupResponse>(`/groups/${groupId}/invite-code`);
  },

  delete(groupId: string) {
    return api.delete<void>(`/groups/${groupId}`);
  },
};

export default GroupService;
