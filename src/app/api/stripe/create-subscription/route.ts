import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

function extractClientSecret(
  subscription: Stripe.Subscription
): string | null {
  const invoice = subscription.latest_invoice;

  if (
    typeof invoice !== "string" &&
    invoice &&
    typeof invoice.payment_intent !== "string" &&
    invoice.payment_intent
  ) {
    return invoice.payment_intent.client_secret ?? null;
  }

  return null; // ✅ THIS IS VALID STRIPE CASE
}

export async function POST(req: Request) {
  try {
    const { customerId, priceId } = await req.json();

    if (!customerId || !priceId) {
      return new NextResponse("Customer Id or price id is missing", {
        status: 400,
      });
    }

    const agency = await db.agency.findFirst({
      where: { customerId },
      include: { Subscription: true },
    });

    /**
     * ----------------------------
     * UPDATE EXISTING SUBSCRIPTION
     * ----------------------------
     */
    if (
      agency?.Subscription?.subscritiptionId &&
      agency.Subscription.active
    ) {
      const currentSubscription =
        await stripe.subscriptions.retrieve(
          agency.Subscription.subscritiptionId
        );

      const updatedSubscription =
        await stripe.subscriptions.update(
          agency.Subscription.subscritiptionId,
          {
            items: [
              {
                id: currentSubscription.items.data[0].id,
                deleted: true,
              },
              {
                price: priceId,
              },
            ],
            expand: ["latest_invoice.payment_intent"],
          }
        );

      const clientSecret =
        extractClientSecret(updatedSubscription);

      return NextResponse.json({
        subscriptionId: updatedSubscription.id,
        clientSecret, // 🔥 can be null
        status: clientSecret ? "requires_payment" : "active",
      });
    }

    /**
     * ----------------------------
     * CREATE NEW SUBSCRIPTION
     * ----------------------------
     */
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });

    const clientSecret = extractClientSecret(subscription);

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret, // 🔥 can be null
      status: clientSecret ? "requires_payment" : "active",
    });
  } catch (error) {
    console.error("Stripe subscription error:", error);
    return new NextResponse(
      "Error creating/updating subscription",
      { status: 500 }
    );
  }
}
