import { NextResponse } from "next/server";
import { SubAccountService, UserService, PermissionsService, NotificationService } from "@/services";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      agencyId,
      name,
      companyEmail,
      companyPhone,
      address,
      city,
      zipCode,
      state,
      country,
      subAccountLogo,
      goal,
      connectAccountId,
      userName,
      userId
    } = body;

    // Create new subaccount
    const response = await SubAccountService.create({
      id: id,
      agencyId: agencyId,
      name: name,
      companyEmail: companyEmail,
      companyPhone: companyPhone,
      address: address,
      city: city,
      zipCode: zipCode,
      state: state,
      country: country,
      subAccountLogo: subAccountLogo,
      goal: goal || 5000,
      connectAccountId: connectAccountId || "",
    } as any);

    // Create default permissions for agency owner
    // Find agency owner
    const agencyUsers = await UserService.findByAgencyId(agencyId);
    const agencyOwner = agencyUsers.find(user => user.role === 'AGENCY_OWNER');

    if (agencyOwner) {
      await PermissionsService.create({
        email: agencyOwner.email,
        subAccountId: response.id,
        access: true
      } as any);
    }

    if (response) {
      await NotificationService.create({
        notification: `${userName} | created sub account | ${response.name}`,
        agencyId: response.agencyId,
        subAccountId: response.id,
        userId: userId
      } as any);
    }

    return NextResponse.json(
      { success: true, data: response },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating subaccount:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    // Extract ID from URL for update
    // Note: For a proper PUT request with ID in URL, we'd typically handle this differently
    // For now, extracting from request body
    
    const body = await req.json();
    const {
      id,
      agencyId,
      name,
      companyEmail,
      companyPhone,
      address,
      city,
      zipCode,
      state,
      country,
      subAccountLogo,
      userName,
      userId
    } = body;

    // Update existing subaccount
    const response = await SubAccountService.update(id, {
      name: name,
      companyEmail: companyEmail,
      companyPhone: companyPhone,
      address: address,
      city: city,
      zipCode: zipCode,
      state: state,
      country: country,
      subAccountLogo: subAccountLogo,
    } as any);

    if (response) {
      await NotificationService.create({
        notification: `${userName} | updated sub account | ${response.name}`,
        agencyId: response.agencyId,
        subAccountId: response.id,
        userId: userId
      } as any);
    }

    return NextResponse.json(
      { success: true, data: response },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating subaccount:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}