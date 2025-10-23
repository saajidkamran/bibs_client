import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'icon';
  icon?: React.ElementType;  // ✅ replace LucideIcon with this
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  icon: Icon,
  disabled = false,
  className = '',
  type = 'button',
}) => {
  const baseStyle =
    'flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50';
  let variantStyle = '';

  switch (variant) {
    case 'primary':
      variantStyle = 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
      break;
    case 'secondary':
      variantStyle = 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400';
      break;
    case 'danger':
      variantStyle = 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      break;
    case 'icon':
      return (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={`p-2 rounded-full text-gray-600 hover:bg-gray-100 transition duration-150 ${className} ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {Icon && <Icon className="w-5 h-5" />}
        </button>
      );
    default:
      variantStyle = 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children && <span>{children}</span>}
    </button>
  );
};

export default Button;
