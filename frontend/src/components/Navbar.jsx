import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="shadow-md bg-[#093b6acc] text-white">
      <div className="container mx-auto p-4 flex justify-between items-center">
        {/* <Link to="/" className="text-xl font-bold">UniClubs+</Link> */}
        <Link to="/" >
          <div className="flex gap-2">
            <img src="../../public/lg.png" alt="logo" className='w-10 rounded-4xl' />
            <span className='text-md font-bold pt-1.5'>CUI - Academic Community</span>
          </div>
        </Link>
        <div className="flex space-x-6">
          {user ? (
            <>
              <Link to="/events" className="hover:text-gray-300">Events</Link>
              <Link to="/announcements" className="hover:text-gray-300">Announcements</Link>
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/events" className="hover:text-gray-300">Manage Events</Link>
                  <Link to="/admin/announcements" className="hover:text-gray-300">Manage Announcements</Link>
                </>
              )}
              {/* <button onClick={handleLogout} className="text-red-500 hover:text-red-700 cursor-pointer">Logout</button> */}
              <button onClick={handleLogout} className="text-orange-300 hover:text-orange-700 font-bold cursor-pointer">Logout</button>
            </>
          ) : (
            <Link to="/login" className="hover:text-gray-300">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;