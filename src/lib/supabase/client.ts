import { Customer, Order, Case, Escalation } from '../types';
import { MOCK_CUSTOMERS, MOCK_ORDERS, MOCK_CASES, MOCK_ESCALATIONS } from '../demo/mockData';

const STORAGE_KEYS = {
  CASES: 'resolveai_cases_v1',
  ESCALATIONS: 'resolveai_escalations_v1',
  CUSTOMERS: 'resolveai_customers_v1',
  ORDERS: 'resolveai_orders_v1',
  SETTINGS: 'resolveai_settings_v1',
};

// In-memory fallbacks if window/localStorage not available (e.g. during SSR)
let memoryCases: Case[] = [...MOCK_CASES];
let memoryEscalations: Escalation[] = [...MOCK_ESCALATIONS];
let memoryCustomers: Customer[] = [...MOCK_CUSTOMERS];
let memoryOrders: Order[] = [...MOCK_ORDERS];

export const db = {
  getCases: (): Case[] => {
    if (typeof window === 'undefined') return memoryCases;
    const stored = localStorage.getItem(STORAGE_KEYS.CASES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(MOCK_CASES));
      return MOCK_CASES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return MOCK_CASES;
    }
  },

  saveCase: (newCase: Case): void => {
    if (typeof window === 'undefined') {
      memoryCases = [newCase, ...memoryCases.filter((c) => c.id !== newCase.id)];
      return;
    }
    const current = db.getCases();
    const updated = [newCase, ...current.filter((c) => c.id !== newCase.id)];
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(updated));
  },

  getCaseById: (id: string): Case | undefined => {
    const cases = db.getCases();
    return cases.find((c) => c.id === id || c.ticketNumber === id);
  },

  getCustomers: (): Customer[] => {
    if (typeof window === 'undefined') return memoryCustomers;
    const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(MOCK_CUSTOMERS));
      return MOCK_CUSTOMERS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return MOCK_CUSTOMERS;
    }
  },

  getOrders: (): Order[] => {
    if (typeof window === 'undefined') return memoryOrders;
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(MOCK_ORDERS));
      return MOCK_ORDERS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return MOCK_ORDERS;
    }
  },

  getEscalations: (): Escalation[] => {
    if (typeof window === 'undefined') return memoryEscalations;
    const stored = localStorage.getItem(STORAGE_KEYS.ESCALATIONS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.ESCALATIONS, JSON.stringify(MOCK_ESCALATIONS));
      return MOCK_ESCALATIONS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return MOCK_ESCALATIONS;
    }
  },

  saveEscalation: (newEsc: Escalation): void => {
    if (typeof window === 'undefined') {
      memoryEscalations = [newEsc, ...memoryEscalations.filter((e) => e.id !== newEsc.id)];
      return;
    }
    const current = db.getEscalations();
    const updated = [newEsc, ...current.filter((e) => e.id !== newEsc.id)];
    localStorage.setItem(STORAGE_KEYS.ESCALATIONS, JSON.stringify(updated));
  },

  updateEscalationStatus: (
    id: string,
    status: Escalation['status'],
    assignedTo?: string
  ): void => {
    const current = db.getEscalations();
    const updated = current.map((e) => {
      if (e.id === id) {
        return {
          ...e,
          status,
          assignedTo: assignedTo || e.assignedTo,
          updatedAt: new Date().toISOString(),
        };
      }
      return e;
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ESCALATIONS, JSON.stringify(updated));
    } else {
      memoryEscalations = updated;
    }
  },

  resetDemoData: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(MOCK_CASES));
      localStorage.setItem(STORAGE_KEYS.ESCALATIONS, JSON.stringify(MOCK_ESCALATIONS));
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(MOCK_CUSTOMERS));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(MOCK_ORDERS));
    }
    memoryCases = [...MOCK_CASES];
    memoryEscalations = [...MOCK_ESCALATIONS];
    memoryCustomers = [...MOCK_CUSTOMERS];
    memoryOrders = [...MOCK_ORDERS];
  },
};
