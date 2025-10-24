import React, { useState } from "react";
import Input from "../common/Input";
import MultiSelect from "../common/MultiSelect";
import Button from "../common/Button";

interface Metal {
  id: string;
  name: string;
  isActive: boolean;
}

interface ItemFormProps {
  initialData?: { name: string; metalIds: string[] };
  onSave: (payload: { name: string; metalIds: string[] }) => void;
  metalData: Metal[];
  onCancel: () => void; // ✅ add this line
}

const ItemForm: React.FC<ItemFormProps> = ({ initialData, onSave, metalData, onCancel }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [selectedMetals, setSelectedMetals] = useState(initialData?.metalIds || []);

  const handleToggleMetal = (metalId: string) => {
    setSelectedMetals((prev) =>
      prev.includes(metalId) ? prev.filter((id) => id !== metalId) : [...prev, metalId],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || selectedMetals.length === 0) {
      alert("Please fill in item name and select at least one metal.");
      return;
    }
    onSave({ name, metalIds: selectedMetals });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Item Name (e.g., Ring, Bracelet)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <MultiSelect
        label="Select Associated Metals"
        options={metalData.filter((m) => m.isActive).map((m) => ({ id: m.id, name: m.name }))}
        selectedIds={selectedMetals}
        onToggle={handleToggleMetal}
        required
      />
      <Button type="submit" variant="primary" className="w-full mt-6">
        {initialData ? "Update Item" : "Add New Item"}
      </Button>
      <Button type="button" variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
};

export default ItemForm;
