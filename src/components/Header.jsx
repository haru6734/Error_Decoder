/**
 * Header Component containing branding and control action buttons.
 */
function Header({ onOpenHistory, theme, onToggleTheme, lang, onToggleLang }) {
  const t = window.TRANSLATIONS[lang] || window.TRANSLATIONS.ko;
  return (
    <header className="err-header">
      <div className="err-logo-area">
        <span className="err-logo">{t.appTitle}</span>
        <span className="err-subtitle">{t.appSubtitle}</span>
      </div>
      <div className="err-nav-controls" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
        {/* Language selector segmented control */}
        <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden', fontSize: '0.75rem', height: '1.6rem', alignItems: 'center' }}>
          <button 
            onClick={() => onToggleLang('ko')} 
            style={{
              padding: '0 0.5rem',
              height: '100%',
              border: 'none',
              backgroundColor: lang === 'ko' ? 'var(--text-accent)' : 'transparent',
              color: lang === 'ko' ? 'var(--bg-primary)' : 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: lang === 'ko' ? '700' : '500',
              transition: 'all 0.15s ease',
              outline: 'none'
            }}
          >
            KO
          </button>
          <button 
            onClick={() => onToggleLang('en')} 
            style={{
              padding: '0 0.5rem',
              height: '100%',
              border: 'none',
              backgroundColor: lang === 'en' ? 'var(--text-accent)' : 'transparent',
              color: lang === 'en' ? 'var(--bg-primary)' : 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: lang === 'en' ? '700' : '500',
              transition: 'all 0.15s ease',
              outline: 'none'
            }}
          >
            EN
          </button>
        </div>

        {/* Theme Switch Toggle */}
        <div className="theme-switch-wrapper" style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', marginRight: '0.2rem', opacity: theme === 'dark' ? 1 : 0.3, transition: 'opacity 0.2s' }}>🌙</span>
          <label className="theme-switch" title={lang === 'en' ? 'Toggle Theme' : '테마 변경'}>
            <input type="checkbox" checked={theme === 'light'} onChange={onToggleTheme} />
            <span className="slider round"></span>
          </label>
          <span style={{ fontSize: '0.8rem', marginLeft: '0.2rem', opacity: theme === 'light' ? 1 : 0.3, transition: 'opacity 0.2s' }}>☀️</span>
        </div>
        
        {/* Action Buttons */}
        <button className="btn-minimal" onClick={onOpenHistory} title={t.history} style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', height: '1.6rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          📂 {t.history}
        </button>
      </div>
    </header>
  );
}

window.Header = Header;

