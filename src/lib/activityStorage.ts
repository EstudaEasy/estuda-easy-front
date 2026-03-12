export interface Activity {
  id: string;
  title: string;
  tool: "Quiz" | "Flashcards" | "Tarefas" | "Pomodoro";
  timestamp: number;
  icon: "LuBrain" | "LuBookOpen" | "LuBook" | "LuClock";
  iconClass: string;
}

const STORAGE_KEY = "@EstudaEasy:activities";
const MAX_ACTIVITIES = 10;

// Generate unique ID for activities
const generateActivityId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const activityStorage = {
  addActivity(activity: Omit<Activity, "timestamp" | "id"> & { id?: string }): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const activities: Activity[] = stored ? JSON.parse(stored) : [];

      const newActivity: Activity = {
        id: activity.id || generateActivityId(),
        title: activity.title,
        tool: activity.tool,
        icon: activity.icon,
        iconClass: activity.iconClass,
        timestamp: Date.now(),
      };

      activities.unshift(newActivity);

      const trimmed = activities.slice(0, MAX_ACTIVITIES);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.error("Erro ao salvar atividade:", error);
    }
  },

  getRecentActivities(limit: number = 3): Activity[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const activities: Activity[] = stored ? JSON.parse(stored) : [];
      return activities.slice(0, limit);
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
      return [];
    }
  },

  getAllActivities(): Activity[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
      return [];
    }
  },

  clearActivities(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao limpar atividades:", error);
    }
  },
};

export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes}m`;
  if (hours < 24) return `há ${hours}h`;
  if (days === 1) return "há 1 dia";
  return `há ${days} dias`;
};
