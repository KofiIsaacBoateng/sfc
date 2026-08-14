import { z } from "zod";
import { logger } from "../logger/logger.js";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  DATABASE_URL_TEST: z.url(),
  PORT: z.coerce.number().min(1000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  JWT_ACCESS_SECRET: z
    .string()
    .min(5, { error: "Please make sure jwt_s is at least 5 characters!" }),
  JWT_REFRESH_SECRET: z
    .string()
    .min(5, { error: "Please make sure jwt_s is at least 5 characters!" }),
  ACTIVATION_CODE_SECRET: z.string().min(5, {
    error: "Please make sure activation_code_secret is at least 5 characters!",
  }),
});

// parse process.env against schema
const _env = envSchema.safeParse(process.env);

// error log when parse failes
if (!_env.success) {
  logger.error({
    message: "Invalid environment variables: ",
    error: _env.error,
  });
  process.exit(1);
}

logger.info("[ENV]: Env validation successsful!");

const env = _env.data;
export default env;
