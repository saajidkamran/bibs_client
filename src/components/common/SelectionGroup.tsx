import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Button from './Button';
import SelectionButton from './SelectionButton';

interface RecordItem {
  id: string;
  name: string;
}

interface SelectionGroupProps {
  title: string;
  data: RecordItem[];
  selectedRecord: RecordItem | null;
  onSelect: (record: RecordItem) => void;
  requiredSelectionKey?: string;
  selectionStore: Record<string, RecordItem | null>;
}

const SelectionGroup: React.FC<SelectionGroupProps> = ({
  title,
  data,
  selectedRecord,
  onSelect,
  requiredSelectionKey,
  selectionStore,
}) => {
  const isEnabled = !requiredSelectionKey || !!selectionStore[requiredSelectionKey];
  const [startIndex, setStartIndex] = useState(0);
  const ITEMS_VISIBLE = 5;

  const showData = data.slice(startIndex, startIndex + ITEMS_VISIBLE);

  const scrollUp = () => setStartIndex((prev) => Math.max(0, prev - 1));
  const scrollDown = () =>
    setStartIndex((prev) =>
      Math.min(data.length - ITEMS_VISIBLE, prev + 1)
    );

  useEffect(() => setStartIndex(0), [data]);

  return (
    <div
      className={`p-2 bg-gray-50 rounded-xl border border-gray-200 flex flex-col ${
        !isEnabled ? 'opacity-60 pointer-events-none' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-xs font-bold text-gray-700 whitespace-nowrap">
          {title}
        </h4>
        <div className="flex space-x-1">
          <Button
            variant="small-icon"
            icon={ChevronUp}
            onClick={scrollUp}
            disabled={startIndex === 0 || !isEnabled}
            className="p-0.5 w-5 h-5"
          />
          <Button
            variant="small-icon"
            icon={ChevronDown}
            onClick={scrollDown}
            disabled={
              startIndex >= data.length - ITEMS_VISIBLE ||
              data.length <= ITEMS_VISIBLE ||
              !isEnabled
            }
            className="p-0.5 w-5 h-5"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-2 flex-grow min-h-[280px]">
        {showData.map((d) => (
          <SelectionButton
            key={d.id}
            isSelected={selectedRecord?.id === d.id}
            onClick={() => onSelect(d)}
            disabled={!isEnabled}
          >
            {d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name}
          </SelectionButton>
        ))}
      </div>

      {!isEnabled && (
        <p className="text-center text-xs text-red-500 mt-2">
          Previous step required.
        </p>
      )}
    </div>
  );
};

export default SelectionGroup;
