import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getStripeOAuthLink } from "@/lib/utils";
import { CheckCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  params: {
    agencyId: string;
  };
  searchParams: {
    code: string;
  };
};

const Page = async ({ params, searchParams }: Props) => {
  const agencyDetails = await db.agency.findUnique({
    where: { id: params.agencyId },
  });

  if (!agencyDetails) return;

  const allDetailsExist =
    agencyDetails.address &&
    agencyDetails.agencyLogo &&
    agencyDetails.city &&
    agencyDetails.companyEmail &&
    agencyDetails.companyPhone &&
    agencyDetails.country &&
    agencyDetails.name &&
    agencyDetails.state &&
    agencyDetails.zipCode;

  const stripeOAuthLink = getStripeOAuthLink(
    "agency",
    `launchpad__${agencyDetails.id}`
  );

  let connectedStripeAccount = false;

  if (searchParams.code) {
    if (!agencyDetails.connectAccountId) {
      try {
        const response = await stripe.oauth.token({
          grant_type: "authorization_code",
          code: searchParams.code,
        });

        await db.agency.update({
          where: { id: params.agencyId },
          data: { connectAccountId: response.stripe_user_id },
        });

        connectedStripeAccount = true;
      } catch (error) {
        console.log("🔴 Could not connect stripe account");
      }
    }
  }

  return (
    <div
      className="
        min-h-screen w-full
        flex items-center justify-center
        bg-white dark:bg-[#101010]
        px-4
      "
    >
      <div className="w-full max-w-3xl">
        <Card
          className="
            rounded-2xl border
            bg-white dark:bg-[#101010]
            border-neutral-200 dark:border-neutral-800
            shadow-[0_32px_64px_-20px_rgba(0,0,0,0.65)]
          "
        >
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-black dark:text-white">
              Launchpad_Setup
            </CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Complete the steps below to activate your agency workspace
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* STEP 1 */}
            <div
              className="
                flex items-center justify-between gap-4
                rounded-xl border p-4
                bg-neutral-50 dark:bg-neutral-900
                border-neutral-200 dark:border-neutral-800
              "
            >
              <div className="flex items-center gap-4 flex-col md:flex-row">
                <Image
                  src="/appstore.png"
                  alt="App shortcut"
                  height={64}
                  width={64}
                  className="rounded-md object-contain"
                />
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  Save the platform as a shortcut on your mobile device
                </p>
              </div>
            </div>

            {/* STEP 2 */}
            <div
              className="
                flex items-center justify-between gap-4
                rounded-xl border p-4
                bg-neutral-50 dark:bg-neutral-900
                border-neutral-200 dark:border-neutral-800
              "
            >
              <div className="flex items-center gap-4 flex-col md:flex-row">
                <Image
                  src="/stripelogo.png"
                  alt="Stripe"
                  height={64}
                  width={64}
                  className="rounded-md object-contain"
                />
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  Connect Stripe to accept payments and unlock analytics
                </p>
              </div>

              {agencyDetails.connectAccountId || connectedStripeAccount ? (
                <CheckCircleIcon
                  size={36}
                  className="text-emerald-500 flex-shrink-0"
                />
              ) : (
                <Link
                  href={stripeOAuthLink}
                  className="
                    px-4 py-2 rounded-md
                    bg-black text-white
                    dark:bg-white dark:text-black
                    text-sm font-medium
                    hover:opacity-90
                  "
                >
                  Start
                </Link>
              )}
            </div>

            {/* STEP 3 */}
            <div
              className="
                flex items-center justify-between gap-4
                rounded-xl border p-4
                bg-neutral-50 dark:bg-neutral-900
                border-neutral-200 dark:border-neutral-800
              "
            >
              <div className="flex items-center gap-4 flex-col md:flex-row">
                <Image
                  src={agencyDetails.agencyLogo}
                  alt="Agency logo"
                  height={64}
                  width={64}
                  className="rounded-md object-contain"
                />
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  Complete all business and compliance details
                </p>
              </div>

              {allDetailsExist ? (
                <CheckCircleIcon
                  size={36}
                  className="text-emerald-500 flex-shrink-0"
                />
              ) : (
                <Link
                  href={`/agency/${params.agencyId}/settings`}
                  className="
                    px-4 py-2 rounded-md
                    bg-black text-white
                    dark:bg-white dark:text-black
                    text-sm font-medium
                    hover:opacity-90
                  "
                >
                  Start
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
