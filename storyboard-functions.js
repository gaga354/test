// 스토리보드용 새로운 렌더링 함수들

// 썸네일 생성 함수
function generateThumbnail(imageData, width = 400, height = 225) {
  try {
    console.log('썸네일 생성 시작:', imageData.id);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Canvas context를 가져올 수 없습니다');
      return imageData.src; // 원본 이미지 반환
    }

    // 배경 그리기
    ctx.fillStyle = imageData.bgColor || '#000';
    ctx.fillRect(0, 0, width, height);

    // canvasWidth, canvasHeight 체크
    if (typeof canvasWidth === 'undefined' || typeof canvasHeight === 'undefined') {
      console.error('canvasWidth 또는 canvasHeight가 정의되지 않음');
      return imageData.src; // 원본 이미지 반환
    }

    // 스케일 조정
    const scale = width / canvasWidth;
    ctx.save();
    ctx.scale(scale, scale);

    // 이미지 그리기 (중간 진행도로)
    if (typeof drawImage === 'function') {
      drawImage(ctx, imageData, 0.5);
    } else {
      console.error('drawImage 함수를 찾을 수 없습니다');
      // 간단한 fallback 그리기
      if (imageData.img) {
        ctx.drawImage(imageData.img, 0, 0, canvasWidth, canvasHeight);
      }
    }

    ctx.restore();

    const dataURL = canvas.toDataURL('image/jpeg', 0.8);
    console.log('썸네일 생성 완료');
    return dataURL;
  } catch (error) {
    console.error('썸네일 생성 오류:', error);
    // 오류 발생 시 원본 이미지 반환
    return imageData.src;
  }
}

// 스토리보드 아이템 렌더링
function renderImageList() {
  console.log('renderImageList 시작, images.length:', images.length);

  try {
    imageList.innerHTML = '';

    if (images.length === 0) {
      imageList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">이미지를 업로드하세요</p>';
      return;
    }

    images.forEach((imageData, index) => {
      try {
        console.log(`이미지 ${index + 1} 렌더링 중...`);
        const item = document.createElement('div');
        item.className = 'storyboard-item';
        item.draggable = true;
        item.dataset.id = imageData.id;
        item.dataset.index = index;

        // 썸네일 생성
        const thumbnailSrc = generateThumbnail(imageData);
        console.log(`이미지 ${index + 1} 썸네일 생성 완료`);

    // 효과 태그 생성
    const effects = [];
    if (imageData.animation?.type && imageData.animation.type !== 'none') {
      effects.push(kenBurnsPresets[imageData.animation.type]?.name || imageData.animation.type);
    }
    if (imageData.transition?.type && imageData.transition.type !== 'none') {
      effects.push('전환');
    }
    if (imageData.filters && Object.values(imageData.filters).some(v => v !== 100 && v !== 0)) {
      effects.push('필터');
    }
    if (imageData.text?.enabled) {
      effects.push('텍스트');
    }

    const effectsHTML = effects.map(effect =>
      `<span class="storyboard-tag">${effect}</span>`
    ).join('');

    item.innerHTML = `
      <img src="${thumbnailSrc}" class="storyboard-thumbnail" alt="이미지 ${index + 1}">
      <div class="storyboard-actions">
        <button class="storyboard-action-btn delete" data-id="${imageData.id}" title="삭제">🗑️</button>
      </div>
      <div class="storyboard-info">
        <div class="storyboard-number">#${index + 1}</div>
        <div class="storyboard-duration">${imageData.duration}초</div>
        ${effectsHTML ? `<div class="storyboard-effects">${effectsHTML}</div>` : ''}
      </div>
    `;

    // 클릭 이벤트 - 모달 열기
    const thumbnail = item.querySelector('.storyboard-thumbnail');
    const info = item.querySelector('.storyboard-info');
    thumbnail.addEventListener('click', () => openImageModal(imageData.id));
    info.addEventListener('click', () => openImageModal(imageData.id));

    // 삭제 버튼
    const deleteBtn = item.querySelector('.delete');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`이미지 #${index + 1}을(를) 삭제하시겠습니까?`)) {
        images = images.filter(img => img.id !== imageData.id);
        renderImageList();
        updatePreview();
        updateApplyToAllButton();
        updateOutputInfo();
      }
    });

        // 드래그 이벤트
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragleave', handleDragLeave);

        imageList.appendChild(item);
        console.log(`이미지 ${index + 1} DOM에 추가 완료`);
      } catch (error) {
        console.error(`이미지 ${index + 1} 렌더링 오류:`, error);
        // 에러가 발생해도 다음 이미지는 계속 처리
      }
    });

    console.log('renderImageList 완료');
    updateApplyToAllButton();
  } catch (error) {
    console.error('renderImageList 전체 오류:', error);
    imageList.innerHTML = '<p style="text-align: center; color: #f44; padding: 40px;">이미지 목록 표시 중 오류가 발생했습니다.<br>' + error.message + '</p>';
  }
}

// 드래그 앤 드롭 핸들러
let draggedItem = null;

function handleDragStart(e) {
  draggedItem = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  document.querySelectorAll('.storyboard-item').forEach(item => {
    item.classList.remove('drag-over');
  });
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';

  if (this !== draggedItem) {
    this.classList.add('drag-over');
  }

  return false;
}

function handleDragLeave(e) {
  this.classList.remove('drag-over');
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  if (draggedItem !== this) {
    const fromIndex = parseInt(draggedItem.dataset.index);
    const toIndex = parseInt(this.dataset.index);

    // 배열 재정렬
    const item = images.splice(fromIndex, 1)[0];
    images.splice(toIndex, 0, item);

    renderImageList();
    updatePreview();
  }

  return false;
}

// 모달 열기
function openImageModal(imageId) {
  const imageData = images.find(img => img.id === imageId);
  if (!imageData) return;

  currentEditingImageId = imageId;
  const index = images.findIndex(img => img.id === imageId);

  // 모달 내용 생성 (기존 폼을 그대로 사용)
  modalBody.innerHTML = `
    <div class="image-controls">
      <div class="control-group">
        <label>재생 시간 (초)</label>
        <input type="number" id="modal-duration" value="${imageData.duration}" min="0.1" step="0.1">
      </div>
      <div class="control-group">
        <label>너비 (%)</label>
        <input type="number" id="modal-width" value="${imageData.width}" min="1" max="200">
      </div>
      <div class="control-group">
        <label>높이 (%)</label>
        <input type="number" id="modal-height" value="${imageData.height}" min="1" max="200">
      </div>
      <div class="control-group">
        <label>X 위치 (%)</label>
        <input type="number" id="modal-x" value="${imageData.x}" min="-100" max="100">
      </div>
      <div class="control-group">
        <label>Y 위치 (%)</label>
        <input type="number" id="modal-y" value="${imageData.y}" min="-100" max="100">
      </div>
      <div class="control-group">
        <label>맞춤 방식</label>
        <select id="modal-fit">
          <option value="cover" ${imageData.fit === 'cover' ? 'selected' : ''}>채우기 (Cover)</option>
          <option value="contain" ${imageData.fit === 'contain' ? 'selected' : ''}>맞추기 (Contain)</option>
          <option value="fill" ${imageData.fit === 'fill' ? 'selected' : ''}>늘리기 (Fill)</option>
        </select>
      </div>
      <div class="control-group">
        <label>회전</label>
        <select id="modal-rotation">
          <option value="0" ${imageData.rotation === 0 ? 'selected' : ''}>0° (↑)</option>
          <option value="90" ${imageData.rotation === 90 ? 'selected' : ''}>90° (→)</option>
          <option value="180" ${imageData.rotation === 180 ? 'selected' : ''}>180° (↓)</option>
          <option value="270" ${imageData.rotation === 270 ? 'selected' : ''}>270° (←)</option>
        </select>
      </div>
      <div class="control-group">
        <label>애니메이션</label>
        <select id="modal-animation">
          <option value="none" ${(imageData.animation?.type || 'none') === 'none' ? 'selected' : ''}>없음</option>
          <option value="zoom-in" ${imageData.animation?.type === 'zoom-in' ? 'selected' : ''}>줌 인</option>
          <option value="zoom-out" ${imageData.animation?.type === 'zoom-out' ? 'selected' : ''}>줌 아웃</option>
          <option value="pan-right" ${imageData.animation?.type === 'pan-right' ? 'selected' : ''}>좌→우</option>
          <option value="pan-left" ${imageData.animation?.type === 'pan-left' ? 'selected' : ''}>우→좌</option>
          <option value="pan-up" ${imageData.animation?.type === 'pan-up' ? 'selected' : ''}>하→상</option>
          <option value="pan-down" ${imageData.animation?.type === 'pan-down' ? 'selected' : ''}>상→하</option>
          <option value="zoom-pan-right" ${imageData.animation?.type === 'zoom-pan-right' ? 'selected' : ''}>줌인+우측</option>
          <option value="zoom-pan-left" ${imageData.animation?.type === 'zoom-pan-left' ? 'selected' : ''}>줌인+좌측</option>
        </select>
      </div>
      <div class="control-group">
        <label>다음 이미지로 전환</label>
        <select id="modal-transition">
          <option value="none" ${(imageData.transition?.type || 'none') === 'none' ? 'selected' : ''}>없음 (즉시)</option>
          <option value="fade" ${imageData.transition?.type === 'fade' ? 'selected' : ''}>페이드</option>
          <option value="slide-left" ${imageData.transition?.type === 'slide-left' ? 'selected' : ''}>좌측 슬라이드</option>
          <option value="slide-right" ${imageData.transition?.type === 'slide-right' ? 'selected' : ''}>우측 슬라이드</option>
          <option value="slide-up" ${imageData.transition?.type === 'slide-up' ? 'selected' : ''}>위로 슬라이드</option>
          <option value="slide-down" ${imageData.transition?.type === 'slide-down' ? 'selected' : ''}>아래로 슬라이드</option>
        </select>
      </div>
    </div>
  `;

  // 모달 표시
  imageModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// 모달 닫기
function closeImageModal() {
  imageModal.style.display = 'none';
  document.body.style.overflow = '';
  currentEditingImageId = null;
}

// 모달 저장
function saveImageModal() {
  if (!currentEditingImageId) return;

  const imageData = images.find(img => img.id === currentEditingImageId);
  if (!imageData) return;

  // 폼 값 읽기
  imageData.duration = parseFloat(document.getElementById('modal-duration').value);
  imageData.width = parseFloat(document.getElementById('modal-width').value);
  imageData.height = parseFloat(document.getElementById('modal-height').value);
  imageData.x = parseFloat(document.getElementById('modal-x').value);
  imageData.y = parseFloat(document.getElementById('modal-y').value);
  imageData.fit = document.getElementById('modal-fit').value;
  imageData.rotation = parseInt(document.getElementById('modal-rotation').value);

  // 애니메이션
  const animType = document.getElementById('modal-animation').value;
  const preset = kenBurnsPresets[animType];
  if (!imageData.animation) imageData.animation = {};
  imageData.animation.type = animType;
  imageData.animation.startScale = preset.startScale;
  imageData.animation.endScale = preset.endScale;
  imageData.animation.startX = preset.startX;
  imageData.animation.startY = preset.startY;
  imageData.animation.endX = preset.endX;
  imageData.animation.endY = preset.endY;

  // 전환 효과
  const transType = document.getElementById('modal-transition').value;
  const transPreset = transitionPresets[transType];
  if (!imageData.transition) imageData.transition = {};
  imageData.transition.type = transType;
  imageData.transition.duration = transPreset.duration;

  // UI 업데이트
  renderImageList();
  updatePreview();
  updateOutputInfo();
  closeImageModal();
}

// 모달 이벤트 리스너
modalCloseBtn.addEventListener('click', closeImageModal);
modalCancelBtn.addEventListener('click', closeImageModal);
modalSaveBtn.addEventListener('click', saveImageModal);

// 모달 외부 클릭 시 닫기
imageModal.addEventListener('click', (e) => {
  if (e.target === imageModal) {
    closeImageModal();
  }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && imageModal.style.display === 'flex') {
    closeImageModal();
  }
});
