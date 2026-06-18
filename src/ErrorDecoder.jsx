function ErrorDecoder() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('err-theme') || 'light';
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
      
      if (needReseed) {
        const mockItems = [
          {
            id: 1001,
            date: "예시: 메모리 카드 (RAM)",
            result: {
              error_analysis: {
                code_name: "WHEA_UNCORRECTABLE_ERROR (0x00000124)",
                location_context: "시스템 주 메모리 (RAM) 슬롯 #3",
                simple_description: "작업대(RAM)의 다리가 심하게 헐거워져 컴퓨터 두뇌(CPU)가 데이터를 전달받지 못하고 블루스크린이 발생했습니다."
              },
              troubleshooting_steps: [
                {
                  step: 1,
                  level: "기본 해결책",
                  title: "메모리 카드 분리 및 접촉단자 세척",
                  description: "본체 양옆 레버를 젖혀 메모리 카드를 분리한 후, 하단 금색 접촉 단자를 깨끗한 지우개로 살짝 밀어 이물질을 닦아내고 먼지를 불어냅니다.",
                  copyable_command: "",
                  is_warning: false,
                  visual_guide: { type: "none" }
                },
                {
                  step: 2,
                  level: "물리적 조치",
                  title: "딸깍 소리가 나도록 재장착",
                  description: "가이드 그림과 같이 방향을 맞춰 수직으로 꾹 눌러 양옆 클립이 자동으로 닫힐 때까지 단단히 고정합니다.",
                  copyable_command: "",
                  is_warning: true,
                  visual_guide: {
                    type: "ram",
                    target_component: "메모리 카드 (RAM) 장착 위치",
                    description: "컴퓨터 본체의 옆면 덮개를 나사를 풀어 연 뒤, 메인보드의 CPU 쿨러 바로 옆에 위치한 길쭉한 막대 모양의 메모리 슬롯을 찾아 재장착해야 합니다."
                  }
                }
              ],
              prevention_tips: [
                "본체를 강하게 흔들거나 발로 차는 충격을 가하지 마세요.",
                "먼지가 많이 쌓이면 접촉 불량이 생기므로 주기적으로 내부 먼지를 에어스프레이로 청소해 주세요."
              ]
            }
          },
          {
            id: 1002,
            date: "예시: 명령 프롬프트 (CMD)",
            result: {
              error_analysis: {
                code_name: "SYSTEM_FILE_CORRUPTION",
                location_context: "Windows OS 시스템 파일 디렉터리",
                simple_description: "윈도우의 중요한 시스템 파일 일부가 파손되거나 상실되어 예기치 못한 크래시가 유발되었습니다."
              },
              troubleshooting_steps: [
                {
                  step: 1,
                  level: "OS 복구 해결책",
                  title: "SFC 복구 명령어 실행",
                  description: "아래 제공된 복구 명령어를 복사하여 관리자 권한으로 실행한 명령 프롬프트 창에 붙여넣고 Enter 키를 눌러 손상된 파일을 복구합니다.",
                  copyable_command: "sfc /scannow",
                  is_warning: false,
                  visual_guide: {
                    type: "cmd",
                    target_component: "명령 프롬프트 (CMD) 실행법",
                    description: "지시된 시스템 파일 복구 명령어를 실행하기 위해서는 Windows 명령 프롬프트(터미널)를 관리자 모드로 켜서 실행해야 합니다."
                  }
                }
              ],
              prevention_tips: [
                "컴퓨터 전원을 끌 때 강제로 파워 버튼을 누르지 말고 윈도우 시작 메뉴를 통해 정상적으로 종료해 주세요."
              ]
            }
          },
          {
            id: 1003,
            date: "예시: 화면 연결 (케이블)",
            result: {
              error_analysis: {
                code_name: "NO_DISPLAY_SIGNAL",
                location_context: "외부 디스플레이 출력 포트 연결부",
                simple_description: "모니터 신호 케이블이 고성능 그래픽 연산 장치(GPU)가 아닌 메인보드 기본 포트에 잘못 꽂혀 화면이 출력되지 않고 있습니다."
              },
              troubleshooting_steps: [
                {
                  step: 1,
                  level: "기본 연결 교정",
                  title: "케이블 하단 외장 그래픽 포트로 이동 연결",
                  description: "본체 상단 세로 방향 포트에 연결된 모니터 케이블(HDMI/DP)을 뽑아서 하단 가로 방향으로 나란히 배치된 외장 그래픽 포트 중 하나에 다시 견고하게 꽂아주세요.",
                  copyable_command: "",
                  is_warning: false,
                  visual_guide: {
                    type: "cables",
                    target_component: "모니터 화면 케이블 연결 방법",
                    description: "컴퓨터 뒷면 포트에는 모니터 케이블을 꽂는 곳이 두 군데(상단 메인보드 포트와 하단 외장 그래픽카드 포트)가 있습니다. 반드시 아래쪽 가로 형태 포트에 꽂으셔야 합니다."
                  }
                }
              ],
              prevention_tips: [
                "이사나 본체 청소 후 케이블을 재연결할 때 이 포트 배치를 반드시 유념해 주세요."
              ]
            }
          },
          {
            id: 1004,
            date: "예시: 레지스트리 편집기",
            result: {
              error_analysis: {
                code_name: "DRIVER_POWER_STATE_FAILURE",
                location_context: "Registry (HKEY_LOCAL_MACHINE)",
                simple_description: "하드웨어 전원 관리 드라이버 세팅 레지스트리 값이 비활성화되어 윈도우 진입 중에 블루스크린이 발생합니다."
              },
              troubleshooting_steps: [
                {
                  step: 1,
                  level: "레지스트리 수정",
                  title: "RegistryValueLimit 데이터 설정값 변경",
                  description: "가이드에 표시된 경로(HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control)를 찾아 들어간 뒤, 'RegistryValueLimit' 키를 더블클릭해 값 데이터를 1로 변경합니다.",
                  copyable_command: "regedit",
                  is_warning: true,
                  visual_guide: {
                    type: "registry",
                    target_component: "레지스트리 편집기 (regedit) 조작법",
                    description: "해당 전원 관리 드라이버 문제를 수정하기 위해 윈도우 레지스트리 에디터에서 해당 경로를 따라 진입한 뒤 값을 변경해야 합니다."
                  }
                }
              ],
              prevention_tips: [
                "레지스트리는 잘못 수정하면 부팅 불능에 빠질 수 있으므로 반드시 지시된 경로와 값만 신중하게 수정하세요."
              ]
            }
          },
          {
            id: 1005,
            date: "예시: 바이오스 (BIOS)",
            result: {
              error_analysis: {
                code_name: "SECURE_BOOT_DISABLED",
                location_context: "UEFI/BIOS 시스템 펌웨어 영역",
                simple_description: "윈도우 보안 부팅 기능(Secure Boot)이 꺼져 있어 특정 최신 운영체제 및 보안 애플리케이션 실행이 차단되었습니다."
              },
              troubleshooting_steps: [
                {
                  step: 1,
                  level: "BIOS 설정 변경",
                  title: "Secure Boot 활성화",
                  description: "PC를 켜자마자 Del/F2 키를 눌러 BIOS에 진입한 후 Security 또는 Boot 탭에서 Secure Boot 설정을 Enabled로 변경하고 F10을 눌러 저장합니다.",
                  copyable_command: "",
                  is_warning: true,
                  visual_guide: {
                    type: "bios",
                    target_component: "BIOS 설정 화면 진입법",
                    description: "컴퓨터 부팅 순간에 전용 단축키를 눌러 펌웨어 모드로 진입한 뒤 Secure Boot 설정을 켜주어야 합니다."
                  }
                }
              ],
              prevention_tips: [
                "메인보드 BIOS 버전을 최신으로 유지하면 보안 장치 호환성이 극대화됩니다."
              ]
            }
          }
        ];
        localStorage.setItem('err-history-list', JSON.stringify(mockItems));
      }
    } catch (e) {
      console.error("Failed to seed mock history", e);
    }
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
    setIsLoading(true);

    try {
      const parsedResult = await analyzeError({
        imageFile,
        logText,
        logFileName,
        logOption
      });

      setResult(parsedResult);
      saveToHistory(parsedResult);
    } catch (err) {
      console.error(err);
      
      // If server requires payment auth (rate limit exceeded)
      if (err.status === 'REQUIRE_AUTH') {
        setShowAuthModal(true);
      } else {
        setErrorStatus(`분석 중 에러가 발생했습니다: ${err.message}`);
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
          />

          {/* Right Panel: Resolution Output & Guide */}
          <ResultCard 
            isLoading={isLoading}
            result={result}
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
      />

      {/* Google Auth & Mock Payment Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

window.ErrorDecoder = ErrorDecoder;

