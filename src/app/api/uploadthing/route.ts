import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

/**
 * 🚨 REQUIRED
 * UploadThing + Clerk need Node runtime
 */
export const runtime = "nodejs";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
