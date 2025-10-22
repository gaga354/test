// 이미지 관리
let images = [];
let imageIdCounter = 0;

// DOM 요소
const imageInput = document.getElementById('imageInput');
const imageList = document.getElementById('imageList');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const previewCanvas = document.getElementById('previewCanvas');
const canvasWidthInput = document.getElementById('canvasWidth');
const canvasHeightInput = document.getElementById('canvasHeight');
const fpsInput = document.getElementById('fps');
const progressSection = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

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

// 캔버스 설정
let canvasWidth = 1920;
let canvasHeight = 1080;
let fps = 30;

// 기본 이미지 설정 (초기값)
const INITIAL_DEFAULTS = {
  duration: 3,
  width: 100,
  height: 100,
  x: 0,
  y: 0,
  fit: 'cover',
  bgColor: '#000000',
  bgEnabled: true,
  borderEnabled: false,
  borderColor: '#ffffff',
  borderWidth: 5,
  shadowEnabled: false,
  shadowColor: '#000000',
  shadowBlur: 10,
  shadowX: 5,
  shadowY: 5
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
  const ctx = previewCanvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

// 초기화
loadDefaultSettings();
initCanvas();

// 캔버스 설정 변경 이벤트
canvasWidthInput.addEventListener('change', () => {
  canvasWidth = parseInt(canvasWidthInput.value);
  initCanvas();
  updatePreview();
});

canvasHeightInput.addEventListener('change', () => {
  canvasHeight = parseInt(canvasHeightInput.value);
  initCanvas();
  updatePreview();
});

fpsInput.addEventListener('change', () => {
  fps = parseInt(fpsInput.value);
});

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
        bgColor: defaults.bgColor,
        bgEnabled: defaults.bgEnabled,
        borderEnabled: defaults.borderEnabled,
        borderColor: defaults.borderColor,
        borderWidth: defaults.borderWidth,
        shadowEnabled: defaults.shadowEnabled,
        shadowColor: defaults.shadowColor,
        shadowBlur: defaults.shadowBlur,
        shadowX: defaults.shadowX,
        shadowY: defaults.shadowY
      };
      images.push(imageData);
      renderImageList();
      updateGenerateButton();
      updateApplyToAllButton();
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
      <button class="remove-btn" data-id="${imageData.id}">삭제</button>
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

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      images = images.filter(i => i.id !== id);
      renderImageList();
      updateGenerateButton();
      updateApplyToAllButton();
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
  const { img, width, height, x, y, fit, bgColor, bgEnabled, borderEnabled, borderColor, borderWidth, shadowEnabled, shadowColor, shadowBlur, shadowX, shadowY } = imageData;

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

  // 이미지 그리기
  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

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
    initCanvas();
  }
});

// 공통 설정 버튼 이벤트
saveDefaultsBtn.addEventListener('click', saveDefaultSettings);
applyToAllBtn.addEventListener('click', applyDefaultsToAll);
resetDefaultsBtn.addEventListener('click', resetDefaultSettings);

// 영상 생성
generateBtn.addEventListener('click', async () => {
  if (images.length === 0) return;

  progressSection.style.display = 'block';
  generateBtn.disabled = true;
  progressBar.style.width = '0%';
  progressText.textContent = '영상 생성 준비 중...';

  try {
    await generateVideo();
  } catch (error) {
    console.error('영상 생성 실패:', error);
    alert('영상 생성에 실패했습니다: ' + error.message);
  } finally {
    progressSection.style.display = 'none';
    generateBtn.disabled = false;
  }
});

// 영상 생성 함수
async function generateVideo() {
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  // MediaRecorder 설정
  const stream = canvas.captureStream(fps);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 5000000 // 5 Mbps
  });

  const chunks = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  mediaRecorder.onstop = () => {
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
  const frameDelay = 1000 / fps;
  let currentTime = 0;
  let totalDuration = images.reduce((sum, img) => sum + img.duration, 0);

  for (let i = 0; i < images.length; i++) {
    const imageData = images[i];
    const frames = Math.floor(imageData.duration * fps);

    progressText.textContent = `이미지 ${i + 1}/${images.length} 처리 중...`;

    for (let frame = 0; frame < frames; frame++) {
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
