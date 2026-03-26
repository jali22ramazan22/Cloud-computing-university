import React, { useState, useRef, useEffect } from 'react';
import { useChatBot } from './hooks/useChatBot';
import { MessageBubble } from './components/MessageBubble';
import { BreakdownTable } from './components/BreakdownTable';
import { QuickReplies } from './components/QuickReplies';

function App() {
  const { handleUserSubmit, isTyping, quickReplies, state } = useChatBot();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, isTyping]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleUserSubmit(inputText);
    setInputText('');
  };

  return (
    <>
      <header id="app-header" style={{
        backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
        padding: '1rem', flexShrink: 0, display: 'flex', justifyContent: 'center',
        alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 10
      }}>
        <div className="header-content" style={{ maxWidth: '800px', width: '100%', display: 'flex', alignItems: 'baseline', gap: '12px' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.025em' }}>CFO Bot</h1>
          <span className="subtitle" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>React Cloud Calculator</span>
        </div>
      </header>

      <main id="chat-container" className="chat-scroll-container" style={{
        flexGrow: 1, display: 'flex', justifyContent: 'center', overflowY: 'auto', scrollBehavior: 'smooth'
      }}>
        <div id="messages" style={{ width: '100%', maxWidth: '800px', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {state.messages.map((msg) => 
            msg.type === 'breakdown' 
              ? <BreakdownTable key={msg.id} estimate={msg.content} />
              : <MessageBubble key={msg.id} message={msg} />
          )}

          {isTyping && (
            <div className="message bot" style={{ alignSelf: 'flex-start', animation: 'slideUp 0.3s ease forwards' }}>
              <div className="bubble typing-dots" style={{ backgroundColor: 'var(--bg-bot)', border: '1px solid var(--border)', borderRadius: '1rem', borderTopLeftRadius: '0.25rem', padding: '0.875rem 1.125rem', display: 'flex', gap: '4px' }}>
                <div className="dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }}></div>
                <div className="dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }}></div>
                <div className="dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {!isTyping && <QuickReplies replies={quickReplies} onSelect={handleUserSubmit} />}

      <footer id="input-bar" style={{ flexShrink: 0, padding: '1rem', backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
        <form onSubmit={onSubmit} className="input-wrapper" style={{ width: '100%', maxWidth: '800px', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about cloud costs... e.g. 'add compute'" 
            autoComplete="off"
            style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '1rem 3.5rem 1rem 1.25rem', borderRadius: '1.5rem', fontSize: '1rem', outline: 'none' }}
          />
          <button type="submit" style={{ position: 'absolute', right: '0.5rem', backgroundColor: 'var(--accent)', border: 'none', width: '2.25rem', height: '2.25rem', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '1rem', height: '1rem', marginLeft: '2px' }}>
              <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
            </svg>
          </button>
        </form>
      </footer>
    </>
  );
}

export default App;
