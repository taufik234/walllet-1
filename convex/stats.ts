import { v } from "convex/values";
import { query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { assertAuth, calculateWalletBalances } from "./helpers";

export const getStats = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    let totalIncome = 0;
    let totalExpense = 0;
    for (const t of transactions) {
      if (t.type === "income") totalIncome += t.amount;
      else totalExpense += t.amount;
    }

    const walletBalances = await calculateWalletBalances(ctx, user._id);
    const totalBalance = Object.values(walletBalances).reduce(
      (s, b) => s + b,
      0
    );

    return {
      global: { totalIncome, totalExpense, totalBalance },
      wallets: walletBalances,
    };
  },
});

export const getExpenseByCategory = query({
  args: {
    token: v.string(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await assertAuth(ctx, args);
    let transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    if (args.startDate) {
      transactions = transactions.filter((t) => t.date >= args.startDate);
    }
    if (args.endDate) {
      transactions = transactions.filter((t) => t.date <= args.endDate);
    }

    const grouped: Record<string, { amount: number; categoryName: string }> = {};
    for (const t of transactions) {
      if (t.type !== "expense") continue;
      const catId = t.categoryId || "unknown";
      if (!grouped[catId]) {
        const cat = t.categoryId ? await ctx.db.get(t.categoryId) : null;
        grouped[catId] = {
          categoryName: cat?.name || "Lainnya",
          amount: 0,
        };
      }
      grouped[catId].amount += t.amount;
    }

    const result = Object.entries(grouped).map(([categoryId, g]) => ({
      categoryId,
      categoryName: g.categoryName,
      amount: g.amount,
    }));
    result.sort((a, b) => b.amount - a.amount);

    const total = result.reduce((sum, r) => sum + r.amount, 0);
    return result.map((r) => ({
      ...r,
      percentage: total > 0 ? (r.amount / total) * 100 : 0,
    }));
  },
});
