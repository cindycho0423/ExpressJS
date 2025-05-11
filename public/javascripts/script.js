document.addEventListener('DOMContentLoaded', function () {
  // 요소들을 가져옵니다
  const uploadForm = document.getElementById('uploadForm');
  const fileInput = document.getElementById('fileInput');
  const imageContainer = document.getElementById('imageContainer');
  const previewImage = document.getElementById('previewImage');
  const resultMessage = document.getElementById('resultMessage');
  const uploadedImage = document.getElementById('uploadedImage');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const uploadButton = document.getElementById('uploadButton');
  const resetButton = document.getElementById('resetButton');
  const uploadResult = document.getElementById('uploadResult');

  // 모든 필수 요소가 존재하는지 확인합니다
  if (
    !uploadForm ||
    !fileInput ||
    !previewImage ||
    !resultMessage ||
    !uploadedImage ||
    !loadingSpinner ||
    !uploadButton
  ) {
    console.error('필수 HTML 요소를 찾을 수 없습니다.');
    return;
  }

  // 파일 선택 시 미리보기
  fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        uploadButton.disabled = false;
      };
      reader.readAsDataURL(file);
    }
  });

  // 폼 제출 이벤트 처리
  uploadForm.addEventListener('submit', function (e) {
    e.preventDefault(); // 기본 제출 동작 방지

    const formData = new FormData(this);

    if (!fileInput.files[0]) {
      resultMessage.textContent = '파일을 선택해주세요.';
      resultMessage.className = 'error-message';
      return;
    }

    // 로딩 상태 표시
    loadingSpinner.style.display = 'block';
    uploadButton.disabled = true;
    resultMessage.textContent = '업로드 중...';
    resultMessage.className = 'info-message';

    fetch('/', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('파일 업로드에 실패했습니다.');
        }
        return response.json();
      })
      .then(data => {
        // 업로드 성공 처리
        loadingSpinner.style.display = 'none';
        resultMessage.textContent = '파일 업로드 성공!';
        resultMessage.className = 'success-message';

        // 업로드된 이미지 표시
        uploadedImage.src = data.filePath;
        uploadedImage.style.display = 'block';

        // 업로드 결과 영역 표시
        if (uploadResult) {
          uploadResult.style.display = 'block';
        }

        // 리셋 버튼 활성화
        if (resetButton) {
          resetButton.style.display = 'block';
        }
      })
      .catch(error => {
        // 오류 처리
        loadingSpinner.style.display = 'none';
        uploadButton.disabled = false;
        resultMessage.textContent = error.message;
        resultMessage.className = 'error-message';
      });
  });

  // 리셋 버튼 이벤트 처리
  if (resetButton) {
    resetButton.addEventListener('click', function () {
      // 폼 초기화
      uploadForm.reset();
      previewImage.style.display = 'none';
      uploadedImage.style.display = 'none';

      if (uploadResult) {
        uploadResult.style.display = 'none';
      }

      this.style.display = 'none';
      resultMessage.textContent = '';
      uploadButton.disabled = true;
    });
  }
});
