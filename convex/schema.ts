import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    avatar: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  wallets: defineTable({
    userId: v.id("users"),
    name: v.string(),
    initialBalance: v.number(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  categories: defineTable({
    type: v.union(v.literal("income"), v.literal("expense")),
    name: v.string(),
    icon: v.optional(v.string()),
  }).index("by_type", ["type"]),

  transactions: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("income"), v.literal("expense")),
    amount: v.number(),
    walletId: v.id("wallets"),
    categoryId: v.optional(v.id("categories")),
    date: v.string(),
    note: v.optional(v.string()),
    transferPairId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"])
    .index("by_user_wallet", ["userId", "walletId"])
    .index("by_transfer_pair", ["transferPairId"]),

  budgets: defineTable({
    userId: v.id("users"),
    categoryId: v.id("categories"),
    limitAmount: v.number(),
    cycleStart: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_category", ["userId", "categoryId"]),

  goals: defineTable({
    userId: v.id("users"),
    name: v.string(),
    targetAmount: v.number(),
    currentAmount: v.number(),
    deadline: v.optional(v.string()),
    icon: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("completed")),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"]),
});
