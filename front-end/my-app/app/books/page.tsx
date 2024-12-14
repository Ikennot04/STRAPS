'use client';

import { useState, useEffect } from 'react';
import UpdateBook from './updateBook';
import { deleteBook } from './deleteBook';
import NotificationModal from '../components/NotificationModal';
import ConfirmationModal from '../components/ConfirmationModal';

interface Book {
  id: number;
  documentId: string;
  title: string;
  description: string;
  owner: string;
  createdAt: string;
  image: {
    id: number;
    url: string;
    name: string;
  } | null;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [notification, setNotification] = useState({ 
    show: false, 
    message: '', 
    type: 'success' as 'success' | 'error' 
  });
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; bookId: number | null }>({
    show: false,
    bookId: null
  });

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch('http://localhost:1337/api/books?populate=*');
      const data = await response.json();
      
      setBooks(data.data || []);
    };
    fetchBooks();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const bookToDelete = books.find(book => book.id === id);
      if (!bookToDelete) return;

      const response = await fetch(`http://localhost:1337/api/books/${bookToDelete.documentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete the book: ${errorData.error?.message || 'Unknown error'}`);
      }

      const refreshResponse = await fetch('http://localhost:1337/api/books?populate=*');
      const refreshData = await refreshResponse.json();
      setBooks(refreshData.data);
      
      setNotification({
        show: true,
        message: 'Book deleted successfully!',
        type: 'success'
      });

      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    } catch (err: any) {
      console.error('Error deleting book:', err);
      setNotification({
        show: true,
        message: err.message || 'Failed to delete book. Please try again.',
        type: 'error'
      });

      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  const handleUpdateSuccess = async () => {
    const refreshResponse = await fetch('http://localhost:1337/api/books?populate=*');
    const refreshData = await refreshResponse.json();
    setBooks(refreshData.data);
    setIsUpdating(false);
    setSelectedBook(null);
  };

  const getImageUrl = (book: Book) => {
    return book?.image?.url || null;
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageId = null;
      
      // First, upload the image if one is provided
      if (newImage) {
        const formData = new FormData();
        formData.append('files', newImage);
        
        const uploadResponse = await fetch('http://localhost:1337/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadResult = await uploadResponse.json();
        imageId = uploadResult[0].id;
      }

      // Then create the book with the image reference
      const bookData = {
        data: {
          title: newTitle,
          description: newDescription,
          owner: newOwner,
          ...(imageId ? { image: imageId } : {})
        }
      };

      const response = await fetch('http://localhost:1337/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add book: ${errorData.error?.message || 'Unknown error'}`);
      }

      // Refresh the books list
      const refreshResponse = await fetch('http://localhost:1337/api/books?populate=*');
      const refreshData = await refreshResponse.json();
      setBooks(refreshData.data);

      // Reset form and close modal
      setNewTitle('');
      setNewDescription('');
      setNewOwner('');
      setNewImage(null);
      setIsAddModalOpen(false);
      setNotification({
        show: true,
        message: 'Book added successfully!',
        type: 'success'
      });

      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    } catch (error) {
      console.error('Error adding book:', error);
      setNotification({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to add book. Please try again.',
        type: 'error'
      });

      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  const refreshBooks = async () => {
    const response = await fetch('http://localhost:1337/api/books?populate=*');
    const data = await response.json();
    setBooks(data.data || []);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Books Administration</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Book
        </button>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Book</h2>
            <form onSubmit={handleAddBook}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Owner</label>
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left">ID</th>
              <th className="px-6 py-3 border-b text-left">Image</th>
              <th className="px-6 py-3 border-b text-left">Title</th>
              <th className="px-6 py-3 border-b text-left">Description</th>
              <th className="px-6 py-3 border-b text-left">Owner</th>
              <th className="px-6 py-3 border-b text-left">Created At</th>
              <th className="px-6 py-3 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">{book.id}</td>
                <td className="px-6 py-4 border-b">
                  <div className="w-20 h-20 relative">
                    {getImageUrl(book) ? (
                      <img
                        src={`http://localhost:1337${getImageUrl(book)}`}
                        alt={book.title || ''}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 border-b">{book.title}</td>
                <td className="px-6 py-4 border-b">
                  {book.description?.length > 50 
                    ? `${book.description.substring(0, 50)}...` 
                    : book.description}
                </td>
                <td className="px-6 py-4 border-b">{book.owner}</td>
                <td className="px-6 py-4 border-b">
                  {new Date(book.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 border-b">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedBook(book);
                        setTitle(book.title);
                        setDescription(book.description);
                        setOwner(book.owner);
                        setIsUpdating(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteModal({ show: true, bookId: book.id })}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Replace the update modal section with this */}
      {isUpdating && selectedBook && (
        <UpdateBook
          selectedBook={selectedBook}
          isUpdating={isUpdating}
          onClose={() => {
            setIsUpdating(false);
            setSelectedBook(null);
          }}
          onUpdate={handleUpdateSuccess}
        />
      )}

      <NotificationModal
        isOpen={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />

      <ConfirmationModal
        isOpen={deleteModal.show}
        message="Are you sure you want to delete this book?"
        onConfirm={() => {
          if (deleteModal.bookId) {
            handleDelete(deleteModal.bookId);
          }
          setDeleteModal({ show: false, bookId: null });
        }}
        onCancel={() => setDeleteModal({ show: false, bookId: null })}
      />
    </div>
  );
}
