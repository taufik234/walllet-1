import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { assertAuth } from "./helpers";

export const list = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    return await Promise.all(
      budgets.map(async (b) => {
        const category = b.categoryId ? await ctx.db.get(b.categoryId) : null;
        return { ...b, category };
      })
    );
  },
});

export const getWithStats = query({
  args: {
    token: v.string(),
    referenceDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const refDate = args.referenceDate ? new Date(args.referenceDate) : new Date();
    const firstOfMonth = new Date(refDate.getFullYear(), refDate.getMonth(), 1)
      .toISOString()
      .split("T")[0];

    const result = await Promise.all(
      budgets.map(async (b) => {
        const category = b.categoryId ? await ctx.db.get(b.categoryId) : null;
        let effectiveStart = b.cycleStart;
        const cycleDate = new Date(b.cycleStart);
        if (
          refDate.getMonth() !== cycleDate.getMonth() ||
          refDate.getFullYear() !== cycleDate.getFullYear()
        ) {
          effectiveStart = firstOfMonth;
        }

        const expenseTx = transactions.filter(
          (t) =>
            t.type === "expense" &&
            t.categoryId === b.categoryId &&
            t.date >= effectiveStart
        );
        const spent = expenseTx.reduce((sum, t) => sum + t.amount, 0);
        const limit = b.limitAmount;
        const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

        return {
          ...b,
          category,
          categoryName: category?.name || "Unknown",
          spent,
          percentage,
          remaining: limit - spent,
          isOver: spent > limit,
        };
      })
    );

    return result.sort((a, b) => b.percentage - a.percentage);
  },
});

export const create = mutation({
  args: {
    token: v.string(),
    categoryId: v.id("categories"),
    limitAmount: v.number(),
    cycleStart: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    const now = new Date();
    const cycleStart =
      args.cycleStart ||
      new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
    const id = await ctx.db.insert("budgets", {
      userId: user._id,
      categoryId: args.categoryId,
      limitAmount: args.limitAmount,
      cycleStart,
      createdAt: Date.now(),
    });
    return await ctx.db.get(id);
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("budgets"),
    limitAmount: v.optional(v.number()),
    cycleStart: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertAuth(ctx, args);
    const { id, token, ...updates } = args;
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("budgets") },
  handler: async (ctx, args) => {
    await assertAuth(ctx, args);
    await ctx.db.delete(args.id);
  },
});

export const deleteAll = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const b of budgets) await ctx.db.delete(b._id);
  },
});

export const resetCycle = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    const today = new Date().toISOString().split("T")[0];
    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const b of budgets) {
      await ctx.db.patch(b._id, {
        cycleStart: today,
        updatedAt: Date.now(),
      });
    }
  },
});
