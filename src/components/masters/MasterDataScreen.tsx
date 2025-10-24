import React from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { Search } from 'lucide-react';

interface MasterDataScreenProps {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const MasterDataScreen: React.FC<MasterDataScreenProps> = ({
  title,
  onAdd,
  children,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder={`Search ${title}...`}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={Search}
          className="md:w-1/3 w-full"
        />
        <Button variant="primary" onClick={onAdd}>
          + Add
        </Button>
      </div>

      <div className="border-t pt-4">{children}</div>
    </div>
  );
};

export default MasterDataScreen;
