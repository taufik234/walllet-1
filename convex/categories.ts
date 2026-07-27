import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

const DEFAULT_CATEGORIES = {
  expense: [
    "Makan", "Transport", "Belanja", "Tagihan", "Hiburan",
    "Kesehatan", "Pendidikan", "Subscription", "Lainnya",
  ],
  income: [
    "Gaji", "Bonus", "Freelance", "Investasi", "Lainnya",
  ],
};

export const seedIfEmpty = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("categories").take(1);
    if (existing.length > 0) return { seeded: false };

    const created = [];
    for (const name of DEFAULT_CATEGORIES.expense) {
      const id = await ctx.db.insert("categories", { type: "expense", name });
      created.push({ id, type: "expense", name });
    }
    for (const name of DEFAULT_CATEGORIES.income) {
      const id = await ctx.db.insert("categories", { type: "income", name });
      created.push({ id, type: "income", name });
    }
    return { seeded: true, created };
  },
});

export const list = query({
  args: { type: v.optional(v.union(v.literal("income"), v.literal("expense"))) },
  handler: async (ctx, args) => {
    if (args.type) {
      return await ctx.db
        .query("categories")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .order("asc")
        .take(100);
    }
    return await ctx.db.query("categories").order("asc").take(100);
  },
});

export const getGrouped = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("categories").order("asc").take(100);
    return {
      income: all.filter((c) => c.type === "income"),
      expense: all.filter((c) => c.type === "expense"),
    };
  },
});

export const create = mutation({
  args: {
    type: v.union(v.literal("income"), v.literal("expense")),
    name: v.string(),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("categories", { type: args.type, name: args.name, icon: args.icon });
    return await ctx.db.get(id);
  },
});