import { useState, useMemo, useEffect } from "react";
import { TaskResponse } from "../types/task";
import { isSameDay, parseISO } from "date-fns";
import TaskService from "@/services/task/TaskService";

export function useTasks() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allTasks, setAllTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await TaskService.list();
      setAllTasks(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      if (!task.startDate) return false;
      return isSameDay(parseISO(task.startDate), selectedDate);
    });
  }, [allTasks, selectedDate]);

  return {
    selectedDate,
    setSelectedDate,
    tasks: filteredTasks,
    loading,
    refreshTasks: fetchTasks,
  };
}
