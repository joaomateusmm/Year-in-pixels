import { Activity } from "@/types";

export function getDayBackground(activities: Activity[]): string {
  if (activities.length === 0) return "hsl(0 0% 10%)";
  if (activities.length === 1) return activities[0].color;
  if (activities.length === 2) {
    return `linear-gradient(135deg, ${activities[0].color} 50%, ${activities[1].color} 50%)`;
  }
  // 3+ activities: proportional stripes
  const pct = 100 / activities.length;
  const stops = activities
    .map((a, i) => `${a.color} ${pct * i}% ${pct * (i + 1)}%`)
    .join(", ");
  return `linear-gradient(135deg, ${stops})`;
}
