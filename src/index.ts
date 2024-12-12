import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { serve } from "@hono/node-server";
import { rateLimiter } from "hono-rate-limiter";
import { createId } from "@paralleldrive/cuid2";
import { pdfRoute } from "./routes/pdf";
import { bearerAuth } from "hono/bearer-auth";
import { hashApiKey } from "./utils/api-keys";
import { apiKeysRoute } from "./routes/api-keys";

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Todo - pull from DB
const VALID_API_KEYS = new Set([
  // Add your hashed API keys here
  "5865e6cbb4ce3a76abf5491227882437f9530c0ca930cc2439a0c0523d493803",
]);

const app = new Hono();

app
  .use("*", logger())
  .use("*", prettyJSON({ space: 2 }))
  .use("*", secureHeaders())
  .use(
    "/pdf/*",
    bearerAuth({
      token: undefined,
      verifyToken: async (token) => {
        // Verify the API key
        const hashedToken = hashApiKey(token);
        return VALID_API_KEYS.has(hashedToken);
      },
    })
  )
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
          error:
            "Wow, too many requests, slow down yeah? Please try again later",
        }),
    })
  );

console.log(`Server is running on port ${port}`);

app.get("/", (c) => {
  return c.text("Generate PDF service online!");
});

app.basePath("/pdf").route("/", pdfRoute);
app.basePath("/api-keys").route("/", apiKeysRoute);

serve({
  fetch: app.fetch,
  port,
});
