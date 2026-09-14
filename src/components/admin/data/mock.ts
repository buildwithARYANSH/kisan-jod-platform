export type ModuleKey = "dashboard" | "farmers" | "companies" | "agents" | "orders" | "inventory" | "availability" | "demand" | "pricing" | "predictions" | "logistics" | "finance" | "disputes" | "risk" | "matching" | "forecasting" | "reports" | "profile";

export const kpis = [
  { label: "Active farmers", value: "12,842", delta: "+8.4%", tone: "mint", note: "Sample" },
  { label: "Active companies", value: "186", delta: "+4.2%", tone: "blue", note: "Sample" },
  { label: "Field agents", value: "428", delta: "+12", tone: "violet", note: "Sample" },
  { label: "Orders in motion", value: "1,206", delta: "+6.8%", tone: "amber", note: "Sample" },
  { label: "Available produce", value: "2,480T", delta: "+14.1%", tone: "orange", note: "Sample" },
  { label: "Current demand", value: "3,120T", delta: "88% matched", tone: "rose", note: "Estimated" },
  { label: "Pending payments", value: "₹48.2L", delta: "74 items", tone: "yellow", note: "Estimated" },
  { label: "Platform result", value: "₹12.6L", delta: "8.7% margin", tone: "green", note: "Estimated" },
];

export const orders = [
  { id: "ORD-10294", crop: "Tomato", qty: "18,400 kg", confirmed: "17,960 kg", grade: "A", source: "Nashik cluster", agent: "Arun Khot", inventory: "Shree Cold Store", logistics: "Logistics Partner A", company: "FreshMart Foods", status: "In transit", payment: "Processing", completion: 76, risk: "Low", date: "12 Sep 2026" },
  { id: "ORD-10293", crop: "Onion", qty: "24,000 kg", confirmed: "24,000 kg", grade: "B", source: "Pimpalgaon", agent: "Meena Joshi", inventory: "Nashik Agro Hub", logistics: "Logistics Partner B", company: "Northstar Retail", status: "Awaiting delivery", payment: "Paid", completion: 91, risk: "Low", date: "11 Sep 2026" },
  { id: "ORD-10292", crop: "Green chilli", qty: "8,200 kg", confirmed: "7,740 kg", grade: "A", source: "Khadakwasla", agent: "Sanjay More", inventory: "West Gate Warehouse", logistics: "Logistics Partner C", company: "Harvest Table Co.", status: "With dispute", payment: "Disputed", completion: 52, risk: "High", date: "10 Sep 2026" },
  { id: "ORD-10291", crop: "Potato", qty: "31,500 kg", confirmed: "31,500 kg", grade: "B", source: "Satara belt", agent: "Asha Patil", inventory: "Satara Central", logistics: "Logistics Partner A", company: "Daily Basket", status: "Completed", payment: "Completed", completion: 100, risk: "Low", date: "09 Sep 2026" },
  { id: "ORD-10290", crop: "Tomato", qty: "12,800 kg", confirmed: "12,180 kg", grade: "C", source: "Nandur", agent: "Ravi Shinde", inventory: "Shree Cold Store", logistics: "Logistics Partner B", company: "FreshMart Foods", status: "Quality check", payment: "Pending", completion: 34, risk: "Medium", date: "09 Sep 2026" },
  { id: "ORD-10289", crop: "Cabbage", qty: "9,600 kg", confirmed: "9,600 kg", grade: "A", source: "Igatpuri", agent: "Leena Pawar", inventory: "Hillview Storage", logistics: "Logistics Partner C", company: "Green Plate Hotels", status: "Supply matched", payment: "Pending", completion: 21, risk: "Low", date: "08 Sep 2026" },
];

export const farmers = [
  { name: "Ramesh Pawar", id: "FAR-00821", region: "Nashik East", agent: "Arun Khot", crops: "Tomato, Onion", status: "Active", activity: "Today", orders: 14, qty: "4,820 kg", payment: "Clear" },
  { name: "Sunita Jadhav", id: "FAR-00820", region: "Pimpalgaon", agent: "Arun Khot", crops: "Onion", status: "Active", activity: "Yesterday", orders: 8, qty: "2,180 kg", payment: "Clear" },
  { name: "Ganesh Shinde", id: "FAR-00819", region: "Nandur", agent: "Ravi Shinde", crops: "Tomato", status: "Active", activity: "12 Sep 2026", orders: 11, qty: "3,440 kg", payment: "Pending" },
  { name: "Vilas More", id: "FAR-00791", region: "Satara West", agent: "Asha Patil", crops: "Potato, Cabbage", status: "Inactive", activity: "18 May 2026", orders: 4, qty: "1,160 kg", payment: "Clear" },
];

export const companies = [
  { name: "FreshMart Foods", id: "COM-00184", branch: "Pune Central", contact: "Nisha Mehta", activity: "Today", status: "Active", demands: 18, completed: 64, value: "₹1.84Cr" },
  { name: "Northstar Retail", id: "COM-00177", branch: "Mumbai West", contact: "Kabir Shah", activity: "Yesterday", status: "Active", demands: 12, completed: 42, value: "₹96.2L" },
  { name: "Harvest Table Co.", id: "COM-00163", branch: "Bengaluru", contact: "Ananya Rao", activity: "10 Sep 2026", status: "Active", demands: 7, completed: 28, value: "₹68.4L" },
  { name: "Daily Basket", id: "COM-00142", branch: "Nagpur", contact: "Sahil Jain", activity: "12 Apr 2026", status: "Inactive", demands: 0, completed: 11, value: "₹24.7L" },
];

export const agents = [
  { name: "Arun Khot", id: "SA-04821", region: "Nashik East", inventory: "Shree Cold Store", tasks: "46 / 52", rating: "4.6", completion: 88, farmers: 42, referral: "₹8,400", status: "Active" },
  { name: "Meena Joshi", id: "SA-04712", region: "Pimpalgaon", inventory: "Nashik Agro Hub", tasks: "39 / 41", rating: "4.8", completion: 95, farmers: 36, referral: "₹6,200", status: "Active" },
  { name: "Sanjay More", id: "SA-04408", region: "Khadakwasla", inventory: "West Gate Warehouse", tasks: "29 / 40", rating: "3.1", completion: 72, farmers: 28, referral: "₹4,800", status: "Review" },
  { name: "Asha Patil", id: "SA-04176", region: "Satara West", inventory: "Satara Central", tasks: "58 / 60", rating: "4.9", completion: 97, farmers: 51, referral: "₹11,200", status: "Active" },
];

export const activities = [
  { time: "8 min ago", title: "New batch received", detail: "BAT-0921 · 420 kg tomato accepted at Shree Cold Store", color: "mint" },
  { time: "24 min ago", title: "Dispute requires review", detail: "DSP-0017 · quantity mismatch on ORD-10292", color: "rose" },
  { time: "1 hr ago", title: "Demand created", detail: "FreshMart Foods requested 18,000 kg grade A tomato", color: "blue" },
  { time: "2 hrs ago", title: "Price reference approved", detail: "Tomato grade A · Nashik East · ₹28–32/kg", color: "amber" },
  { time: "Yesterday", title: "Delivery completed", detail: "ORD-10291 accepted by Daily Basket", color: "violet" },
];

export const disputes = [
  { id: "DSP-0017", type: "Quantity mismatch", order: "ORD-10292", batch: "BAT-0914", raisedBy: "Harvest Table Co.", severity: "High", status: "Admin Review", checkpoint: "Inventory Intake", age: "2h ago" },
  { id: "DSP-0016", type: "Late delivery", order: "ORD-10284", batch: "BAT-0902", raisedBy: "FreshMart Foods", severity: "Medium", status: "Investigating", checkpoint: "Logistics Pickup", age: "1d ago" },
  { id: "DSP-0015", type: "Quality dispute", order: "ORD-10278", batch: "BAT-0893", raisedBy: "Northstar Retail", severity: "Medium", status: "Awaiting Evidence", checkpoint: "Company Delivery", age: "2d ago" },
  { id: "DSP-0014", type: "Payment issue", order: "ORD-10271", batch: "BAT-0887", raisedBy: "Ramesh Pawar", severity: "Low", status: "Resolved", checkpoint: "Final Settlement", age: "4d ago" },
];

export const anomalies = [
  { title: "Repeated quality rejection", entity: "Sanjay More · SA-04408", score: 82, severity: "High", reason: "4 quality complaints across 3 orders in 14 days", status: "Requires review" },
  { title: "Price override deviation", entity: "Tomato · Nashik East", score: 61, severity: "Medium", reason: "Manual price 18% above approved reference", status: "Open" },
  { title: "Inventory adjustment pattern", entity: "West Gate Warehouse", score: 47, severity: "Medium", reason: "3 unexplained stock adjustments this week", status: "Assigned" },
];

export const inventory = [
  { facility: "Shree Cold Store", region: "Nashik East", utilization: 68, incoming: "420 kg", current: "1,180 kg", reserved: "860 kg", available: "740 kg", status: "Healthy" },
  { facility: "Nashik Agro Hub", region: "Pimpalgaon", utilization: 84, incoming: "620 kg", current: "2,440 kg", reserved: "1,980 kg", available: "460 kg", status: "Near capacity" },
  { facility: "West Gate Warehouse", region: "Khadakwasla", utilization: 52, incoming: "310 kg", current: "920 kg", reserved: "440 kg", available: "480 kg", status: "Healthy" },
];

export const navGroups = [
  { label: "Overview", items: [{ key: "dashboard", label: "Dashboard", icon: "grid" }] },
  { label: "Network", items: [{ key: "farmers", label: "Farmers", icon: "farmers" }, { key: "companies", label: "Companies", icon: "building" }, { key: "agents", label: "Field Agents", icon: "agents" }] },
  { label: "Flow", items: [{ key: "orders", label: "Orders & Batches", icon: "orders" }, { key: "inventory", label: "Inventory & Warehouses", icon: "inventory" }, { key: "availability", label: "Crop Availability", icon: "leaf" }, { key: "demand", label: "Demand", icon: "demand" }] },
  { label: "Intelligence", items: [{ key: "pricing", label: "Price Intelligence", icon: "pricing" }, { key: "predictions", label: "AI Predictions", icon: "spark" }, { key: "matching", label: "Demand-Supply Match", icon: "match" }, { key: "forecasting", label: "Demand Forecasting", icon: "forecast" }] },
  { label: "Operations", items: [{ key: "logistics", label: "Logistics", icon: "truck" }, { key: "finance", label: "Finance", icon: "finance" }, { key: "disputes", label: "Disputes & Exceptions", icon: "dispute" }, { key: "risk", label: "Risk & Anomalies", icon: "risk" }] },
  { label: "Insights", items: [{ key: "reports", label: "Reports & Analytics", icon: "reports" }, { key: "profile", label: "My Profile", icon: "profile" }] },
] as const;

export const searchResults = [
  { id: "ORD-10294", type: "Order", title: "Tomato · 18,400 kg", meta: "FreshMart Foods · In transit" },
  { id: "FAR-00821", type: "Farmer", title: "Ramesh Pawar", meta: "Nashik East · Active" },
  { id: "DSP-0017", type: "Dispute", title: "Quantity mismatch", meta: "ORD-10292 · High" },
  { id: "BAT-0921", type: "Batch", title: "420 kg tomato", meta: "Shree Cold Store · Accepted" },
];
