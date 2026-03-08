import { api } from "../api";
import { ResourceShareResponse, ResourceSharesResponse, UpdateResourceShareRequest } from "@/types";

const ResourceShareService = {
  createFromLink(resourceId: string, linkId: string) {
    return api.post<ResourceShareResponse>(`/resources/${resourceId}/shares/from-link/${linkId}`);
  },

  list(resourceId: string) {
    return api.get<ResourceSharesResponse>(`/resources/${resourceId}/shares`);
  },

  update(resourceId: string, shareId: number, data: UpdateResourceShareRequest) {
    return api.patch<ResourceShareResponse>(`/resources/${resourceId}/shares/${shareId}`, data);
  },

  remove(resourceId: string, shareId: number) {
    return api.delete<void>(`/resources/${resourceId}/shares/${shareId}`);
  },
};

export default ResourceShareService;
