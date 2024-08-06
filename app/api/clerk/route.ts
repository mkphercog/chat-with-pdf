export const dynamic = "force-dynamic";

import deleteFilesWithAccount from "@/actions/deleteFilesWithAccount";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const payload: WebhookEvent = await request.json();

  if (!payload.data?.id)
    return new Response("Invalid Payload", { status: 400 });

  if (payload.type === "user.deleted") {
    await deleteFilesWithAccount(payload.data.id);
  }

  return new Response(JSON.stringify({ message: "Received" }), { status: 200 });
}
