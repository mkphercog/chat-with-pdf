export const dynamic = "force-dynamic";

import deleteFilesWithAccount from "@/actions/deleteFilesWithAccount";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || "";

const validateRequest = async (request: Request) => {
  const payloadString = await request.text();
  const headerPayload = headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  return wh.verify(payloadString, svixHeaders) as WebhookEvent;
};

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const payload = await validateRequest(request);

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
