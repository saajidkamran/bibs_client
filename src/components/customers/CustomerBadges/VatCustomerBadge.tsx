import React from 'react';

export const VatCustomerBadge: React.FC<{ isVat: boolean }> = ({ isVat }) => {
  const text = isVat ? 'VAT Yes' : 'VAT No';
  const bgColor = isVat ? 'bg-green-100' : 'bg-red-100';
  const textColor = isVat ? 'text-green-600' : 'text-red-600';
  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
      {text}
    </span>
  );
};
