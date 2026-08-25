import React from 'react';
import { useAdmin } from '../context/AdminContext';

export const AdminDashboard: React.FC = () => {
  const { tasks, farmers, rating, setActiveSection, setTaskPriorityFilter, startVoiceInput } = useAdmin();

  const openTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const completedTasksCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div className="space-y-5">
      {/* 1. Today's Work Hero Banner */}
      <div className="hero">
        <div className="eyebrow">आज का काम</div>
        <h1>{openTasksCount} काम बाकी हैं</h1>
        <p>पहले प्राथमिकता 1 वाली फसल लें</p>
        <button
          className="primary"
          onClick={() => {
            setActiveSection('daily-tasks');
            setTaskPriorityFilter(1);
          }}
        >
          आज के काम देखें →
        </button>
      </div>

      {/* 2. Metrics Cards Grid */}
      <div className="metrics">
        <div className="metric card">
          <strong>
            1,250 <small className="inline text-xs font-semibold text-[#718076]">kg</small>
          </strong>
          <small>आज की कलेक्शन</small>
          <div className="good">12% बेहतर</div>
        </div>
        <div className="metric card">
          <strong>
            {rating?.overallRating || '4.6'} <small className="inline text-xs font-semibold text-[#718076]">/ 5</small>
          </strong>
          <small>आपकी रेटिंग</small>
          <div className="good">बहुत अच्छा</div>
        </div>
      </div>

      {/* 3. Quick Shortcuts Grid (2x2) */}
      <div className="section-kicker">तुरंत काम</div>
      <h2 className="section-title">आपके शॉर्टकट</h2>
      <div className="shortcuts">
        <button className="shortcut card" onClick={() => setActiveSection('daily-tasks')}>
          <div className="shortcut-icon">✓</div>
          <strong>टास्क</strong>
          <span>{openTasksCount} बाकी</span>
        </button>

        <button className="shortcut card" onClick={() => setActiveSection('farmers')}>
          <div className="shortcut-icon">♙</div>
          <strong>किसान</strong>
          <span>{farmers.length || 42} जुड़े हैं</span>
        </button>

        <button className="shortcut card" onClick={() => setActiveSection('inventory')}>
          <div className="shortcut-icon">▣</div>
          <strong>बैच बनाएं</strong>
          <span>कलेक्शन के बाद</span>
        </button>

        <button className="shortcut card" onClick={() => setActiveSection('dispatch')}>
          <div className="shortcut-icon">⇢</div>
          <strong>डिस्पैच</strong>
          <span>1 तैयार</span>
        </button>
      </div>

      {/* 4. AI Voice Assistant Card */}
      <div className="section-kicker">बोलकर काम करें</div>
      <h2 className="section-title">AI आवाज़ सहायक</h2>
      <button className="voice" onClick={startVoiceInput}>
        <div className="voice-orb">◉</div>
        <div>
          <strong id="voiceTitle">बोलिए, मैं काम कर दूँगा</strong>
          <span>टास्क, किसान, ऑर्डर या अपडेट पूछें</span>
        </div>
      </button>

      {/* 5. Field Updates Status List */}
      <div className="mt-6">
        <div className="section-kicker">फील्ड अपडेट</div>
        <h2 className="section-title">आज की स्थिति</h2>
        <div className="status-list card">
          <div className="status-row">
            <div className="status-icon">✓</div>
            <div>
              <strong>{completedTasksCount || 2} कलेक्शन पूरे हुए</strong>
              <span>राम सिंह और मंजू देवी के बैच बने</span>
            </div>
            <b className="tag">सफल</b>
          </div>

          <div className="status-row">
            <div className="status-icon" style={{ background: '#fff2da', color: '#8b6210' }}>
              !
            </div>
            <div>
              <strong>1 काम को ध्यान चाहिए</strong>
              <span>रानी कुमारी का कलेक्शन ओवरड्यू है</span>
            </div>
            <button className="tag warn cursor-pointer" onClick={() => setActiveSection('daily-tasks')}>
              अभी देखें
            </button>
          </div>

          <div className="status-row">
            <div className="status-icon">↻</div>
            <div>
              <strong>सभी रिकॉर्ड सुरक्षित और सिंक हैं</strong>
              <span>ऑफलाइन रिकॉर्डिंग भी उपलब्ध है</span>
            </div>
            <b className="tag">सिंक</b>
          </div>
        </div>
      </div>
    </div>
  );
};
