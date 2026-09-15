// Client-safe helper: signs the upload through our own API (so it stays behind
// session auth, same as the old UploadThing routes did) then uploads the file
// directly to Cloudinary from the browser.

export type CloudinaryUploadResult = {
    secure_url: string;
    public_id: string;
};

const FOLDER_MAP = {
    agencyLogo: "agency-logos",
    subaccountLogo: "subaccount-logos",
    avatar: "avatars",
    media: "media",
} as const;

export type UploadEndpoint = keyof typeof FOLDER_MAP;

export const uploadToCloudinary = async (file: File, endpoint: UploadEndpoint, onProgress?: (pct: number) => void): Promise<CloudinaryUploadResult> => {
    const folder = FOLDER_MAP[endpoint];

    const signRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
    });

    if (!signRes.ok) {
        throw new Error("Could not authorize this upload.");
    }

    const { signature, timestamp, apiKey, cloudName, folder: signedFolder } = await signRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append("folder", signedFolder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl);

        xhr.upload.onprogress = (event) => {
            if (onProgress && event.lengthComputable) {
                onProgress(Math.round((event.loaded / event.total) * 100));
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(new Error("Upload failed. Please try again."));
            }
        };

        xhr.onerror = () => reject(new Error("Upload failed. Please try again."));
        xhr.send(formData);
    });
};
