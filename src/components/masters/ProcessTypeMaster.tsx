import React, { useState } from 'react';
import MasterDataScreen from './MasterDataScreen';
import SimpleMasterForm from '../forms/SimpleMasterForm';
import Button from '../common/Button';
import { generateId } from '../../data/utils';
import { initialDataStore } from '../../data/mockData';
import { Pencil, Trash2 } from 'lucide-react';

const ProcessTypeMaster: React.FC = () => {
  const [processTypes, setProcessTypes] = useState(initialDataStore.process_types);
  const [selectedType, setSelectedType] = useState<any | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);

  const handleAdd = () => {
    setSelectedType(null);
    setFormOpen(true);
  };

  const handleEdit = (type: any) => {
    setSelectedType(type);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this process type?')) {
      setProcessTypes((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleSave = (formData: any) => {
    if (selectedType) {
      setProcessTypes((prev) =>
        prev.map((t) => (t.id === selectedType.id ? { ...t, ...formData } : t))
      );
    } else {
      setProcessTypes((prev) => [
        ...prev,
        { id: generateId(), createdAt: new Date(), ...formData },
      ]);
    }
    setFormOpen(false);
  };

  return (
    <MasterDataScreen
      title="Process Type Master"
      onAdd={handleAdd}
      totalCount={processTypes.length}
    >
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Process Type</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {processTypes.map((type) => (
              <tr key={type.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm">{type.name}</td>
                <td className="px-3 py-2 text-sm">
                  {type.isActive ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-gray-400">Inactive</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right space-x-2">
                  <Button
                    variant="icon"
                    icon={Pencil}
                    onClick={() => handleEdit(type)}
                  />
                  <Button
                    variant="icon"
                    icon={Trash2}
                    onClick={() => handleDelete(type.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[350px]">
            <h3 className="text-lg font-semibold mb-4">
              {selectedType ? 'Edit Process Type' : 'Add Process Type'}
            </h3>
            <SimpleMasterForm
              initialData={selectedType || {}}
              onSave={handleSave}
              onCancel={() => setFormOpen(false)}
              typeLabel=''
            />
          </div>
        </div>
      )}
    </MasterDataScreen>
  );
};

export default ProcessTypeMaster;
