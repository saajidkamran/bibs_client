// src/components/customers/CustomerFormModal.tsx
import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import type { CustomerRecord } from './types';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: CustomerRecord | null;
  onSave: (data: Omit<CustomerRecord, 'id'>, id?: number) => void;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}) => {
  const isEditing = initialData !== null;
  const title = isEditing ? 'Edit Customer' : 'Add New Customer';

  const emptyState: Omit<CustomerRecord, 'id'> = {
    customerName: '',
    companyName: '',
    address: '',
    webAddress: '',
    email: '',
    phone1: '',
    phone2: '',
    whatsappNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    isActive: true,
    isVatCustomer: false,
    vatId: '',
    sendInvoiceByEmail: true,
  };

  const [formState, setFormState] = useState<Omit<CustomerRecord, 'id'>>(emptyState);

  useEffect(() => {
    if (initialData) setFormState({ ...initialData });
    else setFormState(emptyState);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.isVatCustomer && !formState.vatId.trim()) {
      alert('VAT ID is required for VAT Customers.');
      return;
    }
    onSave(formState, initialData?.id);
    onClose();
    if (!isEditing) setFormState(emptyState);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Info */}
            {[
              ['customerName', 'Customer Name *', 'text'],
              ['companyName', 'Company Name *', 'text'],
              ['address', 'Address', 'text'],
              ['webAddress', 'Web Address', 'url'],
              ['email', 'Email', 'email'],
              ['phone1', 'Phone 1', 'tel'],
              ['phone2', 'Phone 2', 'tel'],
              ['whatsappNumber', 'WhatsApp Number', 'tel'],
            ].map(([id, label, type]) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  value={(formState as any)[id]}
                  onChange={handleChange}
                  required={label.includes('*')}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                />
              </div>
            ))}

            {/* Emergency Section */}
            <div className="md:col-span-2 py-2">
              <h3 className="text-md font-semibold text-red-500 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" /> Emergency Contact
              </h3>
            </div>

            {[
              ['emergencyContactName', 'Contact Name', 'text'],
              ['emergencyContactPhone', 'Contact Phone', 'tel'],
            ].map(([id, label, type]) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  value={(formState as any)[id]}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                />
              </div>
            ))}

            {/* Status Toggles */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formState.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Active Customer</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isVatCustomer"
                  checked={formState.isVatCustomer}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">VAT Customer</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="sendInvoiceByEmail"
                  checked={formState.sendInvoiceByEmail}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Send Invoice by Email</span>
              </label>
            </div>

            {/* VAT ID (conditional) */}
            {formState.isVatCustomer && (
              <div className="md:col-span-2">
                <label htmlFor="vatId" className="block text-sm font-medium text-gray-700">
                  VAT ID *
                </label>
                <input
                  id="vatId"
                  name="vatId"
                  value={formState.vatId}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {isEditing ? 'Save Changes' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
