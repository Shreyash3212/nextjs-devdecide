// app/admin/edit/[id]/page.js
import { getBlogById, updateBlog } from '@/actions/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function EditBlogPage({ params }) {
  const resolvedParams = await params;
  const blog = await getBlogById(resolvedParams.id);

  if (!blog) {
    return <div className="p-10 text-center">Blog not found.</div>;
  }

  async function handleUpdate(formData) {
    "use server";
    await updateBlog(blog._id, formData);
    redirect('/admin');
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link href="/admin" className="text-blue-600 hover:underline text-sm font-medium mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog: {blog.title}</h1>
      </div>

      <form action={handleUpdate} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Blog Title</label>
            <input type="text" name="title" defaultValue={blog.title} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug</label>
            <input type="text" name="slug" defaultValue={blog.slug} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Publish Date</label>
          <input type="date" name="date" defaultValue={blog.date} required className="w-full border border-gray-300 rounded-lg px-4 py-2" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Short Summary</label>
          <textarea name="summary" defaultValue={blog.summary} required rows="2" className="w-full border border-gray-300 rounded-lg px-4 py-2"></textarea>
        </div>

        {/* --- SEO SETTINGS SECTION --- */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">SEO Settings (Optional)</h3>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title (Overrides default title)</label>
            <input 
              type="text" 
              name="metaTitle" 
              defaultValue={blog?.metaTitle || ''} // Use comp?. or review?. for the other pages!
              className="w-full border border-gray-300 rounded-lg px-4 py-2" 
              placeholder="e.g. 10 Best CRM Tools in 2026"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
            <textarea 
              name="metaDescription" 
              defaultValue={blog?.metaDescription || ''} 
              rows="2" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Write a compelling snippet for Google search results..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Target Keywords (Comma separated)</label>
            <input 
              type="text" 
              name="metaKeywords" 
              defaultValue={blog?.metaKeywords || ''} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2" 
              placeholder="saas, crm, developer tools, nextjs"
            />
          </div>
        </div>
        {/* ----------------------------- */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Markdown Content</label>
          <textarea name="content" defaultValue={blog.content} required rows="12" className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm"></textarea>
        </div>

        <div className="flex items-center">
          <input type="checkbox" name="trending" id="trending" defaultChecked={blog.trending} className="h-5 w-5 text-blue-600 rounded border-gray-300" />
          <label htmlFor="trending" className="ml-3 text-sm font-medium text-gray-700">Pin to "Trending" on Homepage</label>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </form>
    </main>
  );
}