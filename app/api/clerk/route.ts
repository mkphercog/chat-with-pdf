export const dynamic = "force-dynamic";

import deleteFilesWithAccount from "@/actions/deleteFilesWithAccount";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const payload: WebhookEvent = await request.json();

    console.log("Received payload:", payload);

    if (!payload.data || !payload.data.id) {
      console.error("Invalid payload:", payload);
      return new Response("Invalid Payload", { status: 400 });
    }

    if (payload.type === "user.deleted") {
      await deleteFilesWithAccount(payload.data.id);
    }

    return new Response(JSON.stringify({ message: "Received" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
