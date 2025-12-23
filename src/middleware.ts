import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// This middleware protects all routes including api/trpc routes
export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const searchParams = url.searchParams.toString();
  const headers = req.headers;

  const pathWithSearchParams = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // -------------------------------
  // Subdomain handling
  // -------------------------------
  const host = headers.get("host") || "";
  const domain = process.env.NEXT_PUBLIC_DOMAIN?.trim();

  // Only rewrite for subdomains when a base domain is configured
  const baseHost = host.split(":")[0]; // strip port for local dev
  const hasBaseDomain = Boolean(domain && baseHost.endsWith(domain));
  const hasCustomSubDomain = Boolean(
    hasBaseDomain && domain && baseHost !== domain
  );
  const customSubDomain = hasCustomSubDomain
    ? baseHost.replace(`.${domain}`, "")
    : "";

  // Skip subdomain rewrite for global/auth routes so they keep working
  const skipSubdomainRewrite = [
    "/agency",
    "/sign-in",
    "/sign-up",
    "/api",
    "/trpc",
  ];

  if (
    customSubDomain &&
    !skipSubdomainRewrite.some((path) => url.pathname.startsWith(path))
  ) {
    return NextResponse.rewrite(
      new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
    );
  }

  // -------------------------------
  // Auth routes redirect
  // -------------------------------
  if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
    return NextResponse.redirect(
      new URL("/agency/sign-in", req.url)
    );
  }

  // -------------------------------
  // Root / Site handling
  // -------------------------------
  if (
    url.pathname === "/" ||
    (url.pathname === "/site" && host === domain)
  ) {
    return NextResponse.rewrite(
      new URL("/site", req.url)
    );
  }

  // -------------------------------
  // Agency / Subaccount
  // -------------------------------
  if (
    url.pathname.startsWith("/agency") ||
    url.pathname.startsWith("/subaccount")
  ) {
    return NextResponse.next();
  }

  // -------------------------------
  // Default allow
  // -------------------------------
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
