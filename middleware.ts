import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { checkAuthRateLimit } from "@/lib/rate-limit";

// Sub-paths under /agency that must stay reachable without a session.
const PUBLIC_AGENCY_PATHS = ["/agency/sign-in", "/agency/sign-up", "/agency/verify-otp", "/agency/forgot-password", "/agency/reset-password", "/agency/unauthorized"];

const isProtectedPath = (pathname: string) => {
    if (pathname.startsWith("/subaccount")) return true;
    if (pathname.startsWith("/agency")) {
        return !PUBLIC_AGENCY_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    }
    return false;
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const searchParams = url.searchParams.toString();
    const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

    // Rate-limit the new auth endpoints before anything else touches them.
    if (url.pathname.startsWith("/api/auth")) {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.ip || "unknown";
        const { success } = await checkAuthRateLimit(ip);
        if (!success) {
            return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
        }
    }

    // Custom subdomain rewrite (funnel domains) — preserved verbatim from the previous Clerk middleware.
    const customSubDomain = req.headers.get("host")?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`).filter(Boolean)[0];
    if (customSubDomain) {
        return NextResponse.rewrite(new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url));
    }

    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
        return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
    }

    if (url.pathname === "/" || (url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)) {
        return NextResponse.rewrite(new URL("/site", req.url));
    }

    if (isProtectedPath(url.pathname)) {
        const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
        const session = await verifySessionToken(token);
        if (!session) {
            const signInUrl = new URL("/agency/sign-in", req.url);
            signInUrl.searchParams.set("redirect", pathWithSearchParams);
            return NextResponse.redirect(signInUrl);
        }
    }

    if (url.pathname.startsWith("/agency") || url.pathname.startsWith("/subaccount")) {
        return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
    }
}

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
