import { AICoreState, ToolNodeId, ExecutionEvent, Case, Escalation } from '../types';
import { MOCK_CUSTOMERS, MOCK_ORDERS } from './mockData';
import { evaluatePolicyAndRisk } from '../policy/engine';

export interface SimulationStep {
  aiState: AICoreState;
  activeTool: ToolNodeId | null;
  progress: number;
  event: ExecutionEvent;
  delayMs: number;
  statusMessage: string;
}

export interface SimulationPlan {
  initialCase: Partial<Case>;
  finalCase: Case;
  escalation?: Escalation;
  steps: SimulationStep[];
}

function getFormattedTime(): string {
  const now = new Date();
  return now.toTimeString().split(' ')[0];
}

export function buildScenarioSimulation(scenarioId: 'delayed_order' | 'damaged_product' | 'high_risk' | 'custom', customInput?: string): SimulationPlan {
  const time = getFormattedTime();

  if (scenarioId === 'delayed_order') {
    const customer = MOCK_CUSTOMERS[0]; // Rahul Sharma
    const order = MOCK_ORDERS[0]; // ORD8842, ₹2,499

    const ticketNumber = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const refundId = `REF-PAYTM-${Math.floor(10000 + Math.random() * 90000)}`;

    const initialCase: Partial<Case> = {
      id: `CASE-${Date.now()}`,
      ticketNumber,
      customerId: customer.id,
      customerName: customer.name,
      customerTier: customer.tier,
      intent: 'Delayed Order & Refund Request',
      orderNumber: order.orderNumber,
      productName: order.product,
      amount: order.amount,
      currency: 'INR',
      priority: 'MEDIUM',
      risk: 'LOW',
      status: 'INVESTIGATING',
      decision: 'AUTO_RESOLVE',
      verificationStatus: 'PENDING',
      customerMessage: "My order hasn't arrived. Please refund me.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [],
    };

    const steps: SimulationStep[] = [
      {
        aiState: 'ANALYZING',
        activeTool: null,
        progress: 10,
        statusMessage: 'ANALYZING REQUEST INTENT & ENTITY TOKENS',
        delayMs: 800,
        event: {
          id: `ev-${Date.now()}-1`,
          timestamp: time,
          type: 'REQUEST_RECEIVED',
          title: 'Customer Request Received',
          description: `Intake message: "My order hasn't arrived. Please refund me."`,
          status: 'success',
        },
      },
      {
        aiState: 'SEARCHING',
        activeTool: 'CRM',
        progress: 22,
        statusMessage: 'QUERYING CRM 360 & CUSTOMER IDENTITY',
        delayMs: 900,
        event: {
          id: `ev-${Date.now()}-2`,
          timestamp: time,
          type: 'CUSTOMER_VERIFIED',
          title: 'Customer Verified in CRM',
          description: `Customer ${customer.name} (ID: ${customer.id}) identified. Tier: ${customer.tier.toUpperCase()}, Trust Score: ${customer.trustScore}/100.`,
          status: 'success',
          tool: 'CRM',
        },
      },
      {
        aiState: 'SEARCHING',
        activeTool: 'ORDERS',
        progress: 35,
        statusMessage: 'RETRIEVING CARRIER TELEMATICS & SLA DATA',
        delayMs: 1000,
        event: {
          id: `ev-${Date.now()}-3`,
          timestamp: time,
          type: 'ORDER_RETRIEVED',
          title: 'Order Telematics Retrieved',
          description: `Order ${order.orderNumber} (${order.product}). Courier: ${order.courier}. Tracking: ${order.trackingId}. Status: Delayed by ${order.daysDelayed || 5} days.`,
          status: 'warning',
          tool: 'ORDERS',
        },
      },
      {
        aiState: 'REASONING',
        activeTool: 'PAYMENTS',
        progress: 50,
        statusMessage: 'EVALUATING BUSINESS POLICIES & RISK HEURISTICS',
        delayMs: 1100,
        event: {
          id: `ev-${Date.now()}-4`,
          timestamp: time,
          type: 'POLICY_EVALUATED',
          title: 'Deterministic Policy Check Passed',
          description: `Delivery breach confirmed (>48 hours past SLA). Policy Rule POL-402 authorizes 100% refund for unfulfilled delivery.`,
          status: 'success',
          tool: 'PAYMENTS',
        },
      },
      {
        aiState: 'DECIDING',
        activeTool: null,
        progress: 62,
        statusMessage: 'POLICY ENGINE: AUTONOMOUS ACTION AUTHORIZED',
        delayMs: 900,
        event: {
          id: `ev-${Date.now()}-5`,
          timestamp: time,
          type: 'ACTION_AUTHORIZED',
          title: 'Autonomous Refund Authorized',
          description: `Amount ₹${order.amount.toLocaleString('en-IN')} is within autonomous authorization limit (₹5,000). Fraud risk evaluated as LOW.`,
          status: 'success',
        },
      },
      {
        aiState: 'EXECUTING',
        activeTool: 'REFUNDS',
        progress: 75,
        statusMessage: 'INVOKING PAYMENT GATEWAY REFUND API',
        delayMs: 1200,
        event: {
          id: `ev-${Date.now()}-6`,
          timestamp: time,
          type: 'ACTION_EXECUTED',
          title: 'Refund Payout Dispatched',
          description: `Dispatched payment reversal of ₹${order.amount.toLocaleString('en-IN')} via Paytm PG API with idempotency key IDEM-${order.orderNumber}.`,
          status: 'active',
          tool: 'REFUNDS',
        },
      },
      {
        aiState: 'VERIFYING',
        activeTool: 'PAYMENTS',
        progress: 88,
        statusMessage: 'RECONCILING BANK SETTLEMENT & GATEWAY RECEIPT',
        delayMs: 1100,
        event: {
          id: `ev-${Date.now()}-7`,
          timestamp: time,
          type: 'RESULT_VERIFIED',
          title: 'Gateway Ledger Settlement Verified',
          description: `Settlement confirmed by banking network. Gateway Reconciliation ID: ${refundId}. Verified outcome recorded.`,
          status: 'success',
          tool: 'PAYMENTS',
        },
      },
      {
        aiState: 'RESOLVED',
        activeTool: 'NOTIFICATIONS',
        progress: 95,
        statusMessage: 'DISPATCHING MULTI-CHANNEL CUSTOMER CONFIRMATION',
        delayMs: 800,
        event: {
          id: `ev-${Date.now()}-8`,
          timestamp: time,
          type: 'CUSTOMER_NOTIFIED',
          title: 'Customer Notified via WhatsApp & SMS',
          description: `Sent notification with refund receipt ${refundId}. Estimated credit reflection: Instant UPI / 1-2 hours IMPS.`,
          status: 'success',
          tool: 'NOTIFICATIONS',
        },
      },
      {
        aiState: 'RESOLVED',
        activeTool: 'TICKETS',
        progress: 100,
        statusMessage: 'CASE SYNCHRONIZED & CLOSED AUTONOMOUSLY',
        delayMs: 600,
        event: {
          id: `ev-${Date.now()}-9`,
          timestamp: time,
          type: 'CASE_RESOLVED',
          title: 'Case Resolved Autonomously',
          description: `Audit trail preserved. Zero human intervention required. Verification certificate attached.`,
          status: 'success',
          tool: 'TICKETS',
        },
      },
    ];

    const finalCase: Case = {
      ...(initialCase as Case),
      status: 'RESOLVED',
      currentAction: 'REFUND_SETTLED_VERIFIED',
      verificationStatus: 'VERIFIED',
      verificationDetails: {
        verifiedAt: new Date().toISOString(),
        gatewayRefId: refundId,
        checkName: 'Paytm Payment Gateway Settlement Reconciliation',
        confirmed: true,
      },
      refundId,
      resolution: `Autonomous refund of ₹${order.amount.toLocaleString('en-IN')} executed and verified under Gateway Ref: ${refundId}.`,
      aiResponse: `We have verified that your shipment for order ${order.orderNumber} exceeded the delivery SLA by 5 days. A full refund of ₹${order.amount.toLocaleString('en-IN')} has been credited back to your original payment method (Ref: ${refundId}).`,
      timeline: steps.map((s) => s.event),
    };

    return { initialCase, finalCase, steps };
  }

  if (scenarioId === 'damaged_product') {
    const customer = MOCK_CUSTOMERS[1]; // Priya Patel
    const order = MOCK_ORDERS[1]; // ORD9103, ₹3,299

    const ticketNumber = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const replacementOrderId = `ORD-REPL-${Math.floor(5000 + Math.random() * 4000)}`;

    const initialCase: Partial<Case> = {
      id: `CASE-${Date.now()}`,
      ticketNumber,
      customerId: customer.id,
      customerName: customer.name,
      customerTier: customer.tier,
      intent: 'Damaged Item Replacement',
      orderNumber: order.orderNumber,
      productName: order.product,
      amount: order.amount,
      currency: 'INR',
      priority: 'MEDIUM',
      risk: 'LOW',
      status: 'INVESTIGATING',
      decision: 'AUTO_RESOLVE',
      verificationStatus: 'PENDING',
      customerMessage: 'The product I received is damaged. I want a replacement.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [],
    };

    const steps: SimulationStep[] = [
      {
        aiState: 'ANALYZING',
        activeTool: null,
        progress: 15,
        statusMessage: 'ANALYZING REPLACEMENT INTENT & DAMAGE REPORT',
        delayMs: 800,
        event: {
          id: `ev-${Date.now()}-1`,
          timestamp: time,
          type: 'REQUEST_RECEIVED',
          title: 'Damaged Item Report Received',
          description: `Customer submitted damage report for order ${order.orderNumber}.`,
          status: 'success',
        },
      },
      {
        aiState: 'SEARCHING',
        activeTool: 'CRM',
        progress: 30,
        statusMessage: 'VERIFYING CUSTOMER PROFILE & RETURN HISTORY',
        delayMs: 900,
        event: {
          id: `ev-${Date.now()}-2`,
          timestamp: time,
          type: 'CUSTOMER_VERIFIED',
          title: 'Customer Verified',
          description: `Matched ${customer.name} (Gold Tier). High trust score: ${customer.trustScore}/100. Zero previous fraudulent returns.`,
          status: 'success',
          tool: 'CRM',
        },
      },
      {
        aiState: 'SEARCHING',
        activeTool: 'ORDERS',
        progress: 45,
        statusMessage: 'CHECKING RETURN WINDOW & WAREHOUSE INVENTORY',
        delayMs: 1000,
        event: {
          id: `ev-${Date.now()}-3`,
          timestamp: time,
          type: 'ORDER_RETRIEVED',
          title: 'Order Status & Inventory Checked',
          description: `Delivered within 48 hours. Eligible for immediate doorstep replacement under 7-day warranty. Warehouse inventory: 42 units in stock.`,
          status: 'success',
          tool: 'ORDERS',
        },
      },
      {
        aiState: 'DECIDING',
        activeTool: null,
        progress: 60,
        statusMessage: 'POLICY ENGINE: REPLACEMENT AUTHORIZED',
        delayMs: 900,
        event: {
          id: `ev-${Date.now()}-4`,
          timestamp: time,
          type: 'ACTION_AUTHORIZED',
          title: 'Replacement Order Authorized',
          description: `Policy rule POL-881 verified. Customer qualified for doorstep swap. Return shipping cost waived.`,
          status: 'success',
        },
      },
      {
        aiState: 'EXECUTING',
        activeTool: 'ORDERS',
        progress: 75,
        statusMessage: 'CREATING REPLACEMENT ORDER IN ERP',
        delayMs: 1200,
        event: {
          id: `ev-${Date.now()}-5`,
          timestamp: time,
          type: 'ACTION_EXECUTED',
          title: 'Replacement Order Provisioned',
          description: `Allocated SKU from Mumbai Fulfillment Hub. Generated new order ${replacementOrderId}. Scheduled reverse courier pickup.`,
          status: 'active',
          tool: 'ORDERS',
        },
      },
      {
        aiState: 'VERIFYING',
        activeTool: 'TICKETS',
        progress: 88,
        statusMessage: 'VERIFYING WAREHOUSE ALLOCATION & DOCKET',
        delayMs: 1100,
        event: {
          id: `ev-${Date.now()}-6`,
          timestamp: time,
          type: 'RESULT_VERIFIED',
          title: 'Inventory & Dispatch Verified',
          description: `Fulfillment ERP confirmed item reservation. Courier pickup docket assigned to Delhivery Surface.`,
          status: 'success',
          tool: 'TICKETS',
        },
      },
      {
        aiState: 'RESOLVED',
        activeTool: 'NOTIFICATIONS',
        progress: 100,
        statusMessage: 'SENDING TRACKING & REVERSE PICKUP PASS',
        delayMs: 700,
        event: {
          id: `ev-${Date.now()}-7`,
          timestamp: time,
          type: 'CASE_RESOLVED',
          title: 'Replacement Confirmed & Case Closed',
          description: `Dispatched digital return docket and live tracking link to customer. Expected delivery: Within 48 hours.`,
          status: 'success',
          tool: 'NOTIFICATIONS',
        },
      },
    ];

    const finalCase: Case = {
      ...(initialCase as Case),
      status: 'RESOLVED',
      currentAction: 'REPLACEMENT_DISPATCHED',
      verificationStatus: 'VERIFIED',
      verificationDetails: {
        verifiedAt: new Date().toISOString(),
        gatewayRefId: replacementOrderId,
        checkName: 'Warehouse ERP Inventory Reservation & Dispatch Order Verification',
        confirmed: true,
      },
      replacementOrderId,
      resolution: `Replacement unit ${replacementOrderId} scheduled for expedited delivery. Doorstep swap return scheduled.`,
      aiResponse: `We are sorry for the damaged unit! We have arranged a brand new replacement (${replacementOrderId}) which will arrive within 48 hours. The courier will pick up the damaged unit at your doorstep.`,
      timeline: steps.map((s) => s.event),
    };

    return { initialCase, finalCase, steps };
  }

  // High Risk Scenario: Vikram Singhania - ₹50,000 transaction
  const customer = MOCK_CUSTOMERS[2]; // Vikram Singhania
  const order = MOCK_ORDERS[2]; // ORD7721, ₹50,000

  const ticketNumber = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

  const initialCase: Partial<Case> = {
    id: `CASE-${Date.now()}`,
    ticketNumber,
    customerId: customer.id,
    customerName: customer.name,
    customerTier: customer.tier,
    intent: 'High-Risk Transaction Dispute',
    orderNumber: order.orderNumber,
    productName: order.product,
    amount: order.amount,
    currency: 'INR',
    priority: 'CRITICAL',
    risk: 'HIGH',
    status: 'INVESTIGATING',
    decision: 'HUMAN_REVIEW',
    verificationStatus: 'SKIPPED',
    customerMessage: 'I think someone made an unauthorized ₹50,000 transaction.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [],
  };

  const steps: SimulationStep[] = [
    {
      aiState: 'ANALYZING',
      activeTool: null,
      progress: 15,
      statusMessage: 'ANALYZING FRAUD / DISPUTE DECLARATION',
      delayMs: 800,
      event: {
        id: `ev-${Date.now()}-1`,
        timestamp: time,
        type: 'REQUEST_RECEIVED',
        title: 'High-Value Security Dispute Lodged',
        description: `Customer reported unauthorized charge of ₹50,000.`,
        status: 'warning',
      },
    },
    {
      aiState: 'SEARCHING',
      activeTool: 'CRM',
      progress: 30,
      statusMessage: 'CROSS-REFERENCING CUSTOMER PROFILE & RISK SIGNALS',
      delayMs: 900,
      event: {
        id: `ev-${Date.now()}-2`,
        timestamp: time,
        type: 'CUSTOMER_VERIFIED',
        title: 'Customer Profile Assessed',
        description: `Customer trust score: 31/100. Status: Flagged account. Multiple recent password reset attempts detected.`,
        status: 'warning',
        tool: 'CRM',
      },
    },
    {
      aiState: 'SEARCHING',
      activeTool: 'PAYMENTS',
      progress: 45,
      statusMessage: 'INSPECTING BANK GATEWAY AUTHENTICATION TELEMETRY',
      delayMs: 1000,
      event: {
        id: `ev-${Date.now()}-3`,
        timestamp: time,
        type: 'RISK_ASSESSED',
        title: 'Risk Engine Scored 82/100 (HIGH RISK)',
        description: `Order amount ₹50,000 exceeds ₹5,000 autonomous limit. Geographic anomaly: Mumbai billing card with foreign VPN IP.`,
        status: 'error',
        tool: 'PAYMENTS',
      },
    },
    {
      aiState: 'REASONING',
      activeTool: null,
      progress: 60,
      statusMessage: 'EVALUATING SAFETY POLICY GUARDRAILS',
      delayMs: 900,
      event: {
        id: `ev-${Date.now()}-4`,
        timestamp: time,
        type: 'POLICY_EVALUATED',
        title: 'Autonomous Financial Payout Restricted',
        description: `Rule SEC-901 enforced: Autonomous AI is strictly prohibited from auto-refunding transactions > ₹5,000 with fraud indicators.`,
        status: 'error',
      },
    },
    {
      aiState: 'DECIDING',
      activeTool: 'HUMAN',
      progress: 75,
      statusMessage: 'PREPARING AI INVESTIGATION BRIEF FOR HUMAN SUPERVISOR',
      delayMs: 1000,
      event: {
        id: `ev-${Date.now()}-5`,
        timestamp: time,
        type: 'ACTION_AUTHORIZED',
        title: 'Mandatory Human Escalation Triggered',
        description: `Packaging diagnostic dossier: device logs, courier shipment coordinates, and bank auth tokens for fraud supervisor.`,
        status: 'warning',
        tool: 'HUMAN',
      },
    },
    {
      aiState: 'ESCALATED',
      activeTool: 'HUMAN',
      progress: 90,
      statusMessage: 'ESCALATING CASE TO HUMAN SUPERVISOR COMMAND QUEUE',
      delayMs: 1200,
      event: {
        id: `ev-${Date.now()}-6`,
        timestamp: time,
        type: 'ESCALATED',
        title: 'Case Transferred to Human Escalation Center',
        description: `Case marked CRITICAL PRIORITY. Placed in triage queue with recommended action: Hold transit delivery & call customer.`,
        status: 'error',
        tool: 'HUMAN',
      },
    },
    {
      aiState: 'ESCALATED',
      activeTool: 'NOTIFICATIONS',
      progress: 100,
      statusMessage: 'CUSTOMER BRIEFED ON SECURITY ESCALATION',
      delayMs: 700,
      event: {
        id: `ev-${Date.now()}-7`,
        timestamp: time,
        type: 'CUSTOMER_NOTIFIED',
        title: 'Customer Safe Advisory Sent',
        description: `Informed customer that security hold is applied and a senior fraud specialist will call within 15 minutes.`,
        status: 'warning',
        tool: 'NOTIFICATIONS',
      },
    },
  ];

  const escalation: Escalation = {
    id: `ESC-${Date.now()}`,
    ticketId: initialCase.id!,
    caseNumber: ticketNumber,
    customerId: customer.id,
    customerName: customer.name,
    issue: 'High-Value Unauthorized Transaction Dispute (₹50,000)',
    priority: 'CRITICAL',
    riskLevel: 'HIGH',
    amount: order.amount,
    aiSummary:
      'Customer reported an unauthorized charge of ₹50,000 for Titan Apex RTX 4080 Gaming Rig. The transaction value exceeds the autonomous threshold (₹5,000). Suspicious VPN proxy geolocation variance detected. Account trust score is 31/100.',
    actionsAttempted: [
      'Customer identity verified in CRM',
      'Order telematics inspected with carrier',
      'Gateway auth token verified',
      'Autonomous policy engine triggered limit guardrail',
    ],
    reason:
      'Transaction amount (₹50,000) exceeds autonomous cap and risk engine calculated high fraud probability (Score: 82/100).',
    recommendedAction:
      'Execute emergency courier recall on TRK-EKART-772109, place merchant payout hold, and conduct voice verification with cardholder.',
    status: 'PENDING_REVIEW',
    createdAt: new Date().toISOString(),
  };

  const finalCase: Case = {
    ...(initialCase as Case),
    status: 'ESCALATED',
    currentAction: 'HUMAN_SUPERVISOR_TRIAGE',
    verificationStatus: 'SKIPPED',
    resolution:
      'Case safely transferred to Human Escalation Center. Automated payout restricted by enterprise policy guardrails.',
    aiResponse:
      'We have placed transaction ORD7721 (₹50,000) under emergency security review. Our Senior Fraud Prevention Team has been alerted with top priority and will contact you directly.',
    timeline: steps.map((s) => s.event),
  };

  return { initialCase, finalCase, escalation, steps };
}
