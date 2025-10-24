import React from 'react';

interface SelectionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
  disabled?: boolean;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({
  children,
  onClick,
  isSelected,
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      w-[70px] h-[50px] flex items-center justify-center text-center text-xs font-semibold
      rounded-lg transition duration-150 shadow-sm border
      ${
        disabled
          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          : isSelected
          ? 'bg-amber-500 text-white border-amber-600 shadow-md transform scale-[1.03]'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-400'
      }
    `}
  >
    {children}
  </button>
);

export default SelectionButton;
