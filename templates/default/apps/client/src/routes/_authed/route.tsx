import { createFileRoute, Outlet } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@__APP_NAME__/server/api";
import { SignIn } from "@clerk/clerk-react";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authed")({
  beforeLoad: () => ({ identityQueryOpts: convexQuery(api.auth.getIdentity) }),
  loader: async ({ context }) => await context.queryClient.ensureQueryData(context.identityQueryOpts),
  component: RouteComponent,
});

function RouteComponent() {
  const identityQueryOpts = Route.useRouteContext({ select: (ctx) => ctx.identityQueryOpts });
  const { data: identity } = useSuspenseQuery(identityQueryOpts);
  if (identity) return <Outlet />;

  return <SignIn />;
}
