"use server";

import { db } from "@/db";
import { dayRecords } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getRecordsFromDB() {
  const allRecords = await db.select().from(dayRecords);
  const formattedRecords: Record<string, string[]> = {};

  allRecords.forEach((record) => {
    formattedRecords[record.dateKey] = record.activityIds;
  });

  return formattedRecords;
}

export async function saveDayRecordToDB(
  dateKey: string,
  activityIds: string[],
) {
  try {
    await db
      .insert(dayRecords)
      .values({
        dateKey: dateKey,
        activityIds: activityIds,
      })
      .onConflictDoUpdate({
        target: dayRecords.dateKey, // Usa o dateKey como referência de conflito
        set: { activityIds: activityIds }, // Se der conflito, atualiza os IDs
      });

    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar no banco:", error);
    return { success: false, error: "Falha ao salvar o dia." };
  }
}
