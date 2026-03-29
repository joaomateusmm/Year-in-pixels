export interface Activity {
  id: string;
  name: string;
  color: string;
}

export interface DayRecord {
  [dayKey: string]: string[]; // dayKey = "YYYY-MM-DD", value = activity IDs
}
