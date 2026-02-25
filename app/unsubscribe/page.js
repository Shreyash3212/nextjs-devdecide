import { unsubscribeUser } from "@/actions/newsletter";
import Link from "next/link";

export const metadata = {
  title: "Unsubscribe | DevDecide",
  robots: "noindex, nofollow", // Hides this page from Google Search
};

export default async function UnsubscribePage({ searchParams }) {
  // In Next.js 15, searchParams is a Promise
  const params = await searchParams;
  const email = params?.email;

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Link</h1>
          <p className="text-gray-600 mb-6">No email address was provided to unsubscribe.</p>
          <Link href="/" className="text-blue-600 font-semibold hover:underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Unsubscribe</h1>
        <p className="text-gray-600 mb-6">
          Are you sure you want to unsubscribe <strong>{email}</strong> from the DevDecide newsletter?
        </p>

        {/* The Next.js Server Action Form */}
        <form action={unsubscribeUser}>
          <input type="hidden" name="email" value={email} />
          <button
            type="submit"
            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors mb-4"
          >
            Confirm Unsubscribe
          </button>
        </form>

        <Link href="/" className="text-gray-500 text-sm hover:underline">
          Nevermind, keep me subscribed
        </Link>
      </div>
    </div>
  );
}