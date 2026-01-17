import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1),
});

export const env = envSchema.parse(process.env);
