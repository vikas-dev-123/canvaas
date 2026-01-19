import { NextResponse } from "next/server";
import { upsertAgency, initUser } from "@/lib/queries";
import { v4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail } = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required" },
        { status: 400 }
      );
    }

    // Initialize/create the user first
    const userData = await initUser({
      email: userEmail,
      role: "AGENCY_OWNER"
    });

    if (!userData) {
      return NextResponse.json(
        { error: "Failed to initialize user" },
        { status: 500 }
      );
    }

    // Create agency for this user
    const agencyData = {
      id: v4(),
      name: `${userData.name}'s Agency`,
      companyEmail: userEmail,
      companyPhone: "",
      address: "",
      city: "",
      zipCode: "",
      state: "",
      country: "",
      agencyLogo: "",
      whiteLabel: false,
      connectAccountId: "",
      goal: 5000
    };

    const agency = await upsertAgency(agencyData);

    if (!agency) {
      return NextResponse.json(
        { error: "Failed to create agency" },
        { status: 500 }
      );
    }

    // Update user with agency ID
    await initUser({
      email: userEmail,
      role: "AGENCY_OWNER",
      agencyId: agency.id
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Agency created successfully",
        agency: agency,
        user: { ...userData, agencyId: agency.id }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating agency:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}