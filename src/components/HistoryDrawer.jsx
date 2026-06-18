/**
 * HistoryDrawer Component displaying previous error analysis history in a slide-out drawer.
 */
function HistoryDrawer({ isOpen, onClose, historyList, onLoadItem, onDeleteItem }) {
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
          <span className="err-drawer-title">최근 디코드 히스토리</span>
          <button className="btn-minimal" onClick={onClose} style={{ border: 'none', padding: '0.25rem' }}>✕</button>
        </div>
        <div className="err-drawer-content">
          {historyList.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '3rem' }}>
              저장된 분석 기록이 없습니다.
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
                    삭제
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

