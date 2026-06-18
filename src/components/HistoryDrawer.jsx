/**
 * HistoryDrawer Component displaying previous error analysis history in a slide-out drawer.
 */
function HistoryDrawer({ isOpen, onClose, historyList, onLoadItem, onDeleteItem, saveHistoryEnabled, onToggleSaveHistory, lang }) {
  const t = window.TRANSLATIONS[lang] || window.TRANSLATIONS.ko;
  return (
    <>
      {/* Backdrop for History Drawer */}
      <div 
        className={`err-drawer-backdrop ${isOpen ? 'open' : ''}`} 
        onClick={onClose} 
      />

      {/* History Drawer */}
      <aside className={`err-drawer ${isOpen ? 'open' : ''}`}>
        <div className="err-drawer-header">
          <span className="err-drawer-title">{t.historyTitle}</span>
          <button className="btn-minimal" onClick={onClose} style={{ border: 'none', padding: '0.25rem' }}>✕</button>
        </div>

        {/* Privacy Toggle Settings Area */}
        <div className="err-history-toggle-container">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            🔒 {t.historyAutoSave}
          </span>
          <label className="theme-switch" title={t.historyAutoSave}>
            <input type="checkbox" checked={saveHistoryEnabled} onChange={onToggleSaveHistory} />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="err-drawer-content">
          {historyList.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '3rem' }}>
              {t.historyEmpty}
            </div>
          ) : (
            historyList.map((item) => (
              <div 
                key={item.id} 
                className="err-history-item"
                onClick={() => onLoadItem(item)}
              >
                <div className="err-history-meta">
                  <span>{item.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="err-history-code">{item.result.error_analysis.code_name}</span>
                  <button 
                    className="btn-minimal" 
                    style={{ border: 'none', padding: '0.1rem 0.3rem', fontSize: '0.75rem', color: 'var(--warning-color)' }}
                    onClick={(e) => onDeleteItem(item.id, e)}
                  >
                    {t.delete}
                  </button>
                </div>
                <p className="err-history-summary">
                  {item.result.error_analysis.simple_description}
                </p>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}

window.HistoryDrawer = HistoryDrawer;
