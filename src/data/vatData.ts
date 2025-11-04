import type { VatRecord } from '../components/types/vatTypes';

export const initialVatData: VatRecord[] = [
  { id: 1, vatValue: 20, effectiveDate: '2025-01-01', addedBy: 'System', status: 'Inactive' },
  { id: 2, vatValue: 21, effectiveDate: '2025-07-24', addedBy: 'Admin', status: 'Active' },
  { id: 3, vatValue: 18, effectiveDate: '2024-11-15', addedBy: 'Manager', status: 'Inactive' },
];
