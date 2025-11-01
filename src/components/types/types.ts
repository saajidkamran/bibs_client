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
