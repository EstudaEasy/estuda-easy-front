import { api } from "../api";

export interface CreateGroupPostRequest {
  content: string;
}

export interface UpdateGroupPostRequest {
  content: string;
}

// Estes tipos provavelmente já deveriam estar mapeados no OpenAPI
// mas como não encontramos o DTO exato, vamos definir o básico baseado nas regras de negócio.
export interface GroupPostResponse {
  id: string;
  content: string;
  authorId: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name: string;
    photoUrl?: string;
  };
}

export interface GroupPostsResponse {
  posts: GroupPostResponse[];
}

const GroupPostService = {
  create(groupId: string, data: CreateGroupPostRequest) {
    return api.post<GroupPostResponse>(`/groups/${groupId}/posts`, data);
  },

  list(groupId: string) {
    return api.get<GroupPostsResponse>(`/groups/${groupId}/posts`);
  },

  getById(groupId: string, postId: string) {
    return api.get<GroupPostResponse>(`/groups/${groupId}/posts/${postId}`);
  },

  update(groupId: string, postId: string, data: UpdateGroupPostRequest) {
    return api.patch<GroupPostResponse>(`/groups/${groupId}/posts/${postId}`, data);
  },

  delete(groupId: string, postId: string) {
    return api.delete<void>(`/groups/${groupId}/posts/${postId}`);
  },
};

export default GroupPostService;
