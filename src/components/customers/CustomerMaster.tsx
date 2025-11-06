import React, { useState } from "react";
import { Plus } from "lucide-react";
import type { CustomerRecord } from "./types";
import { initialCustomerData } from "./types";
import { CustomerFormModal } from "./CustomerFormModal";
import { CustomerDetailsModal } from "./CustomerDetailsModal";
import { CustomerTable } from "./CustomerTable";
import  { CustomerCardView } from "./CustomerCardView";

const CustomerMaster: React.FC = () => {
  const [data, setData] = useState<CustomerRecord[]>(initialCustomerData);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<CustomerRecord | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsFormModalOpen(true);
  };

  const handleSave = (formData: Omit<CustomerRecord, "id">, id?: number) => {
    setData((prev) => {
      if (id) return prev.map((c) => (c.id === id ? { ...formData, id } : c));
      const newId = Math.max(...prev.map((c) => c.id), 0) + 1;
      return [...prev, { ...formData, id: newId }];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Customer Master</h1>
          <button
            onClick={handleAddCustomer}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700"
          >
            <Plus className="mr-2 h-5 w-5" /> Add New Customer
          </button>
        </header>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <CustomerTable data={data} onEdit={setEditingCustomer} onView={setViewingCustomer} />
          <CustomerCardView data={data} onEdit={setEditingCustomer} onView={setViewingCustomer} />
        </div>
      </div>

      <CustomerFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={editingCustomer}
        onSave={handleSave}
      />

      <CustomerDetailsModal customer={viewingCustomer} onClose={() => setViewingCustomer(null)} />
    </div>
  );
};

export default CustomerMaster;
