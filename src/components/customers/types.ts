// src/components/customers/types.ts
export interface CustomerRecord {
  id: number;
  customerName: string;
  companyName: string;
  address: string;
  webAddress: string;
  email: string;
  phone1: string;
  phone2: string;
  whatsappNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  isActive: boolean;
  isVatCustomer: boolean;
  vatId: string;
  sendInvoiceByEmail: boolean;
}

export const initialCustomerData: CustomerRecord[] = [
  {
    id: 1,
    customerName: 'Daria',
    companyName: 'BIBS Jewellery',
    address: 'Punane tn 42, Tallinn',
    webAddress: 'http://www.bibs.com',
    email: 'daria@bibs.com',
    phone1: '677889',
    phone2: '5550001',
    whatsappNumber: '+37256123456',
    emergencyContactName: 'John Smith',
    emergencyContactPhone: '999111222',
    isActive: true,
    isVatCustomer: true,
    vatId: 'VAT1298',
    sendInvoiceByEmail: true,
  },
  {
    id: 2,
    customerName: 'Marcus Cole',
    companyName: 'Future Tech Ltd',
    address: 'Main St 101, New York',
    webAddress: 'http://futuretech.io',
    email: 'marcus@ft.com',
    phone1: '5551234',
    phone2: '',
    whatsappNumber: '+12025550101',
    emergencyContactName: 'Sarah Connor',
    emergencyContactPhone: '5559876',
    isActive: false,
    isVatCustomer: false,
    vatId: '',
    sendInvoiceByEmail: false,
  },
];
