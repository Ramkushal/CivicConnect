import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { Home, Upload, User, ShieldCheck, LogIn, Map, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ShieldCheck className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">CivicConnect</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/" className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Home className="h-6 w-6" />
            </Link>
            <Link to="/accountability" className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ShieldCheck className="h-6 w-6" />
            </Link>
            <Link to="/map" className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Map className="h-6 w-6" />
            </Link>
            <Link to="/upload" className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Upload className="h-6 w-6" />
            </Link>
            
            {user?.user_metadata?.role === 'officer' && (
              <Link to="/assigned-issues" className="p-2 text-gray-600 hover:text-blue-600 transition-colors" title="My Assignments">
                <ClipboardList className="h-6 w-6" />
              </Link>
            )}
            
            {user ? (
              <>
                <Link to="/profile" className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <User className="h-6 w-6" />
                </Link>
              </>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} CivicConnect. Empowering Citizens.
        </p>
      </div>
    </footer>
  );
};

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
