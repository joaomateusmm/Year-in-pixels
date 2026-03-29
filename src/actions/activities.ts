"use server";

import { db } from "@/db"; // Ajuste o caminho do seu db.ts
import { activitiesTable } from "@/db/schema";
import { eq } from "drizzle-orm"; // Necessário para filtrar o ID correto

export async function getActivitiesFromDB() {
  return await db.select().from(activitiesTable);
}

export async function saveActivityToDB(
  id: string,
  name: string,
  color: string,
) {
  await db.insert(activitiesTable).values({ id, name, color });
}

export async function updateActivityInDB(
  id: string,
  name: string,
  color: string,
) {
  await db
    .update(activitiesTable)
    .set({ name, color })
    .where(eq(activitiesTable.id, id));
}

export async function deleteActivityFromDB(id: string) {
  await db.delete(activitiesTable).where(eq(activitiesTable.id, id));
}
