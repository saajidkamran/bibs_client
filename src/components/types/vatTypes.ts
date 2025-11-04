export interface VatRecord {
  id: number;
  vatValue: number;
  effectiveDate: string;
  addedBy: string;
  status: 'Active' | 'Inactive';
}
