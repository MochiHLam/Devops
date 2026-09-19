import { Link } from "react-router-dom";

/**
 * AuthLayout — centered card layout for Login / Register pages
 */
export default function AuthLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-red-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="block text-center mb-6">
          <span className="text-3xl font-black text-white drop-shadow-lg">🛒 ShopVN</span>
        </Link>
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {title && (
            <div className="px-8 pt-8 pb-2">
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
