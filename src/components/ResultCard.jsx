/**
 * ResultCard Component renders the AI Diagnosis Report, listing structured steps,
 * warning-level steps, code copying controls, and prevention tips.
 */
function ResultCard({ isLoading, result, lang, onSelectSample }) {
  const t = window.TRANSLATIONS[lang] || window.TRANSLATIONS.ko;
  const [showOnlyWarnings, setShowOnlyWarnings] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [mainCopied, setMainCopied] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      let nextProgress = 0;
      if (elapsed < 500) {
        nextProgress = Math.min(15, Math.floor((elapsed / 500) * 15));
      } else if (elapsed < 6000) {
        const ratio = (elapsed - 500) / 5500;
        nextProgress = Math.floor(15 + ratio * 70);
      } else {
        const ratio = Math.min(1, (elapsed - 6000) / 10000);
        nextProgress = Math.floor(85 + ratio * 13);
      }
      
      setProgress(nextProgress);
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading]);

  const getLoadingMessage = (p) => {
    if (lang === 'en') {
      if (p < 25) return "Loading analysis data and parsing syntax...";
      if (p < 55) return "Matching exception patterns in DB and identifying causes...";
      if (p < 85) return "Starting AI inference engine and formulating solution...";
      return "Applying report format and reviewing prevention suggestions...";
    } else {
      if (p < 25) return "분석 데이터 로드 및 구문 분석 중...";
      if (p < 55) return "예외 패턴 데이터베이스 매칭 및 원인 식별 중...";
      if (p < 85) return "AI 추론 엔진 가동 및 솔루션 수립 중...";
      return "리포트 서식 적용 및 예방 제안 검토 중...";
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setMainCopied(true);
      setTimeout(() => setMainCopied(false), 2000);
    }
  };

  const copyAllResults = () => {
    if (!result) return;
    let text = "";
    if (lang === 'en') {
      text = `[Error Decode Result: ${result.error_analysis.code_name}]\n`;
      text += `Location: ${result.error_analysis.location_context}\n`;
      text += `Cause Analysis: ${result.error_analysis.simple_description}\n\n`;
      text += `■ Troubleshooting Steps:\n`;
      result.troubleshooting_steps.forEach((step, idx) => {
        text += `[Step ${step.step}] ${step.title} (${step.level})\n`;
        text += `Description: ${step.description}\n`;
        if (step.copyable_command) {
          text += `Executable Command: ${step.copyable_command}\n`;
        }
        if (step.is_warning) {
          text += `⚠️ Warning: This step involves high risk.\n`;
        }
        text += `\n`;
      });
      text += `■ Prevention Tips:\n`;
      result.prevention_tips.forEach(tip => {
        text += `- ${tip}\n`;
      });
    } else {
      text = `[에러 해독 결과: ${result.error_analysis.code_name}]\n`;
      text += `발생 위치: ${result.error_analysis.location_context}\n`;
      text += `원인 분석: ${result.error_analysis.simple_description}\n\n`;
      text += `■ 해결 절차:\n`;
      result.troubleshooting_steps.forEach((step, idx) => {
        text += `[단계 ${step.step}] ${step.title} (${step.level})\n`;
        text += `설명: ${step.description}\n`;
        if (step.copyable_command) {
          text += `실행 명령어: ${step.copyable_command}\n`;
        }
        if (step.is_warning) {
          text += `⚠️ 주의: 경고가 동반되는 단계입니다.\n`;
        }
        text += `\n`;
      });
      text += `■ 예방 팁:\n`;
      result.prevention_tips.forEach(tip => {
        text += `- ${tip}\n`;
      });
    }
    
    copyToClipboard(text);
  };

  // Filter steps based on warning toggles
  const filteredSteps = result?.troubleshooting_steps.filter(step => {
    if (showOnlyWarnings) return step.is_warning === true;
    return true;
  }) || [];

  return (
    <section className="err-card" style={{ gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <h2 className="err-section-title">{t.reportTitle}</h2>
      
      {/* Placeholder state */}
      {!isLoading && !result && (
        <div className="err-placeholder-view" style={{ gap: '1rem' }}>
          <div style={{ fontSize: '2.5rem' }}>🔍</div>
          <h3 style={{ color: 'var(--text-accent)', fontWeight: 700 }}>{t.waiting}</h3>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
            {t.waitingDesc}
          </p>
          {onSelectSample && (
            <button
              onClick={() => onSelectSample(1001)} // Load first sample (RAM error) as default live demo
              style={{
                marginTop: '0.5rem',
                padding: '0.4rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: 'var(--text-accent)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              className="sample-load-btn"
              onMouseOver={(e) => { e.target.style.borderColor = 'var(--text-accent)'; e.target.style.backgroundColor = 'var(--btn-hover)'; }}
              onMouseOut={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.backgroundColor = 'transparent'; }}
            >
              {t.loadSampleBtn}
            </button>
          )}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="err-placeholder-view" style={{ borderStyle: 'solid' }}>
          <div className="pulse-loader" style={{ width: '100%', maxWidth: '320px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>{t.progressLabel}</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-accent)' }}>{progress}%</span>
            </div>
            
            <div className="progress-gauge-container">
              <div className="progress-gauge-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <h3 style={{ color: 'var(--text-accent)', fontWeight: 700, margin: '0.75rem 0 0.25rem 0' }}>{t.progressTitle}</h3>
            <p style={{ fontSize: '0.85rem', textAlign: 'center', lineHeight: 1.5, marginBottom: '0.5rem' }}>
              {t.progressDesc}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', height: '1.2rem', display: 'flex', alignItems: 'center' }}>
              ⚡ {getLoadingMessage(progress)}
            </p>
          </div>
        </div>
      )}

      {/* Done result state */}
      {!isLoading && result && (
        <>
          {/* Result header */}
          <div className="err-result-header">
            <span className="err-result-context">{result.error_analysis.location_context}</span>
            <h3 className="err-result-code">{result.error_analysis.code_name}</h3>
            <p className="err-result-desc">{result.error_analysis.simple_description}</p>
          </div>

          {/* Response controls */}
          <div className="err-result-controls">
            <div>
              <button 
                className={`btn-minimal ${showOnlyWarnings ? 'active' : ''}`}
                onClick={() => setShowOnlyWarnings(!showOnlyWarnings)}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              >
                ⚠️ {showOnlyWarnings ? t.allSteps : t.warningsOnly}
              </button>
            </div>
            
            <button 
              className="btn-minimal" 
              onClick={copyAllResults}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            >
              {mainCopied ? `✓ ${t.copied}` : `📋 ${t.copyReport}`}
            </button>
          </div>

          {/* Steps List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label className="err-label" style={{ marginBottom: '-0.5rem' }}>{t.stepsLabel}</label>
            {filteredSteps.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem', border: '1px solid var(--border-color)' }}>
                {t.noSteps}
              </div>
            ) : (
              (() => {
                const renderedGuideTypes = new Set();
                return filteredSteps.map((step, idx) => {
                  let stepGuide = (step.visual_guide && step.visual_guide.type && step.visual_guide.type !== 'none')
                    ? step.visual_guide
                    : getFallbackVisualGuideForStep(step, lang);
                  
                  // Keep at most one guide of each type per report to prevent visual clutter
                  if (stepGuide && stepGuide.type && stepGuide.type !== 'none') {
                    if (renderedGuideTypes.has(stepGuide.type)) {
                      stepGuide = null; // Suppress duplicate guide
                    } else {
                      renderedGuideTypes.add(stepGuide.type);
                    }
                  }

                  return (
                    <div 
                      key={idx} 
                      className={`err-step-card ${step.is_warning ? 'warning-card' : ''}`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={`err-step-badge ${step.is_warning ? 'badge-warning' : ''}`}>
                          Step {step.step} • {step.level}
                        </span>
                        {step.is_warning && (
                          <span style={{ color: 'var(--warning-color)', fontSize: '0.8rem', fontWeight: 'bold' }}>⚠️ {t.warningStep}</span>
                        )}
                      </div>
                      
                      <h4 className={`err-step-title ${step.is_warning ? 'title-warning' : ''}`}>{step.title}</h4>
                      <p className="err-step-desc">{step.description}</p>
                      
                      {step.copyable_command && (
                        <div className="err-code-box">
                          <span className="err-code-content">{step.copyable_command}</span>
                          <button 
                            className="btn-minimal"
                            style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem', flexShrink: 0 }}
                            onClick={() => copyToClipboard(step.copyable_command, idx)}
                          >
                            {copiedIndex === idx ? `✓ ${t.copied}` : t.copy}
                          </button>
                        </div>
                      )}

                      {stepGuide && <VisualGuide guide={stepGuide} />}
                    </div>
                  );
                });
              })()
            )}
          </div>

          {/* Prevention tips */}
          {result.prevention_tips && result.prevention_tips.length > 0 && (
            <div className="err-prevention">
              <label className="err-label" style={{ color: 'var(--text-accent)', marginBottom: '0.25rem' }}>{t.preventionLabel}</label>
              {result.prevention_tips.map((tip, idx) => (
                <div key={idx} className="err-prevention-item">{tip}</div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

/**
 * Keyword-based fallback generator for per-step visual guides.
 */
function getFallbackVisualGuideForStep(step, lang = 'ko') {
  if (!step) return null;
  
  if (step.visual_guide && step.visual_guide.type && step.visual_guide.type !== 'none') {
    return step.visual_guide;
  }
  
  const title = (step.title || '').toLowerCase();
  const desc = (step.description || '').toLowerCase();
  const cmd = (step.copyable_command || '').toLowerCase();
  
  const text = `${title} ${desc} ${cmd}`;
  
  if (text.includes('레지스트리') || text.includes('registry') || text.includes('regedit')) {
    return {
      type: 'registry',
      target_component: lang === 'en' ? 'Registry Editor (regedit)' : '레지스트리 편집기 (regedit)',
      description: lang === 'en'
        ? 'Registry modification is required. Navigate the folders below in order and change the value accurately.'
        : '해결 과정에 레지스트리 수정이 요구됩니다. 아래 폴더 경로를 순서대로 탐색하여 값을 정확하게 변경하세요.'
    };
  }
  
  if (text.includes('cmd') || text.includes('명령 프롬프트') || text.includes('sfc /scannow') || text.includes('터미널') || text.includes('command prompt') || text.includes('ipconfig') || text.includes('dism')) {
    return {
      type: 'cmd',
      target_component: lang === 'en' ? 'Command Prompt (CMD)' : '명령 프롬프트 (CMD)',
      description: lang === 'en'
        ? 'To run the specified recovery command, you must open the Windows Command Prompt as Administrator and execute it.'
        : '이 단계의 지시 명령어를 실행하려면, Windows 명령 프롬프트 창을 켠 뒤 타이핑하여 입력해야 합니다.'
    };
  }
  
  if (text.includes('메모리') || text.includes('ram') || text.includes('접촉 불량') || text.includes('memory') || text.includes('ddr')) {
    return {
      type: 'ram',
      target_component: lang === 'en' ? 'Memory Card (RAM)' : '메모리 카드 (RAM)',
      description: lang === 'en'
        ? 'Insert the RAM module correctly into the motherboard slot to resolve connection errors or physical memory issues.'
        : '접촉 오류나 하드웨어 에러 해결을 위해 메인보드 메모리 슬롯에 RAM 모듈을 정상적으로 맞추어 끼우십시오.'
    };
  }
  
  if (text.includes('케이블') || text.includes('모니터 선') || text.includes('hdmi') || text.includes('dp') || text.includes('포트') || text.includes('cable') || text.includes('port')) {
    return {
      type: 'cables',
      target_component: lang === 'en' ? 'Monitor Cable Connection' : '모니터 화면 케이블 포트',
      description: lang === 'en'
        ? 'Ensure the monitor video signal cable (HDMI/DP) is firmly connected to the lower horizontal external GPU port, not the upper motherboard port.'
        : '모니터 화면 전원/신호 케이블은 본체 상단 메인보드가 아닌 하단 외장 그래픽카드 가로 단자에 올바르게 연결하셔야 합니다.'
    };
  }
  
  if (text.includes('graphics') || text.includes('gpu') || text.includes('그래픽 카드') || text.includes('vga') || text.includes('nvidia') || text.includes('amd')) {
    return {
      type: 'gpu',
      target_component: lang === 'en' ? 'Graphics Card (GPU)' : '그래픽 카드 (GPU)',
      description: lang === 'en'
        ? 'Insert the graphics card vertically into the PCIe slot, secure it with screws, and connect the auxiliary PCIe power cable.'
        : '그래픽 연산 카드를 슬롯에 수직 밀착시키고 나사로 체결한 뒤 보조 전원 커넥터를 결속하는 조작 가이드입니다.'
    };
  }
  
  if (text.includes('bios') || text.includes('바이오스') || text.includes('uefi') || text.includes('secure boot') || text.includes('부팅 설정') || text.includes('csm')) {
    return {
      type: 'bios',
      target_component: lang === 'en' ? 'BIOS Setup Screen' : 'BIOS 설정 화면',
      description: lang === 'en'
        ? 'Repeatedly press the hotkey (Del or F2) at the boot instant to enter system BIOS firmware settings and modify options.'
        : '부팅 순간에 단축키(Del/F2)를 반복적으로 눌러 시스템 펌웨어 설정(BIOS)에 진입하여 옵션을 켜십시오.'
    };
  }
  
  if (text.includes('ssd') || text.includes('hdd') || text.includes('저장 장치') || text.includes('디스크') || text.includes('drive') || text.includes('nvme') || text.includes('m.2')) {
    return {
      type: 'drive',
      target_component: lang === 'en' ? 'M.2 SSD Storage' : 'M.2 SSD 저장 장치',
      description: lang === 'en'
        ? 'Insert the SSD card at a 30-degree angle into the M.2 slot, press it flat, and secure it with the mounting screw.'
        : 'M.2 슬롯에 SSD 카드를 30도 사선으로 비스듬히 안착시킨 뒤 눕혀서 나사로 흔들림 없이 고정하십시오.'
    };
  }
  
  if (text.includes('cpu') || text.includes('쿨러') || text.includes('프로세서') || text.includes('processor') || text.includes('서멀')) {
    return {
      type: 'cpu',
      target_component: lang === 'en' ? 'CPU Socket & Cooler' : 'CPU 및 소켓 장착 위치',
      description: lang === 'en'
        ? 'Align the triangle marks on the CPU chip and socket, insert carefully, apply thermal paste, and mount the cooler.'
        : '핵심 연산 장치인 CPU 칩 모서리 삼각형 정렬을 맞춰 소켓에 장착하고 서멀 그리스를 도포하여 쿨러를 얹으십시오.'
    };
  }
  
  return null;
}

window.ResultCard = ResultCard;
