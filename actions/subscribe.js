'use server';

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Initialize the SES Client
// In production, ensure AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY are in your .env
const sesClient = new SESClient({ region: process.env.AWS_REGION || "ap-south-1" });

export async function subscribeToNewsletter(formData) {
  const email = formData.get('email');

  if (!email || !email.includes('@')) {
    return { error: 'Please provide a valid email address.' };
  }

  try {
    // 1. Send a welcome email to the subscriber
    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Text: { Data: "Welcome to TechReview.io! You'll now receive our weekly B2B SaaS breakdowns." },
        },
        Subject: { Data: "Subscription Confirmed - TechReview.io" },
      },
      Source: "hello@yourdomain.com", // Must be a verified identity in SES
      // If you are using configuration sets for tracking bounces/deliverability, you can add it here:
      // ConfigurationSetName: "YourNewsletterConfigSet",
    });

    await sesClient.send(command);

    // 2. In a full production app, you would also save this email to a database here (like DynamoDB or Postgres)

    return { success: true };
  } catch (error) {
    console.error("SES Error:", error);
    return { error: 'Failed to subscribe. Please try again later.' };
  }
}