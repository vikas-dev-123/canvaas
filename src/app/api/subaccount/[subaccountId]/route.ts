import { NextResponse } from "next/server";
import { SubAccountService, NotificationService } from "@/services";

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