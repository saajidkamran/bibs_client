import React from 'react';

export const ActiveStatusBadge: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const text = isActive ? 'Active' : 'Inactive';
  const bgColor = isActive ? 'bg-indigo-100' : 'bg-gray-200';
  const textColor = isActive ? 'text-indigo-600' : 'text-gray-600';
  const dotColor = isActive ? 'bg-indigo-500' : 'bg-gray-400';

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
      <span className={`w-2 h-2 rounded-full ${dotColor} mr-2`} />
      {text}
    </span>
  );
};
