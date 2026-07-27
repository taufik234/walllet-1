import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { assertAuth } from "./helpers";
import { Doc } from "./_generated/dataModel";

export const list = query({
  args: {
    token: v.string(),
    type: v.optional(v.union(v.literal("income"), v.literal("expense"))),
    walletId: v.optional(v.id("wallets")),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);

    // Pick the best index based on filter args
    let query = ctx.db.query("transactions");
    if (args.walletId) {
      query = query.withIndex("by_user_wallet", (q) =>
        q.eq("userId", user._id).eq("walletId", args.walletId!)
      );
    } else {
      query = query.withIndex("by_user_date", (q) => q.eq("userId", user._id));
    }

    const results = await query.order("desc").take(100);

    let filtered = results.filter((t) => {
      if (args.type && t.type !== args.type) return false;
      if (args.startDate && t.date < args.startDate) return false;
      if (args.endDate && t.date > args.endDate) return false;
      return true;
    });

    return await Promise.all(
      filtered.map(async (t) => {
        const wallet = t.walletId ? await ctx.db.get(t.walletId) : null;
        const category = t.categoryId ? await ctx.db.get(t.categoryId) : null;
        return { ...t, wallet, category };
      })
    );
  },
});

export const create = mutation({
  args: {
    token: v.string(),
    type: v.union(v.literal("income"), v.literal("expense")),
    amount: v.number(),
    walletId: v.id("wallets"),
    categoryId: v.optional(v.id("categories")),
    date: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    const id = await ctx.db.insert("transactions", {
      userId: user._id,
      type: args.type,
      amount: args.amount,
      walletId: args.walletId,
      categoryId: args.categoryId,
      date: args.date,
      note: args.note,
      createdAt: Date.now(),
    });
    return await ctx.db.get(id);
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("transactions"),
    type: v.optional(v.union(v.literal("income"), v.literal("expense"))),
    amount: v.optional(v.number()),
    walletId: v.optional(v.id("wallets")),
    categoryId: v.optional(v.id("categories")),
    date: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertAuth(ctx, args);
    const { id, token, ...updates } = args;
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("transactions") },
  handler: async (ctx, args) => {
    await assertAuth(ctx, args);
    await ctx.db.delete(args.id);
  },
});

export const deleteAll = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    const all = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const t of all) await ctx.db.delete(t._id);
  },
});
