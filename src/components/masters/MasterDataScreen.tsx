import React from 'react';
import Button from '../common/Button';

interface MasterDataScreenProps {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
  totalCount?: number;
}

const MasterDataScreen: React.FC<MasterDataScreenProps> = ({
  title,
  onAdd,
  children,
  totalCount,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {title} {totalCount !== undefined && (
            <span className="text-gray-500 text-sm font-normal ml-1">
              ({totalCount})
            </span>
          )}
        </h2>
        <Button variant="primary" onClick={onAdd}>
          + Add
        </Button>
      </div>

      <div className="border-t pt-4">{children}</div>
    </div>
  );
};

export default MasterDataScreen;
