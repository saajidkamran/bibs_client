import React, { useState } from 'react';
import { Plus, Eye, Pencil } from 'lucide-react';
import type { VatRecord } from '../types/vatTypes';
import { initialVatData } from '../../data/vatData';
import StatusBadge from './StatusBadge';
import VatFormModal from './VatFormModal';

const VatManager: React.FC = () => {
  const [data, setData] = useState<VatRecord[]>(initialVatData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVat, setEditingVat] = useState<VatRecord | null>(null);

  const handleAdd = () => {
    setEditingVat(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vat: VatRecord) => {
    if (vat.status === 'Active') {
      setEditingVat(vat);
      setIsModalOpen(true);
    }
  };

  const handleSave = (formData: Omit<VatRecord, 'id'>, id?: number) => {
    setData((prev:any) => {
      const newId = Math.max(...prev.map((c:any) => c.id), 0) + 1;
      const updated = [...prev];
      if (id) {
        const original = prev.find((v:any) => v.id === id);
        if (!original) return prev;
        const archived = { ...original, status: 'Inactive' };
        const newRecord = { ...formData, id: newId } as VatRecord;
        return prev.map((v:any) => (v.id === id ? archived : v.status === 'Active' ? { ...v, status: 'Inactive' } : v)).concat(newRecord);
      } else {
        const newVat = { ...formData, id: newId } as VatRecord;
        return newVat.status === 'Active'
          ? prev.map((v:any) => ({ ...v, status: 'Inactive' })).concat(newVat)
          : [...prev, newVat];
      }
    });
  };

  const sortedData = [...data].sort((a, b) => {
    const statusDiff = (b.status === 'Active' ? 1 : 0) - (a.status === 'Active' ? 1 : 0);
    return statusDiff || new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime();
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">VAT Percentage</h1>
        <button onClick={handleAdd} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded">
          <Plus className="mr-2 w-5 h-5" /> Update VAT
        </button>
      </div>

      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">VAT Value (%)</th>
              <th className="text-left p-3">Effective Date</th>
              <th className="text-left p-3">Added By</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map(v => (
              <tr key={v.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{v.vatValue.toFixed(2)}%</td>
                <td className="p-3">{v.effectiveDate}</td>
                <td className="p-3">{v.addedBy}</td>
                <td className="p-3">
                  <StatusBadge status={v.status} />
                </td>
                <td className="p-3 flex gap-2">
                  <button className="p-2 bg-blue-100 text-blue-600 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                  {v.status === 'Active' && (
                    <button onClick={() => handleEdit(v)} className="p-2 bg-yellow-100 text-yellow-600 rounded">
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <VatFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingVat}
        onSave={handleSave}
      />
    </div>
  );
};

export default VatManager;
