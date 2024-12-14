'use client'
import React, { useState } from 'react';
import { MdDashboard, MdLibraryBooks, MdGroups, MdSettings, MdHelpOutline } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi'; // Logout icon from Feather Icons
import Link from 'next/link';

const Sidebar = () => {
  // State to track the currently active link
  const [activeLink, setActiveLink] = useState<string>('dashboard');

  // Function to handle link click and update the active link
  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-pink-600">Library</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {/* Dashboard Link */}
        <Link
          href="/"
          className={`flex items-center p-2 rounded-md transition ${activeLink === 'dashboard' ? 'bg-pink-200 text-gray-800' : 'text-gray-600 hover:bg-pink-100'}`}
          onClick={() => handleLinkClick('dashboard')}
        >
          <MdDashboard size={24} />
          <span className="ml-3">Dashboard</span>
        </Link>

        {/* Books Link */}
        <Link
          href="/books"
          className={`flex items-center p-2 rounded-md transition ${activeLink === 'books' ? 'bg-pink-200 text-gray-800' : 'text-gray-600 hover:bg-pink-100'}`}
          onClick={() => handleLinkClick('books')}
        >
          <MdLibraryBooks size={24} />
          <span className="ml-3">Books</span>
        </Link>

        {/* Users Link */}
        <a
          href="#"
          className={`flex items-center p-2 rounded-md transition ${activeLink === 'users' ? 'bg-pink-200 text-gray-800' : 'text-gray-600 hover:bg-pink-100'}`}
          onClick={() => handleLinkClick('users')}
        >
          <MdGroups size={24} />
          <span className="ml-3">Users</span>
        </a>

        {/* Settings Link */}
        <a
          href="#"
          className={`flex items-center p-2 rounded-md transition ${activeLink === 'settings' ? 'bg-pink-200 text-gray-800' : 'text-gray-600 hover:bg-pink-100'}`}
          onClick={() => handleLinkClick('settings')}
        >
          <MdSettings size={24} />
          <span className="ml-3">Settings</span>
        </a>

        {/* Help Link */}
        <a
          href="#"
          className={`flex items-center p-2 rounded-md transition ${activeLink === 'help' ? 'bg-pink-200 text-gray-800' : 'text-gray-600 hover:bg-pink-100'}`}
          onClick={() => handleLinkClick('help')}
        >
          <MdHelpOutline size={24} />
          <span className="ml-3">Help</span>
        </a>
      </nav>

      {/* Logout Button */}
      <div className="p-4">
        <button className="w-full flex items-center justify-center py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
          <FiLogOut size={20} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
