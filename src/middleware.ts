import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware({
  publicRoutes: ["/api/uploadthing"],

  afterAuth(auth, req) {
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

    const baseHost = host.split(":")[0];
    const hasBaseDomain = Boolean(domain && baseHost.endsWith(domain));
    const hasCustomSubDomain =
      hasBaseDomain && domain && baseHost !== domain;

    const customSubDomain = hasCustomSubDomain
      ? baseHost.replace(`.${domain}`, "")
      : "";

    const skipSubdomainRewrite = [
      "/agency",
      "/sign-in",
      "/sign-up",
      "/api",
      "/trpc",
    ];

    if (
      customSubDomain &&
      !skipSubdomainRewrite.some((path) =>
        url.pathname.startsWith(path)
      )
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

    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
