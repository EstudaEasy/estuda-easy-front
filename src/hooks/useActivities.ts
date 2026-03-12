import { useEffect, useState } from "react";
import { Activity, activityStorage } from "@/lib/activityStorage";

export const useActivities = (limit: number = 3) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const recent = activityStorage.getRecentActivities(limit);
    setActivities(recent);
    setIsLoading(false);
  }, [limit]);

  const addActivity = (activity: Omit<Activity, "timestamp">) => {
    activityStorage.addActivity(activity);

    const updated = activityStorage.getRecentActivities(limit);
    setActivities(updated);
  };

  return { activities, addActivity, isLoading };
};
