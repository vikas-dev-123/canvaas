import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
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

    // Create a new Razorpay customer
    const customer = await razorpay.customers.create({
      email: agency.companyEmail,
      name: agency.name,
      contact: agency.companyPhone || undefined,
      fail_existing: 0,
    });

    // Update the agency with the new customer ID
    await db.agency.update({
      where: { id: agencyId },
      data: { customerId: customer.id },
    });

    return NextResponse.json({ customerId: customer.id });
  } catch (error: any) {
    console.error("Error ensuring customer:", error);
    return NextResponse.json({ error: error?.error?.description || "Failed to ensure customer" }, { status: 500 });
  }
}
