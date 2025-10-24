import React, { useState } from "react";
import MasterDataScreen from "./MasterDataScreen";
import SimpleMasterForm from "../forms/SimpleMasterForm";
import Button from "../common/Button";
import { generateId } from "../../data/utils";
import { initialDataStore } from "../../data/mockData";
import { Pencil, Trash2 } from "lucide-react";

const MetalProcessMaster: React.FC = () => {
  const [metalProcesses, setMetalProcesses] = useState(initialDataStore.metal_processes);
  const [selectedProcess, setSelectedProcess] = useState<any | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);

  const handleAdd = () => {
    setSelectedProcess(null);
    setFormOpen(true);
  };

  const handleEdit = (process: any) => {
    setSelectedProcess(process);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this metal process?")) {
      setMetalProcesses((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSave = (formData: any) => {
    if (selectedProcess) {
      setMetalProcesses((prev) =>
        prev.map((p) => (p.id === selectedProcess.id ? { ...p, ...formData } : p)),
      );
    } else {
      setMetalProcesses((prev) => [
        ...prev,
        { id: generateId(), createdAt: new Date(), ...formData },
      ]);
    }
    setFormOpen(false);
  };

  return (
    <MasterDataScreen
      title="Metal Process Master"
      onAdd={handleAdd}
      totalCount={metalProcesses.length}
    >
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Metal Process</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {metalProcesses.map((proc) => (
              <tr key={proc.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm">{proc.name}</td>
                <td className="px-3 py-2 text-sm">
                  {proc.isActive ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-gray-400">Inactive</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right space-x-2">
                  <Button variant="icon" icon={Pencil} onClick={() => handleEdit(proc)} />
                  <Button variant="icon" icon={Trash2} onClick={() => handleDelete(proc.id)} />
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
              {selectedProcess ? "Edit Metal Process" : "Add Metal Process"}
            </h3>
            <SimpleMasterForm
              initialData={selectedProcess || {}}
              onSave={handleSave}
              onCancel={() => setFormOpen(false)}
              typeLabel="Process Type"
            />
          </div>
        </div>
      )}
    </MasterDataScreen>
  );
};

export default MetalProcessMaster;
