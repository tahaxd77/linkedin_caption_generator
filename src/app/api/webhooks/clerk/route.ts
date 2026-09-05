import { headers } from "next/headers";
import { Webhook, WebhookRequiredHeaders } from "svix";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const payload = await req.text();
  const headerPayload = await headers(); // ✅ no await

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET!;
  const wh = new Webhook(webhookSecret);

  let evt: any;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    } as WebhookRequiredHeaders);
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created") {
    await prisma.user.create({
      data: {
        clerkId: data.id, // ✅ Clerk's ID goes here
        email: data.email_addresses[0]?.email_address,
        firstName: data.first_name || null,
        lastName: data.last_name || null,
        imageUrl: data.image_url || null,
      },
    });
  }

  if (type === "user.updated") {
    await prisma.user.update({
      where: { clerkId: data.id },
      data: {
        email: data.email_addresses[0]?.email_address,
        firstName: data.first_name || null,
        lastName: data.last_name || null,
        imageUrl: data.image_url || null,
      },
    });
  }

  if (type === "user.deleted") {
    await prisma.user.delete({
      where: { clerkId: data.id },
    });
  }

  return new Response("Webhook processed", { status: 200 });
}
