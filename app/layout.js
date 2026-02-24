// app/layout.js
import './globals.css';
import Navbar from '@/components/Navbar'; // Import the new client component

export const metadata = {
  title: {
    template: '%s | TechReview', // This automatically appends "| TechReview" to all child pages
    default: 'TechReview | Find the perfect software for your dev team.',
  },
  description: 'We analyze, test, and compare the best B2B SaaS tools, APIs, and cloud infrastructure so you can build faster and scale smarter.',
  keywords: ['B2B SaaS', 'Developer Tools', 'Software Reviews', 'API Comparisons'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gray-50 text-gray-900 font-sans antialiased">
        
        {/* We moved all the navigation logic into this component */}
        <Navbar />

        {/* Main Page Content */}
        <div className="min-h-screen">
          {children}
        </div>

        {/* Global Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12 text-center text-sm mt-20">
          <p>© {new Date().getFullYear()} TechReview.io. Built for high-performance B2B SEO.</p>
        </footer>
      </body>
    </html>
  );
}