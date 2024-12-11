import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { serve } from "@hono/node-server";
import { rateLimiter } from "hono-rate-limiter";
import { createId } from "@paralleldrive/cuid2";
import { pdfRoute } from "./routes/pdf";

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const app = new Hono();

app
  .use("*", logger())
  .use("*", prettyJSON({ space: 2 }))
  .use("*", secureHeaders())
  .use(
    rateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
      standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
      keyGenerator: () => createId(), // Method to generate custom identifiers for clients.
      // store: ... , // Redis, MemoryStore, etc. See below.
      handler: (c) =>
        c.json({
          status: 429,
          error: "Too many requests, please try again later. Jeez",
        }),
    })
  );

console.log(`Server is running on port ${port}`);

app.get("/", (c) => {
  return c.text("Generate PDF service online!");
});

app.basePath("/pdf").route("/generate", pdfRoute);

serve({
  fetch: app.fetch,
  port,
});
