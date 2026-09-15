import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { customerId, planId } = await req.json();
    if (!customerId || !planId) {
        return NextResponse.json({ error: "Customer id or plan id is missing" }, { status: 400 });
    }

    const agency = await db.agency.findFirst({
        where: { customerId },
        include: { Subscription: true },
    });

    try {
        // Razorpay has no in-place "change plan" for a subscription the way Stripe does —
        // the existing subscription is cancelled and a fresh one is created for the new plan.
        if (agency?.Subscription?.razorpaySubscriptionId && agency.Subscription.active) {
            try {
                await razorpay.subscriptions.cancel(agency.Subscription.razorpaySubscriptionId, false);
            } catch (cancelError) {
                console.log("Could not cancel previous Razorpay subscription (it may already be inactive):", cancelError);
            }
        }

        // Razorpay subscriptions don't take a customer_id at creation time — the
        // subscription is linked to a customer once they complete the Checkout
        // authorization payment, and that customer_id arrives on the webhook.
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            total_count: 12,
            customer_notify: 1,
            quantity: 1,
            notes: { agencyCustomerId: customerId },
        });

        // Prefilling the existing customer's email/contact on Checkout makes Razorpay
        // match this payment to the same customer record instead of creating a new one.
        let prefill: { email?: string; contact?: string } = {};
        try {
            const customer = await razorpay.customers.fetch(customerId);
            prefill = { email: customer.email, contact: customer.contact ? String(customer.contact) : undefined };
        } catch (fetchError) {
            console.log("Could not fetch Razorpay customer for checkout prefill:", fetchError);
        }

        return NextResponse.json({
            subscriptionId: subscription.id,
            razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            prefill,
        });
    } catch (error: any) {
        console.error("Razorpay create-subscription error:", error);
        return NextResponse.json({ error: error?.error?.description || "Failed to create subscription." }, { status: 500 });
    }
}
