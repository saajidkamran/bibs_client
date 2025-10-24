import React, { useState } from "react";
import Input from "../common/Input";
import MultiSelect from "../common/MultiSelect";
import Button from "../common/Button";

interface ProcessType {
  id: string;
  name: string;
  isActive: boolean;
}

interface ProcessFormProps {
  initialData?: { name: string; processTypeIds: string[] };
  onSave: (payload: { name: string; processTypeIds: string[] }) => void;
  processTypeData: ProcessType[];
  onCancel: () => void; // ✅ add this line
}

const ProcessForm: React.FC<ProcessFormProps> = ({
  initialData,
  onSave,
  processTypeData,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [selectedTypes, setSelectedTypes] = useState(initialData?.processTypeIds || []);

  const handleToggleType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || selectedTypes.length === 0) {
      alert("Please fill in process name and select at least one process type.");
      return;
    }
    onSave({ name, processTypeIds: selectedTypes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Process Name (e.g., Casting, Setting, Polishing)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <MultiSelect
        label="Select Associated Process Types"
        options={processTypeData.filter((t) => t.isActive).map((t) => ({ id: t.id, name: t.name }))}
        selectedIds={selectedTypes}
        onToggle={handleToggleType}
        required
      />
      <Button type="submit" variant="primary" className="w-full mt-6">
        {initialData ? "Update Process" : "Add New Process"}
      </Button>
      <Button type="button" variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
};

export default ProcessForm;
