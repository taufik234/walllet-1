import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

// --- Password hashing via Web Crypto ---

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashed = await hashPassword(password);
  return hashed === hash;
}

// --- Session token ---

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// --- Auth helpers ---

export async function getSession(ctx: any, token: string | null) {
  if (!token) return null;
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q: any) => q.eq("token", token))
    .first();
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    await ctx.db.delete(session._id);
    return null;
  }
  const user = await ctx.db.get(session.userId);
  return { session, user };
}

export { hashPassword, verifyPassword, generateToken };
