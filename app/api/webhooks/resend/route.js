import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

export async function POST(req) {
  try {
    const payload = await req.json();

    if (payload.type === "email.bounced" || payload.type === "email.complained") {
      
      // Force lowercase and trim to perfectly match your MongoDB schema rules
      const problematicEmail = payload.data.to[0]?.toLowerCase().trim();

      if (problematicEmail) {
        await dbConnect();
        
        // Find and update the user, and return the updated document to confirm
        const updatedUser = await Subscriber.findOneAndUpdate(
          { email: problematicEmail },
          { status: payload.type === "email.bounced" ? "bounced" : "complained" },
          { new: true } // This forces Mongoose to return the updated document
        );
        
        if (updatedUser) {
          console.log(`✅ Successfully updated ${problematicEmail} to ${updatedUser.status}`);
        } else {
          console.log(`❌ Webhook received, but ${problematicEmail} was not found in database.`);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
    
  } catch (error) {
    console.error("🚨 Resend Webhook Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}