import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { VatRecord } from '../types/vatTypes';

interface VatFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: VatRecord | null;
  onSave: (data: Omit<VatRecord, 'id'>, id?: number) => void;
}

const VatFormModal: React.FC<VatFormModalProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const isEditing = initialData !== null;
  const title = isEditing ? 'Edit VAT Information' : 'Add New VAT Value';

  const emptyState: Omit<VatRecord, 'id'> = {
    vatValue: 0,
    effectiveDate: new Date().toISOString().split('T')[0],
    addedBy: 'Admin',
    status: 'Active',
  };

  const [formState, setFormState] = useState<Omit<VatRecord, 'id'>>(emptyState);

  useEffect(() => {
    setFormState(initialData ? { ...initialData } : emptyState);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: name === 'vatValue' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.vatValue < 0) return;
    onSave(formState, initialData?.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">VAT Value (%)</label>
            <input
              type="number"
              name="vatValue"
              value={formState.vatValue || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Effective Date</label>
            <input
              type="date"
              name="effectiveDate"
              value={formState.effectiveDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formState.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">
              {isEditing ? 'Save Changes' : 'Add VAT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VatFormModal;
