export const dynamic = "force-dynamic";

import deleteFilesWithAccount from "@/actions/deleteFilesWithAccount";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const payload: WebhookEvent = await request.json();

  if (!payload.data.id) return;

  if (payload.type === "user.deleted") {
    deleteFilesWithAccount(payload.data.id);
  }

  return Response.json({ message: "Received" });
}
