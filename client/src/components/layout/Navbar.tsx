import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, Trophy, LayoutDashboard, Users, Menu, X } from 'lucide-react';
import { useState } from 'react';
import BrandMark from '@/components/branding/BrandMark';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/groups', label: 'Groups', icon: Users },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800"
    >
      <div className="page-shell px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? '/dashboard' : '/'} className="flex min-w-0 items-center gap-2 group">
            <BrandMark className="h-8 w-8" compact />
            <span className="truncate text-lg font-bold text-white tracking-tight">CodeArena</span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-1 px-2">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive(to)
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900">
                  <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-24 truncate text-sm text-zinc-300">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-700"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary py-1.5 px-4 text-sm rounded-md">
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary py-1.5 px-4 text-sm rounded-md">
                  Sign up
                </Link>
              </div>
            )}

            {user && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-zinc-400"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-zinc-800 px-4 pb-4 bg-zinc-950"
        >
          <div className="page-shell space-y-2 px-0 pt-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 mb-4">
              <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="truncate text-sm text-zinc-300">{user.name}</span>
            </div>
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium ${
                  isActive(to) ? 'bg-zinc-800 text-white' : 'text-zinc-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
