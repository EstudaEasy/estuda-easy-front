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

  getAll() {
    return api.get<WhiteboardsResponse>("/whiteboards");
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
