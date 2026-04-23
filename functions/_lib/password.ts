const PBKDF2_ITERATIONS = 100_000; // Cloudflare Workers max supported iterations
const PBKDF2_MIN_ITERATIONS = 10_000;
const PBKDF2_MAX_ITERATIONS = 5_000_000; // upper bound to prevent DoS via tampered hash
const PBKDF2_HASH = "SHA-256";
const PBKDF2_KEY_LEN = 32;
const SALT_LEN = 16;

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function pbkdf2(
  password: string,
  salt: Uint8Array,
  iterations: number,
  keyLen: number
): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: PBKDF2_HASH },
    keyMaterial,
    keyLen * 8
  );
  return new Uint8Array(bits);
}

/** Hash a plaintext password. Format: pbkdf2-sha256$iterations$saltB64$hashB64 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEY_LEN);
  return `pbkdf2-sha256$${PBKDF2_ITERATIONS}$${bytesToBase64(salt)}$${bytesToBase64(hash)}`;
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "mismatch" }
  | { ok: false; reason: "legacy_bcrypt" }
  | { ok: false; reason: "unknown_format" };

/**
 * Verify a plaintext password against a stored hash.
 * Returns `legacy_bcrypt` for users hashed before the Cloudflare migration —
 * those users must reset their password (Workers cannot run native bcrypt).
 */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<VerifyResult> {
  if (!stored) return { ok: false, reason: "unknown_format" };

  if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
    return { ok: false, reason: "legacy_bcrypt" };
  }

  if (!stored.startsWith("pbkdf2-sha256$")) {
    return { ok: false, reason: "unknown_format" };
  }

  const parts = stored.split("$");
  if (parts.length !== 4) return { ok: false, reason: "unknown_format" };

  const iterations = parseInt(parts[1], 10);
  if (
    !Number.isFinite(iterations) ||
    iterations < PBKDF2_MIN_ITERATIONS ||
    iterations > PBKDF2_MAX_ITERATIONS
  ) {
    return { ok: false, reason: "unknown_format" };
  }
  let salt: Uint8Array;
  let expected: Uint8Array;
  try {
    salt = base64ToBytes(parts[2]);
    expected = base64ToBytes(parts[3]);
  } catch {
    return { ok: false, reason: "unknown_format" };
  }

  const actual = await pbkdf2(password, salt, iterations, expected.length);

  // Constant-time comparison
  if (actual.length !== expected.length) return { ok: false, reason: "mismatch" };
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
  return diff === 0 ? { ok: true } : { ok: false, reason: "mismatch" };
}
