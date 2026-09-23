import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Sparkles, Send, User, Bot, AlertTriangle, ShieldCheck, Bookmark, ExternalLink } from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function AskSkinovaPage() {
  const { user, profile, currentReport } = useApp();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm **Skinova**, your AI skin health and education assistant. I have your **${profile?.skin_type || 'Combination'}** skin profile in mind.\n\nHow can I help you today? You can ask me to explain your visible skin indicators, evaluate active ingredient compatibility, or suggest daily skincare steps.`,
      tool_logs: [{ tool: 'SkinProfileRetrievalTool', status: 'Success', summary: `Loaded profile for ${profile?.skin_type || 'Combination'} skin` }],
      citations: []
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    'Why might my skin have high oiliness in the T-zone?',
    'Can I safely use Retinol and Salicylic Acid in the same routine?',
    'What ingredients are evidence-based for visible dark spots?',
    'How do I repair my skin barrier if my skin feels irritated?',
    'Explain my recent skin analysis in simple, everyday language.'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const payload = {
        message: text,
        user_id: user.id,
        history: messages.slice(-6),
        report_id: currentReport?.id
      };

      const res = await api.sendChatMessage(payload);

      const assistantMsg = {
        role: 'assistant',
        content: res.reply,
        tool_logs: res.tool_logs || [],
        citations: res.citations || [],
        is_red_flag: res.is_red_flag
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Skinova encountered a temporary connection issue. Please verify your connection or try again.',
          tool_logs: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-narrow">
        <MedicalDisclaimer compact={true} />

        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '13.5px', marginBottom: '2px' }}>
              <Sparkles size={16} />
              <span>Talk to Skinova</span>
            </div>
            <h1 style={{ fontSize: '1.9rem' }}>Ask Skinova</h1>
          </div>
          <span className="badge badge-primary">
            Active Context: {profile?.skin_type} · {profile?.primary_concern}
          </span>
        </div>

        {/* Suggested Question Pills */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12.5px', color: 'var(--color-text-light)', marginBottom: '8px' }}>
            Suggested Questions:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(q)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '12px', padding: '5px 12px' }}
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Box */}
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
              >
                {/* Header Icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '12px', fontWeight: 600, opacity: 0.85 }}>
                  {m.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                  <span>{m.role === 'user' ? user?.name || 'You' : 'Skinova'}</span>
                </div>

                {/* Content formatted with basic line breaks and markdown styling */}
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {m.content}
                </div>

                {/* Agent Tool Execution Badges (Transparency) */}
                {m.tool_logs && m.tool_logs.length > 0 && (
                  <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-light)', display: 'block', marginBottom: '4px' }}>
                      Agent Tool Executions:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {m.tool_logs.map((tl, tIdx) => (
                        <span key={tIdx} className="tool-badge-pill" title={tl.summary}>
                          ✓ {tl.tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Citations from RAG */}
                {m.citations && m.citations.length > 0 && (
                  <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--color-text-muted)', background: 'var(--color-surface)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                    <strong>Scientific Grounding:</strong>
                    <ul style={{ listStyle: 'none', marginTop: '4px' }}>
                      {m.citations.map((c, cIdx) => (
                        <li key={cIdx}>• {c.title} ({c.source})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble chat-bubble-assistant" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} className="spinner" style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '13.5px', color: 'var(--color-text-muted)' }}>Skinova is consulting tools & knowledge base...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div style={{ padding: '16px 20px', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{ display: 'flex', gap: '10px' }}
            >
              <input
                type="text"
                className="form-input"
                placeholder="Ask Skinova anything about your skin, ingredients, or routine..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={loading}
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="btn btn-primary"
                style={{ padding: '0 20px' }}
              >
                <Send size={16} />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
