// mockData.ts
import { generateId } from './utils';

export const MASTER_TYPES = {
  PROCESS_TYPE: 'process_types',
  PROCESS: 'processes',
  METAL_PROCESS: 'metal_processes',
  METAL: 'metals',
  ITEM: 'items',
  EMPLOYEE: 'employees',
  CUSTOMER: 'customers',
} as const;

// --- Type definitions ---
export interface ProcessType {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
}

export interface MetalProcess {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Process {
  id: string;
  name: string;
  processTypeIds: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface Metal {
  id: string;
  name: string;
  metalProcessIds: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface Item {
  id: string;
  name: string;
  metalIds: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Customer {
  id: string;
  type: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  vat: string;
}

// --- Properly typed data store ---
export const initialDataStore: {
  [MASTER_TYPES.PROCESS_TYPE]: ProcessType[];
  [MASTER_TYPES.METAL_PROCESS]: MetalProcess[];
  [MASTER_TYPES.PROCESS]: Process[];
  [MASTER_TYPES.METAL]: Metal[];
  [MASTER_TYPES.ITEM]: Item[];
  [MASTER_TYPES.EMPLOYEE]: Employee[];
  [MASTER_TYPES.CUSTOMER]: Customer[];
} = {
  [MASTER_TYPES.PROCESS_TYPE]: [
    { id: 'pt1', name: 'Casting', isActive: true, createdAt: new Date() },
    { id: 'pt2', name: 'Polishing', isActive: true, createdAt: new Date() },
    { id: 'pt3', name: 'Stone Setting', isActive: true, createdAt: new Date() },
  ],

  [MASTER_TYPES.METAL_PROCESS]: [
    { id: 'mp1', name: 'Melting', isActive: true, createdAt: new Date() },
    { id: 'mp2', name: 'Alloying', isActive: true, createdAt: new Date() },
    { id: 'mp3', name: 'Finishing', isActive: false, createdAt: new Date() },
  ],

  [MASTER_TYPES.PROCESS]: [
    { id: 'p1', name: 'Resize', processTypeIds: ['pt2'], isActive: true, createdAt: new Date() },
    { id: 'p2', name: 'Polish Buff', processTypeIds: ['pt2'], isActive: true, createdAt: new Date() },
    { id: 'p3', name: 'Set Stone', processTypeIds: ['pt3'], isActive: true, createdAt: new Date() },
  ],

  [MASTER_TYPES.METAL]: [
    { id: 'm1', name: 'Gold 18K', metalProcessIds: ['mp1', 'mp2'], isActive: true, createdAt: new Date() },
    { id: 'm2', name: 'Silver 925', metalProcessIds: ['mp2', 'mp3'], isActive: true, createdAt: new Date() },
    { id: 'm3', name: 'Platinum', metalProcessIds: ['mp1'], isActive: true, createdAt: new Date() },
  ],

  [MASTER_TYPES.ITEM]: [
    { id: 'i1', name: 'Ring', metalIds: ['m1', 'm2'], isActive: true, createdAt: new Date() },
    { id: 'i2', name: 'Chain', metalIds: ['m2', 'm3'], isActive: true, createdAt: new Date() },
  ],

  [MASTER_TYPES.EMPLOYEE]: [
    { id: 'e1', name: 'John Doe', employeeId: 'E1001', role: 'Polisher', isActive: true, createdAt: new Date() },
    { id: 'e2', name: 'Jane Smith', employeeId: 'E1002', role: 'Stone Setter', isActive: true, createdAt: new Date() },
  ],

  [MASTER_TYPES.CUSTOMER]: [
    { id: 'c1', type: 'Registered', name: 'Ameen Jewellers', company: 'Ameen & Sons', contact: '0777123456', email: 'info@ameen.lk', vat: 'VAT12345' },
    { id: 'c2', type: 'Invoice', name: 'Golden Touch', company: 'Golden Touch Pvt Ltd', contact: '0717896543', email: 'golden@touch.lk', vat: 'VAT98765' },
  ],
};
