import { razorpay } from "@/lib/razorpay";
import { NextResponse } from "next/server";

export type RazorpayCustomerType = {
    email: string;
    name: string;
    contact?: string;
};

export async function POST(req: Request) {
    const { email, name, contact }: RazorpayCustomerType = await req.json();

    if (!email || !name) {
        return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    try {
        const customer = await razorpay.customers.create({
            email,
            name,
            contact: contact || undefined,
            fail_existing: 0,
        });

        return NextResponse.json({
            customerId: customer.id,
            message: "Customer created successfully",
        });
    } catch (error: any) {
        console.error("Razorpay create-customer error:", error);
        return NextResponse.json({ error: error?.error?.description || "Internal Server Error" }, { status: 500 });
    }
}
