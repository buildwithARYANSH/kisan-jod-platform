import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Bell,
  X,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Download,
  Printer,
  UserPlus,
  AlertTriangle,
  MapPin,
  Truck,
  Building2,
  FileSpreadsheet,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  DollarSign,
  Activity,
  Layers,
  Clock,
  Eye,
  FileText,
  Trash2
} from 'lucide-react';
import {
  COMPANY_MOCK_DATA,
  type CompanyDemand,
  type CompanyOrder,
  type CompanyDispute,
  type TeamMember,
  type CompanyNotification
} from './mockData';
import { broadcastSyncEvent, subscribeToSyncEvents, syncDemandAdded, syncDemandDeleted } from '../../services/unifiedSync';
import { BackendPolicyEngine, CROP_PRICE_CORRIDORS } from '../../services/backendPolicyEngine';
import './companyStyles.css';

type DomainKey =
  | 'overview'
  | 'demand'
  | 'procurement'
  | 'orders'
  | 'tracking'
  | 'payments'
  | 'insights'
  | 'disputes'
  | 'reports'
  | 'team'
  | 'company';

interface CompanyPortalLayoutProps {
  onSwitchPersona?: (persona: 'farmer' | 'company') => void;
}

export const CompanyPortalLayout: React.FC<CompanyPortalLayoutProps> = () => {
  // Domain & Branch State
  const [activeDomain, setActiveDomain] = useState<DomainKey>('overview');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');

  // Master Data State with LocalStorage Persistence
  const [demands, setDemands] = useState<CompanyDemand[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_agricore_demands');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return COMPANY_MOCK_DATA.demands;
    } catch {
      return COMPANY_MOCK_DATA.demands;
    }
  });

  const [orders, setOrders] = useState<CompanyOrder[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_agricore_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return COMPANY_MOCK_DATA.orders;
    } catch {
      return COMPANY_MOCK_DATA.orders;
    }
  });

  const [disputes, setDisputes] = useState<CompanyDispute[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_agricore_disputes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return COMPANY_MOCK_DATA.disputes;
    } catch {
      return COMPANY_MOCK_DATA.disputes;
    }
  });

  const [team] = useState<TeamMember[]>(() => COMPANY_MOCK_DATA.team);
  const [notifications, setNotifications] = useState<CompanyNotification[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_agricore_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return COMPANY_MOCK_DATA.notifications;
    } catch {
      return COMPANY_MOCK_DATA.notifications;
    }
  });

  // UI Interactive State
  const [expandedDemandId, setExpandedDemandId] = useState<string | null>(null);
  const [activeFinancePeriod, setActiveFinancePeriod] = useState<'7D' | '30D' | '1Y'>('7D');
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<'procurement' | 'crop' | 'price' | 'fulfillment' | 'quality' | 'savings'>('procurement');

  // Dynamic Fleet Vehicle based on Selected Branch
  const activeTruck =
    COMPANY_MOCK_DATA.liveFleet.find((t) => t.branchId === selectedBranch) ||
    COMPANY_MOCK_DATA.liveFleet[0];

  // Time-of-Day Environment & Live Clock State
  const [timeOfDayClass, setTimeOfDayClass] = useState<string>('ag-tod-afternoon');
  const [clockString, setClockString] = useState<string>('');

  // Modals & Drawers
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardData, setWizardData] = useState({
    crop: 'Wheat (Sharbati)',
    quantity: 420000,
    unit: 'kg',
    grade: 'Grade A',
    expectedPriceMin: 28.5,
    expectedPriceMax: 29.5,
    date: '2026-09-15',
    time: '17:00',
    branchId: 'BR-DELHI',
    destination: 'Delhi-NCR Mega Plant (Gr. Noida)',
    priority: 'High' as 'Critical' | 'High' | 'Normal',
    advancedSpecs: 'Moisture < 11.5% • Gluten > 11%'
  });
  const [demandSuccessMoment, setDemandSuccessMoment] = useState<CompanyDemand | null>(null);

  const [matchReviewDemand, setMatchReviewDemand] = useState<CompanyDemand | null>(null);
  const [deliveryConfirmOrder, setDeliveryConfirmOrder] = useState<CompanyOrder | null>(null);
  const [selectedBatchModal, setSelectedBatchModal] = useState<typeof COMPANY_MOCK_DATA.batches[0] | null>(null);
  const [disputeModalOpen, setDisputeModalOpen] = useState<boolean>(false);
  const [disputeOrderRef, setDisputeOrderRef] = useState<string>('AG-2048');
  const [disputeType, setDisputeType] = useState<string>('Quantity Weighbridge Variance');
  const [disputeDesc, setDisputeDesc] = useState<string>('');

  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState<boolean>(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState<boolean>(false);
  const [cmdSearchQuery, setCmdSearchQuery] = useState<string>('');

  const [aiAssistantOpen, setAiAssistantOpen] = useState<boolean>(false);
  const [aiAssistantMessages, setAiAssistantMessages] = useState<
    Array<{ role: 'ai' | 'user'; text: string; action?: { text: string; domain: DomainKey } }>
  >([
    {
      role: 'ai',
      text: 'Good day, Vikram. How can I assist your agricultural procurement operations today? Click any suggested inquiry below or ask a question.'
    }
  ]);

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Canvas Refs
  const cursorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overviewFlowCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const trackingMapCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // 1. Clean Time-of-Day & Live Clock (Format: Monday, 24 Aug 2026 • 19:15:00)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      if (hours >= 5 && hours < 12) setTimeOfDayClass('ag-tod-morning');
      else if (hours >= 12 && hours < 17) setTimeOfDayClass('ag-tod-afternoon');
      else if (hours >= 17 && hours < 21) setTimeOfDayClass('ag-tod-evening');
      else setTimeOfDayClass('ag-tod-night');

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayName = days[now.getDay()];
      const date = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setClockString(`${dayName}, ${date} ${monthName} ${year} • ${h}:${m}:${s}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Command Palette (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCmdPaletteOpen(false);
        setIsWizardOpen(false);
        setMatchReviewDemand(null);
        setDeliveryConfirmOrder(null);
        setSelectedBatchModal(null);
        setDisputeModalOpen(false);
        setNotificationDrawerOpen(false);
        setDemandSuccessMoment(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 3. Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem('kisan_agricore_demands', JSON.stringify(demands));
    } catch (e) {
      console.warn(e);
    }
  }, [demands]);

  useEffect(() => {
    try {
      localStorage.setItem('kisan_agricore_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('kisan_agricore_disputes', JSON.stringify(disputes));
    } catch (e) {
      console.warn(e);
    }
  }, [disputes]);

  useEffect(() => {
    try {
      localStorage.setItem('kisan_agricore_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn(e);
    }
  }, [notifications]);

  // 4. Cross-Port & Single Shared DB Reactive Sync Listener
  useEffect(() => {
    const unsubscribe = subscribeToSyncEvents((payload) => {
      if (payload.type === 'DATA_RESET') {
        setDemands(COMPANY_MOCK_DATA.demands);
        setOrders(COMPANY_MOCK_DATA.orders);
        setDisputes(COMPANY_MOCK_DATA.disputes);
        setNotifications(COMPANY_MOCK_DATA.notifications);
      } else if (payload.type === 'CROP_ADDED' && payload.data && payload.data.crop) {
        const newCrop = payload.data.crop;
        setDemands((prev) =>
          prev.map((d) => {
            const isMatch =
              d.id === newCrop.matchedDemandId ||
              d.crop.toLowerCase().includes(newCrop.cropName.toLowerCase()) ||
              newCrop.cropName.toLowerCase().includes(d.crop.toLowerCase());
            if (isMatch) {
              const addedMT = (newCrop.quantity || 0) / 1000;
              const newMatchedMT = (d.matchedMT || 0) + addedMT;
              const newCoveragePct = Math.min(100, Math.round((newMatchedMT / d.requiredMT) * 100));
              const newStatus = newCoveragePct >= 100 ? 'Matched (Reserved)' : 'Partially Matched';
              return {
                ...d,
                matchedMT: newMatchedMT,
                coveragePct: newCoveragePct,
                gapMT: Math.max(0, d.requiredMT - newMatchedMT),
                status: newStatus,
              };
            }
            return d;
          })
        );
      } else if (payload.type === 'CROP_UPDATED' && payload.data && payload.data.crop) {
        const { crop: updatedCrop, delta } = payload.data;
        setDemands((prev) =>
          prev.map((d) => {
            const isMatch =
              d.id === updatedCrop.matchedDemandId ||
              d.crop.toLowerCase().includes(updatedCrop.cropName.toLowerCase()) ||
              updatedCrop.cropName.toLowerCase().includes(d.crop.toLowerCase());
            if (isMatch) {
              const deltaMT = (delta || 0) / 1000;
              const newMatchedMT = Math.max(0, (d.matchedMT || 0) + deltaMT);
              const newCoveragePct = Math.min(100, Math.round((newMatchedMT / d.requiredMT) * 100));
              const newStatus = newCoveragePct >= 100 ? 'Matched (Reserved)' : newCoveragePct > 0 ? 'Partially Matched' : 'Active (Open)';
              return {
                ...d,
                matchedMT: newMatchedMT,
                coveragePct: newCoveragePct,
                gapMT: Math.max(0, d.requiredMT - newMatchedMT),
                status: newStatus,
              };
            }
            return d;
          })
        );
      } else if (payload.type === 'CROP_DELETED' && payload.data && payload.data.crop) {
        const deletedCrop = payload.data.crop;
        setDemands((prev) =>
          prev.map((d) => {
            const isMatch =
              d.id === deletedCrop.matchedDemandId ||
              d.crop.toLowerCase().includes(deletedCrop.cropName.toLowerCase()) ||
              deletedCrop.cropName.toLowerCase().includes(d.crop.toLowerCase());
            if (isMatch) {
              const subMT = (deletedCrop.quantity || 0) / 1000;
              const newMatchedMT = Math.max(0, (d.matchedMT || 0) - subMT);
              const newCoveragePct = Math.min(100, Math.round((newMatchedMT / d.requiredMT) * 100));
              const newStatus = newCoveragePct >= 100 ? 'Matched (Reserved)' : newCoveragePct > 0 ? 'Partially Matched' : 'Active (Open)';
              return {
                ...d,
                matchedMT: newMatchedMT,
                coveragePct: newCoveragePct,
                gapMT: Math.max(0, d.requiredMT - newMatchedMT),
                status: newStatus,
              };
            }
            return d;
          })
        );
      } else if (payload.type === 'DEMAND_DELETED' && payload.data && payload.data.id) {
        setDemands((prev) => prev.filter((d) => d.id !== payload.data.id));
      }
    });
    return unsubscribe;
  }, []);

  // 5. Lightweight Cursor Field Canvas
  useEffect(() => {
    const canvas = cursorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const particleCount = 18;
    const radiusMax = 320;
    const particles = Array.from({ length: particleCount }, () => ({
      relX: (Math.random() - 0.5) * radiusMax * 1.5,
      relY: (Math.random() - 0.5) * radiusMax * 1.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.8 + 1,
      alpha: Math.random() * 0.35 + 0.2
    }));

    let animId: number;
    const renderCursorField = () => {
      ctx.clearRect(0, 0, width, height);

      if (mouse.active && mouse.x > 0 && mouse.y > 0) {
        particles.forEach((p, idx) => {
          p.relX += p.vx;
          p.relY += p.vy;

          const dist = Math.sqrt(p.relX * p.relX + p.relY * p.relY);
          if (dist > radiusMax) {
            p.relX = (p.relX / dist) * (radiusMax - 4);
            p.relY = (p.relY / dist) * (radiusMax - 4);
            p.vx *= -1;
            p.vy *= -1;
          }

          const px = mouse.x + p.relX;
          const py = mouse.y + p.relY;
          const edgeFade = Math.max(0, 1 - dist / radiusMax);

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(74, 222, 128, ${p.alpha * edgeFade})`;
          ctx.fill();

          for (let j = idx + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.relX - p2.relX;
            const dy = p.relY - p2.relY;
            const lineDist = Math.sqrt(dx * dx + dy * dy);

            if (lineDist < 55) {
              const lineAlpha = (1 - lineDist / 55) * 0.12 * edgeFade;
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(mouse.x + p2.relX, mouse.y + p2.relY);
              ctx.strokeStyle = `rgba(74, 222, 128, ${lineAlpha})`;
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
          }
        });
      }

      animId = requestAnimationFrame(renderCursorField);
    };

    renderCursorField();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  // 6. Overview Sourcing Flow Pipeline
  useEffect(() => {
    if (activeDomain !== 'overview') return;
    const canvas = overviewFlowCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parentWidth = canvas.parentElement?.clientWidth || 700;
    canvas.width = parentWidth * 2;
    canvas.height = 180 * 2;
    canvas.style.width = `${parentWidth}px`;
    canvas.style.height = '180px';
    ctx.scale(2, 2);

    const w = parentWidth;
    const h = 180;

    const stages = [
      { label: 'Demand', x: w * 0.08, y: h * 0.5, color: '#34d399', sub: '13,20,000 kg' },
      { label: 'Match', x: w * 0.25, y: h * 0.5, color: '#10b981', sub: '94% Smart' },
      { label: 'Procurement', x: w * 0.44, y: h * 0.5, color: '#f59e0b', sub: '₹28.5/kg' },
      { label: 'Logistics', x: w * 0.62, y: h * 0.5, color: '#3b82f6', sub: '3 Transit' },
      { label: 'Delivery', x: w * 0.8, y: h * 0.5, color: '#10b981', sub: 'Receiving' },
      { label: 'Payment', x: w * 0.94, y: h * 0.5, color: '#eab308', sub: 'Settled' }
    ];

    let tick = 0;
    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      tick += 0.015;

      for (let i = 0; i < stages.length - 1; i++) {
        const s1 = stages[i];
        const s2 = stages[i + 1];

        // Connection Line
        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 2;
        ctx.stroke();

        const progress = (tick * 0.35 + i * 0.2) % 1;
        const px = s1.x + (s2.x - s1.x) * progress;
        const py = s1.y + (s2.y - s1.y) * progress;

        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
      }

      stages.forEach((st, idx) => {
        ctx.beginPath();
        ctx.arc(st.x, st.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = st.color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(st.x, st.y, 11 + Math.sin(tick + idx) * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = '600 11px system-ui, sans-serif';
        ctx.fillStyle = '#f8faf8';
        ctx.textAlign = 'center';
        ctx.fillText(st.label, st.x, st.y - 14);

        ctx.font = '400 10px monospace';
        ctx.fillStyle = '#8e9e92';
        ctx.fillText(st.sub, st.x, st.y + 20);
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeDomain]);

  // 7. Dynamic Tracking Moving Truck Animation based on Branch & City
  useEffect(() => {
    if (activeDomain !== 'tracking') return;
    const canvas = trackingMapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parentWidth = canvas.parentElement?.clientWidth || 800;
    canvas.width = parentWidth * 2;
    canvas.height = 460 * 2;
    canvas.style.width = `${parentWidth}px`;
    canvas.style.height = '460px';
    ctx.scale(2, 2);

    const w = parentWidth;
    const h = 460;

    const currentTruck =
      COMPANY_MOCK_DATA.liveFleet.find((t) => t.branchId === selectedBranch) ||
      COMPANY_MOCK_DATA.liveFleet[0];

    const routeNodes = currentTruck.routeNodes || [
      { label: currentTruck.origin, relX: 0.18, relY: 0.35 },
      { label: currentTruck.activeCheckpoint, relX: 0.5, relY: 0.5 },
      { label: currentTruck.destination, relX: 0.84, relY: 0.65 }
    ];

    const route = routeNodes.map((n) => ({
      x: w * n.relX,
      y: h * n.relY,
      label: n.label
    }));

    let truckT = 0.55;
    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      truckT += 0.0012;
      if (truckT > 1) truckT = 0;

      // Dark Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Dynamic Highway Route Line
      ctx.beginPath();
      ctx.moveTo(route[0].x, route[0].y);
      ctx.quadraticCurveTo(w * 0.42, h * 0.38, route[1].x, route[1].y);
      ctx.quadraticCurveTo(w * 0.68, h * 0.62, route[2].x, route[2].y);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Dynamic Checkpoint & City Node Markers
      route.forEach((pt, idx) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = idx === 1 ? '#f59e0b' : idx === 2 ? '#10b981' : '#3b82f6';
        ctx.fill();

        ctx.font = '600 11px system-ui, sans-serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.fillText(pt.label, pt.x, pt.y - 12);
      });

      // Calculate smooth truck coords
      let curX, curY;
      if (truckT <= 0.5) {
        const subT = truckT / 0.5;
        curX = (1 - subT) * (1 - subT) * route[0].x + 2 * (1 - subT) * subT * (w * 0.42) + subT * subT * route[1].x;
        curY = (1 - subT) * (1 - subT) * route[0].y + 2 * (1 - subT) * subT * (h * 0.38) + subT * subT * route[1].y;
      } else {
        const subT = (truckT - 0.5) / 0.5;
        curX = (1 - subT) * (1 - subT) * route[1].x + 2 * (1 - subT) * subT * (w * 0.68) + subT * subT * route[2].x;
        curY = (1 - subT) * (1 - subT) * route[1].y + 2 * (1 - subT) * subT * (h * 0.62) + subT * subT * route[2].y;
      }

      // Graphical Truck
      ctx.save();
      ctx.translate(curX, curY);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(-14, -8, 28, 16);
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(8, -6, 8, 12);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-8, 9, 3, 0, Math.PI * 2);
      ctx.arc(6, 9, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeDomain, selectedBranch]);

  // Branch Filtering
  const filteredDemands =
    selectedBranch === 'ALL' ? demands : demands.filter((d) => d.branchId === selectedBranch);
  const filteredOrders =
    selectedBranch === 'ALL' ? orders : orders.filter((o) => o.branchId === selectedBranch);

  const totalVolumeKg = filteredDemands.reduce((acc, d) => acc + d.requiredMT * 1000, 0);
  const matchedVolumeKg = filteredDemands.reduce((acc, d) => acc + d.matchedMT * 1000, 0);
  const coveragePct = totalVolumeKg > 0 ? Math.round((matchedVolumeKg / totalVolumeKg) * 100) : 0;

  const handleDeleteDemand = (demandId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const target = demands.find((d) => d.id === demandId);
    const cropName = target?.crop || 'Demand';
    setDemands((prev) => prev.filter((d) => d.id !== demandId));
    if (expandedDemandId === demandId) {
      setExpandedDemandId(null);
    }
    syncDemandDeleted(demandId);
    showToast(`Demand for ${cropName} (${demandId}) removed successfully.`, 'info');
  };

  // CONSTRAINT 14 & 15: Approve Match with Database Lock Check & Configurable 40/60 Split
  const handleApproveSupplyMatch = (demandId: string) => {
    const targetDemand = demands.find((d) => d.id === demandId);
    if (!targetDemand) return;

    const batchId = targetDemand.orderRef ? `BAT-${targetDemand.orderRef}` : `BAT-AUTO-${Math.floor(100 + Math.random() * 900)}`;

    // 1. Enforce No Double Allocation Check (Constraint 14)
    const allocResult = BackendPolicyEngine.allocateBatchToOrder(batchId, targetDemand.orderRef, targetDemand.crop);
    if (!allocResult.success) {
      showToast(allocResult.error || 'Batch already allocated!', 'error');
      return;
    }

    setDemands((prev) =>
      prev.map((d) => {
        if (d.id === demandId) {
          return {
            ...d,
            status: 'Matched (Reserved)',
            coveragePct: 100,
            matchedMT: d.requiredMT,
            gapMT: 0
          };
        }
        return d;
      })
    );

    const exists = orders.some((o) => o.demandId === demandId);
    if (!exists) {
      // 2. Enforce Systematic 40/60 Split Calculation from PlatformConfig (Constraint 15)
      const productCost = targetDemand.targetPricePerMT * targetDemand.requiredMT;
      const paymentCalc = BackendPolicyEngine.calculateOrderPayment(productCost, 250000);

      const newOrder: CompanyOrder = {
        id: targetDemand.orderRef,
        demandId: targetDemand.id,
        crop: targetDemand.crop,
        volumeMT: targetDemand.requiredMT,
        grade: targetDemand.grade,
        branchId: targetDemand.branchId,
        pricePerMT: targetDemand.targetPricePerMT,
        productCostINR: paymentCalc.productCostINR,
        logisticsCostINR: paymentCalc.logisticsCostINR,
        platformFeeINR: paymentCalc.platformFeeINR,
        totalPayableINR: paymentCalc.totalPayableINR,
        advancePaidINR: paymentCalc.advancePayableINR,
        balanceDueINR: paymentCalc.finalPayableINR,
        stage: 'Inventory Reserved',
        expectedDelivery: targetDemand.requiredBy,
        destination: targetDemand.destination,
        truckId: null,
        batchId,
        paymentStatus: `40% Advance Paid (₹${(paymentCalc.advancePayableINR / 100000).toFixed(2)} L) in Escrow`,
        qualityCert: 'NABL-TC-VERIFIED',
        invoiceUrl: '#'
      };
      setOrders((prev) => [newOrder, ...prev]);
      broadcastSyncEvent('QUALITY_VERIFIED', newOrder);
    }

    setMatchReviewDemand(null);
    showToast(`Supply Match Approved! Batch #${batchId} reserved & 40% Escrow Advance locked.`, 'success');
    setActiveDomain('orders');
  };

  const handleConfirmOrderReceipt = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = {
            ...o,
            stage: 'Received & Settled' as const,
            paymentStatus: '100% Settled via RTGS'
          };
          broadcastSyncEvent('DELIVERY_CONFIRMED', updated);
          return updated;
        }
        return o;
      })
    );
    setDeliveryConfirmOrder(null);
    showToast(`Delivery Receipt Confirmed for #${orderId}! 60% Final Settlement released to farmers.`, 'success');
  };

  // CONSTRAINT 16 & 17: Dispute Submission with Rejection Window & Verified Liability Checks
  const handleSubmitDispute = () => {
    const targetOrder = orders.find((o) => o.id === disputeOrderRef);
    const targetBatch = COMPANY_MOCK_DATA.batches.find((b) => b.id === targetOrder?.batchId) || COMPANY_MOCK_DATA.batches[0];

    // 1. Time-Bound 24h Rejection Window Enforcement (Constraint 17)
    if (targetOrder?.stage.includes('Delivered')) {
      const deliveryTime = Date.now() - (4 * 3600 * 1000); // 4h ago mock
      const windowCheck = BackendPolicyEngine.checkRejectionWindow(deliveryTime);
      if (windowCheck.expired) {
        showToast(windowCheck.message, 'error');
        setOrders((prev) =>
          prev.map((o) => (o.id === disputeOrderRef ? { ...o, stage: 'Received & Settled', paymentStatus: '100% Settled (Window Closed)' } : o))
        );
        setDisputeModalOpen(false);
        return;
      }
    }

    // 2. Verified-Compliant Buyer Liability Rule §16 (Constraint 16)
    const allSpecsPassed = targetBatch.attributes.every((a) => a.pass);
    const liabilityResult = BackendPolicyEngine.processConsignmentRejectionOrDispute(
      disputeOrderRef,
      targetBatch.id,
      targetBatch.labCertified,
      allSpecsPassed,
      disputeDesc
    );

    const newDisp: CompanyDispute = {
      id: `DISP-${Math.floor(102 + Math.random() * 50)}`,
      orderRef: disputeOrderRef,
      crop: targetBatch.crop || 'Active Lot',
      type: disputeType,
      description: `${disputeDesc || 'Quality inspection note.'} [${liabilityResult.resolutionNote}]`,
      status: liabilityResult.status,
      submittedDate: 'Just now',
      priority: liabilityResult.liabilityUpheld ? 'High' : 'Normal',
      evidenceFile: 'nabl_intake_assay_manifest.pdf'
    };

    setDisputes((prev) => [newDisp, ...prev]);
    setDisputeModalOpen(false);

    if (liabilityResult.liabilityUpheld) {
      showToast('Buyer Payment Obligation Upheld: NABL Lab Certified Grade A Spec Passed per Policy §16.', 'info');
    } else {
      showToast(`Dispute #${newDisp.id} submitted for quality arbitration.`, 'info');
    }

    setActiveDomain('disputes');
  };

  const handleAskAI = (promptText: string) => {
    setAiAssistantMessages((prev) => [...prev, { role: 'user', text: promptText }]);

    setTimeout(() => {
      if (promptText.includes('tomato') || promptText.includes('Grade A')) {
        setAiAssistantMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: '1,45,000 kg Grade A Hybrid Tomato is currently aggregated at the Kolar basin facility (Brix > 4.8, ₹18.50/kg).',
            action: { text: 'View Sourcing Lot', domain: 'demand' }
          }
        ]);
      } else if (promptText.includes('deliveries') || promptText.includes('tomorrow')) {
        setAiAssistantMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: 'Truck HR-05-BC-7892 (2,50,000 kg Basmati) is arriving tomorrow at 04:00 PM at Delhi-NCR Plant Dock #2.',
            action: { text: 'Track Live Freight', domain: 'tracking' }
          }
        ]);
      } else if (promptText.includes('risk') || promptText.includes('deficit')) {
        setAiAssistantMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: 'Yellow Mustard Demand DEM-0894 has 1,55,000 kg deficit. Seasonal crushing surge requires forward booking.',
            action: { text: 'Forward Book Stock', domain: 'demand' }
          }
        ]);
      } else {
        setAiAssistantMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: 'I analyzed the procurement database and found matching inventory across your regional farmer clusters.',
            action: { text: 'Open Procurement Workspace', domain: 'procurement' }
          }
        ]);
      }
    }, 350);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Demand_ID,Crop,Quantity_Kg,Matched_Kg,Landed_Rate_Per_Kg,Branch,Status\n' +
      demands
        .map(
          (d) =>
            `${d.id},"${d.crop}",${d.requiredMT * 1000},${d.matchedMT * 1000},${(d.targetPricePerMT / 1000).toFixed(2)},${d.destination},"${d.status}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'kisan_jod_procurement_report.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Procurement CSV Report exported successfully!', 'success');
  };

  const c = COMPANY_MOCK_DATA.company;
  const activeCorridor = BackendPolicyEngine.getPriceCorridor(wizardData.crop);

  return (
    <div
      className={`relative min-h-screen flex flex-col justify-between text-[#f8faf8] selection:bg-emerald-800 selection:text-white font-sans ${timeOfDayClass}`}
      style={{ backgroundColor: '#111514' }}
    >
      {/* LAYER 1 & 2: GPU-ACCELERATED LIVING LIGHT STAGE */}
      <div className="ag-living-light-stage">
        <div className="ag-light-beam-forest" />
        <div className="ag-light-beam-amber" />
        <div className="ag-light-beam-moss" />
        <div className="ag-atmospheric-horizon" />
      </div>

      {/* LAYER 5: CURSOR LIVING FIELD CANVAS */}
      <canvas ref={cursorCanvasRef} id="cursorInteractionCanvas" />

      {/* LAYER 6: TOP HEADER & NAVIGATION (KISAN JOD LOGO & CLEAN BAR) */}
      <header className="sticky top-2 z-40 px-3 sm:px-6 max-w-7xl mx-auto w-full space-y-2">
        {/* Top Control Bar */}
        <div className="ag-nav-pill rounded-full px-4 sm:px-6 py-2 flex items-center justify-between shadow-xl">
          {/* Brand & Multi-Branch */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              onClick={() => setActiveDomain('overview')}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-serif italic text-xs font-bold shadow-xs">
                KJ
              </div>
              <span className="font-bold text-sm tracking-tight text-white">Kisan Jod</span>
            </div>

            <div className="hidden sm:block">
              <select
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  showToast(`Switched view to ${e.target.options[e.target.selectedIndex].text}`, 'info');
                }}
                className="ag-branch-select"
              >
                {COMPANY_MOCK_DATA.branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clean Living Date & Time System in Proper Order */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-stone-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-stone-200">{clockString}</span>
            <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-700/50">
              NETWORK LIVE
            </span>
          </div>

          {/* Right Controls: Search, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setCmdPaletteOpen(true)}
              className="p-1.5 rounded-full text-stone-400 hover:text-white transition cursor-pointer"
              title="Search (⌘K)"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setNotificationDrawerOpen((prev) => !prev)}
              className="relative p-1.5 rounded-full text-stone-400 hover:text-white transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.some((n) => n.unread) && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>

            <div
              onClick={() => setActiveDomain('company')}
              className="w-6 h-6 rounded-full bg-stone-800 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold font-mono cursor-pointer"
              title="Vikram Malhotra (ITC Agri)"
            >
              VM
            </div>
          </div>
        </div>

        {/* Domain Navigation Bar */}
        <div className="ag-nav-pill rounded-full px-2 sm:px-4 py-1.5 flex items-center gap-1 overflow-x-auto shadow-md">
          {[
            ['overview', 'Overview'],
            ['demand', 'Demand'],
            ['procurement', 'Procurement'],
            ['orders', 'Orders'],
            ['tracking', 'Tracking'],
            ['payments', 'Payments'],
            ['insights', 'Insights'],
            ['disputes', 'Disputes'],
            ['reports', 'Reports'],
            ['team', 'Team'],
            ['company', 'Company']
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveDomain(key as DomainKey)}
              className={`ag-nav-link cursor-pointer ${
                activeDomain === key ? 'active' : ''
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="relative z-10 flex-1 px-4 sm:px-8 max-w-5xl mx-auto w-full py-6 pb-24">
        {/* ==================================================================
            1. OVERVIEW DOMAIN — CINEMATIC DARK COMMAND CENTER
            ================================================================== */}
        {activeDomain === 'overview' && (
          <div className="space-y-8">
            {/* Header Statement */}
            <div className="pt-2 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/40 text-[11px] font-mono text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>ENTERPRISE PROCUREMENT OS</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight">
                Good afternoon, <span className="font-normal text-white">{c.shortName}.</span>
                <br />
                <span className="font-serif italic text-emerald-400 font-normal">
                  Your procurement network is moving.
                </span>
              </h1>
              <p className="text-stone-300 text-sm sm:text-base font-light max-w-lg leading-relaxed pt-1">
                Monitor your agricultural requirements, matched smallholder inventory, and live shipments in real-time.
              </p>

              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <button
                  onClick={() => {
                    setWizardStep(1);
                    setIsWizardOpen(true);
                  }}
                  className="ag-btn-primary"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Demand</span>
                </button>
                <button
                  onClick={() => setActiveDomain('procurement')}
                  className="ag-btn-secondary"
                >
                  <span>Review Supply Matches</span>
                </button>
              </div>
            </div>

            {/* Living Pipeline Flow */}
            <div className="ag-card p-5 space-y-3 ag-card-glow">
              <div className="flex flex-wrap items-center justify-between text-xs text-stone-300 gap-2">
                <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Living Sourcing-to-Settlement Pipeline
                </span>
                <span className="font-mono text-stone-400">
                  {filteredDemands.length} Active Demands • {totalVolumeKg.toLocaleString()} kg In Pipeline
                </span>
              </div>
              <div className="w-full relative h-[180px]">
                <canvas ref={overviewFlowCanvasRef} className="w-full h-full" />
              </div>
            </div>

            {/* Key Summary Metrics (in KG) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="ag-card p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                  Active Demands
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {filteredDemands.length}{' '}
                  <span className="text-sm font-normal text-stone-400">Crops</span>
                </div>
                <span className="text-xs text-stone-400 mt-1 block">24 Demands YTD</span>
              </div>

              <div className="ag-card p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                  Demanded Volume
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {totalVolumeKg.toLocaleString()}{' '}
                  <span className="text-sm font-normal text-stone-400">kg</span>
                </div>
                <span className="text-xs text-emerald-400 font-semibold mt-1 block">
                  {coveragePct}% Matched
                </span>
              </div>

              <div className="ag-card p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                  Matched Supply
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
                  {matchedVolumeKg.toLocaleString()}{' '}
                  <span className="text-sm font-normal text-stone-400">kg</span>
                </div>
                <span className="text-xs text-stone-400 mt-1 block">Verified NABL Quality</span>
              </div>

              <div className="ag-card p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                  Est. Landed Savings
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
                  ₹38.4 <span className="text-sm font-normal text-stone-400">L</span>
                </div>
                <span className="text-xs text-emerald-400 font-semibold mt-1 block">
                  8.4% vs APMC Mandi
                </span>
              </div>
            </div>

            {/* Procurement Advantage Comparison Card */}
            <div className="ag-card p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                    Economic Impact
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">Procurement Advantage</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 text-xs font-mono font-bold border border-emerald-700/50">
                  Direct Farmer Collective Sourcing
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div className="p-4 rounded-xl bg-stone-900/90 border border-white/5 space-y-2">
                  <span className="text-stone-400 font-bold uppercase text-[10px] block">Traditional Mandi Sourcing</span>
                  <div className="text-base font-bold text-stone-300 font-mono">₹29.20 / kg Landed</div>
                  <ul className="space-y-1 text-stone-400 text-[11px]">
                    <li>• Intermediary commission: 6.5% - 8.0%</li>
                    <li>• Sourcing delay: 4 - 6 days aggregation lag</li>
                    <li>• Unverified quality mix & weighbridge loss</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-600/30 space-y-2">
                  <span className="text-emerald-400 font-bold uppercase text-[10px] block">Kisan Jod Platform Sourcing</span>
                  <div className="text-base font-bold text-emerald-300 font-mono">₹28.50 / kg Landed (Save ₹0.70/kg)</div>
                  <ul className="space-y-1 text-emerald-200/90 text-[11px]">
                    <li>• Direct DBT to Smallholder Farmer Silos</li>
                    <li>• 100% NABL Lab Chemical Residue Tested</li>
                    <li>• GPS-Sealed Freight with Real-Time Telemetry</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            2. DEMAND DOMAIN — OPERATIONAL REQUIREMENT WORKSPACE (IN KG)
            ================================================================== */}
        {activeDomain === 'demand' && (
          <div className="space-y-6 max-w-4xl mx-auto pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                  Demand Workspace
                </span>
                <h1 className="text-3xl font-light text-white tracking-tight mt-1">
                  Active Requirements
                </h1>
                <p className="text-xs text-stone-400 font-light mt-0.5">
                  Server-side enforced price floor (Farmer Protection) & price ceiling active.
                </p>
              </div>
              <button
                onClick={() => {
                  setWizardStep(1);
                  setIsWizardOpen(true);
                }}
                className="ag-btn-primary text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create Demand</span>
              </button>
            </div>

            {/* List of Active Requirements in KG */}
            <div className="space-y-3">
              {filteredDemands.map((d) => {
                const isExpanded = expandedDemandId === d.id;
                const corridor = BackendPolicyEngine.getPriceCorridor(d.crop);

                return (
                  <div
                    key={d.id}
                    className={`ag-card p-5 transition-all ${
                      isExpanded ? 'border-emerald-500/50 bg-stone-900/95' : ''
                    }`}
                    onClick={() => setExpandedDemandId(isExpanded ? null : d.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/40 flex items-center justify-center font-serif italic text-lg font-bold text-emerald-400 shrink-0">
                          {d.crop.charAt(0)}
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-white">{d.crop}</h2>
                          <p className="text-xs text-stone-400 font-mono">
                            {(d.requiredMT * 1000).toLocaleString()} kg • Required by {d.requiredBy} • Priority:{' '}
                            <span className="font-semibold text-emerald-300">{d.priority}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <div
                            className={`text-sm font-extrabold ${
                              d.coveragePct === 100 ? 'text-emerald-400' : 'text-stone-200'
                            }`}
                          >
                            {d.coveragePct}% Covered
                          </div>
                          <div className="text-[11px] font-medium text-stone-400">{d.status}</div>
                        </div>

                        {/* Direct Delete Demand Action */}
                        <button
                          type="button"
                          title="Delete Requirement"
                          onClick={(e) => handleDeleteDemand(d.id, e)}
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/80 text-red-400 hover:text-red-200 border border-red-800/40 transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-stone-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-stone-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="pt-5 mt-5 border-t border-white/10 text-xs space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <span className="text-stone-400 block mb-0.5">Destination Plant</span>
                            <strong className="text-white">{d.destination}</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block mb-0.5">Matched Quantity</span>
                            <strong className="text-emerald-400 font-bold">{(d.matchedMT * 1000).toLocaleString()} kg</strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block mb-0.5">Deficit Gap</span>
                            <strong
                              className={
                                d.gapMT > 0 ? 'text-amber-400 font-bold' : 'text-stone-400 font-bold'
                              }
                            >
                              {d.gapMT > 0 ? `${(d.gapMT * 1000).toLocaleString()} kg remaining` : 'Fully Sourced'}
                            </strong>
                          </div>
                          <div>
                            <span className="text-stone-400 block mb-0.5">Target Rate</span>
                            <strong className="text-white font-mono">
                              ₹{(d.targetPricePerMT / 1000).toFixed(1)} / kg
                            </strong>
                          </div>
                        </div>

                        {/* Price Floor & Policy Badge */}
                        <div className="p-3 rounded-xl bg-stone-900/90 border border-white/10 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                          <span className="text-emerald-300">
                            🛡️ Price Floor Protected: <strong>₹{corridor.floorPricePerKg.toFixed(2)}/kg</strong>
                          </span>
                          <span className="text-stone-400">
                            Mandi Index: ₹{corridor.mandiBenchmarkPerKg.toFixed(2)}/kg • Ceiling: ₹{corridor.ceilingPricePerKg.toFixed(2)}/kg
                          </span>
                        </div>

                        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-emerald-300 block mb-0.5">
                                Smart Match Intelligence (Score: {d.matchScore}% Feasibility)
                              </span>
                              <p className="text-stone-300 leading-relaxed">{d.matchReason}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => handleDeleteDemand(d.id, e)}
                              className="px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900 text-red-300 hover:text-white border border-red-800/60 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMatchReviewDemand(d);
                              }}
                              className="ag-btn-primary text-[11px] py-1.5 px-3 shrink-0 whitespace-nowrap"
                            >
                              <span>Review Allocation</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between pt-2 text-[11px] text-stone-400 border-t border-white/5 gap-2">
                          <span>
                            Quality Standard:{' '}
                            <strong className="text-stone-300">
                              {d.grade} ({d.specs})
                            </strong>
                          </span>
                          <span className="font-mono">
                            Ref: {d.id} • Order #{d.orderRef}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================
            3. PROCUREMENT DOMAIN — AI MATCHING & ALLOCATION (IN KG)
            ================================================================== */}
        {activeDomain === 'procurement' && (
          <div className="space-y-6 max-w-4xl mx-auto pt-2">
            <div className="pb-4 border-b border-white/10">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                Procurement & Price Intelligence
              </span>
              <h1 className="text-3xl font-light text-white tracking-tight mt-1">
                AI Supply Allocation
              </h1>
              <p className="text-xs text-stone-400 font-light mt-0.5">
                Multi-source matching engine with guaranteed Price Floor verification.
              </p>
            </div>

            {/* Price Field Corridor Visualizer */}
            <div className="ag-card p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-stone-300 uppercase">
                  Price Field Corridor — Sharbati Wheat
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-800 text-stone-300 border border-white/10">
                    FLOOR: ₹26.50/KG
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-600/40">
                    MATCHED: ₹28.50/KG
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-600/40">
                    CEILING: ₹34.00/KG
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-900/90 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-mono text-stone-400">
                  <span>Mandi Benchmark: ₹29.20/kg</span>
                  <span className="text-emerald-400 font-bold">Platform Direct: ₹28.50/kg</span>
                  <span>Ceiling: ₹34.00/kg</span>
                </div>
                <div className="relative h-3 rounded-full bg-stone-800 overflow-hidden">
                  <div className="absolute left-[30%] right-[35%] top-0 bottom-0 bg-emerald-600/60 rounded-full" />
                  <div className="absolute left-[45%] top-0 bottom-0 w-2 bg-amber-400" />
                </div>
                <div className="flex flex-wrap justify-between text-[11px] text-stone-400 pt-1 gap-2">
                  <span>Protected Farmer Floor: ₹26.50/kg</span>
                  <span className="text-emerald-300 font-bold">Estimated Savings: ₹0.70 / kg (₹2.94 Lakhs Total)</span>
                  <span>Historical Ceiling: ₹34.00/kg</span>
                </div>
              </div>
            </div>

            {/* Demands Breakdown */}
            <div className="space-y-4">
              {filteredDemands.map((d) => (
                <div key={d.id} className="ag-card p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                      <span className="text-xs font-mono text-stone-400">Demand Ref: {d.id}</span>
                      <h2 className="text-base font-bold text-white">{d.crop}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-bold text-xs border border-emerald-700/50">
                        Smart Match: {d.matchScore}%
                      </span>
                      <button
                        onClick={() => setMatchReviewDemand(d)}
                        className="ag-btn-primary text-xs py-1.5 px-3"
                      >
                        Review & Reserve
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-stone-400 block mb-0.5">Required Volume</span>
                      <strong className="text-white">{(d.requiredMT * 1000).toLocaleString()} kg</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block mb-0.5">Matched Available</span>
                      <strong className="text-emerald-400 font-bold">{(d.matchedMT * 1000).toLocaleString()} kg</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block mb-0.5">Landed Target Rate</span>
                      <strong className="text-white font-mono">₹{(d.targetPricePerMT / 1000).toFixed(1)}/kg</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block mb-0.5">Landed Mandi Savings</span>
                      <strong className="text-amber-400 font-bold">
                        ₹{(d.estimatedSavingsINR / 100000).toFixed(2)} Lakhs
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest block">
                      Participating Producer Silos & Collectives
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {d.allocationSources.map((s, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-stone-900/90 border border-white/5 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-white">{s.sourceName}</div>
                            <span className="text-stone-400 text-[10px]">
                              {s.distanceKm} km away • Rating: {s.rating} ★
                            </span>
                          </div>
                          <div className="text-right">
                            <strong className="text-white block font-mono">{(s.volumeMT * 1000).toLocaleString()} kg</strong>
                            <span className="text-[10px] text-emerald-400">
                              ₹{(s.pricePerMT / 1000).toFixed(1)}/kg
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            4. ORDERS DOMAIN — PURCHASE ORDER LIFECYCLE (40/60 ESCROW SPLIT)
            ================================================================== */}
        {activeDomain === 'orders' && (
          <div className="space-y-6 max-w-4xl mx-auto pt-2">
            <div className="pb-4 border-b border-white/10">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
                Purchase Order Lifecycle
              </span>
              <h1 className="text-3xl font-light text-white tracking-tight mt-1">
                Active Purchase Orders
              </h1>
              <p className="text-xs text-stone-400 font-light mt-0.5">
                Enforces 40% Advance / 60% Final Gate Escrow Settlement & 24h Inspection Window.
              </p>
            </div>

            <div className="space-y-3">
              {filteredOrders.map((o) => (
                <div key={o.id} className="ag-card p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                    <div>
                      <span className="text-xs font-mono font-bold text-stone-400">Order #{o.id}</span>
                      <h2 className="text-base font-bold text-white mt-0.5">
                        {o.crop} — {(o.volumeMT * 1000).toLocaleString()} kg
                      </h2>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold self-start sm:self-auto bg-stone-800 text-emerald-300 border border-emerald-700/30">
                      {o.stage}
                    </span>
                  </div>

                  {/* 40/60 Split Policy Banner */}
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/30 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-emerald-300">
                      <strong>Escrow Split (Policy §15):</strong> 40% Advance (₹{((o.totalPayableINR * 0.4) / 100000).toFixed(2)} L) • 60% Final Gate (₹{((o.totalPayableINR * 0.6) / 100000).toFixed(2)} L)
                    </span>
                    <span className="text-stone-300 font-bold">
                      Status: {o.paymentStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 block mb-0.5">Destination Plant</span>
                      <strong className="text-white">{o.destination}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block mb-0.5">Expected Delivery</span>
                      <strong className="text-white">{o.expectedDelivery}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block mb-0.5">Total Payable</span>
                      <strong className="text-white font-mono">
                        ₹{(o.totalPayableINR / 100000).toFixed(2)} Lakhs
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block mb-0.5">Rejection Window</span>
                      <strong className="text-amber-300 font-mono">24h Post-Delivery</strong>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-900/70 border border-white/5 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Product Cost</span>
                      <strong className="font-mono text-white">₹{(o.productCostINR / 100000).toFixed(2)} L</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Logistics Tariff</span>
                      <strong className="font-mono text-white">₹{(o.logisticsCostINR / 100000).toFixed(2)} L</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Platform Fee (1%)</span>
                      <strong className="font-mono text-white">₹{(o.platformFeeINR / 100000).toFixed(2)} L</strong>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between pt-3 border-t border-white/10 text-xs gap-2">
                    <button
                      onClick={() => {
                        const b = COMPANY_MOCK_DATA.batches.find((item) => item.id === o.batchId) || COMPANY_MOCK_DATA.batches[0];
                        setSelectedBatchModal(b);
                      }}
                      className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px] underline font-semibold cursor-pointer"
                      title="Inspect NABL Quality Assay & Chain of Custody"
                    >
                      Batch Ref: {o.batchId} 🔍 (Unique Allocation Locked)
                    </button>

                    <div className="flex items-center gap-3">
                      {o.stage.includes('Delivered') ? (
                        <button
                          onClick={() => setDeliveryConfirmOrder(o)}
                          className="ag-btn-primary text-[11px] py-1 px-3"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm Receipt & Release 60%</span>
                        </button>
                      ) : o.stage === 'In Transit' ? (
                        <button
                          onClick={() => setActiveDomain('tracking')}
                          className="ag-btn-primary text-[11px] py-1 px-3"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Track Shipment</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => showToast(`Tax Invoice for Order #${o.id} downloaded.`, 'info')}
                          className="ag-btn-secondary text-[11px] py-1 px-3"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tax Invoice</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setDisputeOrderRef(o.id);
                          setDisputeModalOpen(true);
                        }}
                        className="text-stone-400 hover:text-rose-400 text-xs ml-2 cursor-pointer"
                      >
                        Report Issue
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            5. TRACKING DOMAIN — DYNAMIC MULTI-BRANCH MAP & CITIES
            ================================================================== */}
        {activeDomain === 'tracking' && (
          <div className="space-y-6 max-w-5xl mx-auto pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
                  Consignment Telemetry
                </span>
                <h1 className="text-3xl font-light text-white tracking-tight mt-1">
                  Live Freight Tracking
                </h1>
                <p className="text-xs text-stone-400 font-light mt-0.5">
                  Real-time GPS transit from {activeTruck.origin} to {activeTruck.destination}.
                </p>
              </div>
              <div className="text-xs text-stone-300 font-mono">
                Vehicle: <strong className="text-white">{activeTruck.vehicleNumber}</strong> • Speed: <strong className="text-emerald-400">{activeTruck.speedKmh} km/h</strong>
              </div>
            </div>

            {/* Dynamic Light Map Container with Live City Routes */}
            <div id="trackingMapContainer">
              <canvas ref={trackingMapCanvasRef} className="w-full h-full" />
              <div className="truck-floating-capsule">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono font-bold text-[10px] border border-blue-500/40">
                    {activeTruck.id}
                  </span>
                  <span className="font-bold text-white text-xs">
                    {activeTruck.crop} ({(activeTruck.volumeMT * 1000).toLocaleString()} kg)
                  </span>
                </div>
                <div className="text-[11px] text-stone-300 font-mono">
                  Driver: <strong className="text-white">{activeTruck.driverName}</strong> ({activeTruck.driverPhone})
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                  Status: {activeTruck.status} • ETA: {activeTruck.etaMinutes} mins
                </div>
              </div>
            </div>

            {/* Dynamic Waypoints for Selected Branch/Route */}
            <div className="ag-card p-5 space-y-3">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block">
                Consignment Waypoint Milestones ({activeTruck.origin} → {activeTruck.destination})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {activeTruck.timeline.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl ${
                      m.completed
                        ? 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-300'
                        : 'bg-stone-900/60 border border-white/5 text-stone-500'
                    }`}
                  >
                    <div className={`font-bold ${m.completed ? 'text-emerald-300' : 'text-stone-400'}`}>
                      {m.stage}
                    </div>
                    <span className="text-[11px] font-mono text-stone-400">{m.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            6. PAYMENTS DOMAIN — DARK FINANCIAL FLOW & RTGS ESCROW
            ================================================================== */}
        {activeDomain === 'payments' && (
          <div className="space-y-6 max-w-4xl mx-auto pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                  Financial Settlement
                </span>
                <h1 className="text-3xl font-light text-white tracking-tight mt-1">
                  Flow of Value
                </h1>
                <p className="text-xs text-stone-400 font-light mt-0.5">
                  Automated RTGS escrow disbursements (40% Advance / 60% Final Gate Settlement).
                </p>
              </div>
              <div className="text-xs font-mono text-stone-400">
                Total Disbursed: <strong className="text-emerald-400">₹4.82 Cr YTD</strong>
              </div>
            </div>

            {/* Financial Stream Paths */}
            <div className="ag-card p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between text-xs text-stone-400 gap-2">
                <span>₹ Currency Stream Paths (Escrow → Aggregation → Settlement)</span>
                <div className="flex gap-2">
                  {(['7D', '30D', '1Y'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setActiveFinancePeriod(r)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono cursor-pointer transition ${
                        activeFinancePeriod === r
                          ? 'bg-emerald-800 text-white font-bold'
                          : 'bg-stone-900 text-stone-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-stone-900/90 border border-white/5">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Escrow Locked</span>
                  <strong className="text-base font-bold text-white font-mono">₹38.45 Lakhs</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-900/90 border border-white/5">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Settled to Farms</span>
                  <strong className="text-base font-bold text-emerald-400 font-mono">₹4.44 Cr</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-900/90 border border-white/5">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Avg Payout Speed</span>
                  <strong className="text-base font-bold text-white font-mono">2.4 Hours</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-900/90 border border-white/5">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Direct Benefit</span>
                  <strong className="text-base font-bold text-emerald-400 font-mono">+14.2%</strong>
                </div>
              </div>
            </div>

            {/* Core Banking Settlements Ledger */}
            <div className="ag-card p-5 space-y-3">
              <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                Recent Core Banking RTGS Disbursements
              </h2>
              <div className="space-y-2 text-xs">
                {COMPANY_MOCK_DATA.payments.recentTransactions.map((t) => (
                  <div key={t.id} className="p-3 rounded-xl bg-stone-900/80 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">
                        {t.crop} — {t.type}
                      </div>
                      <span className="text-[11px] font-mono text-stone-400">
                        {t.id} • {t.date} via {t.method} (UTR: {t.utr})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-extrabold text-sm text-emerald-300">
                        ₹{(t.amountINR / 100000).toFixed(2)} L
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold">{t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            7. INSIGHTS DOMAIN — ANALYTICS & FORECASTING
            ================================================================== */}
        {activeDomain === 'insights' && (
          <div className="space-y-6 max-w-4xl mx-auto pt-2">
            <div className="pb-4 border-b border-white/10">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                Procurement Intelligence
              </span>
              <h1 className="text-3xl font-light text-white tracking-tight mt-1">
                Analytics & Forecasting
              </h1>
            </div>

            <div className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto">
              {[
                ['procurement', 'Procurement'],
                ['crop', 'Crop Volume'],
                ['price', 'Price Trends'],
                ['fulfillment', 'Fulfillment Rate'],
                ['quality', 'Quality Score'],
                ['savings', 'Landed Savings']
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveAnalyticsTab(key as any)}
                  className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition ${
                    activeAnalyticsTab === key
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="ag-card p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="text-stone-300 font-bold uppercase">Procurement Analytics Performance Matrix</span>
                <span className="font-mono">FY 2026-27 YTD</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-900/90 border border-white/5">
                  <span className="text-stone-400 block mb-1">Total Procurement</span>
                  <strong className="text-lg font-bold text-white font-mono">13,20,000 kg</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-900/90 border border-white/5">
                  <span className="text-stone-400 block mb-1">Fulfillment Parity</span>
                  <strong className="text-lg font-bold text-emerald-400 font-mono">98.2%</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-900/90 border border-white/5">
                  <span className="text-stone-400 block mb-1">Total Landed Savings</span>
                  <strong className="text-lg font-bold text-amber-400 font-mono">₹38.4 Lakhs</strong>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block">
                AI Seasonal Harvesting & Forward Projection
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {COMPANY_MOCK_DATA.forecasting.seasonalTrends.map((t, idx) => (
                  <div key={idx} className="ag-card p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                      {t.period}
                    </span>
                    <div className="font-bold text-white text-sm">{t.crop}</div>
                    <p className="text-stone-400">{t.availability}</p>
                    <div className="text-emerald-300 font-mono pt-1 border-t border-white/10 font-semibold">
                      {t.priceOutlook}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            8. DISPUTES DOMAIN — EVIDENCE-BASED DISPUTES & CLAIMS
            ================================================================== */}
        {activeDomain === 'disputes' && (
          <div className="space-y-6 max-w-4xl mx-auto pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400">
                  Issue Resolution
                </span>
                <h1 className="text-3xl font-light text-white tracking-tight mt-1">
                  Disputes & Claims
                </h1>
                <p className="text-xs text-stone-400 font-light mt-0.5">
                  Calm, evidence-based quality or weighbridge variance claims with Rule §16 Verified Liability.
                </p>
              </div>
              <button
                onClick={() => setDisputeModalOpen(true)}
                className="ag-btn-primary text-xs bg-rose-900 hover:bg-rose-800 text-white"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report New Dispute</span>
              </button>
            </div>

            <div className="space-y-3">
              {disputes.map((d) => (
                <div key={d.id} className="ag-card p-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div>
                      <span className="text-[10px] font-mono text-stone-400">
                        {d.id} • Order #{d.orderRef}
                      </span>
                      <h2 className="text-base font-bold text-white mt-0.5">{d.type}</h2>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 font-bold text-[11px] border border-amber-600/40">
                      {d.status}
                    </span>
                  </div>
                  <p className="text-stone-300 leading-relaxed">{d.description}</p>
                  <div className="flex flex-wrap items-center justify-between pt-2 text-stone-400 border-t border-white/5 text-[11px] gap-2">
                    <span>
                      Attached Evidence: <strong className="text-stone-200">{d.evidenceFile}</strong>
                    </span>
                    <span className="font-mono">Submitted: {d.submittedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            9. REPORTS DOMAIN — DOCUMENTATION & CSV EXPORTS
            ================================================================== */}
        {activeDomain === 'reports' && (
          <div className="space-y-6 max-w-4xl mx-auto pt-2">
            <div className="pb-4 border-b border-white/10">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">
                Formal Documentation
              </span>
              <h1 className="text-3xl font-light text-white tracking-tight mt-1">
                Reports & Exports
              </h1>
            </div>

            <div className="ag-card p-5 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-stone-400 block mb-1">Report Type</label>
                  <select className="w-full p-2.5 rounded-xl border border-white/10 bg-stone-900 text-white">
                    <option>Procurement Spending & Savings Report</option>
                    <option>Purchase Order Tax Manifests</option>
                    <option>NABL Quality & Traceability Assay</option>
                    <option>Multi-Branch Intake Summary</option>
                  </select>
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Date Range</label>
                  <select className="w-full p-2.5 rounded-xl border border-white/10 bg-stone-900 text-white">
                    <option>Current Month (August 2026)</option>
                    <option>Last 90 Days (Q2 2026)</option>
                    <option>Fiscal Year 2026-27 YTD</option>
                  </select>
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Target Branch</label>
                  <select className="w-full p-2.5 rounded-xl border border-white/10 bg-stone-900 text-white">
                    <option>All Operating Branches</option>
                    <option>Delhi-NCR Mega Plant</option>
                    <option>Pune Integrated Agro-Hub</option>
                    <option>Bengaluru South Distribution</option>
                    <option>Meerut Aggregation Hub</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-stone-400 text-center sm:text-left">
                  Formats Available: <strong>PDF Document • CSV / Excel • Print</strong>
                </span>
                <div className="flex gap-3">
                  <button onClick={handleExportCSV} className="ag-btn-secondary text-xs">
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Export CSV
                  </button>
                  <button onClick={() => window.print()} className="ag-btn-primary text-xs">
                    <Printer className="w-3.5 h-3.5" /> Print Official Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            10. TEAM DOMAIN — USERS & ROLES GOVERNANCE
            ================================================================== */}
        {activeDomain === 'team' && (
          <div className="space-y-6 max-w-4xl mx-auto pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">
                  Team Governance
                </span>
                <h1 className="text-3xl font-light text-white tracking-tight mt-1">
                  Company Users & Permissions
                </h1>
              </div>
              <button
                onClick={() => showToast('Invited new procurement manager.', 'info')}
                className="ag-btn-primary text-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Team Member</span>
              </button>
            </div>

            <div className="space-y-3">
              {team.map((u) => (
                <div key={u.id} className="ag-card p-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white text-sm">{u.name}</div>
                    <div className="text-stone-400 font-mono mt-0.5">
                      {u.email} • Role: <strong className="text-emerald-300">{u.role}</strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-semibold text-[10px] border border-emerald-700/40">
                      {u.status}
                    </span>
                    <span className="text-stone-400 font-mono text-[11px] block mt-1">
                      Active: {u.lastActive}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            11. COMPANY DOMAIN — CORPORATE IDENTITY & SILOS DIRECTORY
            ================================================================== */}
        {activeDomain === 'company' && (
          <div className="space-y-6 max-w-4xl mx-auto pt-2">
            <div className="pb-4 border-b border-white/10">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400">
                Corporate Identity
              </span>
              <h1 className="text-3xl font-light text-white tracking-tight mt-1">{c.name}</h1>
              <p className="text-xs text-stone-400 font-light mt-0.5">
                {c.industry} • GSTIN: <span className="font-mono text-emerald-300">{c.gstin}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {COMPANY_MOCK_DATA.branches
                .filter((b) => b.id !== 'ALL')
                .map((p) => (
                  <div key={p.id} className="ag-card p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                      Processing Plant
                    </span>
                    <div className="font-bold text-white text-sm">{p.name}</div>
                    <p className="text-stone-400">{p.city}</p>
                    <div className="text-[11px] font-mono text-stone-300 pt-1 border-t border-white/10">
                      Intake Capacity: {(p.capacityMT * 1000).toLocaleString()} kg/day
                    </div>
                  </div>
                ))}
            </div>

            <div className="ag-card p-5 bg-stone-900/90 border-emerald-800/40 space-y-2">
              <h2 className="text-base font-serif italic font-normal text-emerald-300">
                Sustainability & Rural Decarbonization
              </h2>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Through computerized lot tracking, participating farmer collectives in Karnal & Meerut have diverted 12,80,000 kg of paddy straw from field burning to Women SHG mushroom bio-substrates, creating ₹18.2 Lakhs in secondary rural income.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* FLOATING AI PROCUREMENT ASSISTANT */}
      <button
        onClick={() => setAiAssistantOpen((prev) => !prev)}
        className="ai-assistant-btn"
      >
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>Ask Assistant</span>
      </button>

      {/* AI Assistant Drawer */}
      <div id="aiAssistantDrawer" className={aiAssistantOpen ? 'open' : ''}>
        <div className="p-3.5 border-b border-white/10 bg-stone-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-xs text-white">AI Procurement Assistant</span>
          </div>
          <button
            onClick={() => setAiAssistantOpen(false)}
            className="text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[380px]">
          <div className="space-y-2">
            {aiAssistantMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl text-xs ${
                  msg.role === 'user'
                    ? 'bg-emerald-950/80 border border-emerald-700/50 text-white ml-6'
                    : 'bg-stone-900 border border-white/10 text-stone-300 mr-4'
                }`}
              >
                <p>{msg.text}</p>
                {msg.action && (
                  <button
                    onClick={() => {
                      setActiveDomain(msg.action!.domain);
                      setAiAssistantOpen(false);
                    }}
                    className="mt-2 ag-btn-primary text-[10px] py-1 px-2.5"
                  >
                    {msg.action.text}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">
              Suggested Inquiries
            </span>
            <button
              onClick={() => handleAskAI('How much Grade A tomato is currently available?')}
              className="w-full text-left p-2 rounded-lg bg-stone-900 hover:bg-stone-800 transition text-[11px] text-stone-300 cursor-pointer"
            >
              "How much Grade A tomato is currently available?"
            </button>
            <button
              onClick={() => handleAskAI('Which orders are arriving tomorrow?')}
              className="w-full text-left p-2 rounded-lg bg-stone-900 hover:bg-stone-800 transition text-[11px] text-stone-300 cursor-pointer"
            >
              "Which orders are arriving tomorrow?"
            </button>
            <button
              onClick={() => handleAskAI('Which demands are at risk of deficit?')}
              className="w-full text-left p-2 rounded-lg bg-stone-900 hover:bg-stone-800 transition text-[11px] text-stone-300 cursor-pointer"
            >
              "Which demands are at risk of deficit?"
            </button>
          </div>
        </div>
      </div>

      {/* FULL-SCREEN 8-STEP DEMAND CREATOR WIZARD MODAL (PRICE FLOOR & CEILING PROTECTED) */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#171c19] rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                New Procurement Requirement (Policy-Protected)
              </span>
              <button
                onClick={() => setIsWizardOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {wizardStep === 1 && (
                <div className="space-y-5">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                    Step 01 of 08
                  </span>
                  <h2 className="text-2xl font-light text-white tracking-tight">
                    What agricultural produce do you need?
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {[
                      'Wheat (Sharbati)',
                      'Basmati Rice (Pusa 1121)',
                      'Nashik Red Onion',
                      'Yellow Mustard Seed',
                      'Hybrid Tomato',
                      'Soybean (Non-GMO)'
                    ].map((cropName) => (
                      <button
                        key={cropName}
                        onClick={() => {
                          const corr = BackendPolicyEngine.getPriceCorridor(cropName);
                          setWizardData((prev) => ({
                            ...prev,
                            crop: cropName,
                            expectedPriceMin: corr.floorPricePerKg + 2.0,
                            expectedPriceMax: corr.mandiBenchmarkPerKg
                          }));
                          setWizardStep(2);
                        }}
                        className={`p-3.5 rounded-xl text-left border cursor-pointer ${
                          wizardData.crop === cropName
                            ? 'border-emerald-500 bg-emerald-950/80 font-bold text-white'
                            : 'border-white/10 bg-stone-900/60 text-stone-300'
                        } hover:border-emerald-400 transition text-xs`}
                      >
                        {cropName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-5">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                    Step 02 of 08
                  </span>
                  <h2 className="text-2xl font-light text-white tracking-tight">
                    How much quantity do you need?
                  </h2>
                  <div className="pt-3">
                    <div className="flex items-baseline gap-3">
                      <input
                        type="number"
                        value={wizardData.quantity}
                        onChange={(e) =>
                          setWizardData((prev) => ({
                            ...prev,
                            quantity: parseFloat(e.target.value) || 0
                          }))
                        }
                        className="text-4xl font-mono bg-transparent border-b-2 border-emerald-400 pb-2 focus:outline-none w-56 text-white"
                        min="100"
                        step="100"
                      />
                      <span className="text-xl font-bold text-stone-400">Kilograms (kg)</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-2 font-mono">
                      Minimum standard lot allocation: 1,000 kg
                    </p>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-5">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                    Step 03 of 08
                  </span>
                  <h2 className="text-2xl font-light text-white tracking-tight">
                    What quality grade do you require?
                  </h2>
                  <div className="space-y-3 pt-2">
                    {[
                      {
                        grade: 'Grade A',
                        desc: 'Premium food processing standard (< 11.5% moisture, 100% NABL lab tested)'
                      },
                      {
                        grade: 'Grade B',
                        desc: 'Standard commercial industrial grade (< 13% moisture)'
                      },
                      {
                        grade: 'Grade C',
                        desc: 'General commodity & animal nutrition standard'
                      }
                    ].map((g) => (
                      <button
                        key={g.grade}
                        onClick={() => {
                          setWizardData((prev) => ({ ...prev, grade: g.grade }));
                          setWizardStep(4);
                        }}
                        className={`w-full p-3.5 rounded-xl text-left border cursor-pointer ${
                          wizardData.grade === g.grade
                            ? 'border-emerald-500 bg-emerald-950/80 font-bold text-white'
                            : 'border-white/10 bg-stone-900/60 text-stone-300'
                        } text-xs`}
                      >
                        <div className="font-bold text-white text-sm">{g.grade}</div>
                        <div className="text-stone-400 font-light mt-0.5">{g.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: PRICE CORRIDOR (ENFORCES CONSTRAINT 1 PRICE FLOOR & CONSTRAINT 2 CEILING) */}
              {wizardStep === 4 && (
                <div className="space-y-5">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                    Step 04 of 08 — Price Corridor Verification
                  </span>
                  <h2 className="text-2xl font-light text-white tracking-tight">
                    Target Procurement Price Range (₹ / kg)
                  </h2>

                  {/* Policy Benchmark Banner */}
                  <div className="p-4 rounded-xl bg-stone-900/90 border border-emerald-600/40 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-emerald-300 font-bold">
                      <span>🛡️ Platform Minimum Fair-Price Floor (Farmer Protection):</span>
                      <span className="font-mono text-sm">₹{activeCorridor.floorPricePerKg.toFixed(2)} / kg</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-400">
                      <span>APMC Mandi Reference Benchmark:</span>
                      <span className="font-mono text-white">₹{activeCorridor.mandiBenchmarkPerKg.toFixed(2)} / kg</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-400">
                      <span>Maximum Allowable Ceiling Price:</span>
                      <span className="font-mono text-amber-400">₹{activeCorridor.ceilingPricePerKg.toFixed(2)} / kg</span>
                    </div>
                    <p className="text-[11px] text-stone-400 pt-1 border-t border-white/5">
                      Rule §1: Listings below ₹{activeCorridor.floorPricePerKg.toFixed(2)}/kg will be rejected by the server to protect farmer livelihoods.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="text-xs text-stone-400 block mb-1">
                        Target Offer Price (₹/kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={wizardData.expectedPriceMin}
                        onChange={(e) =>
                          setWizardData((prev) => ({
                            ...prev,
                            expectedPriceMin: parseFloat(e.target.value) || 0
                          }))
                        }
                        className={`w-full p-2.5 rounded-xl border ${
                          wizardData.expectedPriceMin < activeCorridor.floorPricePerKg
                            ? 'border-rose-500 bg-rose-950/40 text-rose-200'
                            : 'border-white/10 bg-stone-900 text-white'
                        } text-sm font-mono focus:outline-none`}
                      />
                      {wizardData.expectedPriceMin < activeCorridor.floorPricePerKg && (
                        <span className="text-[10px] text-rose-400 block mt-1">
                          ⚠️ Below minimum floor of ₹{activeCorridor.floorPricePerKg.toFixed(2)}/kg
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-stone-400 block mb-1">
                        Max Ceiling Range (₹/kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={wizardData.expectedPriceMax}
                        onChange={(e) =>
                          setWizardData((prev) => ({
                            ...prev,
                            expectedPriceMax: parseFloat(e.target.value) || 0
                          }))
                        }
                        className="w-full p-2.5 rounded-xl border border-white/10 bg-stone-900 text-white text-sm font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 5 && (
                <div className="space-y-5">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                    Step 05 of 08
                  </span>
                  <h2 className="text-2xl font-light text-white tracking-tight">
                    When is this produce needed by?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs text-stone-400 block mb-1">
                        Required Delivery Date
                      </label>
                      <input
                        type="date"
                        value={wizardData.date}
                        onChange={(e) =>
                          setWizardData((prev) => ({ ...prev, date: e.target.value }))
                        }
                        className="w-full p-2.5 rounded-xl border border-white/10 bg-stone-900 text-white text-sm font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-stone-400 block mb-1">
                        Latest Intake Time
                      </label>
                      <input
                        type="time"
                        value={wizardData.time}
                        onChange={(e) =>
                          setWizardData((prev) => ({ ...prev, time: e.target.value }))
                        }
                        className="w-full p-2.5 rounded-xl border border-white/10 bg-stone-900 text-white text-sm font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 6 && (
                <div className="space-y-5">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                    Step 06 of 08
                  </span>
                  <h2 className="text-2xl font-light text-white tracking-tight">
                    Destination Plant & Branch
                  </h2>
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="text-xs text-stone-400 block mb-1">
                        Select Receiving Plant
                      </label>
                      <select
                        value={wizardData.branchId}
                        onChange={(e) =>
                          setWizardData((prev) => ({
                            ...prev,
                            branchId: e.target.value,
                            destination: e.target.options[e.target.selectedIndex].text
                          }))
                        }
                        className="w-full p-2.5 rounded-xl border border-white/10 bg-stone-900 text-white text-xs focus:outline-none"
                      >
                        <option value="BR-DELHI">Delhi-NCR Mega Plant (Gr. Noida, UP)</option>
                        <option value="BR-PUNE">Pune Integrated Agro-Hub (Ranjangaon, MH)</option>
                        <option value="BR-BLR">Bengaluru South Distribution (Peenya, KA)</option>
                        <option value="BR-MEERUT">Meerut Aggregation Hub (UP)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 7 && (
                <div className="space-y-5">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                    Step 07 of 08
                  </span>
                  <h2 className="text-2xl font-light text-white tracking-tight">
                    Allocation Priority
                  </h2>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {(['Critical', 'High', 'Normal'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setWizardData((prev) => ({ ...prev, priority: p }));
                          setWizardStep(8);
                        }}
                        className={`p-3.5 rounded-xl text-center border cursor-pointer ${
                          wizardData.priority === p
                            ? 'border-emerald-500 bg-emerald-950/80 font-bold text-white'
                            : 'border-white/10 bg-stone-900/60 text-stone-300'
                        } text-xs`}
                      >
                        <div className="font-bold text-sm">{p}</div>
                        <span className="text-[10px] text-stone-400 mt-1 block">
                          {p === 'Critical' ? 'Top Queue' : 'Standard Queue'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 8 && (
                <div className="space-y-5">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                    Step 08 of 08 — Policy Validation & Review
                  </span>
                  <h2 className="text-2xl font-light text-white tracking-tight">
                    Review Demand Specification
                  </h2>
                  <div className="p-4 rounded-xl bg-stone-900/90 border border-white/10 text-xs space-y-2.5">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-stone-400">Crop:</span>
                      <strong className="text-white">{wizardData.crop}</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-stone-400">Quantity:</span>
                      <strong className="text-white font-mono">{wizardData.quantity.toLocaleString()} kg</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-stone-400">Quality Grade:</span>
                      <strong className="text-white">{wizardData.grade}</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-stone-400">Target Price:</span>
                      <strong className="text-emerald-400 font-mono">
                        ₹{wizardData.expectedPriceMin.toFixed(2)} / kg (Above ₹{activeCorridor.floorPricePerKg.toFixed(2)} Floor)
                      </strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-stone-400">Required By:</span>
                      <strong className="text-white">{wizardData.date}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Priority:</span>
                      <strong className="text-emerald-400">{wizardData.priority}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-white/10 bg-stone-950/40 flex items-center justify-between">
              {wizardStep > 1 ? (
                <button
                  onClick={() => setWizardStep((prev) => prev - 1)}
                  className="ag-btn-secondary text-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <div />
              )}

              {wizardStep < 8 ? (
                <button
                  onClick={() => {
                    // Enforce Price Floor validation when exiting Step 4
                    if (wizardStep === 4) {
                      const val = BackendPolicyEngine.validateDemandPrice(
                        wizardData.crop,
                        wizardData.expectedPriceMin,
                        wizardData.expectedPriceMin,
                        wizardData.expectedPriceMax,
                        wizardData.grade,
                        wizardData.destination
                      );
                      if (!val.valid) {
                        showToast(val.error || 'Price Floor Violation', 'error');
                        return;
                      }
                      if (val.flagged) {
                        showToast(val.flagReason || 'Listing flagged', 'info');
                      }
                    }
                    setWizardStep((prev) => prev + 1);
                  }}
                  className="ag-btn-primary text-xs"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    // Enforce Constraint 1 & 2 Server-Side Validation
                    const val = BackendPolicyEngine.validateDemandPrice(
                      wizardData.crop,
                      wizardData.expectedPriceMin,
                      wizardData.expectedPriceMin,
                      wizardData.expectedPriceMax,
                      wizardData.grade,
                      wizardData.destination
                    );

                    if (!val.valid) {
                      showToast(val.error || 'Server rejected demand price!', 'error');
                      return;
                    }

                    const volumeMT = wizardData.quantity / 1000;
                    const targetPricePerMT = wizardData.expectedPriceMin * 1000;
                    const mandiBenchmarkPerMT = activeCorridor.mandiBenchmarkPerKg * 1000;

                    const newDemand: CompanyDemand = {
                      id: `DEM-0${Math.floor(896 + Math.random() * 50)}`,
                      orderRef: `AG-${Math.floor(2060 + Math.random() * 40)}`,
                      crop: wizardData.crop,
                      variety: 'Certified Platform Grade Standard',
                      category: 'Grains',
                      branchId: wizardData.branchId,
                      requiredMT: volumeMT,
                      matchedMT: Math.floor(volumeMT * 0.8),
                      gapMT: Math.ceil(volumeMT * 0.2),
                      coveragePct: 80,
                      status: val.flagged ? 'Flagged for Admin Review' : 'Partially Matched',
                      statusTone: 'active',
                      requiredBy: wizardData.date || '15 Oct 2026',
                      priority: wizardData.priority,
                      destination: wizardData.destination,
                      grade: wizardData.grade,
                      specs: 'Moisture < 12.0% • 100% NABL Lab Tested',
                      expectedPriceMin: targetPricePerMT,
                      expectedPriceMax: wizardData.expectedPriceMax * 1000,
                      targetPricePerMT,
                      mandiBenchmarkPerMT,
                      estimatedSavingsINR: Math.max(0, Math.round((mandiBenchmarkPerMT - targetPricePerMT) * volumeMT)),
                      matchScore: 95,
                      matchReason: 'AI matching engine identified 80% compatible supply from regional farmer silos complying with Price Floor Policy.',
                      allocationSources: [
                        {
                          sourceName: 'Regional Farmer Collective Silos',
                          volumeMT: Math.floor(volumeMT * 0.8),
                          rating: 4.9,
                          distanceKm: 85,
                          pricePerMT: targetPricePerMT
                        }
                      ],
                      createdAt: new Date().toISOString().split('T')[0],
                      history: [
                        { status: 'Demand Posted', time: 'Just now' },
                        { status: 'Price Floor Verified', time: 'Just now' },
                        { status: '80% Matched', time: 'Just now' }
                      ]
                    };

                    setDemands((prev) => [newDemand, ...prev]);
                    setIsWizardOpen(false);
                    setDemandSuccessMoment(newDemand);
                    syncDemandAdded(newDemand);
                  }}
                  className="ag-btn-primary text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" /> POST DEMAND
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SIGNATURE DEMAND LIVE MOMENT WITH OUTWARD RADAR SIGNALS (IN KG) */}
      {demandSuccessMoment && (
        <div className="fixed inset-0 z-50 bg-stone-950/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md p-6 text-center space-y-5">
            <div className="ag-radar-signal" />
            <div className="ag-radar-signal" />
            <div className="ag-radar-signal" />

            <div className="relative z-10 space-y-3">
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-mono font-bold border border-emerald-600/50">
                PRICE FLOOR VERIFIED & LIVE
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">
                {(demandSuccessMoment.requiredMT * 1000).toLocaleString()} kg {demandSuccessMoment.crop}
              </h2>
              <p className="text-emerald-400 font-mono text-xs">{demandSuccessMoment.grade} • Ref: {demandSuccessMoment.id}</p>
              <p className="text-stone-300 text-sm font-light pt-1">
                "Looking for compatible supply across certified smallholder collectives..."
              </p>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setDemandSuccessMoment(null);
                    setActiveDomain('demand');
                    showToast(`Demand Live: ${demandSuccessMoment.crop} searching supply!`, 'success');
                  }}
                  className="ag-btn-primary text-xs"
                >
                  Enter Sourcing Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUPPLY MATCH REVIEW MODAL (IN KG) */}
      {matchReviewDemand && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#171c19] rounded-2xl shadow-2xl border border-white/10 overflow-hidden p-6 space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-stone-400">
                  Demand Ref: {matchReviewDemand.id}
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {matchReviewDemand.crop} ({(matchReviewDemand.requiredMT * 1000).toLocaleString()} kg)
                </h2>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 font-bold text-xs border border-emerald-600/40">
                  Match: {matchReviewDemand.matchScore}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-stone-300">
                  Allocation Coverage:{' '}
                  <strong>
                    {(matchReviewDemand.matchedMT * 1000).toLocaleString()} / {(matchReviewDemand.requiredMT * 1000).toLocaleString()} kg
                  </strong>{' '}
                  ({matchReviewDemand.coveragePct}%)
                </span>
                <span
                  className={
                    matchReviewDemand.gapMT > 0
                      ? 'text-amber-400 font-bold'
                      : 'text-emerald-400 font-bold'
                  }
                >
                  {matchReviewDemand.gapMT > 0
                    ? `${(matchReviewDemand.gapMT * 1000).toLocaleString()} kg remaining`
                    : '100% Fulfilled'}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${matchReviewDemand.coveragePct}%` }}
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block">
                Proposed Sourcing Allocation (Database Unique Locked)
              </span>
              {matchReviewDemand.allocationSources.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-stone-900/90 border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{s.sourceName}</div>
                    <div className="text-stone-400 text-[11px] mt-0.5">
                      {s.distanceKm} km away • Rating: {s.rating} ★
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-white font-mono">
                      {(s.volumeMT * 1000).toLocaleString()} kg
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      ₹{(s.pricePerMT / 1000).toFixed(1)}/kg
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-stone-400 block text-[11px]">Est. Landed Savings:</span>
                <strong className="text-emerald-400 text-xs">
                  ₹{(matchReviewDemand.estimatedSavingsINR / 100000).toFixed(2)} Lakhs (8.4% Mandi Parity)
                </strong>
              </div>
              <button
                onClick={() => handleApproveSupplyMatch(matchReviewDemand.id)}
                className="ag-btn-primary text-xs"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve Match & Lock 40% Escrow</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELIVERY INSPECTION & GATE CONFIRMATION MODAL (IN KG) */}
      {deliveryConfirmOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#171c19] rounded-2xl shadow-2xl border border-white/10 overflow-hidden p-5 space-y-4 text-xs">
            <div className="pb-2 border-b border-white/10">
              <span className="text-stone-400 text-[10px] font-mono">
                Order #{deliveryConfirmOrder.id}
              </span>
              <h2 className="text-lg font-bold text-white">
                {deliveryConfirmOrder.crop} Gate Receiving
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-stone-900/90 border border-white/5">
              <div>
                <span className="text-stone-400 block mb-1">Manifest Quantity</span>
                <strong className="text-sm font-bold text-white font-mono">
                  {(deliveryConfirmOrder.volumeMT * 1000).toLocaleString()} kg
                </strong>
              </div>
              <div>
                <span className="text-stone-400 block mb-1">Delivered Weighbridge Slip</span>
                <strong className="text-sm font-bold text-emerald-400 font-mono">
                  {((deliveryConfirmOrder.volumeMT - 1.4) * 1000).toLocaleString()} kg
                </strong>
                <span className="text-[10px] text-stone-400 block">
                  (-1,400 kg in-transit drying variance)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-white block">Quality Signoff</span>
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">
                    100% NABL Lab Certified (Grade A Spec)
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 font-bold">
                  {deliveryConfirmOrder.qualityCert}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setDeliveryConfirmOrder(null)}
                className="ag-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmOrderReceipt(deliveryConfirmOrder.id)}
                className="ag-btn-primary text-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm Receipt & Release 60%</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISPUTE REPORTING MODAL (ENFORCES REJECTION WINDOW & RULE §16 VERIFIED LIABILITY) */}
      {disputeModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#171c19] rounded-2xl shadow-2xl border border-white/10 overflow-hidden p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <h2 className="text-base font-bold text-white">
                  Report Consignment Dispute
                </h2>
                <span className="text-[10px] text-stone-400">
                  Subject to 24h Inspection Window & Policy Rule §16
                </span>
              </div>
              <button
                onClick={() => setDisputeModalOpen(false)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-stone-400 block mb-1">Issue Category</label>
                <select
                  value={disputeType}
                  onChange={(e) => setDisputeType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/10 bg-stone-900 text-white"
                >
                  <option>Quantity Weighbridge Variance</option>
                  <option>Quality Grade Spec Non-Compliance</option>
                  <option>Transit Spoilage / Moisture Deviation</option>
                  <option>Delayed Freight Delivery</option>
                </select>
              </div>
              <div>
                <label className="text-stone-400 block mb-1">Purchase Order Reference</label>
                <input
                  type="text"
                  value={disputeOrderRef}
                  onChange={(e) => setDisputeOrderRef(e.target.value)}
                  className="w-full p-2 rounded-xl border border-white/10 bg-stone-900 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-stone-400 block mb-1">
                  Detailed Description of Discrepancy
                </label>
                <textarea
                  rows={3}
                  value={disputeDesc}
                  onChange={(e) => setDisputeDesc(e.target.value)}
                  className="w-full p-2 rounded-xl border border-white/10 bg-stone-900 text-white"
                  placeholder="Provide weighbridge ticket numbers or inspection observations..."
                />
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setDisputeModalOpen(false)}
                className="ag-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDispute}
                className="ag-btn-primary text-xs bg-rose-900 hover:bg-rose-800 text-white"
              >
                Submit Official Claim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BATCH QUALITY ASSAY & CHAIN OF CUSTODY MODAL */}
      {selectedBatchModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#171c19] rounded-2xl shadow-2xl border border-white/10 overflow-hidden p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <span className="text-stone-400 text-[10px] font-mono">
                  Batch #{selectedBatchModal.id} • {selectedBatchModal.labCertRef}
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {selectedBatchModal.crop} Quality Assay
                </h2>
              </div>
              <button
                onClick={() => setSelectedBatchModal(null)}
                className="p-1 rounded-full text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600/40">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Freshness Score</span>
                <strong className="text-base font-bold text-emerald-300 font-mono">
                  {selectedBatchModal.freshnessScore}% Certified
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-stone-900/80 border border-white/5">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Size Consistency</span>
                <strong className="text-base font-bold text-white font-mono">
                  {selectedBatchModal.sizeConsistency}% Calibrated
                </strong>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-white block">NABL Lab Tested Attributes</span>
              <div className="space-y-1">
                {selectedBatchModal.attributes.map((attr, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-stone-900/80 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <span className="text-stone-300">{attr.label}</span>
                    <span className="font-bold text-emerald-400 font-mono">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-white block">Farm-to-Factory Chain of Custody</span>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedBatchModal.chainOfCustody.map((stage, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-[11px]">
                    <div
                      className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                        stage.verified ? 'bg-emerald-400' : 'bg-stone-600'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-bold text-white">{stage.stage}</div>
                      <div className="text-stone-400">
                        {stage.actor} ({stage.location})
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 shrink-0">{stage.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedBatchModal(null)}
                className="ag-btn-primary text-xs"
              >
                Close Assay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION DRAWER */}
      <div id="notificationDrawer" className={notificationDrawerOpen ? 'open' : ''}>
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Procurement Activity</h2>
            <span className="text-xs text-stone-400 font-mono">Real-time system events</span>
          </div>
          <button
            onClick={() => setNotificationDrawerOpen(false)}
            className="p-1 rounded-full text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-xl ${
                n.unread
                  ? 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-300'
                  : 'bg-stone-900/60 border border-white/5 text-stone-400'
              } space-y-1 text-xs`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{n.title}</span>
                <span className="text-[10px] font-mono text-stone-400">{n.time}</span>
              </div>
              <p className="text-stone-300 leading-relaxed text-[11px]">{n.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* COMMAND PALETTE (CTRL+K) */}
      {cmdPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-lg bg-[#171c19] rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <Search className="w-4 h-4 text-stone-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search demands, orders, shipments, batches, invoices..."
                value={cmdSearchQuery}
                onChange={(e) => setCmdSearchQuery(e.target.value)}
                className="w-full text-xs bg-transparent focus:outline-none text-white placeholder-stone-500"
              />
              <button
                onClick={() => setCmdPaletteOpen(false)}
                className="text-[10px] text-stone-400 font-mono px-1.5 py-0.5 rounded border border-white/10"
              >
                ESC
              </button>
            </div>
            <div className="p-3 text-xs space-y-1">
              <div
                onClick={() => {
                  setActiveDomain('demand');
                  setCmdPaletteOpen(false);
                }}
                className="p-2.5 rounded-xl hover:bg-stone-800 transition cursor-pointer flex justify-between items-center text-stone-300"
              >
                <span>Wheat (Sharbati) — 4,20,000 kg Demand (75% Covered)</span>
                <span className="text-[10px] font-mono text-emerald-400">Demand</span>
              </div>
              <div
                onClick={() => {
                  setActiveDomain('tracking');
                  setCmdPaletteOpen(false);
                }}
                className="p-2.5 rounded-xl hover:bg-stone-800 transition cursor-pointer flex justify-between items-center text-stone-300"
              >
                <span>Truck HR-05-BC-7892 (2,50,000 kg Basmati, In Transit)</span>
                <span className="text-[10px] font-mono text-blue-400">Tracking</span>
              </div>
              <div
                onClick={() => {
                  setActiveDomain('orders');
                  setCmdPaletteOpen(false);
                }}
                className="p-2.5 rounded-xl hover:bg-stone-800 transition cursor-pointer flex justify-between items-center text-stone-300"
              >
                <span>Order #AG-2038 (Nashik Red Onion, Delivered)</span>
                <span className="text-[10px] font-mono text-stone-400">Orders</span>
              </div>
              <div
                onClick={() => {
                  setActiveDomain('payments');
                  setCmdPaletteOpen(false);
                }}
                className="p-2.5 rounded-xl hover:bg-stone-800 transition cursor-pointer flex justify-between items-center text-stone-300"
              >
                <span>RTGS Escrow Release (₹17.32 L, Settled)</span>
                <span className="text-[10px] font-mono text-amber-400">Payments</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST ALERT */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-xs font-semibold shadow-2xl border transition-all duration-200 ${
            toastMessage.type === 'error'
              ? 'bg-rose-950 text-rose-200 border-rose-600'
              : toastMessage.type === 'success'
              ? 'bg-emerald-950 text-emerald-200 border-emerald-600'
              : 'bg-stone-900 text-white border-stone-700'
          }`}
        >
          {toastMessage.text}
        </div>
      )}
    </div>
  );
};
