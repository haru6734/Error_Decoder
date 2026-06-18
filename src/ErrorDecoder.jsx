function ErrorDecoder() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('err-theme') || 'light';
  });

  // Language state (defaults to ko or saved choice)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('err-lang') || 'ko';
  });
  
  // File states
  const [imageFile, setImageFile] = useState(null); // base64 string
  const [logFileName, setLogFileName] = useState('');
  const [logText, setLogText] = useState('');
  const [logOption, setLogOption] = useState('smart'); // 'smart', 'tail', 'full'
  
  // App system states
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');
  
  // Payment / OAuth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Output data
  const [result, setResult] = useState(null);
  
  // History Drawer state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  
  // Save History toggle state (defaults to false for privacy)
  const [saveHistoryEnabled, setSaveHistoryEnabled] = useState(() => {
    return localStorage.getItem('err-save-history') === 'true';
  });

  const handleToggleSaveHistory = () => {
    const nextVal = !saveHistoryEnabled;
    setSaveHistoryEnabled(nextVal);
    localStorage.setItem('err-save-history', String(nextVal));
  };

  const handleToggleLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('err-lang', newLang);
  };


  // Sync theme
  useEffect(() => {
    localStorage.setItem('err-theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  // Load history on mount
  useEffect(() => {
    seedMockHistory();
    loadHistory();
  }, []);

  const seedMockHistory = () => {
    try {
      const stored = localStorage.getItem('err-history-list');
      const parsed = stored ? JSON.parse(stored) : [];
      // Re-seed if no history exists, or if we find old root-level visual_guide keys
      const needReseed = !stored || parsed.length === 0 || parsed.some(item => item.result && item.result.visual_guide);
      
      if (needReseed && window.getMockSamples) {
        const samples = window.getMockSamples(lang);
        const mockItems = samples.map(s => ({
          id: s.id,
          date: s.date,
          result: s.result
        }));
        localStorage.setItem('err-history-list', JSON.stringify(mockItems));
      }
    } catch (e) {
      console.error("Failed to seed mock history", e);
    }
  };

  // Typing simulation speed: adjust chunk size to finish in ~800ms
  const handleSelectSample = (sampleId) => {
    if (isLoading || !window.getMockSamples) return;
    
    const samples = window.getMockSamples(lang);
    const sample = samples.find(s => s.id === sampleId);
    if (!sample) return;

    // 1. Reset inputs & prepare simulation
    setImageFile(null);
    setLogFileName('');
    setLogText('');
    setResult(null);
    setErrorStatus('');
    setIsLoading(true);

    const fullText = sample.logText;
    let index = 0;
    
    const timer = setInterval(() => {
      if (index < fullText.length) {
        const charsToTake = Math.min(3, fullText.length - index);
        setLogText(prev => prev + fullText.substring(index, index + charsToTake));
        index += charsToTake;
      } else {
        clearInterval(timer);
        
        // 2. Typing is finished. Now load results
        setResult(sample.result);
        saveToHistory(sample.result);
        setIsLoading(false);
      }
    }, 15);
  };

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('err-history-list');
      if (stored) {
        setHistoryList(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  const saveToHistory = (newResult) => {
    if (!saveHistoryEnabled) return; // Skip saving history if toggle is disabled
    try {
      const stored = localStorage.getItem('err-history-list');
      let currentList = stored ? JSON.parse(stored) : [];
      
      const itemToSave = {
        id: Date.now(),
        date: new Date().toLocaleDateString('ko-KR', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        result: newResult
      };

      const updatedList = [itemToSave, ...currentList].slice(0, 15);
      localStorage.setItem('err-history-list', JSON.stringify(updatedList));
      setHistoryList(updatedList);
    } catch (e) {
      console.error("Failed to save to history", e);
    }
  };

  const deleteHistoryItem = (id, e) => {
    e.stopPropagation();
    try {
      const updated = historyList.filter(item => item.id !== id);
      localStorage.setItem('err-history-list', JSON.stringify(updated));
      setHistoryList(updated);
    } catch (e) {
      console.error("Failed to delete history item", e);
    }
  };

  const loadHistoryItem = (item) => {
    setResult(item.result);
    setIsHistoryOpen(false);
  };

  const handleAnalyze = async () => {
    setErrorStatus('');
    
    // 1. Detect sensitive information before sending logs to Gemini API
    if (logText) {
      const sensitiveList = detectSensitiveInfo(logText);
      if (sensitiveList.length > 0) {
        const listText = sensitiveList.map(item => {
          let translatedType = item.type;
          if (lang === 'en') {
            if (item.type === '이메일 주소') translatedType = 'Email Address';
            else if (item.type === 'IP 주소') translatedType = 'IP Address';
            else if (item.type === 'Google API Key') translatedType = 'Google API Key';
            else if (item.type === '비밀번호/인증 토큰 의심') translatedType = 'Suspected Password/Token';
            else if (item.type === '데이터베이스 접속 URL') translatedType = 'Database Connection URL';
            else if (item.type === '시스템 사용자 경로') translatedType = 'System User Path';
          }
          return `- [${translatedType}] ${item.value}`;
        }).join('\n');

        const t = window.TRANSLATIONS[lang] || window.TRANSLATIONS.ko;
        const confirmMsg = `${t.sensitiveWarnTitle}\n\n${listText}\n\n${t.sensitiveWarnFooter}`;
        
        if (!window.confirm(confirmMsg)) {
          return; // Abort analysis
        }
      }
    }

    setIsLoading(true);

    try {
      const parsedResult = await analyzeError({
        imageFile,
        logText,
        logFileName,
        logOption,
        lang
      });

      setResult(parsedResult);
      saveToHistory(parsedResult);
    } catch (err) {
      console.error(err);
      
      // If server requires payment auth (rate limit exceeded)
      if (err.status === 'REQUIRE_AUTH') {
        setShowAuthModal(true);
      } else {
        const errMsg = lang === 'en' 
          ? `An error occurred during analysis: ${err.message}`
          : `분석 중 에러가 발생했습니다: ${err.message}`;
        setErrorStatus(errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = (token) => {
    localStorage.setItem('err-paid-token', token);
    setShowAuthModal(false);
    
    // Automatically trigger analysis again once authorized/paid!
    setTimeout(() => {
      handleAnalyze();
    }, 300);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`err-decoder-app theme-${theme}`}>
      <div className="err-container">
        
        {/* Header */}
        <Header 
          onOpenHistory={() => setIsHistoryOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
          lang={lang}
          onToggleLang={handleToggleLang}
        />

        {/* Main Workspace Layout */}
        <main className="err-main-grid">
          
          {/* Left Panel: Inputs & Configuration */}
          <ConfigCard 
            imageFile={imageFile}
            setImageFile={setImageFile}
            logFileName={logFileName}
            setLogFileName={setLogFileName}
            logText={logText}
            setLogText={setLogText}
            logOption={logOption}
            setLogOption={setLogOption}
            isLoading={isLoading}
            errorStatus={errorStatus}
            setErrorStatus={setErrorStatus}
            onAnalyze={handleAnalyze}
            lang={lang}
            onSelectSample={handleSelectSample}
          />

          {/* Right Panel: Resolution Output & Guide */}
          <ResultCard 
            isLoading={isLoading}
            result={result}
            lang={lang}
            onSelectSample={handleSelectSample}
          />
        </main>
      </div>

      {/* History Drawer */}
      <HistoryDrawer 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyList={historyList}
        onLoadItem={loadHistoryItem}
        onDeleteItem={deleteHistoryItem}
        saveHistoryEnabled={saveHistoryEnabled}
        onToggleSaveHistory={handleToggleSaveHistory}
        lang={lang}
      />

      {/* Google Auth & Mock Payment Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        lang={lang}
      />
    </div>
  );
}

window.ErrorDecoder = ErrorDecoder;
