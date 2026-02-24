// app/admin/comparisons/edit/[id]/page.js
import { getComparisonById, updateComparison } from '@/actions/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function EditComparisonPage({ params }) {
  const resolvedParams = await params;
  const comp = await getComparisonById(resolvedParams.id);

  if (!comp) return <div className="p-10 text-center">Comparison not found.</div>;

  async function handleUpdate(formData) {
    "use server";
    await updateComparison(comp._id, formData);
    redirect('/admin');
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link href="/admin" className="text-blue-600 hover:underline text-sm font-medium mb-4 inline-block">← Back to Dashboard</Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Comparison: {comp.tool1} vs {comp.tool2}</h1>
      </div>

      <form action={handleUpdate} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Tool 1</label><input type="text" name="tool1" defaultValue={comp.tool1} required className="w-full border rounded-lg px-4 py-2" /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Tool 2</label><input type="text" name="tool2" defaultValue={comp.tool2} required className="w-full border rounded-lg px-4 py-2" /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Winner</label><input type="text" name="winner" defaultValue={comp.winner} required className="w-full border rounded-lg px-4 py-2" /></div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug</label><input type="text" name="slug" defaultValue={comp.slug} required className="w-full border rounded-lg px-4 py-2" /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Publish Date</label><input type="date" name="date" defaultValue={comp.date} required className="w-full border rounded-lg px-4 py-2" /></div>
        </div>
        <div><label className="block text-sm font-semibold text-gray-700 mb-2">Summary</label><textarea name="summary" defaultValue={comp.summary} required rows="2" className="w-full border rounded-lg px-4 py-2"></textarea></div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Table Data (JSON Array)</label>
          {/* We stringify the array back into JSON text for the textarea */}
          <textarea name="table" defaultValue={JSON.stringify(comp.table)} required rows="5" className="w-full border rounded-lg px-4 py-2 font-mono text-sm"></textarea>
        </div>
        <div><label className="block text-sm font-semibold text-gray-700 mb-2">Markdown Content</label><textarea name="content" defaultValue={comp.content} required rows="10" className="w-full border rounded-lg px-4 py-2 font-mono text-sm"></textarea></div>
        <div className="flex items-center"><input type="checkbox" name="trending" id="trending" defaultChecked={comp.trending} className="h-5 w-5 text-blue-600 rounded" /><label htmlFor="trending" className="ml-3 text-sm font-medium">Pin to "Trending"</label></div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Save Changes</button>
      </form>
    </main>
  );
}