import { components } from "./api";

export type ResourceShare = ResourceShareResponse;
export type ResourceShareResponse = components["schemas"]["ResourceShareResponseDTO"];
export type ResourceShareItem = components["schemas"]["ResourceShareDTO"];
export type ResourceSharesResponse = components["schemas"]["FindResourceSharesResponseDTO"];
export type UpdateResourceShareRequest = components["schemas"]["UpdateResourceShareBodyDTO"];
