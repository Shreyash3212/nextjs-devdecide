"use client";

import { useState } from "react";
import { unsubscribeUser } from "@/actions/newsletter";
import Link from "next/link";

export default function UnsubscribeForm({ email }) {
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  async function handleAction(formData) {
    setStatus("loading");
    
    const result = await unsubscribeUser(formData);
    
    if (result.success) {
      setStatus("success");
      setMessage(result.message);
    } else {
      setStatus("error");
      setMessage(result.message);
    }
  }

  // If successful, swap out the form for the success message
  if (status === "success") {
    return (
      <div className="text-center animate-fade-in">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Successfully Unsubscribed</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <Link href="/" className="inline-block bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors">
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Unsubscribe</h1>
      <p className="text-gray-600 mb-6">
        Are you sure you want to unsubscribe <strong>{email}</strong> from the DevDecide newsletter?
      </p>

      <form action={handleAction}>
        <input type="hidden" name="email" value={email} />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors mb-4 disabled:opacity-70"
        >
          {status === "loading" ? "Processing..." : "Confirm Unsubscribe"}
        </button>
      </form>

      {status === "error" && (
        <p className="text-red-600 text-sm mb-4 font-medium">{message}</p>
      )}

      <Link href="/" className="text-gray-500 text-sm hover:underline">
        Nevermind, keep me subscribed
      </Link>
    </div>
  );
}