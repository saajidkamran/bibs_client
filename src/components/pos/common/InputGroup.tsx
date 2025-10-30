import React from 'react';

interface InputGroupProps {
    label: string;
    id: string;
    children: React.ReactNode;
}

export default function InputGroup({ label, id, children }: InputGroupProps) {
    return (
        <div className="flex flex-col space-y-1">
            <label
                htmlFor={id}
                className="text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            {children}
        </div>
    );
}