export type AICoreState =
  | 'IDLE'
  | 'ANALYZING'
  | 'SEARCHING'
  | 'REASONING'
  | 'DECIDING'
  | 'EXECUTING'
  | 'VERIFYING'
  | 'RESOLVED'
  | 'ESCALATED'
  | 'ERROR';

export type ToolNodeId =
  | 'CRM'
  | 'CUSTOMER'
  | 'ORDERS'
  | 'PAYMENTS'
  | 'POLICY'
  | 'RISK'
  | 'REFUNDS'
  | 'TICKETS'
  | 'NOTIFICATIONS'
  | 'ANALYTICS'
  | 'HUMAN';

export interface ToolNodeInfo {
  id: ToolNodeId;
  name: string;
  description: string;
  position: [number, number, number]; // 3D coordinates around central core
  color: string;
  activeColor: string;
}

export type EventStatus = 'pending' | 'active' | 'success' | 'warning' | 'error';

export interface ExecutionEvent {
  id: string;
  timestamp: string; // e.g. "14:31:04"
  type:
    | 'REQUEST_RECEIVED'
    | 'INTENT_IDENTIFIED'
    | 'CUSTOMER_VERIFIED'
    | 'ORDER_RETRIEVED'
    | 'POLICY_EVALUATED'
    | 'RISK_ASSESSED'
    | 'ACTION_AUTHORIZED'
    | 'ACTION_EXECUTED'
    | 'RESULT_VERIFIED'
    | 'CUSTOMER_NOTIFIED'
    | 'CASE_RESOLVED'
    | 'ESCALATED'
    | 'ERROR';
  title: string;
  description: string;
  status: EventStatus;
  tool?: ToolNodeId;
  metadata?: Record<string, unknown>;
}

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type CaseStatus =
  | 'OPEN'
  | 'INVESTIGATING'
  | 'DECIDING'
  | 'EXECUTING'
  | 'VERIFYING'
  | 'RESOLVED'
  | 'ESCALATED'
  | 'FAILED';

export interface Case {
  id: string;
  ticketNumber: string; // e.g. "REQ-1024"
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerTier: 'standard' | 'gold' | 'platinum' | 'enterprise';
  intent: string;
  orderNumber?: string;
  productName?: string;
  amount: number;
  currency: string;
  priority: PriorityLevel;
  risk: RiskLevel;
  status: CaseStatus;
  decision: 'AUTO_RESOLVE' | 'HUMAN_REVIEW' | 'CLARIFICATION';
  currentAction?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'FAILED' | 'SKIPPED';
  verificationDetails?: {
    verifiedAt: string;
    gatewayRefId?: string;
    checkName: string;
    confirmed: boolean;
  };
  resolution?: string;
  customerMessage?: string;
  aiResponse?: string;
  refundId?: string;
  replacementOrderId?: string;
  createdAt: string;
  updatedAt: string;
  timeline: ExecutionEvent[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'standard' | 'gold' | 'platinum' | 'enterprise';
  riskScore: number; // 0 (safest) to 100 (highest risk)
  trustScore: number; // 0 to 100
  totalOrders: number;
  totalSpent: number;
  lifetimeRefunds: number;
  status: 'active' | 'flagged' | 'restricted';
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  product: string;
  amount: number;
  status: 'DELIVERED' | 'IN_TRANSIT' | 'DELAYED' | 'DAMAGED' | 'RETURNED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'REFUNDED' | 'DISPUTED' | 'PENDING';
  refundEligible: boolean;
  refundAmount: number;
  trackingId: string;
  courier: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  daysDelayed?: number;
  createdAt: string;
}

export interface Escalation {
  id: string;
  ticketId: string;
  caseNumber: string;
  customerId: string;
  customerName: string;
  issue: string;
  priority: PriorityLevel;
  riskLevel: RiskLevel;
  aiSummary: string;
  actionsAttempted: string[];
  reason: string;
  recommendedAction: string;
  status: 'PENDING_REVIEW' | 'ASSIGNED' | 'ACKNOWLEDGED' | 'RESOLVED' | 'INFO_REQUESTED';
  assignedTo?: string;
  amount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface N8NRequestPayload {
  request_id: string;
  customer_id?: string;
  message: string;
  context?: {
    order_id?: string;
    source?: string;
  };
}

export interface N8NResponsePayload {
  request_id: string;
  status: 'resolved' | 'escalated' | 'clarification' | 'failed';
  intent: string;
  customer_id: string;
  order_id: string | null;
  action: string;
  amount: number;
  refund_id: string | null;
  verified: boolean;
  message: string;
  timeline: ExecutionEvent[];
}

export interface AppMetrics {
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  escalatedCases: number;
  automationRate: number; // percentage e.g. 84.6%
  avgResolutionTimeSeconds: number; // e.g. 14.2s
  actionSuccessRate: number; // e.g. 98.4%
  verificationRate: number; // e.g. 100%
}
