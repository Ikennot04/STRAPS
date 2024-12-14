import { useState } from 'react';
import NotificationModal from '../components/NotificationModal';

interface Book {
  id: number;
  documentId: string;
  title: string;
  description: string;
  owner: string;
  image: {
    id: number;
    url: string;
    name: string;
  } | null;
}

interface UpdateBookProps {
  selectedBook: Book | null;
  isUpdating: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function UpdateBook({ selectedBook, isUpdating, onClose, onUpdate }: UpdateBookProps) {
  const [title, setTitle] = useState(selectedBook?.title || '');
  const [description, setDescription] = useState(selectedBook?.description || '');
  const [owner, setOwner] = useState(selectedBook?.owner || '');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedBook) {
      try {
        const updatedBook = {
          title,
          description,
          owner,
          ...(selectedBook.image?.id ? { image: selectedBook.image.id } : {})
        };

        const response = await fetch(`http://localhost:1337/api/books/${selectedBook.documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: updatedBook }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to update the book: ${errorData.error?.message || 'Unknown error'}`);
        }

        await response.json();
        setNotification({ show: true, message: 'Book updated successfully!', type: 'success' });
        setTimeout(() => {
          onUpdate();
          onClose();
        }, 2000);
      } catch (err: any) {
        setNotification({ show: true, message: err.message || 'Failed to update book', type: 'error' });
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Edit Book</h2>
          <form onSubmit={handleUpdateSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Owner</label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      <NotificationModal
        isOpen={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </>
  );
} 