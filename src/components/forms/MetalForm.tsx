import React, { useState } from "react";
import Input from "../common/Input";
import MultiSelect from "../common/MultiSelect";
import Button from "../common/Button";

interface MetalProcess {
  id: string;
  name: string;
  isActive: boolean;
}

interface MetalFormProps {
  initialData?: { name: string; metalProcessIds: string[] };
  onSave: (payload: { name: string; metalProcessIds: string[] }) => void;
  metalProcessData: MetalProcess[];
  onCancel: () => void; // ✅ add this line
}

const MetalForm: React.FC<MetalFormProps> = ({
  initialData,
  onSave,
  metalProcessData,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [selectedProcesses, setSelectedProcesses] = useState(initialData?.metalProcessIds || []);

  const handleToggleProcess = (processId: string) => {
    setSelectedProcesses((prev) =>
      prev.includes(processId) ? prev.filter((id) => id !== processId) : [...prev, processId],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || selectedProcesses.length === 0) {
      alert("Please fill in metal name and select at least one metal process.");
      return;
    }
    onSave({ name, metalProcessIds: selectedProcesses });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Metal Name (e.g., Gold 18k, Silver, Platinum)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <MultiSelect
        label="Select Associated Metal Processes"
        options={metalProcessData
          .filter((p) => p.isActive)
          .map((p) => ({ id: p.id, name: p.name }))}
        selectedIds={selectedProcesses}
        onToggle={handleToggleProcess}
        required
      />
      <Button type="submit" variant="primary" className="w-full mt-6">
        {initialData ? "Update Metal" : "Add New Metal"}
      </Button>
      <Button type="button" variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
};

export default MetalForm;
