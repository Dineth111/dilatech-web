export default function ExportPdfButton({ onClick, label = 'Export PDF', disabled = false }) {
  return (
    <button
      type="button"
      className="btn btn-outline btn-sm"
      onClick={onClick}
      disabled={disabled}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
    >
      <i className="bx bxs-file-pdf" style={{ color: '#ef4444' }} />
      {label}
    </button>
  );
}
