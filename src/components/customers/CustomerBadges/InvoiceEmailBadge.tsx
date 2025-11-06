import React from 'react';
import { Send, Printer } from 'lucide-react';

export const InvoiceEmailBadge: React.FC<{ sendByEmail: boolean }> = ({ sendByEmail }) => {
  const text = sendByEmail ? 'Email' : 'Paper';
  const bgColor = sendByEmail ? 'bg-blue-100' : 'bg-yellow-100';
  const textColor = sendByEmail ? 'text-blue-600' : 'text-yellow-600';
  const Icon = sendByEmail ? Send : Printer;

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
      <Icon className="w-3 h-3 mr-2" />
      {text}
    </span>
  );
};
