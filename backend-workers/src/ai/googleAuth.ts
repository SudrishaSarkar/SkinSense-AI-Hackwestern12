// src/ai/googleAuth.ts
import type { Env } from "../types";

// Google Auth for Cloudflare Workers (no Node crypto)
export async function getGoogleAccessToken(env: Env): Promise<string> {
  if (!env.GOOGLE_SERVICE_ACCOUNT) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT is not set in environment variables"
    );
  }
  const sa = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT);

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);

  const payload = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/generative-language",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encoder = new TextEncoder();

  function base64url(input: Uint8Array) {
    return btoa(String.fromCharCode(...input))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  const encodedHeader = base64url(encoder.encode(JSON.stringify(header)));
  const encodedPayload = base64url(encoder.encode(JSON.stringify(payload)));

  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    b64ToUint8Array(sa.private_key),
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    encoder.encode(signingInput)
  );

  const encodedSignature = base64url(new Uint8Array(signature));

  const jwt = `${signingInput}.${encodedSignature}`;

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const data = (await resp.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Failed to obtain access token");

  return data.access_token;
}

// Helper: Convert base64 PEM → Uint8Array
function b64ToUint8Array(b64: string) {
  const cleaned = (b64 || "")
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\n/g, "");
  const raw = atob(cleaned);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr.buffer;
}
