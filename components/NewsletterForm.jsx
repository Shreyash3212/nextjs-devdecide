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
    <section className="py-20 bg-gradient-to-br from-blue-500 to-blue-900 text-white text-center rounded-3xl my-10 px-6 shadow-2xl relative overflow-hidden">
      
      {/* Optional subtle glow effect in the background */}
      <div className="absolute top-0 left-0 w-full h-full bg-white/5 pointer-events-none" />

      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-4">Join 5,000+ Developers</h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          Get the latest technical teardowns and B2B SaaS reviews delivered straight to your inbox. No spam, ever.
        </p>
        
        {status === "success" ? (
          <div className="bg-white/20 border border-white/30 p-4 rounded-lg inline-block text-white font-semibold backdrop-blur-sm shadow-sm">
            🎉 {message}
          </div>
        ) : (
          <form action={handleAction} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              className="flex-grow px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/80 focus:border-transparent w-full transition-all backdrop-blur-md shadow-inner"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-50 hover:scale-105 transition-all disabled:opacity-70 w-full sm:w-auto whitespace-nowrap shadow-md"
            >
              {status === "loading" ? "Joining..." : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-4 text-red-200 text-sm font-semibold bg-red-900/50 inline-block px-4 py-1 rounded-full">{message}</p>
        )}
      </div>
    </section>
  );
}