import { unsubscribeUser } from "@/actions/newsletter";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

export const metadata = {
  title: "Unsubscribe | DevDecide",
  robots: "noindex, nofollow",
};

export default async function UnsubscribePage({ searchParams }) {
  const params = await searchParams;
  const email = params?.email;

  // 1. Check if email exists in URL
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Link</h1>
          <p className="text-gray-600 mb-6">No email address was provided.</p>
          <Link href="/" className="text-blue-600 font-semibold hover:underline">Return to Homepage</Link>
        </div>
      </div>
    );
  }

  // 2. Connect to DB and check their current status
  await dbConnect();
  const user = await Subscriber.findOne({ email: email });

  // 3. Scenario: Email not found in database at all
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Found</h1>
          <p className="text-gray-600 mb-6"><strong>{email}</strong> is not currently in our system.</p>
          <Link href="/" className="text-blue-600 font-semibold hover:underline">Return to Homepage</Link>
        </div>
      </div>
    );
  }

  // 4. Scenario: User is already unsubscribed
  if (user.status === "unsubscribed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Already Unsubscribed</h1>
          <p className="text-gray-600 mb-6">
            <strong>{email}</strong> has already been removed from our mailing list. You will not receive any more emails from us.
          </p>
          <Link href="/" className="text-blue-600 font-semibold hover:underline">Return to Homepage</Link>
        </div>
      </div>
    );
  }

  // 5. Scenario: User is active, show them the form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Unsubscribe</h1>
        <p className="text-gray-600 mb-6">
          Are you sure you want to unsubscribe <strong>{email}</strong> from the DevDecide newsletter?
        </p>

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