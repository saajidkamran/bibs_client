import React, { useState, useEffect, useMemo } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import { CheckCircle, List } from 'lucide-react';
import SelectionGroup from '../common/SelectionGroup';

interface JobSpecificationPanelProps {
  data: any;
  onAddJob: (job: any) => void;
  selectedCustomer: any;
  generateId: () => string;
}

const JobSpecificationPanel: React.FC<JobSpecificationPanelProps> = ({
  data,
  onAddJob,
  selectedCustomer,
  generateId,
}) => {
  const [selection, setSelection] = useState<any>({});
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setSelection({});
    setQty(1);
    setPrice(0);
    setComment('');
    setError('');
  }, [selectedCustomer]);

  const handleSelect = (key: string, record: any) => {
    const updated = { ...selection };
    const order = ['item', 'metal', 'metalProcess', 'process', 'processType'];
    const index = order.indexOf(key);
    for (let i = index + 1; i < order.length; i++) updated[order[i]] = null;
    updated[key] = record;
    setSelection(updated);
  };

  const availableMetals = useMemo(
    () =>
      selection.item
        ? data.metals.filter(
            (m: any) =>
              selection.item.metalIds.includes(m.id) && m.isActive
          )
        : data.metals,
    [selection.item, data.metals]
  );

  const availableMetalProcesses = useMemo(
    () =>
      selection.metal
        ? data.metal_processes.filter(
            (mp: any) =>
              selection.metal.metalProcessIds.includes(mp.id) && mp.isActive
          )
        : data.metal_processes,
    [selection.metal, data.metal_processes]
  );

  const availableProcesses = useMemo(
    () => (selection.metalProcess ? data.processes.filter((p: any) => p.isActive) : data.processes),
    [selection.metalProcess, data.processes]
  );

  const availableProcessTypes = useMemo(
    () =>
      selection.process
        ? data.process_types.filter(
            (pt: any) =>
              selection.process.processTypeIds.includes(pt.id) && pt.isActive
          )
        : data.process_types,
    [selection.process, data.process_types]
  );

  const handleAddJob = () => {
    if (!selectedCustomer) return setError('Select a customer first.');
    const keys = ['item', 'metal', 'metalProcess', 'process', 'processType'];
    if (keys.some((k) => !selection[k])) return setError('Please complete all 5 steps.');
    if (qty <= 0) return setError('Quantity must be > 0.');
    if (price <= 0) return setError('Price must be > 0.');

    onAddJob({
      id: generateId(),
      ...selection,
      qty,
      price,
      total: qty * price,
      comment,
    });

    setSelection({});
    setQty(1);
    setPrice(0);
    setComment('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
        Step 2: Job Specification
      </h3>
      <div className="grid grid-cols-6 gap-4 bg-indigo-50 p-4 rounded-xl">
        <div className="col-span-5 grid grid-cols-5 gap-3">
          <SelectionGroup
            title="Item"
            data={data.items.filter((i: any) => i.isActive)}
            selectedRecord={selection.item}
            onSelect={(r) => handleSelect('item', r)}
            selectionStore={selection}
          />
          <SelectionGroup
            title="Metal"
            data={availableMetals}
            selectedRecord={selection.metal}
            onSelect={(r) => handleSelect('metal', r)}
            requiredSelectionKey="item"
            selectionStore={selection}
          />
          <SelectionGroup
            title="Metal Process"
            data={availableMetalProcesses}
            selectedRecord={selection.metalProcess}
            onSelect={(r) => handleSelect('metalProcess', r)}
            requiredSelectionKey="metal"
            selectionStore={selection}
          />
          <SelectionGroup
            title="Process"
            data={availableProcesses}
            selectedRecord={selection.process}
            onSelect={(r) => handleSelect('process', r)}
            requiredSelectionKey="metalProcess"
            selectionStore={selection}
          />
          <SelectionGroup
            title="Process Type"
            data={availableProcessTypes}
            selectedRecord={selection.processType}
            onSelect={(r) => handleSelect('processType', r)}
            requiredSelectionKey="process"
            selectionStore={selection}
          />
        </div>

        <div className="col-span-1 p-3 bg-white rounded-xl shadow border">
          <h4 className="font-bold text-gray-700 mb-2 flex items-center">
            <List className="w-4 h-4 mr-1 text-indigo-500" /> Preview
          </h4>
          {['item', 'metal', 'metalProcess', 'process', 'processType'].map((k) => (
            <p key={k} className="text-xs text-gray-600">
              {k}: <span className="font-semibold">{selection[k]?.name || '---'}</span>
            </p>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Step 3: Job Details Input
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Item Quantity"
              type="number"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 1)}
            />
            <Input
              label="Job Price (LKR)"
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            />
          </div>
          <TextArea
            label="Comments"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button
            onClick={handleAddJob}
            variant="primary"
            icon={CheckCircle}
            className="w-full mt-4"
          >
            Add Job
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobSpecificationPanel;
