import { ToolNodeId, ToolNodeInfo, AICoreState } from './types';

export const TOOL_NODES: ToolNodeInfo[] = [
  {
    id: 'CRM',
    name: 'Customer 360',
    description: 'Customer profile, loyalty tier, and contact verification',
    position: [-3.4, 1.6, 0.2],
    color: '#00BAF2',
    activeColor: '#38BDF8',
  },
  {
    id: 'ORDERS',
    name: 'Order Ops',
    description: 'Shipment tracking, courier telematics, logistics SLAs',
    position: [-1.4, 3.4, -0.4],
    color: '#0284C7',
    activeColor: '#00BAF2',
  },
  {
    id: 'PAYMENTS',
    name: 'Payments Ledger',
    description: 'Bank gateway reconciliation, chargeback check, auth status',
    position: [1.4, 3.4, -0.4],
    color: '#002970',
    activeColor: '#00BAF2',
  },
  {
    id: 'POLICY',
    name: 'Policy Engine',
    description: 'Operational policy evaluation and SLA threshold rules',
    position: [2.9, 2.6, 0.3],
    color: '#0EA5E9',
    activeColor: '#38BDF8',
  },
  {
    id: 'RISK',
    name: 'Risk Engine',
    description: 'Fraud and risk assessment, AML heuristics, trust scoring',
    position: [-2.9, 2.6, 0.3],
    color: '#D97706',
    activeColor: '#F59E0B',
  },
  {
    id: 'REFUNDS',
    name: 'Refund Engine',
    description: 'Autonomous payout gateway, wallet credits, reversal verification',
    position: [3.4, 1.6, 0.2],
    color: '#10B981',
    activeColor: '#34D399',
  },
  {
    id: 'TICKETS',
    name: 'Ticket Core',
    description: 'ERP/CRM case record synchronization and audit trail',
    position: [3.2, -1.8, 0.4],
    color: '#002970',
    activeColor: '#00BAF2',
  },
  {
    id: 'NOTIFICATIONS',
    name: 'Comms Dispatcher',
    description: 'Instant WhatsApp, SMS, push and email multi-channel dispatch',
    position: [1.3, -3.4, -0.3],
    color: '#0284C7',
    activeColor: '#38BDF8',
  },
  {
    id: 'ANALYTICS',
    name: 'Telemetry Hub',
    description: 'Autonomous resolution telemetry and streaming KPIs',
    position: [-1.3, -3.4, -0.3],
    color: '#0369A1',
    activeColor: '#00BAF2',
  },
  {
    id: 'HUMAN',
    name: 'Human Supervisor',
    description: 'High-risk escalation queue and specialist triage node',
    position: [-3.2, -1.8, 0.4],
    color: '#EF4444',
    activeColor: '#F87171',
  },
];

export const AI_STATE_META: Record<
  AICoreState,
  { label: string; subLabel: string; color: string; ringSpeed: number }
> = {
  IDLE: {
    label: 'STANDBY / IDLE',
    subLabel: 'Autonomous listener monitoring customer events',
    color: '#38BDF8',
    ringSpeed: 0.5,
  },
  ANALYZING: {
    label: 'ANALYZING REQUEST',
    subLabel: 'Parsing natural language intent and extracting entity tokens',
    color: '#00F0FF',
    ringSpeed: 1.2,
  },
  SEARCHING: {
    label: 'SEARCHING SYSTEMS',
    subLabel: 'Querying CRM 360 and logistics telemetry in parallel',
    color: '#0EA5E9',
    ringSpeed: 1.8,
  },
  REASONING: {
    label: 'REASONING & POLICY',
    subLabel: 'Synthesizing SLA rules, return window, and risk heuristics',
    color: '#818CF8',
    ringSpeed: 2.2,
  },
  DECIDING: {
    label: 'DECIDING ACTION',
    subLabel: 'Deterministic policy evaluation against enterprise thresholds',
    color: '#6366F1',
    ringSpeed: 2.5,
  },
  EXECUTING: {
    label: 'EXECUTING ACTION',
    subLabel: 'Dispatching idempotent tool invocation to target ledger',
    color: '#10B981',
    ringSpeed: 3.0,
  },
  VERIFYING: {
    label: 'VERIFYING OUTCOME',
    subLabel: 'Reconciling gateway receipt and confirmation certificate',
    color: '#34D399',
    ringSpeed: 1.4,
  },
  RESOLVED: {
    label: 'CASE RESOLVED',
    subLabel: 'Verified outcome delivered, customer notified, ticket closed',
    color: '#10B981',
    ringSpeed: 0.6,
  },
  ESCALATED: {
    label: 'HUMAN ESCALATION',
    subLabel: 'Policy exception / risk boundary reached — routed to supervisor',
    color: '#EF4444',
    ringSpeed: 1.0,
  },
  ERROR: {
    label: 'SYSTEM ERROR',
    subLabel: 'Safely halted action with idempotent rollback and alert',
    color: '#F43F5E',
    ringSpeed: 0.8,
  },
};

export const POLICY_CONFIG = {
  MAX_AUTO_REFUND_AMOUNT: 5000, // In INR (₹)
  MAX_DELIVERY_DELAY_HOURS: 48,
  MIN_TRUST_SCORE_FOR_AUTO: 65,
  MAX_FRAUD_RISK_SCORE: 35,
  AUTO_REPLACEMENT_ELIGIBLE: true,
  ENABLE_IDEMPOTENT_RETRY: true,
};
