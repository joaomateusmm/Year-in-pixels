import { useMemo } from "react";
import { Activity, DayRecord } from "@/types";
import { getDayBackground } from "@/lib/pixelUtils";

interface Props {
  year: number;
  activities: Activity[];
  records: DayRecord;
  onDayClick: (dayKey: string) => void;
}

const MONTH_NAMES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export default function PixelGrid({ year, activities, records, onDayClick }: Props) {
  const months = useMemo(() => {
    const result: { month: number; days: { date: Date; key: string }[] }[] = [];
    for (let m = 0; m < 12; m++) {
      const days: { date: Date; key: string }[] = [];
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, m, d);
        const key = `${year}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        days.push({ date, key });
      }
      result.push({ month: m, days });
    }
    return result;
  }, [year]);

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {months.map(({ month, days }) => (
        <div key={month} className="space-y-1.5">
          <h3 className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
            {MONTH_NAMES[month]}
          </h3>
          <div className="grid grid-cols-7 gap-[2px]">
            {days.map(({ key }) => {
              const dayActivities = (records[key] || [])
                .map((id) => activities.find((a) => a.id === id))
                .filter(Boolean) as Activity[];
              const bg = getDayBackground(dayActivities);
              const isToday = key === todayKey;
              return (
                <button
                  key={key}
                  onClick={() => onDayClick(key)}
                  className={`pixel-cell ${isToday ? "ring-1 ring-foreground/40" : ""}`}
                  style={{ background: bg }}
                  title={key}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
