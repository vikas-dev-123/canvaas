import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/getSession";

export async function POST() {
    clearSessionCookie();
    return NextResponse.json({ success: true });
}
