"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { pricingCards } from "@/lib/constant";
import { useModal } from "@/providers/modal-provider";
import { Plan } from "@prisma/client";
import { StripeElementsOptions } from "@stripe/stripe-js";
import clsx from "clsx";
import { Elements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getStripe } from "@/lib/stripe/stripe-client";
import Loading from "@/components/global/loading";
import SubscriptionForm from ".";

type Props = {
  customerId: string;
  planExists: boolean;
};

const SubscriptionFormWrapper = ({ customerId, planExists }: Props) => {
  const { data, setClose } = useModal();
  const router = useRouter();

  const [selectedPriceId, setSelectedPriceId] = useState<Plan | "">(
    data?.plans?.defaultPriceId || ""
  );

  const [subscription, setSubscription] = useState<{
    subscriptionId: string;
    clientSecret: string;
  }>({
    subscriptionId: "",
    clientSecret: "",
  });

  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret: subscription.clientSecret,
      appearance: {
        theme: "night",
      },
    }),
    [subscription]
  );

  useEffect(() => {
    if (!selectedPriceId) return;

    const createSecret = async () => {
      const subscriptionResponse = await fetch(
        "/api/stripe/create-subscription",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId,
            priceId: selectedPriceId,
          }),
        }
      );

      const subscriptionResponseData = await subscriptionResponse.json();

      setSubscription({
        clientSecret: subscriptionResponseData.clientSecret,
        subscriptionId: subscriptionResponseData.subscriptionId,
      });

      if (planExists) {
        toast({
          title: "Success",
          description: "Your plan has been successfully upgraded!",
        });
        setClose();
        router.refresh();
      }
    };

    createSecret();
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
              onClick={() => setSelectedPriceId(price.id as Plan)}
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

      {/* PAYMENT SECTION */}
      {options.clientSecret && !planExists && (
        <div className="space-y-4">
          <h1 className="text-xl font-semibold text-black dark:text-white">
            Payment_Method
          </h1>

          <Elements stripe={getStripe()} options={options}>
            <SubscriptionForm selectedPriceId={selectedPriceId} />
          </Elements>
        </div>
      )}

      {/* LOADING */}
      {!options.clientSecret && selectedPriceId && (
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
