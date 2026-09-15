"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { pricingCards } from "@/lib/constant";
import { useModal } from "@/providers/modal-provider";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Loading from "@/components/global/loading";
import SubscriptionForm from ".";

type Props = {
  customerId: string;
  planExists: boolean;
};

const SubscriptionFormWrapper = ({ customerId, planExists }: Props) => {
  const { data } = useModal();

  const [selectedPriceId, setSelectedPriceId] = useState<string>(
    data?.plans?.defaultPriceId || ""
  );

  const [subscription, setSubscription] = useState<{
    subscriptionId: string;
    razorpayKeyId: string;
    prefill: { email?: string; contact?: string };
  }>({
    subscriptionId: "",
    razorpayKeyId: "",
    prefill: {},
  });

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedPriceId) return;

    const createSubscription = async () => {
      setCreating(true);
      setError("");
      setSubscription({ subscriptionId: "", razorpayKeyId: "", prefill: {} });

      try {
        const subscriptionResponse = await fetch("/api/razorpay/create-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId,
            planId: selectedPriceId,
          }),
        });

        const subscriptionResponseData = await subscriptionResponse.json();

        if (!subscriptionResponse.ok) {
          setError(subscriptionResponseData.error || "Could not start the subscription.");
          return;
        }

        setSubscription({
          subscriptionId: subscriptionResponseData.subscriptionId,
          razorpayKeyId: subscriptionResponseData.razorpayKeyId,
          prefill: subscriptionResponseData.prefill || {},
        });
      } finally {
        setCreating(false);
      }
    };

    createSubscription();
  }, [selectedPriceId, customerId]);

  return (
    <div className="space-y-6">
      {/* PLAN SELECTION */}
      <div className="space-y-4">
        {data.plans?.plans.map((price) => {
          const isActive = selectedPriceId === price.id;

          return (
            <Card
              key={price.id}
              onClick={() => setSelectedPriceId(price.id)}
              className={clsx(
                `
                  relative cursor-pointer rounded-xl border
                  bg-white dark:bg-[#101010]
                  border-neutral-200 dark:border-neutral-800
                  transition-all
                  hover:shadow-[0_16px_32px_-16px_rgba(0,0,0,0.6)]
                `,
                {
                  "ring-2 ring-emerald-500": isActive,
                }
              )}
            >
              <CardHeader className="space-y-2">
                <CardTitle className="text-lg font-semibold text-black dark:text-white">
                  ₹{price.unit_amount ? price.unit_amount / 100 : "0"}
                </CardTitle>

                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {price.nickname}
                </p>

                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {
                    pricingCards.find(
                      (p) => p.priceId === price.id
                    )?.description
                  }
                </p>
              </CardHeader>

              {isActive && (
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              )}
            </Card>
          );
        })}
      </div>

      {error && <p className="text-sm font-mono text-red-500">{error}</p>}

      {/* PAYMENT SECTION */}
      {subscription.subscriptionId && !creating && (
        <div className="space-y-4">
          <h1 className="text-xl font-semibold text-black dark:text-white">
            Payment_Method
          </h1>

          <SubscriptionForm
            subscriptionId={subscription.subscriptionId}
            razorpayKeyId={subscription.razorpayKeyId}
            prefill={subscription.prefill}
            planExists={planExists}
          />
        </div>
      )}

      {/* LOADING */}
      {creating && (
        <div className="flex items-center justify-center w-full h-40 rounded-xl
          bg-neutral-50 dark:bg-neutral-900 border
          border-neutral-200 dark:border-neutral-800">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default SubscriptionFormWrapper;
