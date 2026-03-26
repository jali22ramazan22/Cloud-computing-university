import React from 'react';

export function QuickReplies({ replies, onSelect }) {
  if (!replies || replies.length === 0) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      background: 'linear-gradient(to top, var(--bg-primary) 50%, transparent)',
      padding: '0.5rem 1rem',
      zIndex: 5
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        display: 'flex',
        flexWrap: 'nowrap',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        scrollbarWidth: 'none'
      }}>
        {replies.map((reply, idx) => (
          <button 
            key={idx}
            className="quick-reply-btn"
            onClick={() => onSelect(reply)}
            style={{
              whiteSpace: 'nowrap',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--accent)',
              border: '1px solid var(--border)',
              padding: '0.5rem 1rem',
              borderRadius: '2rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  );
}
