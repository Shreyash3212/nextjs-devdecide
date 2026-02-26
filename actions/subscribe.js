"use server";

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Resend } from "resend";

// --- AWS SES Setup (Currently Disabled) ---
// In production, ensure AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY are in your .env
const sesClient = new SESClient({ region: process.env.AWS_REGION || "ap-south-1" });

// --- Resend Setup (Currently Active) ---
// Ensure RESEND_API_KEY is in your .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

// ==========================================
// INFRASTRUCTURE TOGGLE
// Change this to `true` once AWS SES production access is approved
// ==========================================
const USE_AWS_SES = false; 

export async function subscribeToNewsletter(formData) {
  const email = formData.get('email');

  if (!email || !email.includes('@')) {
    return { error: 'Please provide a valid email address.' };
  }

  try {
    if (USE_AWS_SES) {
      // --------------------------------------------------
      // PATH A: AMAZON SES (Ready for the future)
      // --------------------------------------------------
      const command = new SendEmailCommand({
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Body: {
            Text: { Data: "Welcome to DevDecide! You'll now receive our weekly B2B SaaS breakdowns." },
          },
          Subject: { Data: "Subscription Confirmed - DevDecide" },
        },
        Source: "hello@devdecide.com", // Must be a verified identity in SES
      });

      await sesClient.send(command);

    } else {
      // --------------------------------------------------
      // PATH B: RESEND (Active right now)
      // --------------------------------------------------
      await resend.emails.send({
        from: 'Pranay <hello@devdecide.com>', 
        to: email,
        subject: 'Subscription Confirmed - DevDecide',
        // Note: You can swap this simple HTML out for the React Email component later
        html: '<p>Welcome to DevDecide! You will now receive our weekly B2B SaaS breakdowns.</p>',
      });
    }

    // 2. Save this email to your MongoDB database here

    return { success: true };
    
  } catch (error) {
    console.error("Email Infrastructure Error:", error);
    return { error: 'Failed to subscribe. Please try again later.' };
  }
}