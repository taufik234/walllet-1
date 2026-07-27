import { Id } from "./_generated/dataModel";
import { QueryCtx, MutationCtx } from "./_generated/server";

export async function getSession(ctx: QueryCtx | MutationCtx, token: string | null) {
  if (!token) return null;
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .first();
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    await ctx.db.delete(session._id);
    return null;
  }
  const user = await ctx.db.get(session.userId);
  if (!user) return null;
  return { session, user };
}

export async function assertAuth(ctx: QueryCtx | MutationCtx, args: { token: string }) {
  const result = await getSession(ctx, args.token);
  if (!result) throw new Error("Not authenticated");
  return result;
}

export async function calculateWalletBalances(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
): Promise<Record<Id<"wallets">, number>> {
  const wallets = await ctx.db
    .query("wallets")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  const transactions = await ctx.db
    .query("transactions")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  const balances: Record<Id<"wallets">, number> = {};
  for (const w of wallets) {
    const initial = w.initialBalance || 0;
    const walletTx = transactions.filter((t) => t.walletId === w._id);
    const income = walletTx
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = walletTx
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    balances[w._id] = initial + income - expense;
  }
  return balances;
}
