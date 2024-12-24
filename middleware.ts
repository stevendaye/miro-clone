import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
  isAuthenticatedNextjs,
} from "@convex-dev/auth/nextjs/server";

const isAuthPage = createRouteMatcher(["/auth"]);

export default convexAuthNextjsMiddleware(async (request) => {
  if (!isAuthPage(request) && !(await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request, "/auth");
  }
  if (isAuthPage(request) && (await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request, "/");
  }
});

export const config = {
  matcher: [
    {
      source: "/((?!.*\\.|_next).*)",
      missing: [{ type: "header", key: "next-action" }],
    },
    "/",
    "/(api|trpc)(.*)",
  ],
};
