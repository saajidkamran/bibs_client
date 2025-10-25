import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type{ CompanyRecord } from '../../data/companyTypes';
import { useCompanyManager } from '../hooks/useCompanyManager';
import CompanyTable from '../../components/company/CompanyTable';
import CompanyFormModal from '../../components/company/CompanyFormModal';

const CompanyInfoPage: React.FC = () => {
  const { data, handleSave } = useCompanyManager();
  const [editing, setEditing] = useState<CompanyRecord | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Company Information</h1>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Company
        </button>
      </header>

      <CompanyTable
        data={data}
        onView={(id) => console.log('View', id)}
        onEdit={(c) => {
          setEditing(c);
          setOpen(true);
        }}
      />

      <CompanyFormModal
        isOpen={open}
        onClose={() => setOpen(false)}
        initialData={editing}
        onSave={handleSave}
      />
    </div>
  );
};

export default CompanyInfoPage;
