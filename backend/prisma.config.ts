import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const isTestEnv = env("NODE_ENV") === "test";

export default defineConfig({
  schema: "./prisma/",
  migrations: {
    path: "./prisma/migrations",
  },
  datasource: {
    url: isTestEnv ? env("DATABASE_URL_TEST") : env("DATABASE_URL"),
  },
});
