import { createId } from "@paralleldrive/cuid2";
import { createHash } from "crypto";

export const generateApiKey = () => {
  const prefix = "yofit";
  const uniqueId = createId();
  return `${prefix}_${uniqueId}`;
};

export const hashApiKey = (apiKey: string) => {
  return createHash("sha256").update(apiKey).digest("hex");
};
