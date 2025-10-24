import React from 'react';

interface TextAreaProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
}) => (
  <div className="flex flex-col space-y-1">
    {label && (
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className="p-2 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
    />
  </div>
);

export default TextArea;
