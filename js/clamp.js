document.addEventListener("DOMContentLoaded", function () {
  const minVpInput = document.getElementById("clamp-min-vp");
  const maxVpInput = document.getElementById("clamp-max-vp");
  const minFontInput = document.getElementById("clamp-min-font");
  const maxFontInput = document.getElementById("clamp-max-font");
  const rootFontInput = document.getElementById("clamp-root-font");
  const useRemCheck = document.getElementById("clamp-use-rem");
  const resultText = document.getElementById("clamp-result-text");
  const copyBtn = document.getElementById("clamp-copy-btn");
  const livePreview = document.getElementById("clamp-live-preview");

  function calculateClamp() {
    const minVp = parseFloat(minVpInput.value);
    const maxVp = parseFloat(maxVpInput.value);
    const minFont = parseFloat(minFontInput.value);
    const maxFont = parseFloat(maxFontInput.value);
    const rootFont = parseFloat(rootFontInput.value) || 16;
    const useRem = useRemCheck.checked;

    if (isNaN(minVp) || isNaN(maxVp) || isNaN(minFont) || isNaN(maxFont)) {
      resultText.textContent = "Please enter valid numbers.";
      return;
    }

    if (maxVp === minVp) {
      resultText.textContent = "Max Viewport must be different from Min Viewport.";
      return;
    }

    // 슬로프 계산
    const slope = (maxFont - minFont) / (maxVp - minVp);
    const intersection = -minVp * slope + minFont;

    const slopeVw = (slope * 100).toFixed(4);
    
    let clampString = "";

    if (useRem) {
      const minRem = (minFont / rootFont).toFixed(4);
      const maxRem = (maxFont / rootFont).toFixed(4);
      const intersectionRem = (intersection / rootFont).toFixed(4);
      
      const valStr = intersectionRem >= 0 
        ? `${intersectionRem}rem + ${slopeVw}vw` 
        : `${intersectionRem}rem + ${slopeVw}vw`.replace("+-", "-");
        
      clampString = `clamp(${minRem}rem, ${parseFloat(intersectionRem) === 0 ? slopeVw+'vw' : valStr}, ${maxRem}rem)`;
    } else {
      const minPx = minFont.toFixed(2);
      const maxPx = maxFont.toFixed(2);
      const intersectionPx = intersection.toFixed(2);

      const valStr = intersection >= 0 
        ? `${intersectionPx}px + ${slopeVw}vw` 
        : `${intersectionPx}px + ${slopeVw}vw`.replace("+-", "-");
      
      clampString = `clamp(${minPx}px, ${parseFloat(intersectionPx) === 0 ? slopeVw+'vw' : valStr}, ${maxPx}px)`;
    }

    // 결과 표시
    resultText.textContent = clampString;
    // 라이브 프리뷰 업데이트
    if (livePreview) {
      livePreview.style.fontSize = clampString;
    }
  }

  // 입력값 변경 시 자동 계산
  const inputs = [minVpInput, maxVpInput, minFontInput, maxFontInput, rootFontInput, useRemCheck];
  inputs.forEach((input) => {
    if (input) {
      input.addEventListener("input", calculateClamp);
      input.addEventListener("change", calculateClamp);
    }
  });

  // 초기 계산
  calculateClamp();

  // 복사 버튼
  if (copyBtn) {
    // common 함수가 있으면 쓰고, 없으면 로직 사용
    copyBtn.addEventListener("click", function() {
      const txt = resultText.textContent;
      if (typeof window.copyToClipboard !== 'undefined') {
        window.copyToClipboard(txt, this);
      } else {
        navigator.clipboard.writeText(txt).then(() => {
          const org = this.textContent;
          this.textContent = "✅ Copied!";
          setTimeout(() => { this.textContent = org; }, 1000);
        });
      }
    });
  }
});
