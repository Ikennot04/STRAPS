'use client';

import { useState } from 'react';
import Getbook from './(Modal)/getbook/page';
import Sidebar from './components/Sidebar/page'; // Import the Sidebar component


export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Library Management System</h1>
          <p className="text-gray-600 mt-2">Manage and explore books in the library</p>
        </header>

        {/* Book List */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Library Books</h2>
          <Getbook />
        </div>
      </div>
    </div>
  );
}
