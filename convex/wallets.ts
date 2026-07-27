import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { assertAuth, calculateWalletBalances } from "./helpers";

export const list = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    return await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("asc")
      .collect();
  },
});

export const getBalances = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    return await calculateWalletBalances(ctx, user._id);
  },
});

export const create = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    initialBalance: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    const id = await ctx.db.insert("wallets", {
      userId: user._id,
      name: args.name,
      initialBalance: args.initialBalance || 0,
      createdAt: Date.now(),
    });
    return await ctx.db.get(id);
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("wallets"),
    name: v.optional(v.string()),
    initialBalance: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await assertAuth(ctx, args);
    const { id, token, ...updates } = args;
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("wallets") },
  handler: async (ctx, args) => {
    await assertAuth(ctx, args);
    await ctx.db.delete(args.id);
  },
});

export const adjustBalance = mutation({
  args: {
    token: v.string(),
    walletId: v.id("wallets"),
    newBalance: v.number(),
  },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    const wallet = await ctx.db.get(args.walletId);
    if (!wallet) throw new Error("Wallet not found");

    const balances = await calculateWalletBalances(ctx, user._id);
    const currentBalance = balances[args.walletId] ?? wallet.initialBalance;
    const difference = args.newBalance - currentBalance;
    if (difference === 0) return wallet;

    await ctx.db.insert("transactions", {
      userId: user._id,
      type: difference > 0 ? "income" : "expense",
      amount: Math.abs(difference),
      walletId: args.walletId,
      date: new Date().toISOString().split("T")[0],
      note: "Penyesuaian Saldo Manual",
      createdAt: Date.now(),
    });

    return wallet;
  },
});

export const resetAll = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    const wallets = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const w of wallets) {
      await ctx.db.patch(w._id, { initialBalance: 0, updatedAt: Date.now() });
    }
  },
});
