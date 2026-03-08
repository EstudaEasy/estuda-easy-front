import { components } from "./api";

export type Whiteboard = WhiteboardResponse;
export type WhiteboardResponse = components["schemas"]["WhiteboardResponseDTO"];
export type WhiteboardsResponse = components["schemas"]["FindWhiteboardResponseDTO"];
export type CreateWhiteboardRequest = components["schemas"]["CreateWhiteboardBodyDTO"];
export type UpdateWhiteboardRequest = components["schemas"]["UpdateWhiteboardBodyDTO"];
