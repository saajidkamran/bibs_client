import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { CompanyRecord } from '../../data/companyTypes';

interface CompanyFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: CompanyRecord | null;
    onSave: (data: Omit<CompanyRecord, 'id'>, id?: number) => void;
}

const emptyState: Omit<CompanyRecord, 'id'> = {
    companyName: '',
    address: '',
    vatId: '',
    taxId: '',
    website: '',
    email: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    addedBy: 'Admin',
    status: 'Active',
};

const CompanyFormModal: React.FC<CompanyFormModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave,
}) => {
    const isEditing = !!initialData;
    const [formState, setFormState] = useState<Omit<CompanyRecord, 'id'>>(emptyState);

    useEffect(() => {
        setFormState(initialData ?? emptyState);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formState, initialData?.id);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {isEditing ? 'Edit Company' : 'Add New Company'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(formState).map(([key, value]) =>
                            key === 'status' || key === 'addedBy' ? null : (
                                <div key={key}>
                                    <label className="block text-sm font-medium capitalize">{key}</label>
                                    <input
                                        name={key}
                                        value={value}
                                        onChange={handleChange}
                                        className="mt-1 w-full border rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required={['companyName', 'address', 'email'].includes(key)}
                                    />
                                </div>
                            )
                        )}
                        <div>
                            <label className="block text-sm font-medium">Status</label>
                            <select
                                name="status"
                                value={formState.status}
                                onChange={handleChange}
                                className="mt-1 w-full border rounded-lg p-2"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={onClose} className="mr-2 px-4 py-2 border rounded-lg">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            {isEditing ? 'Save Changes' : 'Add Company'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanyFormModal;