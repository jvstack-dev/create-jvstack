import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { shadcn } from "@clerk/themes";
import { ptBR } from "@clerk/localizations";
import { env } from "~client/env";
import { routeTree } from "~client/routeTree.gen";

export interface RouterContext {
  convexClient: ConvexReactClient;
  convexQueryClient: ConvexQueryClient;
  queryClient: QueryClient;
}

const convexClient = new ConvexReactClient(env.VITE_CONVEX_URL, { unsavedChangesWarning: false });
const convexQueryClient = new ConvexQueryClient(convexClient);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5000,
      queryFn: convexQueryClient.queryFn(),
      queryKeyHashFn: convexQueryClient.hashFn(),
    },
  },
});
convexQueryClient.connect(queryClient);
const router = createRouter({
  routeTree,
  context: { convexClient, convexQueryClient, queryClient },
  defaultPendingComponent: () => <p>loading...</p>,
  defaultErrorComponent: (err) => <p>{err.error.stack}</p>,
  defaultNotFoundComponent: () => <p>not found</p>,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
const root = ReactDOM.createRoot(rootElement);
root.render(
  <StrictMode>
    <ClerkProvider
      publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}
      appearance={{ baseTheme: shadcn }}
      localization={ptBR}
    >
      <ConvexProviderWithClerk client={convexQueryClient.convexClient} useAuth={useAuth}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <TanStackDevtools
            plugins={[
              { name: "TanStack Query", render: <ReactQueryDevtoolsPanel /> },
              { name: "TanStack Router", render: <TanStackRouterDevtoolsPanel router={router} /> },
              formDevtoolsPlugin(),
            ]}
          />
        </QueryClientProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>,
);
