"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plan } from "@prisma/client";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";

type Props = {
  selectedPriceId: string | Plan;
};

const SubscriptionForm = ({ selectedPriceId }: Props) => {
  const { toast } = useToast();
  const elements = useElements();
  const stripeHook = useStripe();
  const [priceError, setPriceError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!selectedPriceId) {
      setPriceError("You need to select a plan to subscribe.");
      return;
    }
    setPriceError("");
    event.preventDefault();
    if (!stripeHook || !elements) return;

    try {
      const { error } = await stripeHook.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/agency`,
        },
      });
      if (error) throw new Error();

      toast({
        title: "Payment successful",
        description: "Your payment has been successfully processed.",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: "We couldn't process your payment. Please try a different card.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        space-y-4
        rounded-2xl border p-6
        bg-white dark:bg-[#101010]
        border-neutral-200 dark:border-neutral-800
        shadow-[0_24px_48px_-18px_rgba(0,0,0,0.65)]
      "
    >
      {/* ERROR */}
      {priceError && (
        <p className="text-sm font-mono text-red-500">
          {priceError}
        </p>
      )}

      {/* STRIPE ELEMENT */}
      <div
        className="
          rounded-xl border p-4
          bg-neutral-50 dark:bg-neutral-900
          border-neutral-200 dark:border-neutral-800
        "
      >
        <PaymentElement />
      </div>

      {/* SUBMIT */}
      <Button
        disabled={!stripeHook}
        className="
          w-full mt-2 py-6
          text-sm font-semibold tracking-wide
          bg-black text-white
          dark:bg-white dark:text-black
          hover:opacity-90
          disabled:opacity-50
        "
      >
        Confirm_Payment
      </Button>
    </form>
  );
};

export default SubscriptionForm;
