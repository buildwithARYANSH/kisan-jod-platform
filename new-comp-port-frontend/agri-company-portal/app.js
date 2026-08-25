/**
 * AgriCore Enterprise Procurement OS - Master Application Controller
 * Features: 300-450px Cursor-Reactive Ambient Canvas • Multi-Branch Filtering
 * • 8-Step Demand Creator • Match Review & Approval • Live Moving Fleet Map
 * • Delivery Confirmation • Chain of Custody • Dispute Workflow • AI Assistant • Report Generator
 */

const State = {
  activeDomain: 'overview', // overview | demand | procurement | orders | tracking | payments | insights | company | disputes | reports | team
  selectedBranch: 'ALL',
  demands: [...MOCK_DATA.demands],
  orders: [...MOCK_DATA.orders],
  disputes: [...MOCK_DATA.disputes],
  team: [...MOCK_DATA.team],
  expandedDemandId: null,
  expandedOrderId: null,
  activeFinancePeriod: '7D',
  activeInsightsTab: 'volume',
  activeTruckId: 'TRK-284',
  wizardStep: 1,
  wizardData: {
    crop: 'Wheat (Sharbati)',
    quantity: 420,
    unit: 'MT',
    grade: 'Grade A',
    expectedPriceMin: 28000,
    expectedPriceMax: 29000,
    date: '2026-09-15',
    time: '17:00',
    branchId: 'BR-DELHI',
    destination: 'Delhi-NCR Mega Plant (Gr. Noida)',
    priority: 'High',
    advancedSpecs: 'Moisture < 11.5% • Gluten > 11%'
  },
  mouse: { x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0, active: false },
  notifications: [...MOCK_DATA.notifications],
  canvasAnimIds: {}
};

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initCursorReactiveEngine();
  initLivingClock();
  initGlobalNavigation();
  initBranchSwitcher();
  initCommandPalette();
  initNotificationDrawer();
  initAIAssistant();
  renderCurrentDomain();
});

// ============================================================================
// 1. CURSOR-REACTIVE ANTIGRAVITY ENGINE (300-450PX INTERACTION RADIUS)
// ============================================================================
function initCursorReactiveEngine() {
  const canvas = document.getElementById('cursorInteractionCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    State.mouse.vx = e.clientX - State.mouse.lastX;
    State.mouse.vy = e.clientY - State.mouse.lastY;
    State.mouse.x = e.clientX;
    State.mouse.y = e.clientY;
    State.mouse.lastX = e.clientX;
    State.mouse.lastY = e.clientY;
    State.mouse.active = true;
  });

  document.addEventListener('mouseleave', () => {
    State.mouse.active = false;
  });

  // 36 Micro-particles bound within 350px radius
  const particleCount = 36;
  const radiusMax = Math.min(window.innerWidth * 0.28, 380);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      relX: (Math.random() - 0.5) * radiusMax * 1.8,
      relY: (Math.random() - 0.5) * radiusMax * 1.8,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      size: Math.random() * 2 + 1.2,
      baseAlpha: Math.random() * 0.35 + 0.25,
      alpha: 0
    });
  }

  function renderCursorField() {
    ctx.clearRect(0, 0, width, height);

    if (State.mouse.active && State.mouse.x > 0 && State.mouse.y > 0) {
      const speed = Math.min(Math.sqrt(State.mouse.vx * State.mouse.vx + State.mouse.vy * State.mouse.vy), 15);

      particles.forEach((p, idx) => {
        p.relX += p.vx + (State.mouse.vx * 0.04);
        p.relY += p.vy + (State.mouse.vy * 0.04);

        const dist = Math.sqrt(p.relX * p.relX + p.relY * p.relY);
        if (dist > radiusMax) {
          p.relX = (p.relX / dist) * (radiusMax - 2);
          p.relY = (p.relY / dist) * (radiusMax - 2);
          p.vx *= -0.75;
          p.vy *= -0.75;
        }

        const px = State.mouse.x + p.relX;
        const py = State.mouse.y + p.relY;

        const edgeFade = Math.max(0, 1 - dist / radiusMax);
        p.alpha = p.baseAlpha * edgeFade * (0.5 + speed * 0.035);

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20, 83, 45, ${p.alpha})`;
        ctx.fill();

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.relX - p2.relX;
          const dy = p.relY - p2.relY;
          const lineDist = Math.sqrt(dx * dx + dy * dy);

          if (lineDist < 65) {
            const lineAlpha = (1 - lineDist / 65) * 0.16 * edgeFade;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(State.mouse.x + p2.relX, State.mouse.y + p2.relY);
            ctx.strokeStyle = `rgba(20, 83, 45, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });
    }

    requestAnimationFrame(renderCursorField);
  }

  renderCursorField();
}

// ============================================================================
// 2. LIVING TIME & CLOCK
// ============================================================================
function initLivingClock() {
  updateLivingClock();
  setInterval(updateLivingClock, 1000);
}

function updateLivingClock() {
  const el = document.getElementById('livingClockDisplay');
  if (!el) return;

  const now = new Date();
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');

  el.innerHTML = `
    <div class="flex items-center gap-2 text-[11px] font-mono-tight text-stone-500">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
      <span class="font-medium">${day} ${date} ${month}</span>
      <span class="text-stone-300">•</span>
      <span class="font-bold text-stone-900">${h} : ${m} : ${s}</span>
      <span class="hidden xl:inline text-stone-400 text-[10px] uppercase ml-1">NETWORK LIVE</span>
    </div>
  `;
}

// ============================================================================
// 3. MULTI-BRANCH SELECTOR
// ============================================================================
function initBranchSwitcher() {
  const select = document.getElementById('branchSelectorSelect');
  if (select) {
    select.addEventListener('change', (e) => {
      State.selectedBranch = e.target.value;
      showToast(`Switched view to ${e.target.options[e.target.selectedIndex].text}`, 'info');
      renderCurrentDomain();
    });
  }
}

function getFilteredDemands() {
  if (State.selectedBranch === 'ALL') return State.demands;
  return State.demands.filter(d => d.branchId === State.selectedBranch);
}

function getFilteredOrders() {
  if (State.selectedBranch === 'ALL') return State.orders;
  return State.orders.filter(o => o.branchId === State.selectedBranch);
}

// ============================================================================
// 4. GLOBAL NAVIGATION & ROUTER
// ============================================================================
function initGlobalNavigation() {
  document.querySelectorAll('[data-os-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const domain = link.getAttribute('data-os-nav');
      switchOSDomain(domain);
    });
  });
}

function switchOSDomain(domainKey) {
  Object.values(State.canvasAnimIds).forEach(id => cancelAnimationFrame(id));
  State.canvasAnimIds = {};

  State.activeDomain = domainKey;

  document.querySelectorAll('[data-os-nav]').forEach(el => {
    if (el.getAttribute('data-os-nav') === domainKey) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  renderCurrentDomain();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCurrentDomain() {
  const container = document.getElementById('procurementOSViewport');
  if (!container) return;

  switch (State.activeDomain) {
    case 'overview':
      renderOverviewDomain(container);
      break;
    case 'demand':
      renderDemandDomain(container);
      break;
    case 'procurement':
      renderProcurementDomain(container);
      break;
    case 'orders':
      renderOrdersDomain(container);
      break;
    case 'tracking':
      renderTrackingDomain(container);
      break;
    case 'payments':
      renderPaymentsDomain(container);
      break;
    case 'insights':
      renderInsightsDomain(container);
      break;
    case 'disputes':
      renderDisputesDomain(container);
      break;
    case 'reports':
      renderReportsDomain(container);
      break;
    case 'team':
      renderTeamDomain(container);
      break;
    case 'company':
      renderCompanyProfileDomain(container);
      break;
    default:
      renderOverviewDomain(container);
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ============================================================================
// 5. OVERVIEW DOMAIN — LIVING PROCUREMENT COMMAND CENTER
// ============================================================================
function renderOverviewDomain(container) {
  const c = MOCK_DATA.company;
  const filteredDemands = getFilteredDemands();
  const totalVolume = filteredDemands.reduce((acc, d) => acc + d.requiredMT, 0);
  const matchedVolume = filteredDemands.reduce((acc, d) => acc + d.matchedMT, 0);
  const coveragePct = totalVolume > 0 ? Math.round((matchedVolume / totalVolume) * 100) : 0;

  container.innerHTML = `
    <div class="space-y-12">
      <!-- Welcome Hero Statement -->
      <div class="pt-4 max-w-3xl space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/60 text-[11px] font-mono-tight text-stone-700">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          <span>ENTERPRISE PROCUREMENT OS</span>
        </div>
        <h1 class="text-4xl sm:text-6xl font-light tracking-tight text-stone-900 leading-[1.06]">
          Good afternoon, <span class="font-normal text-stone-900">${c.shortName}.</span><br>
          <span class="font-editorial italic text-emerald-900 font-normal">Your procurement network is in motion.</span>
        </h1>
        <p class="text-stone-500 text-sm sm:text-base font-light max-w-lg leading-relaxed pt-1">
          Monitor your agricultural requirements, matched smallholder inventory, and live shipments in real-time.
        </p>

        <!-- Primary Action -->
        <div class="flex items-center gap-4 pt-4">
          <button onclick="openDemandWizard()" class="btn-editorial-primary">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Create Demand</span>
          </button>
          <button onclick="switchOSDomain('procurement')" class="btn-editorial-secondary">
            <span>Review Supply Matches</span>
          </button>
        </div>
      </div>

      <!-- Living Supply-Demand Flow Visualization -->
      <div class="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-4">
        <div class="flex items-center justify-between text-xs text-stone-400">
          <span class="flex items-center gap-1.5 font-medium"><span class="w-2 h-2 rounded-full bg-emerald-600"></span> Living Supply-Demand Flow</span>
          <span class="font-mono-tight">${filteredDemands.length} Active Demands • ${totalVolume.toLocaleString()} MT Demanded</span>
        </div>
        <div class="h-56 w-full relative">
          <canvas id="overviewFlowCanvas" class="w-full h-full"></canvas>
        </div>
      </div>

      <!-- 4 High-Level Key Metrics (70% Whitespace • 20% Info) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">Active Demands</span>
          <div class="text-3xl font-extrabold text-stone-900 tracking-tight">${filteredDemands.length} <span class="text-sm font-normal text-stone-400">Crops</span></div>
          <span class="text-xs text-stone-500 mt-1 block">24 Demands YTD</span>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">Demanded Volume</span>
          <div class="text-3xl font-extrabold text-stone-900 tracking-tight">${totalVolume.toLocaleString()} <span class="text-sm font-normal text-stone-400">MT</span></div>
          <span class="text-xs text-emerald-800 font-semibold mt-1 block">${coveragePct}% Matched</span>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">Matched Supply</span>
          <div class="text-3xl font-extrabold text-emerald-800 tracking-tight">${matchedVolume.toLocaleString()} <span class="text-sm font-normal text-stone-400">MT</span></div>
          <span class="text-xs text-stone-500 mt-1 block">Verified NABL Quality</span>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">Est. Landed Savings</span>
          <div class="text-3xl font-extrabold text-stone-900 tracking-tight">₹38.4 <span class="text-sm font-normal text-stone-400">L</span></div>
          <span class="text-xs text-emerald-800 font-semibold mt-1 block">8.4% vs APMC Mandi</span>
        </div>
      </div>
    </div>
  `;

  setTimeout(initOverviewFlowCanvas, 60);
}

function initOverviewFlowCanvas() {
  const canvas = document.getElementById('overviewFlowCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;

  const stages = [
    { label: "Company Demand", x: w * 0.12, y: h * 0.5, color: "#18181b", sub: "1,320 MT Active" },
    { label: "AI Match Engine", x: w * 0.35, y: h * 0.5, color: "#059669", sub: "78.4% Compatible" },
    { label: "Farm Aggregation", x: w * 0.58, y: h * 0.5, color: "#d97706", sub: "1,035 MT Staged" },
    { label: "Dispatch Fleet", x: w * 0.78, y: h * 0.5, color: "#2563eb", sub: "3 En Route" },
    { label: "Plant Receiving", x: w * 0.92, y: h * 0.5, color: "#14532d", sub: "Gr. Noida / Pune" }
  ];

  let tick = 0;

  function render() {
    ctx.clearRect(0, 0, w, h);
    tick += 0.022;

    for (let i = 0; i < stages.length - 1; i++) {
      const s1 = stages[i];
      const s2 = stages[i + 1];

      ctx.beginPath();
      ctx.moveTo(s1.x, s1.y);
      ctx.lineTo(s2.x, s2.y);
      ctx.strokeStyle = "rgba(24, 24, 27, 0.09)";
      ctx.lineWidth = 2;
      ctx.stroke();

      const progress = (tick * 0.35 + i * 0.25) % 1;
      const px = s1.x + (s2.x - s1.x) * progress;
      const py = s1.y + (s2.y - s1.y) * progress;

      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#d97706";
      ctx.fill();
    }

    stages.forEach((st, idx) => {
      ctx.beginPath();
      ctx.arc(st.x, st.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = st.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(st.x, st.y, 13 + Math.sin(tick + idx) * 2.5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(20, 83, 45, 0.12)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = "600 11px Plus Jakarta Sans, sans-serif";
      ctx.fillStyle = "#18181b";
      ctx.textAlign = "center";
      ctx.fillText(st.label, st.x, st.y - 15);

      ctx.font = "400 10px JetBrains Mono, monospace";
      ctx.fillStyle = "#a1a1aa";
      ctx.fillText(st.sub, st.x, st.y + 22);
    });

    State.canvasAnimIds.overview = requestAnimationFrame(render);
  }

  render();
}

// ============================================================================
// 6. DEMAND DOMAIN & 8-STEP GUIDED WIZARD
// ============================================================================
function renderDemandDomain(container) {
  const filteredDemands = getFilteredDemands();

  container.innerHTML = `
    <div class="space-y-8 max-w-4xl mx-auto pt-4">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span class="text-xs font-mono-tight font-bold uppercase tracking-widest text-emerald-800">Demand Workspace</span>
          <h1 class="text-4xl font-light text-stone-900 tracking-tight mt-1">Active Requirements</h1>
          <p class="text-xs text-stone-500 font-light mt-0.5">Tell the network what your business needs.</p>
        </div>
        <button onclick="openDemandWizard()" class="btn-editorial-primary text-xs">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i>
          <span>+ Create Demand</span>
        </button>
      </div>

      <!-- Clean Expandable Demand Rows -->
      <div class="space-y-3">
        ${filteredDemands.map(d => {
          const isExpanded = State.expandedDemandId === d.id;
          return `
            <div class="procure-row-card p-6 ${isExpanded ? 'expanded' : ''}" onclick="toggleDemandRow('${d.id}')">
              <!-- Summary Line -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center font-editorial italic text-lg font-bold text-stone-800">
                    ${d.crop.charAt(0)}
                  </div>
                  <div>
                    <h2 class="text-base font-bold text-stone-900">${d.crop}</h2>
                    <p class="text-xs text-stone-400 font-mono-tight">${d.requiredMT} MT • Required by ${d.requiredBy} • Priority: <span class="font-semibold text-stone-700">${d.priority}</span></p>
                  </div>
                </div>

                <div class="flex items-center gap-6 text-right">
                  <div>
                    <div class="text-sm font-extrabold ${d.coveragePct === 100 ? 'text-emerald-800' : 'text-stone-900'}">${d.coveragePct}% Covered</div>
                    <div class="text-[11px] font-medium ${getStatusColorClass(d.status)}">${d.status}</div>
                  </div>
                  <i data-lucide="${isExpanded ? 'chevron-up' : 'chevron-down'}" class="w-4 h-4 text-stone-400"></i>
                </div>
              </div>

              <!-- Expanded Details -->
              ${isExpanded ? `
                <div class="pt-6 mt-6 border-t border-stone-100 text-xs space-y-4">
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <span class="text-stone-400 block mb-0.5">Destination Plant</span>
                      <strong class="text-stone-900">${d.destination}</strong>
                    </div>
                    <div>
                      <span class="text-stone-400 block mb-0.5">Matched Quantity</span>
                      <strong class="text-emerald-800 font-bold">${d.matchedMT} MT</strong>
                    </div>
                    <div>
                      <span class="text-stone-400 block mb-0.5">Deficit Gap</span>
                      <strong class="${d.gapMT > 0 ? 'text-amber-700' : 'text-stone-400'} font-bold">${d.gapMT > 0 ? `${d.gapMT} MT remaining` : 'Fully Sourced'}</strong>
                    </div>
                    <div>
                      <span class="text-stone-400 block mb-0.5">Target Rate</span>
                      <strong class="text-stone-900 font-mono-tight">₹${(d.targetPricePerMT/1000).toFixed(1)}k / MT</strong>
                    </div>
                  </div>

                  <!-- AI Matching Summary Capsule -->
                  <div class="p-4 rounded-xl bg-stone-100 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-start gap-2.5">
                      <i data-lucide="sparkles" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></i>
                      <div>
                        <span class="font-bold text-stone-900 block mb-0.5">Smart Match Intelligence (Score: ${d.matchScore}%)</span>
                        <p class="text-stone-600 leading-relaxed">${d.matchReason}</p>
                      </div>
                    </div>
                    <button onclick="event.stopPropagation(); openMatchReviewModal('${d.id}')" class="btn-editorial-primary text-[11px] py-1.5 px-3 shrink-0 whitespace-nowrap">
                      <span>Review Allocation</span>
                    </button>
                  </div>

                  <div class="flex items-center justify-between pt-2 text-[11px] text-stone-400 border-t border-stone-100">
                    <span>Quality Standard: <strong class="text-stone-700">${d.grade} (${d.specs})</strong></span>
                    <span class="font-mono-tight">Ref: ${d.id} • Order #${d.orderRef}</span>
                  </div>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function toggleDemandRow(demandId) {
  State.expandedDemandId = State.expandedDemandId === demandId ? null : demandId;
  renderCurrentDomain();
}

// ============================================================================
// 7. DEMAND CREATOR WIZARD (8 STEPS)
// ============================================================================
function openDemandWizard() {
  State.wizardStep = 1;
  const modal = document.getElementById('demandWizardModal');
  if (modal) {
    modal.classList.remove('hidden');
    renderWizardStep();
  }
}

function closeDemandWizard() {
  const modal = document.getElementById('demandWizardModal');
  if (modal) modal.classList.add('hidden');
}

function renderWizardStep() {
  const step = State.wizardStep;
  const container = document.getElementById('wizardStepContainer');
  if (!container) return;

  let content = '';

  if (step === 1) {
    content = `
      <div class="space-y-6">
        <span class="text-xs font-mono-tight font-bold uppercase tracking-widest text-emerald-800">Step 01 of 08</span>
        <h2 class="text-3xl font-light text-stone-900 tracking-tight">What agricultural produce do you need?</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          ${['Wheat (Sharbati)', 'Basmati Rice (Pusa 1121)', 'Nashik Red Onion', 'Yellow Mustard Seed', 'Hybrid Tomato', 'Soybean (Non-GMO)'].map(c => `
            <button onclick="selectWizardCrop('${c}')" class="p-4 rounded-xl text-left border ${State.wizardData.crop === c ? 'border-stone-900 bg-stone-100 font-bold' : 'border-stone-200 bg-white text-stone-700'} hover:border-stone-400 transition text-xs">
              ${c}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  } else if (step === 2) {
    content = `
      <div class="space-y-6">
        <span class="text-xs font-mono-tight font-bold uppercase tracking-widest text-emerald-800">Step 02 of 08</span>
        <h2 class="text-3xl font-light text-stone-900 tracking-tight">How much quantity do you need?</h2>
        <div class="pt-4">
          <div class="flex items-baseline gap-3">
            <input type="number" id="wizardQtyInput" value="${State.wizardData.quantity}" class="text-5xl font-mono-tight bg-transparent border-b-2 border-stone-900 pb-2 focus:outline-none w-48 text-stone-900" min="10" placeholder="420">
            <span class="text-2xl font-bold text-stone-400">Metric Tons (MT)</span>
          </div>
          <p class="text-xs text-stone-400 mt-3 font-mono-tight">Minimum standard lot allocation: 10 MT</p>
        </div>
      </div>
    `;
  } else if (step === 3) {
    content = `
      <div class="space-y-6">
        <span class="text-xs font-mono-tight font-bold uppercase tracking-widest text-emerald-800">Step 03 of 08</span>
        <h2 class="text-3xl font-light text-stone-900 tracking-tight">What quality grade do you require?</h2>
        <div class="space-y-3 pt-2">
          ${[
            { grade: 'Grade A', desc: 'Premium food processing standard (< 11.5% moisture, 100% NABL lab tested)' },
            { grade: 'Grade B', desc: 'Standard commercial industrial grade (< 13% moisture)' },
            { grade: 'Grade C', desc: 'General commodity & animal nutrition standard' }
          ].map(g => `
            <button onclick="selectWizardGrade('${g.grade}')" class="w-full p-4 rounded-xl text-left border ${State.wizardData.grade === g.grade ? 'border-stone-900 bg-stone-100 font-bold' : 'border-stone-200 bg-white text-stone-700'} text-xs">
              <div class="font-bold text-stone-900 text-sm">${g.grade}</div>
              <div class="text-stone-500 font-light mt-0.5">${g.desc}</div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  } else if (step === 4) {
    content = `
      <div class="space-y-6">
        <span class="text-xs font-mono-tight font-bold uppercase tracking-widest text-emerald-800">Step 04 of 08</span>
        <h2 class="text-3xl font-light text-stone-900 tracking-tight">Expected Procurement Price Range</h2>
        <div class="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label class="text-xs text-stone-400 block mb-1">Min Acceptable Price (₹/MT)</label>
            <input type="number" id="wizardPriceMinInput" value="${State.wizardData.expectedPriceMin}" class="w-full p-3 rounded-xl border border-stone-200 text-sm font-mono-tight focus:outline-none">
          </div>
          <div>
            <label class="text-xs text-stone-400 block mb-1">Max Acceptable Price (₹/MT)</label>
            <input type="number" id="wizardPriceMaxInput" value="${State.wizardData.expectedPriceMax}" class="w-full p-3 rounded-xl border border-stone-200 text-sm font-mono-tight focus:outline-none">
          </div>
        </div>
        <p class="text-xs text-stone-400">Current Reference Mandi Index: ₹29,200/MT</p>
      </div>
    `;
  } else if (step === 5) {
    content = `
      <div class="space-y-6">
        <span class="text-xs font-mono-tight font-bold uppercase tracking-widest text-emerald-800">Step 05 of 08</span>
        <h2 class="text-3xl font-light text-stone-900 tracking-tight">When is this produce needed by?</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label class="text-xs text-stone-400 block mb-1">Required Delivery Date</label>
            <input type="date" id="wizardDateInput" value="${State.wizardData.date}" class="w-full p-3 rounded-xl border border-stone-200 text-sm font-mono-tight focus:outline-none">
          </div>
          <div>
            <label class="text-xs text-stone-400 block mb-1">Latest Intake Time</label>
            <input type="time" id="wizardTimeInput" value="${State.wizardData.time}" class="w-full p-3 rounded-xl border border-stone-200 text-sm font-mono-tight focus:outline-none">
          </div>
        </div>
      </div>
    `;
  } else if (step === 6) {
    content = `
      <div class="space-y-6">
        <span class="text-xs font-mono-tight font-bold uppercase tracking-widest text-emerald-800">Step 06 of 08</span>
        <h2 class="text-3xl font-light text-stone-900 tracking-tight">Destination Plant & Branch</h2>
        <div class="space-y-4 pt-2">
          <div>
            <label class="text-xs text-stone-400 block mb-1">Select Receiving Plant</label>
            <select id="wizardBranchSelect" class="w-full p-3 rounded-xl border border-stone-200 text-xs focus:outline-none bg-white">
              <option value="BR-DELHI" ${State.wizardData.branchId === 'BR-DELHI' ? 'selected' : ''}>Delhi-NCR Mega Plant (Gr. Noida, UP)</option>
              <option value="BR-PUNE" ${State.wizardData.branchId === 'BR-PUNE' ? 'selected' : ''}>Pune Integrated Agro-Hub (Ranjangaon, MH)</option>
              <option value="BR-BLR" ${State.wizardData.branchId === 'BR-BLR' ? 'selected' : ''}>Bengaluru South Distribution (Peenya, KA)</option>
            </select>
          </div>
        </div>
      </div>
    `;
  } else if (step === 7) {
    content = `
      <div class="space-y-6">
        <span class="text-xs font-mono-tight font-bold uppercase tracking-widest text-emerald-800">Step 07 of 08</span>
        <h2 class="text-3xl font-light text-stone-900 tracking-tight">Allocation Priority</h2>
        <div class="grid grid-cols-3 gap-3 pt-2">
          ${['Critical', 'High', 'Normal'].map(p => `
            <button onclick="selectWizardPriority('${p}')" class="p-4 rounded-xl text-center border ${State.wizardData.priority === p ? 'border-stone-900 bg-stone-100 font-bold' : 'border-stone-200 bg-white text-stone-700'} text-xs">
              <div class="font-bold text-sm">${p}</div>
              <span class="text-[10px] text-stone-400 mt-1 block">${p === 'Critical' ? 'Top Allocation Queue' : 'Standard Queue'}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  } else if (step === 8) {
    content = `
      <div class="space-y-6">
        <span class="text-xs font-mono-tight font-bold uppercase tracking-widest text-emerald-800">Step 08 of 08 — Review</span>
        <h2 class="text-3xl font-light text-stone-900 tracking-tight">Review Demand Specification</h2>
        <div class="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-3">
          <div class="flex justify-between border-b border-stone-200/60 pb-2">
            <span class="text-stone-500">Crop:</span>
            <strong class="text-stone-900">${State.wizardData.crop}</strong>
          </div>
          <div class="flex justify-between border-b border-stone-200/60 pb-2">
            <span class="text-stone-500">Quantity:</span>
            <strong class="text-stone-900 font-mono-tight">${State.wizardData.quantity} MT</strong>
          </div>
          <div class="flex justify-between border-b border-stone-200/60 pb-2">
            <span class="text-stone-500">Quality Grade:</span>
            <strong class="text-stone-900">${State.wizardData.grade}</strong>
          </div>
          <div class="flex justify-between border-b border-stone-200/60 pb-2">
            <span class="text-stone-500">Target Range:</span>
            <strong class="text-stone-900 font-mono-tight">₹${State.wizardData.expectedPriceMin.toLocaleString()} – ₹${State.wizardData.expectedPriceMax.toLocaleString()}/MT</strong>
          </div>
          <div class="flex justify-between border-b border-stone-200/60 pb-2">
            <span class="text-stone-500">Required By:</span>
            <strong class="text-stone-900">${State.wizardData.date}</strong>
          </div>
          <div class="flex justify-between">
            <span class="text-stone-500">Priority:</span>
            <strong class="text-emerald-800">${State.wizardData.priority}</strong>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = content;

  // Footer Controls
  const footer = document.getElementById('wizardFooterControls');
  if (footer) {
    footer.innerHTML = `
      <div class="flex items-center justify-between w-full">
        ${step > 1 ? `
          <button onclick="prevWizardStep()" class="btn-editorial-secondary text-xs">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i> Back
          </button>
        ` : '<div></div>'}

        ${step < 8 ? `
          <button onclick="nextWizardStep()" class="btn-editorial-primary text-xs">
            Continue <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        ` : `
          <button onclick="submitDemandWizard()" class="btn-editorial-primary text-xs bg-emerald-950 text-white">
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> POST DEMAND
          </button>
        `}
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }
}

function selectWizardCrop(crop) { State.wizardData.crop = crop; nextWizardStep(); }
function selectWizardGrade(grade) { State.wizardData.grade = grade; nextWizardStep(); }
function selectWizardPriority(p) { State.wizardData.priority = p; nextWizardStep(); }

function nextWizardStep() {
  if (State.wizardStep === 2) {
    const el = document.getElementById('wizardQtyInput');
    if (el) State.wizardData.quantity = parseFloat(el.value) || 420;
  }
  if (State.wizardStep === 4) {
    const minEl = document.getElementById('wizardPriceMinInput');
    const maxEl = document.getElementById('wizardPriceMaxInput');
    if (minEl) State.wizardData.expectedPriceMin = parseFloat(minEl.value) || 28000;
    if (maxEl) State.wizardData.expectedPriceMax = parseFloat(maxEl.value) || 29000;
  }
  if (State.wizardStep === 5) {
    const dateEl = document.getElementById('wizardDateInput');
    const timeEl = document.getElementById('wizardTimeInput');
    if (dateEl) State.wizardData.date = dateEl.value;
    if (timeEl) State.wizardData.time = timeEl.value;
  }
  if (State.wizardStep === 6) {
    const branchEl = document.getElementById('wizardBranchSelect');
    if (branchEl) {
      State.wizardData.branchId = branchEl.value;
      State.wizardData.destination = branchEl.options[branchEl.selectedIndex].text;
    }
  }
  if (State.wizardStep < 8) {
    State.wizardStep++;
    renderWizardStep();
  }
}

function prevWizardStep() {
  if (State.wizardStep > 1) {
    State.wizardStep--;
    renderWizardStep();
  }
}

function submitDemandWizard() {
  const newDemand = {
    id: `DEM-0${Math.floor(896 + Math.random() * 50)}`,
    orderRef: `AG-${Math.floor(2060 + Math.random() * 40)}`,
    crop: State.wizardData.crop,
    variety: "Certified Platform Grade Standard",
    category: "Grains",
    branchId: State.wizardData.branchId,
    requiredMT: State.wizardData.quantity,
    matchedMT: Math.floor(State.wizardData.quantity * 0.8),
    gapMT: Math.ceil(State.wizardData.quantity * 0.2),
    coveragePct: 80,
    status: "Partially Matched",
    statusTone: "active",
    requiredBy: State.wizardData.date || "15 Oct 2026",
    priority: State.wizardData.priority,
    destination: State.wizardData.destination,
    grade: State.wizardData.grade,
    specs: "Moisture < 12.0% • 100% NABL Lab Tested",
    targetPricePerMT: State.wizardData.expectedPriceMin || 28500,
    mandiBenchmarkPerMT: (State.wizardData.expectedPriceMin || 28500) + 700,
    estimatedSavingsINR: Math.round(State.wizardData.quantity * 1000),
    matchScore: 95,
    matchReason: "AI matching engine identified 80% compatible supply from regional farmer silos in Western UP.",
    allocationSources: [
      { sourceName: "Western UP Cluster Silos", volumeMT: Math.floor(State.wizardData.quantity * 0.8), rating: 4.9, distanceKm: 85, pricePerMT: 28500 }
    ],
    createdAt: new Date().toISOString().split('T')[0],
    history: [
      { status: "Demand Posted", time: "Just now" },
      { status: "80% Matched", time: "Just now" }
    ]
  };

  State.demands.unshift(newDemand);
  closeDemandWizard();

  showToast(`Demand Live: ${newDemand.crop} (${newDemand.requiredMT} MT) posted and searching supply!`, 'success');
  switchOSDomain('demand');
}

// ============================================================================
// 8. SUPPLY MATCHING & ALLOCATION APPROVAL MODAL
// ============================================================================
function openMatchReviewModal(demandId) {
  const d = State.demands.find(item => item.id === demandId);
  if (!d) return;

  const modal = document.getElementById('matchReviewModal');
  const container = document.getElementById('matchReviewContent');
  if (!modal || !container) return;

  container.innerHTML = `
    <div class="space-y-6 text-xs">
      <div class="flex items-center justify-between pb-4 border-b border-stone-100">
        <div>
          <span class="text-[10px] font-mono-tight text-stone-400">Demand Ref: ${d.id}</span>
          <h2 class="text-xl font-bold text-stone-900 mt-0.5">${d.crop} (${d.requiredMT} MT)</h2>
        </div>
        <div class="text-right">
          <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">Match Score: ${d.matchScore}%</span>
        </div>
      </div>

      <!-- Allocation Progress Bar -->
      <div class="space-y-2">
        <div class="flex justify-between text-xs">
          <span class="font-medium text-stone-600">Allocation Coverage: <strong>${d.matchedMT} / ${d.requiredMT} MT</strong> (${d.coveragePct}%)</span>
          <span class="${d.gapMT > 0 ? 'text-amber-700' : 'text-emerald-800'} font-bold">${d.gapMT > 0 ? `${d.gapMT} MT remaining` : '100% Fulfilled'}</span>
        </div>
        <div class="w-full h-3 rounded-full bg-stone-100 overflow-hidden">
          <div class="h-full bg-emerald-700 rounded-full" style="width: ${d.coveragePct}%"></div>
        </div>
      </div>

      <!-- Sources Breakdown -->
      <div class="space-y-3 pt-2">
        <span class="text-xs font-bold text-stone-400 uppercase tracking-widest block">Proposed Sourcing Allocation</span>
        ${d.allocationSources.map(s => `
          <div class="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
            <div>
              <div class="font-bold text-stone-900 text-sm">${s.sourceName}</div>
              <div class="text-stone-500 text-[11px] mt-0.5">${s.distanceKm} km away • Rating: ${s.rating} ★</div>
            </div>
            <div class="text-right">
              <div class="text-sm font-extrabold text-stone-900 font-mono-tight">${s.volumeMT} MT</div>
              <span class="text-[11px] text-emerald-800 font-mono-tight">₹${(s.pricePerMT/1000).toFixed(1)}k/MT</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Action Button: Approve Match -->
      <div class="pt-4 border-t border-stone-100 flex items-center justify-between">
        <div>
          <span class="text-stone-400 block">Est. Landed Savings:</span>
          <strong class="text-emerald-800 text-sm">₹${(d.estimatedSavingsINR/100000).toFixed(2)} Lakhs (8.4% Mandi Parity)</strong>
        </div>
        <button onclick="approveSupplyMatch('${d.id}')" class="btn-editorial-primary text-xs bg-emerald-950 text-white">
          <i data-lucide="check-circle" class="w-4 h-4"></i>
          <span>Approve Match & Reserve Stock</span>
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeMatchReviewModal() {
  const modal = document.getElementById('matchReviewModal');
  if (modal) modal.classList.add('hidden');
}

function approveSupplyMatch(demandId) {
  const d = State.demands.find(item => item.id === demandId);
  if (!d) return;

  d.status = "Matched (Reserved)";
  d.coveragePct = 100;
  d.matchedMT = d.requiredMT;
  d.gapMT = 0;

  // Add or update corresponding Purchase Order
  let order = State.orders.find(o => o.demandId === demandId);
  if (!order) {
    order = {
      id: d.orderRef,
      demandId: d.id,
      crop: d.crop,
      volumeMT: d.requiredMT,
      grade: d.grade,
      branchId: d.branchId,
      pricePerMT: d.targetPricePerMT,
      productCostINR: d.targetPricePerMT * d.requiredMT,
      logisticsCostINR: 250000,
      platformFeeINR: (d.targetPricePerMT * d.requiredMT) * 0.01,
      totalPayableINR: (d.targetPricePerMT * d.requiredMT) + 250000 + ((d.targetPricePerMT * d.requiredMT) * 0.01),
      advancePaidINR: 0,
      balanceDueINR: (d.targetPricePerMT * d.requiredMT) + 250000 + ((d.targetPricePerMT * d.requiredMT) * 0.01),
      stage: "Inventory Reserved",
      expectedDelivery: d.requiredBy,
      destination: d.destination,
      truckId: null,
      batchId: `BAT-AUTO-${Math.floor(100 + Math.random() * 900)}`,
      paymentStatus: "Payment Ready for Escrow",
      qualityCert: "NABL-TC-VERIFIED",
      invoiceUrl: "#"
    };
    State.orders.unshift(order);
  }

  closeMatchReviewModal();
  showToast(`Match Approved! Order #${order.id} generated & inventory reserved.`, 'success');
  switchOSDomain('orders');
}

// ============================================================================
// 9. ORDERS DOMAIN — PURCHASE ORDER LIFECYCLE & INVOICES
// ============================================================================
function renderOrdersDomain(container) {
  const filteredOrders = getFilteredOrders();

  container.innerHTML = `
    <div class="space-y-8 max-w-4xl mx-auto pt-4">
      <div class="pb-6 border-b border-stone-200">
        <span class="text-xs font-mono-tight font-bold uppercase tracking-widest text-blue-600">Procurement Orders</span>
        <h1 class="text-4xl font-light text-stone-900 tracking-tight mt-1">Purchase Orders</h1>
        <p class="text-xs text-stone-500 font-light mt-0.5">Track procurement execution from dispatch scheduling to gate receiving.</p>
      </div>

      <div class="space-y-3">
        ${filteredOrders.map(o => `
          <div class="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
              <div>
                <span class="text-xs font-mono-tight font-bold text-stone-400">Order #${o.id}</span>
                <h2 class="text-lg font-bold text-stone-900 mt-0.5">${o.crop} — ${o.volumeMT} MT</h2>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${getStatusBadgeClass(o.stage)}">
                ${o.stage}
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span class="text-stone-400 block mb-0.5">Destination Plant</span>
                <strong class="text-stone-900">${o.destination}</strong>
              </div>
              <div>
                <span class="text-stone-400 block mb-0.5">Expected Delivery</span>
                <strong class="text-stone-900">${o.expectedDelivery}</strong>
              </div>
              <div>
                <span class="text-stone-400 block mb-0.5">Total Payable</span>
                <strong class="text-stone-900 font-mono-tight">₹${(o.totalPayableINR/100000).toFixed(2)} Lakhs</strong>
              </div>
              <div>
                <span class="text-stone-400 block mb-0.5">Payment Status</span>
                <strong class="text-emerald-800">${o.paymentStatus}</strong>
              </div>
            </div>

            <!-- Itemized Pricing Breakdown -->
            <div class="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span class="text-stone-400 block text-[10px]">Product Cost</span>
                <strong class="font-mono-tight">₹${(o.productCostINR/100000).toFixed(2)} L</strong>
              </div>
              <div>
                <span class="text-stone-400 block text-[10px]">Logistics Tariff</span>
                <strong class="font-mono-tight">₹${(o.logisticsCostINR/100000).toFixed(2)} L</strong>
              </div>
              <div>
                <span class="text-stone-400 block text-[10px]">Platform Fee (1%)</span>
                <strong class="font-mono-tight">₹${(o.platformFeeINR/100000).toFixed(2)} L</strong>
              </div>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
              <span class="text-stone-400 font-mono-tight">Batch Ref: ${o.batchId}</span>
              <div class="flex items-center gap-3">
                ${o.stage.includes('Delivered') ? `
                  <button onclick="openDeliveryConfirmModal('${o.id}')" class="btn-editorial-primary text-[11px] py-1 px-3 bg-emerald-900 text-white">
                    <i data-lucide="check" class="w-3.5 h-3.5"></i>
                    <span>Confirm Receipt</span>
                  </button>
                ` : o.stage === 'In Transit' ? `
                  <button onclick="switchOSDomain('tracking')" class="btn-editorial-primary text-[11px] py-1 px-3">
                    <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
                    <span>Track Shipment</span>
                  </button>
                ` : `
                  <button onclick="showToast('Invoice for Order #${o.id} downloaded.', 'info')" class="btn-editorial-secondary text-[11px] py-1 px-3">
                    <i data-lucide="download" class="w-3.5 h-3.5"></i>
                    <span>Tax Invoice</span>
                  </button>
                `}
                <button onclick="openDisputeModal('${o.id}')" class="text-stone-400 hover:text-rose-600 text-xs ml-2">
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ============================================================================
// 10. DELIVERY INSPECTION & RECEIPT CONFIRMATION MODAL
// ============================================================================
function openDeliveryConfirmModal(orderId) {
  const o = State.orders.find(item => item.id === orderId);
  if (!o) return;

  const modal = document.getElementById('deliveryConfirmModal');
  const container = document.getElementById('deliveryConfirmContent');
  if (!modal || !container) return;

  container.innerHTML = `
    <div class="space-y-5 text-xs">
      <div class="pb-3 border-b border-stone-100">
        <span class="text-stone-400 text-[10px] font-mono-tight">Order #${o.id}</span>
        <h2 class="text-xl font-bold text-stone-900">${o.crop} Gate Receiving</h2>
      </div>

      <div class="grid grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
        <div>
          <span class="text-stone-400 block mb-1">Manifest Quantity</span>
          <strong class="text-base font-bold text-stone-900 font-mono-tight">${o.volumeMT}.0 MT</strong>
        </div>
        <div>
          <span class="text-stone-400 block mb-1">Delivered Weighbridge Slip</span>
          <strong class="text-base font-bold text-emerald-800 font-mono-tight">${o.volumeMT - 1.4} MT</strong>
          <span class="text-[10px] text-stone-400 block">(-1.4 MT in-transit drying variance)</span>
        </div>
      </div>

      <div class="space-y-2">
        <span class="font-bold text-stone-900 block">Quality Signoff</span>
        <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-700"></i>
            <span class="text-emerald-900 font-medium">100% NABL Lab Certified (Grade A/B Spec Approved)</span>
          </div>
          <span class="font-mono-tight text-[10px] text-emerald-700 font-bold">${o.qualityCert}</span>
        </div>
      </div>

      <div class="pt-4 border-t border-stone-100 flex items-center justify-between">
        <button onclick="closeDeliveryConfirmModal()" class="btn-editorial-secondary text-xs">Cancel</button>
        <button onclick="confirmOrderReceipt('${o.id}')" class="btn-editorial-primary text-xs bg-emerald-950 text-white">
          <i data-lucide="check" class="w-3.5 h-3.5"></i>
          <span>Confirm Receipt & Settle Payment</span>
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeDeliveryConfirmModal() {
  const modal = document.getElementById('deliveryConfirmModal');
  if (modal) modal.classList.add('hidden');
}

function confirmOrderReceipt(orderId) {
  const o = State.orders.find(item => item.id === orderId);
  if (o) {
    o.stage = "Received & Settled";
    o.paymentStatus = "100% Settled via RTGS";
  }
  closeDeliveryConfirmModal();
  showToast(`Receipt Confirmed for #${orderId}! Final settlement processed.`, 'success');
  renderCurrentDomain();
}

// ============================================================================
// 11. TRACKING DOMAIN — LIGHT MAP WITH PHYSICALLY MOVING TRUCK
// ============================================================================
function renderTrackingDomain(container) {
  const activeTruck = MOCK_DATA.liveFleet.find(f => f.id === State.activeTruckId) || MOCK_DATA.liveFleet[0];

  container.innerHTML = `
    <div class="space-y-8 max-w-5xl mx-auto pt-4">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span class="text-xs font-mono-tight font-bold uppercase tracking-widest text-blue-600">Consignment Telemetry</span>
          <h1 class="text-4xl font-light text-stone-900 tracking-tight mt-1">Live Freight Tracking</h1>
          <p class="text-xs text-stone-500 font-light mt-0.5">GPS sealed transit telemetry from regional silos to corporate receiving docks.</p>
        </div>
        <div class="text-xs text-stone-500 font-mono-tight">
          Vehicle: <strong>${activeTruck.vehicleNumber}</strong> • Speed: <strong>${activeTruck.speedKmh} km/h</strong>
        </div>
      </div>

      <!-- Light Stylized Map with Physically Moving Truck -->
      <div id="trackingMapContainer">
        <canvas id="trackingMapCanvas" class="w-full h-full"></canvas>

        <!-- Floating Truck Detail Capsule -->
        <div id="truckFloatingCapsule" class="truck-floating-capsule">
          <div class="flex items-center gap-2 mb-1">
            <span class="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono-tight font-bold text-[10px]">${activeTruck.id}</span>
            <span class="font-bold text-stone-900 text-xs">${activeTruck.crop} (${activeTruck.volumeMT} MT)</span>
          </div>
          <div class="text-[11px] text-stone-500 font-mono-tight">
            Driver: <strong>${activeTruck.driverName}</strong> (${activeTruck.driverPhone})
          </div>
          <div class="text-[10px] text-emerald-800 font-semibold mt-1">
            Status: ${activeTruck.status} • ETA: ${activeTruck.etaMinutes} mins • Seal Intact
          </div>
        </div>
      </div>

      <!-- Milestone Stage Timeline -->
      <div class="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-4">
        <span class="text-xs font-bold text-stone-400 uppercase tracking-widest block">Consignment Waypoint Milestones</span>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          ${activeTruck.timeline.map(m => `
            <div class="p-3 rounded-xl ${m.completed ? 'bg-emerald-50 border border-emerald-200' : 'bg-stone-100 border border-transparent'}">
              <div class="font-bold ${m.completed ? 'text-emerald-900' : 'text-stone-400'}">${m.stage}</div>
              <span class="text-[11px] font-mono-tight text-stone-500">${m.time}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  setTimeout(initMovingTruckCanvas, 60);
}

function initMovingTruckCanvas() {
  const canvas = document.getElementById('trackingMapCanvas');
  const tooltip = document.getElementById('truckFloatingCapsule');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;

  const route = [
    { x: w * 0.18, y: h * 0.35, label: "Karnal Silos Hub" },
    { x: w * 0.50, y: h * 0.50, label: "Sonipat Toll Checkpoint" },
    { x: w * 0.84, y: h * 0.65, label: "Delhi-NCR Mega Plant (Dock #2)" }
  ];

  let truckT = 0.55;
  let checkpointPing = 0;

  function render() {
    ctx.clearRect(0, 0, w, h);
    truckT += 0.0016;
    if (truckT > 1) truckT = 0;

    // Draw Highway Route Line
    ctx.beginPath();
    ctx.moveTo(route[0].x, route[0].y);
    ctx.quadraticCurveTo(w * 0.42, h * 0.38, route[1].x, route[1].y);
    ctx.quadraticCurveTo(w * 0.68, h * 0.62, route[2].x, route[2].y);
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.32)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Checkpoint nodes
    route.forEach((pt, idx) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = idx === 1 ? '#d97706' : (idx === 2 ? '#18181b' : '#14532d');
      ctx.fill();

      if (idx === 1 && Math.abs(truckT - 0.5) < 0.08) {
        checkpointPing += 0.08;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 12 + Math.sin(checkpointPing) * 4, 0, Math.PI * 2);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.font = "600 11px Plus Jakarta Sans, sans-serif";
      ctx.fillStyle = "#334155";
      ctx.textAlign = "center";
      ctx.fillText(pt.label, pt.x, pt.y - 12);
    });

    // Calculate truck location
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

    // Draw Truck
    ctx.save();
    ctx.translate(curX, curY);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-14, -8, 28, 16);
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(8, -6, 8, 12);
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-8, 9, 3, 0, Math.PI * 2);
    ctx.arc(6, 9, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (tooltip) {
      tooltip.style.left = `${curX}px`;
      tooltip.style.top = `${curY}px`;
    }

    State.canvasAnimIds.tracking = requestAnimationFrame(render);
  }

  render();
}

// ============================================================================
// 12. PAYMENTS DOMAIN — FLOW OF VALUE
// ============================================================================
function renderPaymentsDomain(container) {
  const p = MOCK_DATA.payments;

  container.innerHTML = `
    <div class="space-y-8 max-w-4xl mx-auto pt-4">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span class="text-xs font-mono-tight font-bold uppercase tracking-widest text-emerald-800">Financial Settlement</span>
          <h1 class="text-4xl font-light text-stone-900 tracking-tight mt-1">Flow of Value</h1>
          <p class="text-xs text-stone-500 font-light mt-0.5">Automated RTGS escrow disbursements to smallholder farmer aggregation accounts.</p>
        </div>
        <div class="text-xs font-mono-tight text-stone-400">
          Total Disbursed: <strong>₹4.82 Cr YTD</strong>
        </div>
      </div>

      <!-- Financial Flow Graph -->
      <div class="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-4">
        <div class="flex items-center justify-between text-xs text-stone-400">
          <span>₹ Currency Stream Paths (Company Escrow → Aggregation → Settlement)</span>
          <div class="flex gap-2">
            <button onclick="setFinanceRange('7D')" class="px-2 py-0.5 rounded text-[10px] ${State.activeFinancePeriod === '7D' ? 'bg-stone-900 text-white font-bold' : 'text-stone-400'}">7D</button>
            <button onclick="setFinanceRange('30D')" class="px-2 py-0.5 rounded text-[10px] ${State.activeFinancePeriod === '30D' ? 'bg-stone-900 text-white font-bold' : 'text-stone-400'}">30D</button>
            <button onclick="setFinanceRange('1Y')" class="px-2 py-0.5 rounded text-[10px] ${State.activeFinancePeriod === '1Y' ? 'bg-stone-900 text-white font-bold' : 'text-stone-400'}">1Y</button>
          </div>
        </div>

        <div class="h-64">
          <canvas id="buyerFinanceChartCanvas"></canvas>
        </div>
      </div>

      <!-- Recent Core Banking Settlements -->
      <div class="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-4">
        <h2 class="text-xs font-bold text-stone-400 uppercase tracking-widest">Recent Core Banking RTGS Disbursements</h2>
        <div class="space-y-3 text-xs">
          ${p.recentTransactions.map(t => `
            <div class="p-3 rounded-xl bg-stone-50 flex items-center justify-between">
              <div>
                <div class="font-bold text-stone-900">${t.crop} — ${t.type}</div>
                <span class="text-[11px] font-mono-tight text-stone-400">${t.id} • ${t.date} via ${t.method} (UTR: ${t.utr})</span>
              </div>
              <div class="text-right">
                <div class="font-mono-tight font-extrabold text-sm text-stone-900">₹${(t.amountINR/100000).toFixed(2)} L</div>
                <span class="text-[10px] text-emerald-800 font-semibold">${t.status}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  setTimeout(initBuyerFinanceChart, 60);
}

function setFinanceRange(r) {
  State.activeFinancePeriod = r;
  renderCurrentDomain();
}

function initBuyerFinanceChart() {
  const canvas = document.getElementById('buyerFinanceChartCanvas');
  if (!canvas || !window.Chart) return;

  const data = MOCK_DATA.payments.timeSeries[State.activeFinancePeriod];

  new window.Chart(canvas, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Disbursed Volume (₹ Lakhs)',
          data: data.volumeLakhs,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          fill: true,
          borderWidth: 2,
          tension: 0.35
        },
        {
          label: 'Landed Mandi Savings (₹ Lakhs)',
          data: data.savingsLakhs,
          borderColor: '#d97706',
          borderWidth: 2,
          tension: 0.35
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#a1a1aa' } },
        x: { grid: { display: false }, ticks: { color: '#a1a1aa' } }
      }
    }
  });
}

// ============================================================================
// 13. DISPUTES & ISSUE REPORTING WORKFLOW
// ============================================================================
function renderDisputesDomain(container) {
  container.innerHTML = `
    <div class="space-y-8 max-w-4xl mx-auto pt-4">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span class="text-xs font-mono-tight font-bold uppercase tracking-widest text-rose-700">Issue Resolution</span>
          <h1 class="text-4xl font-light text-stone-900 tracking-tight mt-1">Disputes & Claims</h1>
          <p class="text-xs text-stone-500 font-light mt-0.5">Calm, evidence-based quality or weighbridge variance claims.</p>
        </div>
        <button onclick="openDisputeModal()" class="btn-editorial-primary text-xs bg-rose-900 text-white">
          <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i>
          <span>Report New Dispute</span>
        </button>
      </div>

      <div class="space-y-3">
        ${State.disputes.map(d => `
          <div class="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-3 text-xs">
            <div class="flex items-center justify-between pb-2 border-b border-stone-100">
              <div>
                <span class="text-[10px] font-mono-tight text-stone-400">${d.id} • Order #${d.orderRef}</span>
                <h2 class="text-base font-bold text-stone-900 mt-0.5">${d.type}</h2>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">${d.status}</span>
            </div>
            <p class="text-stone-600 leading-relaxed">${d.description}</p>
            <div class="flex items-center justify-between pt-2 text-stone-400 border-t border-stone-100 text-[11px]">
              <span>Attached Evidence: <strong class="text-stone-700">${d.evidenceFile}</strong></span>
              <span class="font-mono-tight">Submitted: ${d.submittedDate}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function openDisputeModal(defaultOrderRef = '') {
  const modal = document.getElementById('disputeReportModal');
  const orderInput = document.getElementById('disputeOrderInput');
  if (orderInput && defaultOrderRef) orderInput.value = defaultOrderRef;
  if (modal) modal.classList.remove('hidden');
}

function closeDisputeModal() {
  const modal = document.getElementById('disputeReportModal');
  if (modal) modal.classList.add('hidden');
}

function submitDisputeForm() {
  const type = document.getElementById('disputeTypeSelect').value;
  const orderRef = document.getElementById('disputeOrderInput').value || 'AG-2048';
  const desc = document.getElementById('disputeDescInput').value || 'Quality check deviation recorded on intake.';

  const newDisp = {
    id: `DISP-${Math.floor(102 + Math.random() * 50)}`,
    orderRef: orderRef,
    crop: "Active Lot",
    type: type,
    description: desc,
    status: "Under Review",
    submittedDate: "Just now",
    priority: "Normal",
    evidenceFile: "intake_inspection_slip.pdf"
  };

  State.disputes.unshift(newDisp);
  closeDisputeModal();
  showToast(`Dispute #${newDisp.id} submitted for quality council review.`, 'info');
  switchOSDomain('disputes');
}

// ============================================================================
// 14. INSIGHTS DOMAIN & DEMAND FORECASTING
// ============================================================================
function renderInsightsDomain(container) {
  const f = MOCK_DATA.forecasting;

  container.innerHTML = `
    <div class="space-y-8 max-w-4xl mx-auto pt-4">
      <div class="pb-6 border-b border-stone-200">
        <span class="text-xs font-mono-tight font-bold uppercase tracking-widest text-emerald-800">Procurement Intelligence</span>
        <h1 class="text-4xl font-light text-stone-900 tracking-tight mt-1">Analytics & Forecasting</h1>
      </div>

      <!-- Demand Forecasting Planning Cards -->
      <div class="space-y-3">
        <span class="text-xs font-bold text-stone-400 uppercase tracking-widest block">AI Seasonal Procurement Forecasting</span>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          ${f.seasonalTrends.map(t => `
            <div class="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-2">
              <span class="text-[10px] font-bold uppercase tracking-widest text-emerald-800">${t.period}</span>
              <div class="font-bold text-stone-900 text-sm">${t.crop}</div>
              <p class="text-stone-500">${t.availability}</p>
              <div class="text-emerald-800 font-mono-tight pt-1 border-t border-stone-100 font-semibold">${t.priceOutlook}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// 15. REPORTS & EXPORT GENERATOR
// ============================================================================
function renderReportsDomain(container) {
  container.innerHTML = `
    <div class="space-y-8 max-w-4xl mx-auto pt-4">
      <div class="pb-6 border-b border-stone-200">
        <span class="text-xs font-mono-tight font-bold uppercase tracking-widest text-stone-400">Formal Documentation</span>
        <h1 class="text-4xl font-light text-stone-900 tracking-tight mt-1">Reports & Exports</h1>
      </div>

      <div class="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-6 text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="text-stone-400 block mb-1">Report Type</label>
            <select id="reportTypeSelect" class="w-full p-3 rounded-xl border border-stone-200 bg-white">
              <option>Procurement Spending & Savings Report</option>
              <option>Purchase Order Tax Manifests</option>
              <option>NABL Quality & Traceability Assay</option>
              <option>Multi-Branch Intake Summary</option>
            </select>
          </div>
          <div>
            <label class="text-stone-400 block mb-1">Date Range</label>
            <select class="w-full p-3 rounded-xl border border-stone-200 bg-white">
              <option>Current Month (August 2026)</option>
              <option>Last 90 Days (Q2 2026)</option>
              <option>Fiscal Year 2026-27 YTD</option>
            </select>
          </div>
          <div>
            <label class="text-stone-400 block mb-1">Target Branch</label>
            <select class="w-full p-3 rounded-xl border border-stone-200 bg-white">
              <option>All Operating Branches</option>
              <option>Delhi-NCR Mega Plant</option>
              <option>Pune Integrated Agro-Hub</option>
              <option>Bengaluru South Distribution</option>
            </select>
          </div>
        </div>

        <div class="pt-4 border-t border-stone-100 flex items-center justify-between">
          <span class="text-stone-500">Formats Available: <strong>PDF Document • CSV / Excel • Print</strong></span>
          <div class="flex gap-3">
            <button onclick="downloadReportCSV()" class="btn-editorial-secondary text-xs">
              <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i> Export CSV
            </button>
            <button onclick="window.print()" class="btn-editorial-primary text-xs">
              <i data-lucide="printer" class="w-3.5 h-3.5"></i> Print Official Report
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function downloadReportCSV() {
  const csvContent = "data:text/csv;charset=utf-8,Demand_ID,Crop,Quantity_MT,Matched_MT,Landed_Rate,Branch,Status\n" +
    State.demands.map(d => `${d.id},"${d.crop}",${d.requiredMT},${d.matchedMT},${d.targetPricePerMT},${d.destination},"${d.status}"`).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "agricore_procurement_report.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast("Procurement CSV Report exported successfully!", "success");
}

// ============================================================================
// 16. TEAM & MULTI-USER PERMISSIONS
// ============================================================================
function renderTeamDomain(container) {
  container.innerHTML = `
    <div class="space-y-8 max-w-4xl mx-auto pt-4">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span class="text-xs font-mono-tight font-bold uppercase tracking-widest text-stone-400">Team Governance</span>
          <h1 class="text-4xl font-light text-stone-900 tracking-tight mt-1">Company Users & Permissions</h1>
        </div>
        <button onclick="showToast('Invited new procurement manager.', 'info')" class="btn-editorial-primary text-xs">
          <i data-lucide="user-plus" class="w-3.5 h-3.5"></i>
          <span>Add Team Member</span>
        </button>
      </div>

      <div class="space-y-3">
        ${State.team.map(u => `
          <div class="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex items-center justify-between text-xs">
            <div>
              <div class="font-bold text-stone-900 text-sm">${u.name}</div>
              <div class="text-stone-500 font-mono-tight mt-0.5">${u.email} • Role: <strong class="text-stone-800">${u.role}</strong></div>
            </div>
            <div class="text-right">
              <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-[10px]">${u.status}</span>
              <span class="text-stone-400 font-mono-tight text-[11px] block mt-1">Active: ${u.lastActive}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ============================================================================
// 17. COMPANY PROFILE DOMAIN
// ============================================================================
function renderCompanyProfileDomain(container) {
  const c = MOCK_DATA.company;

  container.innerHTML = `
    <div class="space-y-8 max-w-4xl mx-auto pt-4">
      <div class="pb-6 border-b border-stone-200">
        <span class="text-xs font-mono-tight font-bold uppercase tracking-widest text-stone-400">Corporate Identity</span>
        <h1 class="text-4xl font-light text-stone-900 tracking-tight mt-1">${c.name}</h1>
        <p class="text-xs text-stone-500 font-light mt-0.5">${c.industry} • GSTIN: <span class="font-mono-tight text-stone-700">${c.gstin}</span></p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        ${MOCK_DATA.branches.filter(b => b.id !== 'ALL').map(p => `
          <div class="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-2">
            <span class="text-[10px] font-bold uppercase tracking-widest text-emerald-800">Processing Plant</span>
            <div class="font-bold text-stone-900 text-sm">${p.name}</div>
            <p class="text-stone-500">${p.city}</p>
            <div class="text-[11px] font-mono-tight text-stone-700 pt-1 border-t border-stone-100">Intake: ${p.capacityMT} MT/day</div>
          </div>
        `).join('')}
      </div>

      <div class="p-6 rounded-2xl bg-stone-900 text-stone-200 space-y-2">
        <h2 class="text-lg font-editorial italic font-normal text-white">Sustainability & Rural Decarbonization</h2>
        <p class="text-xs text-stone-400 font-light leading-relaxed">
          Through computerized lot tracking, participating farmer collectives in Karnal & Meerut have diverted 1,280 MT of paddy straw from field burning to Women SHG mushroom bio-substrates, creating ₹18.2 Lakhs in secondary rural income.
        </p>
      </div>
    </div>
  `;
}

// ============================================================================
// 18. AI PROCUREMENT ASSISTANT (FLOATING WIDGET)
// ============================================================================
function initAIAssistant() {
  const btn = document.getElementById('aiAssistantFloatingBtn');
  if (btn) {
    btn.addEventListener('click', toggleAIAssistant);
  }
}

function toggleAIAssistant() {
  const drawer = document.getElementById('aiAssistantDrawer');
  if (!drawer) return;
  drawer.classList.toggle('open');
}

function askAIAssistant(promptText) {
  const respBox = document.getElementById('aiAssistantResponseBox');
  if (!respBox) return;

  if (promptText.includes('Grade A') || promptText.includes('tomato')) {
    respBox.innerHTML = `
      <div class="p-3.5 rounded-xl bg-emerald-50 text-emerald-950 text-xs space-y-2">
        <strong>145 MT Grade A Hybrid Tomato</strong> is currently aggregated at the Kolar basin facility (Brix > 4.8, ₹18.50/kg).
        <button onclick="switchOSDomain('demand'); toggleAIAssistant();" class="btn-editorial-primary text-[10px] py-1 px-2.5">
          View Sourcing Lot
        </button>
      </div>
    `;
  } else if (promptText.includes('pending') || promptText.includes('deliveries') || promptText.includes('tomorrow')) {
    respBox.innerHTML = `
      <div class="p-3.5 rounded-xl bg-blue-50 text-blue-950 text-xs space-y-2">
        <strong>Truck HR-05-BC-7892 (250 MT Basmati)</strong> is arriving tomorrow at 04:00 PM at Delhi-NCR Plant Dock #2.
        <button onclick="switchOSDomain('tracking'); toggleAIAssistant();" class="btn-editorial-primary text-[10px] py-1 px-2.5">
          Track Live Freight
        </button>
      </div>
    `;
  } else if (promptText.includes('risk') || promptText.includes('shortages')) {
    respBox.innerHTML = `
      <div class="p-3.5 rounded-xl bg-amber-50 text-amber-950 text-xs space-y-2">
        <strong>Yellow Mustard Demand DEM-0894</strong> has 155 MT deficit. Price spike expected due to early crushing surge.
        <button onclick="switchOSDomain('demand'); toggleAIAssistant();" class="btn-editorial-primary text-[10px] py-1 px-2.5">
          Forward Book Stock
        </button>
      </div>
    `;
  } else {
    respBox.innerHTML = `
      <div class="p-3.5 rounded-xl bg-stone-100 text-stone-900 text-xs space-y-2">
        I found matching procurement insights across your active requirements.
        <button onclick="switchOSDomain('procurement'); toggleAIAssistant();" class="btn-editorial-primary text-[10px] py-1 px-2.5">
          Open Procurement
        </button>
      </div>
    `;
  }

  if (window.lucide) window.lucide.createIcons();
}

// ============================================================================
// 19. NOTIFICATIONS & COMMAND PALETTE
// ============================================================================
function initNotificationDrawer() {
  const notifBtn = document.getElementById('notifToggleBtn');
  if (notifBtn) notifBtn.addEventListener('click', toggleNotificationDrawer);
}

function toggleNotificationDrawer() {
  const drawer = document.getElementById('notificationDrawer');
  if (!drawer) return;
  drawer.classList.toggle('open');
  renderNotificationList();
}

function closeNotificationDrawer() {
  const drawer = document.getElementById('notificationDrawer');
  if (drawer) drawer.classList.remove('open');
}

function renderNotificationList() {
  const container = document.getElementById('notificationListContainer');
  if (!container) return;

  container.innerHTML = State.notifications.map(n => `
    <div class="p-3.5 rounded-xl ${n.unread ? 'bg-emerald-50/60 border border-emerald-200/60' : 'bg-stone-50 border border-transparent'} space-y-1 text-xs">
      <div class="flex items-center justify-between">
        <span class="font-bold text-stone-900">${n.title}</span>
        <span class="text-[10px] font-mono-tight text-stone-400">${n.time}</span>
      </div>
      <p class="text-stone-600 leading-relaxed text-[11px]">${n.message}</p>
    </div>
  `).join('');
}

function initCommandPalette() {
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      toggleCommandPalette();
    }
    if (e.key === 'Escape') closeCommandPalette();
  });
}

function toggleCommandPalette() {
  const modal = document.getElementById('cmdPaletteModal');
  if (!modal) return;
  modal.classList.toggle('hidden');
}

function closeCommandPalette() {
  const modal = document.getElementById('cmdPaletteModal');
  if (modal) modal.classList.add('hidden');
}

// ============================================================================
// HELPERS & TOASTS
// ============================================================================
function getStatusColorClass(status) {
  switch (status) {
    case 'Fulfilled':
    case 'Delivered':
    case 'Matched (Reserved)': return 'text-emerald-800';
    case 'In Transit':
    case 'Dispatched': return 'text-blue-600';
    case 'Partially Matched': return 'text-stone-900';
    default: return 'text-stone-500';
  }
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Delivered & Verified':
    case 'Received & Settled': return 'bg-emerald-100 text-emerald-800';
    case 'In Transit': return 'bg-blue-100 text-blue-800';
    case 'Supply Matched (Awaiting Approval)': return 'bg-amber-100 text-amber-800';
    default: return 'bg-stone-100 text-stone-800';
  }
}

function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg border transition-all duration-300 ${
    type === 'success' ? 'bg-emerald-950 text-emerald-200 border-emerald-800' : 'bg-stone-900 text-white border-stone-700'
  }`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3200);
}

// Global Window Bindings
window.switchOSDomain = switchOSDomain;
window.toggleDemandRow = toggleDemandRow;
window.openDemandWizard = openDemandWizard;
window.closeDemandWizard = closeDemandWizard;
window.nextWizardStep = nextWizardStep;
window.prevWizardStep = prevWizardStep;
window.selectWizardCrop = selectWizardCrop;
window.selectWizardGrade = selectWizardGrade;
window.selectWizardPriority = selectWizardPriority;
window.submitDemandWizard = submitDemandWizard;
window.openMatchReviewModal = openMatchReviewModal;
window.closeMatchReviewModal = closeMatchReviewModal;
window.approveSupplyMatch = approveSupplyMatch;
window.openDeliveryConfirmModal = openDeliveryConfirmModal;
window.closeDeliveryConfirmModal = closeDeliveryConfirmModal;
window.confirmOrderReceipt = confirmOrderReceipt;
window.openDisputeModal = openDisputeModal;
window.closeDisputeModal = closeDisputeModal;
window.submitDisputeForm = submitDisputeForm;
window.downloadReportCSV = downloadReportCSV;
window.toggleAIAssistant = toggleAIAssistant;
window.askAIAssistant = askAIAssistant;
window.toggleNotificationDrawer = toggleNotificationDrawer;
window.closeNotificationDrawer = closeNotificationDrawer;
window.toggleCommandPalette = toggleCommandPalette;
window.closeCommandPalette = closeCommandPalette;
window.showToast = showToast;
