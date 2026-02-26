import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

export async function POST(req) {
  try {
    const payload = await req.json();

    // 1. Listen for bounces, complaints, AND suppressions
    const allowedEvents = ["email.bounced", "email.complained", "email.suppressed"];

    if (allowedEvents.includes(payload.type)) {
      
      const problematicEmail = payload.data.to[0]?.toLowerCase().trim();

      if (problematicEmail) {
        await dbConnect();
        
        // 2. Determine the exact status to save
        let newStatus = "bounced";
        if (payload.type === "email.complained") newStatus = "complained";
        if (payload.type === "email.suppressed") newStatus = "suppressed";
        
        // 3. Find and update the user
        const updatedUser = await Subscriber.findOneAndUpdate(
          { email: problematicEmail },
          { status: newStatus },
          { new: true } 
        );
        
        if (updatedUser) {
          console.log(`✅ Updated ${problematicEmail} to ${updatedUser.status}`);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
    
  } catch (error) {
    console.error("🚨 Resend Webhook Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}