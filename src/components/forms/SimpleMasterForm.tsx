import React, { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

interface SimpleMasterFormProps {
  initialData?: { name: string };
  onSave: (payload: { name: string }) => void;
  typeLabel: string;
  onCancel: () => void; // ✅ add this line
}

const SimpleMasterForm: React.FC<SimpleMasterFormProps> = ({
  initialData,
  onSave,
  typeLabel,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert("Please fill in the name.");
      return;
    }
    onSave({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={`${typeLabel} Name`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Button type="submit" variant="primary" className="w-full mt-6">
        {initialData ? `Update ${typeLabel}` : `Add New ${typeLabel}`}
      </Button>
      <Button type="button" variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
};

export default SimpleMasterForm;
