import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { getSession } from "@/lib/auth/getSession";

const ALLOWED_FOLDERS = ["agency-logos", "subaccount-logos", "avatars", "media"];

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { folder } = await req.json();
    if (!folder || !ALLOWED_FOLDERS.includes(folder)) {
        return NextResponse.json({ error: "Invalid upload folder" }, { status: 400 });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = { timestamp, folder: `canvaas/${folder}` };

    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET ?? "");

    return NextResponse.json({
        signature,
        timestamp,
        folder: paramsToSign.folder,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
}
