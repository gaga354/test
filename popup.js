// Popup script for Chrome Extension

document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('actionButton');

  if (button) {
    button.addEventListener('click', function() {
      console.log('버튼이 클릭되었습니다!');
      alert('안녕하세요! Chrome 확장 프로그램입니다.');
    });
  }
});
