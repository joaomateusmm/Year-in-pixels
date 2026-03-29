// src/db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Garante que a URL não está vazia
if (!process.env.DATABASE_URL) {
  throw new Error("A variável DATABASE_URL não está configurada no .env");
}

// Cria a conexão HTTP com o Neon
const sql = neon(process.env.DATABASE_URL);

// Exporta o 'db' com o seu schema para usarmos depois!
export const db = drizzle(sql, { schema });
