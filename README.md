# RESOLVEAI — Autonomous Customer Service Teammate

> **"From Customer Request to Verified Resolution — Autonomously."**  
> *Built for the AI Hackathon track: "Autonomous AI Teammates — Build AI teammates that don't just respond; they get the job done."*

---

## 🌟 The Product Difference: Not a Chatbot
Most AI customer service applications are conversational chatbots: they answer questions, generate text apologies, or point users to static help articles. 

**ResolveAI is an Autonomous AI Teammate operating a digital customer service environment.**  
It performs the complete enterprise operational loop:
$$\text{UNDERSTAND} \longrightarrow \text{INVESTIGATE} \longrightarrow \text{REASON} \longrightarrow \text{DECIDE} \longrightarrow \text{ACT} \longrightarrow \text{VERIFY} \longrightarrow \text{COMMUNICATE} \longrightarrow \text{ESCALATE}$$

- **Autonomous Actions**: Initiates payment refunds, provisions replacement orders, generates courier reverse-pickup dockets.
- **Deterministic Policy Validation**: The AI may reason, but deterministic code guardrails enforce safety boundaries (e.g. ₹5,000 auto-refund cap, SLA delay verification).
- **Mandatory Verification**: Never reports success until the banking gateway or ERP confirms ledger settlement.
- **Safe Human Escalation**: Automatically halts and packages a diagnostic brief when high risk or fraud anomalies are detected.

---

## 🚀 Key Features

1. **Interactive 3D AI Core (`<AIOrbitalCore />`)**:
   - Built with **React Three Fiber**, **Three.js**, and **@react-three/drei**.
   - Features central translucent sphere, inner energy core, 3 gyroscopic orbital rings, 60 ambient particles, and 8 symmetrical tool nodes (`CRM`, `ORDERS`, `PAYMENTS`, `REFUNDS`, `TICKETS`, `NOTIFICATIONS`, `ANALYTICS`, `HUMAN`).
   - Dynamic curved Bezier data streams and travelling light packets.
   - 10 reactive visual states (`IDLE`, `ANALYZING`, `SEARCHING`, `REASONING`, `DECIDING`, `EXECUTING`, `VERIFYING`, `RESOLVED`, `ESCALATED`, `ERROR`).
   - Subtle mouse-parallax camera controller and graceful WebGL fallback.

2. **Live Execution Timeline**:
   - Streaming audit trail displaying real-time events with millisecond precision, status badges, and tool tags.

3. **Dual Runtime Engine**:
   - **DEMO MODE**: Self-contained, zero-dependency simulated environment executing the exact 10-step agentic sequence offline.
   - **LIVE MODE**: Connects directly to external n8n automation webhooks (`NEXT_PUBLIC_N8N_WEBHOOK_URL`).

4. **Human Escalation Command Center (`/escalations`)**:
   - Dedicated supervisor queue with priority sorting (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
   - 1-click triage actions: *Assign to Me*, *Acknowledge*, *Approve & Resolve*, *Request Information* with real database persistence.

5. **Autonomy Performance Analytics (`/analytics`)**:
   - Recharts-powered telemetry tracking daily case volume, autonomous vs. human resolution split, intent breakdown, and average resolution time (12.4s).

6. **All 7 Enterprise Pages**:
   - `/dashboard`: Operations Command Center
   - `/cases`: Searchable case registry
   - `/cases/[id]`: Deep audit log & Digital Verification Certificate
   - `/customers`: Customer 360 directory with trust & risk scoring
   - `/analytics`: Autonomy performance telemetry
   - `/escalations`: Human supervisor triage console
   - `/settings`: Dual mode toggle, webhook ping, and policy threshold sliders

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Vanilla CSS, Glassmorphism
- **3D Graphics**: Three.js, React Three Fiber, @react-three/drei
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend / Database**: Supabase (PostgreSQL schema & seed migrations provided)
- **Automation**: n8n Webhook Architecture (exportable JSON included)

---

## ⚙️ Quickstart & Local Development

### 1. Prerequisites
- Node.js 18+ (tested on v24)
- npm 9+

### 2. Installation
```bash
# Clone or navigate to the workspace
cd "d:/paytm ai"

# Install dependencies
npm install --legacy-peer-deps
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The app will automatically redirect to `/dashboard`.

---

## 🧪 Running Hackathon Demo Scenarios

In the top navigation, click **RUN DEMO** or choose any scenario button in the request panel:

1. **Scenario 1: Delayed Order $\rightarrow$ Refund**:
   - Customer: Rahul Sharma (`CUST-1001`)
   - Order: `ORD8842` (UltraBass Headphones, ₹2,499)
   - Flow: Detects 6-day delay past SLA $\rightarrow$ Evaluates policy $\rightarrow$ Issues ₹2,499 refund $\rightarrow$ Verifies gateway ref `REF-PAYTM-99214` $\rightarrow$ Resolves case.

2. **Scenario 2: Damaged Product $\rightarrow$ Doorstep Replacement**:
   - Customer: Priya Patel (`CUST-1002`)
   - Order: `ORD9103` (Fitness Tracker, ₹3,299)
   - Flow: Checks 7-day warranty $\rightarrow$ Checks warehouse stock $\rightarrow$ Creates replacement order `ORD-REPL-5510` $\rightarrow$ Schedules reverse courier pickup docket.

3. **Scenario 3: High-Risk Security Dispute $\rightarrow$ Human Escalation**:
   - Customer: Vikram Singhania (`CUST-1003`)
   - Order: `ORD7721` (Gaming Rig, ₹50,000)
   - Flow: Amount exceeds ₹5,000 auto limit + foreign IP proxy detected $\rightarrow$ AI Core shifts to crimson `HUMAN` node $\rightarrow$ Restricts financial payout $\rightarrow$ Hands off to `/escalations` queue.

---

## 🔌 Environment Variables

Create `.env.local` in the root directory:

```env
# Optional: External n8n Webhook URL (leave blank for local Demo Mode)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n.cloud/webhook/resolveai/customer-request

# Optional: Supabase credentials (in-memory/localStorage fallback active by default)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

*Note: No secret API keys are ever needed on the frontend.*

---

## 📁 Detailed Documentation
- [Architecture Deep Dive](docs/architecture.md)
- [n8n Workflow Specification & Ready JSON](docs/n8n-workflow.md)
- [Hackathon Presentation Demo Script](docs/demo-script.md)
- [Supabase SQL Migration Schema](supabase/schema.sql)
