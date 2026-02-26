import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

export async function POST(req) {
  try {
    const payload = await req.json();

    // 1. Check if the event is a hard bounce or a spam complaint
    if (payload.type === "email.bounced" || payload.type === "email.complained") {
      
      // Resend stores the target email address in an array inside data.to
      const problematicEmail = payload.data.to[0];

      if (problematicEmail) {
        await dbConnect();
        
        // 2. Find the user and flag their account so we never send to them again
        // We use "bounced" or "complained" instead of deleting them entirely, 
        // acting as a suppression list so they can't re-subscribe.
        await Subscriber.findOneAndUpdate(
          { email: problematicEmail },
          { status: payload.type === "email.bounced" ? "bounced" : "complained" }
        );
        
        console.log(`Action taken: Suppressed ${problematicEmail} due to ${payload.type}`);
      }
    }

    // 3. Always return a 200 OK so Resend knows you received the webhook
    return NextResponse.json({ received: true }, { status: 200 });
    
  } catch (error) {
    console.error("Resend Webhook Error:", error);
    // Return 500 if your server crashed so Resend knows to retry the webhook later
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}