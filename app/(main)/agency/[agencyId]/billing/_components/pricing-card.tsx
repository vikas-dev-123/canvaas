"use client";

import SubscriptionFormWrapper from "@/components/forms/subscription-form/subscription-form-wrapper";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PricesList } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { useSearchParams } from "next/navigation";

type Props = {
  features: string[];
  buttonCta: string;
  title: string;
  description: string;
  amt: string;
  duration: string;
  highlightTitle: string;
  highlightDescription: string;
  customerId: string;
  prices: PricesList["data"];
  planExists: boolean;
};

const PricingCard = ({
  features,
  buttonCta,
  title,
  description,
  amt,
  duration,
  highlightTitle,
  highlightDescription,
  customerId,
  prices,
  planExists,
}: Props) => {
  const { setOpen } = useModal();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  const handleManagePlan = async () => {
    let validCustomerId = customerId;
    
    // Check if customerId is valid, if not create one
    if (!customerId || customerId.trim() === "") {
      try {
        // Get the agencyId from the URL
        const pathParts = window.location.pathname.split('/');
        const agencyId = pathParts[pathParts.indexOf('agency') + 1];
        
        if (agencyId) {
          // Ensure the agency has a valid customer ID
          const response = await fetch('/api/ensure-customer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ agencyId }),
          });
          
          if (response.ok) {
            const data = await response.json();
            validCustomerId = data.customerId;
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create customer');
          }
        }
      } catch (error) {
        console.error('Error creating customer:', error);
        alert('Failed to set up customer account. Please try again or contact support.');
        return;
      }
    }
    
    setOpen(
      <CustomModal
        title="Manage_Plan"
        subheading="Modify your subscription parameters at any time"
      >
        <SubscriptionFormWrapper
          customerId={validCustomerId}
          planExists={planExists}
        />
      </CustomModal>,
      async () => ({
        plans: {
          defaultPriceId: plan ? plan : "",
          plans: prices,
        },
      })
    );
  };

  return (
    <Card
      className="
        flex flex-col justify-between lg:w-1/2
        rounded-2xl border
        bg-white dark:bg-[#101010]
        border-neutral-200 dark:border-neutral-800
        shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]
      "
    >
      {/* TOP */}
      <div>
        <CardHeader className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold text-black dark:text-white">
              {title}
            </CardTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
          </div>

          <div className="text-right">
            <p className="text-5xl font-bold font-mono text-black dark:text-white">
              {amt}
            </p>
            <span className="text-xs font-mono text-neutral-500">
              {duration}
            </span>
          </div>
        </CardHeader>

        {/* FEATURES */}
        <CardContent>
          <ul className="space-y-2 mt-2">
            {features.map((feature, index) => (
              <li
                key={index}
                className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2"
              >
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </div>

      {/* FOOTER */}
      <CardFooter>
        <div
          className="
            w-full rounded-xl border p-4
            bg-neutral-50 dark:bg-neutral-900
            border-neutral-200 dark:border-neutral-800
            flex flex-col md:flex-row items-center justify-between gap-4
          "
        >
          <div>
            <p className="font-medium text-black dark:text-white">
              {highlightTitle}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {highlightDescription}
            </p>
          </div>

          <Button
            onClick={handleManagePlan}
            className="
              w-full md:w-fit
              bg-black text-white
              dark:bg-white dark:text-black
              hover:opacity-90
            "
          >
            {buttonCta}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
