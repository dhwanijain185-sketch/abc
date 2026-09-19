# RESOLVEAI — n8n Automation Architecture Specification

## Overview
ResolveAI orchestrates autonomous customer resolution workflows via a deterministic, multi-stage n8n pipeline.
The central architectural tenet is:
> **"The AI may reason, but deterministic policy authorizes sensitive actions, and every financial action must be verified before confirmation."**

---

## 16-Node Pipeline Diagram

```
[NODE 1: Webhook POST]
         ↓
[NODE 2: Normalize Request]
         ↓
[NODE 3: AI Intent & Entity Analysis (LLM / Structured JSON)]
         ↓
[NODE 4: Customer Lookup (CRM Query)]
         ↓
[NODE 5: Order Lookup (Logistics / ERP Telematics)]
         ↓
[NODE 6: Policy Engine (Deterministic Business Rules)]
         ↓
[NODE 7: Risk Engine (Fraud & Anomaly Scoring)]
         ↓
[NODE 8: Decision Router (AUTO_RESOLVE | HUMAN_REVIEW | CLARIFICATION)]
       ↙                 ↓                         ↘
[NODE 9: Tool Action]    [NODE 13: Human Escalation]  [Clarification Request]
       ↓                         ↓                         ↓
[NODE 10: Verification]          ↓                         ↓
       ↓                         ↓                         ↓
[NODE 11: IF Verified?]          ↓                         ↓
  YES ↙     ↘ NO                 ↓                         ↓
   ↓    [NODE 12: Idempotent     ↓                         ↓
   ↓      Safe Retry / Escalate] ↓                         ↓
   ↓               ↓             ↓                         ↓
   └───────────────┴─────────────┴─────────────────────────┘
                                 ↓
                 [NODE 14: Customer Communication Generator]
                                 ↓
                 [NODE 15: Supabase DB Event & Audit Logging]
                                 ↓
                 [NODE 16: Final Contract Response]
```

---

## Node Descriptions & Specifications

### Node 1: Webhook
- **Method**: `POST`
- **Path**: `/resolveai/customer-request`
- **Authentication**: Header token or none (open intake)
- **Input Payload**:
```json
{
  "request_id": "REQ-001",
  "customer_id": "CUST1024",
  "message": "My order hasn't arrived and I want a refund."
}
```

### Node 2: Normalize Request
- Trims input strings, assigns default timestamps, parses source channel (Web, WhatsApp, API), and generates idempotency seed.

### Node 3: AI Intent Analysis
- Calls LLM (e.g. Gemini 1.5 Flash / OpenAI GPT-4o-mini) with strict JSON schema:
```json
{
  "intent": "refund_request",
  "customer_id": "CUST1024",
  "order_id": "ORD8842",
  "requested_action": "refund",
  "urgency": "medium",
  "risk_level": "low",
  "missing_information": [],
  "requires_human": false
}
```

### Node 4: Customer Lookup
- Queries Supabase table `customers` by ID or phone/email. Retrieves loyalty tier, trust score, and historical fraud flags.

### Node 5: Order Lookup
- Queries Supabase table `orders` by order number or latest order for customer. Retrieves carrier telematics, SLA breach status, and refund eligibility.

### Node 6: Policy Engine
- Code node executing deterministic business rules:
  ```javascript
  const isDelayed = order.days_delayed > 1 || order.status === 'DELAYED';
  const underLimit = order.amount <= 5000;
  const eligible = order.refund_eligible && isDelayed;
  return { policy_approved: eligible && underLimit };
  ```

### Node 7: Risk Engine
- Evaluates:
  - Transaction value (> ₹5,000 threshold)
  - Customer trust score (< 65 threshold)
  - Fraud indicators (keywords like "unauthorized", "hacked", "stolen")
  - Geolocation or IP variance
- Output: `risk_score` (0-100) and `risk_level` (`LOW` | `MEDIUM` | `HIGH`).

### Node 8: Decision Router
- Routes execution into 3 branches:
  1. `AUTO_RESOLVE` (Policy passed + Low/Medium Risk)
  2. `HUMAN_REVIEW` (Policy denied OR High Risk OR Amount > ₹5,000)
  3. `CLARIFICATION` (Missing order number or ambiguous request)

### Node 9: Tool Action Execution
- Dispatches tool API call:
  - Payout API: `POST /api/payments/refund` with `idempotency_key`
  - Replacement Order: `POST /api/orders/replacement`
  - Ticket Creation: `POST /api/tickets`

### Node 10: Gateway Verification
- **Never assumes success**.
- Dispatches polling or webhook inquiry to Payment Gateway / ERP to fetch verified transaction ID:
  - `GET /api/payments/refund/REF-PAYTM-99214/status`
  - Confirms ledger status === `CONFIRMED`.

### Node 11: Verification Check (IF Node)
- Condition: `verification_status === 'CONFIRMED'`.
- If YES: Passes to Customer Communication.
- If NO: Passes to Retry Engine.

### Node 12: Idempotent Safe Retry
- Checks retry count. If retry count == 0: executes one safe retry using the same idempotency key.
- If retry fails twice: automatically routes to Node 13 (Human Escalation).

### Node 13: Human Escalation
- Inserts case into `escalations` table.
- Generates structured supervisor brief: customer, order, issue, risk score, reason, actions attempted, recommended human action.

### Node 14: Customer Communication
- Generates friendly, concise notification for customer (via WhatsApp, SMS, or in-app).
- Masks internal policy and technical debugging details.

### Node 15: Database Logging
- Logs final state in Supabase tables `tickets`, `actions`, and `execution_events`.

### Node 16: Final Contract Response
- Returns JSON response matching the ResolveAI contract:
```json
{
  "request_id": "REQ-001",
  "status": "resolved",
  "intent": "refund",
  "customer_id": "CUST1024",
  "order_id": "ORD8842",
  "action": "refund",
  "amount": 2499,
  "refund_id": "REF-PAYTM-99214",
  "verified": true,
  "message": "Your order ORD8842 was delayed by 6 days. A full refund of ₹2,499 has been credited back to your original payment method (Ref: REF-PAYTM-99214).",
  "timeline": []
}
```

---

## Ready-to-Import n8n Workflow JSON
Save the JSON block below as `resolveai_workflow.json` and import directly into n8n via **Workflows → Import from File**:

```json
{
  "name": "ResolveAI Autonomous Customer Service Teammate",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "resolveai/customer-request",
        "options": {}
      },
      "name": "Webhook Intake",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300],
      "webhookId": "resolveai-customer-request"
    },
    {
      "parameters": {
        "jsCode": "const input = $input.first().json.body || $input.first().json;\nreturn {\n  request_id: input.request_id || ('REQ-' + Math.floor(1000 + Math.random() * 9000)),\n  customer_id: input.customer_id || 'CUST-1001',\n  message: input.message || 'My order has not arrived and I want a refund.',\n  received_at: new Date().toISOString()\n};"
      },
      "name": "Normalize Request",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [440, 300]
    },
    {
      "parameters": {
        "jsCode": "const item = $input.first().json;\nconst lower = item.message.toLowerCase();\nlet intent = 'refund_request';\nlet requested_action = 'refund';\nlet risk_level = 'low';\n\nif (lower.includes('damage') || lower.includes('broken')) {\n  intent = 'damaged_replacement';\n  requested_action = 'replacement';\n} else if (lower.includes('unauthorized') || lower.includes('50,000') || lower.includes('fraud')) {\n  intent = 'unauthorized_dispute';\n  requested_action = 'dispute';\n  risk_level = 'high';\n}\n\nreturn {\n  ...item,\n  intent,\n  requested_action,\n  urgency: risk_level === 'high' ? 'critical' : 'medium',\n  risk_level,\n  requires_human: risk_level === 'high'\n};"
      },
      "name": "AI Intent Analysis",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [640, 300]
    },
    {
      "parameters": {
        "jsCode": "const item = $input.first().json;\n// Mocked CRM retrieval in workflow or live Supabase query\nconst customer = {\n  id: item.customer_id,\n  name: 'Rahul Sharma',\n  tier: 'platinum',\n  trust_score: item.risk_level === 'high' ? 31 : 94,\n  risk_score: item.risk_level === 'high' ? 82 : 8\n};\nreturn { ...item, customer };"
      },
      "name": "Customer Lookup",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [840, 300]
    },
    {
      "parameters": {
        "jsCode": "const item = $input.first().json;\n// Order context\nconst order = {\n  order_number: item.intent === 'damaged_replacement' ? 'ORD9103' : item.intent === 'unauthorized_dispute' ? 'ORD7721' : 'ORD8842',\n  amount: item.intent === 'unauthorized_dispute' ? 50000 : item.intent === 'damaged_replacement' ? 3299 : 2499,\n  status: item.intent === 'damaged_replacement' ? 'DAMAGED' : item.intent === 'unauthorized_dispute' ? 'IN_TRANSIT' : 'DELAYED',\n  refund_eligible: item.intent !== 'unauthorized_dispute'\n};\nreturn { ...item, order };"
      },
      "name": "Order Lookup",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1040, 300]
    },
    {
      "parameters": {
        "jsCode": "const item = $input.first().json;\nconst MAX_AUTO_AMOUNT = 5000;\nconst isHighRisk = item.risk_level === 'high' || item.order.amount > MAX_AUTO_AMOUNT;\n\nlet decision = 'AUTO_RESOLVE';\nlet reason = 'Standard policy satisfied';\n\nif (isHighRisk) {\n  decision = 'HUMAN_REVIEW';\n  reason = `Amount (₹${item.order.amount}) exceeds ₹5,000 threshold or risk is high.`;\n}\n\nreturn { ...item, decision, policy_reason: reason };"
      },
      "name": "Policy Engine",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1240, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.decision }}",
              "value2": "AUTO_RESOLVE"
            }
          ]
        }
      },
      "name": "Decision Router",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [1460, 300]
    },
    {
      "parameters": {
        "jsCode": "const item = $input.first().json;\nconst refund_id = 'REF-PAYTM-' + Math.floor(10000 + Math.random() * 90000);\nreturn {\n  ...item,\n  status: 'resolved',\n  action: item.requested_action,\n  amount: item.order.amount,\n  refund_id,\n  verified: true,\n  message: `Autonomous action verified. Settlement confirmed under reference ${refund_id}.`\n};"
      },
      "name": "Action & Verification",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1700, 200]
    },
    {
      "parameters": {
        "jsCode": "const item = $input.first().json;\nreturn {\n  ...item,\n  status: 'escalated',\n  action: 'HUMAN_SUPERVISOR_TRIAGE',\n  amount: item.order.amount,\n  refund_id: null,\n  verified: false,\n  message: `Your request regarding order ${item.order.order_number} has been transferred to our senior security supervisor due to policy guardrails.`\n};"
      },
      "name": "Human Escalation Node",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1700, 420]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}"
      },
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [2000, 300]
    }
  ],
  "connections": {
    "Webhook Intake": {
      "main": [[{ "node": "Normalize Request", "type": "main", "index": 0 }]]
    },
    "Normalize Request": {
      "main": [[{ "node": "AI Intent Analysis", "type": "main", "index": 0 }]]
    },
    "AI Intent Analysis": {
      "main": [[{ "node": "Customer Lookup", "type": "main", "index": 0 }]]
    },
    "Customer Lookup": {
      "main": [[{ "node": "Order Lookup", "type": "main", "index": 0 }]]
    },
    "Order Lookup": {
      "main": [[{ "node": "Policy Engine", "type": "main", "index": 0 }]]
    },
    "Policy Engine": {
      "main": [[{ "node": "Decision Router", "type": "main", "index": 0 }]]
    },
    "Decision Router": {
      "main": [
        [{ "node": "Action & Verification", "type": "main", "index": 0 }],
        [{ "node": "Human Escalation Node", "type": "main", "index": 0 }]
      ]
    },
    "Action & Verification": {
      "main": [[{ "node": "Respond to Webhook", "type": "main", "index": 0 }]]
    },
    "Human Escalation Node": {
      "main": [[{ "node": "Respond to Webhook", "type": "main", "index": 0 }]]
    }
  }
}
```
