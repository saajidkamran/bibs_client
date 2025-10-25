import React, { useState } from 'react';
import MasterDataScreen from './MasterDataScreen';
import SimpleMasterForm from '../forms/SimpleMasterForm';
import Button from '../common/Button';
import { generateId } from '../../data/utils';
import { initialDataStore } from '../../data/mockData';
import { CheckCircle, Pencil, Trash2, XCircle } from 'lucide-react';
import type { ProcessType } from '../types';

const ProcessTypeMaster: React.FC = () => {
  const [processTypes, setProcessTypes] = useState(initialDataStore.process_types);
  const [selectedType, setSelectedType] = useState<any | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = processTypes.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setProcessTypes((prevItems) =>
      prevItems.map((i) =>
        i.id === id ? { ...i, isActive: !i.isActive } : i
      )
    );
  };

  const handleAdd = () => {
    setSelectedType(null);
    setFormOpen(true);
  };

  const handleEdit = (type: ProcessType) => {
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
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
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
            {filteredItems.map((type) => (
              <tr key={type.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm">{type.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition duration-150 ${type.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    onClick={() => handleToggleStatus(type.id)}
                  >
                    {type.isActive ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {type.isActive ? 'Active' : 'Inactive'}
                  </span>
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
