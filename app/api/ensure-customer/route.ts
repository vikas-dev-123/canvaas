import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { agencyId } = await req.json();

    if (!agencyId) {
      return NextResponse.json({ error: "Agency ID is required" }, { status: 400 });
    }

    // Fetch the agency details
    const agency = await db.agency.findUnique({
      where: { id: agencyId },
    });

    if (!agency) {
      return NextResponse.json({ error: "Agency not found" }, { status: 404 });
    }

    // Check if agency already has a customerId
    if (agency.customerId && agency.customerId.trim() !== "") {
      return NextResponse.json({ customerId: agency.customerId });
    }

    // Create a new Stripe customer
    const customer = await stripe.customers.create({
      email: agency.companyEmail,
      name: agency.name,
      shipping: {
        name: agency.name,
        address: {
          city: agency.city,
          state: agency.state,
          country: agency.country,
          postal_code: agency.zipCode,
          line1: agency.address,
        },
      },
      address: {
        city: agency.city,
        state: agency.state,
        country: agency.country,
        postal_code: agency.zipCode,
        line1: agency.address,
      },
    });

    // Update the agency with the new customer ID
    const updatedAgency = await db.agency.update({
      where: { id: agencyId },
      data: { customerId: customer.id },
    });

    return NextResponse.json({ customerId: customer.id });
  } catch (error) {
    console.error("Error ensuring customer:", error);
    return NextResponse.json({ error: "Failed to ensure customer" }, { status: 500 });
  }
}