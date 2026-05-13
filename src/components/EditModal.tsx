import { type ReactNode } from 'react';
import { X } from 'lucide-react';

interface EditModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function EditModal({ open, title, onClose, children }: EditModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl w-full max-w-sm p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-[#345348] font-semibold text-xl">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-[#E3E8E5] active:bg-gray-300">
            <X size={20} className="text-[#345348]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
