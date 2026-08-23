# MASTER BUILD PROMPT & TECHNICAL SPECIFICATION
## Kisan Jod: Direct Agricultural Aggregation & B2B Procurement Platform
**Smart India Hackathon (SIH) Prototype Specification**

---

### Executive Overview
**Kisan Jod** is a unified, multi-persona B2B agricultural aggregation and procurement ecosystem. It bridges individual smallholder farmers with large-scale industrial buyers (food processing industries, textile mills, biofuel plants, retail chains), supported by verified field agents and logistics partners under centralized platform governance.

---

### 1. Unified Ecosystem Architecture

The platform operates on a single shared data backbone connecting five core operational personas:

```
                  ┌─────────────────────────────────────────┐
                  │          Kisan Jod Platform             │
                  └────────────────────┬────────────────────┘
                                       │
      ┌──────────────────┬─────────────┼─────────────┬──────────────────┐
      │                  │             │             │                  │
┌─────▼──────┐    ┌──────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐    ┌──────▼──────┐
│🌾 Farmer   │    │🏢 Industrial│ │👨‍🌾 Field   │ │🚚 Freight   │    │👑 Platform  │
│Application │    │  Buyer App  │ │Agent App │ │Logistics App│    │ Admin App   │
└────────────┘    └─────────────┘ └──────────┘ └─────────────┘    └─────────────┘
```

---

### 2. Detailed Persona Specifications

#### 🌾 Persona 1: Farmer Application (`/farmer`)
* **Primary Objective**: Empower smallholder farmers to register produce, access fair pricing, sell agricultural waste, and receive direct buyer advances.
* **Key Features**:
  1. **Voice Assistant & Accessibility**: Multi-language text-to-speech reader banner and AI voice assistant modal for non-literate farmers.
  2. **My Crops Module**: Register crop produce (Tomato, Wheat, Potato, Cotton, Paddy) with Grade A/B classification, quantity in kg, harvest date, and matched buyer demand.
  3. **Agricultural Waste Value Recovery**: List parali (stubble), crop residue, cow dung, and sugarcane bagasse for biofuel and paper mills.
  4. **Women Rural Enterprises**: Showcase handcrafted products (pickles, papad, handloom textiles) produced by women self-help groups (SHGs).
  5. **Paycheck & Financial Ledger**: Milestone buyer advances (30% upfront on weighbridge intake, 70% post-QC verification).
  6. **Helpline & Complaint Registration**: Toll-free support and grievance reporting modal.

#### 🏢 Persona 2: Industrial Buyer / Company Portal (`/company`)
* **Primary Objective**: Allow food processors, biofuel plants, and retail aggregators to post bulk crop demands and procure verified supply.
* **Key Features**:
  1. **Bulk Requirement Posting**: Create demand orders (Crop Name, Required Quantity in Tons/Kg, Target Price/Kg, Grade Requirement, Delivery Deadline).
  2. **Fair Price Intelligence Engine**: View 12-factor benchmark price recommendations (Mandi reference, operational logistics, market surge index) to set competitive prices.
  3. **Fulfillment Tracking**: Monitor incoming supply progress bars (% filled from aggregated farmer registrations).
  4. **Active Orders & Escrow**: Manage order status, wire receipts, and milestone payouts to farmers.

#### 👨‍🌾 Persona 3: Field Agent / Middleman Onboarding Desk (`/field-agent`)
* **Primary Objective**: Provide on-ground verification, farmer onboarding, and weighbridge scale certification.
* **Key Features**:
  1. **Agent Registration**: Onboard new field agents with full name, phone, region, assigned storage facility, Aadhaar verification, and bank details.
  2. **Farmer Onboarding Roster**: Register new local farmers and view referral commission earnings.
  3. **Collection Checkpoint Verification**: Inspect crop quality grade, certify weighbridge scale receipts, and log intake evidence.
  4. **Task SLA Monitoring**: Track task completion percentages and SLA performance scores.

#### 🚚 Persona 4: Freight Logistics & Warehouses Portal (`/logistics`)
* **Primary Objective**: Manage regional storage facilities and 3rd-party freight transport fleets.
* **Key Features**:
  1. **Carrier & Vehicle Registration**: Register 3rd-party logistics companies (Company Name, Fleet Manager, Vehicle Type, License Plate, Driver Name, Payout Account).
  2. **Warehouse Facility Overview**: Monitor storage capacity utilization %, grain silos, cold storage units, and biomass depots.
  3. **Stock Batch Lifecycle**: Track stock states (*Incoming, Current, Reserved, Available, Outgoing*) and batch expiry alerts.
  4. **Freight Transit Payouts**: Calculate mileage settlements and track delivery audit trails.

#### 👑 Persona 5: Platform Operations / Executive Admin Portal (`/admin`)
* **Primary Objective**: System-level governance, dynamic pricing oversight, financial ledger monitoring, and dispute resolution.
* **Theme Specification**: **Executive Warm Light Theme** (`bg-gradient-to-b from-slate-50 via-amber-50/20 to-orange-50/30`, crisp white cards, dark typography).
* **Key Modules**:
  1. **Executive Dashboard**: System KPIs (Active Farmers, Active Buyer Demands, Platform Gross Merchandise Value, Net Operating Result).
  2. **Farmer & Company Directories**: Searchable tables with dynamic 90-day inactivity evaluation rules.
  3. **Order Lifecycle & Unit Economics**: 13-stage visual progression timeline and profit margin breakdown.
  4. **Transparent Price Override Audit**: Inspect 12 pricing factors and log admin override reasons with timestamped audit trails.
  5. **Unified Dispute Desk**: 4-checkpoint side-by-side chain of custody evidence comparison (Farmer Dispatch, Field Collection, Warehouse Intake, Buyer Unloading) and liability assignment.
  6. **Risk Anomaly Alerts**: Anomaly detection for price spikes, quality disputes, and inventory deficits.

---

### 3. Technical & Deployment Requirements

1. **Unified Single Server Architecture**:
   - Runs cleanly on a single local port (`http://localhost:5173`) or configured multi-port routes.
   - Built with **React 19**, **Vite 6**, **TypeScript**, and **Tailwind CSS v4**.
2. **Mobile Responsiveness**:
   - 100% responsive across mobile, tablet, and desktop screens.
   - Touch-friendly action buttons for mobile testing via local Wi-Fi network (`http://<IP-address>:5173`).
3. **Accessibility & i18n**:
   - Built-in English and Hindi translation engine (`translations.ts`).
   - Accessible hover/touch text reader mode for non-literate rural users.
4. **Data Persistence**:
   - Shared client-side context providers (`AppContext`, `CompanyContext`, `AdminContext`) synced with `localStorage`.
