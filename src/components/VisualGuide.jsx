/**
 * VisualGuide Component renders interactive 3D-like computer hardware
 * and software guides. It features a unified slide/carousel interface
 * with navigation controls.
 */
function VisualGuide({ guide }) {
  if (!guide || guide.type === 'none') return null;

  const [activeStep, setActiveStep] = useState(1);
  const [collapsed, setCollapsed] = useState(false);

  const type = guide.type;
  const title = guide.target_component || '시각 가이드';
  const description = guide.description || '';

  // Icon for the title based on type
  const getIcon = () => {
    switch (type) {
      case 'ram': return '📟';
      case 'cmd': return '💻';
      case 'gpu': return '🔌';
      case 'bios': return '⚙️';
      case 'cpu': return '🧠';
      case 'drive': return '💾';
      case 'registry': return '📂';
      case 'cables': return '🔌';
      default: return '💡';
    }
  };

  // Define steps data for each type
  const getStepsData = () => {
    switch (type) {
      case 'ram':
        return [
          {
            title: '1단계: 양쪽 고정 레버(클립) 젖히기',
            titleClass: 'text-yellow',
            text: '슬롯 양끝에 달린 고정 집게(레버)를 바깥쪽으로 힘을 주어 누르면 \'틱\' 소리가 나며 벌어집니다. (일부 메인보드는 한쪽에만 클립이 있습니다)'
          },
          {
            title: '2단계: 메모리카드 방향(홈) 정렬하기',
            titleClass: 'text-blue',
            text: '메모리 금빛 단자 가운데 뚫려 있는 홈(키 노치)이 메인보드 슬롯 돌기와 완벽히 일치하는지 눈으로 먼저 대조해 보세요. 반대로 꽂으려고 하면 부러집니다.'
          },
          {
            title: '3단계: 꾹 눌러 고정 레버 잠금',
            titleClass: 'text-green',
            text: '메모리를 슬롯에 수평으로 맞춘 채, 양손 손가락으로 메모리 양쪽 끝을 힘차게 꾹 누릅니다. 딸깍(Click) 소리가 날 때까지 눌러야 고정 레버가 자동으로 닫힙니다.'
          }
        ];
      case 'cmd':
        return [
          {
            title: '1단계: 실행 단축키(Win + R) 누르기',
            titleClass: 'text-yellow',
            text: '키보드 왼쪽 아래에 있는 창문 무늬 키(Windows 키)를 누른 상태에서 영문 R 키를 가볍게 눌러주세요.'
          },
          {
            title: '2단계: \'cmd\' 입력 후 실행하기',
            titleClass: 'text-blue',
            text: '화면 왼쪽 하단에 작은 \'실행\'창이 켜지면 입력 란에 소문자로 cmd를 타이핑해 줍니다. 그 상태에서 [확인] 단추를 누르면 명령 터미널이 구동됩니다.'
          },
          {
            title: '3단계: 관리자 모드로 실행 후 타이핑',
            titleClass: 'text-green',
            text: '만약 에러 해결을 위해 관리자 권한이 필요할 시, 윈도우 검색창에 cmd를 검색하고 우클릭하여 \'관리자 권한으로 실행\'을 클릭한 뒤, 지시받은 명령어를 복사하여 타이핑하십시오.'
          }
        ];
      case 'gpu':
        return [
          {
            title: '1단계: PCIe 슬롯 걸쇠 개방 및 카드 정렬',
            titleClass: 'text-yellow',
            text: '슬롯 맨 오른쪽에 장착된 미세한 플라스틱 걸쇠(락커)를 아래로 누른 다음, 그래픽 카드의 금색 단자를 PCIe 슬롯 홈과 수직이 되도록 정렬합니다.'
          },
          {
            title: '2단계: 수직 밀착 및 브래킷 볼트 고정',
            titleClass: 'text-blue',
            text: '그래픽 카드를 수직 방향으로 강하게 꾹 누릅니다. 슬롯 끝 고정쇠가 튕겨 올라오며 잠긴 후, 본체 케이스 후면 프레임에 맞춰 브래킷 부분에 볼트(나사)를 꽉 조여 흔들리지 않게 고정합니다.'
          },
          {
            title: '3단계: 8핀/12핀 PCIe 보조 전원선 연결',
            titleClass: 'text-green',
            text: '그래픽카드 우측 상단 단자에 컴퓨터 파워 서플라이로부터 나온 PCIe 보조 전원선 (6핀 또는 8핀)을 끝까지 흔들리지 않게 꽂아 완성하십시오.'
          }
        ];
      case 'bios':
        return [
          {
            title: '1단계: 컴퓨터 부팅 시 진입 키 반복 타격',
            titleClass: 'text-yellow',
            text: '컴퓨터 전원을 켬과 동시에 키보드의 Delete(Del) 키 또는 F2 키를 1초에 약 3~4회 속도로 화면이 켜질 때까지 연타합니다.'
          },
          {
            title: '2단계: BIOS 설정 창 제어 및 저장',
            titleClass: 'text-blue',
            text: '화면 디자인이 변경되면 키보드 방향키를 사용하여 지시된 설정 항목(예: Secure Boot, SATA Mode)을 찾아 값을 수정한 뒤, F10 키(저장 후 재시작)를 눌러 저장하고 빠져나오세요.'
          }
        ];
      case 'cpu':
        return [
          {
            title: '1단계: CPU 소켓 개방 및 삼각형 모서리 정치',
            titleClass: 'text-yellow',
            text: '소켓 옆의 쇠막대기(레버)를 옆으로 살짝 벌린 뒤 들어 올립니다. CPU 칩 모서리에 그려진 삼각형 골드 마크가 소켓의 삼각형 표시 방향과 완벽히 겹치도록 내려놓아야 핀이 휘지 않습니다.'
          },
          {
            title: '2단계: 서멀구리스 도포 및 쿨러 체결',
            titleClass: 'text-blue',
            text: '레버를 닫아 완전히 고정한 다음, CPU 정가운데에 열전도용 서멀구리스를 얇게 도포(보통 당구장 표시나 당근 알 크기 정도로 도포)한 뒤 그 위에 CPU 쿨러를 얹어 체결합니다.'
          }
        ];
      case 'drive':
        return [
          {
            title: '1단계: M.2 슬롯에 30도 사선 방향 삽입',
            titleClass: 'text-yellow',
            text: 'M.2 NVMe SSD는 메인보드 바닥에 수평이 아니라, 약 30도 각도로 비스듬히 세워서 끝까지 쏙 밀어 넣어야 금색 단자가 완벽히 결속됩니다.'
          },
          {
            title: '2단계: 수평으로 눕혀 고정 나사 체결',
            titleClass: 'text-blue',
            text: '단자가 결합된 상태에서 SSD 꼬리 부분을 바닥으로 눌러 눕힌 뒤, 메인보드 고정 스탠드오프 나사 홀에 맞춰 아주 작고 얇은 M.2 전용 드라이버 나사로 조여 고정합니다.'
          }
        ];
      case 'registry':
        return [
          {
            title: '1단계: 해당 트리 구조 디렉터리 접근',
            titleClass: 'text-yellow',
            text: '왼쪽 트리의 폴더 모양 아이콘을 하나씩 확장하며 지정된 경로(예: HKEY_LOCAL_MACHINE \\ SYSTEM \\ CurrentControlSet \\ Control)까지 깊이 탐색해 들어갑니다.'
          },
          {
            title: '2단계: 더블클릭 후 값 데이터(Data) 변경',
            titleClass: 'text-blue',
            text: '우측 리스트에서 지시한 레지스트리 항목을 더블클릭한 뒤, 새로 뜨는 창의 \'값 데이터\' 란에 지시된 숫자(예: 0을 1로 수정)를 입력하고 확인을 누릅니다.'
          }
        ];
      case 'cables':
        return [
          {
            title: '❌ 흔히 하는 실수: 메인보드 포트 연결',
            titleClass: 'text-red',
            text: '모니터 케이블을 본체 후면의 상단 메인보드 단자에 잘못 연결하면 화면이 나오지 않거나, 엄청난 버벅임(내장그래픽 강제 연동)이 발생합니다.'
          },
          {
            title: '✅ 올바른 연결: 외장 그래픽카드 포트',
            titleClass: 'text-green',
            text: '반드시 본체 하단 가로 방향으로 배치된 외장 그래픽카드 단자(가로형 슬롯)의 HDMI나 DisplayPort(DP) 단자에 꽂아야 제대로 된 그래픽 성능을 쓸 수 있습니다.'
          }
        ];
      default:
        return [];
    }
  };

  const steps = getStepsData();
  const currentStepData = steps[activeStep - 1] || {};

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveStep(prev => Math.min(steps.length, prev + 1));
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveStep(prev => Math.max(1, prev - 1));
  };

  return (
    <div className={`err-visual-guide-container ${collapsed ? 'collapsed' : ''}`} style={{ position: 'relative' }}>
      {/* Left Slide Arrow (Floating outside left border) */}
      {steps.length > 1 && (
        <button 
          className="vg-slide-arrow left" 
          onClick={handlePrev} 
          disabled={activeStep === 1}
          title="이전 단계"
        >
          ‹
        </button>
      )}

      {/* Right Slide Arrow (Floating outside right border) */}
      {steps.length > 1 && (
        <button 
          className="vg-slide-arrow right" 
          onClick={handleNext} 
          disabled={activeStep === steps.length}
          title="다음 단계"
        >
          ›
        </button>
      )}

      {/* Header Bar */}
      <div className="err-vg-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="err-vg-title-group">
          <span className="err-vg-icon">{getIcon()}</span>
          <span className="err-vg-title">{title} - 비주얼 가이드</span>
        </div>
        <button className="btn-minimal err-vg-toggle-btn" style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem' }}>
          {collapsed ? '📂 열기' : '📁 접기'}
        </button>
      </div>

      {/* Collapsible Content */}
      <div className="err-vg-body">
        <div className="err-vg-desc-box">
          <p className="err-vg-desc-text">
            <strong>ℹ️ 시각 안내 가이드:</strong> {description}
          </p>
        </div>

        {/* Dynamic Graphic Renderer & Slide layout */}
        <div className="vg-flex-layout">
          {/* Visual Canvas Area */}
          <div className="vg-interactive-area bg-darker">
            {/* Graphical Component Wrapper */}
            <div className="vg-canvas-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              {type === 'ram' && <RamVisual activeStep={activeStep} />}
              {type === 'cmd' && <CmdVisual activeStep={activeStep} />}
              {type === 'gpu' && <GpuVisual activeStep={activeStep} />}
              {type === 'bios' && <BiosVisual activeStep={activeStep} />}
              {type === 'cpu' && <CpuVisual activeStep={activeStep} />}
              {type === 'drive' && <DriveVisual activeStep={activeStep} />}
              {type === 'registry' && <RegistryVisual activeStep={activeStep} />}
              {type === 'cables' && <CablesVisual activeStep={activeStep} />}
            </div>
          </div>
          
          {/* Instructions and Controls Area */}
          <div className="vg-instructions-area">
            {/* Sleek Pagination Dots */}
            <div className="vg-dots-indicator" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {steps.map((_, idx) => (
                <button 
                  key={idx}
                  className={`vg-indicator-dot ${activeStep === (idx + 1) ? 'active' : ''}`} 
                  onClick={(e) => { e.stopPropagation(); setActiveStep(idx + 1); }}
                  title={`${idx + 1}단계`}
                />
              ))}
            </div>
            
            {/* Step Detail Content */}
            <div className="vg-step-detail" style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '1rem' }}>
              <h5 className={`vg-step-title ${currentStepData.titleClass}`} style={{ marginBottom: '0.5rem' }}>
                {currentStepData.title}
              </h5>
              <p className="vg-step-text">
                {currentStepData.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 1. RAM (Memory Card) Visual Component
// ----------------------------------------------------
function RamVisual({ activeStep }) {
  return (
    <svg viewBox="0 0 320 200" className="vg-svg">
      {/* Mainboard base */}
      <rect x="10" y="10" width="300" height="180" rx="6" fill="#1b2824" stroke="#2c4c3e" strokeWidth="2" />
      <path d="M 20 20 L 300 20 L 300 180 L 20 180 Z" fill="none" stroke="#253e34" strokeWidth="1" strokeDasharray="5,5" />
      
      {/* CPU Socket & Fan */}
      <rect x="40" y="50" width="80" height="80" rx="4" fill="#0f1916" stroke="#2c4c3e" strokeWidth="2" />
      <circle cx="80" cy="90" r="30" fill="none" stroke="#376752" strokeWidth="1" />
      <circle cx="80" cy="90" r="25" fill="#152621" />
      {/* Fan blades mockup */}
      <path d="M 60 90 L 100 90 M 80 70 L 80 110" stroke="#376752" strokeWidth="3" />
      
      {/* PCIe Slots */}
      <rect x="40" y="150" width="120" height="10" rx="1" fill="#0f1916" stroke="#1c2c27" />
      
      {/* RAM Slots Area */}
      <g>
        <text x="145" y="42" fill="#888" fontSize="8">RAM Slots (CPU Side)</text>
        
        {/* Slot 1 & Slot 2 */}
        <rect x="150" y="50" width="8" height="90" rx="1" fill="#0c1412" stroke="#2c4c3e" />
        <rect x="165" y="50" width="8" height="90" rx="1" fill="#0c1412" stroke="#2c4c3e" />
        
        {/* Highlighted Target Slots */}
        <rect x="180" y="50" width="8" height="90" rx="1" fill="#0c1412" stroke={activeStep === 1 ? "#ffad33" : "#00f0ff"} strokeWidth="1.5" className={activeStep === 1 ? "vg-pulse-yellow" : "vg-pulse-cyan"} />
        <rect x="195" y="50" width="8" height="90" rx="1" fill="#0c1412" stroke={activeStep === 1 ? "#ffad33" : "#00f0ff"} strokeWidth="1.5" className={activeStep === 1 ? "vg-pulse-yellow" : "vg-pulse-cyan"} />
        
        {/* Clips / Latches */}
        <path 
          d={activeStep === 1 ? "M 178 45 L 180 50 L 176 50 Z" : "M 180 43 L 182 50 L 180 50 Z"} 
          fill={activeStep === 1 ? "#ffad33" : "#00f0ff"} 
          style={{ transition: 'all 0.3s' }}
        />
        <path 
          d={activeStep === 1 ? "M 178 145 L 180 140 L 176 140 Z" : "M 180 147 L 182 140 L 180 140 Z"} 
          fill={activeStep === 1 ? "#ffad33" : "#00f0ff"} 
          style={{ transition: 'all 0.3s' }}
        />
        
        {/* RAM Module Insertion Simulation */}
        <g style={{ 
          transform: `translateY(${activeStep === 1 ? '-25px' : activeStep === 2 ? '-12px' : '0px'})`, 
          opacity: activeStep === 1 ? 0.6 : 1,
          transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)' 
        }}>
          {/* RAM PCB stick */}
          <rect x="181" y="55" width="6" height="80" rx="1" fill="#00994d" />
          {/* Gold pins connection */}
          <line x1="181.5" y1="135" x2="186.5" y2="135" stroke="#ffe066" strokeWidth="1" strokeDasharray="1,1" />
          {/* RAM chips blocks */}
          <rect x="182.5" y="62" width="3" height="10" fill="#222" />
          <rect x="182.5" y="75" width="3" height="10" fill="#222" />
          <rect x="182.5" y="88" width="3" height="10" fill="#222" />
          <rect x="182.5" y="101" width="3" height="10" fill="#222" />
          <rect x="182.5" y="114" width="3" height="10" fill="#222" />
          
          {/* Center Key Notch Indicator */}
          <rect x="181" y="93" width="6" height="3" fill="#1b2824" />
        </g>
      </g>
      
      {/* Arrow indicator */}
      {activeStep === 2 && (
        <path d="M 184 25 L 184 48 M 181 44 L 184 48 L 187 44" stroke="#ffe600" strokeWidth="2" fill="none" className="vg-bounce-y" />
      )}
    </svg>
  );
}

// ----------------------------------------------------
// 2. CMD (Command Prompt) Visual Component
// ----------------------------------------------------
function CmdVisual({ activeStep }) {
  const [typedText, setTypedText] = useState('');
  
  useEffect(() => {
    if (activeStep !== 3) {
      setTypedText('');
      return;
    }
    
    // Command typing effect simulation
    const fullCommand = 'sfc /scannow  (그리고 Enter 키를 누르세요)';
    let currentIdx = 0;
    const interval = setInterval(() => {
      setTypedText(fullCommand.substring(0, currentIdx + 1));
      currentIdx++;
      if (currentIdx >= fullCommand.length) {
        clearInterval(interval);
      }
    }, 70);
    
    return () => clearInterval(interval);
  }, [activeStep]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '1rem 0' }}>
      {activeStep === 1 && (
        /* Key combo visual */
        <div className="vg-keyboard-guide">
          <text className="vg-sub-label">키보드에서 두 키를 동시에 눌러주세요</text>
          <div className="vg-keys-container">
            <kbd className="vg-key-cap pulse-key">Windows Key</kbd>
            <span style={{ fontSize: '1.2rem', color: '#888' }}>+</span>
            <kbd className="vg-key-cap pulse-key">R</kbd>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '1rem' }}>
            이 단축키는 Windows 내장 실행(Run) 대화상자를 즉시 호출합니다.
          </p>
        </div>
      )}

      {activeStep === 2 && (
        /* Run Dialog Mock */
        <div className="vg-run-dialog">
          <div className="vg-dialog-header">
            <span>실행 (Run)</span>
            <span className="vg-close-icon">×</span>
          </div>
          <div className="vg-dialog-body">
            <div className="vg-run-icon">📁</div>
            <div style={{ flexGrow: 1 }}>
              <div style={{ fontSize: '0.8rem', marginBottom: '0.4rem', color: '#333' }}>열려는 프로그램, 폴더, 문서 또는 인터넷 주소를 입력하십시오.</div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#555' }}>열기(O):</span>
                <div className="vg-run-input">cmd</div>
              </div>
            </div>
          </div>
          <div className="vg-dialog-footer">
            <button className="vg-dialog-btn active">확인</button>
            <button className="vg-dialog-btn">취소</button>
            <button className="vg-dialog-btn">찾아보기...</button>
          </div>
        </div>
      )}

      {activeStep === 3 && (
        /* Terminal Mock */
        <div className="vg-terminal-mock">
          <div className="vg-terminal-header">
            <span>⚙️ 관리자: 명령 프롬프트 (CMD)</span>
            <div className="vg-term-buttons">
              <span className="min">─</span>
              <span className="max">☐</span>
              <span className="cls">×</span>
            </div>
          </div>
          <div className="vg-terminal-body">
            <div className="vg-term-line">Microsoft Windows [Version 10.0.22631]</div>
            <div className="vg-term-line">(c) Microsoft Corporation. All rights reserved.</div>
            <div className="vg-term-line" style={{ marginTop: '0.5rem' }}>
              <span>C:\Windows\system32&gt;</span>
              <span className="vg-term-cmd">{typedText}</span>
              <span className="vg-cursor">|</span>
            </div>
            
            {typedText.includes('Enter') && (
              <div className="vg-term-line font-dim" style={{ marginTop: '0.5rem', color: '#4caf50' }}>
                [시스템 파일 검사 및 무결성 정밀 분석 진행률 100% 완료...]
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 3. GPU (Graphics Card) Visual Component
// ----------------------------------------------------
function GpuVisual({ activeStep }) {
  return (
    <svg viewBox="0 0 320 200" className="vg-svg">
      {/* Mainboard base */}
      <rect x="10" y="10" width="300" height="180" rx="6" fill="#18202c" stroke="#25374d" strokeWidth="2" />
      
      {/* CPU Area */}
      <rect x="30" y="30" width="60" height="60" rx="4" fill="#0f151e" stroke="#25374d" />
      
      {/* PCIe Slot */}
      <g>
        <text x="110" y="55" fill="#888" fontSize="8">PCIe x16 Express Slot</text>
        <rect x="110" y="60" width="160" height="12" rx="1" fill="#090d14" stroke={activeStep === 1 ? "#ffad33" : "#00f0ff"} strokeWidth="1.5" className={activeStep === 1 ? "vg-pulse-yellow" : ""} />
        {/* Latch at the end */}
        <path d="M 270 56 L 274 66 L 270 66 Z" fill={activeStep === 1 ? "#ffad33" : "#00f0ff"} />
      </g>

      {/* Dedicated GPU Module */}
      <g style={{ 
        transform: `translateY(${activeStep === 1 ? '-35px' : activeStep === 2 ? '-15px' : '0px'})`, 
        opacity: activeStep === 1 ? 0.5 : 1,
        transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)' 
      }}>
        {/* GPU Outer body */}
        <rect x="100" y="72" width="175" height="45" rx="3" fill="#2d2d2d" stroke="#444" />
        {/* Cooling Fans */}
        <circle cx="140" cy="95" r="14" fill="#151515" stroke="#444" />
        <circle cx="185" cy="95" r="14" fill="#151515" stroke="#444" />
        <circle cx="230" cy="95" r="14" fill="#151515" stroke="#444" />
        
        {/* Golden PCIe Pins */}
        <rect x="115" y="117" width="110" height="4" fill="#ffe066" />
        
        {/* Power Connector Slot */}
        <rect x="255" y="70" width="16" height="8" fill="#111" />
      </g>

      {/* PCI Case Bracket Screw Area */}
      <g>
        <rect x="10" y="65" width="20" height="20" fill="#333" />
        <circle cx="20" cy="75" r="3" fill={activeStep === 2 ? "#ffe600" : "#777"} className={activeStep === 2 ? "vg-pulse-yellow" : ""} />
      </g>

      {/* Power Cable Pin insertion */}
      {activeStep === 3 && (
        <g className="vg-bounce-x">
          <path d="M 290 74 L 276 74" stroke="#ff3b30" strokeWidth="2" />
          <rect x="278" y="71" width="10" height="6" fill="#000" rx="1" />
          <text x="270" y="92" fill="#ff3b30" fontSize="8" fontWeight="bold">Power Cable</text>
        </g>
      )}
    </svg>
  );
}

// ----------------------------------------------------
// 4. BIOS Setup Visual Component
// ----------------------------------------------------
function BiosVisual({ activeStep }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '1rem 0' }}>
      {activeStep === 1 && (
        <div className="vg-bios-boot-simulation">
          <div className="vg-bios-logo">💻 PC SYSTEM</div>
          <div className="vg-bios-text-lines">
            <div>Intel Core i7 Processor Detected</div>
            <div>Memory Test: 32768MB OK</div>
            <div>Primary Master Disk: NVMe SSD 1TB</div>
          </div>
          
          <div className="vg-bios-prompt-key pulse-text">
            Press [DEL] or [F2] to enter UEFI BIOS Setup
          </div>
        </div>
      )}

      {activeStep === 2 && (
        <div className="vg-bios-interface-mock">
          <div className="vg-bi-top-bar">
            <span className="vg-bi-tab active">Main</span>
            <span className="vg-bi-tab">Advanced</span>
            <span className="vg-bi-tab">Boot Configuration</span>
            <span className="vg-bi-tab">Save & Exit</span>
          </div>
          <div className="vg-bi-content">
            <div className="vg-bi-row">
              <span className="lbl">System Date:</span>
              <span className="val">[06/06/2026]</span>
            </div>
            <div className="vg-bi-row">
              <span className="lbl">System Time:</span>
              <span className="val">[13:00:25]</span>
            </div>
            <div className="vg-bi-row active-row">
              <span className="lbl">&gt; Secure Boot Status:</span>
              <span className="val">[Disabled]</span>
            </div>
            <div className="vg-bi-row">
              <span className="lbl">&gt; SATA Operation Mode:</span>
              <span className="val">[AHCI]</span>
            </div>
          </div>
          <div className="vg-bi-footer">
            F5: Defaults | F10: Save and Reset | Esc: Exit
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 5. CPU Visual Component
// ----------------------------------------------------
function CpuVisual({ activeStep }) {
  return (
    <svg viewBox="0 0 320 200" className="vg-svg">
      {/* Mainboard */}
      <rect x="20" y="10" width="280" height="180" rx="4" fill="#16201e" stroke="#253e37" />
      
      {/* Socket Area */}
      <rect x="110" y="50" width="100" height="100" rx="3" fill="#2c2c2c" stroke="#444" />
      
      {/* Socket load plate */}
      {activeStep === 1 && (
        <g>
          <rect x="120" y="60" width="80" height="80" fill="#1c1c1c" />
          {/* Latch arm open */}
          <line x1="210" y1="60" x2="225" y2="30" stroke="#aaa" strokeWidth="3" />
          <circle cx="225" cy="30" r="3" fill="#bbb" />
          
          {/* CPU chip sliding in */}
          <g style={{ transform: 'translateY(-15px)', opacity: 0.8, transition: 'all 0.5s' }}>
            <rect x="130" y="70" width="60" height="60" rx="2" fill="#4f5b66" stroke="#ffe066" strokeWidth="1" />
            {/* CPU Heat spreader */}
            <rect x="138" y="78" width="44" height="44" rx="2" fill="#c0c5ce" />
            {/* Triangle mark */}
            <polygon points="131,125 137,125 131,119" fill="#ffe066" />
          </g>
        </g>
      )}

      {activeStep === 2 && (
        <g>
          {/* CPU inside socket locked */}
          <rect x="120" y="60" width="80" height="80" fill="#1c1c1c" />
          <rect x="130" y="70" width="60" height="60" rx="2" fill="#4f5b66" stroke="#555" />
          <rect x="138" y="78" width="44" height="44" rx="2" fill="#c0c5ce" />
          
          {/* Thermal paste drops (X pattern) */}
          <path d="M 148 88 L 172 112 M 172 88 L 148 112" stroke="#abb2bf" strokeWidth="4" strokeLinecap="round" className="vg-pulse-yellow" />
          <text x="135" y="135" fill="#ffe600" fontSize="8">Thermal Paste (서멀구리스)</text>
        </g>
      )}
    </svg>
  );
}

// ----------------------------------------------------
// 6. Drive (SSD/HDD) Visual Component
// ----------------------------------------------------
function DriveVisual({ activeStep }) {
  return (
    <svg viewBox="0 0 320 200" className="vg-svg">
      <rect x="10" y="10" width="300" height="180" rx="5" fill="#1b1c1e" stroke="#333" />
      
      {/* M.2 Connector Slot */}
      <rect x="230" y="80" width="10" height="40" fill="#000" stroke="#00f0ff" />
      <line x1="230" y1="83" x2="230" y2="117" stroke="#ffe066" strokeWidth="2" />

      {/* M.2 NVMe SSD Module */}
      <g style={{ 
        transform: activeStep === 1 ? 'rotate(-20deg) translate(60px, 80px)' : 'rotate(0deg) translate(110px, 80px)', 
        transformOrigin: '230px 100px',
        transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)'
      }}>
        {/* SSD PCB */}
        <rect x="0" y="5" width="110" height="30" rx="1" fill="#0e5336" stroke="#444" />
        {/* Memory controller */}
        <rect x="20" y="10" width="20" height="20" fill="#111" />
        <rect x="50" y="10" width="22" height="20" fill="#222" />
        <rect x="76" y="10" width="22" height="20" fill="#222" />
        {/* Gold connector pins */}
        <rect x="108" y="7" width="2" height="26" fill="#ffe066" />
      </g>

      {/* Standoff & Screw location */}
      <circle cx="108" cy="100" r="4" fill="#ffe066" stroke="#000" className={activeStep === 2 ? "vg-pulse-yellow" : ""} />
      
      {activeStep === 1 && (
        <text x="120" y="45" fill="#ffad33" fontSize="8" className="vg-pulse-yellow">30도 비스듬한 각도로 먼저 장착</text>
      )}
    </svg>
  );
}

// ----------------------------------------------------
// 7. Registry Editor Visual Component
// ----------------------------------------------------
function RegistryVisual({ activeStep }) {
  const [expandedNodes, setExpandedNodes] = useState({
    hklm: true,
    system: false,
    ccs: false,
    control: false
  });

  const toggleNode = (node) => {
    setExpandedNodes(prev => ({
      ...prev,
      [node]: !prev[node]
    }));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '1rem 0' }}>
      <div className="vg-regedit-mock">
        {/* Header */}
        <div className="vg-reg-header">
          <span>💻 레지스트리 편집기 (Registry Editor)</span>
          <div className="vg-reg-menu">파일(F)  편집(E)  보기(V)  즐겨찾기(A)  도움말(H)</div>
        </div>
        
        {/* Address bar */}
        <div className="vg-reg-address">
          주소: 컴퓨터\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet
        </div>

        <div className="vg-reg-split">
          {/* Tree View (Left) */}
          <div className="vg-reg-tree">
            <div className="vg-tree-item">
              <span className="arr">▼</span> 📁 컴퓨터
            </div>
            <div className="vg-tree-item indent-1" onClick={() => toggleNode('hklm')}>
              <span className="arr">{expandedNodes.hklm ? '▼' : '▶'}</span> 📁 HKEY_LOCAL_MACHINE
            </div>
            
            {expandedNodes.hklm && (
              <>
                <div className="vg-tree-item indent-2" onClick={() => toggleNode('system')}>
                  <span className="arr">{expandedNodes.system ? '▼' : '▶'}</span> 📁 SYSTEM
                </div>
                
                {expandedNodes.system && (
                  <>
                    <div className="vg-tree-item indent-3" onClick={() => toggleNode('ccs')}>
                      <span className="arr">{expandedNodes.ccs ? '▼' : '▶'}</span> 📁 CurrentControlSet
                    </div>
                    
                    {expandedNodes.ccs && (
                      <>
                        <div className="vg-tree-item indent-4 active-tree-item" onClick={() => toggleNode('control')}>
                          <span className="arr">{expandedNodes.control ? '▼' : '▶'}</span> 📂 Control
                        </div>
                        
                        {expandedNodes.control && (
                          <div className="vg-tree-item indent-5">
                            📄 Session Manager
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Value list (Right) */}
          <div className="vg-reg-values">
            <table className="vg-reg-table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>종류</th>
                  <th>데이터</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="nm">(기본값)</td>
                  <td>REG_SZ</td>
                  <td>(값 설정되지 않음)</td>
                </tr>
                <tr className={activeStep === 2 ? "active-row-val" : ""}>
                  <td className="nm">🔧 RegistryValueLimit</td>
                  <td>REG_DWORD</td>
                  <td>{activeStep === 2 ? "0x00000001 (1)" : "0x00000000 (0)"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 8. Cables (HDMI/DP/Power) Visual Component
// ----------------------------------------------------
function CablesVisual({ activeStep }) {
  return (
    <svg viewBox="0 0 320 200" className="vg-svg">
      {/* Back of PC case chassis */}
      <rect x="90" y="15" width="140" height="170" rx="3" fill="#2c2c2c" stroke="#444" strokeWidth="2" />
      
      {/* Fan exhaust mesh at the top */}
      <circle cx="160" cy="55" r="25" fill="#151515" stroke="#444" />
      <circle cx="160" cy="55" r="20" stroke="#333" strokeDasharray="3,3" fill="none" />
      
      {/* Motherboard I/O Panel Area (Upper part) */}
      <g>
        <rect x="105" y="90" width="30" height="40" fill="#a0a0a0" rx="1" />
        <rect x="110" y="95" width="8" height="6" fill="#111" /> {/* USB */}
        <rect x="110" y="105" width="8" height="6" fill="#111" /> {/* USB */}
        
        {/* Wrong port warning */}
        <rect x="122" y="95" width="10" height="15" fill="#f00" stroke="#fff" rx="1" className={activeStep === 1 ? "vg-pulse-red" : ""} />
        <text x="124" y="105" fill="#fff" fontSize="6" fontWeight="bold">DP</text>
        
        <text x="75" y="85" fill="#ff4d4d" fontSize="7" fontWeight="bold">❌ 메인보드 화면 포트</text>
      </g>

      {/* Graphics Card Ports Area (Lower part) */}
      <g>
        <rect x="105" y="145" width="110" height="15" fill="#1a1a1a" rx="1" stroke="#376752" />
        <rect x="120" y="149" width="15" height="7" fill="#00ff99" stroke="#fff" rx="1" className={activeStep === 2 ? "vg-pulse-green" : ""} />
        <rect x="145" y="149" width="15" height="7" fill="#222" />
        <rect x="170" y="149" width="15" height="7" fill="#222" />
        
        <text x="105" y="174" fill="#00ff99" fontSize="7" fontWeight="bold">✅ 그래픽카드 화면 포트 (여기에 연결!)</text>
      </g>

      {/* Cable Connector Line Animation */}
      {activeStep === 2 ? (
        <path d="M 300 152 L 140 152" stroke="#00ff99" strokeWidth="2" strokeDasharray="5,5" className="vg-cable-flow" />
      ) : (
        <path d="M 300 102 L 137 102" stroke="#ff4d4d" strokeWidth="2" strokeDasharray="5,5" className="vg-cable-flow" />
      )}

      {/* Monitor Cable end piece */}
      <g style={{ 
        transform: `translate(${activeStep === 2 ? '145px' : '135px'}, ${activeStep === 2 ? '148px' : '97px'})`,
        transition: 'all 0.5s' 
      }}>
        <rect x="0" y="0" width="15" height="8" fill="#1f3c6d" rx="1" />
        <rect x="15" y="2" width="5" height="4" fill="#bbb" />
        <path d="M -5 4 L 0 4" stroke="#444" strokeWidth="3" />
      </g>
    </svg>
  );
}

// Global window registration for babel loading
window.VisualGuide = VisualGuide;
