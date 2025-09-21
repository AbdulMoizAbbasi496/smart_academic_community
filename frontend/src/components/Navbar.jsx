import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle mobile menu
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-10 sm:w-12 md:w-14 rounded-full" />
          <span className="text-base sm:text-lg font-bold">Smart Academic Community</span>
        </Link>

        {/* Hamburger Menu Button (visible on mobile) */}
        <button
          className="md:hidden text-gray-900 dark:text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            isMenuOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row md:items-center md:space-x-4 absolute md:static top-16 left-0 w-full md:w-auto bg-white dark:bg-gray-800 md:bg-transparent dark:md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 transition-all duration-300 ease-in-out z-10`}
        >
          {user ? (
            <>
              <Link
                to="/events"
                className="text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 py-2 md:py-0"
                onClick={() => setIsMenuOpen(false)} // Close menu on click (mobile)
              >
                Events
              </Link>
              <Link
                to="/announcements"
                className="text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 py-2 md:py-0"
                onClick={() => setIsMenuOpen(false)}
              >
                Announcements
              </Link>
              <Link
                to="/profile"
                className="text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 py-2 md:py-0"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              {user.role === 'admin' && (
                <>
                  <Link
                    to="/admin/events"
                    className="text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 py-2 md:py-0"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Manage Events
                  </Link>
                  <Link
                    to="/admin/announcements"
                    className="text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 py-2 md:py-0"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Manage Announcements
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400 py-2 md:py-0 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 py-2 md:py-0"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
          <button
            onClick={() => {
              toggleTheme();
              setIsMenuOpen(false);
            }}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white mt-2 md:mt-0"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;