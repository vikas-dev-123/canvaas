"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/providers/modal-provider";
import { useRouter } from "next/navigation";
import Script from "next/script";
import React, { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Props = {
  subscriptionId: string;
  razorpayKeyId: string;
  prefill?: { email?: string; contact?: string };
  planExists: boolean;
};

const SubscriptionForm = ({ subscriptionId, razorpayKeyId, prefill }: Props) => {
  const { toast } = useToast();
  const { setClose } = useModal();
  const router = useRouter();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [opening, setOpening] = useState(false);

  const handlePay = () => {
    if (!scriptLoaded || !window.Razorpay) {
      toast({
        variant: "destructive",
        title: "Payment unavailable",
        description: "Checkout is still loading. Please try again in a moment.",
      });
      return;
    }

    setOpening(true);

    const razorpayCheckout = new window.Razorpay({
      key: razorpayKeyId,
      subscription_id: subscriptionId,
      name: "Canvaas",
      description: "Subscription payment",
      prefill,
      theme: { color: "#000000" },
      handler: () => {
        toast({
          title: "Payment successful",
          description: "Your subscription is being activated.",
        });
        setClose();
        router.refresh();
      },
      modal: {
        ondismiss: () => setOpening(false),
      },
    });

    razorpayCheckout.on("payment.failed", () => {
      setOpening(false);
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: "We couldn't process your payment. Please try a different method.",
      });
    });

    razorpayCheckout.open();
  };

  return (
    <div
      className="
        space-y-4
        rounded-2xl border p-6
        bg-white dark:bg-[#101010]
        border-neutral-200 dark:border-neutral-800
        shadow-[0_24px_48px_-18px_rgba(0,0,0,0.65)]
      "
    >
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setScriptLoaded(true)} />

      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        You&apos;ll be redirected to Razorpay&apos;s secure checkout to complete this payment.
      </p>

      <Button
        onClick={handlePay}
        disabled={!scriptLoaded || opening}
        className="
          w-full mt-2 py-6
          text-sm font-semibold tracking-wide
          bg-black text-white
          dark:bg-white dark:text-black
          hover:opacity-90
          disabled:opacity-50
        "
      >
        {opening ? "Opening_Checkout..." : "Pay_&_Subscribe"}
      </Button>
    </div>
  );
};

export default SubscriptionForm;
