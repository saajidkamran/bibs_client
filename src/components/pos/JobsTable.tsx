import React from 'react';
import Button from '../common/Button';
import { Trash2 } from 'lucide-react';

interface Job {
  id: string;
  item: any;
  metal: any;
  metalProcess: any;
  process: any;
  processType: any;
  qty: number;
  price: number;
  total: number;
  comment?: string;
}

interface JobsTableProps {
  jobs: Job[];
  onDelete: (id: string) => void;
}

const JobsTable: React.FC<JobsTableProps> = ({ jobs, onDelete }) => {
  const totalAmount = jobs.reduce((sum, job) => sum + job.total, 0);

  return (
    <div className="mt-6 bg-white rounded-xl shadow-lg p-4">
      <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
        Step 4: Jobs Added
      </h4>
      {jobs.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">No jobs added yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">Item</th>
                  <th className="px-3 py-2 text-left">Metal</th>
                  <th className="px-3 py-2 text-left">Metal Process</th>
                  <th className="px-3 py-2 text-left">Process</th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-right">Qty</th>
                  <th className="px-3 py-2 text-right">Price</th>
                  <th className="px-3 py-2 text-right">Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-indigo-50">
                    <td className="px-3 py-2 text-sm">{job.item.name}</td>
                    <td className="px-3 py-2 text-sm">{job.metal.name}</td>
                    <td className="px-3 py-2 text-sm">{job.metalProcess.name}</td>
                    <td className="px-3 py-2 text-sm">{job.process.name}</td>
                    <td className="px-3 py-2 text-sm">{job.processType.name}</td>
                    <td className="px-3 py-2 text-sm text-right">{job.qty}</td>
                    <td className="px-3 py-2 text-sm text-right">
                      {job.price.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-sm text-right font-semibold">
                      {job.total.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        onClick={() => onDelete(job.id)}
                        variant="icon"
                        icon={Trash2}
                        title="Remove Job"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-right mt-4 pr-4">
            <p className="text-lg font-bold text-gray-800">
              Total: LKR {totalAmount.toLocaleString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default JobsTable;
