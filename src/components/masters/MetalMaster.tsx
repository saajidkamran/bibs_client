import React, { useState } from "react";
import MasterDataScreen from "./MasterDataScreen";
import MetalForm from "../forms/MetalForm";
import Button from "../common/Button";
import { generateId } from "../../data/utils";
import { initialDataStore } from "../../data/mockData";
import { Pencil, Trash2 } from "lucide-react";

const MetalMaster: React.FC = () => {
  const [metals, setMetals] = useState(initialDataStore.metals);
  const [selectedMetal, setSelectedMetal] = useState<any | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);

  const handleAdd = () => {
    setSelectedMetal(null);
    setFormOpen(true);
  };

  const handleEdit = (metal: any) => {
    setSelectedMetal(metal);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this metal?")) {
      setMetals((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleSave = (formData: any) => {
    if (selectedMetal) {
      // Update existing
      setMetals((prev) => prev.map((m) => (m.id === selectedMetal.id ? { ...m, ...formData } : m)));
    } else {
      // Add new
      setMetals((prev) => [...prev, { id: generateId(), createdAt: new Date(), ...formData }]);
    }
    setFormOpen(false);
  };

  return (
    <MasterDataScreen title="Metal Master" onAdd={handleAdd} totalCount={metals.length}>
      {/* Metal List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Metal Name</th>
              <th className="px-3 py-2 text-left">Processes</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {metals.map((metal) => (
              <tr key={metal.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm">{metal.name}</td>
                <td className="px-3 py-2 text-sm">
                  {(metal.metalProcessIds || [])
                    .map((pid: string) => {
                      const proc = initialDataStore.metal_processes.find((p) => p.id === pid);
                      return proc ? proc.name : "";
                    })
                    .filter(Boolean)
                    .join(", ")}
                </td>
                <td className="px-3 py-2 text-sm">
                  {metal.isActive ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-gray-400">Inactive</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right space-x-2">
                  <Button variant="icon" icon={Pencil} onClick={() => handleEdit(metal)} />
                  <Button variant="icon" icon={Trash2} onClick={() => handleDelete(metal.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
            <h3 className="text-lg font-semibold mb-4">
              {selectedMetal ? "Edit Metal" : "Add Metal"}
            </h3>
            <MetalForm
              metalProcessData={initialDataStore.metal_processes} // ✅ correct prop name
              initialData={selectedMetal || {}} // ✅ rename from defaultValues
              onSave={handleSave}
              onCancel={() => setFormOpen(false)}
            />
          </div>
        </div>
      )}
    </MasterDataScreen>
  );
};

export default MetalMaster;
