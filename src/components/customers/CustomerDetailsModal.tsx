import React from 'react';
import { Eye, X, Phone, MessageSquare, AlertTriangle, MapPin, Globe, Mail, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { ActiveStatusBadge } from './CustomerBadges/ActiveStatusBadge';
import { VatCustomerBadge } from './CustomerBadges/VatCustomerBadge';
import { InvoiceEmailBadge } from './CustomerBadges/InvoiceEmailBadge';
import type { CustomerRecord } from './types';

interface Props {
  customer: CustomerRecord | null;
  onClose: () => void;
}

export const CustomerDetailsModal: React.FC<Props> = ({ customer, onClose }) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-5 border-b bg-indigo-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-indigo-600" /> Details: {customer.customerName}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 border-b bg-gray-50 flex flex-wrap gap-4">
          <ActiveStatusBadge isActive={customer.isActive} />
          <VatCustomerBadge isVat={customer.isVatCustomer} />
          <InvoiceEmailBadge sendByEmail={customer.sendInvoiceByEmail} />
        </div>

        <div className="p-6 space-y-4">
          {/* Details... (same as before, can reuse <DetailRow /> component if needed) */}
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
