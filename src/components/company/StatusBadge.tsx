import React from 'react';

interface Props {
  status: 'Active' | 'Inactive';
}

const StatusBadge: React.FC<Props> = React.memo(({ status }) => {
  const inactive = status === 'Inactive';
  const bgColor = inactive ? 'bg-indigo-100' : 'bg-green-100';
  const textColor = inactive ? 'text-indigo-600' : 'text-green-600';

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}
    >
      {status}
    </span>
  );
});

export default StatusBadge;
