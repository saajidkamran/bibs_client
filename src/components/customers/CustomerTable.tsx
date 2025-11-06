// src/components/customers/CustomerTable.tsx
import React from 'react';
import { Eye, Pencil, Phone, MessageSquare } from 'lucide-react';
import type { CustomerRecord } from './types';
import { ActiveStatusBadge } from './CustomerBadges/ActiveStatusBadge';
import { VatCustomerBadge } from './CustomerBadges/VatCustomerBadge';
import { InvoiceEmailBadge } from './CustomerBadges/InvoiceEmailBadge';

interface Props {
  data: CustomerRecord[];
  onEdit: (customer: CustomerRecord) => void;
  onView: (customer: CustomerRecord) => void;
}

export const CustomerTable: React.FC<Props> = ({ data, onEdit, onView }) => {
  const headers = [
    'CUSTOMER NAME',
    'COMPANY NAME',
    'STATUS',
    'INVOICE BY',
    'ADDRESS',
    'EMAIL',
    'PHONE',
    'WHATSAPP',
    'VAT CUSTOMER',
    'ACTIONS',
  ];

  return (
    <table className="min-w-full divide-y divide-gray-200 hidden lg:table">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((h) => (
            <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((c) => (
          <tr key={c.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.customerName}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{c.companyName}</td>
            <td className="px-4 py-3">
              <ActiveStatusBadge isActive={c.isActive} />
            </td>
            <td className="px-4 py-3">
              <InvoiceEmailBadge sendByEmail={c.sendInvoiceByEmail} />
            </td>
            <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-[180px]" title={c.address}>
              {c.address}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">{c.email}</td>
            <td className="px-4 py-3 flex items-center text-gray-500 text-sm">
              <Phone className="w-3 h-3 mr-1 text-gray-400" /> {c.phone1}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">
              {c.whatsappNumber ? (
                <span className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1 text-green-500" /> {c.whatsappNumber}
                </span>
              ) : (
                '-'
              )}
            </td>
            <td className="px-4 py-3">
              <VatCustomerBadge isVat={c.isVatCustomer} />
            </td>
            <td className="px-4 py-3 text-sm font-medium">
              <div className="flex space-x-2">
                <button
                  onClick={() => onView(c)}
                  className="p-2 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(c)}
                  className="p-2 text-yellow-600 bg-yellow-100 rounded-full hover:bg-yellow-200"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
