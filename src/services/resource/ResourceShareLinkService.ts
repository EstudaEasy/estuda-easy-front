import { api } from "../api";
import { GenerateResourceShareLinkRequest, ResourceShareLinkResponse } from "@/types";

const ResourceShareLinkService = {
  generate(resourceId: string, data: GenerateResourceShareLinkRequest) {
    return api.post<ResourceShareLinkResponse>(`/resources/${resourceId}/links`, data);
  },

  find(resourceId: string) {
    return api.get<ResourceShareLinkResponse>(`/resources/${resourceId}/links`);
  },

  remove(resourceId: string) {
    return api.delete<void>(`/resources/${resourceId}/links`);
  },
};

export default ResourceShareLinkService;
