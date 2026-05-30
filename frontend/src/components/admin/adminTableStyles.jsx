export const thStyle = {
  textAlign: 'left',
  padding: '0.8rem 1.2rem',
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: 'var(--muted)',
  fontWeight: 700,
  background: 'rgba(0,0,0,0.2)',
};

export const tdStyle = {
  padding: '1rem 1.2rem',
  fontSize: '0.95rem',
};

export const trBorder = { borderTop: '1px solid rgba(255,255,255,0.08)' };

export function CrudActions({ onView, onEdit, onDelete, viewLabel = 'View' }) {
  const btn = (onClick, icon, color, borderColor, title) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        width: '34px',
        height: '34px',
        borderRadius: '8px',
        border: `1px solid ${borderColor}`,
        background: 'transparent',
        color,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <i className={`bx ${icon}`} />
    </button>
  );

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {onView && btn(onView, 'bx-show', 'var(--secondary)', 'rgba(16,185,129,0.3)', viewLabel)}
      {onEdit && btn(onEdit, 'bx-edit', 'var(--primary)', 'rgba(59,130,246,0.3)', 'Edit')}
      {onDelete && btn(onDelete, 'bx-trash', 'var(--danger)', 'rgba(239,68,68,0.3)', 'Delete')}
    </div>
  );
}
