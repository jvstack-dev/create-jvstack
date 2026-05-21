import { SignOutButton } from "@clerk/clerk-react";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@__APP_NAME__/server/api";

export const Route = createFileRoute("/_authed/")({
  beforeLoad: () => ({ greetQueryOpts: convexQuery(api.protected.greet) }),
  loader: async ({ context }) => await context.queryClient.ensureQueryData(context.greetQueryOpts),
  component: RouteComponent,
});

function RouteComponent() {
  const greetQueryOpts = Route.useRouteContext({ select: (ctx) => ctx.greetQueryOpts });
  const { data: greeting } = useSuspenseQuery(greetQueryOpts);
  return (
    <div className="space-y-2 p-4">
      <p>{greeting}</p>
      <SignOutButton />
    </div>
  );
}
