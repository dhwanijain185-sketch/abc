'use client';

import { useSyncExternalStore } from 'react';
import { AICoreState, ToolNodeId, ExecutionEvent, Case } from '../types';
import { db } from '../supabase/client';
import { buildScenarioSimulation } from '../demo/simulator';
import { sendCustomerRequestToN8N } from '../n8n/client';

export interface AppState {
  mode: 'DEMO' | 'LIVE';
  webhookUrl: string;
  aiState: AICoreState;
  activeTool: ToolNodeId | null;
  progress: number;
  statusMessage: string;
  activeCase: Case | null;
  timeline: ExecutionEvent[];
  isExecuting: boolean;
  activeScenarioId: string | null;
}

const defaultCase = db.getCases()[0] || null;

let state: AppState = {
  mode: 'DEMO',
  webhookUrl:
    typeof window !== 'undefined'
      ? localStorage.getItem('resolveai_webhook_url') || ''
      : '',
  aiState: 'IDLE',
  activeTool: null,
  progress: 0,
  statusMessage: 'AUTONOMOUS SYSTEM STANDBY',
  activeCase: defaultCase,
  timeline: defaultCase ? defaultCase.timeline : [],
  isExecuting: false,
  activeScenarioId: null,
};

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

let activeTimeouts: NodeJS.Timeout[] = [];

export const appStore = {
  getState: (): AppState => state,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  setMode: (mode: 'DEMO' | 'LIVE') => {
    state = { ...state, mode };
    emitChange();
  },

  setWebhookUrl: (url: string) => {
    state = { ...state, webhookUrl: url };
    if (typeof window !== 'undefined') {
      localStorage.setItem('resolveai_webhook_url', url);
    }
    emitChange();
  },

  clearActiveExecution: () => {
    activeTimeouts.forEach(clearTimeout);
    activeTimeouts = [];
  },

  resetDemo: () => {
    appStore.clearActiveExecution();
    db.resetDemoData();
    const cases = db.getCases();
    const firstCase = cases[0] || null;
    state = {
      ...state,
      aiState: 'IDLE',
      activeTool: null,
      progress: 0,
      statusMessage: 'SYSTEM RESET — STANDBY',
      activeCase: firstCase,
      timeline: firstCase ? firstCase.timeline : [],
      isExecuting: false,
      activeScenarioId: null,
    };
    emitChange();
  },

  selectCase: (caseItem: Case) => {
    state = {
      ...state,
      activeCase: caseItem,
      timeline: caseItem.timeline || [],
    };
    emitChange();
  },

  runScenario: async (
    scenarioId: 'delayed_order' | 'damaged_product' | 'high_risk' | 'custom',
    customMessage?: string
  ) => {
    appStore.clearActiveExecution();

    // Check if LIVE MODE and webhookUrl is configured
    if (state.mode === 'LIVE' && (state.webhookUrl || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL)) {
      state = {
        ...state,
        isExecuting: true,
        aiState: 'ANALYZING',
        statusMessage: 'TRANSMITTING REQUEST TO N8N WEBHOOK',
        progress: 10,
        activeScenarioId: scenarioId,
      };
      emitChange();

      const requestId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
      const message =
        customMessage ||
        (scenarioId === 'delayed_order'
          ? "My order hasn't arrived. Please refund me."
          : scenarioId === 'damaged_product'
          ? 'The product I received is damaged. I want a replacement.'
          : 'I think someone made an unauthorized ₹50,000 transaction.');

      const result = await sendCustomerRequestToN8N(
        {
          request_id: requestId,
          message,
        },
        state.webhookUrl
      );

      if (result.success && result.data) {
        const n8nData = result.data;
        const newCase: Case = {
          id: `CASE-${Date.now()}`,
          ticketNumber: n8nData.request_id || requestId,
          customerId: n8nData.customer_id || 'CUST-LIVE',
          customerName: 'Verified Customer',
          customerTier: 'gold',
          intent: n8nData.intent || 'Customer Inbound Request',
          orderNumber: n8nData.order_id || undefined,
          amount: n8nData.amount || 0,
          currency: 'INR',
          priority: n8nData.status === 'escalated' ? 'HIGH' : 'MEDIUM',
          risk: n8nData.status === 'escalated' ? 'HIGH' : 'LOW',
          status: n8nData.status === 'resolved' ? 'RESOLVED' : 'ESCALATED',
          decision: n8nData.status === 'resolved' ? 'AUTO_RESOLVE' : 'HUMAN_REVIEW',
          currentAction: n8nData.action || 'COMPLETED',
          verificationStatus: n8nData.verified ? 'VERIFIED' : 'SKIPPED',
          refundId: n8nData.refund_id || undefined,
          resolution: n8nData.message,
          customerMessage: message,
          aiResponse: n8nData.message,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          timeline: n8nData.timeline || [],
        };
        db.saveCase(newCase);

        state = {
          ...state,
          isExecuting: false,
          aiState: n8nData.status === 'resolved' ? 'RESOLVED' : 'ESCALATED',
          activeTool: n8nData.status === 'resolved' ? 'TICKETS' : 'HUMAN',
          progress: 100,
          statusMessage: n8nData.status === 'resolved' ? 'CASE RESOLVED & VERIFIED VIA N8N' : 'CASE ESCALATED VIA N8N',
          activeCase: newCase,
          timeline: newCase.timeline,
        };
        emitChange();
        return;
      } else {
        // n8n returned error, fallback to demo mode with clear alert
        console.warn('n8n error, falling back to simulated execution:', result.error);
        state = {
          ...state,
          statusMessage: `N8N UNREACHABLE (${result.error || 'Check URL'}) — FALLING BACK TO DEMO MODE`,
          mode: 'DEMO',
        };
        emitChange();
      }
    }

    // DEMO MODE Execution:
    const simulation = buildScenarioSimulation(scenarioId, customMessage);
    const initialCase = simulation.initialCase as Case;

    state = {
      ...state,
      isExecuting: true,
      activeScenarioId: scenarioId,
      activeCase: initialCase,
      timeline: [],
      progress: 5,
      statusMessage: 'REQUEST RECEIVED — INITIALIZING AGENTIC INVESTIGATION',
      aiState: 'ANALYZING',
      activeTool: null,
    };
    emitChange();

    let accumulatedDelay = 200;
    const runningEvents: ExecutionEvent[] = [];

    simulation.steps.forEach((step, index) => {
      accumulatedDelay += step.delayMs;
      const timeout = setTimeout(() => {
        runningEvents.push(step.event);
        const isFinal = index === simulation.steps.length - 1;

        const currentCaseState: Case = isFinal
          ? simulation.finalCase
          : {
              ...initialCase,
              status:
                step.aiState === 'RESOLVED'
                  ? 'RESOLVED'
                  : step.aiState === 'ESCALATED'
                  ? 'ESCALATED'
                  : 'INVESTIGATING',
              timeline: [...runningEvents],
            };

        if (isFinal) {
          db.saveCase(simulation.finalCase);
          if (simulation.escalation) {
            db.saveEscalation(simulation.escalation);
          }
        }

        state = {
          ...state,
          aiState: step.aiState,
          activeTool: step.activeTool,
          progress: step.progress,
          statusMessage: step.statusMessage,
          timeline: [...runningEvents],
          activeCase: currentCaseState,
          isExecuting: !isFinal,
        };
        emitChange();
      }, accumulatedDelay);

      activeTimeouts.push(timeout);
    });
  },
};

export function useAppStore(): [AppState, typeof appStore] {
  const current = useSyncExternalStore(appStore.subscribe, appStore.getState, appStore.getState);
  return [current, appStore];
}
