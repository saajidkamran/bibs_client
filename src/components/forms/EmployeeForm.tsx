import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

interface EmployeeFormProps {
  initialData?: {
    name: string;
    employeeId: string;
    role: string;
  };
  onSave: (payload: { name: string; employeeId: string; role: string }) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSave }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [employeeId, setEmployeeId] = useState(initialData?.employeeId || '');
  const [role, setRole] = useState(initialData?.role || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !employeeId || !role) {
      alert('Please fill in all employee details.');
      return;
    }
    onSave({ name, employeeId, role });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Employee Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Employee ID (Used for Card Reader Login)"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        required
        disabled={!!initialData} // ID cannot be changed on edit
      />
      <Input
        label="Role/Designation"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      />
      <Button type="submit" variant="primary" className="w-full mt-6">
        {initialData ? 'Update Employee' : 'Add New Employee'}
      </Button>
    </form>
  );
};

export default EmployeeForm;
