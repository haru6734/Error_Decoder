/**
 * AuthModal Component manages user login (Google Mock Auth) and mock payment
 * once free usage rate-limits are reached.
 */
function AuthModal({ isOpen, onClose, onSuccess, lang }) {
  if (!isOpen) return null;

  const t = window.TRANSLATIONS[lang] || window.TRANSLATIONS.ko;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGoogleLogin = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsProcessing(false);
    }, 1200); // Mock authentication loading
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Return 가상 토큰 to caller
      onSuccess('test-paid-token');
      setIsProcessing(false);
    }, 1500); // Mock payment gateway processing
  };

  return (
    <div className="err-modal-backdrop" onClick={onClose}>
      <div className="err-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', borderRadius: '4px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--warning-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            ⚠️ {t.authModalTitle}
          </h3>
          <button className="btn-minimal" onClick={onClose} style={{ border: 'none', padding: '0.25rem', fontSize: '1rem' }}>✕</button>
        </div>

        {/* Modal Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-primary)', margin: 0 }}>
            {lang === 'en' ? (
              <>You have exceeded the <strong>5 free analysis queries</strong> provided per 15 minutes. To prevent automated bot attacks and stabilize server charges, continuous usage requires <strong>Google account integration and a mock payment (100 KRW per query)</strong>.</>
            ) : (
              <>15분간 제공되는 <strong>5회 무료 분석 제공량</strong>을 모두 초과하셨습니다.<br />무분별한 봇 공격 방지와 서버 과금 안정화를 위해, 지속적인 사용 시 <strong>구글 계정 연동 및 가상 소액 결제(1회 100원)</strong>가 필요합니다.</>
            )}
          </p>

          <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.75rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div>• {t.authModalType}</div>
            <div>• {t.authModalPrice}</div>
          </div>
        </div>

        {/* Action Flows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          
          {/* Step 1: Google Login */}
          {!isLoggedIn ? (
            <button 
              className="btn-cta" 
              onClick={handleGoogleLogin} 
              disabled={isProcessing}
              style={{ backgroundColor: '#4285F4', borderColor: '#4285F4', color: '#FFFFFF', textTransform: 'none' }}
            >
              {isProcessing ? (
                <span className="spinner" style={{ borderTopColor: '#4285F4' }}></span>
              ) : (
                t.authModalGoogleLogin
              )}
            </button>
          ) : (
            <div style={{ color: '#2E7D32', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'center', padding: '0.5rem', border: '1px solid #2E7D32', backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>
              ✓ {t.authModalLoginSuccess}
            </div>
          )}

          {/* Step 2: Pay */}
          <button 
            className="btn-cta" 
            onClick={handlePayment} 
            disabled={!isLoggedIn || isProcessing}
            style={{ width: '100%' }}
          >
            {isProcessing ? (
              <>
                <span className="spinner"></span>
                <span>{t.authModalPayProcessing}</span>
              </>
            ) : (
              t.authModalPay
            )}
          </button>
        </div>

        {/* Footer info */}
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', margin: '0.5rem 0 -0.5rem 0' }}>
          {t.authModalFooter}
        </p>
      </div>
    </div>
  );
}

window.AuthModal = AuthModal;
