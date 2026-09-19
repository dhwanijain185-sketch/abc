import { Customer, Order, RiskLevel } from '../types';
import { POLICY_CONFIG } from '../constants';

export interface PolicyEvaluationResult {
  decision: 'AUTO_RESOLVE' | 'HUMAN_REVIEW' | 'CLARIFICATION';
  action: 'REFUND' | 'REPLACEMENT' | 'ESCALATE' | 'CLARIFY';
  allowed: boolean;
  riskLevel: RiskLevel;
  riskScore: number;
  reasons: string[];
  recommendedAction?: string;
  maxAuthorizedAmount?: number;
}

export function evaluatePolicyAndRisk(params: {
  customer: Customer;
  order?: Order;
  requestedAction: 'refund' | 'replacement' | 'dispute' | 'inquiry';
  amount?: number;
  message: string;
}): PolicyEvaluationResult {
  const { customer, order, requestedAction, amount = order?.amount || 0, message } = params;
  const reasons: string[] = [];

  // 1. Calculate Comprehensive Risk Score (0 - 100)
  let calculatedRisk = customer.riskScore;

  // Amount risk weighting
  if (amount > 20000) {
    calculatedRisk += 35;
    reasons.push(`High transaction amount: ₹${amount.toLocaleString('en-IN')} (above ₹20,000 baseline)`);
  } else if (amount > POLICY_CONFIG.MAX_AUTO_REFUND_AMOUNT) {
    calculatedRisk += 20;
    reasons.push(`Amount ₹${amount.toLocaleString('en-IN')} exceeds autonomous threshold of ₹${POLICY_CONFIG.MAX_AUTO_REFUND_AMOUNT.toLocaleString('en-IN')}`);
  }

  // Keywords indicating unauthorized, scam, lawyer, or legal threats
  const lowerMsg = message.toLowerCase();
  const isUnauthorized =
    lowerMsg.includes('unauthorized') ||
    lowerMsg.includes('hacked') ||
    lowerMsg.includes('fraud') ||
    lowerMsg.includes('scam') ||
    lowerMsg.includes('stolen') ||
    lowerMsg.includes('lawyer') ||
    lowerMsg.includes('police') ||
    lowerMsg.includes('consumer court');

  if (isUnauthorized) {
    calculatedRisk += 40;
    reasons.push('High-risk security or legal keywords detected in customer statement');
  }

  // Customer trust score factor
  if (customer.trustScore < POLICY_CONFIG.MIN_TRUST_SCORE_FOR_AUTO) {
    calculatedRisk += 25;
    reasons.push(`Customer trust score ${customer.trustScore}/100 is below threshold of ${POLICY_CONFIG.MIN_TRUST_SCORE_FOR_AUTO}`);
  }

  // Cap calculatedRisk to 100
  calculatedRisk = Math.min(100, Math.max(0, calculatedRisk));

  let riskLevel: RiskLevel = 'LOW';
  if (calculatedRisk >= 65) {
    riskLevel = 'HIGH';
  } else if (calculatedRisk >= 35) {
    riskLevel = 'MEDIUM';
  }

  // 2. Deterministic Policy Gate
  // Rule 1: High risk or high amount ALWAYS forces Human Review
  if (riskLevel === 'HIGH' || amount > POLICY_CONFIG.MAX_AUTO_REFUND_AMOUNT || isUnauthorized) {
    return {
      decision: 'HUMAN_REVIEW',
      action: 'ESCALATE',
      allowed: false,
      riskLevel: 'HIGH',
      riskScore: calculatedRisk,
      reasons,
      recommendedAction:
        'Transfer case to Senior Fraud & Dispute Specialist. Halt automated financial payouts.',
    };
  }

  // Rule 2: Refund Request Evaluation
  if (requestedAction === 'refund') {
    if (!order) {
      return {
        decision: 'CLARIFICATION',
        action: 'CLARIFY',
        allowed: false,
        riskLevel,
        riskScore: calculatedRisk,
        reasons: ['No associated order found for customer refund request'],
        recommendedAction: 'Ask customer to provide valid order number or transaction reference.',
      };
    }

    // Check delivery delay rule
    const isDelayed = order.status === 'DELAYED' || (order.daysDelayed && order.daysDelayed > 1);
    if (isDelayed && order.refundEligible && amount <= POLICY_CONFIG.MAX_AUTO_REFUND_AMOUNT) {
      reasons.push(`Order ${order.orderNumber} delayed by ${order.daysDelayed || 2} days (exceeds 48-hour delivery SLA)`);
      reasons.push(`Refund amount ₹${amount.toLocaleString('en-IN')} within autonomous authorization cap`);
      return {
        decision: 'AUTO_RESOLVE',
        action: 'REFUND',
        allowed: true,
        riskLevel: 'LOW',
        riskScore: calculatedRisk,
        reasons,
        maxAuthorizedAmount: amount,
        recommendedAction: `Execute autonomous refund of ₹${amount.toLocaleString('en-IN')} with gateway verification.`,
      };
    }

    if (!order.refundEligible) {
      return {
        decision: 'HUMAN_REVIEW',
        action: 'ESCALATE',
        allowed: false,
        riskLevel: 'MEDIUM',
        riskScore: calculatedRisk,
        reasons: [`Order ${order.orderNumber} is marked non-eligible for automatic refund`],
        recommendedAction: 'Human supervisor review required for non-standard refund exception.',
      };
    }
  }

  // Rule 3: Damaged Product / Replacement Evaluation
  if (requestedAction === 'replacement' || lowerMsg.includes('damage') || lowerMsg.includes('broken')) {
    if (order && (order.status === 'DAMAGED' || order.status === 'DELIVERED')) {
      reasons.push(`Product return window active (< 7 days since receipt)`);
      reasons.push(`Customer eligible for instant courier swap replacement`);
      return {
        decision: 'AUTO_RESOLVE',
        action: 'REPLACEMENT',
        allowed: true,
        riskLevel: 'LOW',
        riskScore: calculatedRisk,
        reasons,
        recommendedAction: `Provision replacement order in warehouse and generate reverse pickup docket.`,
      };
    }
  }

  // Default fallback
  return {
    decision: 'AUTO_RESOLVE',
    action: 'REFUND',
    allowed: true,
    riskLevel: 'LOW',
    riskScore: calculatedRisk,
    reasons: ['Standard autonomous service policy satisfied'],
    recommendedAction: 'Proceed with autonomous resolution.',
  };
}
