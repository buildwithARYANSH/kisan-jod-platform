import { ArrowRight, Check, Clock3, MapPin, PackageCheck, Truck, Warehouse, Zap } from "lucide-react";
import type { ReactNode } from "react";

export function LogisticsJourney({ notify }: { notify: (message: string) => void }) {
  return <div className="logistics-page">
    <div className="logistics-hero">
      <div className="route-sky"><div className="sun-disc" /><div className="cloud cloud-a" /><div className="cloud cloud-b" /><div className="hill hill-a" /><div className="hill hill-b" /></div>
      <div className="logistics-copy"><span className="eyebrow light">LIVE ROUTE STORY · SAMPLE DATA</span><h2>Every delivery has<br /><em>a beginning, middle, and proof.</em></h2><p>Follow the current movement of BAT-0921 from the Nashik collection route to its buyer — not as a number, but as a chain of accountable handoffs.</p><div className="route-meta"><span><i className="live-dot" /> Route in motion</span><span><Clock3 size={13} /> ETA 14 Sep · 16:40</span></div></div>
      <div className="route-stage"><div className="road-lines"><i /><i /><i /><i /><i /></div><div className="route-pulse pulse-one" /><div className="route-pulse pulse-two" /><div className="moving-truck"><div className="truck-shadow" /><div className="truck-cabin"><div className="truck-window" /><div className="truck-light" /></div><div className="truck-load"><span>Tomato</span><b>420 kg</b><i /><i /><i /></div><div className="truck-wheel wheel-a" /><div className="truck-wheel wheel-b" /></div><div className="route-pin pin-origin"><MapPin size={13} /><span>Nashik East</span></div><div className="route-pin pin-destination"><MapPin size={13} /><span>Pune Central</span></div></div>
    </div>
    <div className="journey-steps">
      <JourneyStep number="01" icon={<PackageCheck size={16} />} title="Collected" detail="Arun Khot · 08:12" status="Complete" tone="mint" />
      <JourneyStep number="02" icon={<Warehouse size={16} />} title="Intake verified" detail="Shree Cold Store · 08:42" status="Complete" tone="mint" />
      <JourneyStep number="03" icon={<Truck size={16} />} title="On the road" detail="Partner A · 12:30" status="In motion" tone="amber" active />
      <JourneyStep number="04" icon={<MapPin size={16} />} title="Buyer delivery" detail="Pune Central · ETA 16:40" status="Upcoming" tone="blue" />
    </div>
    <div className="logistics-lower"><div className="route-facts premium-card"><div className="section-heading"><div><h3>What is moving with the truck</h3><span>One batch, four proof points</span></div><Zap size={18} /></div><div className="fact-grid"><span><small>Batch ID</small><strong>BAT-0921</strong></span><span><small>Order</small><strong>ORD-10294</strong></span><span><small>Grade</small><strong>A · 94%</strong></span><span><small>Vehicle</small><strong>MH-12-TR-4481</strong></span></div><button className="primary-action full" onClick={() => notify("Route tracking opened")}>Open route tracking <ArrowRight size={15} /></button></div><div className="delivery-beat premium-card"><div className="section-heading"><div><h3>Driver heartbeat</h3><span>Last field sync · 6 min ago</span></div><span className="signal-live"><i /> Live</span></div><div className="heartbeat"><div className="heartbeat-line"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="heartbeat-base"><span>12:00</span><span>12:30</span><span>13:00</span><span>13:30</span></div></div><div className="driver-row"><div className="driver-avatar">RK</div><span><strong>Ravi Kadam</strong><small>Logistics Partner A · 98 km remaining</small></span><button className="small-action" onClick={() => notify("Driver contact panel opened")}>Contact</button></div></div></div>
  </div>;
}

function JourneyStep({ number, icon, title, detail, status, tone, active }: { number: string; icon: ReactNode; title: string; detail: string; status: string; tone: string; active?: boolean }) {
  return <div className={`journey-step ${active ? "active" : ""}`}><div className={`journey-icon ${tone}`}>{icon}</div><div><span className="journey-number">{number}</span><strong>{title}</strong><small>{detail}</small></div><b className={`journey-status ${tone}`}>{active ? <Zap size={11} /> : <Check size={11} />} {status}</b></div>;
}
