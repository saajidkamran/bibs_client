import React, { useMemo } from 'react';
import Button from '../common/Button';
import { Printer, RefreshCcw } from 'lucide-react';

interface TicketDetailsProps {
  selectedCustomer: any;
  jobs: any[];
  onReset: () => void;
  onPrint: () => void;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({
  selectedCustomer,
  jobs,
  onReset,
  onPrint,
}) => {
  const totalAmount = useMemo(
    () => jobs.reduce((sum, job) => sum + job.total, 0),
    [jobs]
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 space-y-4">
      <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
        Step 5: Ticket Details
      </h4>

      <div className="space-y-1 text-sm">
        <p>
          <span className="font-semibold">Customer:</span>{' '}
          {selectedCustomer ? selectedCustomer.name : 'N/A'}
        </p>
        <p>
          <span className="font-semibold">Contact:</span>{' '}
          {selectedCustomer?.contact || 'N/A'}
        </p>
        <p>
          <span className="font-semibold">Type:</span>{' '}
          {selectedCustomer?.type || 'N/A'}
        </p>
      </div>

      <div className="pt-3 border-t text-right">
        <p className="text-lg font-bold text-gray-800">
          Total: LKR {totalAmount.toLocaleString()}
        </p>
      </div>

      <div className="flex justify-between pt-2">
        <Button
          variant="secondary"
          onClick={onReset}
          icon={RefreshCcw}
          className="w-1/2 mr-2"
        >
          Reset
        </Button>
        <Button
          variant="primary"
          onClick={onPrint}
          icon={Printer}
          className="w-1/2 ml-2"
        >
          Accept & Print Ticket
        </Button>
      </div>
    </div>
  );
};

export default TicketDetails;
