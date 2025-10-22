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

// 캔버스 설정
let canvasWidth = 1920;
let canvasHeight = 1080;
let fps = 30;

// 캔버스 초기화
function initCanvas() {
  previewCanvas.width = canvasWidth;
  previewCanvas.height = canvasHeight;
  const ctx = previewCanvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

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
      const imageData = {
        id: imageIdCounter++,
        src: e.target.result,
        img: img,
        duration: 3, // 초
        width: 100, // 퍼센트
        height: 100, // 퍼센트
        x: 0, // 퍼센트
        y: 0, // 퍼센트
        fit: 'cover' // cover, contain, fill
      };
      images.push(imageData);
      renderImageList();
      updateGenerateButton();
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

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      images = images.filter(i => i.id !== id);
      renderImageList();
      updateGenerateButton();
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
  const { img, width, height, x, y, fit } = imageData;

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

  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
}

// 생성 버튼 상태 업데이트
function updateGenerateButton() {
  generateBtn.disabled = images.length === 0;
}

// 모두 지우기
clearBtn.addEventListener('click', () => {
  if (images.length === 0) return;
  if (confirm('모든 이미지를 삭제하시겠습니까?')) {
    images = [];
    renderImageList();
    updateGenerateButton();
    initCanvas();
  }
});

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
