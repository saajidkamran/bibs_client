import React from 'react';

interface InputProps {
  label?: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  error?: string;
  icon?: React.ElementType;  // ✅ replaced LucideIcon
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  disabled = false,
  error,
  icon: Icon,
}) => (
  <div className={`flex flex-col ${className}`}>
    {label && (
      <label className="text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`p-2 ${Icon ? 'pl-10' : ''} border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ${
          disabled ? 'bg-gray-100' : 'bg-white'
        }`}
      />
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      )}
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default Input;
