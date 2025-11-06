import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = React.memo(({ isOpen, title, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative animate-fadeIn">
                {/* Header */}
                {title && (
                    <div className="flex justify-between items-center mb-4 border-b pb-3">
                        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div>{children}</div>
            </div>
        </div>
    );
});

export default Modal;