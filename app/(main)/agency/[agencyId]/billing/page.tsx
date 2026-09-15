import { addOnProducts, pricingCards } from "@/lib/constant";
import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import { listNormalizedPlans } from "@/lib/razorpay/razorpay-actions";
import React from "react";
import PricingCard from "./_components/pricing-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";

type Props = {
  params: {
    agencyId: string;
  };
};

const Page = async ({ params }: Props) => {
  const planPriceIds = pricingCards.map((c) => c.priceId).filter(Boolean);
  const prices = await listNormalizedPlans(planPriceIds);

  const addOnPlans = await listNormalizedPlans(addOnProducts.map((p) => p.id));

  const agencySubscription = await db.agency.findUnique({
    where: { id: params.agencyId },
    select: {
      customerId: true,
      Subscription: true,
    },
  });

  const currentPlanDetails = pricingCards.find(
    (c) => c.priceId === agencySubscription?.Subscription?.priceId
  );

  let allCharges: {
    description: string;
    id: string;
    date: string;
    status: string;
    amount: number;
  }[] = [];

  if (agencySubscription?.customerId) {
    try {
      const invoices = await razorpay.invoices.all({
        customer_id: agencySubscription.customerId,
        count: 50,
      });

      allCharges = invoices.items.map((invoice: any) => ({
        description: invoice.description || `Invoice ${invoice.invoice_number || invoice.id}`,
        id: invoice.id,
        date: new Date((invoice.paid_at || invoice.created_at) * 1000).toLocaleString(),
        status: invoice.status === "paid" ? "Paid" : invoice.status,
        amount: (invoice.amount || 0) / 100,
      }));
    } catch (error) {
      console.log("Could not load Razorpay invoices:", error);
    }
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-6 pb-16">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
          Billing_Console
        </h1>
        <p className="text-sm font-mono text-neutral-500 dark:text-neutral-400">
          Manage subscriptions & payment telemetry
        </p>
      </div>

      {/* CURRENT PLAN */}
      <h2 className="text-2xl font-semibold text-black dark:text-white">
        Current_Plan
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        <PricingCard
          planExists={agencySubscription?.Subscription?.active === true}
          prices={prices}
          customerId={agencySubscription?.customerId || ""}
          amt={
            agencySubscription?.Subscription?.active
              ? currentPlanDetails?.price || "₹0"
              : "₹0"
          }
          buttonCta={
            agencySubscription?.Subscription?.active
              ? "Change Plan"
              : "Get Started"
          }
          highlightTitle="Plan_Options"
          highlightDescription="Modify or upgrade your subscription configuration."
          description={
            agencySubscription?.Subscription?.active
              ? currentPlanDetails?.description || "Active subscription"
              : "Pick a plan that fits your operational scale."
          }
          duration="/ month"
          features={
            currentPlanDetails?.features ||
            pricingCards.find((p) => p.title === "Starter")?.features ||
            []
          }
          title={
            agencySubscription?.Subscription?.active
              ? currentPlanDetails?.title || "Starter"
              : "Starter"
          }
        />

        {addOnPlans.map((addOn) => (
          <PricingCard
            key={addOn.id}
            planExists={agencySubscription?.Subscription?.active === true}
            prices={prices}
            customerId={agencySubscription?.customerId || ""}
            amt={addOn.unit_amount ? `₹${addOn.unit_amount / 100}` : "₹0"}
            buttonCta="Subscribe"
            title="24/7_Priority_Support"
            description="Dedicated operational support channel"
            duration="/ month"
            features={[]}
            highlightTitle="Priority_Channel"
            highlightDescription="Immediate response & faster resolution."
          />
        ))}
      </div>

      {/* PAYMENT HISTORY */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Payment_History
        </h2>

        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#101010] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-100 dark:bg-neutral-900">
                <TableHead>Description</TableHead>
                <TableHead>Invoice_ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="font-medium">
              {allCharges.map((charge) => (
                <TableRow
                  key={charge.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
                >
                  <TableCell>{charge.description}</TableCell>
                  <TableCell className="text-neutral-500 font-mono">
                    {charge.id}
                  </TableCell>
                  <TableCell>{charge.date}</TableCell>
                  <TableCell>
                    <span
                      className={clsx("text-xs font-mono", {
                        "text-emerald-500":
                          charge.status.toLowerCase() === "paid",
                        "text-orange-500":
                          charge.status.toLowerCase() === "pending" || charge.status.toLowerCase() === "issued",
                        "text-red-500":
                          charge.status.toLowerCase() === "failed" || charge.status.toLowerCase() === "expired",
                      })}
                    >
                      {charge.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ₹{charge.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Page;
