import { db } from "../db";
import { razorpay } from ".";
import type { NormalizedPrice } from "../types";

type SubscriptionActivatedInput = {
    razorpaySubscriptionId: string;
    planId: string;
    customerId: string;
    active: boolean;
    currentPeriodEndDate: Date;
};

export const subscriptionActivated = async ({ razorpaySubscriptionId, planId, customerId, active, currentPeriodEndDate }: SubscriptionActivatedInput) => {
    try {
        const agency = await db.agency.findFirst({
            where: { customerId },
            include: { Subscription: true },
        });

        if (!agency) {
            throw new Error("Could not find an agency to upsert the subscription for.");
        }

        const data = {
            active,
            agencyId: agency.id,
            customerId,
            currentPeriodEndDate,
            priceId: planId,
            razorpaySubscriptionId,
            plan: planId,
        };

        await db.subscription.upsert({
            where: { agencyId: agency.id },
            create: data,
            update: data,
        });

        console.log(`🟢 Synced Razorpay subscription ${razorpaySubscriptionId} (active=${active}) for agency ${agency.id}`);
    } catch (error) {
        console.log("🔴 Error syncing Razorpay subscription", error);
    }
};

export const deactivateSubscription = async (razorpaySubscriptionId: string) => {
    try {
        await db.subscription.updateMany({
            where: { razorpaySubscriptionId },
            data: { active: false },
        });
    } catch (error) {
        console.log("🔴 Error deactivating Razorpay subscription", error);
    }
};

/** Fetches and normalizes a set of Razorpay Plans into the shape the billing UI expects. */
export const listNormalizedPlans = async (planIds: string[]): Promise<NormalizedPrice[]> => {
    const plans = await Promise.all(
        planIds
            .filter(Boolean)
            .map(async (id) => {
                try {
                    const plan = await razorpay.plans.fetch(id);
                    return {
                        id: plan.id,
                        unit_amount: Number(plan.item?.amount ?? 0),
                        nickname: (plan.item?.name ?? null) as string | null,
                    } satisfies NormalizedPrice;
                } catch (error) {
                    console.log(`🔴 Could not fetch Razorpay plan ${id}`, error);
                    return null;
                }
            })
    );

    return plans.filter((p): p is NormalizedPrice => p !== null);
};
