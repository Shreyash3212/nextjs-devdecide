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

    // 5. Construct the Welcome Email HTML (Broad Audience Welcome)
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; color: #111827; line-height: 1.6; max-width: 600px;">
        <p>Hey there,</p>
        
        <p>Thanks for joining the DevDecide newsletter. You are officially on the list.</p>
        
        <p>Our goal is to help you make the best software choices for your business or project. Moving forward, we will be sending you our latest content the moment it is published. You can expect:</p>
        
        <ul style="color: #4B5563; padding-left: 20px;">
          <li style="margin-bottom: 8px;"><strong>In-depth Blogs:</strong> Guides, industry insights, and software trends.</li>
          <li style="margin-bottom: 8px;"><strong>Direct Comparisons:</strong> Head-to-head matchups so you can see exactly how competing tools stack up against each other.</li>
          <li style="margin-bottom: 8px;"><strong>B2B SaaS Reviews:</strong> Honest breakdowns of features, pricing, and overall usability.</li>
        </ul>
        
        <p>Keep an eye on your inbox for our next update. Until then, feel free to explore the latest posts already live on the site.</p>
        
        <p>Cheers,<br>Shreyash</p>
        
        <div style="margin-top: 40px; font-size: 12px; color: #9CA3AF;">
          <a href="https://devdecide.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #9CA3AF; text-decoration: underline;">Unsubscribe</a>
        </div>
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
