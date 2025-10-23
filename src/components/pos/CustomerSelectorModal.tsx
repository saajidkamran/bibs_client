import React, { useState, useMemo } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { User, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  type: string;
  company?: string;
  contact?: string;
  vat?: string;
}

interface CustomerSelectorModalProps {
  data: { customers: Customer[] };
  onSelectCustomer: (customer: Customer) => void;
  isOpen: boolean;
  onClose: () => void;
  generateId: () => string;
}

const CustomerSelectorModal: React.FC<CustomerSelectorModalProps> = ({
  data,
  onSelectCustomer,
  isOpen,
  onClose,
  generateId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [cashName, setCashName] = useState('');
  const [cashContact, setCashContact] = useState('');
  const ITEMS_PER_PAGE = 8;

  const filteredCustomers = useMemo(() => {
    return data.customers
      .filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.contact?.includes(searchTerm) ||
          c.vat?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data.customers, searchTerm]);

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleSelect = (customer: Customer) => {
    onSelectCustomer(customer);
    onClose();
    setSearchTerm('');
    setPage(1);
  };

  const handleWalkInSelect = () => {
    if (!cashName || !cashContact) {
      alert('Please enter Name and Contact for the walk-in customer.');
      return;
    }
    const walkInCustomer = {
      id: generateId(),
      type: 'Walk-In',
      name: cashName,
      company: 'N/A',
      contact: cashContact,
      vat: 'N/A',
    };
    onSelectCustomer(walkInCustomer);
    onClose();
  };

  return (
    <Modal title="Select Customer" isOpen={isOpen} onClose={onClose}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Walk-In */}
        <div className="lg:col-span-1 p-4 bg-gray-50 rounded-xl shadow-inner space-y-3">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Walk-In Customer (Cash)
          </h3>
          <Input
            label="Name"
            value={cashName}
            onChange={(e) => setCashName(e.target.value)}
            required
          />
          <Input
            label="Contact Number"
            value={cashContact}
            onChange={(e) => setCashContact(e.target.value)}
            required
          />
          <Button onClick={handleWalkInSelect} variant="primary" className="w-full mt-4" icon={User}>
            Use Walk-In
          </Button>
        </div>

        {/* Registered */}
        <div className="lg:col-span-3">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Registered Customers
          </h3>
          <Input
            placeholder="Filter by Name, Company, Contact, or VAT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
            className="mb-4"
          />
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Name/Company</th>
                  <th className="px-4 py-2 text-left">Contact</th>
                  <th className="px-4 py-2 text-left">VAT No.</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-indigo-50">
                    <td className="px-4 py-2 text-sm">{c.type}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">
                      {c.name} {c.company && `(${c.company})`}
                    </td>
                    <td className="px-4 py-2 text-sm">{c.contact}</td>
                    <td className="px-4 py-2 text-sm">{c.vat || 'N/A'}</td>
                    <td className="px-4 py-2 text-right">
                      <Button
                        onClick={() => handleSelect(c)}
                        variant="primary"
                        className="text-xs px-2 py-1"
                      >
                        Select
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center pt-3">
            <p className="text-sm text-gray-600">
              Total {filteredCustomers.length} results
            </p>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                icon={ChevronLeft}
              />
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                icon={ChevronRight}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomerSelectorModal;
