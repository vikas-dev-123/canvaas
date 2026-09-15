import crypto from "crypto";
import { NextResponse } from "next/server";
import { subscriptionActivated, deactivateSubscription } from "@/lib/razorpay/razorpay-actions";

type RazorpaySubscriptionEntity = {
    id: string;
    plan_id: string;
    customer_id: string;
    status: string;
    current_end: number;
};

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
        console.log("🔴 Razorpay webhook secret or signature missing.");
        return new NextResponse("Webhook not configured", { status: 400 });
    }

    const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex");
    if (expectedSignature !== signature) {
        console.log("🔴 Razorpay webhook signature mismatch.");
        return new NextResponse("Invalid signature", { status: 400 });
    }

    let event: { event: string; payload: { subscription?: { entity: RazorpaySubscriptionEntity } } };
    try {
        event = JSON.parse(body);
    } catch (error) {
        return new NextResponse("Invalid payload", { status: 400 });
    }

    try {
        const subscription = event.payload.subscription?.entity;

        switch (event.event) {
            case "subscription.activated":
            case "subscription.charged": {
                if (!subscription) break;
                await subscriptionActivated({
                    razorpaySubscriptionId: subscription.id,
                    planId: subscription.plan_id,
                    customerId: subscription.customer_id,
                    active: true,
                    currentPeriodEndDate: new Date(subscription.current_end * 1000),
                });
                break;
            }
            case "subscription.completed":
            case "subscription.cancelled":
            case "subscription.halted": {
                if (!subscription) break;
                await deactivateSubscription(subscription.id);
                break;
            }
            default:
                console.log("👉🏻 Unhandled Razorpay event:", event.event);
        }
    } catch (error) {
        console.log("🔴 Razorpay webhook handling error", error);
        return new NextResponse("Webhook Error", { status: 400 });
    }

    return NextResponse.json({ webhookActionReceived: true }, { status: 200 });
}
