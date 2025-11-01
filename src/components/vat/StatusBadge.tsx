import React from 'react';

const StatusBadge: React.FC<{ status: 'Active' | 'Inactive' }> = ({ status }) => {
  const isInactive = status === 'Inactive';
  const bgColor = isInactive ? 'bg-indigo-100' : 'bg-green-100';
  const textColor = isInactive ? 'text-indigo-600' : 'text-green-600';

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
