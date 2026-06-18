/**
 * Header Component containing branding and control action buttons.
 */
function Header({ onOpenHistory, theme, onToggleTheme }) {
  return (
    <header className="err-header">
      <div className="err-logo-area">
        <span className="err-logo">ERROR DECODER</span>
        <span className="err-subtitle">Multiplatform Intelligence Error Parser</span>
      </div>
      <div className="err-nav-controls">
        {/* Top: Theme Switch Toggle */}
        <div className="theme-switch-wrapper" style={{ marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.85rem', marginRight: '0.25rem', opacity: theme === 'dark' ? 1 : 0.3, transition: 'opacity 0.2s' }}>🌙</span>
          <label className="theme-switch" title="테마 변경">
            <input type="checkbox" checked={theme === 'light'} onChange={onToggleTheme} />
            <span className="slider round"></span>
          </label>
          <span style={{ fontSize: '0.85rem', marginLeft: '0.25rem', opacity: theme === 'light' ? 1 : 0.3, transition: 'opacity 0.2s' }}>☀️</span>
        </div>
        
        {/* Bottom: Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-minimal" onClick={onOpenHistory} title="History">
            📂 History
          </button>
        </div>
      </div>
    </header>
  );
}

window.Header = Header;

