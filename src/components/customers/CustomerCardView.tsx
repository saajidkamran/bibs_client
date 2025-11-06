// src/components/customers/CustomerCardView.tsx
import React from 'react';
import { Eye, Pencil, MessageSquare, AlertTriangle } from 'lucide-react';
import type { CustomerRecord } from './types';
import { ActiveStatusBadge } from './CustomerBadges/ActiveStatusBadge';
import { InvoiceEmailBadge } from './CustomerBadges/InvoiceEmailBadge';
import { VatCustomerBadge } from './CustomerBadges/VatCustomerBadge';

interface Props {
  data: CustomerRecord[];
  onEdit: (customer: CustomerRecord) => void;
  onView: (customer: CustomerRecord) => void;
}

export const CustomerCardView: React.FC<Props> = ({ data, onEdit, onView }) => (
  <div className="lg:hidden divide-y divide-gray-200">
    {data.map((c) => (
      <div key={c.id} className="p-4 space-y-3 hover:bg-gray-50 transition">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">{c.customerName}</span>
          <div className="flex space-x-2 items-center">
            <ActiveStatusBadge isActive={c.isActive} />
            <InvoiceEmailBadge sendByEmail={c.sendInvoiceByEmail} />
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
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Company:</strong> {c.companyName}</p>
          <p><strong>Address:</strong> {c.address}</p>
          <p>
            <strong>WhatsApp:</strong>{' '}
            {c.whatsappNumber ? (
              <a
                href={`https://wa.me/${c.whatsappNumber.replace(/[^0-9+]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline flex items-center"
              >
                <MessageSquare className="w-3 h-3 mr-1" /> {c.whatsappNumber}
              </a>
            ) : (
              'N/A'
            )}
          </p>
          <p className="text-red-700">
            <span className="font-bold text-red-600 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" /> Emergency:
            </span>
            {c.emergencyContactName ? (
              <a href={`tel:${c.emergencyContactPhone}`} className="hover:underline">
                {c.emergencyContactName} ({c.emergencyContactPhone})
              </a>
            ) : (
              'N/A'
            )}
          </p>
          <p><strong>VAT:</strong> {c.isVatCustomer ? c.vatId : 'N/A'}</p>
          <VatCustomerBadge isVat={c.isVatCustomer} />
        </div>
      </div>
    ))}
  </div>
);
