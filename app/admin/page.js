// app/admin/page.js
import Link from 'next/link';
import { 
  getAdminBlogs, deleteBlog, 
  getAdminReviews, deleteReview, 
  getAdminComparisons, deleteComparison 
} from '@/actions/admin';
import { logoutAdmin } from '@/actions/auth';

export default async function AdminDashboard() {
  const blogs = await getAdminBlogs();
  const reviews = await getAdminReviews();
  const comparisons = await getAdminComparisons();

  // A reusable table component to keep the code clean
  const AdminTable = ({ title, items, createLink, editPath, deleteAction }) => (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Link href={createLink} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          + Create New
        </Link>
      </div>
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title/Slug</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {item.title || `${item.tool1} vs ${item.tool2}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-4">
                  <Link href={`${editPath}/${item._id}`} className="text-blue-600 hover:text-blue-900">Edit</Link>
                  <form action={deleteAction.bind(null, item._id)}>
                    <button type="submit" className="text-red-600 hover:text-red-800">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">No entries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
<div className="flex justify-between items-end mb-10 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your database content.</p>
        </div>
        
        {/* We wrap the button in a form so it can trigger the Server Action securely */}
        <form action={logoutAdmin}>
          <button 
            type="submit" 
            className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors shadow-sm"
          >
            Logout
          </button>
        </form>
      </div>

      <AdminTable title="Blogs" items={blogs} createLink="/admin/create" editPath="/admin/edit" deleteAction={deleteBlog} />
      <AdminTable title="Reviews" items={reviews} createLink="/admin/reviews/create" editPath="/admin/reviews/edit" deleteAction={deleteReview} />
      <AdminTable title="Comparisons" items={comparisons} createLink="/admin/comparisons/create" editPath="/admin/comparisons/edit" deleteAction={deleteComparison} />
    </main>
  );
}