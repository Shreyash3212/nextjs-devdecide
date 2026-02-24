"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/actions/newsletter";

export default function NewsletterForm() {
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  async function handleAction(formData) {
    setStatus("loading");
    
    const result = await subscribeToNewsletter(formData);
    
    if (result.success) {
      setStatus("success");
      setMessage(result.message);
    } else {
      setStatus("error");
      setMessage(result.message);
    }
  }

  return (
    <section className="py-20 bg-blue-800 text-white text-center rounded-3xl my-10 px-6">
      <h2 className="text-3xl font-bold mb-4">Join 5,000+ Developers</h2>
      <p className="text-blue-100 mb-8 max-w-xl mx-auto">
        Get the latest technical teardowns and B2B SaaS reviews delivered straight to your inbox. No spam, ever.
      </p>
      
      {status === "success" ? (
        <div className="bg-white/20 p-4 rounded-lg inline-block text-white font-semibold">
          🎉 {message}
        </div>
      ) : (
        <form action={handleAction} className="max-w-md mx-auto flex gap-3">
          <input
            type="email"
            name="email"
            required
            placeholder="name@example.com"
            className="flex-grow px-4 py-3 rounded-lg text-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70"
          >
            {status === "loading" ? "Joining..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-4 text-red-200 text-sm font-semibold">{message}</p>
      )}
    </section>
  );
}