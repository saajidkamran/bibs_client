import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Button from './Button';

interface Option {
  id: string;
  name: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  required?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedIds,
  onToggle,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOptions = options.filter((opt) => selectedIds.includes(opt.id));

  return (
    <div className="relative z-10 w-full">
      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div
        className="relative w-full p-2 border border-gray-300 rounded-lg cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((opt) => (
              <span
                key={opt.id}
                className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full flex items-center"
              >
                {opt.name}
              </span>
            ))
          ) : (
            <span className="text-gray-400">Select one or more...</span>
          )}
        </div>
        <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt.id}
              className="px-4 py-2 cursor-pointer hover:bg-indigo-50 flex items-center justify-between"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(opt.id);
              }}
            >
              <span>{opt.name}</span>
              <input
                type="checkbox"
                checked={selectedIds.includes(opt.id)}
                readOnly
                className="form-checkbox h-4 w-4 text-indigo-600 rounded"
              />
            </div>
          ))}
          <div className="p-2 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => setIsOpen(false)}
              className="w-full text-sm"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
