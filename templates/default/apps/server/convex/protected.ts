import { ConvexError, v } from "convex/values";
import { query } from "~server/_generated/server";

export const greet = query({
  args: {},
  handler: async (ctx): Promise<string> => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new ConvexError("Unauthorized");
    return `Hello, ${identity.email ?? "anonymous"}!`;
  },
  returns: v.string(),
});
