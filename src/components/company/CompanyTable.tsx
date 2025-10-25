import React from 'react';
import { Eye, Pencil } from 'lucide-react';
import type { CompanyRecord } from '../../data/companyTypes';
import StatusBadge from './StatusBadge';

interface Props {
  data: CompanyRecord[];
  onView: (id: number) => void;
  onEdit: (company: CompanyRecord) => void;
}

const CompanyTable: React.FC<Props> = ({ data, onView, onEdit }) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        {['Name', 'Address', 'VAT ID', 'Email', 'Status', 'Actions'].map((h) => (
          <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((c) => (
        <tr key={c.id} className="hover:bg-gray-50">
          <td className="px-6 py-4">{c.companyName}</td>
          <td className="px-6 py-4">{c.address}</td>
          <td className="px-6 py-4">{c.vatId}</td>
          <td className="px-6 py-4">{c.email}</td>
          <td className="px-6 py-4">
            <StatusBadge status={c.status} />
          </td>
          <td className="px-6 py-4 flex gap-2">
            <button
              onClick={() => onView(c.id)}
              className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
            >
              <Eye className="w-4 h-4" />
            </button>
            {c.status === 'Active' && (
              <button
                onClick={() => onEdit(c)}
                className="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default React.memo(CompanyTable);
