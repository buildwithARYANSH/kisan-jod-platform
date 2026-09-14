import { AlertTriangle, ArrowRight, CircleDollarSign, Radar, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";

export function FinanceFlowEngine({ notify }: { notify: (message: string) => void }) {
  return <div className="ops-concept finance-engine"><div className="money-route route-farmer"><span>FARMER</span><i /></div><div className="money-route route-collection"><span>COLLECTION</span><i /></div><div className="money-route route-logistics"><span>LOGISTICS</span><i /></div><div className="money-route route-buyer"><span>BUYER</span><i /></div><div className="flow-node flow-farmer">F</div><div className="flow-node flow-collection">C</div><div className="flow-node flow-logistics">L</div><div className="flow-node flow-buyer">B</div><div className="money-core"><CircleDollarSign size={25} /><span>₹</span></div>{["₹82.4L revenue", "₹69.8L payouts", "₹8.2L pending", "2,840 txns"].map((text, index) => <span key={text} className={`money-metric metric-${index}`}>{text}</span>)}<button className="flow-detail" onClick={() => notify("Transaction route opened")}>Hover route · ORD-10294 <ArrowRight size={12} /></button><span className="ops-caption">MONEY FLOW ENGINE</span></div>;
}

export function BrokenFlowScene({ notify }: { notify: (message: string) => void }) {
  return <div className="ops-concept broken-flow"><div className="flow-track track-a" /><div className="flow-track track-b" /><div className="flow-track track-c" /><div className="flow-packet packet-a" /><div className="flow-packet packet-b" /><div className="flow-packet packet-c" /><div className="broken-gap"><AlertTriangle size={17} /><span>FLOW<br />BREAK</span></div><div className="exception-orb orb-weight">−80 kg<small>weight mismatch</small></div><div className="exception-orb orb-delay">+4h<small>pickup delay</small></div><div className="exception-orb orb-damage">!</div><div className="expected-path"><span>Expected</span></div><div className="actual-path"><span>Actual</span></div><button className="investigate-button" onClick={() => notify("Investigation view opened")}>Investigate broken checkpoint <ArrowRight size={12} /></button><span className="ops-caption">BROKEN FLOW · DSP-0017</span></div>;
}

export function DigitalRadarScene({ notify }: { notify: (message: string) => void }) {
  return <div className="ops-concept digital-radar"><div className="radar-grid" /><div className="radar-sphere"><div className="radar-lat lat-one" /><div className="radar-lat lat-two" /><div className="radar-lon lon-one" /><div className="lon-two" /><div className="radar-sweep" /><Radar size={26} /></div><div className="radar-particle rp-one" /><div className="radar-particle rp-two" /><div className="radar-particle rp-three" /><div className="radar-particle rp-alert"><ShieldAlert size={10} /></div><div className="radar-status"><i /> SCAN <b>→</b> DETECT <b>→</b> ANALYZE <b>→</b> ALERT</div><button className="radar-detail" onClick={() => notify("Anomaly focus opened")}>Focus anomaly · 82 risk <ArrowRight size={12} /></button><span className="ops-caption">DIGITAL RADAR · LIVE NETWORK PULSE</span></div>;
}

export function OpsVisual({ module, notify }: { module: "finance" | "disputes" | "risk"; notify: (message: string) => void }) {
  if (module === "finance") return <FinanceFlowEngine notify={notify} />;
  if (module === "disputes") return <BrokenFlowScene notify={notify} />;
  return <DigitalRadarScene notify={notify} />;
}
