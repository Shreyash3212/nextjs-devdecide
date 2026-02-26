"use server";

import dbConnect from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Resend } from "resend";

// 1. Initialize the AWS SES Client (Currently Disabled)
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 2. Initialize Resend (Currently Active)
// Ensure RESEND_API_KEY is in your .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

// ==========================================
// INFRASTRUCTURE TOGGLE
// Change this to `true` once AWS SES production access is approved
// ==========================================
const USE_AWS_SES = false;

export async function subscribeToNewsletter(formData) {
  await dbConnect();

  try {
    const email = formData.get("email");

    if (!email) {
      return { success: false, message: "Email is required." };
    }

    // 3. Check if they are already in the database
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      // If they are already active, stop here and show the message
      if (existingSubscriber.status === "active") {
        return { success: false, message: "You are already on the list!" };
      }

      // If they previously unsubscribed, reactivate their account
      if (
        existingSubscriber.status === "unsubscribed" ||
        existingSubscriber.status === "unsubscribe"
      ) {
        existingSubscriber.status = "active";
        await existingSubscriber.save();

        // Note: We intentionally DO NOT return here.
        // We let the code continue down to send them the Welcome Email again.
      }
    } else {
      // 4. Brand new subscriber, create them in MongoDB
      await Subscriber.create({ email, status: "active" });
    }

    // 5. Construct the Welcome Email HTML (Shared by both providers)
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a202c;">Welcome to DevDecide</h2>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.5;">
          Hey there,<br><br>
          Thanks for joining the DevDecide newsletter. You are now on the list to receive our latest B2B SaaS reviews, infrastructure deep-dives, and technical comparisons.
        </p>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.5;">
          Expect our best engineering breakdowns in your inbox soon.<br><br>
          Cheers,<br>
          Shreyash
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #a0aec0; font-size: 12px; line-height: 1.5; text-align: center;">
          You are receiving this email because you opted in at DevDecide.com.<br><br>
          <a href="https://devdecide.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #3182ce; text-decoration: underline;">Unsubscribe from this list</a><br><br>
          DevDecide<br>
          Nagpur, Maharashtra, India
        </p>
      </div>
    `;

    // 6. Route the email based on the toggle
    if (USE_AWS_SES) {
      // --- PATH A: AMAZON SES ---
      const params = {
        Source: process.env.AWS_SES_FROM_EMAIL, // Must be your verified email
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Subject: {
            Data: "Welcome to DevDecide! 🚀",
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: htmlContent,
              Charset: "UTF-8",
            },
          },
        },
      };
      const command = new SendEmailCommand(params);
      await sesClient.send(command);
    } else {
      // --- PATH B: RESEND ---
      await resend.emails.send({
        from: "Shreyash <hello@devdecide.com>", // Update this to match your verified Resend domain
        to: email,
        subject: "Welcome to DevDecide! 🚀",
        html: htmlContent,
      });
    }

    return {
      success: true,
      message: "Subscribed successfully! Check your inbox.",
    };
  } catch (error) {
    console.error("Newsletter Subscription Error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function unsubscribeUser(formData) {
  await dbConnect();

  try {
    const email = formData.get("email");

    if (!email) {
      return { success: false, message: "No email provided." };
    }

    // Find the user and update their status
    const updatedUser = await Subscriber.findOneAndUpdate(
      { email: email },
      { status: "unsubscribed" },
      { new: true }, // Returns the updated document
    );

    if (!updatedUser) {
      return {
        success: false,
        message: "We couldn't find that email in our system.",
      };
    }

    return {
      success: true,
      message: "You have been successfully unsubscribed.",
    };
  } catch (error) {
    console.error("Unsubscribe Error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
