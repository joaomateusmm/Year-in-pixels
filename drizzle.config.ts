import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./src/db/schema.ts", // Caminho para o seu arquivo schema.ts
  out: "./drizzle", // Pasta onde o Drizzle vai salvar os históricos (migrations)
  dialect: "postgresql", // O banco do Neon é baseado em Postgres
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Pega a URL de conexão do .env
  },
});
