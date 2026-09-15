"use server";

// NOTE: this file now only supports the Stripe Connect marketplace checkout that lets
// sub-accounts sell their own products through funnels. Canvaas's own subscription
// billing has moved to Razorpay — see lib/razorpay/*.

import { stripe } from ".";

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
