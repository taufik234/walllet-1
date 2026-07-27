import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { assertAuth } from "./helpers";

export const list = query({
  args: {
    token: v.string(),
    status: v.optional(v.union(v.literal("active"), v.literal("completed"))),
  },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    if (args.status) {
      return await ctx.db
        .query("goals")
        .withIndex("by_user_status", (q) =>
          q.eq("userId", user._id).eq("status", args.status!)
        )
        .order("desc")
        .take(50);
    }
    return await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);
  },
});

export const create = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    targetAmount: v.number(),
    deadline: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    const id = await ctx.db.insert("goals", {
      userId: user._id,
      name: args.name,
      targetAmount: args.targetAmount,
      currentAmount: 0,
      deadline: args.deadline,
      icon: args.icon,
      status: "active",
      createdAt: Date.now(),
    });
    return await ctx.db.get(id);
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("goals"),
    name: v.optional(v.string()),
    targetAmount: v.optional(v.number()),
    deadline: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertAuth(ctx, args);
    const { id, token, ...updates } = args;
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("goals") },
  handler: async (ctx, args) => {
    await assertAuth(ctx, args);
    await ctx.db.delete(args.id);
  },
});

export const addSavings = mutation({
  args: {
    token: v.string(),
    id: v.id("goals"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    await assertAuth(ctx, args);
    const goal = await ctx.db.get(args.id);
    if (!goal) throw new Error("Goal not found");

    const newAmount = goal.currentAmount + args.amount;
    const isCompleted = newAmount >= goal.targetAmount;

    await ctx.db.patch(args.id, {
      currentAmount: newAmount,
      status: isCompleted ? "completed" : "active",
      updatedAt: Date.now(),
    });
    return await ctx.db.get(args.id);
  },
});

export const deleteAll = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    const goals = await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const g of goals) await ctx.db.delete(g._id);
  },
});
