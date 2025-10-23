import React, { useState } from 'react';
import MasterDataScreen from './MasterDataScreen';
import EmployeeForm from '../forms/EmployeeForm';
import Button from '../common/Button';
import { generateId } from '../../data/utils';
import { initialDataStore } from '../../data/mockData';
import { Pencil, Trash2 } from 'lucide-react';

const EmployeeMaster: React.FC = () => {
  const [employees, setEmployees] = useState(initialDataStore.employees);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);

  const handleAdd = () => {
    setSelectedEmployee(null);
    setFormOpen(true);
  };

  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const handleSave = (formData: any) => {
    if (selectedEmployee) {
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === selectedEmployee.id ? { ...e, ...formData } : e
        )
      );
    } else {
      setEmployees((prev) => [
        ...prev,
        { id: generateId(), createdAt: new Date(), ...formData },
      ]);
    }
    setFormOpen(false);
  };

  return (
    <MasterDataScreen
      title="Employee Master"
      onAdd={handleAdd}
      totalCount={employees.length}
    >
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Employee Name</th>
              <th className="px-3 py-2 text-left">Employee ID</th>
              <th className="px-3 py-2 text-left">Role</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm">{emp.name}</td>
                <td className="px-3 py-2 text-sm">{emp.employeeId}</td>
                <td className="px-3 py-2 text-sm">{emp.role}</td>
                <td className="px-3 py-2 text-sm">
                  {emp.isActive ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-gray-400">Inactive</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right space-x-2">
                  <Button
                    variant="icon"
                    icon={Pencil}
                    onClick={() => handleEdit(emp)}
                  />
                  <Button
                    variant="icon"
                    icon={Trash2}
                    onClick={() => handleDelete(emp.id)}
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
            <h3 className="text-lg font-semibold mb-4">
              {selectedEmployee ? 'Edit Employee' : 'Add Employee'}
            </h3>
            <EmployeeForm
              initialData={selectedEmployee || {}}
              onSave={handleSave}
              // onCancel={() => setFormOpen(false)}
            />
          </div>
        </div>
      )}
    </MasterDataScreen>
  );
};

export default EmployeeMaster;
