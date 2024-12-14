interface Book {
  id: number;
  documentId: string;
}

interface DeleteBookOptions {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export async function deleteBook(book: Book, options: DeleteBookOptions) {
  try {
    const response = await fetch(`http://localhost:1337/api/books/${book.documentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to delete the book: ${errorData.error?.message || 'Unknown error'}`);
    }

    options.onSuccess('Book deleted successfully!');
    return true;
  } catch (err: any) {
    options.onError(err.message || 'Failed to delete book');
    throw err;
  }
} 