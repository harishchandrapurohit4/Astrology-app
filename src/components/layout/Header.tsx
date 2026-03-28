import { Link, useNavigate } from 'react-router-dom';
import { Star, Menu, X, Wallet, User, LogOut, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, wallet, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              AstroConnect
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/astrologers" className="hover:text-amber-300 transition-colors">
              Astrologers
            </Link>
            <Link to="/horoscope" className="hover:text-amber-300 transition-colors">
              Daily Horoscope
            </Link>
            <Link to="/kundli" className="hover:text-amber-300 transition-colors">
              Free Kundli
            </Link>
            <Link
              to="/astro-trading"
              className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1.5 rounded-full transition-colors text-sm font-medium"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Astro-Trading
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/wallet"
                  className="flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full hover:bg-amber-500/30 transition-colors"
                >
                  <Wallet className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-300 font-semibold">
                    {wallet?.currency || 'INR'} {wallet?.balance?.toFixed(2) || '0.00'}
                  </span>
                </Link>
                <Link
                  to={profile?.role === 'astrologer' ? '/astrologer/dashboard' : '/dashboard'}
                  className="flex items-center gap-2 hover:text-amber-300 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{profile?.full_name || 'Dashboard'}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-amber-300 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2 rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-purple-700 pt-4">
            <div className="flex flex-col gap-4">
              <Link to="/astrologers" className="hover:text-amber-300 transition-colors">
                Astrologers
              </Link>
              <Link to="/horoscope" className="hover:text-amber-300 transition-colors">
                Daily Horoscope
              </Link>
              <Link to="/kundli" className="hover:text-amber-300 transition-colors">
                Free Kundli
              </Link>
              <Link to="/astro-trading" className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors">
                <TrendingUp className="w-4 h-4" />
                Astro-Trading
              </Link>
              {user ? (
                <>
                  <Link
                    to="/wallet"
                    className="flex items-center gap-2"
                  >
                    <Wallet className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-300">
                      {wallet?.currency || 'INR'} {wallet?.balance?.toFixed(2) || '0.00'}
                    </span>
                  </Link>
                  <Link
                    to={profile?.role === 'astrologer' ? '/astrologer/dashboard' : '/dashboard'}
                    className="hover:text-amber-300 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-left text-gray-300 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-amber-300 transition-colors">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2 rounded-full font-semibold text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
