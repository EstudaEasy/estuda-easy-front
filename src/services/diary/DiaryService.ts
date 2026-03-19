import { api } from "../api";
import { CreateDiaryRequest, DiaryResponse, DiariesResponse, UpdateDiaryRequest } from "@/types";

const DiaryService = {
  create(data: CreateDiaryRequest | FormData) {
    return api.post<DiaryResponse>("/diaries", data);
  },

  list() {
    return api.get<DiariesResponse>("/diaries");
  },

  listShared() {
    return api.get<DiariesResponse>("/diaries/shared");
  },

  getById(diaryId: string) {
    return api.get<DiaryResponse>(`/diaries/${diaryId}`);
  },

  update(diaryId: string, data: UpdateDiaryRequest | FormData) {
    return api.patch<DiaryResponse>(`/diaries/${diaryId}`, data);
  },

  uploadAudio(diaryId: string, data: FormData) {
    return api.patch(`/diaries/${diaryId}/audio`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  remove(diaryId: string) {
    return api.delete<void>(`/diaries/${diaryId}`);
  },
};

export default DiaryService;
