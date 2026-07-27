import { v } from "convex/values";
import { mutation, query, internalQuery, internalMutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { hashPassword, verifyPassword, generateToken } from "./auth";
import { getSession } from "./helpers";

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const registerUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existing) throw new Error("Email already registered");

    const passwordHash = await hashPassword(args.password);
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      passwordHash,
      createdAt: Date.now(),
    });

    const token = generateToken();
    await ctx.db.insert("sessions", {
      userId,
      token,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    });

    return { token, user: { id: userId, name: args.name, email: args.email } };
  },
});

export const loginUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (!user) throw new Error("Invalid email or password");

    const valid = await verifyPassword(args.password, user.passwordHash);
    if (!valid) throw new Error("Invalid email or password");

    const token = generateToken();
    await ctx.db.insert("sessions", {
      userId: user._id,
      token,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
    });

    return {
      token,
      user: { id: user._id, name: user.name, email: user.email },
    };
  },
});

export const logoutUser = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});

export const getMe = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const result = await getSession(ctx, args.token);
    if (!result) return null;
    const user = result.user;
    return { id: user._id, name: user.name, email: user.email, avatar: user.avatar };
  },
});

export const deleteUser = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!session) throw new Error("Not authenticated");

    const uid = session.userId;

    const deleteByUser = async <T extends "transactions" | "wallets" | "budgets" | "goals">(table: T) => {
      const docs = await ctx.db
        .query(table)
        .withIndex("by_user", (q) => q.eq("userId", uid))
        .collect();
      for (const d of docs) await ctx.db.delete(d._id);
    };

    await deleteByUser("transactions");
    await deleteByUser("wallets");
    await deleteByUser("budgets");
    await deleteByUser("goals");

    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", uid))
      .collect();
    for (const s of sessions) await ctx.db.delete(s._id);

    await ctx.db.delete(uid);
  },
});

/** Internal: get user by session token. Used for cross-function lookup. */
export const getUserByToken = internalQuery({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!session) return null;
    const user = await ctx.db.get(session.userId);
    return user ? { id: user._id, name: user.name, email: user.email } : null;
  },
});

/** Internal: cleanup expired sessions. Called by cron. */
export const cleanupExpiredSessions = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const sessions = await ctx.db.query("sessions").collect();
    for (const s of sessions) {
      if (now > s.expiresAt) {
        await ctx.db.delete(s._id);
      }
    }
  },
});
