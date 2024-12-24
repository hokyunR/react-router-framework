import { z } from "zod";

const envSchema = z.object({
  COGNITO_REGION: z.string(),
  COGNITO_CLIENT_ID: z.string(),
  COGNITO_USER_POOL_ID: z.string(),
  COGNITO_CLIENT_SECRET: z.string(),
  COGNITO_REDIRECT_URI: z.string(),
});

export const env = envSchema.parse(process.env);
