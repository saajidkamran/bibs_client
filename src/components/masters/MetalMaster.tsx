import React, { useState } from "react";
import MasterDataScreen from "./MasterDataScreen";
import MetalForm from "../forms/MetalForm";
import Button from "../common/Button";
import { generateId } from "../../data/utils";
import { initialDataStore, type Metal } from "../../data/mockData";
import { CheckCircle, Pencil, Trash2, XCircle } from "lucide-react";

const MetalMaster: React.FC = () => {
  const [metals, setMetals] = useState(initialDataStore.metals);
  const [selectedMetal, setSelectedMetal] = useState<any | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = metals.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setMetals((prevItems) =>
      prevItems.map((i) =>
        i.id === id ? { ...i, isActive: !i.isActive } : i
      )
    );
  };

  const handleAdd = () => {
    setSelectedMetal(null);
    setFormOpen(true);
  };

  const handleEdit = (metal: Metal) => {
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
    <MasterDataScreen
      title="Metal Master"
      onAdd={handleAdd}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    >
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
            {filteredItems.map((metal) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition duration-150 ${metal.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    onClick={() => handleToggleStatus(metal.id)}
                  >
                    {metal.isActive ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {metal.isActive ? 'Active' : 'Inactive'}
                  </span>
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
