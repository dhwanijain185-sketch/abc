-- ====================================================================
-- RESOLVEAI: AUTONOMOUS CUSTOMER SERVICE TEAMMATE
-- COMPLETE SUPABASE / POSTGRESQL SCHEMA & SEED MIGRATION
-- Track: Autonomous AI Teammates
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CLEANUP PREVIOUS TABLES (IF APPLICABLE)
DROP TABLE IF EXISTS execution_events CASCADE;
DROP TABLE IF EXISTS escalations CASCADE;
DROP TABLE IF EXISTS actions CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- 3. CUSTOMERS TABLE
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    tier TEXT DEFAULT 'standard' CHECK (tier IN ('standard', 'gold', 'platinum', 'enterprise')),
    risk_score NUMERIC DEFAULT 10.0 CHECK (risk_score >= 0 AND risk_score <= 100),
    trust_score NUMERIC DEFAULT 85.0 CHECK (trust_score >= 0 AND trust_score <= 100),
    total_orders INTEGER DEFAULT 0,
    total_spent NUMERIC DEFAULT 0.0,
    lifetime_refunds INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'flagged', 'restricted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_tier ON customers(tier);
CREATE INDEX idx_customers_risk_score ON customers(risk_score);

-- 4. ORDERS TABLE
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    product TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'DELIVERED' CHECK (status IN ('DELIVERED', 'IN_TRANSIT', 'DELAYED', 'DAMAGED', 'RETURNED', 'CANCELLED')),
    payment_status TEXT DEFAULT 'PAID' CHECK (payment_status IN ('PAID', 'REFUNDED', 'DISPUTED', 'PENDING')),
    refund_eligible BOOLEAN DEFAULT false,
    refund_amount NUMERIC DEFAULT 0.0,
    tracking_id TEXT,
    courier TEXT,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    days_delayed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);

-- 5. TICKETS (CASES) TABLE
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    intent TEXT NOT NULL,
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'INVESTIGATING', 'DECIDING', 'EXECUTING', 'VERIFYING', 'RESOLVED', 'ESCALATED', 'FAILED')),
    priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    summary TEXT,
    decision TEXT DEFAULT 'AUTO_RESOLVE' CHECK (decision IN ('AUTO_RESOLVE', 'HUMAN_REVIEW', 'CLARIFICATION')),
    verification_status TEXT DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'FAILED', 'SKIPPED')),
    refund_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_tickets_customer_id ON tickets(customer_id);
CREATE INDEX idx_tickets_order_id ON tickets(order_id);
CREATE INDEX idx_tickets_ticket_number ON tickets(ticket_number);
CREATE INDEX idx_tickets_status ON tickets(status);

-- 6. ACTIONS TABLE (AUDITABLE TOOL EXECUTIONS)
CREATE TABLE actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'EXECUTED', 'VERIFIED', 'FAILED', 'ROLLED_BACK')),
    result JSONB,
    idempotency_key TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_actions_ticket_id ON actions(ticket_id);
CREATE INDEX idx_actions_idempotency ON actions(idempotency_key);

-- 7. ESCALATIONS TABLE (HUMAN SUPERVISOR QUEUE)
CREATE TABLE escalations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    priority TEXT DEFAULT 'HIGH' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    ai_summary TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW', 'ASSIGNED', 'ACKNOWLEDGED', 'RESOLVED', 'INFO_REQUESTED')),
    assigned_to TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_escalations_ticket_id ON escalations(ticket_id);
CREATE INDEX idx_escalations_status ON escalations(status);
CREATE INDEX idx_escalations_priority ON escalations(priority);

-- 8. EXECUTION_EVENTS TABLE (REAL-TIME AGENTIC TIMELINE AUDIT)
CREATE TABLE execution_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    tool_node TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_execution_events_ticket_id ON execution_events(ticket_id);
CREATE INDEX idx_execution_events_created_at ON execution_events(created_at);

-- ====================================================================
-- SEED DATA (20 Customers, 30 Orders, 15 Tickets)
-- CLEARLY LABELED AS: DEMO DATA / SIMULATED ENVIRONMENT
-- ====================================================================

-- Customers
INSERT INTO customers (id, name, email, phone, tier, risk_score, trust_score, total_orders, total_spent, lifetime_refunds, status)
VALUES
('a0000001-0000-0000-0000-000000000001', 'Rahul Sharma', 'rahul.sharma@example.com', '+91 98201 44521', 'platinum', 8, 94, 38, 84950, 1, 'active'),
('a0000001-0000-0000-0000-000000000002', 'Priya Patel', 'priya.patel@example.com', '+91 99341 88912', 'gold', 12, 88, 21, 42100, 0, 'active'),
('a0000001-0000-0000-0000-000000000003', 'Vikram Singhania', 'vikram.singh@example.com', '+91 97112 55309', 'standard', 82, 31, 2, 52000, 2, 'flagged'),
('a0000001-0000-0000-0000-000000000004', 'Ananya Deshmukh', 'ananya.d@example.com', '+91 98450 12903', 'enterprise', 5, 98, 114, 345000, 3, 'active'),
('a0000001-0000-0000-0000-000000000005', 'Rohan Mehra', 'rohan.m@example.com', '+91 91672 90114', 'gold', 18, 82, 15, 29400, 1, 'active'),
('a0000001-0000-0000-0000-000000000006', 'Sneha Verma', 'sneha.v@example.com', '+91 98114 67022', 'platinum', 9, 91, 42, 96000, 0, 'active'),
('a0000001-0000-0000-0000-000000000007', 'Karan Kapoor', 'karan.k@example.com', '+91 99203 11849', 'standard', 45, 62, 6, 14200, 1, 'active'),
('a0000001-0000-0000-0000-000000000008', 'Neha Roy', 'neha.roy@example.com', '+91 98301 77215', 'gold', 14, 86, 19, 38700, 0, 'active'),
('a0000001-0000-0000-0000-000000000009', 'Aditya Kulkarni', 'aditya.k@example.com', '+91 94220 88319', 'standard', 28, 74, 9, 18500, 0, 'active'),
('a0000001-0000-0000-0000-000000000010', 'Meera Nambiar', 'meera.n@example.com', '+91 97441 55602', 'platinum', 6, 95, 51, 128000, 1, 'active'),
('a0000001-0000-0000-0000-000000000011', 'Deepak Joshi', 'deepak.j@example.com', '+91 98230 44911', 'standard', 75, 40, 4, 48000, 2, 'flagged'),
('a0000001-0000-0000-0000-000000000012', 'Kavita Sundaram', 'kavita.s@example.com', '+91 98402 33190', 'gold', 11, 89, 27, 64200, 0, 'active'),
('a0000001-0000-0000-0000-000000000013', 'Tanmay Ghosh', 'tanmay.g@example.com', '+91 98311 90234', 'standard', 22, 78, 11, 22100, 0, 'active'),
('a0000001-0000-0000-0000-000000000014', 'Ritu Choudhury', 'ritu.c@example.com', '+91 98105 88129', 'gold', 15, 85, 24, 51900, 1, 'active'),
('a0000001-0000-0000-0000-000000000015', 'Arjun Bansal', 'arjun.b@example.com', '+91 98710 44299', 'enterprise', 4, 97, 89, 284000, 2, 'active'),
('a0000001-0000-0000-0000-000000000016', 'Pooja Hegde', 'pooja.h@example.com', '+91 99801 22345', 'standard', 33, 71, 8, 16800, 0, 'active'),
('a0000001-0000-0000-0000-000000000017', 'Manish Tiwari', 'manish.t@example.com', '+91 94150 99881', 'gold', 19, 81, 16, 31500, 1, 'active'),
('a0000001-0000-0000-0000-000000000018', 'Swati Sethi', 'swati.s@example.com', '+91 98188 44321', 'platinum', 7, 93, 47, 108500, 1, 'active'),
('a0000001-0000-0000-0000-000000000019', 'Nikhil Rane', 'nikhil.r@example.com', '+91 98219 77610', 'standard', 68, 45, 5, 39000, 1, 'flagged'),
('a0000001-0000-0000-0000-000000000020', 'Aishwarya Rao', 'aishwarya.rao@example.com', '+91 97411 33209', 'gold', 10, 90, 33, 73400, 0, 'active');

-- Orders (30 Orders)
INSERT INTO orders (id, order_number, customer_id, product, amount, status, payment_status, refund_eligible, refund_amount, tracking_id, courier, days_delayed)
VALUES
('b0000001-0000-0000-0000-000000000001', 'ORD8842', 'a0000001-0000-0000-0000-000000000001', 'UltraBass Noise-Cancelling Headphones', 2499, 'DELAYED', 'PAID', true, 2499, 'TRK-BLUEDART-882190', 'BlueDart Air', 6),
('b0000001-0000-0000-0000-000000000002', 'ORD9103', 'a0000001-0000-0000-0000-000000000002', 'SmartFit Gen-4 Fitness Tracker', 3299, 'DAMAGED', 'PAID', true, 3299, 'TRK-DELHIVERY-491022', 'Delhivery Surface', 0),
('b0000001-0000-0000-0000-000000000003', 'ORD7721', 'a0000001-0000-0000-0000-000000000003', 'Titan Apex RTX 4080 Gaming Rig', 50000, 'IN_TRANSIT', 'PAID', false, 50000, 'TRK-EKART-772109', 'Ekart Logistics', 0),
('b0000001-0000-0000-0000-000000000004', 'ORD6610', 'a0000001-0000-0000-0000-000000000004', 'Ergonomic Executive Mesh Chair', 8999, 'DELIVERED', 'PAID', false, 0, 'TRK-BLUEDART-661044', 'BlueDart Express', 0),
('b0000001-0000-0000-0000-000000000005', 'ORD5520', 'a0000001-0000-0000-0000-000000000005', 'Mechanical RGB Gaming Keyboard', 4199, 'DELAYED', 'PAID', true, 4199, 'TRK-SHADOWFAX-552011', 'Shadowfax', 5),
('b0000001-0000-0000-0000-000000000006', 'ORD4430', 'a0000001-0000-0000-0000-000000000006', '4K Ultra-HD Monitor 27"', 18999, 'DELIVERED', 'PAID', false, 0, 'TRK-DELHIVERY-443088', 'Delhivery Surface', 0),
('b0000001-0000-0000-0000-000000000007', 'ORD3340', 'a0000001-0000-0000-0000-000000000007', 'Wireless Qi Charging Dock Pro', 1799, 'DELAYED', 'PAID', true, 1799, 'TRK-XPRESSBEES-334099', 'Xpressbees', 4),
('b0000001-0000-0000-0000-000000000008', 'ORD2250', 'a0000001-0000-0000-0000-000000000008', 'Ceramic Pour-Over Coffee Maker', 1499, 'DELIVERED', 'PAID', true, 1499, 'TRK-BLUEDART-225077', 'BlueDart Air', 0),
('b0000001-0000-0000-0000-000000000009', 'ORD1160', 'a0000001-0000-0000-0000-000000000009', 'Compact PowerBank 20000mAh', 1999, 'DELAYED', 'PAID', true, 1999, 'TRK-EKART-116033', 'Ekart Logistics', 5),
('b0000001-0000-0000-0000-000000000010', 'ORD9970', 'a0000001-0000-0000-0000-000000000010', 'Noise-Cancelling Earbuds TWS', 3499, 'DELIVERED', 'PAID', false, 0, 'TRK-DELHIVERY-997012', 'Delhivery Surface', 0),
('b0000001-0000-0000-0000-000000000011', 'ORD8880', 'a0000001-0000-0000-0000-000000000011', 'Dual Band WiFi 6 Mesh Router', 6999, 'IN_TRANSIT', 'DISPUTED', false, 6999, 'TRK-SHADOWFAX-888055', 'Shadowfax', 0),
('b0000001-0000-0000-0000-000000000012', 'ORD7790', 'a0000001-0000-0000-0000-000000000012', 'HydroFlask Thermal Tumbler 1L', 1850, 'DAMAGED', 'PAID', true, 1850, 'TRK-BLUEDART-779021', 'BlueDart Air', 0),
('b0000001-0000-0000-0000-000000000013', 'ORD6601', 'a0000001-0000-0000-0000-000000000013', 'Studio Condenser Mic Kit', 3899, 'DELIVERED', 'PAID', false, 0, 'TRK-EKART-660189', 'Ekart Logistics', 0),
('b0000001-0000-0000-0000-000000000014', 'ORD5512', 'a0000001-0000-0000-0000-000000000014', 'Smart LED Desk Lamp w/ Wireless Qi', 2299, 'DELAYED', 'PAID', true, 2299, 'TRK-DELHIVERY-551230', 'Delhivery Surface', 4),
('b0000001-0000-0000-0000-000000000015', 'ORD4423', 'a0000001-0000-0000-0000-000000000015', 'Enterprise Barcode Scanner Bluetooth', 12499, 'DELIVERED', 'PAID', false, 0, 'TRK-BLUEDART-442391', 'BlueDart Express', 0),
('b0000001-0000-0000-0000-000000000016', 'ORD3334', 'a0000001-0000-0000-0000-000000000016', 'Aromatherapy Ultrasonic Diffuser', 1199, 'DELIVERED', 'PAID', true, 1199, 'TRK-XPRESSBEES-333412', 'Xpressbees', 0),
('b0000001-0000-0000-0000-000000000017', 'ORD2245', 'a0000001-0000-0000-0000-000000000017', 'Aluminum Vertical Laptop Stand', 1650, 'DELAYED', 'PAID', true, 1650, 'TRK-SHADOWFAX-224580', 'Shadowfax', 5),
('b0000001-0000-0000-0000-000000000018', 'ORD1156', 'a0000001-0000-0000-0000-000000000018', 'Smart Water Bottle Hydration Reminder', 2799, 'DELIVERED', 'PAID', false, 0, 'TRK-DELHIVERY-115699', 'Delhivery Surface', 0),
('b0000001-0000-0000-0000-000000000019', 'ORD9967', 'a0000001-0000-0000-0000-000000000019', 'Flagship Smartphone Pro 256GB', 64999, 'IN_TRANSIT', 'DISPUTED', false, 64999, 'TRK-BLUEDART-996740', 'BlueDart Express', 0),
('b0000001-0000-0000-0000-000000000020', 'ORD8878', 'a0000001-0000-0000-0000-000000000020', 'Handheld Garment Steamer 1200W', 2199, 'DELIVERED', 'PAID', false, 0, 'TRK-EKART-887823', 'Ekart Logistics', 0),
('b0000001-0000-0000-0000-000000000021', 'ORD7789', 'a0000001-0000-0000-0000-000000000001', 'Ultra-Slim Wireless Mouse', 899, 'DELIVERED', 'PAID', false, 0, 'TRK-BLUEDART-778911', 'BlueDart Air', 0),
('b0000001-0000-0000-0000-000000000022', 'ORD6691', 'a0000001-0000-0000-0000-000000000002', 'Silicone Sport Band for Watch', 599, 'DELIVERED', 'PAID', false, 0, 'TRK-DELHIVERY-669123', 'Delhivery Surface', 0),
('b0000001-0000-0000-0000-000000000023', 'ORD5503', 'a0000001-0000-0000-0000-000000000004', 'Under-Desk Cable Management Tray', 1299, 'DELIVERED', 'PAID', false, 0, 'TRK-EKART-550344', 'Ekart Logistics', 0),
('b0000001-0000-0000-0000-000000000024', 'ORD4415', 'a0000001-0000-0000-0000-000000000005', 'PBT Keycaps Double-Shot Set', 1899, 'DELIVERED', 'PAID', false, 0, 'TRK-SHADOWFAX-441512', 'Shadowfax', 0),
('b0000001-0000-0000-0000-000000000025', 'ORD3326', 'a0000001-0000-0000-0000-000000000006', 'Screen LightBar USB Powered', 2999, 'DELIVERED', 'PAID', false, 0, 'TRK-BLUEDART-332678', 'BlueDart Air', 0),
('b0000001-0000-0000-0000-000000000026', 'ORD2237', 'a0000001-0000-0000-0000-000000000008', 'Electric Gooseneck Kettle 800ml', 3499, 'DELIVERED', 'PAID', false, 0, 'TRK-DELHIVERY-223790', 'Delhivery Surface', 0),
('b0000001-0000-0000-0000-000000000027', 'ORD1148', 'a0000001-0000-0000-0000-000000000010', 'Braided Fast Charging Cable 2M', 499, 'DELIVERED', 'PAID', false, 0, 'TRK-XPRESSBEES-114822', 'Xpressbees', 0),
('b0000001-0000-0000-0000-000000000028', 'ORD9959', 'a0000001-0000-0000-0000-000000000012', 'Stainless Steel Insulated Straw Lid', 350, 'DELIVERED', 'PAID', false, 0, 'TRK-EKART-995901', 'Ekart Logistics', 0),
('b0000001-0000-0000-0000-000000000029', 'ORD8861', 'a0000001-0000-0000-0000-000000000015', 'Thermal Receipt Paper Rolls (Pack of 20)', 999, 'DELIVERED', 'PAID', false, 0, 'TRK-BLUEDART-886134', 'BlueDart Express', 0),
('b0000001-0000-0000-0000-000000000030', 'ORD7772', 'a0000001-0000-0000-0000-000000000018', 'Fruit Infuser Water Filter Cap', 450, 'DELIVERED', 'PAID', false, 0, 'TRK-SHADOWFAX-777265', 'Shadowfax', 0);

-- Tickets (15 Tickets)
INSERT INTO tickets (id, ticket_number, customer_id, order_id, intent, status, priority, summary, decision, verification_status, refund_id)
VALUES
('c0000001-0000-0000-0000-000000000001', 'REQ-1024', 'a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'Delayed Order & Refund Request', 'RESOLVED', 'MEDIUM', 'Autonomous refund of ₹2,499 verified via gateway ref REF-PAYTM-99214.', 'AUTO_RESOLVE', 'VERIFIED', 'REF-PAYTM-99214'),
('c0000001-0000-0000-0000-000000000002', 'REQ-1025', 'a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000002', 'Damaged Item Replacement', 'RESOLVED', 'MEDIUM', 'Replacement order ORD-REPL-5510 scheduled for doorstep swap.', 'AUTO_RESOLVE', 'VERIFIED', NULL),
('c0000001-0000-0000-0000-000000000003', 'REQ-1026', 'a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000003', 'Unauthorized Transaction Dispute', 'ESCALATED', 'CRITICAL', 'Transaction amount ₹50,000 exceeds autonomous limit. Suspicious foreign IP.', 'HUMAN_REVIEW', 'SKIPPED', NULL),
('c0000001-0000-0000-0000-000000000004', 'REQ-1027', 'a0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000005', 'Delivery Delay Inquiry', 'RESOLVED', 'MEDIUM', 'Shadowfax hub cleared bottleneck. Out for delivery today.', 'AUTO_RESOLVE', 'VERIFIED', NULL),
('c0000001-0000-0000-0000-000000000005', 'REQ-1028', 'a0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000007', 'Refund Request', 'RESOLVED', 'LOW', 'Autonomous refund ₹1,799 verified under REF-PAYTM-44120.', 'AUTO_RESOLVE', 'VERIFIED', 'REF-PAYTM-44120'),
('c0000001-0000-0000-0000-000000000006', 'REQ-1029', 'a0000001-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000011', 'Payment Dispute', 'ESCALATED', 'HIGH', 'Dispute amount ₹6,999 exceeds auto threshold; high customer risk score.', 'HUMAN_REVIEW', 'SKIPPED', NULL),
('c0000001-0000-0000-0000-000000000007', 'REQ-1030', 'a0000001-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000012', 'Damaged Lid Replacement', 'RESOLVED', 'LOW', 'Replacement order ORD-REPL-6621 dispatched.', 'AUTO_RESOLVE', 'VERIFIED', NULL),
('c0000001-0000-0000-0000-000000000008', 'REQ-1031', 'a0000001-0000-0000-0000-000000000014', 'b0000001-0000-0000-0000-000000000014', 'Refund on Delayed Lamp', 'RESOLVED', 'MEDIUM', 'Autonomous refund ₹2,299 verified under REF-PAYTM-88210.', 'AUTO_RESOLVE', 'VERIFIED', 'REF-PAYTM-88210'),
('c0000001-0000-0000-0000-000000000009', 'REQ-1032', 'a0000001-0000-0000-0000-000000000017', 'b0000001-0000-0000-0000-000000000017', 'Delayed Package Refund', 'RESOLVED', 'LOW', 'Autonomous refund ₹1,650 verified under REF-PAYTM-11239.', 'AUTO_RESOLVE', 'VERIFIED', 'REF-PAYTM-11239'),
('c0000001-0000-0000-0000-000000000010', 'REQ-1033', 'a0000001-0000-0000-0000-000000000019', 'b0000001-0000-0000-0000-000000000019', 'Chargeback / Unrecognized Order', 'ESCALATED', 'CRITICAL', 'Fraudulent chargeback attempt ₹64,999 flagged in transit.', 'HUMAN_REVIEW', 'SKIPPED', NULL),
('c0000001-0000-0000-0000-000000000011', 'REQ-1034', 'a0000001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000009', 'Refund on PowerBank', 'RESOLVED', 'LOW', 'Autonomous refund ₹1,999 verified under REF-PAYTM-67123.', 'AUTO_RESOLVE', 'VERIFIED', 'REF-PAYTM-67123'),
('c0000001-0000-0000-0000-000000000012', 'REQ-1035', 'a0000001-0000-0000-0000-000000000016', 'b0000001-0000-0000-0000-000000000016', 'Missing Aroma Oil Bottle', 'RESOLVED', 'LOW', 'Wallet credit courtesy ₹250 issued under REF-WALLET-4410.', 'AUTO_RESOLVE', 'VERIFIED', 'REF-WALLET-4410'),
('c0000001-0000-0000-0000-000000000013', 'REQ-1036', 'a0000001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000025', 'Screen LightBar Firmware Inquiry', 'RESOLVED', 'LOW', 'Autonomous dispatch of technical calibration manual.', 'AUTO_RESOLVE', 'VERIFIED', NULL),
('c0000001-0000-0000-0000-000000000014', 'REQ-1037', 'a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000004', 'Bulk VAT Invoice Correction', 'RESOLVED', 'MEDIUM', 'Regenerated GST tax invoice in ERP and emailed customer.', 'AUTO_RESOLVE', 'VERIFIED', NULL),
('c0000001-0000-0000-0000-000000000015', 'REQ-1038', 'a0000001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000026', 'Kettle Calibration Guidance', 'RESOLVED', 'LOW', 'Provided auto-calibrated temperature settings guide.', 'AUTO_RESOLVE', 'VERIFIED', NULL);

-- Escalations Seed
INSERT INTO escalations (id, ticket_id, reason, priority, ai_summary, recommended_action, status, assigned_to)
VALUES
('d0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000003', 'Autonomous policy limit exceeded (₹50,000 > ₹5,000) and elevated fraud risk probability (82/100).', 'CRITICAL', 'Customer claims unauthorized charge on RTX 4080 Gaming Rig. Order amount (₹50,000) exceeds threshold. Suspicious proxy geofence variance detected.', 'Hold shipment with courier dispatch hub immediately, initiate two-factor voice callback to cardholder.', 'PENDING_REVIEW', NULL),
('d0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000006', 'Frequent dispute pattern detected + transaction value above auto threshold.', 'HIGH', 'Customer dispute on WiFi Router (₹6,999). Amount is above ₹5,000 limit. Customer previously filed 2 refund requests within 30 days. Risk score 75/100.', 'Review previous return photographic records and confirm serial number delivery receipt with Shadowfax.', 'ASSIGNED', 'Anil Mehta (Senior Risk Analyst)'),
('d0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000010', 'Chargeback advisory received from Visa network with pending delivery.', 'CRITICAL', 'Customer filed fraud report for Flagship Smartphone purchase. Order is currently in transit with BlueDart Express. Automatic halt on dispatch advised.', 'Issue emergency courier recall to return unit to central warehouse and prevent inventory loss.', 'ACKNOWLEDGED', 'Sunita Rao (Fraud Operations Lead)');
