import { UserIdentity } from "convex/server";
import { query } from "~server/_generated/server";

export const getIdentity = query({
  args: {},
  handler: async (ctx): Promise<UserIdentity | null> => {
    return await ctx.auth.getUserIdentity();
  },
});
