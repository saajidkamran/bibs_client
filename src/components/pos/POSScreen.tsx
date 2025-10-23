import React, { useState } from 'react';
import Button from '../common/Button';
import CustomerSelectorModal from './CustomerSelectorModal';
import JobSpecificationPanel from './JobSpecificationPanel';
import JobsTable from './JobsTable';
import TicketDetails from './TicketDetails';
import { generateId } from '../../data/utils';
import { UserPlus } from 'lucide-react';

interface POSScreenProps {
  data: any;
}

const POSScreen: React.FC<POSScreenProps> = ({ data }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);

  const handleAddJob = (job: any) => {
    setJobs((prev) => [...prev, job]);
  };

  const handleDeleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const handleReset = () => {
    setSelectedCustomer(null);
    setJobs([]);
  };

  const handlePrint = () => {
    if (jobs.length === 0) {
      alert('No jobs to print.');
      return;
    }
    alert('🧾 Ticket printed successfully!');
    handleReset();
  };

  return (
    <div className="p-6 space-y-8">
      {/* Step 1: Customer */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
          Step 1: Customer Selection
        </h3>
        {selectedCustomer ? (
          <div className="flex justify-between items-center mt-4">
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-semibold">Customer:</span>{' '}
                {selectedCustomer.name}
              </p>
              <p>
                <span className="font-semibold">Contact:</span>{' '}
                {selectedCustomer.contact || 'N/A'}
              </p>
              <p>
                <span className="font-semibold">Type:</span>{' '}
                {selectedCustomer.type}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setCustomerModalOpen(true)}
            >
              Change Customer
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <Button
              onClick={() => setCustomerModalOpen(true)}
              variant="primary"
              icon={UserPlus}
            >
              Select Customer
            </Button>
          </div>
        )}
      </div>

      {/* Step 2–3: Job Spec + Input */}
      <JobSpecificationPanel
        data={data}
        onAddJob={handleAddJob}
        selectedCustomer={selectedCustomer}
        generateId={generateId}
      />

      {/* Step 4: Jobs Table */}
      <JobsTable jobs={jobs} onDelete={handleDeleteJob} />

      {/* Step 5: Ticket Details */}
      <TicketDetails
        selectedCustomer={selectedCustomer}
        jobs={jobs}
        onReset={handleReset}
        onPrint={handlePrint}
      />

      {/* Customer Modal */}
      <CustomerSelectorModal
        data={data}
        onSelectCustomer={setSelectedCustomer}
        isOpen={isCustomerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        generateId={generateId}
      />
    </div>
  );
};

export default POSScreen;
