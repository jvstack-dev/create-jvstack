/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as protected_ from "../protected.js";
import type * as stripe_catalog from "../stripe/catalog.js";
import type * as stripe_checkout from "../stripe/checkout.js";
import type * as stripe_client from "../stripe/client.js";
import type * as stripe_plan from "../stripe/plan.js";
import type * as stripe_prices from "../stripe/prices.js";
import type * as stripe_queries from "../stripe/queries.js";
import type * as stripe_sdk from "../stripe/sdk.js";
import type * as users_sync from "../users/sync.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  http: typeof http;
  protected: typeof protected_;
  "stripe/catalog": typeof stripe_catalog;
  "stripe/checkout": typeof stripe_checkout;
  "stripe/client": typeof stripe_client;
  "stripe/plan": typeof stripe_plan;
  "stripe/prices": typeof stripe_prices;
  "stripe/queries": typeof stripe_queries;
  "stripe/sdk": typeof stripe_sdk;
  "users/sync": typeof users_sync;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  stripe: import("@convex-dev/stripe/_generated/component.js").ComponentApi<"stripe">;
};
