'use client';

interface NotificationModalProps {
  isOpen: boolean;
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export default function NotificationModal({ isOpen, message, type = 'success', onClose }: NotificationModalProps) {
  if (!isOpen) return null;

  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md ${bgColor} ${textColor}`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 hover:opacity-70">×</button>
      </div>
    </div>
  );
} 