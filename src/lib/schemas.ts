import * as z from "zod";

export const htmlSchema = z.object({
  html: z.string().min(1, "HTML content is required"),
});
