# Kisan Jod Platform — Complete Technical Handover & Platform Architecture
**Document Generated:** August 21, 2026  
**Project Workspace:** `E:\KISAN JOD 1`  
**Status:** All 3 Portals (Farmer, Industrial Buyer / Company, Admin Operations) fully built, styled, integrated, and verified with zero build errors.

---

## 🏛️ Platform Architecture & Shared Data Concept

The application connects three primary user personas consuming a single, unified underlying data model:
1. **Farmer Portal** (`FarmerPortal.tsx`)
2. **Industrial Buyer / Company Portal** (`CompanyPortalLayout.tsx`)
3. **Admin / Platform Operations Portal** (`AdminPortalLayout.tsx`)

Global persona switching (`localStorage.getItem('kisan_persona')`) allows seamless switching between 🌾 Farmer Portal, 🏢 Company Portal, and 👑 Admin Operations Portal.

---

## 🌾 1. Farmer Side Portal (100% Preserved & Completed)

* **Design & Aesthetics**:
  - Soft, aesthetic agricultural background (`bg-gradient-to-b from-amber-50/60 via-emerald-50/40 to-green-50/50`).
  - Dark, high-contrast typography (`text-slate-900`, `text-emerald-950`, `text-slate-700`).
  - Subtitle text color set to `#000000` (`text-black`).
* **Key Features**:
  - **Allocated Pricing Display**: Platform/buyer allocated prices displayed (`Allocated Price: ₹X/kg`).
  - **Waste Market (कचरा मार्केट)**: Marketplace for crop residue, parali stubble, and organic cow dung.
  - **Top-Right Notification Drawer**: Pickup notifications, payment credits, and demand matches.
  - **Bottom Complaint Button**: Ticket generation (`CMP-2026-9812`) with 2-hour callback commitment.

---

## 🏢 2. Industrial Buyer / Company Portal (Completed)

* **Design & Layout**:
  - Executive light corporate palette (`bg-gradient-to-b from-slate-50 via-blue-50/40 to-indigo-50/30`), 1600px widescreen layout (`max-w-[1600px]`), generous separation gap (`gap-10 lg:gap-12`).
* **Key Features**:
  - **Catchy Executive Dashboard (`CompanyDashboard.tsx`)**: Live pulse indicator, stat ticker badges, quick action buttons, performance metrics, and revertible view mode toggle (*Catchy Executive View* vs *Classic View*).
  - **Demand Entry (`CompanyDemandEntry.tsx`)**: Dual category selector (*Fresh Produce* vs *Agri Waste & Biomass*) with **Forced Price Range Validation**.
  - **Fair Procurement Price Engine (`CompanyFairPriceEngine.tsx`)**: Multi-factor fair price range algorithm (`₹17.50 – ₹19.00 / kg`).
  - **Profit / Cost Comparison (`CompanyProfitComparison.tsx`)**: Interactive traditional mandi vs direct platform cost comparison.
  - **Incoming Quality (`CompanyIncomingQuality.tsx`)**: AI Quality Star Ratings (`4.5 / 5.0`) & Grade A/B/C attributes.
  - **Receipts & Invoices (`CompanyReceipts.tsx` & `CompanyReceiptModal.tsx`)**: Separate line items for Produce Cost, Transport Pass-through, Handling, and Platform Fees.
  - **Order Tracking (`CompanyOrderTracking.tsx`)**: Visual shipment journey stage tracker & fleet logistics details.
  - **Pay Portal & Escrow (`CompanyPaymentPortal.tsx`)**: Kisan Jod official bank wire details & UTR proof submission.
  - **Support & Complaints (`CompanyComplaintModal.tsx`)**: 24/7 Corporate escalation desk.

---

## 👑 3. Admin / Platform Operations Portal (Newly Built)

* **Design Language**:
  - Command-Center Enterprise theme (`bg-slate-950 text-slate-100 font-sans`), 1600px widescreen shell (`max-w-[1600px]`), collapsible/expandable sidebar (`lg:w-72`).
* **Global Header (`AdminTopNav.tsx`)**:
  - App Logo, Admin Control Center badge, Global Entity Search (`⌘K`), Persona Switcher (Admin / Company / Farmer), System Alert Bell drawer, Light/Dark theme toggle, Language selector, Admin Profile trigger, Logout modal.
* **Persistent Sidebar (`AdminSidebar.tsx`)**:
  - Collapsible/expandable sidebar hosting all 18 required operational modules:

### 📍 Admin Functional Modules Breakdown

1. **Dashboard (`AdminDashboard.tsx`)**:
   - System-wide KPI cards, financial summary (Gross Revenue, Farmer Payouts, Freight Costs, Net Operating Result), operational pipeline status, high-risk alert callouts, and activity event log stream.
2. **Farmer Management (`AdminFarmerManagement.tsx`)**:
   - Searchable/filterable directory. Evaluates farmer status dynamically using a configurable **90-Day Inactivity Rule** (`lastActivityDate`). Farmer detail profile modal.
3. **Company Management (`AdminCompanyManagement.tsx`)**:
   - Searchable/filterable corporate table, branch/executive head info, active demand counts, cumulative purchase values.
4. **Field Agent Management (`AdminFieldAgentManagement.tsx`)**:
   - Uses shared Field Agent IDs (`AGT-101`), task completion SLAs (%), farmer onboarding referral earnings, performance trend review. Policy notice against automatic removal on single low rating.
5. **Order Management & Timeline (`AdminOrderManagement.tsx`)**:
   - Ascending Order ID default sort. 13-stage visual timeline (`Demand Created` → `Supply Matched` → `Collection` → `Intake` → `Quality Check` → `Reserved` → `Logistics` → `Dispatched` → `In Transit` → `Delivered` → `Final Settlement`). Order Profit & Unit Economics breakdown.
6. **Inventory & Warehouses (`AdminInventoryWarehouse.tsx`)**:
   - Storage facilities (Cold storage, grain silos, biomass depots), utilization %, manager contacts, stock states (Incoming, Current, Reserved, Available, Outgoing), batch intake dates & shelf life.
7. **Crop Availability & Price Management (`AdminCropAvailability.tsx`)**:
   - Produce pools, Agri Waste (Parali stubble, cow dung), Women Enterprise products. Transparent 12-factor price approval & audit override form (`overrideCropPrice`).
8. **Price Intelligence Engine (`AdminPriceIntelligence.tsx`)**:
   - Algorithmic fair price range recommendation (`₹17.50 – ₹19.00 / kg`), confidence score (94.8%), factor weights breakdown.
9. **AI Prediction Performance (`AdminAIPredictions.tsx`)**:
   - Prediction vs actual transaction variance monitoring (Mean Absolute Error 2.1%).
10. **Demand Analytics (`AdminDemandAnalytics.tsx`)**:
    - Crop-wise, company-wise & grade-wise demand distribution.
11. **Demand-Supply Matching (`AdminDemandMatching.tsx`)**:
    - Matching intelligence engine evaluating Product, Qty, Quality, Location, Price & Reliability (Match Score 87%).
12. **Demand Forecasting (`AdminDemandForecasting.tsx`)**:
    - Upcoming regional demand surge projections & confidence horizons.
13. **Logistics Payments (`AdminLogisticsPayments.tsx`)**:
    - Freight partner settlements, delivery audit trail & mileage pass-throughs.
14. **Finance Portal (`AdminFinancePortal.tsx`)**:
    - Accounting-style ledger tracking Incoming Buyer Wire Receipts vs Outgoing Operational Payouts vs Net Operating Result. Transaction audit ledger.
15. **Disputes & Chain of Custody (`AdminDisputeManagement.tsx`)**:
    - Unified dispute queue handling 7 dispute types (*Quantity Mismatch, Quality Dispute, Damaged Goods, Late Delivery, Payment Issue, Wrong Product, Buyer Rejection*) across 3 escalation levels. Side-by-side **4-Checkpoint Evidence Viewer** (*Collection → Intake → Logistics → Delivery*) with liability assignment.
16. **Risk & Anomalies (`AdminRiskAnomalies.tsx`)**:
    - Risk score alerts (0-100), severity levels (Low, Medium, High, Critical), price surge anomalies & transit loss alerts.
17. **Reports & Export (`AdminReports.tsx`)**:
    - Instant CSV report exports for Farmer Growth, Company Demands, Order Completion, Freight Expenses & Net Results.
18. **My Profile (`AdminProfileView.tsx`)**:
    - Personal info, employee ID, role, Aadhaar (masked), editable profile fields.
19. **Global Search Modal (`AdminGlobalSearchModal.tsx`)**:
    - Global search across Farmers, Companies, Agents, Warehouses & Disputes (`⌘K`).
20. **Admin Notification Drawer (`AdminNotificationModal.tsx`)**:
    - Operational risk alerts & dispute queue notifications drawer.

---

## 🛠️ 4. Shared Data Architecture & Service Layer (`AdminService.ts`)

- Shared service abstractions (`src/services/adminService.ts`) with clear `TODO` markers for production backend API HTTP endpoints.
- Single shared data layer across Farmers, Field Agents, Warehouses, Companies, Orders, and Disputes.

---

## 📦 5. Build & Verification Status

- **Command Executed**: `npm run build`
- **Result**: Built successfully in **524ms** with **Exit Code 0** (0 errors, 0 warnings).
