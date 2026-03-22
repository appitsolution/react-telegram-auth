import { createHash, createHmac, timingSafeEqual } from "crypto";
import type { TelegramAuthData } from "./types";

export interface VerifyTelegramAuthOptions {
  maxAgeSeconds?: number;
  nowSeconds?: number;
}

function buildDataCheckString(data: Omit<TelegramAuthData, "hash">): string {
  return Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${String(value)}`)
    .sort((a, b) => a.localeCompare(b))
    .join("\n");
}

export function verifyTelegramAuth(
  authData: TelegramAuthData,
  botToken: string,
  options: VerifyTelegramAuthOptions = {}
): boolean {
  if (!authData.hash || !botToken) {
    return false;
  }

  const { hash, ...rest } = authData;
  const nowSeconds = options.nowSeconds ?? Math.floor(Date.now() / 1000);
  const maxAgeSeconds = options.maxAgeSeconds ?? 86400;

  if (nowSeconds - Number(rest.auth_date) > maxAgeSeconds) {
    return false;
  }

  const dataCheckString = buildDataCheckString(rest);
  const secretKey = createHash("sha256").update(botToken).digest();
  const generatedHash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const a = Buffer.from(generatedHash, "hex");
  const b = Buffer.from(hash, "hex");

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}
