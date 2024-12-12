import { Hono } from "hono";
import { generateApiKey, hashApiKey } from "../utils/api-keys";

const apiKeysRoute = new Hono();

apiKeysRoute.post("/generate", async (c) => {
  const apiKey = generateApiKey();
  const hashedKey = hashApiKey(apiKey);

  // Todo - setup sqlite db
  // Store hashedKey in your database here
  // await db.apiKeys.create({ hash: hashedKey })

  return c.json({
    apiKey,
    hashedKey,
    message: "New API key generated. Check DB for hashed key.",
  });
});

export { apiKeysRoute };
