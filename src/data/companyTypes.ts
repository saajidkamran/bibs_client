// src/data/companyTypes.ts

export interface CompanyRecord {
  id: number;
  companyName: string;
  address: string;
  vatId: string;
  taxId: string;
  website: string;
  email: string;
  effectiveDate: string;
  addedBy: string;
  status: 'Active' | 'Inactive';
}
