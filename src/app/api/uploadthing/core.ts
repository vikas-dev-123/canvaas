import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  /**
   * Slug MUST match frontend:
   * slug=agencyLogo
   */
  agencyLogo: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      /**
       * Clerk auth (server-side)
       */
      const { userId } = await auth();

      if (!userId) {
        throw new UploadThingError("Unauthorized");
      }

      // Only return serializable data
      return {
        userId,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      /**
       * Runs on server AFTER upload
       */
      console.log("✅ Upload completed");
      console.log("User:", metadata.userId);
      console.log("File URL:", file.ufsUrl);

      // This is sent back to the client
      return {
        uploadedBy: metadata.userId,
        url: file.ufsUrl,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
