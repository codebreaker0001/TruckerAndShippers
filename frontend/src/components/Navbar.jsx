import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white font-bold text-xl">Load Posting System</h1>
        <ul className="flex space-x-4">
          {getToken() ? (
            <>
              <li>
                <Link to="/loads" className="text-white hover:text-gray-200">Loads</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="text-white hover:text-gray-200">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
