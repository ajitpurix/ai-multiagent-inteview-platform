'use client';

import React, { useState } from 'react';
import {
  Bot,
  Code2,
  Cpu,
  Layers,
  Play,
  Send,
  Sparkles,
  Terminal,
  Activity,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
  Award
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'interview' | 'architecture' | 'reports'>('interview');
  const [candidateCode, setCandidateCode] = useState(
`// Candidate Solution: LRU Cache Implementation
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}`
  );

  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'Interviewer Agent',
      avatar: '🤖',
      text: "Welcome Alex! Let's explore data structures. Could you implement an LRU (Least Recently Used) cache with O(1) operations?",
      badge: 'Interviewer Persona'
    },
    {
      sender: 'Candidate',
      avatar: '👨‍💻',
      text: "I used JavaScript's Map because Map keys preserve insertion order, allowing O(1) delete and append operations to emulate a doubly linked list + hash map.",
      badge: 'Answer Submission'
    },
    {
      sender: 'Interviewer Agent',
      avatar: '🤖',
      text: "Great observation about Javascript Map ordering semantics! How would you guarantee thread safety if this cache was accessed across asynchronous worker threads?",
      badge: 'Adaptive Follow-Up'
    }
  ]);

  const [inputTurn, setInputTurn] = useState('');
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [execOutput, setExecOutput] = useState<string | null>(null);

  const handleSendTurn = () => {
    if (!inputTurn.trim()) return;
    const newMsg = {
      sender: 'Candidate',
      avatar: '👨‍💻',
      text: inputTurn,
      badge: 'Answer Submission'
    };
    setChatMessages((prev) => [
      ...prev,
      newMsg,
      {
        sender: 'Interviewer Agent',
        avatar: '🤖',
        text: 'Understood. Let me evaluate your rationale against our scalability criteria...',
        badge: 'Analyzing Turn'
      }
    ]);
    setInputTurn('');
  };

  const handleRunCode = () => {
    setIsRunningCode(true);
    setExecOutput(null);
    setTimeout(() => {
      setIsRunningCode(false);
      setExecOutput('✓ Test Suite 1: PASSED (put/get cache hit)\n✓ Test Suite 2: PASSED (LRU eviction at capacity)\nRuntime: 34ms | Memory: 3.4MB | Exit Code: 0');
    }, 900);
  };

  return (
    <main style={{ minHeight: '100vh', padding: '24px 36px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
            }}>
              <Bot color="#ffffff" size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                AI Multi-Agent Interview Platform
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Distributed Autonomous Evaluator & Technical Assessment Cloud
              </p>
            </div>
          </div>
        </div>

        {/* Global Cluster Indicators */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="live-indicator" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              LangGraph Engine: Active
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Session: <strong style={{ color: '#fff' }}>ses_9f3b21</strong>
            </span>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('interview')}
          className={activeTab === 'interview' ? 'btn-primary' : 'btn-secondary'}
          id="tab-interview-session"
        >
          <Code2 size={16} /> Live Interview Sandbox
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={activeTab === 'reports' ? 'btn-primary' : 'btn-secondary'}
          id="tab-reports-scorecard"
        >
          <Award size={16} /> Multi-Agent Scorecard
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={activeTab === 'architecture' ? 'btn-primary' : 'btn-secondary'}
          id="tab-cluster-topology"
        >
          <Layers size={16} /> Distributed Services Topology
        </button>
      </nav>

      {/* VIEW: LIVE INTERVIEW WORKBENCH */}
      {activeTab === 'interview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px' }}>
          {/* Left Column: Code Sandbox & Problem */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Question Spec Panel */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-cyan">Question 1 of 3</span>
                <span className="badge badge-emerald">Category: Algorithmic & Systems</span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                Design an LRU Cache with O(1) Operations
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Implement the <code>LRUCache</code> class with <code>get(key)</code> and <code>put(key, value)</code> methods. Both operations must run in O(1) average time complexity. Explain data structure choices and memory eviction behaviors.
              </p>
            </div>

            {/* Code Editor Panel */}
            <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={18} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Interactive Code Sandbox (Isolated Runner)</span>
                </div>
                <button
                  onClick={handleRunCode}
                  disabled={isRunningCode}
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  id="btn-run-code"
                >
                  <Play size={14} /> {isRunningCode ? 'Running Sandbox...' : 'Run & Test Code'}
                </button>
              </div>

              <textarea
                value={candidateCode}
                onChange={(e) => setCandidateCode(e.target.value)}
                style={{
                  width: '100%',
                  height: '280px',
                  backgroundColor: '#070a10',
                  color: '#38bdf8',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  resize: 'vertical',
                  outline: 'none'
                }}
                id="code-editor-input"
              />

              {/* Execution Console Output */}
              {execOutput && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#34d399',
                  whiteSpace: 'pre-wrap'
                }}>
                  {execOutput}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Interviewer Conversation */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '620px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bot size={20} color="var(--accent-indigo)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>AI Interviewer (Multi-Agent Dialogue)</h3>
              </div>
              <span className="badge badge-violet">LangGraph Turn Loop</span>
            </div>

            {/* Chat Transcript Area */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '6px' }}>
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignSelf: msg.sender === 'Candidate' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1rem' }}>{msg.avatar}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{msg.sender}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', opacity: 0.8 }}>({msg.badge})</span>
                  </div>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: msg.sender === 'Candidate' ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${msg.sender === 'Candidate' ? 'rgba(99, 102, 241, 0.35)' : 'var(--border-subtle)'}`,
                    fontSize: '0.875rem',
                    lineHeight: 1.5
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input message box */}
            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Explain your thought process or clarify with the interviewer..."
                value={inputTurn}
                onChange={(e) => setInputTurn(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendTurn()}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#0a0d14',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
                id="input-candidate-turn"
              />
              <button onClick={handleSendTurn} className="btn-primary" id="btn-submit-turn">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MULTI-AGENT SCORECARD */}
      {activeTab === 'reports' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Hiring Committee Evaluation</h2>
              <span className="badge badge-emerald" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>STRONG HIRE</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>88</span>
              <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>/ 100 Overall Score</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Technical Accuracy & Correctness', score: 90, color: 'var(--accent-cyan)' },
                { label: 'Problem Solving & Algorithmic Design', score: 92, color: 'var(--accent-indigo)' },
                { label: 'Code Quality & Maintainability', score: 85, color: 'var(--accent-violet)' },
                { label: 'Communication & Trade-off Articulation', score: 84, color: 'var(--accent-emerald)' },
                { label: 'Architectural & Scalability Thinking', score: 89, color: 'var(--accent-rose)' }
              ].map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span>{item.label}</span>
                    <strong>{item.score}%</strong>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${item.score}%`, height: '100%', background: item.color, borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>Agent Feedback & Strengths</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Key Strengths
              </h4>
              <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                <li>Intuitive understanding of doubly-linked list eviction mechanisms.</li>
                <li>Identified cache eviction race conditions prior to follow-up prompting.</li>
                <li>Clean, idiomatic TypeScript implementation without memory leaks.</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={16} /> Growth Recommendations
              </h4>
              <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                <li>Could compare multi-level cache hierarchies (L1 memory vs L2 Redis) earlier.</li>
                <li>Write explicit benchmark stress-tests for high cardinality keys.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: DISTRIBUTED TOPOLOGY */}
      {activeTab === 'architecture' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>
            Microservices & Multi-Agent Distributed Architecture
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { name: 'apps/web', role: 'Next.js 14 Frontend', port: '3000', tech: 'React / Lucide / Vanilla CSS' },
              { name: 'services/api-gateway', role: 'Reverse Proxy & Security', port: '8000', tech: 'Node.js / Express / Rate Limiting' },
              { name: 'services/auth-service', role: 'Identity & JWT Credentials', port: '8001', tech: 'Bcrypt / JWT / RBAC' },
              { name: 'services/user-service', role: 'Profiles & Resumes', port: '8002', tech: 'Skills / S3 Storage Integration' },
              { name: 'services/interview-service', role: 'Session Orchestrator', port: '8003', tech: 'State Machine & Question Queues' },
              { name: 'services/report-service', role: 'Scorecard Synthesis', port: '8004', tech: 'Evaluation Metrics Aggregator' },
              { name: 'services/coding-service', role: 'Code Sandboxing', port: '8005', tech: 'Isolated Multi-Lang Execution' },
              { name: 'services/ai-service', role: 'Multi-Agent Engine', port: '8006', tech: 'Python / FastAPI / LangGraph' },
              { name: 'packages/contracts', role: 'Shared Schemas & Events', port: 'Shared', tech: 'TypeScript Interface Contracts' }
            ].map((svc, i) => (
              <div
                key={i}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <code style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>{svc.name}</code>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Port {svc.port}</span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>{svc.role}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{svc.tech}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
