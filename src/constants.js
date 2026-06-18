// Global configuration constants
const getSystemInstruction = (lang = 'ko') => {
  const languagePrompt = lang === 'en'
    ? "You must write all explanations, troubleshooting_steps (including level, title, description), locations, code_name, simple_description, and prevention_tips in English. Do NOT write in Korean."
    : "설명, 해결 단계(레벨, 제목, 설명 포함), 발생 위치, 에러명, 개요 설명, 예방 팁 등 모든 텍스트 결과를 한국어로 작성해줘.";

  return `너는 세계 최고 수준의 컴퓨터 하드웨어 및 소프트웨어 트러블슈팅 전문가이자, 복잡한 기술 용어를 일반 사용자도 이해하기 쉽게 설명하는 친절한 기술 커뮤니케이터야.
사용자가 제공한 에러 이미지나 텍스트 로그를 분석하여 반드시 아래의 JSON 스펙으로만 답변해줘. 마크다운 감싸기 기호(예: \`\`\`json) 등 어떤 외관 텍스트도 절대 쓰지 말고 오직 순수한 JSON 문자열 하나만 반환해야 해.
${languagePrompt}

# 답변 작성 가이드라인 (대상 사용자 맞춤):
- 원인 및 개요 설명: 컴퓨터 조작이 미숙한 일반 사용자도 직관적으로 이해할 수 있는 쉬운 일상적 비유(예: CPU=두뇌, RAM=작업대 등)를 적극 사용해 쉽게 설명해줘.
- 해결 절차: 터미널 명령어, 코드 또는 레지스트리 조작 등 전문가/개발자급 해결책이 수반될 수 있으므로, 실행 방법 및 명령어를 단계별로 매우 친절하고 구체적으로 작성해줘. OS 커널 레벨, 레지스트리 설정 또는 소스코드 내 오류 대처법도 필요하다면 누락 없이 상세히 다뤄줘.

# UI/UX Design System Constraints:
- 심각한 위협 경고, 데이터 손실 가능성, 또는 하드웨어 영구 손상 위험이 동반되는 단계일 경우에만 반드시 "is_warning": true 로 플래그를 처리해.
- 사용자가 CMD/PowerShell 이나 소스코드 창에 직접 복사해서 입력해야 할 명령어/스크립트/코드가 존재할 경우 반드시 "copyable_command" 필드에 해당 텍스트만 깔끔하게 분리해줘. (없으면 빈 문자열 "")
- 각 해결 단계(troubleshooting_steps) 중에서 하드웨어의 물리적 위치(메모리카드, 그래픽카드, CPU, 저장 장치, 케이블 포트 등)나 소프트웨어 조작법(CMD/명령 프롬프트 켜기, BIOS 화면 진입, 레지스트리 편집기 등)이 언급되거나 직접 조작이 수반되는 특정 단계의 경우, 반드시 해당 단계 내부에 "visual_guide"를 개별적으로 정의하여 반환해줘. (여러 단계에 각기 다른 비주얼 가이드가 들어갈 수 있어!)
- 사용자를 낮잡아 보거나 무시하는 뉘앙스를 풍기는 단어(초보자, 초심자, 비전문가, 일반인 등)는 결과 텍스트에 포함하지 말고, 중립적이고 직관적인 전문적 톤앤매너로 서술해줘.

# JSON Structure:
{
  "error_analysis": {
    "code_name": "식별된 에러 명칭 또는 코드 (예: WHEA_UNCORRECTABLE_ERROR)",
    "location_context": "발생 위치 및 맥락 (예: 시스템 메모리/React 컴포넌트 렌더링/커널 하드웨어 수준)",
    "simple_description": "쉬운 비유를 사용한 원인 설명 및 기술적 맥락 요약 (1~2줄)"
  },
  "troubleshooting_steps": [
    {
      "step": 1,
      "level": "기본 해결책",
      "title": "가장 먼저 시도해볼 만한 안전하고 간단한 조치 제목",
      "description": "상세 실행 방법 설명 (사용자가 따라 할 수 있게 구체적인 친절한 설명)",
      "copyable_command": "사용자가 복사해서 실행해야 할 명령어 혹은 코드 (없으면 \\\"\\\")",
      "is_warning": false,
      "visual_guide": {
        "type": "이 단계에 시각 정보가 필요하다면 아래 중 가장 어울리는 타입 문자열 하나 선택 (필요 없다면 \\\"none\\\"): \\\"ram\\\" | \\\"cmd\\\" | \\\"gpu\\\" | \\\"bios\\\" | \\\"cpu\\\" | \\\"drive\\\" | \\\"registry\\\" | \\\"cables\\\" | \\\"none\\\"",
        "target_component": "가이드 대상 하드웨어 부품 또는 프로그램명 (예: 메모리 카드 (RAM) 장착 위치, 명령 프롬프트 (CMD))",
        "description": "이 단계에 필요한 물리적 위치 설명이나 조작 방식 요약 문구 (예: '메인보드의 CPU 쿨러 바로 오른쪽에 있는 길쭉한 막대 모양의 메모리 슬롯을 확인하세요.')"
      }
    }
  ],
  "prevention_tips": [
    "향후 같은 문제가 발생하지 않도록 평소에 관리해야 할 점 팁 1",
    "향후 같은 문제가 발생하지 않도록 평소에 관리해야 할 점 팁 2"
  ]
}`;
};

const TRANSLATIONS = {
  ko: {
    appTitle: "ERROR DECODER",
    appSubtitle: "Multiplatform Intelligence Error Parser",
    history: "기록",
    historyTitle: "최근 디코드 히스토리",
    historyEmpty: "저장된 분석 기록이 없습니다.",
    historyAutoSave: "분석 기록 자동 저장",
    delete: "삭제",
    
    configTitle: "Error Diagnosis Configuration",
    textInputLabel: "로그 내용 또는 에러 메시지 직접 입력",
    textInputPlaceholder: "에러 메시지나 코드를 직접 입력하거나 붙여넣어 주세요. 로그 파일을 드롭존에 올려도 이곳에 자동으로 로드됩니다.",
    clearAll: "전체 초기화",
    largeLogDetected: "대용량 로그 감지",
    logOptionSmart: "에러 핵심 자동 요약 전송 (1차 방안 • 권장)",
    logOptionTail: "로그 마지막 부분만 전송 (2차 방안 • 끝부분 8,000자)",
    logOptionFull: "전체 로그 원본 그대로 전송 (API 제한 발생 가능성 있음)",
    
    fileInputLabel: "에러 화면 업로드 (이미지 또는 로그 파일)",
    fileDropzoneText: "에러 화면을 드래그앤드롭하거나 클릭하여 선택",
    fileDropzoneSub: "(png, jpg, jpeg, txt, log 지원)",
    mobileCamera: "모바일/카메라 촬영",
    cameraShot: "촬영",
    cameraCancel: "취소",
    capturedImage: "캡처된 에러 이미지",
    loadedLog: "로드된 로그 파일",
    remove: "제거",
    
    decodeStart: "에러 디코드 시작 (Decode)",
    decoding: "AI 에러 분석중...",
    unsupportedFile: "지원되지 않는 파일 형식입니다. 이미지(.png, .jpg, .jpeg) 또는 로그(.txt, .log) 파일만 업로드 가능합니다.",
    cameraError: "카메라 작동 오류: 카메라 권한을 허용해 주시거나 다른 브라우저를 이용해 주세요.",
    
    reportTitle: "AI Diagnosis Report",
    waiting: "대기 중",
    waitingDesc: "패널에 에러 텍스트를 입력하거나 에러 캡처본(이미지/로그 파일)을 업로드하여 디코딩을 시작하십시오.",
    progressLabel: "분석 진행도",
    progressDesc: "하드웨어 드라이버, 레지스트리 상태 및 로그 파일의 예외 코드 발생지를 AI 전문가가 역추적하고 있습니다.",
    progressTitle: "AI 에러 정밀 분석 중",
    
    warningsOnly: "위험 조치만",
    allSteps: "전체 보기",
    copyReport: "리포트 복사",
    copied: "복사됨",
    copy: "복사",
    stepsLabel: "해결 조치 가이드 (Troubleshooting Steps)",
    noSteps: "필터에 부합하는 해결 가이드가 없습니다.",
    preventionLabel: "향후 재발 방지를 위한 예방 팁",
    warningStep: "위험 조치",
    
    authModalTitle: "무료 사용량 한도 초과",
    authModalDesc: "15분간 제공되는 5회 무료 분석 제공량을 모두 초과하셨습니다. 무분별한 봇 공격 방지와 서버 과금 안정화를 위해, 지속적인 사용 시 구글 계정 연동 및 가상 소액 결제(1회 100원)가 필요합니다.",
    authModalType: "인증 방식: Google 계정 연동 간편인증",
    authModalPrice: "가상 결제금: 회당 100원 (분석 성공 시에만 과금)",
    authModalGoogleLogin: "G 구글 계정으로 로그인",
    authModalLoginSuccess: "구글 계정 간편 연동 완료 (test-user@gmail.com)",
    authModalPay: "100원 가상 결제하고 한도 풀기",
    authModalPayProcessing: "가상 결제창 처리 중...",
    authModalFooter: "* 가상 결제 버튼을 누르면 실제 비용 청구 없이 임시 해제용 인증 토큰이 발급됩니다.",
    
    sensitiveWarnTitle: "입력하신 로그에 개인정보 또는 시스템 보안 정보가 포함되어 있습니다:",
    sensitiveWarnFooter: "이 데이터는 분석을 위해 외부 AI API(Gemini)로 안전하게 전송됩니다. 전송 전에 민감한 정보를 한 번 더 확인하시거나 마스킹해 주세요.\n\n이대로 분석을 진행하시겠습니까?",
    trySampleTitle: "💡 빠른 예시 테스트 (체험)",
    loadSampleBtn: "⚡ 작성 예시 리포트 바로 보기"
  },
  en: {
    appTitle: "ERROR DECODER",
    appSubtitle: "Multiplatform Intelligence Error Parser",
    history: "History",
    historyTitle: "Recent Decode History",
    historyEmpty: "No saved analysis records found.",
    historyAutoSave: "Auto-Save Analysis Records",
    delete: "Delete",
    
    configTitle: "Error Diagnosis Configuration",
    textInputLabel: "Enter Log Content or Error Message Directly",
    textInputPlaceholder: "Directly enter or paste error messages or codes. Log files dropped in the dropzone will also be loaded automatically here.",
    clearAll: "Clear All",
    largeLogDetected: "Large Log Detected",
    logOptionSmart: "Auto-summarize error core (Option 1 • Recommended)",
    logOptionTail: "Send only the last part (Option 2 • last 8,000 chars)",
    logOptionFull: "Send full raw log as is (may hit API limits)",
    
    fileInputLabel: "Upload Error Screen (Image or Log File)",
    fileDropzoneText: "Drag and drop error screen or click to select",
    fileDropzoneSub: "(png, jpg, jpeg, txt, log supported)",
    mobileCamera: "Mobile/Camera Shot",
    cameraShot: "Capture",
    cameraCancel: "Cancel",
    capturedImage: "Captured Error Image",
    loadedLog: "Loaded Log File",
    remove: "Remove",
    
    decodeStart: "Start Error Decoding (Decode)",
    decoding: "AI Analyzing...",
    unsupportedFile: "Unsupported file format. Only images (.png, .jpg, .jpeg) or logs (.txt, .log) can be uploaded.",
    cameraError: "Camera error: Please grant camera permission or use a different browser.",
    
    reportTitle: "AI Diagnosis Report",
    waiting: "Idle",
    waitingDesc: "Enter error text in the panel or upload an error capture (image/log file) to start decoding.",
    progressLabel: "Analysis Progress",
    progressDesc: "An AI expert is tracing the origin of the exception code in hardware drivers, registry state, and log files.",
    progressTitle: "AI Error Detail Analysis Underway",
    
    warningsOnly: "Warnings Only",
    allSteps: "Show All",
    copyReport: "Copy Report",
    copied: "Copied",
    copy: "Copy",
    stepsLabel: "Troubleshooting Steps",
    noSteps: "No troubleshooting guide fits the filter.",
    preventionLabel: "Prevention Tips to Avoid Recurrence",
    warningStep: "Warning Step",
    
    authModalTitle: "Free Usage Limit Exceeded",
    authModalDesc: "You have exceeded the 5 free analysis queries provided per 15 minutes. To prevent automated bot attacks and stabilize server charges, continuous usage requires Google account integration and a mock payment (100 KRW per query).",
    authModalType: "Auth Type: Google Account Simple Authentication",
    authModalPrice: "Mock Charge: 100 KRW (only charged on success)",
    authModalGoogleLogin: "G Sign in with Google",
    authModalLoginSuccess: "Google Account Integrated (test-user@gmail.com)",
    authModalPay: "Pay 100 KRW and Unlock Limit",
    authModalPayProcessing: "Processing Mock Payment...",
    authModalFooter: "* Clicking the payment button will issue a temporary bypass token without actual charges.",
    
    sensitiveWarnTitle: "The entered log contains personal data or system security info:",
    sensitiveWarnFooter: "This data will be securely sent to the external AI API (Gemini). Please double check or mask sensitive details before sending.\n\nDo you want to proceed with the analysis?",
    trySampleTitle: "💡 Quick Sample Test",
    loadSampleBtn: "⚡ Load Live Sample Report"
  }
};

const getMockSamples = (lang = 'ko') => {
  return [
    {
      id: 1001,
      title: lang === 'en' ? "RAM Contact Error" : "RAM 접촉 불량",
      date: lang === 'en' ? "Example: Memory Card (RAM)" : "예시: 메모리 카드 (RAM)",
      logText: "WHEA_UNCORRECTABLE_ERROR (0x00000124) - Fatal hardware error occurred. Component: Memory Card (RAM) Slot #3. Error Source: Machine Check Exception.",
      result: {
        error_analysis: {
          code_name: "WHEA_UNCORRECTABLE_ERROR (0x00000124)",
          location_context: lang === 'en' ? "System Main Memory (RAM) Slot #3" : "시스템 주 메모리 (RAM) 슬롯 #3",
          simple_description: lang === 'en'
            ? "The RAM module is loose, making it impossible for the CPU to access critical memory data, resulting in a Blue Screen (BSOD)."
            : "작업대(RAM)의 다리가 심하게 헐거워져 컴퓨터 두뇌(CPU)가 데이터를 전달받지 못하고 블루스크린이 발생했습니다."
        },
        troubleshooting_steps: [
          {
            step: 1,
            level: lang === 'en' ? "Basic Fix" : "기본 해결책",
            title: lang === 'en' ? "Reseat and Clean Memory Contacts" : "메모리 카드 분리 및 접촉단자 세척",
            description: lang === 'en'
              ? "Turn off the PC, release the side levers on the RAM slot, pull the RAM out, and clean the gold contacts gently with a clean eraser. Blow away any dust."
              : "본체 양옆 레버를 젖혀 메모리 카드를 분리한 후, 하단 금색 접촉 단자를 깨끗한 지우개로 살짝 밀어 이물질을 닦아내고 먼지를 불어냅니다.",
            copyable_command: "",
            is_warning: false,
            visual_guide: { type: "none" }
          },
          {
            step: 2,
            level: lang === 'en' ? "Physical Hardware Fix" : "물리적 조치",
            title: lang === 'en' ? "Insert Firmly until it Clicks" : "딸깍 소리가 나도록 재장착",
            description: lang === 'en'
              ? "Align the notch on the RAM with the slot, press down vertically and firmly on both ends until the side clips automatically click shut."
              : "가이드 그림과 같이 방향을 맞춰 수직으로 꾹 눌러 양옆 클립이 자동으로 닫힐 때까지 단단히 고정합니다.",
            copyable_command: "",
            is_warning: true,
            visual_guide: {
              type: "ram",
              target_component: lang === 'en' ? "Memory Card (RAM) Installation" : "메모리 카드 (RAM) 장착 위치",
              description: lang === 'en'
                ? "Remove the side panel of the PC case, locate the long slots next to the CPU cooler, and reinstall the memory card."
                : "컴퓨터 본체의 옆면 덮개를 나사를 풀어 연 뒤, 메인보드의 CPU 쿨러 바로 옆에 위치한 길쭉한 막대 모양의 메모리 슬롯을 찾아 재장착해야 합니다."
            }
          }
        ],
        prevention_tips: lang === 'en' ? [
          "Avoid physical impacts or kicking the PC chassis.",
          "Clean interior dust periodically using compressed air to prevent contact resistance."
        ] : [
          "본체를 강하게 흔들거나 발로 차는 충격을 가하지 마세요.",
          "먼지가 많이 쌓이면 접촉 불량이 생기므로 주기적으로 내부 먼지를 에어스프레이로 청소해 주세요."
        ]
      }
    },
    {
      id: 1002,
      title: lang === 'en' ? "CMD SFC Repair" : "CMD 복구 명령어",
      date: lang === 'en' ? "Example: Command Prompt (CMD)" : "예시: 명령 프롬프트 (CMD)",
      logText: "Windows resource protection found corrupt files but was unable to fix some of them. System file corruption detected at C:\\Windows\\System32\\drivers.",
      result: {
        error_analysis: {
          code_name: "SYSTEM_FILE_CORRUPTION",
          location_context: lang === 'en' ? "Windows OS System File Directory" : "Windows OS 시스템 파일 디렉터리",
          simple_description: lang === 'en'
            ? "Some critical Windows system files are damaged or missing, causing unexpected system crashes."
            : "윈도우의 중요한 시스템 파일 일부가 파손되거나 상실되어 예기치 못한 크래시가 유발되었습니다."
        },
        troubleshooting_steps: [
          {
            step: 1,
            level: lang === 'en' ? "OS Recovery Fix" : "OS 복구 해결책",
            title: lang === 'en' ? "Run SFC Recovery Command" : "SFC 복구 명령어 실행",
            description: lang === 'en'
              ? "Copy the recovery command provided below, open Command Prompt as Administrator, paste it, and press Enter to repair corrupt files."
              : "아래 제공된 복구 명령어를 복사하여 관리자 권한으로 실행한 명령 프롬프트 창에 붙여넣고 Enter 키를 눌러 손상된 파일을 복구합니다.",
            copyable_command: "sfc /scannow",
            is_warning: false,
            visual_guide: {
              type: "cmd",
              target_component: lang === 'en' ? "Command Prompt (CMD) Execution" : "명령 프롬프트 (CMD) 실행법",
              description: lang === 'en'
                ? "To run the recovery command, you must launch Windows Command Prompt in Administrator mode."
                : "지시된 시스템 파일 복구 명령어를 실행하기 위해서는 Windows 명령 프롬프트(터미널)를 관리자 모드로 켜서 실행해야 합니다."
            }
          }
        ],
        prevention_tips: lang === 'en' ? [
          "When turning off the PC, shut it down via the Windows Start Menu instead of pressing the power button forcibly."
        ] : [
          "컴퓨터 전원을 끌 때 강제로 파워 버튼을 누르지 말고 윈도우 시작 메뉴를 통해 정상적으로 종료해 주세요."
        ]
      }
    },
    {
      id: 1003,
      title: lang === 'en' ? "Monitor Cable Error" : "화면 케이블 오연결",
      date: lang === 'en' ? "Example: Monitor Cable" : "예시: 화면 연결 (케이블)",
      logText: "NO_DISPLAY_SIGNAL - Display Signal not found on Port HDMI-1. Monitor connected to Integrated Motherboard Port instead of Discrete GPU Port.",
      result: {
        error_analysis: {
          code_name: "NO_DISPLAY_SIGNAL",
          location_context: lang === 'en' ? "External Display Output Connection" : "외부 디스플레이 출력 포트 연결부",
          simple_description: lang === 'en'
            ? "The monitor cable is plugged into the motherboard's integrated graphics port instead of the discrete GPU port, preventing display output."
            : "모니터 신호 케이블이 고성능 그래픽 연산 장치(GPU)가 아닌 메인보드 기본 포트에 잘못 꽂혀 화면이 출력되지 않고 있습니다."
        },
        troubleshooting_steps: [
          {
            step: 1,
            level: lang === 'en' ? "Basic Connection Correction" : "기본 연결 교정",
            title: lang === 'en' ? "Move Cable to the Lower GPU Port" : "케이블 하단 외장 그래픽 포트로 이동 연결",
            description: lang === 'en'
              ? "Unplug the monitor cable (HDMI/DP) from the upper vertical port and reconnect it securely to one of the lower horizontal discrete GPU ports."
              : "본체 상단 세로 방향 포트에 연결된 모니터 케이블(HDMI/DP)을 뽑아서 하단 가로 방향으로 나란히 배치된 외장 그래픽 포트 중 하나에 다시 견고하게 꽂아주세요.",
            copyable_command: "",
            is_warning: false,
            visual_guide: {
              type: "cables",
              target_component: lang === 'en' ? "Monitor Video Cable Connection" : "모니터 화면 케이블 연결 방법",
              description: lang === 'en'
                ? "There are two visual connection zones on the back: the upper motherboard ports and the lower external GPU ports. You must connect it to the lower one."
                : "컴퓨터 뒷면 포트에는 모니터 케이블을 꽂는 곳이 두 군데(상단 메인보드 포트와 하단 외장 그래픽카드 포트)가 있습니다. 반드시 아래쪽 가로 형태 포트에 꽂으셔야 합니다."
            }
          }
        ],
        prevention_tips: lang === 'en' ? [
          "Be mindful of this port arrangement when reconnecting cables after moving or cleaning the PC."
        ] : [
          "이사나 본체 청소 후 케이블을 재연결할 때 이 포트 배치를 반드시 유념해 주세요."
        ]
      }
    },
    {
      id: 1004,
      title: lang === 'en' ? "Registry Power Error" : "레지스트리 드라이버",
      date: lang === 'en' ? "Example: Registry Editor" : "예시: 레지스트리 편집기",
      logText: "DRIVER_POWER_STATE_FAILURE (0x0000009F) - A driver has state transition failure. Power management registry key RegistryValueLimit HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control.",
      result: {
        error_analysis: {
          code_name: "DRIVER_POWER_STATE_FAILURE",
          location_context: "Registry (HKEY_LOCAL_MACHINE)",
          simple_description: "하드웨어 전원 관리 드라이버 세팅 레지스트리 값이 비활성화되어 윈도우 진입 중에 블루스크린이 발생합니다."
        },
        troubleshooting_steps: [
          {
            step: 1,
            level: lang === 'en' ? "Registry Modification" : "레지스트리 수정",
            title: lang === 'en' ? "Change RegistryValueLimit Data Value" : "RegistryValueLimit 데이터 설정값 변경",
            description: lang === 'en'
              ? "Navigate to HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control, double-click 'RegistryValueLimit', and change its value to 1."
              : "가이드에 표시된 경로(HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control)를 찾아 들어간 뒤, 'RegistryValueLimit' 키를 더블클릭해 값 데이터를 1로 변경합니다.",
            copyable_command: "regedit",
            is_warning: true,
            visual_guide: {
              type: "registry",
              target_component: lang === 'en' ? "Registry Editor (regedit) Operation" : "레지스트리 편집기 (regedit) 조작법",
              description: lang === 'en'
                ? "To resolve the power driver issue, launch regedit, navigate the specified path, and modify the target value."
                : "해당 전원 관리 드라이버 문제를 수정하기 위해 윈도우 레지스트리 에디터에서 해당 경로를 따라 진입한 뒤 값을 변경해야 합니다."
            }
          }
        ],
        prevention_tips: lang === 'en' ? [
          "Modifying registry keys incorrectly can cause boot failure. Please edit only the specified path and key carefully."
        ] : [
          "레지스트리는 잘못 수정하면 부팅 불능에 빠질 수 있으므로 반드시 지시된 경로와 값만 신중하게 수정하세요."
        ]
      }
    },
    {
      id: 1005,
      title: lang === 'en' ? "BIOS Secure Boot" : "BIOS 보안 부팅",
      date: lang === 'en' ? "Example: BIOS (UEFI)" : "예시: 바이오스 (BIOS)",
      logText: "SECURE_BOOT_DISABLED - Windows OS loader blocked. UEFI Secure Boot status is disabled. Please enable Secure Boot in BIOS system firmware.",
      result: {
        error_analysis: {
          code_name: "SECURE_BOOT_DISABLED",
          location_context: "UEFI/BIOS 시스템 펌웨어 영역",
          simple_description: lang === 'en'
            ? "Secure Boot is disabled in BIOS, causing the OS loader or certain security-protected applications to be blocked."
            : "윈도우 보안 부팅 기능(Secure Boot)이 꺼져 있어 특정 최신 운영체제 및 보안 애플리케이션 실행이 차단되었습니다."
        },
        troubleshooting_steps: [
          {
            step: 1,
            level: lang === 'en' ? "BIOS Configuration Change" : "BIOS 설정 변경",
            title: lang === 'en' ? "Enable Secure Boot" : "Secure Boot 활성화",
            description: lang === 'en'
              ? "Reboot the PC and repeatedly press Del or F2 to enter BIOS. Go to the Security or Boot tab, set Secure Boot to Enabled, and press F10 to save and exit."
              : "PC를 켜자마자 Del/F2 키를 눌러 BIOS에 진입한 후 Security 또는 Boot 탭에서 Secure Boot 설정을 Enabled로 변경하고 F10을 눌러 저장합니다.",
            copyable_command: "",
            is_warning: true,
            visual_guide: {
              type: "bios",
              target_component: lang === 'en' ? "BIOS Setup Interface Entry" : "BIOS 설정 화면 진입법",
              description: lang === 'en'
                ? "Press the key continuously during boot to enter firmware setup, then enable Secure Boot."
                : "컴퓨터 부팅 순간에 전용 단축키를 눌러 펌웨어 모드로 진입한 뒤 Secure Boot 설정을 켜주어야 합니다."
            }
          }
        ],
        prevention_tips: lang === 'en' ? [
          "Keeping motherboard BIOS updated ensures maximum device security and OS compatibility."
        ] : [
          "메인보드 BIOS 버전을 최신으로 유지하면 보안 장치 호환성이 극대화됩니다."
        ]
      }
    }
  ];
};

window.getSystemInstruction = getSystemInstruction;
window.TRANSLATIONS = TRANSLATIONS;
window.getMockSamples = getMockSamples;


