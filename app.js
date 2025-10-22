// 이미지 관리
let images = [];
let imageIdCounter = 0;

// DOM 요소
const imageInput = document.getElementById('imageInput');
const imageList = document.getElementById('imageList');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const previewCanvas = document.getElementById('previewCanvas');
const overlayCanvas = document.getElementById('overlayCanvas');
const canvasContainer = document.getElementById('canvasContainer');
const canvasWidthInput = document.getElementById('canvasWidth');
const canvasHeightInput = document.getElementById('canvasHeight');
const fpsInput = document.getElementById('fps');
const progressSection = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

// 미리보기 컨트롤 요소
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const zoomResetBtn = document.getElementById('zoomResetBtn');
const fitScreenBtn = document.getElementById('fitScreenBtn');
const showGridBtn = document.getElementById('showGridBtn');
const showSafeAreaBtn = document.getElementById('showSafeAreaBtn');

// 공통 설정 DOM 요소
const defaultDurationInput = document.getElementById('defaultDuration');
const defaultWidthInput = document.getElementById('defaultWidth');
const defaultHeightInput = document.getElementById('defaultHeight');
const defaultXInput = document.getElementById('defaultX');
const defaultYInput = document.getElementById('defaultY');
const defaultFitInput = document.getElementById('defaultFit');
const defaultBgColorInput = document.getElementById('defaultBgColor');
const defaultBgEnabledInput = document.getElementById('defaultBgEnabled');
const defaultBorderEnabledInput = document.getElementById('defaultBorderEnabled');
const defaultBorderColorInput = document.getElementById('defaultBorderColor');
const defaultBorderWidthInput = document.getElementById('defaultBorderWidth');
const defaultShadowEnabledInput = document.getElementById('defaultShadowEnabled');
const defaultShadowColorInput = document.getElementById('defaultShadowColor');
const defaultShadowBlurInput = document.getElementById('defaultShadowBlur');
const defaultShadowXInput = document.getElementById('defaultShadowX');
const defaultShadowYInput = document.getElementById('defaultShadowY');
const saveDefaultsBtn = document.getElementById('saveDefaultsBtn');
const applyToAllBtn = document.getElementById('applyToAllBtn');
const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');

// 출력 설정
const resolutionPresets = {
  'mobile': { width: 720, height: 1280, name: '모바일 (세로)' },
  'hd': { width: 1280, height: 720, name: 'HD' },
  'fullhd': { width: 1920, height: 1080, name: 'Full HD' },
  '4k': { width: 3840, height: 2160, name: '4K' },
  'instagram-square': { width: 1080, height: 1080, name: '인스타그램 정사각형' },
  'instagram-story': { width: 1080, height: 1920, name: '인스타그램 스토리' },
  'youtube': { width: 1920, height: 1080, name: 'YouTube' },
  'tiktok': { width: 1080, height: 1920, name: 'TikTok' },
  'custom': { width: 1920, height: 1080, name: '사용자 정의' }
};

const qualityPresets = {
  'low': { bitrate: 2000000, name: '저화질 (2 Mbps)' },
  'medium': { bitrate: 5000000, name: '중간 (5 Mbps)' },
  'high': { bitrate: 10000000, name: '고화질 (10 Mbps)' },
  'ultra': { bitrate: 20000000, name: '최고화질 (20 Mbps)' }
};

const outputConfig = {
  resolution: {
    preset: 'fullhd',
    width: 1920,
    height: 1080,
    lockAspectRatio: true
  },
  quality: {
    preset: 'medium',
    bitrate: 5000000
  },
  fps: 30
};

// 하위 호환성을 위한 getter
let canvasWidth = outputConfig.resolution.width;
let canvasHeight = outputConfig.resolution.height;
let fps = outputConfig.fps;

// 미리보기 줌 상태
let previewZoom = 1.0;
let showGrid = false;
let showSafeArea = false;

// 기본 이미지 설정 (초기값)
const INITIAL_DEFAULTS = {
  duration: 3,
  width: 100,
  height: 100,
  x: 0,
  y: 0,
  fit: 'cover',
  rotation: 0,
  bgColor: '#000000',
  bgEnabled: true,
  borderEnabled: false,
  borderColor: '#ffffff',
  borderWidth: 5,
  shadowEnabled: false,
  shadowColor: '#000000',
  shadowBlur: 10,
  shadowX: 5,
  shadowY: 5,
  filters: {
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    sepia: 0,
    blur: 0,
    hue: 0,
    invert: 0,
    opacity: 100
  }
};

// localStorage에서 기본값 로드
function loadDefaultSettings() {
  const saved = localStorage.getItem('imageDefaultSettings');
  if (saved) {
    try {
      const defaults = JSON.parse(saved);
      defaultDurationInput.value = defaults.duration;
      defaultWidthInput.value = defaults.width;
      defaultHeightInput.value = defaults.height;
      defaultXInput.value = defaults.x;
      defaultYInput.value = defaults.y;
      defaultFitInput.value = defaults.fit;
      defaultBgColorInput.value = defaults.bgColor || INITIAL_DEFAULTS.bgColor;
      defaultBgEnabledInput.checked = defaults.bgEnabled !== undefined ? defaults.bgEnabled : INITIAL_DEFAULTS.bgEnabled;
      defaultBorderEnabledInput.checked = defaults.borderEnabled || INITIAL_DEFAULTS.borderEnabled;
      defaultBorderColorInput.value = defaults.borderColor || INITIAL_DEFAULTS.borderColor;
      defaultBorderWidthInput.value = defaults.borderWidth || INITIAL_DEFAULTS.borderWidth;
      defaultShadowEnabledInput.checked = defaults.shadowEnabled || INITIAL_DEFAULTS.shadowEnabled;
      defaultShadowColorInput.value = defaults.shadowColor || INITIAL_DEFAULTS.shadowColor;
      defaultShadowBlurInput.value = defaults.shadowBlur || INITIAL_DEFAULTS.shadowBlur;
      defaultShadowXInput.value = defaults.shadowX !== undefined ? defaults.shadowX : INITIAL_DEFAULTS.shadowX;
      defaultShadowYInput.value = defaults.shadowY !== undefined ? defaults.shadowY : INITIAL_DEFAULTS.shadowY;
    } catch (e) {
      console.error('기본값 로드 실패:', e);
    }
  }
}

// localStorage에 기본값 저장
function saveDefaultSettings() {
  const defaults = {
    duration: parseFloat(defaultDurationInput.value),
    width: parseFloat(defaultWidthInput.value),
    height: parseFloat(defaultHeightInput.value),
    x: parseFloat(defaultXInput.value),
    y: parseFloat(defaultYInput.value),
    fit: defaultFitInput.value,
    bgColor: defaultBgColorInput.value,
    bgEnabled: defaultBgEnabledInput.checked,
    borderEnabled: defaultBorderEnabledInput.checked,
    borderColor: defaultBorderColorInput.value,
    borderWidth: parseFloat(defaultBorderWidthInput.value),
    shadowEnabled: defaultShadowEnabledInput.checked,
    shadowColor: defaultShadowColorInput.value,
    shadowBlur: parseFloat(defaultShadowBlurInput.value),
    shadowX: parseFloat(defaultShadowXInput.value),
    shadowY: parseFloat(defaultShadowYInput.value)
  };
  localStorage.setItem('imageDefaultSettings', JSON.stringify(defaults));
  alert('기본값이 저장되었습니다!');
}

// 현재 기본값 가져오기
function getDefaultSettings() {
  return {
    duration: parseFloat(defaultDurationInput.value),
    width: parseFloat(defaultWidthInput.value),
    height: parseFloat(defaultHeightInput.value),
    x: parseFloat(defaultXInput.value),
    y: parseFloat(defaultYInput.value),
    fit: defaultFitInput.value,
    bgColor: defaultBgColorInput.value,
    bgEnabled: defaultBgEnabledInput.checked,
    borderEnabled: defaultBorderEnabledInput.checked,
    borderColor: defaultBorderColorInput.value,
    borderWidth: parseFloat(defaultBorderWidthInput.value),
    shadowEnabled: defaultShadowEnabledInput.checked,
    shadowColor: defaultShadowColorInput.value,
    shadowBlur: parseFloat(defaultShadowBlurInput.value),
    shadowX: parseFloat(defaultShadowXInput.value),
    shadowY: parseFloat(defaultShadowYInput.value)
  };
}

// 기본값 초기화
function resetDefaultSettings() {
  if (confirm('기본값을 초기값으로 복원하시겠습니까?')) {
    defaultDurationInput.value = INITIAL_DEFAULTS.duration;
    defaultWidthInput.value = INITIAL_DEFAULTS.width;
    defaultHeightInput.value = INITIAL_DEFAULTS.height;
    defaultXInput.value = INITIAL_DEFAULTS.x;
    defaultYInput.value = INITIAL_DEFAULTS.y;
    defaultFitInput.value = INITIAL_DEFAULTS.fit;
    defaultBgColorInput.value = INITIAL_DEFAULTS.bgColor;
    defaultBgEnabledInput.checked = INITIAL_DEFAULTS.bgEnabled;
    defaultBorderEnabledInput.checked = INITIAL_DEFAULTS.borderEnabled;
    defaultBorderColorInput.value = INITIAL_DEFAULTS.borderColor;
    defaultBorderWidthInput.value = INITIAL_DEFAULTS.borderWidth;
    defaultShadowEnabledInput.checked = INITIAL_DEFAULTS.shadowEnabled;
    defaultShadowColorInput.value = INITIAL_DEFAULTS.shadowColor;
    defaultShadowBlurInput.value = INITIAL_DEFAULTS.shadowBlur;
    defaultShadowXInput.value = INITIAL_DEFAULTS.shadowX;
    defaultShadowYInput.value = INITIAL_DEFAULTS.shadowY;
    localStorage.removeItem('imageDefaultSettings');
    alert('기본값이 초기값으로 복원되었습니다!');
  }
}

// 모든 이미지에 기본값 적용
function applyDefaultsToAll() {
  if (images.length === 0) return;
  if (confirm(`모든 이미지(${images.length}개)에 현재 기본값을 적용하시겠습니까?`)) {
    const defaults = getDefaultSettings();
    images.forEach(img => {
      img.duration = defaults.duration;
      img.width = defaults.width;
      img.height = defaults.height;
      img.x = defaults.x;
      img.y = defaults.y;
      img.fit = defaults.fit;
      img.bgColor = defaults.bgColor;
      img.bgEnabled = defaults.bgEnabled;
      img.borderEnabled = defaults.borderEnabled;
      img.borderColor = defaults.borderColor;
      img.borderWidth = defaults.borderWidth;
      img.shadowEnabled = defaults.shadowEnabled;
      img.shadowColor = defaults.shadowColor;
      img.shadowBlur = defaults.shadowBlur;
      img.shadowX = defaults.shadowX;
      img.shadowY = defaults.shadowY;
    });
    renderImageList();
    updatePreview();
    alert('모든 이미지에 기본값이 적용되었습니다!');
  }
}

// 캔버스 초기화
function initCanvas() {
  previewCanvas.width = canvasWidth;
  previewCanvas.height = canvasHeight;
  overlayCanvas.width = canvasWidth;
  overlayCanvas.height = canvasHeight;

  const ctx = previewCanvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  applyPreviewZoom();
  updateOverlay();
}

// 줌 적용
function applyPreviewZoom() {
  const displayWidth = canvasWidth * previewZoom;
  const displayHeight = canvasHeight * previewZoom;

  previewCanvas.style.width = `${displayWidth}px`;
  previewCanvas.style.height = `${displayHeight}px`;
  overlayCanvas.style.width = `${displayWidth}px`;
  overlayCanvas.style.height = `${displayHeight}px`;

  zoomResetBtn.textContent = `${Math.round(previewZoom * 100)}%`;
}

// 줌 인
function zoomIn() {
  previewZoom = Math.min(previewZoom + 0.25, 3.0);
  applyPreviewZoom();
}

// 줌 아웃
function zoomOut() {
  previewZoom = Math.max(previewZoom - 0.25, 0.25);
  applyPreviewZoom();
}

// 줌 리셋
function zoomReset() {
  previewZoom = 1.0;
  applyPreviewZoom();
}

// 화면에 맞춤
function fitToScreen() {
  const containerWidth = canvasContainer.parentElement.clientWidth - 40; // padding 고려
  const containerHeight = window.innerHeight * 0.6; // 화면의 60% 높이

  const widthRatio = containerWidth / canvasWidth;
  const heightRatio = containerHeight / canvasHeight;

  previewZoom = Math.min(widthRatio, heightRatio, 1.0); // 최대 100%
  applyPreviewZoom();
}

// 오버레이 업데이트
function updateOverlay() {
  const ctx = overlayCanvas.getContext('2d');
  ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  // 그리드 그리기
  if (showGrid) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;

    const gridSize = 50; // 50px 간격

    // 세로선
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }

    // 가로선
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    // 중앙선 강조
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
    ctx.lineWidth = 2;

    // 세로 중앙선
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.stroke();

    // 가로 중앙선
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight / 2);
    ctx.lineTo(canvasWidth, canvasHeight / 2);
    ctx.stroke();
  }

  // 안전 영역 그리기 (10% 마진)
  if (showSafeArea) {
    const marginX = canvasWidth * 0.1;
    const marginY = canvasHeight * 0.1;
    const safeWidth = canvasWidth * 0.8;
    const safeHeight = canvasHeight * 0.8;

    ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(marginX, marginY, safeWidth, safeHeight);
    ctx.setLineDash([]);

    // 안전 영역 라벨
    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.font = '14px sans-serif';
    ctx.fillText('안전 영역 (90%)', marginX + 10, marginY + 20);
  }
}

// 출력 설정 관련 함수
function updateOutputConfig() {
  canvasWidth = outputConfig.resolution.width;
  canvasHeight = outputConfig.resolution.height;
  fps = outputConfig.fps;

  initCanvas();
  updateOutputInfo();
  updatePreview();
}

function updateOutputInfo() {
  const { width, height } = outputConfig.resolution;
  const totalDuration = images.reduce((sum, img) => sum + img.duration, 0);
  const bitrate = outputConfig.quality.bitrate;
  const estimatedSize = (bitrate * totalDuration / 8 / 1024 / 1024).toFixed(2);

  // 종횡비 계산 (최대공약수)
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  const aspectRatio = `${width/divisor}:${height/divisor}`;

  document.getElementById('outputSizeDisplay').textContent = `${width} × ${height} px`;
  document.getElementById('aspectRatioDisplay').textContent = aspectRatio;
  document.getElementById('totalDurationDisplay').textContent = `${totalDuration.toFixed(1)}초`;
  document.getElementById('estimatedSizeDisplay').textContent = `${estimatedSize} MB`;
}

// 해상도 프리셋 변경
document.getElementById('resolutionPreset').addEventListener('change', (e) => {
  const preset = e.target.value;
  outputConfig.resolution.preset = preset;

  if (preset === 'custom') {
    document.getElementById('customResolutionInputs').style.display = 'flex';
  } else {
    document.getElementById('customResolutionInputs').style.display = 'none';
    const config = resolutionPresets[preset];
    outputConfig.resolution.width = config.width;
    outputConfig.resolution.height = config.height;
    updateOutputConfig();
  }
});

// 커스텀 너비 변경
document.getElementById('customWidth').addEventListener('change', (e) => {
  const newWidth = parseInt(e.target.value);

  if (outputConfig.resolution.lockAspectRatio) {
    const aspectRatio = outputConfig.resolution.width / outputConfig.resolution.height;
    outputConfig.resolution.width = newWidth;
    outputConfig.resolution.height = Math.round(newWidth / aspectRatio);
    document.getElementById('customHeight').value = outputConfig.resolution.height;
  } else {
    outputConfig.resolution.width = newWidth;
  }

  updateOutputConfig();
});

// 커스텀 높이 변경
document.getElementById('customHeight').addEventListener('change', (e) => {
  const newHeight = parseInt(e.target.value);

  if (outputConfig.resolution.lockAspectRatio) {
    const aspectRatio = outputConfig.resolution.width / outputConfig.resolution.height;
    outputConfig.resolution.height = newHeight;
    outputConfig.resolution.width = Math.round(newHeight * aspectRatio);
    document.getElementById('customWidth').value = outputConfig.resolution.width;
  } else {
    outputConfig.resolution.height = newHeight;
  }

  updateOutputConfig();
});

// 가로/세로 전환
document.getElementById('swapDimensions').addEventListener('click', () => {
  const temp = outputConfig.resolution.width;
  outputConfig.resolution.width = outputConfig.resolution.height;
  outputConfig.resolution.height = temp;

  document.getElementById('customWidth').value = outputConfig.resolution.width;
  document.getElementById('customHeight').value = outputConfig.resolution.height;

  updateOutputConfig();
});

// 비율 고정 토글
document.getElementById('lockAspectRatio').addEventListener('change', (e) => {
  outputConfig.resolution.lockAspectRatio = e.target.checked;
});

// 품질 변경
document.getElementById('qualityPreset').addEventListener('change', (e) => {
  const preset = e.target.value;
  outputConfig.quality.preset = preset;
  outputConfig.quality.bitrate = qualityPresets[preset].bitrate;
  updateOutputInfo();
});

// FPS 변경
document.getElementById('fps').addEventListener('change', (e) => {
  outputConfig.fps = parseInt(e.target.value);
  fps = outputConfig.fps;
  updateOutputInfo();
});

// 미리보기 컨트롤 이벤트 리스너
zoomInBtn.addEventListener('click', zoomIn);
zoomOutBtn.addEventListener('click', zoomOut);
zoomResetBtn.addEventListener('click', zoomReset);
fitScreenBtn.addEventListener('click', fitToScreen);

showGridBtn.addEventListener('change', (e) => {
  showGrid = e.target.checked;
  updateOverlay();
});

showSafeAreaBtn.addEventListener('change', (e) => {
  showSafeArea = e.target.checked;
  updateOverlay();
});

// 초기화
loadDefaultSettings();
initCanvas();
updateOutputInfo();

// 이미지 업로드
imageInput.addEventListener('change', (e) => {
  const files = e.target.files;
  for (let file of files) {
    loadImage(file);
  }
  e.target.value = ''; // 같은 파일 재선택 가능하도록
});

// 이미지 로드
function loadImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const defaults = getDefaultSettings();
      const imageData = {
        id: imageIdCounter++,
        src: e.target.result,
        img: img,
        duration: defaults.duration,
        width: defaults.width,
        height: defaults.height,
        x: defaults.x,
        y: defaults.y,
        fit: defaults.fit,
        rotation: 0,
        bgColor: defaults.bgColor,
        bgEnabled: defaults.bgEnabled,
        borderEnabled: defaults.borderEnabled,
        borderColor: defaults.borderColor,
        borderWidth: defaults.borderWidth,
        shadowEnabled: defaults.shadowEnabled,
        shadowColor: defaults.shadowColor,
        shadowBlur: defaults.shadowBlur,
        shadowX: defaults.shadowX,
        shadowY: defaults.shadowY,
        filters: defaults.filters ? { ...defaults.filters } : { ...INITIAL_DEFAULTS.filters }
      };
      images.push(imageData);
      renderImageList();
      updateGenerateButton();
      updateApplyToAllButton();
      updateOutputInfo();
      updatePreview();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// 이미지 리스트 렌더링
function renderImageList() {
  imageList.innerHTML = '';
  images.forEach((imageData, index) => {
    const item = document.createElement('div');
    item.className = 'image-item';
    item.innerHTML = `
      <img src="${imageData.src}" class="image-preview" alt="이미지 ${index + 1}">
      <div class="image-controls">
        <div class="control-group">
          <label>재생 시간 (초)</label>
          <input type="number" class="duration-input" value="${imageData.duration}" min="0.1" step="0.1" data-id="${imageData.id}">
        </div>
        <div class="control-group">
          <label>너비 (%)</label>
          <input type="number" class="width-input" value="${imageData.width}" min="1" max="200" data-id="${imageData.id}">
        </div>
        <div class="control-group">
          <label>높이 (%)</label>
          <input type="number" class="height-input" value="${imageData.height}" min="1" max="200" data-id="${imageData.id}">
        </div>
        <div class="control-group">
          <label>X 위치 (%)</label>
          <input type="number" class="x-input" value="${imageData.x}" min="-100" max="100" data-id="${imageData.id}">
        </div>
        <div class="control-group">
          <label>Y 위치 (%)</label>
          <input type="number" class="y-input" value="${imageData.y}" min="-100" max="100" data-id="${imageData.id}">
        </div>
        <div class="control-group">
          <label>맞춤 방식</label>
          <select class="fit-input" data-id="${imageData.id}">
            <option value="cover" ${imageData.fit === 'cover' ? 'selected' : ''}>채우기 (Cover)</option>
            <option value="contain" ${imageData.fit === 'contain' ? 'selected' : ''}>맞추기 (Contain)</option>
            <option value="fill" ${imageData.fit === 'fill' ? 'selected' : ''}>늘리기 (Fill)</option>
          </select>
        </div>
        <div class="control-group rotation-controls">
          <label>회전</label>
          <div class="rotation-buttons">
            <button type="button" class="rotate-btn ${imageData.rotation === 0 ? 'active' : ''}" data-id="${imageData.id}" data-angle="0" title="0°">↑</button>
            <button type="button" class="rotate-btn ${imageData.rotation === 90 ? 'active' : ''}" data-id="${imageData.id}" data-angle="90" title="90°">→</button>
            <button type="button" class="rotate-btn ${imageData.rotation === 180 ? 'active' : ''}" data-id="${imageData.id}" data-angle="180" title="180°">↓</button>
            <button type="button" class="rotate-btn ${imageData.rotation === 270 ? 'active' : ''}" data-id="${imageData.id}" data-angle="270" title="270°">←</button>
          </div>
        </div>
        <div class="control-group">
          <label>배경색</label>
          <input type="color" class="bg-color-input" value="${imageData.bgColor}" data-id="${imageData.id}">
          <label class="inline-checkbox"><input type="checkbox" class="bg-enabled-input" ${imageData.bgEnabled ? 'checked' : ''} data-id="${imageData.id}"> 사용</label>
        </div>
        <div class="control-group">
          <label class="inline-checkbox"><input type="checkbox" class="border-enabled-input" ${imageData.borderEnabled ? 'checked' : ''} data-id="${imageData.id}"> 테두리</label>
          <input type="color" class="border-color-input" value="${imageData.borderColor}" data-id="${imageData.id}">
          <input type="number" class="border-width-input" value="${imageData.borderWidth}" min="1" max="50" data-id="${imageData.id}" placeholder="두께">
        </div>
        <div class="control-group">
          <label class="inline-checkbox"><input type="checkbox" class="shadow-enabled-input" ${imageData.shadowEnabled ? 'checked' : ''} data-id="${imageData.id}"> 그림자</label>
          <input type="color" class="shadow-color-input" value="${imageData.shadowColor}" data-id="${imageData.id}">
          <input type="number" class="shadow-blur-input" value="${imageData.shadowBlur}" min="0" max="100" data-id="${imageData.id}" placeholder="블러">
        </div>
      </div>
      <div class="filter-controls">
        <h4 class="filter-title">🎨 필터 효과</h4>
        <div class="filter-grid">
          <div class="filter-item">
            <label>밝기: <span class="filter-value">${imageData.filters?.brightness || 100}%</span></label>
            <input type="range" class="filter-brightness" value="${imageData.filters?.brightness || 100}" min="0" max="200" data-id="${imageData.id}">
          </div>
          <div class="filter-item">
            <label>대비: <span class="filter-value">${imageData.filters?.contrast || 100}%</span></label>
            <input type="range" class="filter-contrast" value="${imageData.filters?.contrast || 100}" min="0" max="200" data-id="${imageData.id}">
          </div>
          <div class="filter-item">
            <label>채도: <span class="filter-value">${imageData.filters?.saturate || 100}%</span></label>
            <input type="range" class="filter-saturate" value="${imageData.filters?.saturate || 100}" min="0" max="200" data-id="${imageData.id}">
          </div>
          <div class="filter-item">
            <label>흑백: <span class="filter-value">${imageData.filters?.grayscale || 0}%</span></label>
            <input type="range" class="filter-grayscale" value="${imageData.filters?.grayscale || 0}" min="0" max="100" data-id="${imageData.id}">
          </div>
          <div class="filter-item">
            <label>세피아: <span class="filter-value">${imageData.filters?.sepia || 0}%</span></label>
            <input type="range" class="filter-sepia" value="${imageData.filters?.sepia || 0}" min="0" max="100" data-id="${imageData.id}">
          </div>
          <div class="filter-item">
            <label>블러: <span class="filter-value">${imageData.filters?.blur || 0}px</span></label>
            <input type="range" class="filter-blur" value="${imageData.filters?.blur || 0}" min="0" max="20" data-id="${imageData.id}">
          </div>
          <div class="filter-item">
            <label>색조: <span class="filter-value">${imageData.filters?.hue || 0}°</span></label>
            <input type="range" class="filter-hue" value="${imageData.filters?.hue || 0}" min="0" max="360" data-id="${imageData.id}">
          </div>
          <div class="filter-item">
            <label>반전: <span class="filter-value">${imageData.filters?.invert || 0}%</span></label>
            <input type="range" class="filter-invert" value="${imageData.filters?.invert || 0}" min="0" max="100" data-id="${imageData.id}">
          </div>
          <div class="filter-item">
            <label>불투명도: <span class="filter-value">${imageData.filters?.opacity || 100}%</span></label>
            <input type="range" class="filter-opacity" value="${imageData.filters?.opacity || 100}" min="0" max="100" data-id="${imageData.id}">
          </div>
        </div>
        <button class="reset-filters-btn" data-id="${imageData.id}" type="button">🔄 필터 초기화</button>
      </div>
      <div class="image-actions">
        <button class="move-up-btn" data-id="${imageData.id}" type="button" ${index === 0 ? 'disabled' : ''}>⬆️ 위로</button>
        <button class="move-down-btn" data-id="${imageData.id}" type="button" ${index === images.length - 1 ? 'disabled' : ''}>⬇️ 아래로</button>
        <button class="duplicate-btn" data-id="${imageData.id}" type="button">📋 복제</button>
        <button class="remove-btn" data-id="${imageData.id}" type="button">🗑️ 삭제</button>
      </div>
    `;
    imageList.appendChild(item);
  });

  // 이벤트 리스너 추가
  document.querySelectorAll('.duration-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = parseInt(e.target.dataset.id);
      const img = images.find(i => i.id === id);
      if (img) img.duration = parseFloat(e.target.value);
    });
  });

  document.querySelectorAll('.width-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const id = parseInt(e.target.dataset.id);
      const img = images.find(i => i.id === id);
      if (img) {
        img.width = parseFloat(e.target.value);
        updatePreview();
      }
    });
  });

  document.querySelectorAll('.height-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const id = parseInt(e.target.dataset.id);
      const img = images.find(i => i.id === id);
      if (img) {
        img.height = parseFloat(e.target.value);
        updatePreview();
      }
    });
  });

  document.querySelectorAll('.x-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const id = parseInt(e.target.dataset.id);
      const img = images.find(i => i.id === id);
      if (img) {
        img.x = parseFloat(e.target.value);
        updatePreview();
      }
    });
  });

  document.querySelectorAll('.y-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const id = parseInt(e.target.dataset.id);
      const img = images.find(i => i.id === id);
      if (img) {
        img.y = parseFloat(e.target.value);
        updatePreview();
      }
    });
  });

  document.querySelectorAll('.fit-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = parseInt(e.target.dataset.id);
      const img = images.find(i => i.id === id);
      if (img) {
        img.fit = e.target.value;
        updatePreview();
      }
    });
  });

  // 시각 효과 이벤트 리스너
  document.querySelectorAll('.bg-color-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const id = parseInt(e.target.dataset.id);
      const img = images.find(i => i.id === id);
      if (img) {
        img.bgColor = e.target.value;
        updatePreview();
      }
    });
  });

  document.querySelectorAll('.bg-enabled-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = parseInt(e.target.dataset.id);
      const img = images.find(i => i.id === id);
      if (img) {
        img.bgEnabled = e.target.checked;
        updatePreview();
      }
    });
  });

  document.querySelectorAll('.border-enabled-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = parseInt(e.target.dataset.id);
      const img = images.find(i => i.id === id);
      if (img) {
        img.borderEnabled = e.target.checked;
        updatePreview();
      }
    });
  });

  document.querySelectorAll('.border-color-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const id = parseInt(e.target.dataset.id);
      const img = images.find(i => i.id === id);
      if (img) {
        img.borderColor = e.target.value;
        updatePreview();
      }
    });
  });

  document.querySelectorAll('.border-width-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const id = parseInt(e.target.dataset.id);
      const img = images.find(i => i.id === id);
      if (img) {
        img.borderWidth = parseFloat(e.target.value);
        updatePreview();
      }
    });
  });

  document.querySelectorAll('.shadow-enabled-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = parseInt(e.target.dataset.id);
      const img = images.find(i => i.id === id);
      if (img) {
        img.shadowEnabled = e.target.checked;
        updatePreview();
      }
    });
  });

  document.querySelectorAll('.shadow-color-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const id = parseInt(e.target.dataset.id);
      const img = images.find(i => i.id === id);
      if (img) {
        img.shadowColor = e.target.value;
        updatePreview();
      }
    });
  });

  document.querySelectorAll('.shadow-blur-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const id = parseInt(e.target.dataset.id);
      const img = images.find(i => i.id === id);
      if (img) {
        img.shadowBlur = parseFloat(e.target.value);
        updatePreview();
      }
    });
  });

  // 필터 이벤트 리스너
  const filterInputs = [
    { class: '.filter-brightness', prop: 'brightness', suffix: '%' },
    { class: '.filter-contrast', prop: 'contrast', suffix: '%' },
    { class: '.filter-saturate', prop: 'saturate', suffix: '%' },
    { class: '.filter-grayscale', prop: 'grayscale', suffix: '%' },
    { class: '.filter-sepia', prop: 'sepia', suffix: '%' },
    { class: '.filter-blur', prop: 'blur', suffix: 'px' },
    { class: '.filter-hue', prop: 'hue', suffix: '°' },
    { class: '.filter-invert', prop: 'invert', suffix: '%' },
    { class: '.filter-opacity', prop: 'opacity', suffix: '%' }
  ];

  filterInputs.forEach(({ class: className, prop, suffix }) => {
    document.querySelectorAll(className).forEach(input => {
      input.addEventListener('input', (e) => {
        const id = parseInt(e.target.dataset.id);
        const img = images.find(i => i.id === id);
        if (img) {
          if (!img.filters) img.filters = { ...INITIAL_DEFAULTS.filters };
          img.filters[prop] = parseFloat(e.target.value);

          // 값 표시 업데이트
          const valueSpan = e.target.previousElementSibling.querySelector('.filter-value');
          if (valueSpan) {
            valueSpan.textContent = `${img.filters[prop]}${suffix}`;
          }

          updatePreview();
        }
      });
    });
  });

  // 필터 초기화 버튼
  document.querySelectorAll('.reset-filters-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      const img = images.find(i => i.id === id);
      if (img && confirm('이 이미지의 모든 필터를 초기화하시겠습니까?')) {
        img.filters = { ...INITIAL_DEFAULTS.filters };
        renderImageList();
        updatePreview();
      }
    });
  });

  // 회전 버튼
  document.querySelectorAll('.rotate-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      const angle = parseInt(e.target.dataset.angle);
      const img = images.find(i => i.id === id);
      if (img) {
        img.rotation = angle;
        renderImageList();
        updatePreview();
      }
    });
  });

  // 이동 버튼
  document.querySelectorAll('.move-up-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      moveImageUp(id);
    });
  });

  document.querySelectorAll('.move-down-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      moveImageDown(id);
    });
  });

  // 복제 버튼
  document.querySelectorAll('.duplicate-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      duplicateImage(id);
    });
  });

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      images = images.filter(i => i.id !== id);
      renderImageList();
      updateGenerateButton();
      updateApplyToAllButton();
      updateOutputInfo();
      updatePreview();
    });
  });
}

// 미리보기 업데이트
function updatePreview() {
  if (images.length === 0) {
    initCanvas();
    return;
  }

  const ctx = previewCanvas.getContext('2d');
  const firstImage = images[0];

  // 배경을 검은색으로
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 첫 번째 이미지 그리기
  drawImage(ctx, firstImage);
}

// 이미지 그리기 함수
function drawImage(ctx, imageData) {
  const { img, width, height, x, y, fit, rotation, bgColor, bgEnabled, borderEnabled, borderColor, borderWidth, shadowEnabled, shadowColor, shadowBlur, shadowX, shadowY, filters } = imageData;

  // 캔버스 크기에 대한 퍼센트 계산
  const targetWidth = (canvasWidth * width) / 100;
  const targetHeight = (canvasHeight * height) / 100;
  const offsetX = (canvasWidth * x) / 100;
  const offsetY = (canvasHeight * y) / 100;

  let drawWidth, drawHeight, drawX, drawY;

  if (fit === 'fill') {
    // 늘리기: 지정된 크기에 맞춰 늘림
    drawWidth = targetWidth;
    drawHeight = targetHeight;
    drawX = offsetX;
    drawY = offsetY;
  } else if (fit === 'contain') {
    // 맞추기: 비율 유지하면서 영역 안에 맞춤
    const imgRatio = img.width / img.height;
    const targetRatio = targetWidth / targetHeight;

    if (imgRatio > targetRatio) {
      drawWidth = targetWidth;
      drawHeight = targetWidth / imgRatio;
    } else {
      drawHeight = targetHeight;
      drawWidth = targetHeight * imgRatio;
    }

    drawX = offsetX + (targetWidth - drawWidth) / 2;
    drawY = offsetY + (targetHeight - drawHeight) / 2;
  } else { // cover
    // 채우기: 비율 유지하면서 영역을 채움
    const imgRatio = img.width / img.height;
    const targetRatio = targetWidth / targetHeight;

    if (imgRatio > targetRatio) {
      drawHeight = targetHeight;
      drawWidth = targetHeight * imgRatio;
    } else {
      drawWidth = targetWidth;
      drawHeight = targetWidth / imgRatio;
    }

    drawX = offsetX + (targetWidth - drawWidth) / 2;
    drawY = offsetY + (targetHeight - drawHeight) / 2;
  }

  // 회전 적용
  ctx.save();

  if (rotation && rotation !== 0) {
    const centerX = drawX + drawWidth / 2;
    const centerY = drawY + drawHeight / 2;

    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
  }

  // 그림자 설정
  if (shadowEnabled) {
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetX = shadowX;
    ctx.shadowOffsetY = shadowY;
  }

  // 배경색 그리기
  if (bgEnabled && bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(drawX, drawY, drawWidth, drawHeight);
  }

  // 필터 적용
  if (filters) {
    const filterString = [
      `brightness(${filters.brightness || 100}%)`,
      `contrast(${filters.contrast || 100}%)`,
      `saturate(${filters.saturate || 100}%)`,
      `grayscale(${filters.grayscale || 0}%)`,
      `sepia(${filters.sepia || 0}%)`,
      `blur(${filters.blur || 0}px)`,
      `hue-rotate(${filters.hue || 0}deg)`,
      `invert(${filters.invert || 0}%)`,
      `opacity(${filters.opacity || 100}%)`
    ].join(' ');
    ctx.filter = filterString;
  }

  // 이미지 그리기
  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

  // 필터 리셋
  ctx.filter = 'none';

  // 그림자 리셋
  if (shadowEnabled) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  // 테두리 그리기
  if (borderEnabled && borderWidth > 0) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(drawX, drawY, drawWidth, drawHeight);
  }

  ctx.restore();
}

// 이미지 위로 이동
function moveImageUp(imageId) {
  const index = images.findIndex(img => img.id === imageId);
  if (index <= 0) return; // 이미 맨 위거나 찾을 수 없음

  // 배열에서 위치 교환
  [images[index - 1], images[index]] = [images[index], images[index - 1]];

  renderImageList();
  updatePreview();
}

// 이미지 아래로 이동
function moveImageDown(imageId) {
  const index = images.findIndex(img => img.id === imageId);
  if (index < 0 || index >= images.length - 1) return; // 이미 맨 아래거나 찾을 수 없음

  // 배열에서 위치 교환
  [images[index], images[index + 1]] = [images[index + 1], images[index]];

  renderImageList();
  updatePreview();
}

// 이미지 복제
function duplicateImage(imageId) {
  const original = images.find(img => img.id === imageId);
  if (!original) return;

  // 깊은 복사
  const duplicate = {
    ...original,
    id: imageIdCounter++,
    src: original.src,
    img: original.img,
    // 객체들도 복사
    filters: original.filters ? { ...original.filters } : undefined,
    text: original.text ? { ...original.text } : undefined,
    animation: original.animation ? { ...original.animation } : undefined,
    transition: original.transition ? { ...original.transition } : undefined
  };

  // 원본 다음에 삽입
  const originalIndex = images.indexOf(original);
  images.splice(originalIndex + 1, 0, duplicate);

  renderImageList();
  updateApplyToAllButton();
  updateOutputInfo();
  alert('이미지가 복제되었습니다!');
}

// 생성 버튼 상태 업데이트
function updateGenerateButton() {
  generateBtn.disabled = images.length === 0;
}

// "모든 이미지에 적용" 버튼 상태 업데이트
function updateApplyToAllButton() {
  applyToAllBtn.disabled = images.length === 0;
}

// 모두 지우기
clearBtn.addEventListener('click', () => {
  if (images.length === 0) return;
  if (confirm('모든 이미지를 삭제하시겠습니까?')) {
    images = [];
    renderImageList();
    updateGenerateButton();
    updateApplyToAllButton();
    updateOutputInfo();
    initCanvas();
  }
});

// 공통 설정 버튼 이벤트
saveDefaultsBtn.addEventListener('click', saveDefaultSettings);
applyToAllBtn.addEventListener('click', applyDefaultsToAll);
resetDefaultsBtn.addEventListener('click', resetDefaultSettings);

// 영상 생성 관련 변수
let isGenerating = false;
let generationCancelled = false;

// 영상 생성
generateBtn.addEventListener('click', async () => {
  if (images.length === 0) return;

  isGenerating = true;
  generationCancelled = false;

  progressSection.style.display = 'block';
  generateBtn.style.display = 'none';
  document.getElementById('cancelGenerationBtn').style.display = 'inline-block';
  progressBar.style.width = '0%';
  progressText.textContent = '영상 생성 준비 중...';

  try {
    await generateVideo();
  } catch (error) {
    console.error('영상 생성 실패:', error);
    alert('영상 생성에 실패했습니다: ' + error.message);
  } finally {
    isGenerating = false;
    generateBtn.style.display = 'inline-block';
    document.getElementById('cancelGenerationBtn').style.display = 'none';

    if (!generationCancelled) {
      setTimeout(() => {
        progressSection.style.display = 'none';
      }, 2000);
    }
  }
});

// 영상 생성 취소
document.getElementById('cancelGenerationBtn').addEventListener('click', () => {
  if (confirm('영상 생성을 취소하시겠습니까?')) {
    generationCancelled = true;
    progressText.textContent = '취소 중...';
  }
});

// 영상 생성 함수
async function generateVideo() {
  const canvas = document.createElement('canvas');
  canvas.width = outputConfig.resolution.width;
  canvas.height = outputConfig.resolution.height;
  const ctx = canvas.getContext('2d');

  // MediaRecorder 설정
  const stream = canvas.captureStream(outputConfig.fps);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: outputConfig.quality.bitrate
  });

  const chunks = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  mediaRecorder.onstop = () => {
    if (generationCancelled) {
      progressText.textContent = '영상 생성이 취소되었습니다.';
      setTimeout(() => {
        progressSection.style.display = 'none';
      }, 2000);
      return;
    }

    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    // 다운로드 링크 생성
    const a = document.createElement('a');
    a.href = url;
    a.download = `video_${Date.now()}.webm`;
    a.click();

    URL.revokeObjectURL(url);
    progressText.textContent = '영상 생성 완료!';
  };

  mediaRecorder.start();

  // 각 이미지를 순차적으로 렌더링
  const frameDelay = 1000 / outputConfig.fps;
  let currentTime = 0;
  let totalDuration = images.reduce((sum, img) => sum + img.duration, 0);

  for (let i = 0; i < images.length && !generationCancelled; i++) {
    const imageData = images[i];
    const frames = Math.floor(imageData.duration * outputConfig.fps);

    progressText.textContent = `이미지 ${i + 1}/${images.length} 처리 중...`;

    for (let frame = 0; frame < frames && !generationCancelled; frame++) {
      // 배경 그리기
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // 이미지 그리기
      drawImage(ctx, imageData);

      // 프레임 대기
      await new Promise(resolve => setTimeout(resolve, frameDelay));

      // 진행률 업데이트
      currentTime += 1 / fps;
      const progress = (currentTime / totalDuration) * 100;
      progressBar.style.width = progress + '%';
    }
  }

  mediaRecorder.stop();
}
