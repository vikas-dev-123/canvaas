import { NextResponse } from "next/server";
import { SubAccountService, NotificationService } from "@/services";

// GET - Fetch subaccount by ID
export async function GET(
  req: Request,
  { params }: { params: { subaccountId: string } }
) {
  try {
    const subaccount = await SubAccountService.findById(params.subaccountId);
    
    if (!subaccount) {
      return NextResponse.json(
        { error: "Subaccount not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: subaccount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching subaccount:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete subaccount by ID
export async function DELETE(
  req: Request,
  { params }: { params: { subaccountId: string } }
) {
  try {
    // Get subaccount details for notification
    const subaccount = await SubAccountService.findById(params.subaccountId);

    if (!subaccount) {
      return NextResponse.json(
        { error: "Subaccount not found" },
        { status: 404 }
      );
    }

    // Create notification about the deletion
    await NotificationService.create({
      notification: `Delete a subaccount | ${subaccount?.name}`,
      agencyId: subaccount?.agencyId || '',
      subAccountId: params.subaccountId,
      userId: "system", // This should ideally be the actual user ID who performed the action
    } as any);

    // Delete the subaccount
    const result = await SubAccountService.delete(params.subaccountId);

    if (!result) {
      return NextResponse.json(
        { error: "Failed to delete subaccount" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Subaccount deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting subaccount:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update subaccount by ID
export async function PUT(
  req: Request,
  { params }: { params: { subaccountId: string } }
) {
  try {
    const body = await req.json();
    const {
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
    const response = await SubAccountService.update(params.subaccountId, {
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