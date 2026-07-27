import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { assertAuth } from "./helpers";

export const create = mutation({
  args: {
    token: v.string(),
    fromWalletId: v.id("wallets"),
    toWalletId: v.id("wallets"),
    amount: v.number(),
    date: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    const transferPairId = crypto.randomUUID();
    const today = args.date || new Date().toISOString().split("T")[0];
    const label = args.note || "Transfer";

    const t1 = await ctx.db.insert("transactions", {
      userId: user._id,
      type: "expense",
      amount: args.amount,
      walletId: args.fromWalletId,
      date: today,
      note: label,
      transferPairId,
      createdAt: Date.now(),
    });

    const t2 = await ctx.db.insert("transactions", {
      userId: user._id,
      type: "income",
      amount: args.amount,
      walletId: args.toWalletId,
      date: today,
      note: label,
      transferPairId,
      createdAt: Date.now(),
    });

    const [tx1, tx2] = await Promise.all([
      ctx.db.get(t1),
      ctx.db.get(t2),
    ]);

    return { transferPairId, transactions: [tx1, tx2] };
  },
});

export const remove = mutation({
  args: { token: v.string(), transferPairId: v.string() },
  handler: async (ctx, args) => {
    await assertAuth(ctx, args);
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_transfer_pair", (q) =>
        q.eq("transferPairId", args.transferPairId)
      )
      .collect();
    for (const t of transactions) {
      await ctx.db.delete(t._id);
    }
  },
});
