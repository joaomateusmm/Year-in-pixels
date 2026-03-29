import { useState, useEffect } from "react";
import { Activity, DayRecord } from "@/types";

const STORAGE_ACTIVITIES = "yip-activities";
const STORAGE_RECORDS = "yip-records";

const defaultActivities: Activity[] = [
  { id: "1", name: "Estudar", color: "#3b82f6" },
  { id: "2", name: "Treinar", color: "#22c55e" },
  { id: "3", name: "Meditar", color: "#a855f7" },
];

export function useYearInPixels() {
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem(STORAGE_ACTIVITIES);
    return saved ? JSON.parse(saved) : defaultActivities;
  });

  const [records, setRecords] = useState<DayRecord>(() => {
    const saved = localStorage.getItem(STORAGE_RECORDS);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_RECORDS, JSON.stringify(records));
  }, [records]);

  const addActivity = (name: string, color: string) => {
    setActivities((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, color },
    ]);
  };

  const updateActivity = (id: string, name: string, color: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, name, color } : a))
    );
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    // Remove from records too
    setRecords((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = next[key].filter((aid) => aid !== id);
        if (next[key].length === 0) delete next[key];
      }
      return next;
    });
  };

  const toggleDayActivity = (dayKey: string, activityId: string) => {
    setRecords((prev) => {
      const current = prev[dayKey] || [];
      const has = current.includes(activityId);
      const updated = has
        ? current.filter((id) => id !== activityId)
        : [...current, activityId];
      if (updated.length === 0) {
        const { [dayKey]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [dayKey]: updated };
    });
  };

  return {
    activities,
    records,
    addActivity,
    updateActivity,
    deleteActivity,
    toggleDayActivity,
  };
}
