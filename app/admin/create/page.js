// app/admin/create/page.js
import { createBlog } from "@/actions/admin";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function CreateBlogPage() {
  // A wrapper function to redirect you back to the dashboard after saving
  async function handleCreate(formData) {
    "use server";
    await createBlog(formData);
    redirect("/admin");
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-blue-600 hover:underline text-sm font-medium mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Blog</h1>
      </div>

      {/* The form action connects directly to the server function */}
      <form
        action={handleCreate}
        className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6"
      >
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Blog Title
            </label>
            <input
              type="text"
              name="title"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Next.js SEO Guide"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              URL Slug
            </label>
            <input
              type="text"
              name="slug"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. nextjs-seo-guide"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Publish Date
          </label>
          <input
            type="date"
            name="date"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Short Summary
          </label>
          <textarea
            name="summary"
            required
            rows="2"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="A brief description for the homepage cards..."
          ></textarea>
        </div>

        {/* --- SEO SETTINGS SECTION --- */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
            SEO Settings (Optional)
          </h3>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Meta Title (Overrides default title)
            </label>
            <input
              type="text"
              name="metaTitle"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="e.g. 10 Best CRM Tools in 2026"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              name="metaDescription"
              rows="2"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Write a compelling snippet for Google search results..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target Keywords (Comma separated)
            </label>
            <input
              type="text"
              name="metaKeywords"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="saas, crm, developer tools, nextjs"
            />
          </div>
        </div>
        {/* ----------------------------- */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Markdown Content
          </label>
          <textarea
            name="content"
            required
            rows="12"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
            placeholder="## Your heading here&#10;Write your markdown content..."
          ></textarea>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="trending"
            id="trending"
            className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label
            htmlFor="trending"
            className="ml-3 text-sm font-medium text-gray-700"
          >
            Pin to "Trending" on Homepage
          </label>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Publish Blog to Database
          </button>
        </div>
      </form>
    </main>
  );
}
