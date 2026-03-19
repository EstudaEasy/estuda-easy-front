import { api } from "../api";
import type { Resource, ResourceResponse } from "@/types";

const ResourceConversionService = {
  convert(resourceId: string, data: Resource) {
    return api.post<ResourceResponse>(`/resources/${resourceId}/convert`, data);
  },
};

export default ResourceConversionService;
