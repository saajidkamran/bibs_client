import  type { CompanyRecord } from './companyTypes';

export const initialCompanyData: CompanyRecord[] = [
  {
    id: 1,
    companyName: 'BIBS Jewelry',
    address: 'Punane tn 42',
    vatId: 'VAT12345',
    taxId: 'TAX67890',
    website: 'www.bibs.com',
    email: 'najathsl@gmail.com',
    effectiveDate: '2025-07-29',
    addedBy: 'Admin',
    status: 'Inactive'as const,
  },
  {
    id: 2,
    companyName: 'Goldsmith Co.',
    address: '45 Pearl Lane',
    vatId: 'VAT98765',
    taxId: 'TAX12345',
    website: 'goldco.net',
    email: 'info@goldco.net',
    effectiveDate: '2025-08-15',
    addedBy: 'Manager',
    status: 'Active'as const,
  },
];
