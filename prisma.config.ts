import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

// Load environment variables so DATABASE_URL is available
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
  // Use binary engine for standard Node.js runtime (not client engine)
  client: {
    engineType: "binary",
  },
});


