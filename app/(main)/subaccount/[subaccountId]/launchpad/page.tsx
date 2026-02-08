import BlurPage from "@/components/global/blur-page";
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
import { CheckCircleIcon, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  searchParams: {
    state: string;
    code: string;
  };
  params: { subaccountId: string };
};

const Page = async ({ searchParams, params }: Props) => {
  const subAccountDetails = await db.subAccount.findUnique({
    where: { id: params.subaccountId },
  });

  if (!subAccountDetails) return;

  const allDetailsExist =
    subAccountDetails.address &&
    subAccountDetails.subAccountLogo &&
    subAccountDetails.city &&
    subAccountDetails.companyEmail &&
    subAccountDetails.companyPhone &&
    subAccountDetails.country &&
    subAccountDetails.name &&
    subAccountDetails.state;

  const stripeOAuthLink = getStripeOAuthLink(
    "subaccount",
    `launchpad__${subAccountDetails.id}`
  );

  let connectedStripeAccount = false;

  if (searchParams.code && !subAccountDetails.connectAccountId) {
    try {
      const response = await stripe.oauth.token({
        grant_type: "authorization_code",
        code: searchParams.code,
      });

      await db.subAccount.update({
        where: { id: params.subaccountId },
        data: { connectAccountId: response.stripe_user_id },
      });

      connectedStripeAccount = true;
    } catch (error) {
      console.log("🔴 Stripe connection failed", error);
    }
  }

  return (
    <BlurPage>
      <div className="flex justify-center py-12">
        <Card
          className="
            w-full max-w-3xl
            bg-white dark:bg-[#0f0f0f]
            border border-neutral-200 dark:border-neutral-800
            rounded-3xl
            shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]
          "
        >
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-semibold">
              Launchpad_Setup
            </CardTitle>
            <CardDescription className="text-neutral-500">
              Complete these steps to activate your sub-account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* STEP 1 */}
            <div
              className="
                flex items-center justify-between
                rounded-2xl border
                border-neutral-200 dark:border-neutral-800
                bg-neutral-50 dark:bg-neutral-900/40
                p-5
              "
            >
              <div className="flex items-center gap-4">
                <Image
                  src="/appstore.png"
                  alt="App shortcut"
                  height={56}
                  width={56}
                  className="rounded-xl object-contain"
                />
                <div>
                  <p className="font-medium">Add App Shortcut</p>
                  <p className="text-sm text-neutral-500">
                    Save this app to your home screen for quick access.
                  </p>
                </div>
              </div>

              
            </div>

            {/* STEP 2 */}
            <div
              className="
                flex items-center justify-between
                rounded-2xl border
                border-neutral-200 dark:border-neutral-800
                bg-neutral-50 dark:bg-neutral-900/40
                p-5
              "
            >
              <div className="flex items-center gap-4">
                <Image
                  src="/stripelogo.png"
                  alt="Stripe"
                  height={56}
                  width={56}
                  className="rounded-xl object-contain"
                />
                <div>
                  <p className="font-medium">Connect Stripe</p>
                  <p className="text-sm text-neutral-500">
                    Enable payments & payouts through Stripe.
                  </p>
                </div>
              </div>

              {subAccountDetails.connectAccountId ||
              connectedStripeAccount ? (
                <CheckCircleIcon className="text-emerald-500" size={36} />
              ) : (
                <Link href={stripeOAuthLink}>
                  <Button className="gap-2 bg-[#000000]">
                    Connect <ArrowRight size={16} />
                  </Button>
                </Link>
              )}
            </div>

            {/* STEP 3 */}
            <div
              className="
                flex items-center justify-between
                rounded-2xl border
                border-neutral-200 dark:border-neutral-800
                bg-neutral-50 dark:bg-neutral-900/40
                p-5
              "
            >
              <div className="flex items-center gap-4">
                <Image
                  src={subAccountDetails.subAccountLogo}
                  alt="Business logo"
                  height={56}
                  width={56}
                  className="rounded-xl object-contain bg-white p-2"
                />
                <div>
                  <p className="font-medium">Business Details</p>
                  <p className="text-sm text-neutral-500">
                    Complete your sub-account profile.
                  </p>
                </div>
              </div>

              {allDetailsExist ? (
                <CheckCircleIcon className="text-emerald-500" size={36} />
              ) : (
                <Link
                  href={`/subaccount/${subAccountDetails.id}/settings`}
                >
                  <Button className="gap-2">
                    Complete <ArrowRight size={16} />
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </BlurPage>
  );
};

export default Page;
