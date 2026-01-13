"use server";

import Stripe from "stripe";
import { stripe } from ".";
import { Plan } from "@/lib/interfaces";
import { AgencyService, SubscriptionService } from "@/services";

export const subscriptionCreated = async (subscription: Stripe.Subscription, customerId: string) => {
    try {
        const agency = await AgencyService.findByCustomerId(customerId);

        if (!agency) {
            throw new Error("Could not find and agency to upsert the subscription");
        }

        const data = {
            active: subscription.status === "active",
            agencyId: agency.id,
            customerId,
            currentPeriodEndDate: new Date(subscription.current_period_end * 1000),
            //@ts-ignore
            priceId: subscription.plan.id,
            subscritiptionId: subscription.id,
            //@ts-ignore
            plan: subscription.plan.id as keyof typeof Plan,
        };

        console.log({ ...subscription });

        const existingSubscription = await SubscriptionService.findByAgencyId(agency.id);
        
        if (existingSubscription) {
          await SubscriptionService.update(existingSubscription.id, data);
        } else {
          await SubscriptionService.create(data);
        }

        console.log(`🟢 Created Subscription for ${subscription.id}`);
    } catch (error) {
        console.log("🔴 Error from Create action", error);
    }
};

export const getConnectAccountProducts = async (stripeAccount: string) => {
    const products = await stripe.products.list(
        {
            limit: 50,
            expand: ["data.default_price"],
        },
        {
            stripeAccount,
        }
    );
    return products.data;
};