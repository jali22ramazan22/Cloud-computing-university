import React from 'react';

export function MessageBubble({ message }) {
  if (message.type === 'breakdown') return null; // handled separately 
  
  const isBot = message.type === 'bot';
  const containerClass = `message ${isBot ? 'bot' : 'user'}`;
  
  // Basic markdown parser
  const renderText = (text) => {
    let parsed = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
      
    if (parsed.startsWith('•')) {
      parsed = '<ul>' + parsed.replace(/•\s(.*?)(<br\/>|$)/g, '<li>$1</li>') + '</ul>';
    }
    return { __html: `<p>${parsed}</p>` };
  };

  return (
    <div className={containerClass} style={{
      display: 'flex',
      maxWidth: '85%',
      alignSelf: isBot ? 'flex-start' : 'flex-end',
      animation: 'slideUp 0.3s ease forwards'
    }}>
      <div className="bubble" style={{
        padding: '0.875rem 1.125rem',
        borderRadius: '1rem',
        lineHeight: '1.5',
        fontSize: '0.95rem',
        backgroundColor: isBot ? 'var(--bg-bot)' : 'var(--bg-user)',
        color: isBot ? 'var(--text-primary)' : '#fff',
        borderTopLeftRadius: isBot ? '0.25rem' : '1rem',
        borderTopRightRadius: !isBot ? '0.25rem' : '1rem',
        border: isBot ? '1px solid var(--border)' : 'none'
      }} dangerouslySetInnerHTML={renderText(message.content)} />
    </div>
  );
}
