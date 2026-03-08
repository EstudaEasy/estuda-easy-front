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

      const data = response.data?.tasks || (Array.isArray(response.data) ? response.data : []);

      setAllTasks(data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      setAllTasks([]);
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

      const taskDate = parseISO(task.startDate);

      return isSameDay(taskDate, selectedDate);
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
