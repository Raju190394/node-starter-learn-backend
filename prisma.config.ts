// prisma.config.ts
import "dotenv/config"; // Load environment variables
import { defineConfig } from "prisma/config";

export default defineConfig({
  // Path to your Prisma schema
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
