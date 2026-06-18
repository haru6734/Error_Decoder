/**
 * Compresses large logs based on selected strategy.
 * Includes fallback checks to ensure data size and error keywords are optimized.
 * 
 * @param {string} text - Raw log text
 * @param {string} option - 'smart', 'tail', or 'full'
 * @returns {string} Processed/summarized log text
 */
const smartFilterLog = (text, option = 'smart') => {
  if (!text || text.length <= 10000) {
    return text; // No compression needed for small text
  }

  if (option === 'tail') {
    // 2차 방안: 물리적 슬라이싱 (앞 2000자 + 뒤 8000자)
    const head = text.substring(0, 2000);
    const tail = text.substring(text.length - 8000);
    return `${head}\n\n[... 중간 운영 로그 중략 (물리적 한계 초과로 생략) ...]\n\n${tail}`;
  }

  if (option === 'full') {
    // 3차 방안: 원본 전체 그대로 전송
    return text;
  }

  // 1차 방안: 스마트 키워드 요약
  const lines = text.split('\n');
  
  // 1. Keep first 50 lines (system configuration/startup)
  const headLines = lines.slice(0, 50);
  
  // 2. Keep last 150 lines (last crash state)
  const tailLines = lines.slice(-150);

  // 3. Search middle for key error terms
  const errorKeywords = /error|exception|failed|fatal|critical|severe|warning/i;
  const middleLines = lines.slice(50, -150);
  const matchedSegments = [];
  
  let i = 0;
  while (i < middleLines.length) {
    if (errorKeywords.test(middleLines[i])) {
      const start = Math.max(0, i - 3);
      const end = Math.min(middleLines.length, i + 4);
      const chunk = middleLines.slice(start, end);
      matchedSegments.push(`[라인 번호 ${51 + start}~${51 + end} 주변 에러 발견]\n${chunk.join('\n')}`);
      i = end; // Skip over matched block to prevent duplicates
    } else {
      i++;
    }
  }

  // 1.5차 예외 처리: 키워드가 없어서 추출된 것이 하나도 없으면 자동으로 2차 방안(물리 슬라이싱) 차용
  if (matchedSegments.length === 0) {
    return smartFilterLog(text, 'tail');
  }

  // Re-assemble summarized contents
  let assembled = `[로그 기동 헤더 정보 (상위 50줄)]\n${headLines.join('\n')}\n\n`;
  assembled += `[... 정상 운영 로그 중략 ...]\n\n`;
  assembled += `[로그 본문 중 식별된 에러 의심 영역 (${matchedSegments.length}개 발견)]\n`;
  assembled += matchedSegments.join('\n\n---\n\n') + '\n\n';
  assembled += `[... 정상 운영 로그 중략 ...]\n\n`;
  assembled += `[로그 최종 크래시 의심 영역 (하위 150줄)]\n${tailLines.join('\n')}`;

  // 1.8차 예외 처리: 요약본이 여전히 너무 길면 2차 방안으로 강제 선회
  if (assembled.length > 25000) {
    return smartFilterLog(text, 'tail');
  }

  return assembled;
};

/**
 * Sends error data to the local server backend proxy.
 * Includes local storage paid-token headers.
 */
const analyzeError = async ({ imageFile, logText, logFileName, logOption = 'smart' }) => {
  const parts = [];

  // Apply Smart Log Filtering to logText
  const optimizedLogText = smartFilterLog(logText, logOption);

  // 1. Prepare visual data if present
  if (imageFile) {
    const base64Data = imageFile.split(',')[1];
    const mimeType = imageFile.split(';')[0].split(':')[1];
    parts.push({
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: base64Data
      }
    });
  }

  // 2. Prepare textual log or query
  let queryText = `[에러 분석 요청]\n\n`;
  if (optimizedLogText) {
    queryText += `[로그 내용/텍스트 입력]\n파일 이름: ${logFileName || '텍스트 직접 입력'}\n${optimizedLogText.substring(0, 30000)}\n\n`;
  } else {
    queryText += `[로그 내용/텍스트 입력]\n- 텍스트 분석 내용이 생략되었습니다. 제공된 이미지를 집중적으로 분석해 주세요.\n`;
  }
  queryText += `\n위 에러 데이터를 바탕으로 진단을 진행해주세요.`;
  
  parts.push({ text: queryText });

  // References global function
  const systemInstructionText = getSystemInstruction();

  const requestBody = {
    contents: [{ parts }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2
    },
    systemInstruction: {
      parts: [
        {
          text: systemInstructionText
        }
      ]
    }
  };

  // Build request headers, including billing auth token if present
  const token = localStorage.getItem('err-paid-token') || '';
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Calls our backend proxy endpoint
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Pass custom status code to the client
    if (response.status === 429 && errorData.status === 'REQUIRE_AUTH') {
      const authErr = new Error(errorData.message);
      authErr.status = 'REQUIRE_AUTH';
      throw authErr;
    }
    
    throw new Error(errorData.error?.message || `API 요청 오류 (코드: ${response.status})`);
  }

  const resData = await response.json();
  const rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!rawText) {
    throw new Error('API 응답에서 결과를 찾을 수 없습니다.');
  }

  // Safe parse JSON
  try {
    return JSON.parse(rawText.trim());
  } catch (jsonErr) {
    // Fallback cleanup if model injected markdown format
    const cleanJsonText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJsonText);
  }
};

window.analyzeError = analyzeError;
window.smartFilterLog = smartFilterLog;

/**
 * Detects sensitive information in log text using regular expressions.
 * 
 * @param {string} text - The log text to check
 * @returns {Array} List of detected sensitive items with type and snippet
 */
const detectSensitiveInfo = (text) => {
  if (!text) return [];
  
  const results = [];
  
  // 1. Email Pattern
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = text.match(emailRegex);
  if (emails) {
    const uniqueEmails = [...new Set(emails)];
    uniqueEmails.forEach(email => {
      results.push({ type: '이메일 주소', value: email });
    });
  }
  
  // 2. IP Address Pattern (IPv4)
  const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
  const ips = text.match(ipRegex);
  if (ips) {
    const uniqueIps = [...new Set(ips)];
    uniqueIps.forEach(ip => {
      results.push({ type: 'IP 주소', value: ip });
    });
  }
  
  // 3. API Key & Credentials
  const googleApiKeyRegex = /AIzaSy[A-Za-z0-9_-]{33}/g;
  const googleKeys = text.match(googleApiKeyRegex);
  if (googleKeys) {
    const uniqueKeys = [...new Set(googleKeys)];
    uniqueKeys.forEach(key => {
      results.push({ type: 'Google API Key', value: key.substring(0, 8) + '...' });
    });
  }
  
  const credentialRegex = /(?:key|token|password|secret|passwd|auth)\s*[:=]\s*["']?([a-zA-Z0-9_\-]{8,})["']?/gi;
  let match;
  const rawCreds = [];
  while ((match = credentialRegex.exec(text)) !== null) {
    if (!match[1].startsWith('AIzaSy')) {
      rawCreds.push(match[0]);
    }
  }
  if (rawCreds.length > 0) {
    const uniqueCreds = [...new Set(rawCreds)];
    uniqueCreds.forEach(cred => {
      results.push({ type: '비밀번호/인증 토큰 의심', value: cred.replace(/[:=]\s*["']?.+["']?/, '=: [보안 마스킹]') });
    });
  }

  // 4. Database Connection String URL
  const dbRegex = /(?:mongodb|postgresql|mysql|oracle|mssql|redis):\/\/[^@\s]+:[^@\s]+@[^\s]+/gi;
  const dbs = text.match(dbRegex);
  if (dbs) {
    const uniqueDbs = [...new Set(dbs)];
    uniqueDbs.forEach(db => {
      const masked = db.replace(/:[^@]+@/, ':****@');
      results.push({ type: '데이터베이스 접속 URL', value: masked });
    });
  }

  // 5. File Path (User Directory username leak)
  const winDirRegex = /C:\\Users\\[a-zA-Z0-9_-]+/gi;
  const unixDirRegex = /(?:\/home\/|\/Users\/)[a-zA-Z0-9_-]+/gi;
  const winDirs = text.match(winDirRegex);
  if (winDirs) {
    const uniqueDirs = [...new Set(winDirs)];
    uniqueDirs.forEach(dir => {
      results.push({ type: '시스템 사용자 경로', value: dir });
    });
  }
  const unixDirs = text.match(unixDirRegex);
  if (unixDirs) {
    const uniqueDirs = [...new Set(unixDirs)];
    uniqueDirs.forEach(dir => {
      results.push({ type: '시스템 사용자 경로', value: dir });
    });
  }
  
  return results;
};

window.detectSensitiveInfo = detectSensitiveInfo;

