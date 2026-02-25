"use server";

import dbConnect from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// 1. Initialize the AWS SES Client using your .env.local keys
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function subscribeToNewsletter(formData) {
  await dbConnect();

  try {
    const email = formData.get("email");

    if (!email) {
      return { success: false, message: "Email is required." };
    }

    // 2. Check if they are already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return { success: false, message: "You are already on the list!" };
    }

    // 3. Save to MongoDB
    await Subscriber.create({ email });

    // 4. Construct the Welcome Email
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
            Data: `
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
            `,
            Charset: "UTF-8",
          },
        },
      },
    };

    // 5. Send the email via AWS
    const command = new SendEmailCommand(params);
    await sesClient.send(command);

    return { success: true, message: "Subscribed successfully! Check your inbox." };
  } catch (error) {
    console.error("Newsletter Subscription Error:", error);
    return { success: false, message: "Something went wrong. Please try again." };
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
      { new: true } // Returns the updated document
    );

    if (!updatedUser) {
      return { success: false, message: "We couldn't find that email in our system." };
    }

    return { success: true, message: "You have been successfully unsubscribed." };
  } catch (error) {
    console.error("Unsubscribe Error:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}