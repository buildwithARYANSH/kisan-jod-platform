/**
 * AgriCore Enterprise Procurement OS - Master Data Store
 * Designed for Industrial Buyers & Corporate Food Processors
 * Supports Multi-Branch Operations, Real-Time Telemetry, Smart Matching,
 * Live Moving Freight, Chain of Custody, Quality Assays, Payments, and Forecasting.
 */

const MOCK_DATA = {
  company: {
    id: "COMP-ITC-01",
    name: "ITC Agribusiness & Consumer Foods Ltd.",
    shortName: "ITC Agri",
    brandCode: "ITC-FOODS-HQ",
    gstin: "07AAACI1681G1ZM",
    pan: "AAACI1681G",
    cin: "L16005WB1910PLC001985",
    office: "Sector 62, Institutional Area, Noida, UP - 201309",
    industry: "FMCG & Industrial Agro-Processing",
    category: "Bulk Consumer Foods & Milling",
    yearEstablished: 1910,
    website: "https://www.itcportal.com/businesses/agri-business.aspx",
    description: "One of India's largest corporate agricultural procurers, partnering directly with verified smallholder farmer collectives for transparent farm-to-fork supply chains.",
    primaryContact: {
      name: "Vikram Malhotra",
      role: "VP Agri Sourcing & Procurement",
      email: "vikram.malhotra@itcagro.com",
      phone: "+91 98110 55420"
    },
    procurementProfile: {
      primaryCrops: ["Sharbati Wheat", "Pusa 1121 Basmati Rice", "Nashik Red Onion", "Yellow Mustard Seed", "Hybrid Lycopene Tomato"],
      preferredGrades: ["Grade A (Food Processing)", "Grade B (Commercial Milling)"],
      procurementFrequency: "Weekly Recurring & Seasonal Harvest Forward Contracts",
      typicalBatchVolume: "50 MT to 500 MT",
      preferredRegions: ["Western UP Belt", "Karnal-Kurukshetra Zone", "Nashik-Lasalgaon Agro Hub", "Kolar-Chikkaballapur Basin"]
    },
    ytdStats: {
      activeDemandsCount: 5,
      totalDemandedMT: 1320,
      matchedSupplyMT: 1035,
      overallCoveragePct: 78.4,
      inboundFreightVehicles: 3,
      ytdProcurementValueINR: 48250000, // ₹4.82 Cr
      ytdLandedSavingsINR: 3840000,    // ₹38.4 Lakhs
      avgSavingsPct: 8.4
    }
  },

  // MULTI-BRANCH LOCATIONS
  branches: [
    { id: "ALL", name: "All Branches", city: "All Operating Locations", code: "ALL" },
    { id: "BR-DELHI", name: "Delhi-NCR Mega Plant", city: "Greater Noida (UP)", address: "Plot 14, Ecotech II, Gr. Noida, UP", capacityMT: 1200, manager: "Aarti Sharma", code: "DEL" },
    { id: "BR-PUNE", name: "Pune Integrated Agro-Hub", city: "Ranjangaon (MH)", address: "MIDC Agro Park, Ranjangaon, Pune, MH", capacityMT: 600, manager: "Rohan Deshmukh", code: "PUN" },
    { id: "BR-BLR", name: "Bengaluru South Distribution", city: "Peenya (KA)", address: "Phase 3 Industrial Area, Peenya, Bengaluru, KA", capacityMT: 450, manager: "Sanjay Verma", code: "BLR" },
    { id: "BR-MEERUT", name: "Meerut Aggregation Hub", city: "Meerut (UP)", address: "Baghpat Bypass Agro Silos, Meerut, UP", capacityMT: 800, manager: "Gurmeet Singh", code: "MRT" }
  ],

  // ACTIVE DEMANDS & MATCH ALLOCATIONS
  demands: [
    {
      id: "DEM-0891",
      orderRef: "AG-2048",
      crop: "Wheat (Sharbati)",
      variety: "Certified Sharbati Sehore / HD-2967",
      category: "Grains",
      branchId: "BR-DELHI",
      requiredMT: 420,
      matchedMT: 315,
      gapMT: 105,
      coveragePct: 75,
      status: "Partially Matched", // Open | Matching | Partially Matched | Matched | Dispatched | Fulfilled
      statusTone: "active",
      requiredBy: "15 Sep 2026",
      priority: "High",
      destination: "Delhi-NCR Mega Plant (Gr. Noida)",
      grade: "Grade A",
      specs: "Moisture < 11.5% • Gluten > 11.0% • Foreign Matter < 0.5%",
      expectedPriceMin: 28000,
      expectedPriceMax: 29000,
      targetPricePerMT: 28500, // ₹28.50/kg
      mandiBenchmarkPerMT: 29200,
      estimatedSavingsINR: 294000,
      matchScore: 94,
      matchReason: "Exact crop match, Grade A compliant, available within 36h from Western UP farmer cluster at ₹700/MT below APMC mandi index.",
      allocationSources: [
        { sourceName: "Meerut-Hapur FPO Silos (UP)", volumeMT: 210, rating: 4.9, distanceKm: 78, pricePerMT: 28500 },
        { sourceName: "Baghpat Farmers Collective (UP)", volumeMT: 105, rating: 4.8, distanceKm: 92, pricePerMT: 28500 }
      ],
      createdAt: "2026-08-20",
      history: [
        { status: "Demand Posted", time: "20 Aug, 09:30 AM" },
        { status: "Searching Supply", time: "20 Aug, 09:31 AM" },
        { status: "75% Supply Matched", time: "21 Aug, 02:15 PM" }
      ]
    },
    {
      id: "DEM-0892",
      orderRef: "AG-2042",
      crop: "Basmati Rice (Pusa 1121)",
      variety: "Aged 12-Month Single Origin",
      category: "Grains",
      branchId: "BR-DELHI",
      requiredMT: 250,
      matchedMT: 250,
      gapMT: 0,
      coveragePct: 100,
      status: "Dispatched",
      statusTone: "transit",
      requiredBy: "20 Sep 2026",
      priority: "Critical",
      destination: "Delhi-NCR Mega Plant (Gr. Noida)",
      grade: "Grade A",
      specs: "Grain Length > 8.35mm • NABL Pesticide MRL Zero Residue",
      expectedPriceMin: 72000,
      expectedPriceMax: 74000,
      targetPricePerMT: 72500,
      mandiBenchmarkPerMT: 76500,
      estimatedSavingsINR: 1000000,
      matchScore: 98,
      matchReason: "Single-origin aged lot from Karnal paddy belt with zero chemical residue certification.",
      allocationSources: [
        { sourceName: "Karnal-Kurukshetra Paddy Silos (HR)", volumeMT: 250, rating: 5.0, distanceKm: 110, pricePerMT: 72500 }
      ],
      truckId: "TRK-284",
      createdAt: "2026-08-18",
      history: [
        { status: "Demand Posted", time: "18 Aug, 10:00 AM" },
        { status: "100% Matched", time: "18 Aug, 11:30 AM" },
        { status: "Match Approved", time: "19 Aug, 03:00 PM" },
        { status: "In Transit", time: "Today, 09:30 AM" }
      ]
    },
    {
      id: "DEM-0893",
      orderRef: "AG-2038",
      crop: "Nashik Red Onion",
      variety: "Export Grade Medium 45-60mm",
      category: "Horticulture",
      branchId: "BR-PUNE",
      requiredMT: 180,
      matchedMT: 180,
      gapMT: 0,
      coveragePct: 100,
      status: "Fulfilled",
      statusTone: "delivered",
      requiredBy: "05 Sep 2026",
      priority: "Normal",
      destination: "Pune Integrated Agro-Hub",
      grade: "Grade B",
      specs: "Size 45-60mm • Cured Shade Dried • 0% Sprouting",
      expectedPriceMin: 20500,
      expectedPriceMax: 22000,
      targetPricePerMT: 21000,
      mandiBenchmarkPerMT: 23500,
      estimatedSavingsINR: 450000,
      matchScore: 96,
      matchReason: "Cured shade lot aggregated at Lasalgaon terminal with calibrated sorting.",
      allocationSources: [
        { sourceName: "Lasalgaon Terminal Collective (MH)", volumeMT: 180, rating: 4.8, distanceKm: 145, pricePerMT: 21000 }
      ],
      truckId: "TRK-109",
      createdAt: "2026-08-15",
      history: [
        { status: "Demand Posted", time: "15 Aug, 11:00 AM" },
        { status: "100% Matched", time: "15 Aug, 12:45 PM" },
        { status: "In Transit", time: "24 Aug, 06:00 AM" },
        { status: "Delivered & Verified", time: "Today, 02:15 PM" }
      ]
    },
    {
      id: "DEM-0894",
      orderRef: "AG-2051",
      crop: "Yellow Mustard Seed",
      variety: "High Oil Content Pusa Bold",
      category: "Oilseeds",
      branchId: "BR-DELHI",
      requiredMT: 300,
      matchedMT: 145,
      gapMT: 155,
      coveragePct: 48,
      status: "Partially Matched",
      statusTone: "warning",
      requiredBy: "30 Sep 2026",
      priority: "High",
      destination: "Delhi-NCR Mega Plant (Gr. Noida)",
      grade: "Grade A",
      specs: "Oil Content > 39.5% • Moisture < 7.5%",
      expectedPriceMin: 53500,
      expectedPriceMax: 55000,
      targetPricePerMT: 54000,
      mandiBenchmarkPerMT: 56200,
      estimatedSavingsINR: 660000,
      matchScore: 91,
      matchReason: "High oil content batch from Baghpat yard. Seasonal crushing surge requires forward booking.",
      allocationSources: [
        { sourceName: "Baghpat Yard Cooperative (UP)", volumeMT: 145, rating: 4.7, distanceKm: 92, pricePerMT: 54000 }
      ],
      createdAt: "2026-08-22",
      history: [
        { status: "Demand Posted", time: "22 Aug, 04:00 PM" },
        { status: "48% Matched", time: "23 Aug, 10:00 AM" }
      ]
    },
    {
      id: "DEM-0895",
      orderRef: "AG-2055",
      crop: "Hybrid Tomato (Processing)",
      variety: "High Lycopene Industrial Strain",
      category: "Vegetables",
      branchId: "BR-BLR",
      requiredMT: 170,
      matchedMT: 145,
      gapMT: 25,
      coveragePct: 85,
      status: "Partially Matched",
      statusTone: "active",
      requiredBy: "10 Sep 2026",
      priority: "Normal",
      destination: "Bengaluru South Distribution Park",
      grade: "Grade A",
      specs: "Brix > 4.8 • Firmness > 4.2 kg/cm² • Deep Red",
      expectedPriceMin: 18000,
      expectedPriceMax: 19500,
      targetPricePerMT: 18500,
      mandiBenchmarkPerMT: 20000,
      estimatedSavingsINR: 255000,
      matchScore: 95,
      matchReason: "Morning harvest lot from Kolar basin with high lycopene solids.",
      allocationSources: [
        { sourceName: "Kolar APMC Linked Silo (KA)", volumeMT: 145, rating: 4.9, distanceKm: 65, pricePerMT: 18500 }
      ],
      createdAt: "2026-08-23",
      history: [
        { status: "Demand Posted", time: "23 Aug, 09:00 AM" },
        { status: "85% Matched", time: "24 Aug, 08:30 AM" }
      ]
    }
  ],

  // PURCHASE ORDERS LIFECYCLE
  orders: [
    {
      id: "AG-2042",
      demandId: "DEM-0892",
      crop: "Basmati Rice (Pusa 1121)",
      volumeMT: 250,
      grade: "Grade A",
      branchId: "BR-DELHI",
      pricePerMT: 72500,
      productCostINR: 18125000,
      logisticsCostINR: 375000,
      platformFeeINR: 181250,
      totalPayableINR: 18681250,
      advancePaidINR: 5604375, // 30% advance
      balanceDueINR: 13076875,
      stage: "In Transit", // Matched -> Approved -> Reserved -> Picked Up -> In Transit -> Delivered -> Settled
      expectedDelivery: "20 Sep 2026 (04:00 PM)",
      destination: "Delhi-NCR Mega Plant (Gr. Noida)",
      truckId: "TRK-284",
      batchId: "BAT-HR-8821",
      paymentStatus: "Advance Paid (30% Escrow Cleared)",
      qualityCert: "NABL-LAB-2026-08819",
      invoiceUrl: "#"
    },
    {
      id: "AG-2038",
      demandId: "DEM-0893",
      crop: "Nashik Red Onion",
      volumeMT: 180,
      grade: "Grade B",
      branchId: "BR-PUNE",
      pricePerMT: 21000,
      productCostINR: 3780000,
      logisticsCostINR: 145000,
      platformFeeINR: 37800,
      totalPayableINR: 3962800,
      advancePaidINR: 1188840,
      balanceDueINR: 2773960,
      stage: "Delivered & Verified",
      expectedDelivery: "05 Sep 2026",
      destination: "Pune Integrated Agro-Hub",
      truckId: "TRK-109",
      batchId: "BAT-MH-4409",
      paymentStatus: "Payment Pending Gate Signoff",
      qualityCert: "NABL-LAB-2026-07712",
      invoiceUrl: "#"
    },
    {
      id: "AG-2048",
      demandId: "DEM-0891",
      crop: "Wheat (Sharbati)",
      volumeMT: 315,
      grade: "Grade A",
      branchId: "BR-DELHI",
      pricePerMT: 28500,
      productCostINR: 8977500,
      logisticsCostINR: 220000,
      platformFeeINR: 89775,
      totalPayableINR: 9287275,
      advancePaidINR: 0,
      balanceDueINR: 9287275,
      stage: "Supply Matched (Awaiting Approval)",
      expectedDelivery: "15 Sep 2026",
      destination: "Delhi-NCR Mega Plant (Gr. Noida)",
      truckId: null,
      batchId: "BAT-UP-8821",
      paymentStatus: "Awaiting Order Confirmation",
      qualityCert: "NABL-LAB-2026-09104",
      invoiceUrl: "#"
    }
  ],

  // BATCH QUALITY INTELLIGENCE & CHAIN OF CUSTODY
  batches: [
    {
      id: "BAT-HR-8821",
      crop: "Basmati Rice (Pusa 1121)",
      volumeMT: 250,
      grade: "Grade A",
      stars: 5,
      freshnessScore: 98,
      sizeConsistency: 96,
      labCertified: true,
      labCertRef: "NABL-TC-8891-2026",
      attributes: [
        { label: "Grain Length", value: "8.42 mm (Spec: > 8.35 mm)", pass: true },
        { label: "Moisture Content", value: "11.2% (Spec: < 12.0%)", pass: true },
        { label: "Pesticide MRL Residue", value: "0.00 ppm (Zero Residue)", pass: true },
        { label: "Broken Grain Pct", value: "0.4% (Spec: < 1.0%)", pass: true }
      ],
      chainOfCustody: [
        { stage: "Farmer Harvest & Intake", actor: "Karnal Paddy Farmers Collective (980 Farmers)", location: "Karnal, Haryana", time: "18 Aug 2026, 08:30 AM", verified: true },
        { stage: "Field Agent Quality Assay", actor: "Suresh Kumar (Field Agent #FA-881)", location: "Karnal Aggregation Silo #3", time: "18 Aug 2026, 11:45 AM", verified: true },
        { stage: "Silo Lot Aggregation & Bagging", actor: "Central Warehousing Corp (CWC Karnal)", location: "Karnal, Haryana", time: "22 Aug 2026, 04:00 PM", verified: true },
        { stage: "GPS Sealed Freight Dispatch", actor: "Delhivery Agro Freight (Truck HR-05-BC-7892)", location: "Karnal Silo Out-Gate", time: "Today, 09:30 AM", verified: true },
        { stage: "Company Receiving Dock", actor: "ITC Greater Noida Plant Gate Dock #2", location: "Greater Noida, UP", time: "Expected Today, 04:00 PM", verified: false }
      ]
    },
    {
      id: "BAT-MH-4409",
      crop: "Nashik Red Onion",
      volumeMT: 180,
      grade: "Grade B",
      stars: 4.8,
      freshnessScore: 94,
      sizeConsistency: 92,
      labCertified: true,
      labCertRef: "NABL-TC-7712-2026",
      attributes: [
        { label: "Bulb Caliber", value: "48-58 mm (Spec: 45-60 mm)", pass: true },
        { label: "Moisture Dryness", value: "Cured Shade Dried", pass: true },
        { label: "Sprouting Deviations", value: "0.0% (Zero)", pass: true }
      ],
      chainOfCustody: [
        { stage: "Farmer Harvest Intake", actor: "Lasalgaon APMC Linked Farmers (2,180 Farms)", location: "Lasalgaon, Nashik", time: "15 Aug 2026", verified: true },
        { stage: "Field Grading Inspection", actor: "Sunil Pawar (Field Agent #FA-442)", location: "Lasalgaon Terminal", time: "15 Aug 2026", verified: true },
        { stage: "Ventilated Crate Transit", actor: "FastTrack Freight (Truck MH-15-EG-4412)", location: "Lasalgaon Hub", time: "24 Aug 2026, 06:00 AM", verified: true },
        { stage: "Plant Gate Dock Arrival", actor: "ITC Pune Agro-Hub Gate #1", location: "Ranjangaon, Pune", time: "Today, 02:15 PM", verified: true }
      ]
    }
  ],

  // LIVE FLEET TELEMETRY
  liveFleet: [
    {
      id: "TRK-284",
      orderRef: "AG-2042",
      vehicleNumber: "HR-05-BC-7892",
      vehicleType: "Multi-Axle GPS-Sealed Agro Freight",
      crop: "Basmati Rice (Pusa 1121)",
      volumeMT: 250,
      driverName: "Gurpreet Singh",
      driverPhone: "+91 98765 43210",
      origin: "Karnal Paddy Silos (Haryana)",
      destination: "Delhi-NCR Mega Plant (Gr. Noida)",
      distanceKm: 110,
      speedKmh: 48,
      status: "IN TRANSIT",
      etaMinutes: 42,
      activeCheckpoint: "Sonipat Toll Checkpoint (Passed & RFID Verified)",
      rfidSeal: "SEAL-HR-8821-INTACT",
      cargoTemp: "22.4°C (Optimal Ambient)",
      timeline: [
        { stage: "Silo Pickup", time: "09:30 AM", completed: true },
        { stage: "Weighbridge Manifest", time: "10:15 AM", completed: true },
        { stage: "Sonipat Checkpoint", time: "01:20 PM", completed: true },
        { stage: "Plant Gate Dock #2", time: "04:00 PM (Est)", completed: false }
      ]
    },
    {
      id: "TRK-109",
      orderRef: "AG-2038",
      vehicleNumber: "MH-15-EG-4412",
      vehicleType: "Ventilated Crate Agro Transit",
      crop: "Nashik Red Onion",
      volumeMT: 180,
      driverName: "Dnyaneshwar Patil",
      driverPhone: "+91 94222 88910",
      origin: "Lasalgaon Hub (Nashik)",
      destination: "Pune Integrated Agro-Hub",
      distanceKm: 145,
      speedKmh: 0,
      status: "DELIVERED AT GATE",
      etaMinutes: 0,
      activeCheckpoint: "Ranjangaon Plant Gate Dock #1",
      rfidSeal: "SEAL-MH-4409-VERIFIED",
      cargoTemp: "25.8°C (Ventilated)",
      timeline: [
        { stage: "Lasalgaon Intake", time: "06:00 AM", completed: true },
        { stage: "Ahmednagar Checkpoint", time: "11:40 AM", completed: true },
        { stage: "Plant Gate Dock #1", time: "02:15 PM", completed: true }
      ]
    }
  ],

  // FINANCIAL SETTLEMENTS & PAYMENTS
  payments: {
    ytdDisbursedINR: 48250000,
    escrowLockedINR: 3845000,
    completedSettlementsINR: 44405000,
    recentTransactions: [
      { id: "TXN-9912", orderRef: "AG-2042", crop: "Basmati Rice (250 MT)", amountINR: 5898867, type: "Advance Sourcing (30%)", method: "RTGS Escrow", status: "Completed", date: "Today, 11:15 AM", utr: "HDFCR520260823004812" },
      { id: "TXN-8831", orderRef: "AG-2038", crop: "Nashik Onion (180 MT)", amountINR: 1267954, type: "Advance Sourcing (30%)", method: "NEFT Escrow", status: "Completed", date: "Today, 07:45 AM", utr: "ICICN20260824009931" },
      { id: "TXN-7740", orderRef: "AG-2030", crop: "Hybrid Tomato (145 MT)", amountINR: 1732946, type: "Final Gate Settlement (70%)", method: "RTGS Escrow", status: "Settled", date: "Yesterday, 03:30 PM", utr: "HDFCR520260823009942" }
    ],
    timeSeries: {
      "7D": { labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], volumeLakhs: [18, 24, 19, 32, 41, 48, 58], savingsLakhs: [1.4, 1.9, 1.5, 2.6, 3.3, 3.8, 4.6] },
      "30D": { labels: ["W1", "W2", "W3", "W4", "W5", "W6"], volumeLakhs: [95, 120, 145, 175, 210, 248], savingsLakhs: [7.6, 9.8, 11.6, 14.0, 16.8, 19.8] },
      "1Y": { labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"], volumeLakhs: [4.2, 6.8, 9.4, 12.1, 15.6, 18.2], savingsLakhs: [0.35, 0.55, 0.78, 1.02, 1.32, 1.54] }
    }
  },

  // DISPUTES & ISSUE CLAIMS
  disputes: [
    {
      id: "DISP-101",
      orderRef: "AG-2038",
      crop: "Nashik Red Onion",
      type: "Quantity Weighbridge Variance",
      description: "Delivered tonnage on weighbridge is 178.6 MT vs 180.0 MT manifest (1.4 MT transit drying tolerance).",
      status: "Under Review",
      submittedDate: "Today, 02:45 PM",
      priority: "Normal",
      evidenceFile: "weighbridge_slip_pune_dock1.pdf"
    }
  ],

  // DEMAND FORECASTING PLANNING MODELS
  forecasting: {
    seasonalTrends: [
      { period: "Current (Aug 2026)", crop: "Sharbati Wheat", availability: "Optimal (Western UP harvest staged)", priceOutlook: "Stable (₹28.50/kg)" },
      { period: "Next Month (Sep 2026)", crop: "Mustard & Soy", availability: "Crushing Surge Expected", priceOutlook: "Upward Pressure (+6.8%)" },
      { period: "Next Season (Q4 2026)", crop: "Basmati Paddy", availability: "Major Kharif Harvest Intake", priceOutlook: "Favorable Buyer Liquidity" }
    ],
    predictedShortages: [
      { crop: "Yellow Mustard", region: "Rajasthan-Alwar Zone", risk: "Medium Risk", note: "Early festival crushing demand may reduce spot market supply by 18%." }
    ]
  },

  // COMPANY USERS & PERMISSIONS
  team: [
    { id: "USR-01", name: "Vikram Malhotra", email: "vikram.malhotra@itcagro.com", role: "Company Admin", branch: "All Branches", status: "Active", lastActive: "Just now" },
    { id: "USR-02", name: "Aarti Sharma", email: "aarti.sharma@itcagro.com", role: "Procurement Manager", branch: "Delhi-NCR Mega Plant", status: "Active", lastActive: "18 mins ago" },
    { id: "USR-03", name: "Rohan Deshmukh", email: "rohan.d@itcagro.com", role: "Branch Manager", branch: "Pune Agro-Hub", status: "Active", lastActive: "2 hours ago" },
    { id: "USR-04", name: "Sanjay Verma", email: "sanjay.v@itcagro.com", role: "Finance User", branch: "Bengaluru Distribution", status: "Active", lastActive: "Yesterday" }
  ],

  // NOTIFICATIONS FEED
  notifications: [
    { id: "NOTIF-01", title: "Demand Allocation Update", message: "Sharbati Wheat demand DEM-0891 now 75% covered by Meerut-Hapur cluster.", time: "14 mins ago", unread: true },
    { id: "NOTIF-02", title: "Dispatch Checkpoint Cleared", message: "Truck HR-05-BC-7892 (250 MT Basmati) cleared Sonipat Toll Checkpoint.", time: "48 mins ago", unread: true },
    { id: "NOTIF-03", title: "Consignment Docked", message: "Truck MH-15-EG-4412 (180 MT Onion) arrived at Pune Plant Gate Dock #1.", time: "2 hours ago", unread: false },
    { id: "NOTIF-04", title: "Escrow Release Complete", message: "₹17.32 Lakhs gate settlement cleared for Order #AG-2030 (Hybrid Tomato).", time: "Yesterday", unread: false }
  ]
};

if (typeof window !== "undefined") {
  window.MOCK_DATA = MOCK_DATA;
}
