import React from 'react';

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: 2, maximumFractionDigits: 2
  }).format(amount);
};

export function BreakdownTable({ estimate }) {
  if (!estimate || !estimate.components || estimate.components.length === 0) {
    return (
      <div className="message bot" style={{ alignSelf: 'flex-start', maxWidth: '85%', animation: 'slideUp 0.3s' }}>
        <div className="bubble" style={{ backgroundColor: 'var(--bg-bot)', border: '1px solid var(--border)', borderRadius: '1rem', borderTopLeftRadius: '0.25rem', padding: '1rem' }}>
          <p>No components added to the estimate yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message bot" style={{ alignSelf: 'flex-start', maxWidth: '85%', animation: 'slideUp 0.3s', width: '100%' }}>
      <div className="bubble" style={{ backgroundColor: 'var(--bg-bot)', border: '1px solid var(--border)', borderRadius: '1rem', borderTopLeftRadius: '0.25rem', padding: '1.25rem', width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '300px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ paddingBottom: '8px' }}>Component</th>
              <th style={{ paddingBottom: '8px' }}>Parameters</th>
              <th style={{ paddingBottom: '8px', textAlign: 'right' }}>Cost/mo</th>
            </tr>
          </thead>
          <tbody>
            {estimate.components.map((comp, idx) => (
              <tr key={idx}>
                <td style={{ borderLeft: `3px solid var(--color-${comp.type})`, paddingLeft: '8px', padding: '8px 0 8px 8px' }}>
                  <strong>{comp.type.charAt(0).toUpperCase() + comp.type.slice(1)}</strong><br/>
                  <span style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>{comp.tier || 'Auto'}</span>
                </td>
                <td style={{ fontSize: '0.85em', color: 'var(--text-secondary)', padding: '8px 0' }}>
                  {Object.entries(comp.inputs || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}
                </td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', padding: '8px 0' }}>
                  {formatCurrency(comp.cost)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid var(--border)' }}>
              <th colSpan="2" style={{ paddingTop: '12px', textAlign: 'right' }}>Total Estimated Cost:</th>
              <th style={{ paddingTop: '12px', textAlign: 'right', fontSize: '1.1em', color: 'var(--accent-green)' }}>
                {formatCurrency(estimate.totalCost)}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
