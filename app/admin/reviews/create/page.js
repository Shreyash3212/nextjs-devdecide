// app/admin/reviews/create/page.js
import { createReview } from '@/actions/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function CreateReviewPage() {
  async function handleCreate(formData) {
    "use server";
    await createReview(formData);
    redirect('/admin');
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link href="/admin" className="text-blue-600 hover:underline text-sm font-medium mb-4 inline-block">← Back to Dashboard</Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Review</h1>
      </div>

      <form action={handleCreate} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Title</label><input type="text" name="title" required className="w-full border rounded-lg px-4 py-2" /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug</label><input type="text" name="slug" required className="w-full border rounded-lg px-4 py-2" /></div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Rating (0-5)</label><input type="number" step="0.1" name="rating" required className="w-full border rounded-lg px-4 py-2" /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Review Count</label><input type="number" name="reviewCount" required className="w-full border rounded-lg px-4 py-2" /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Starting Price</label><input type="text" name="price" placeholder="$45/mo" required className="w-full border rounded-lg px-4 py-2" /></div>
        </div>
        <div><label className="block text-sm font-semibold text-gray-700 mb-2">Publish Date</label><input type="date" name="date" required className="w-full border rounded-lg px-4 py-2" /></div>
        <div><label className="block text-sm font-semibold text-gray-700 mb-2">Summary</label><textarea name="summary" required rows="2" className="w-full border rounded-lg px-4 py-2"></textarea></div>
        <div><label className="block text-sm font-semibold text-gray-700 mb-2">Markdown Content</label><textarea name="content" required rows="10" className="w-full border rounded-lg px-4 py-2 font-mono text-sm"></textarea></div>
        <div className="flex items-center"><input type="checkbox" name="trending" id="trending" className="h-5 w-5 text-blue-600 rounded" /><label htmlFor="trending" className="ml-3 text-sm font-medium">Pin to "Trending"</label></div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Publish Review</button>
      </form>
    </main>
  );
}