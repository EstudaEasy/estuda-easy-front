import { useState, useEffect } from "react";
import { DiaryResponse } from "../types/diary";
import DiaryService from "@/services/diary/DiaryService";

export function useDiaries() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaries, setDiaries] = useState<DiaryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDiaries = async () => {
    try {
      setLoading(true);
      const response = await DiaryService.list();

      const data = response.data?.diaries || (Array.isArray(response.data) ? response.data : []);

      setDiaries(data);
    } catch (error) {
      console.error("Erro ao buscar diários:", error);
      setDiaries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, []);

  return {
    selectedDate,
    setSelectedDate,
    diaries,
    loading,
    refreshDiaries: fetchDiaries,
  };
}
