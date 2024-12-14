'use client';

import { useState, useEffect } from 'react';

interface Book {
  id: number;
  documentId: string;
  title: string;
  description: string;
  owner: string;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  image: {
    id: number;
    name: string;
    url: string;
    formats: {
      thumbnail: {
        url: string;
      };
      small: {
        url: string;
      };
      medium: {
        url: string;
      };
      large: {
        url: string;
      };
    };
  } | null;
}

export default function Getbook() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/books?populate=*');
        if (!response.ok) {
          throw new Error('Error fetching books');
        }
        const result = await response.json();
        
        setBooks(result.data);
        setLoading(false);
      } catch (error: any) {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">All Books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300"
          >
            {/* Image Container */}
            <div className="w-full h-48 relative">
              {book?.image?.url ? (
                <img
                  src={`http://localhost:1337${book.image.url}`}
                  alt={book.title || 'Book cover'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Content Container */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {book.title || 'Untitled'}
                </h3>
                <p className="text-sm text-gray-500">
                  {book.createdAt 
                    ? new Date(book.createdAt).toLocaleDateString() 
                    : 'Date not available'}
                </p>
              </div>
              <p className="text-gray-700 mb-4">
                {book.description || 'No description available.'}
              </p>
              <p className="text-gray-500 mb-2">
                <span className="font-bold">Owner:</span> {book.owner || 'Unknown'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
