import { api } from "../api";
import {
  CreateWhiteboardRequest,
  UpdateWhiteboardRequest,
  WhiteboardResponse,
  WhiteboardsResponse,
} from "@/types";

const WhiteboardService = {
  create(data: CreateWhiteboardRequest) {
    return api.post<WhiteboardResponse>("/whiteboards", data);
  },

  list() {
    return api.get<WhiteboardsResponse>("/whiteboards");
  },

  listShared() {
    return api.get<WhiteboardsResponse>("/whiteboards/shared");
  },

  getById(whiteboardId: string) {
    return api.get<WhiteboardResponse>(`/whiteboards/${whiteboardId}`);
  },

  update(whiteboardId: string, data: UpdateWhiteboardRequest) {
    return api.patch<WhiteboardResponse>(`/whiteboards/${whiteboardId}`, data);
  },

  delete(whiteboardId: string) {
    return api.delete<void>(`/whiteboards/${whiteboardId}`);
  },
};

export default WhiteboardService;
