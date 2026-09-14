import React, { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import "./fieldAgent.css";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  Boxes,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  CloudOff,
  Copy,
  FileCheck2,
  IndianRupee,
  Leaf,
  LocateFixed,
  LogOut,
  Map,
  MessageCircle,
  Mic,
  MoreHorizontal,
  PackageCheck,
  Phone,
  QrCode,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  SunMedium,
  Truck,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";

interface FieldAgentPortalLayoutProps {
  onSwitchPersona?: (persona: string) => void;
  onLogout?: () => void;
}

type TabKey = "tasks" | "farmers" | "region" | "earnings" | "profile";
type FlowStep = 1 | 2 | 3 | 4 | 5;

const INITIAL_TASKS = [
  { id: "TSK-1048", priority: 1, farmer: "Ramesh Pawar", initials: "RP", crop: "Tomato", variety: "Hybrid Grade-A", quantity: "240 kg", distance: "1.8 km", village: "Chincholi", phone: "+91 98765 44321", grade: "A", eta: "09:30 AM", tone: "coral" },
  { id: "TSK-1049", priority: 2, farmer: "Sunita Jadhav", initials: "SJ", crop: "Onion", variety: "Red Kanda", quantity: "180 kg", distance: "3.4 km", village: "Pimpalgaon", phone: "+91 98220 11203", grade: "B", eta: "11:00 AM", tone: "gold" },
  { id: "TSK-1050", priority: 3, farmer: "Ganesh Shinde", initials: "GS", crop: "Tomato", variety: "Desi Special", quantity: "95 kg", distance: "5.1 km", village: "Nandur", phone: "+91 97654 88770", grade: "A", eta: "01:30 PM", tone: "blue" },
  { id: "TSK-1051", priority: 4, farmer: "Meena Kolhe", initials: "MK", crop: "Green chilli", variety: "Jwala", quantity: "72 kg", distance: "7.6 km", village: "Khadakwasla", phone: "+91 98909 33218", grade: "C", eta: "03:00 PM", tone: "mint" },
];

const INITIAL_FARMERS = [
  { name: "Gurdev Singh", initials: "GS", crop: "Tomato & Wheat", qty: "450 kg", status: "Visit due", last: "Today", color: "coral", village: "Sunam Hub" },
  { name: "Ramesh Pawar", initials: "RP", crop: "Tomato", qty: "240 kg", status: "Visit due", last: "Today", color: "gold", village: "Chincholi" },
  { name: "Sunita Jadhav", initials: "SJ", crop: "Onion", qty: "180 kg", status: "Visit due", last: "Yesterday", color: "blue", village: "Pimpalgaon" },
  { name: "Ganesh Shinde", initials: "GS", crop: "Tomato", qty: "95 kg", status: "Collected", last: "12 Sep 2026", color: "mint", village: "Nandur" },
  { name: "Meena Kolhe", initials: "MK", crop: "Green chilli", qty: "72 kg", status: "Approved", last: "10 Sep 2026", color: "purple", village: "Khadakwasla" },
  { name: "Vilas More", initials: "VM", crop: "Onion", qty: "310 kg", status: "Delivered", last: "08 Sep 2026", color: "coral", village: "Satpur" },
];

const NAV_ITEMS: { key: TabKey; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; description: string }[] = [
  { key: "tasks", label: "Tasks", icon: ClipboardCheck, description: "Your visits for today" },
  { key: "farmers", label: "My Farmers", icon: UsersRound, description: "People in your area" },
  { key: "region", label: "Region & Stock", icon: Map, description: "Villages and inventory" },
  { key: "earnings", label: "Earnings", icon: WalletCards, description: "Fees and bonuses" },
  { key: "profile", label: "Profile", icon: UserRound, description: "Your account" },
];

export const FieldAgentPortalLayout: React.FC<FieldAgentPortalLayoutProps> = ({ onSwitchPersona, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabKey>("tasks");
  const [tasksList] = useState(INITIAL_TASKS);
  const [activeTask, setActiveTask] = useState<(typeof INITIAL_TASKS)[number] | null>(null);
  const [flowStep, setFlowStep] = useState<FlowStep>(1);
  const [grade, setGrade] = useState("A");
  const [scores, setScores] = useState({ Color: 4, Smell: 5, Damage: 4, Freshness: 5, Moisture: 4 });
  const [weight, setWeight] = useState(240);
  const [scalePhoto, setScalePhoto] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"digital" | "cash">("digital");
  const [recording, setRecording] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showFirstTimeTutorial, setShowFirstTimeTutorial] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tasksCompleted, setTasksCompleted] = useState<string[]>([]);
  const [language, setLanguage] = useState<"mr" | "hi" | "en">("hi");

  useEffect(() => {
    try {
      if (!window.localStorage.getItem("saathi-field-agent-tutorial-seen")) {
        setShowFirstTimeTutorial(true);
      }
    } catch {
      // safe fallback
    }
  }, []);

  const qualityAverage = useMemo(() => {
    const values = Object.values(scores);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  }, [scores]);

  const goTo = (tab: TabKey) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCollection = (task: (typeof INITIAL_TASKS)[number]) => {
    setActiveTask(task);
    setGrade(task.grade);
    setFlowStep(1);
    setScalePhoto(false);
    setPaymentMode("digital");
  };

  const closeCollection = () => setActiveTask(null);

  const submitCollection = () => {
    if (!activeTask) return;
    setTasksCompleted((previous) => Array.from(new Set([...previous, activeTask.id])));
    confetti({ particleCount: 60, spread: 70 });
    toast.success("Collection verified and locked!", {
      description: `${activeTask.farmer}'s batch of ${weight}kg (${activeTask.crop}) is verified with scale photo & quality score ${qualityAverage}/5.`,
    });
    closeCollection();
    setActiveTab("tasks");
  };

  const copyReferral = () => {
    try {
      navigator.clipboard?.writeText("KISAN-SAATHI-ARUN");
    } catch {}
    toast.success("Referral code copied!", { description: "Share KISAN-SAATHI-ARUN with new farmers to earn ₹500 onboarding bonus." });
  };

  const finishTutorial = () => {
    try {
      window.localStorage.setItem("saathi-field-agent-tutorial-seen", "true");
    } catch {}
    setShowFirstTimeTutorial(false);
    setShowGuide(false);
  };

  const renderPage = () => {
    if (activeTab === "tasks") return <TasksPage tasks={tasksList} completed={tasksCompleted} onStart={openCollection} />;
    if (activeTab === "farmers") return <FarmersPage searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
    if (activeTab === "region") return <RegionPage />;
    if (activeTab === "earnings") return <EarningsPage onCopy={copyReferral} />;
    return <ProfilePage onGuide={() => setShowGuide(true)} />;
  };

  return (
    <div className="field-agent-portal app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand-lockup" onClick={() => goTo("tasks")} role="button" tabIndex={0}>
          <div className="brand-mark"><Leaf size={21} strokeWidth={2.8} /></div>
          <div>
            <div className="brand-name">Saath<span>i</span></div>
            <div className="brand-caption">Kisan Jod Field Ops</div>
          </div>
        </div>

        <div className="side-section-label">WORKSPACE</div>
        <nav className="side-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`side-nav-item ${activeTab === item.key ? "active" : ""}`}
                onClick={() => goTo(item.key)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                {activeTab === item.key && <span className="active-pip" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-spacer" />

        {/* Persona Switcher Links inside Field Agent for quick testing */}
        {onSwitchPersona && (
          <div className="px-1 py-2 mb-2 border-t border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 block px-2 mb-1.5 uppercase tracking-wider">
              Switch Portal
            </span>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => onSwitchPersona('farmer')}
                className="text-left text-xs font-semibold px-2 py-1.5 rounded-lg hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                🌾 Farmer Application
              </button>
              <button
                onClick={() => onSwitchPersona('company')}
                className="text-left text-xs font-semibold px-2 py-1.5 rounded-lg hover:bg-blue-50 text-slate-600 hover:text-blue-800 transition-colors cursor-pointer"
              >
                🏢 Industrial Buyer Portal
              </button>
              <button
                onClick={() => onSwitchPersona('logistics')}
                className="text-left text-xs font-semibold px-2 py-1.5 rounded-lg hover:bg-purple-50 text-slate-600 hover:text-purple-800 transition-colors cursor-pointer"
              >
                🚚 Logistics Fleet Portal
              </button>
              <button
                onClick={() => onSwitchPersona('admin')}
                className="text-left text-xs font-semibold px-2 py-1.5 rounded-lg hover:bg-amber-50 text-amber-700 hover:text-amber-900 transition-colors cursor-pointer"
              >
                👑 Admin Command Center
              </button>
            </div>
          </div>
        )}

        <button className="guide-card cursor-pointer" onClick={() => setShowGuide(true)}>
          <div className="guide-icon"><BookOpen size={18} /></div>
          <div><strong>Quick guide</strong><span>Learn field app in 60s</span></div>
          <ArrowRight size={16} />
        </button>

        <div className="side-user">
          <div className="avatar avatar-teal">AK</div>
          <div className="side-user-text">
            <strong>Arun Khot</strong>
            <span>Field Officer · Punjab & Nashik</span>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* Main Stage */}
      <main className="main-stage">
        <header className="topbar">
          <div className="mobile-brand">
            <div className="brand-mark small"><Leaf size={16} /></div>
            <span>Saathi Field Ops</span>
          </div>

          <div className="breadcrumb">
            <span>Kisan Jod Workspace</span>
            <ChevronRight size={14} />
            <strong>{NAV_ITEMS.find((item) => item.key === activeTab)?.label}</strong>
          </div>

          <div className="top-actions">
            {/* Language Selector */}
            <button
              className="language-select cursor-pointer"
              onClick={() => {
                const nextLang = language === 'hi' ? 'mr' : language === 'mr' ? 'en' : 'hi';
                setLanguage(nextLang);
                toast.info(`Language changed to ${nextLang === 'hi' ? 'हिंदी' : nextLang === 'mr' ? 'मराठी' : 'English'}`);
              }}
            >
              <span className="flag-dot">{language === 'hi' ? 'अ' : language === 'mr' ? 'म' : 'En'}</span>
              <span className="language-label">{language === 'hi' ? 'हिंदी' : language === 'mr' ? 'मराठी' : 'English'}</span>
              <ChevronDown size={14} />
            </button>

            {/* Voice Assistant Trigger */}
            <button
              className="icon-button voice-button cursor-pointer"
              onClick={() => toast.success("Voice Assistant listening…", { description: "Try saying: 'Show today’s priority collection visits'" })}
              aria-label="Voice assistant"
              title="AI Voice Assistant"
            >
              <Mic size={18} />
            </button>

            {/* Notifications */}
            <button
              className="icon-button notification-button cursor-pointer"
              onClick={() => setShowNotifications((value) => !value)}
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span className="notification-dot" />
            </button>

            {/* User Avatar */}
            <div className="top-avatar avatar avatar-teal">AK</div>
          </div>

          {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
        </header>

        <div className="page-wrap">{renderPage()}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              className={activeTab === item.key ? "active" : ""}
              onClick={() => goTo(item.key)}
            >
              <Icon size={20} />
              <span>{item.label.replace(" & Stock", "")}</span>
            </button>
          );
        })}
      </nav>

      {/* 5-Step Collection Modal */}
      {activeTask && (
        <CollectionModal
          task={activeTask}
          step={flowStep}
          setStep={setFlowStep}
          grade={grade}
          setGrade={setGrade}
          scores={scores}
          setScores={setScores}
          average={qualityAverage}
          weight={weight}
          setWeight={setWeight}
          scalePhoto={scalePhoto}
          setScalePhoto={setScalePhoto}
          paymentMode={paymentMode}
          setPaymentMode={setPaymentMode}
          recording={recording}
          setRecording={setRecording}
          onClose={closeCollection}
          onSubmit={submitCollection}
        />
      )}

      {showGuide && <FirstTimeTutorial onClose={finishTutorial} />}
      {showFirstTimeTutorial && <FirstTimeTutorial onClose={finishTutorial} />}
      <Toaster position="bottom-right" richColors />
    </div>
  );
};

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <div className="heading-action">{action}</div>}
    </div>
  );
}

function SyncPill() {
  return (
    <div className="sync-pill">
      <span className="sync-status-dot" />
      <CloudOff size={15} />
      <span>3 offline records pending sync</span>
      <button onClick={() => toast.success("Offline records synced!", { description: "All collection receipts and scale weights are backed up to Kisan Jod cloud." })}>
        Sync now
      </button>
    </div>
  );
}

function TasksPage({ tasks, completed, onStart }: { tasks: typeof INITIAL_TASKS; completed: string[]; onStart: (task: (typeof INITIAL_TASKS)[number]) => void }) {
  const outstanding = tasks.filter((task) => !completed.includes(task.id));
  return (
    <>
      <PageHeading
        eyebrow="FIELD OPERATIONS ROUTE"
        title="Good morning, Arun"
        description="Here is your verified collection schedule for today. Start with priority 1 visits to ensure weighbridge certificates match incoming carrier dispatches."
        action={
          <button className="primary-button compact cursor-pointer" onClick={() => toast.info("Route View", { description: "GPS navigation loaded for 4 collection checkpoints in your assigned cluster." })}>
            <LocateFixed size={17} /> View GPS Route
          </button>
        }
      />
      <div className="dashboard-grid">
        <section className="main-column">
          <SyncPill />
          <div className="section-title-row">
            <div>
              <h2>Today's Collection Route</h2>
              <span className="section-meta">{outstanding.length} visits remaining · Sorted by harvest urgency</span>
            </div>
            <div className="route-progress">
              <span>{tasks.length - outstanding.length}/{tasks.length}</span>
              <div className="mini-progress">
                <i style={{ width: `${((tasks.length - outstanding.length) / tasks.length) * 100}%` }} />
              </div>
            </div>
          </div>
          <div className="task-stack">
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} completed={completed.includes(task.id)} onStart={onStart} index={index} />
            ))}
          </div>
        </section>

        <aside className="right-column">
          <div className="day-card depth-card">
            <div className="day-card-top">
              <div>
                <span className="eyebrow light">YOUR PERFORMANCE</span>
                <h3>Today's Target</h3>
              </div>
              <div className="sun-orb"><SunMedium size={26} /></div>
            </div>
            <div className="day-count">
              <strong>{tasks.length - outstanding.length}</strong>
              <span>of {tasks.length}<br />farmer visits verified</span>
            </div>
            <div className="day-bar">
              <span style={{ width: `${((tasks.length - outstanding.length) / tasks.length) * 100}%` }} />
            </div>
            <div className="day-footer">
              <span><Clock3 size={14} /> Last sync 08:42 AM</span>
              <span className="good-text">SLA 100% On Track</span>
            </div>
          </div>

          <div className="mini-panel depth-card">
            <div className="panel-heading">
              <h3>Batch Status Pipeline</h3>
              <button onClick={() => toast.info("Batch Pipeline", { description: "Live batches aggregated across assigned regional warehouses." })}>
                See all <ArrowRight size={14} />
              </button>
            </div>
            <StatusRow icon={<CheckCircle2 size={17} />} color="green" label="Weighbridge Certified" value="2 batches" />
            <StatusRow icon={<PackageCheck size={17} />} color="orange" label="QC Grade Approved" value="1 batch" />
            <StatusRow icon={<Truck size={17} />} color="blue" label="Freight Dispatched" value="3 batches" />
          </div>

          <div className="help-card">
            <div className="help-icon"><MessageCircle size={18} /></div>
            <div>
              <strong>Field Support Helpline</strong>
              <span>24/7 Priority Manager Line</span>
            </div>
            <button className="cursor-pointer" onClick={() => toast.success("Dialing Operations Desk...", { description: "Toll-Free: 1800-889-KISAN" })}>
              <Phone size={16} />
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

function TaskCard({ task, completed, onStart, index }: { task: (typeof INITIAL_TASKS)[number]; completed: boolean; onStart: (task: (typeof INITIAL_TASKS)[number]) => void; index: number }) {
  return (
    <article className={`task-card depth-card ${completed ? "is-complete" : ""}`} style={{ "--delay": `${index * 60}ms` } as React.CSSProperties}>
      <div className={`task-number ${completed ? "done" : ""}`}>{completed ? <Check size={16} /> : task.priority}</div>
      <div className={`crop-avatar tone-${task.tone}`}>
        <span>{task.crop === "Tomato" ? "🍅" : task.crop === "Onion" ? "🧅" : task.crop === "Green chilli" ? "🌶️" : "🌾"}</span>
      </div>
      <div className="task-info">
        <div className="task-name-row">
          <h3>{task.farmer}</h3>
          {completed ? (
            <span className="status-chip success"><CheckCircle2 size={12} /> Intake Certified</span>
          ) : (
            <span className="time-chip"><Clock3 size={12} /> ETA {task.eta}</span>
          )}
        </div>
        <div className="task-details">
          <span><Leaf size={14} /> {task.crop} · {task.variety}</span>
          <span><Boxes size={14} /> {task.quantity}</span>
          <span><LocateFixed size={14} /> {task.distance} away</span>
        </div>
        <div className="task-location">{task.village} Village Hub <span>·</span> Phone: {task.phone}</div>
      </div>
      <div className="task-actions">
        <a className="call-link" href={`tel:${task.phone}`} onClick={() => toast.info(`Connecting phone call to ${task.farmer}`)}>
          <Phone size={15} /> Call
        </a>
        <button
          className={`primary-button cursor-pointer ${completed ? "ghost-success" : ""}`}
          onClick={() => !completed && onStart(task)}
        >
          {completed ? "Certified Batch" : "Start Intake"}
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}

function StatusRow({ icon, color, label, value }: { icon: React.ReactNode; color: string; label: string; value: string }) {
  return (
    <div className="status-row">
      <span className={`status-icon ${color}`}>{icon}</span>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FarmersPage({ searchTerm, setSearchTerm }: { searchTerm: string; setSearchTerm: (value: string) => void }) {
  const filtered = INITIAL_FARMERS.filter(
    (farmer) =>
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PageHeading
        eyebrow="ON-GROUND ROSTER"
        title="My Assigned Farmers"
        description="Search registered farmers, track weighbridge intake histories, and view referral onboarding commissions."
        action={
          <button className="primary-button compact cursor-pointer" onClick={() => toast.success("Farmer Onboarding", { description: "Use referral code KISAN-SAATHI-ARUN to enroll a new farmer and earn ₹500." })}>
            <UsersRound size={17} /> Onboard New Farmer
          </button>
        }
      />
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by farmer name, crop, or village..."
          />
        </div>
        <button className="filter-button cursor-pointer" onClick={() => toast.info("Filter Roster", { description: "Showing all active assigned producers." })}>
          <Settings2 size={17} /> Filters
        </button>
        <span className="result-count">{filtered.length} Farmers Assigned</span>
      </div>

      <div className="farmers-layout">
        <section className="farmer-list depth-card">
          <div className="list-header">
            <span>FARMER & VILLAGE</span>
            <span>CROP & ESTIMATE</span>
            <span>INTAKE STATUS</span>
            <span>LAST ACTIVITY</span>
            <span />
          </div>
          {filtered.map((farmer) => (
            <div className="farmer-row" key={farmer.name}>
              <div className="farmer-person">
                <div className={`avatar avatar-${farmer.color}`}>{farmer.initials}</div>
                <div>
                  <strong>{farmer.name}</strong>
                  <span>{farmer.village}</span>
                </div>
              </div>
              <div className="farmer-crop">
                <strong>{farmer.crop}</strong>
                <span>{farmer.qty}</span>
              </div>
              <div>
                <span className={`status-chip ${farmer.status === "Visit due" ? "warning" : farmer.status === "Delivered" ? "success" : "info"}`}>
                  {farmer.status}
                </span>
              </div>
              <div className="last-date">{farmer.last}</div>
              <button
                className="row-arrow cursor-pointer"
                onClick={() => toast.info(`${farmer.name}'s Profile`, { description: `Farmer KYC & DBT Bank account verified for ${farmer.name}.` })}
              >
                <ChevronRight size={17} />
              </button>
            </div>
          ))}
        </section>

        <aside className="farmer-side">
          <div className="tip-card depth-card">
            <div className="tip-top">
              <Sparkles size={18} />
              <span>Standard of Trust</span>
            </div>
            <h3>Transparent Scale Calibration</h3>
            <p>Always show the digital scale screen and capture the scale display photo before requesting the farmer's biometric or OTP signoff.</p>
            <button className="text-button cursor-pointer" onClick={() => toast.info("Trust Protocol", { description: "1. Calibrate scale to 0.00kg. 2. Capture clear photo. 3. Confirm payment advance." })}>
              View Verification Protocol <ArrowRight size={15} />
            </button>
          </div>

          <div className="farmer-stat-grid">
            <div className="stat-card">
              <span>Active This Month</span>
              <strong>18</strong>
              <small>+3 from last cycle</small>
            </div>
            <div className="stat-card">
              <span>Total Onboarded</span>
              <strong>42</strong>
              <small>Across 5 cluster villages</small>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function RegionPage() {
  const villages = [
    { name: "Chincholi Hub", count: "8 farmers", active: true },
    { name: "Pimpalgaon North", count: "12 farmers", active: false },
    { name: "Nandur Sector", count: "6 farmers", active: false },
    { name: "Khadakwasla West", count: "9 farmers", active: false },
  ];

  return (
    <>
      <PageHeading
        eyebrow="TERRITORY & STORAGE"
        title="Region & Cold Storage"
        description="Inspect assigned rural territory hubs, nearby weighbridge scales, and cold storage capacity utilization."
        action={
          <div className="view-toggle">
            <button className="active"><Map size={15} /> Map View</button>
            <button className="cursor-pointer" onClick={() => toast.info("List View", { description: "Switched to tabular village coordinates." })}>
              <MoreHorizontal size={15} /> List
            </button>
          </div>
        }
      />
      <div className="region-grid">
        <section className="map-card depth-card">
          <div className="map-toolbar">
            <div>
              <strong>Nashik & Ludhiana Operational Zone</strong>
              <span>4 collection sectors · Updated 08:42 AM</span>
            </div>
            <button className="cursor-pointer" onClick={() => toast.success("Location re-centered on active weighbridge checkpoint.")}>
              <LocateFixed size={16} />
            </button>
          </div>
          <div className="map-visual">
            <div className="map-road road-one" />
            <div className="map-road road-two" />
            <div className="map-road road-three" />
            <div className="map-water" />
            <div className="map-pulse p1"><span>8</span><small>Chincholi</small></div>
            <div className="map-pulse p2"><span>12</span><small>Pimpalgaon</small></div>
            <div className="map-pulse p3"><span>6</span><small>Nandur</small></div>
            <div className="map-pulse p4"><span>9</span><small>Khadakwasla</small></div>
            <div className="map-you"><LocateFixed size={16} /><span>You (Active)</span></div>
          </div>
          <div className="map-legend">
            <span><i className="legend-dot green" /> Village Clusters</span>
            <span><i className="legend-dot yellow" /> Cold Storage Hub</span>
            <span><i className="legend-dot blue" /> Field Agent GPS</span>
          </div>
        </section>

        <aside className="region-side">
          <div className="storage-card depth-card">
            <div className="storage-heading">
              <div className="storage-icon"><Boxes size={19} /></div>
              <div>
                <span className="eyebrow">ASSIGNED WAREHOUSE</span>
                <h3>Shree Kisan Cold Storage</h3>
              </div>
              <button className="cursor-pointer" onClick={() => toast.success("Connecting to Warehouse Manager: Mahesh Patil (+91 98220 55441)")}>
                <Phone size={15} />
              </button>
            </div>
            <div className="storage-details">
              <span><LocateFixed size={14} /> Sector 14, MIDC Industrial Hub</span>
              <span><UserRound size={14} /> Manager: Mahesh Patil</span>
            </div>
            <div className="cold-strip">
              <span>Cold Storage Available</span>
              <strong>68% Free</strong>
              <div><i style={{ width: "68%" }} /></div>
            </div>
          </div>

          <div className="inventory-card depth-card">
            <div className="panel-heading">
              <div>
                <h3>Intake Stock Batches</h3>
                <span>1,280 kg aggregated produce in transit</span>
              </div>
              <button className="cursor-pointer" onClick={() => toast.info("Batch Breakdown", { description: "Inspection breakdown across Tomato, Onion, and Chilli." })}>
                Details <ArrowRight size={14} />
              </button>
            </div>
            <InventoryRow name="Tomato (Hybrid)" grade="A" qty="540 kg" percent={75} color="coral" />
            <InventoryRow name="Red Onion (Kanda)" grade="B" qty="420 kg" percent={58} color="gold" />
            <InventoryRow name="Green Chilli (Jwala)" grade="A" qty="320 kg" percent={42} color="mint" />
          </div>
        </aside>
      </div>

      <div className="village-strip">
        <div>
          <span className="eyebrow">COLLECTION CORRIDOR</span>
          <h3>Cluster Villages</h3>
        </div>
        {villages.map((village) => (
          <button
            className={`village-chip cursor-pointer ${village.active ? "active" : ""}`}
            key={village.name}
            onClick={() => toast.info(`${village.name} Details`, { description: `${village.count} scheduled for aggregation.` })}
          >
            <span className="village-pin" />
            <span>
              <strong>{village.name}</strong>
              <small>{village.count}</small>
            </span>
            <ChevronRight size={15} />
          </button>
        ))}
      </div>
    </>
  );
}

function InventoryRow({ name, grade, qty, percent, color }: { name: string; grade: string; qty: string; percent: number; color: string }) {
  return (
    <div className="inventory-row">
      <div className={`inventory-bullet ${color}`} />
      <div className="inventory-name">
        <strong>{name}</strong>
        <span>Grade {grade}</span>
      </div>
      <div className="inventory-progress"><i style={{ width: `${percent}%` }} /></div>
      <strong className="inventory-qty">{qty}</strong>
    </div>
  );
}

function EarningsPage({ onCopy }: { onCopy: () => void }) {
  return (
    <>
      <PageHeading
        eyebrow="FIELD AGENT LEDGER"
        title="My Commissions & Payouts"
        description="Every verified weighbridge certification earns a guaranteed ₹400 fixed verification fee plus ₹500 for every farmer onboarded."
        action={
          <button className="outline-button compact cursor-pointer" onClick={() => toast.success("Statement Generated", { description: "September 2026 Statement downloaded as PDF." })}>
            <FileCheck2 size={17} /> Download Statement
          </button>
        }
      />

      <div className="earnings-top">
        <div className="total-earnings depth-card">
          <div className="eyebrow light">TOTAL EARNINGS (THIS CYCLE)</div>
          <div className="money">
            <IndianRupee size={26} />
            <strong>₹18,460</strong>
          </div>
          <div className="earnings-change">
            <ArrowDownRight size={15} /> ₹2,400 pending final warehouse intake approval
          </div>
          <div className="money-bar"><i style={{ width: "78%" }} /></div>
          <span className="bar-caption">
            <span>₹18,460 Credited to DBT Account</span>
            <span>Target: ₹24,000</span>
          </span>
        </div>

        <div className="earnings-stat">
          <div className="stat-icon green"><CheckCircle2 size={19} /></div>
          <span>Verified Scale Audits</span>
          <strong>46</strong>
          <small>+8 this week</small>
        </div>

        <div className="earnings-stat">
          <div className="stat-icon purple"><Award size={19} /></div>
          <span>Referral Commissions</span>
          <strong>₹2,400</strong>
          <small>4 new farmers active</small>
        </div>
      </div>

      <div className="ledger-layout">
        <section className="ledger-card depth-card">
          <div className="panel-heading">
            <div>
              <h3>Payout Audit Ledger</h3>
              <span>Transparent itemized disbursements per verified task</span>
            </div>
            <button className="cursor-pointer" onClick={() => toast.info("Audit Period", { description: "Displaying cycle 01 Sep – 30 Sep 2026." })}>
              This Month <ChevronDown size={14} />
            </button>
          </div>
          <div className="ledger-list">
            <LedgerRow date="12 Sep" title="Weighbridge Certification · Tomato Grade-A" detail="TSK-1048 · 240 kg verified · Ramesh Pawar" amount="+ ₹400" />
            <LedgerRow date="11 Sep" title="Weighbridge Certification · Onion Grade-B" detail="TSK-1049 · 180 kg verified · Sunita Jadhav" amount="+ ₹400" />
            <LedgerRow date="10 Sep" title="Farmer Onboarding Commission" detail="Gurdev Singh completed first 500kg intake" amount="+ ₹600" accent="purple" />
            <LedgerRow date="09 Sep" title="Weighbridge Certification · Green Chilli" detail="TSK-1033 · 72 kg verified · Meena Kolhe" amount="+ ₹400" />
            <LedgerRow date="08 Sep" title="Field Travel & Fuel Support Allowance" detail="Cluster North mobility reimbursement" amount="+ ₹2,000" accent="orange" />
          </div>
        </section>

        <aside className="referral-card depth-card">
          <div className="referral-top">
            <div className="referral-icon"><QrCode size={21} /></div>
            <span>AGENT REFERRAL PASS</span>
          </div>
          <h3>Empower Farmers,<br /><em>Grow Earnings.</em></h3>
          <p>Share your agent code with smallholder farmers in your territory to link them to direct B2B corporate buyers.</p>
          <div className="referral-code">
            <strong>KISAN-SAATHI-ARUN</strong>
            <button className="cursor-pointer" onClick={onCopy} title="Copy referral code"><Copy size={16} /></button>
          </div>
          <button className="share-button cursor-pointer" onClick={onCopy}>
            Share Referral Pass <ArrowRight size={16} />
          </button>
          <div className="referral-status">
            <span><i className="status-dot green" /> 4 Bonuses Settled (₹2,400)</span>
            <span><i className="status-dot orange" /> 2 Farmers Awaiting First Harvest</span>
          </div>
        </aside>
      </div>
    </>
  );
}

function LedgerRow({ date, title, detail, amount, accent = "green" }: { date: string; title: string; detail: string; amount: string; accent?: string }) {
  return (
    <div className="ledger-row">
      <div className="ledger-date">{date}</div>
      <div className={`ledger-icon ${accent}`}><IndianRupee size={16} /></div>
      <div className="ledger-copy">
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
      <strong className="ledger-amount">{amount}</strong>
    </div>
  );
}

function ProfilePage({ onGuide }: { onGuide: () => void }) {
  return (
    <>
      <PageHeading
        eyebrow="AGENT CREDENTIALS"
        title="Profile & Field Officer SLA"
        description="Inspect on-ground verification credentials, rating metrics, and platform performance audit compliance."
        action={
          <button className="outline-button compact cursor-pointer" onClick={() => toast.success("Profile verified with Aadhaar and Field Certification.")}>
            Verified Credential <ArrowRight size={16} />
          </button>
        }
      />
      <div className="profile-layout">
        <section className="profile-main">
          <div className="id-card depth-card">
            <div className="id-card-pattern" />
            <div className="id-card-top">
              <div className="large-avatar">AK</div>
              <div>
                <span className="eyebrow light">OFFICIAL CERTIFIED AGENT ID</span>
                <h2>Arun Khot</h2>
                <p>Employee License · KJ-AGT-04821</p>
              </div>
              <div className="id-badge"><ShieldCheck size={16} /> Govt Certified</div>
            </div>
            <div className="id-card-footer">
              <span><Phone size={14} /> +91 98765 22104</span>
              <span><Map size={14} /> Punjab & Nashik East Corridor</span>
              <span><CalendarDays size={14} /> Verified Member since 2024</span>
            </div>
          </div>

          <div className="performance-card depth-card">
            <div className="panel-heading">
              <div>
                <h3>Field Quality Rating</h3>
                <span>Reviewed bi-weekly by Platform Governance</span>
              </div>
              <span className="rating-pill"><Star size={14} fill="currentColor" /> 4.6 <small>/ 5.0</small></span>
            </div>
            <div className="performance-body">
              <div className="ring-chart">
                <div>
                  <strong>4.6</strong>
                  <span>High Trust</span>
                </div>
              </div>
              <div className="factor-list">
                <Factor label="Scale Calibration Accuracy" score="4.8" value={92} color="green" />
                <Factor label="Inspection Speed & Arrival SLA" score="4.5" value={85} color="blue" />
                <Factor label="Farmer Transparency & Zero Grievance" score="4.6" value={88} color="purple" />
                <p><CircleHelp size={14} /> Ratings are compiled from weighbridge scale accuracy, timely intakes, and zero buyer quality rejections.</p>
              </div>
            </div>
          </div>

          <div className="dashboard-stats">
            <div>
              <span><ClipboardCheck size={15} /> Inspections Done</span>
              <strong>46</strong>
              <small>+8 this cycle</small>
            </div>
            <div>
              <span><UsersRound size={15} /> Farmers Onboarded</span>
              <strong>42</strong>
              <small>Across 5 villages</small>
            </div>
            <div>
              <span><Boxes size={15} /> Total Volume</span>
              <strong>2.8 Tons</strong>
              <small>+420 kg this week</small>
            </div>
            <div>
              <span><Truck size={15} /> Transit Success</span>
              <strong>98.4%</strong>
              <small>Top 5% in Region</small>
            </div>
          </div>
        </section>

        <aside className="profile-side">
          <div className="quick-links depth-card">
            <div className="panel-heading">
              <h3>Operating References</h3>
            </div>
            <button className="cursor-pointer" onClick={() => toast.info("Crop Grading Rules", { description: "Grade A: Firm, uniform color, zero physical injury. Grade B: Commercial standard. Grade C: Processing grade." })}>
              <BookOpen size={18} />
              <span>
                <strong>Grading Quality Reference</strong>
                <small>Size & physical inspection parameters</small>
              </span>
              <ChevronRight size={16} />
            </button>
            <button className="cursor-pointer" onClick={() => toast.info("Procurement Floor Rates", { description: "Direct B2B floor rates: Tomato ₹24/kg · Potato ₹19/kg · Wheat ₹28.50/kg" })}>
              <IndianRupee size={18} />
              <span>
                <strong>B2B Procurement Rate Card</strong>
                <small>Transparent direct buyer payouts</small>
              </span>
              <ChevronRight size={16} />
            </button>
            <button className="cursor-pointer" onClick={onGuide}>
              <CircleHelp size={18} />
              <span>
                <strong>Tutorial & Walkthrough</strong>
                <small>Interactive 60-second operational guide</small>
              </span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="profile-preferences depth-card">
            <div className="panel-heading">
              <h3>System Controls</h3>
            </div>
            <div className="pref-row">
              <span><SunMedium size={17} /> Visual Theme</span>
              <strong>Executive Green <ChevronRight size={14} /></strong>
            </div>
            <div className="pref-row">
              <span><MessageCircle size={17} /> Urgent Assistance</span>
              <button
                onClick={() => toast.success("Connecting to 24/7 Kisan Jod Operations Hotline (1800-889-KISAN)")}
                className="font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Call Support Desk →
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function Factor({ label, score, value, color }: { label: string; score: string; value: number; color: string }) {
  return (
    <div className="factor-row">
      <div>
        <span>{label}</span>
        <strong>{score}</strong>
      </div>
      <div className="factor-bar"><i className={color} style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="notification-panel depth-card">
      <div className="panel-heading">
        <div>
          <h3>System Alerts</h3>
          <span>3 new actionable notifications</span>
        </div>
        <button onClick={onClose}><X size={17} /></button>
      </div>
      <div className="notification-list">
        <NotificationItem icon={<ClipboardCheck size={16} />} title="New Produce Intake Alert" detail="Farmer Ramesh Pawar ready for 240kg Tomato collection" time="8 min ago" />
        <NotificationItem icon={<AlertTriangle size={16} />} title="Carrier Truck Dispatched" detail="Vehicle PB-08-AX-9912 en route to Shree Cold Store" time="24 min ago" />
        <NotificationItem icon={<PackageCheck size={16} />} title="Escrow Payout Released" detail="₹5,760 advance credited for batch BAT-1048-A" time="Yesterday" />
      </div>
      <button className="all-notifications cursor-pointer" onClick={() => { onClose(); toast.info("All notifications cleared."); }}>
        Mark All Read <ArrowRight size={15} />
      </button>
    </div>
  );
}

function NotificationItem({ icon, title, detail, time }: { icon: React.ReactNode; title: string; detail: string; time: string }) {
  return (
    <div className="notification-item">
      <div className="notification-icon">{icon}</div>
      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
        <small>{time}</small>
      </div>
    </div>
  );
}

function CollectionModal({
  task,
  step,
  setStep,
  grade,
  setGrade,
  scores,
  setScores,
  average,
  weight,
  setWeight,
  scalePhoto,
  setScalePhoto,
  paymentMode,
  setPaymentMode,
  recording,
  setRecording,
  onClose,
  onSubmit,
}: {
  task: (typeof INITIAL_TASKS)[number];
  step: FlowStep;
  setStep: (step: FlowStep) => void;
  grade: string;
  setGrade: (grade: string) => void;
  scores: Record<string, number>;
  setScores: React.Dispatch<React.SetStateAction<{ Color: number; Smell: number; Damage: number; Freshness: number; Moisture: number }>>;
  average: string;
  weight: number;
  setWeight: (weight: number) => void;
  scalePhoto: boolean;
  setScalePhoto: (value: boolean) => void;
  paymentMode: "digital" | "cash";
  setPaymentMode: (mode: "digital" | "cash") => void;
  recording: boolean;
  setRecording: (value: boolean) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const stepLabels = ["Size Grade", "Quality Audit", "Weighbridge Scale", "Farmer Advance", "Lock & Submit"];
  const canContinue = step === 3 ? scalePhoto && weight > 0 : step === 4 ? paymentMode === "digital" || !recording : true;
  const next = () => (step < 5 ? setStep((step + 1) as FlowStep) : onSubmit());

  return (
    <div className="modal-backdrop">
      <div className="collection-modal">
        <header className="collection-header">
          <button className="back-button cursor-pointer" onClick={onClose}><ArrowLeft size={18} /></button>
          <div>
            <span className="eyebrow">INTAKE VERIFICATION · {task.id}</span>
            <h2>{task.farmer}<span> · {task.crop} ({task.variety})</span></h2>
          </div>
          <button className="close-button cursor-pointer" onClick={onClose}><X size={19} /></button>
        </header>

        <div className="collection-progress">
          <div className="stepper">
            {stepLabels.map((label, index) => (
              <div className={`stepper-item ${step >= index + 1 ? "active" : ""} ${step > index + 1 ? "done" : ""}`} key={label}>
                <span>{step > index + 1 ? <Check size={13} /> : index + 1}</span>
                <small>{label}</small>
              </div>
            ))}
          </div>
          <div className="step-line"><i style={{ width: `${((step - 1) / 4) * 100}%` }} /></div>
        </div>

        <div className="collection-content">
          {step === 1 && <GradeStep grade={grade} setGrade={setGrade} declared={task.grade} />}
          {step === 2 && <QualityStep scores={scores} setScores={setScores} average={average} />}
          {step === 3 && <WeightStep weight={weight} setWeight={setWeight} scalePhoto={scalePhoto} setScalePhoto={setScalePhoto} />}
          {step === 4 && <PaymentStep paymentMode={paymentMode} setPaymentMode={setPaymentMode} recording={recording} setRecording={setRecording} amount={weight * 24} />}
          {step === 5 && <ConfirmStep task={task} grade={grade} average={average} weight={weight} paymentMode={paymentMode} scalePhoto={scalePhoto} />}
        </div>

        <footer className="collection-footer">
          <span className="save-note"><ShieldCheck size={15} /> 256-Bit Cryptographic Chain of Custody Record</span>
          <div>
            <button className="outline-button cursor-pointer" onClick={onClose}>Save Draft & Exit</button>
            <button className="primary-button cursor-pointer" disabled={!canContinue} onClick={next}>
              {step === 5 ? "Lock & Issue Certificate" : "Continue Next"}
              <ArrowRight size={16} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function GradeStep({ grade, setGrade, declared }: { grade: string; setGrade: (value: string) => void; declared: string }) {
  return (
    <div className="flow-step">
      <div className="flow-intro">
        <div className="flow-icon green"><ClipboardCheck size={22} /></div>
        <div>
          <h3>Step 1: Physical Size & Caliber Grade</h3>
          <p>Inspect the batch alongside the farmer. Confirm the declared classification or adjust based on physical caliber.</p>
        </div>
      </div>
      <div className="declared-grade">
        <span>Farmer Declared Specification</span>
        <strong>Grade {declared}</strong>
        <small>Based on harvest caliber</small>
      </div>
      <div className="grade-options">
        {[
          { key: "A", title: "Premium Export Quality", desc: "Large, firm, uniform shape, zero defects", tone: "green" },
          { key: "B", title: "Commercial Table Grade", desc: "Medium caliber, good coloration, minor cosmetic marks", tone: "orange" },
          { key: "C", title: "Processing & Pulp Grade", desc: "Small caliber, suitable for sauce/puree manufacturing", tone: "blue" },
        ].map((option) => (
          <button
            key={option.key}
            className={`grade-option cursor-pointer ${grade === option.key ? "selected" : ""}`}
            onClick={() => setGrade(option.key)}
          >
            <div className={`grade-letter ${option.tone}`}>{option.key}</div>
            <div>
              <strong>Grade {option.key} · {option.title}</strong>
              <span>{option.desc}</span>
            </div>
            {grade === option.key && <CheckCircle2 size={20} className="grade-check" />}
          </button>
        ))}
      </div>
      <div className="no-photo-note">
        <ShieldCheck size={17} />
        <div>
          <strong>Standardized Visual Caliber Selection</strong>
          <span>Selection is cryptographically signed and locked into the digital weighbridge ledger.</span>
        </div>
      </div>
    </div>
  );
}

function QualityStep({
  scores,
  setScores,
  average,
}: {
  scores: Record<string, number>;
  setScores: React.Dispatch<React.SetStateAction<{ Color: number; Smell: number; Damage: number; Freshness: number; Moisture: number }>>;
  average: string;
}) {
  const labels = [
    { key: "Color", label: "Color Uniformity & Ripeness", icon: "◒" },
    { key: "Smell", label: "Natural Aroma & Odor Profile", icon: "⌁" },
    { key: "Damage", label: "Absence of Bruising & Pests", icon: "◌" },
    { key: "Freshness", label: "Turgidity & Firmness", icon: "✦" },
    { key: "Moisture", label: "Optimal Moisture Content", icon: "◒" },
  ];

  return (
    <div className="flow-step">
      <div className="flow-intro">
        <div className="flow-icon purple"><Sparkles size={22} /></div>
        <div>
          <h3>Step 2: 5-Point Quality Assurance Audit</h3>
          <p>Rate each parameter from 1 (poor) to 5 (excellent). The aggregate QA score is computed automatically.</p>
        </div>
        <div className="quality-total">
          <strong>{average}</strong>
          <div>
            <span>Aggregate QA</span>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={13} fill={star <= Math.round(Number(average)) ? "currentColor" : "none"} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="quality-list">
        {labels.map((item) => (
          <div className="quality-row" key={item.key}>
            <span className="quality-icon">{item.icon}</span>
            <div className="quality-label">
              <strong>{item.label}</strong>
              <span>On-ground tactile assessment</span>
            </div>
            <div className="score-buttons">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  className={`cursor-pointer ${scores[item.key] === score ? "selected" : ""}`}
                  onClick={() => setScores((current) => ({ ...current, [item.key]: score }))}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="no-photo-note">
        <ShieldCheck size={17} />
        <div>
          <strong>Deterministic Quality Metric</strong>
          <span>Buyer dispute desk references this 5-point audit trail if any variance is raised at destination.</span>
        </div>
      </div>
    </div>
  );
}

function WeightStep({
  weight,
  setWeight,
  scalePhoto,
  setScalePhoto,
}: {
  weight: number;
  setWeight: (value: number) => void;
  scalePhoto: boolean;
  setScalePhoto: (value: boolean) => void;
}) {
  return (
    <div className="flow-step">
      <div className="flow-intro">
        <div className="flow-icon orange"><Boxes size={22} /></div>
        <div>
          <h3>Step 3: Certified Weighbridge Intake</h3>
          <p>Enter the net gross weight shown on the calibrated scale and capture the scale display proof.</p>
        </div>
      </div>
      <div className="weight-entry">
        <label>Net Certified Weight (Kilograms)</label>
        <div className="weight-input">
          <input
            type="number"
            value={weight}
            onChange={(event) => setWeight(Number(event.target.value))}
          />
          <span>kg</span>
        </div>
        <span className="field-hint">Confirmed with farmer at the collection checkpoint.</span>
      </div>
      <button
        className={`scale-capture cursor-pointer ${scalePhoto ? "captured" : ""}`}
        onClick={() => {
          setScalePhoto(true);
          toast.success("Scale display photo verified and attached.");
        }}
      >
        <div className="camera-orb">{scalePhoto ? <Check size={24} /> : <Camera size={24} />}</div>
        <div>
          <strong>{scalePhoto ? "Scale Display Photo Attached" : "Capture Scale Display Photo"}</strong>
          <span>{scalePhoto ? "Digital proof uploaded (IMG_SCALE_1048.jpg)" : "Required before submitting weighbridge intake"}</span>
        </div>
        <ChevronRight size={18} />
      </button>
      <div className="photo-rule">
        <Camera size={15} />
        <span>Scale display evidence is stored on the Kisan Jod tamper-proof ledger to prevent transit shrinkage disputes.</span>
      </div>
    </div>
  );
}

function PaymentStep({
  paymentMode,
  setPaymentMode,
  recording,
  setRecording,
  amount,
}: {
  paymentMode: "digital" | "cash";
  setPaymentMode: (mode: "digital" | "cash") => void;
  recording: boolean;
  setRecording: (value: boolean) => void;
  amount: number;
}) {
  const advanceAmount = Math.round(amount * 0.3);

  return (
    <div className="flow-step">
      <div className="flow-intro">
        <div className="flow-icon green"><IndianRupee size={22} /></div>
        <div>
          <h3>Step 4: Immediate 30% Milestone Advance</h3>
          <p>Farmers receive 30% upfront on weighbridge intake, with the remaining 70% released automatically upon warehouse arrival.</p>
        </div>
      </div>
      <div className="payment-amount">
        <span>Instant 30% Intake Advance Due</span>
        <strong>₹{advanceAmount.toLocaleString("en-IN")}</strong>
        <small>Total Batch Valuation: ₹{amount.toLocaleString("en-IN")} ({amount / 24} kg @ ₹24.00/kg)</small>
      </div>
      <div className="payment-toggle">
        <button
          className={`cursor-pointer ${paymentMode === "digital" ? "active" : ""}`}
          onClick={() => setPaymentMode("digital")}
        >
          <IndianRupee size={17} />
          <span>
            <strong>Direct DBT Bank Transfer (Escrow Wire)</strong>
            <small>Automatically initiated to farmer's linked bank account</small>
          </span>
          {paymentMode === "digital" && <CheckCircle2 size={19} />}
        </button>
        <button
          className={`cursor-pointer ${paymentMode === "cash" ? "active" : ""}`}
          onClick={() => setPaymentMode("cash")}
        >
          <MessageCircle size={17} />
          <span>
            <strong>Field Cash Advance (With Voice Signoff)</strong>
            <small>Requires voice acknowledgement recording</small>
          </span>
          {paymentMode === "cash" && <CheckCircle2 size={19} />}
        </button>
      </div>

      {paymentMode === "cash" && (
        <div className={`cash-record ${recording ? "recording" : ""}`}>
          <div
            className="record-button cursor-pointer"
            onClick={() => {
              setRecording(!recording);
              if (!recording) {
                toast.info("Recording voice confirmation clip...", { description: "Speak: 'Farmer [Name] acknowledges receiving ₹" + advanceAmount + " cash advance.'" });
              } else {
                toast.success("Voice confirmation clip recorded.");
              }
            }}
          >
            {recording ? <span className="stop-square" /> : <Mic size={22} />}
          </div>
          <div>
            <strong>{recording ? "Recording Voice Confirmation..." : "Record Farmer Cash Signoff"}</strong>
            <span>{recording ? "Recording 5-second verification clip..." : "Tap mic to record audio proof of cash advance handover."}</span>
          </div>
          <span className="record-time">{recording ? "00:05" : ""}</span>
        </div>
      )}
    </div>
  );
}

function ConfirmStep({
  task,
  grade,
  average,
  weight,
  paymentMode,
}: {
  task: (typeof INITIAL_TASKS)[number];
  grade: string;
  average: string;
  weight: number;
  paymentMode: string;
  scalePhoto: boolean;
}) {
  const batchId = `BAT-${task.id.replace("TSK-", "")}-G${grade}-Q${average.replace(".", "")}`;

  return (
    <div className="flow-step confirm-step">
      <div className="success-orb"><CheckCircle2 size={35} /></div>
      <h3>Ready to Issue Weighbridge Certificate</h3>
      <p>Confirm the details once with the farmer. Once submitted, this batch enters the active freight logistics queue.</p>
      <div className="confirm-summary">
        <div><span>Registered Producer</span><strong>{task.farmer}</strong></div>
        <div><span>Quality Grade</span><strong>Grade {grade}</strong></div>
        <div><span>QA Audit Score</span><strong className="quality-value"><Star size={14} fill="currentColor" /> {average} / 5.0</strong></div>
        <div><span>Certified Net Weight</span><strong>{weight} kg <CheckCircle2 size={14} /></strong></div>
        <div><span>Milestone Payment</span><strong>{paymentMode === "digital" ? "Direct DBT Escrow" : "Cash Voice-Signed"}</strong></div>
      </div>
      <div className="batch-preview">
        <div>
          <span>Assigned Batch Tracking Code</span>
          <strong>{batchId}</strong>
        </div>
        <FileCheck2 size={26} />
      </div>
      <div className="privacy-note">
        <ShieldCheck size={16} />
        <span>Buyer entity remains masked to maintain platform neutrality and prevent direct middleman arbitrage.</span>
      </div>
    </div>
  );
}

function FirstTimeTutorial({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    { key: "mic", label: "Voice Assistant", text: "Use regional voice commands in Hindi or English to check daily routes and scale weights.", icon: <Mic size={18} /> },
    { key: "bell", label: "Operational Alerts", text: "Receive real-time alerts when new farmer harvest requests are allocated to your territory.", icon: <Bell size={18} /> },
    { key: "language", label: "Language Selector", text: "Toggle anytime between Marathi, Hindi, and English.", icon: <ChevronDown size={18} /> },
    { key: "tasks", label: "Scheduled Intake Tasks", text: "Prioritized farmer visits sorted by distance, harvest freshness, and buyer demand.", icon: <ClipboardCheck size={18} /> },
    { key: "farmers", label: "Farmer Directory", text: "Access your assigned smallholders and view referral earnings.", icon: <UsersRound size={18} /> },
    { key: "region", label: "Region & Cold Storage", text: "Track warehouse capacity utilization and live stock batches.", icon: <Map size={18} /> },
    { key: "earnings", label: "Transparent Fee Ledger", text: "Every certified scale inspection earns a guaranteed ₹400 plus ₹500 referral bonuses.", icon: <WalletCards size={18} /> },
    { key: "profile", label: "Agent SLA & Certification", text: "Review your performance metrics, rating scores, and compliance record.", icon: <UserRound size={18} /> },
  ];

  const current = steps[step];
  const finish = () => onClose();

  return (
    <div className={`tutorial-overlay tutorial-${current.key}`} role="dialog" aria-label="Saathi field quick guide">
      <div className="tutorial-spotlight" />
      <div className="tutorial-card">
        <div className="tutorial-arrow" />
        <div className="tutorial-icon">{current.icon}</div>
        <div className="tutorial-copy">
          <strong>{current.label}</strong>
          <span>{current.text}</span>
        </div>
        <div className="tutorial-controls">
          <button className="tutorial-skip cursor-pointer" onClick={finish}>Skip</button>
          <span>{step + 1} / {steps.length}</span>
          <div>
            <button className="tutorial-back cursor-pointer" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
            <button className="tutorial-next cursor-pointer" onClick={() => (step === steps.length - 1 ? finish() : setStep(step + 1))}>
              {step === steps.length - 1 ? "Start Field Ops" : "Next"}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
