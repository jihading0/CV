import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, loginWithGoogle, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold tracking-tight text-gray-900">سيرتي</span>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 sm:flex">
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
                  alt="Profile"
                  className="h-8 w-8 rounded-full border border-gray-200"
                  referrerPolicy="no-referrer"
                />
                <span className="text-sm font-medium text-gray-700">{user.displayName}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">تسجيل خروج</span>
              </button>
              <Link
                to="/dashboard"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                لوحة التحكم
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={loginWithGoogle}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                تسجيل الدخول
              </button>
              <button
                onClick={loginWithGoogle}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                ابدأ مجاناً
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
