import { BarChart3, ShieldCheck, Sparkles, Sprout, Target, UserRound, WalletCards } from "lucide-react";
import type { ReactNode } from "react";

export function DataUniverseScene() {
  return <div className="insights-concept data-universe"><div className="universe-stars" /><div className="universe-constellation constellation-sales"><i /><i /><i /><span>SALES</span></div><div className="universe-constellation constellation-demand"><i /><i /><i /><span>DEMAND</span></div><div className="universe-constellation constellation-supply"><i /><i /><i /><span>SUPPLY</span></div><div className="universe-constellation constellation-risk"><i /><i /><i /><span>RISK</span></div><div className="universe-link link-sales-demand" /><div className="universe-link link-demand-risk" /><div className="universe-link link-risk-supply" /><div className="universe-link link-supply-sales" /><div className="universe-core"><BarChart3 size={21} /><span>CORE</span></div><div className="universe-metric metric-sales"><strong>+8.4%</strong><small>network growth</small></div><div className="universe-metric metric-demand"><strong>3,120T</strong><small>active demand</small></div><div className="universe-metric metric-supply"><strong>2,480T</strong><small>available supply</small></div><div className="universe-metric metric-risk"><strong>42/100</strong><small>risk pulse</small></div><span className="universe-caption">DATA UNIVERSE · DRAG TO EXPLORE</span></div>;
}

export function DigitalIdentityScene() {
  return <div className="insights-concept digital-identity"><div className="identity-stars" /><div className="identity-orbit orbit-one" /><div className="identity-orbit orbit-two" /><div className="identity-orbit orbit-three" /><div className="identity-core"><UserRound size={25} /><span>PI</span></div><IdentityArtifact className="artifact-crop" icon={<Sprout size={14} />} label="Crops" value="18" /><IdentityArtifact className="artifact-orders" icon={<Target size={14} />} label="Matches" value="88%" /><IdentityArtifact className="artifact-earnings" icon={<WalletCards size={14} />} label="Value moved" value="₹12.6L" /><IdentityArtifact className="artifact-progress" icon={<Sparkles size={14} />} label="Progress" value="Level 07" /><IdentityArtifact className="artifact-trust" icon={<ShieldCheck size={14} />} label="Trust" value="94" /><span className="identity-caption">LIVING DIGITAL IDENTITY · PRIYA IYER</span></div>;
}

function IdentityArtifact({ className, icon, label, value }: { className: string; icon: ReactNode; label: string; value: string }) {
  return <div className={`identity-artifact ${className}`}><div className="artifact-icon">{icon}</div><span><small>{label}</small><strong>{value}</strong></span></div>;
}
