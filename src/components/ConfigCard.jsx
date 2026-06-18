/**
 * ConfigCard Component handles error classification, log file uploads,
 * camera photos, text manual logs, and triggers analysis.
 */
function ConfigCard({
  imageFile,
  setImageFile,
  logFileName,
  setLogFileName,
  logText,
  setLogText,
  logOption,
  setLogOption,
  isLoading,
  errorStatus,
  setErrorStatus,
  onAnalyze,
  lang,
  onSelectSample
}) {
  const t = window.TRANSLATIONS[lang] || window.TRANSLATIONS.ko;
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || 
           (window.innerWidth <= 768 && navigator.maxTouchPoints > 0);
  });
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Clean up camera stream on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Camera capture handlers
  const startCamera = async (e) => {
    e.stopPropagation();
    setIsCameraActive(true);
    setErrorStatus('');
    try {
      const constraints = {
        video: { facingMode: 'environment' } // prefer rear camera
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      setErrorStatus(t.cameraError);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImageFile(dataUrl);
      stopCamera();
    }
  };

  // Drag & drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const compressImage = (dataUrl, callback) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 1280;
      const MAX_HEIGHT = 1280;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        if (width > height) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        } else {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Export as compressed JPEG
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      callback(compressedDataUrl);
    };
    img.onerror = () => {
      callback(dataUrl);
    };
  };

  const processFile = (file) => {
    setErrorStatus('');
    const fileType = file.type;
    const name = file.name;

    if (fileType.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        compressImage(event.target.result, (compressed) => {
          setImageFile(compressed);
        });
      };
      reader.readAsDataURL(file);
    } else if (name.endsWith('.log') || name.endsWith('.txt') || fileType === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogFileName(name);
        setLogText(event.target.result);
      };
      reader.readAsText(file);
    } else {
      setErrorStatus(t.unsupportedFile);
    }
  };

  const removeFile = (type) => {
    if (type === 'image') {
      setImageFile(null);
    } else {
      setLogFileName('');
      setLogText('');
    }
  };

  const clearAllInputs = () => {
    setImageFile(null);
    setLogFileName('');
    setLogText('');
    setErrorStatus('');
  };

  return (
    <section className="err-card">
      <h2 className="err-section-title">{t.configTitle}</h2>
      
      {/* Manual Textbox (Top) */}
      <div className="err-form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="err-label">{t.textInputLabel}</label>
          {(logText || imageFile) && (
            <button className="btn-minimal" style={{ padding: '0.1rem 0.5rem', fontSize: '0.75rem', border: 'none' }} onClick={clearAllInputs}>{t.clearAll}</button>
          )}
        </div>
        <textarea
          className="err-textarea"
          placeholder={t.textInputPlaceholder}
          value={logText}
          onChange={(e) => setLogText(e.target.value)}
        />

        {/* Quick Sample Test Chips Section */}
        {window.getMockSamples && (
          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span className="err-label" style={{ fontSize: '0.75rem', opacity: 0.85, color: 'var(--text-accent)' }}>
              {t.trySampleTitle}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {window.getMockSamples(lang).map(sample => (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample.id)}
                  disabled={isLoading}
                  style={{
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    fontWeight: 500,
                  }}
                  className="sample-chip-btn"
                  onMouseOver={(e) => { if (!isLoading) e.target.style.borderColor = 'var(--text-accent)'; }}
                  onMouseOut={(e) => { if (!isLoading) e.target.style.borderColor = 'var(--border-color)'; }}
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3차 방안: 대용량 로그 감지 시 요약 가이드 선택 옵션 노출 */}
        {logText && logText.length > 10000 && (
          <div style={{ marginTop: '0.5rem', border: '1px dashed var(--border-color)', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)' }}>
            <span className="err-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-accent)' }}>
              {lang === 'en'
                ? `⚡ Large Log Detected (approx ${(logText.length / 1024).toFixed(1)}KB) - Select Transmission Option`
                : `⚡ 대용량 로그 감지 (약 ${(logText.length / 1024).toFixed(1)}KB) - 전송 옵션 선택 (3차 방안)`
              }
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="log-option" 
                  value="smart" 
                  checked={logOption === 'smart'} 
                  onChange={() => setLogOption('smart')}
                />
                <span>{t.logOptionSmart}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="log-option" 
                  value="tail" 
                  checked={logOption === 'tail'} 
                  onChange={() => setLogOption('tail')}
                />
                <span>{t.logOptionTail}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="log-option" 
                  value="full" 
                  checked={logOption === 'full'} 
                  onChange={() => setLogOption('full')}
                />
                <span>{t.logOptionFull}</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* File Dropzone (Bottom) */}
      <div className="err-form-group">
        <label className="err-label">{t.fileInputLabel}</label>
        
        {!isCameraActive ? (
          <div 
            className={`err-dropzone ${isDragging ? 'dragging' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input 
              type="file" 
              id="file-input" 
              style={{ display: 'none' }} 
              accept="image/*,.txt,.log" 
              onChange={handleFileChange}
            />
            <div className="err-dropzone-icon">📷 📝</div>
            <div className="err-dropzone-text">
              {lang === 'en' ? (
                <>Drag and drop error screen or <strong>click</strong> to select</>
              ) : (
                <>에러 화면을 <strong>드래그앤드롭</strong>하거나 <strong>클릭</strong>하여 선택</>
              )}
              <br />
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{t.fileDropzoneSub}</span>
            </div>
            {isMobile && (
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn-minimal" 
                  onClick={startCamera}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
                >
                  📷 {t.mobileCamera}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="err-camera-view">
            <video ref={videoRef} autoPlay playsInline className="err-video" />
            <div className="err-camera-controls">
              <button className="btn-minimal active" onClick={capturePhoto}>{t.cameraShot}</button>
              <button className="btn-minimal" onClick={stopCamera}>{t.cameraCancel}</button>
            </div>
          </div>
        )}
      </div>

      {/* File Preview */}
      {(imageFile || logFileName) && (
        <div className="err-file-preview">
          {imageFile && (
            <div className="err-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="err-label">📷 {t.capturedImage}</span>
                <button className="btn-minimal" style={{ padding: '0.1rem 0.5rem', fontSize: '0.75rem' }} onClick={() => removeFile('image')}>{t.remove}</button>
              </div>
              <div className="err-image-container">
                <img src={imageFile} alt="Preview" className="err-image-preview" />
              </div>
            </div>
          )}
          {logFileName && (
            <div className="err-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="err-label">📝 {t.loadedLog}: {logFileName}</span>
                <button className="btn-minimal" style={{ padding: '0.1rem 0.5rem', fontSize: '0.75rem' }} onClick={() => removeFile('log')}>{t.remove}</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CTA Trigger */}
      <button 
        className="btn-cta" 
        onClick={onAnalyze} 
        disabled={isLoading || (!imageFile && !logText.trim())}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            <span>{t.decoding}</span>
          </>
        ) : (
          t.decodeStart
        )}
      </button>

      {errorStatus && (
        <div style={{ color: '#D32F2F', fontSize: '0.85rem', lineHeight: '1.4', padding: '0.5rem', border: '1px solid #D32F2F', backgroundColor: 'rgba(211, 47, 47, 0.05)' }}>
          ⚠️ {errorStatus}
        </div>
      )}
    </section>
  );
}

window.ConfigCard = ConfigCard;

