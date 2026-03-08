import { components } from "./api";

export type Diary = DiaryResponse;
export type DiaryResponse = components["schemas"]["DiaryResponseDTO"];
export type DiariesResponse = components["schemas"]["FindDiaryResponseDTO"];
export type CreateDiaryRequest = components["schemas"]["CreateDiaryBodyDTO"];
export type UpdateDiaryRequest = components["schemas"]["UpdateDiaryBodyDTO"];
