// px -> vw 변환 함수
function pxToVw(px, viewport, floatNum) {
  if (!px || !viewport) return '';
  return (parseFloat(px) / parseFloat(viewport) * 100).toFixed(floatNum);
}
// vw -> px 변환 함수
function vwToPx(vw, viewport, floatNum) {
  if (!vw || !viewport) return '';
  return (parseFloat(vw) * parseFloat(viewport) / 100).toFixed(floatNum);
}
// CSS 내 px -> vw 변환
function cssPxToVw(css, viewport, floatNum, removeValue) {
  if (!removeValue) {
    return css.replace(/(\d+\.?\d*)px/g, (m, p1) => pxToVw(p1, viewport, floatNum) + 'vw');
  }
  // 속성 삭제: 숫자 단위가 없는 속성 전체 삭제
  return css.split(/;\s*/)
    .map(line => {
      // 숫자+단위가 있으면 변환, 없으면 삭제
      if (/:[^;]*([0-9.]+\s*(px|vw|rem|em|%|vh|vmin|vmax))/i.test(line)) {
        return line.replace(/(\d+\.?\d*)px/g, (m, p1) => pxToVw(p1, viewport, floatNum) + 'vw');
      }
      return '';
    })
    .filter(Boolean)
    .join(';\n');
}
// CSS 내 vw -> px 변환
function cssVwToPx(css, viewport, floatNum, removeValue) {
  if (!removeValue) {
    return css.replace(/(\d+\.?\d*)vw/g, (m, p1) => vwToPx(p1, viewport, floatNum) + 'px');
  }
  // 속성 삭제: 숫자 단위가 없는 속성 전체 삭제
  return css.split(/;\s*/)
    .map(line => {
      if (/:[^;]*([0-9.]+\s*(px|vw|rem|em|%|vh|vmin|vmax))/i.test(line)) {
        return line.replace(/(\d+\.?\d*)vw/g, (m, p1) => vwToPx(p1, viewport, floatNum) + 'px');
      }
      return '';
    })
    .filter(Boolean)
    .join(';\n');
}
// px -> vw 단일 변환
const pxInput = document.getElementById('px-input');
const vwOutput = document.getElementById('vw-output');
const vw1Width = document.getElementById('vw1-width');
const vw1Float = document.getElementById('vw1-float');
// 프리셋 버튼 이벤트
Array.from(document.getElementsByClassName('vw-preset-btn')).forEach(btn => {
  btn.onclick = function() {
    vw1Width.value = this.getAttribute('data-value');
  };
});
function calcPxToVw() {
  if (!pxInput.value || !vw1Width.value) return;
  vwOutput.value = pxToVw(pxInput.value, vw1Width.value, Math.min(3, parseInt(vw1Float.value)||3));
}
document.getElementById('px-to-vw-btn').onclick = calcPxToVw;
pxInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') calcPxToVw();
});
vw1Width.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') calcPxToVw();
});
vw1Float.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') calcPxToVw();
});
// vw -> px 단일 변환
const vwInput = document.getElementById('vw-input');
const pxOutput = document.getElementById('px-output');
const vw2Width = document.getElementById('vw2-width');
const pxNoFloat = document.getElementById('px-no-float');
function calcVwToPx() {
  if (!vwInput.value || !vw2Width.value) return;
  if (!pxNoFloat || pxNoFloat.checked) {
    pxOutput.value = Math.round(vwToPx(vwInput.value, vw2Width.value, 5));
  } else {
    pxOutput.value = vwToPx(vwInput.value, vw2Width.value, 1);
  }
}
document.getElementById('vw-to-px-btn').onclick = calcVwToPx;
vwInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') calcVwToPx();
});
vw2Width.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') calcVwToPx();
});
if (pxNoFloat) pxNoFloat.addEventListener('change', calcVwToPx);
// CSS px -> vw 변환
const css1Input = document.getElementById('css1-input');
const css1Output = document.getElementById('css1-output');
const css1Width = document.getElementById('css1-width');
const css1Float = document.getElementById('css1-float');
const css1Remove = document.getElementById('css1-remove');
document.getElementById('css1-btn').onclick = function() {
  if (!css1Input.value || !css1Width.value) return;
  css1Output.value = cssPxToVw(
    css1Input.value,
    css1Width.value,
    Math.min(3, parseInt(css1Float.value)||3),
    css1Remove.checked
  );
};
// CSS vw -> px 변환
const css2Input = document.getElementById('css2-input');
const css2Output = document.getElementById('css2-output');
const css2Width = document.getElementById('css2-width');
const css2Remove = document.getElementById('css2-remove');
const css2NoFloat = document.getElementById('css2-no-float');
function calcCss2() {
  if (!css2Input.value || !css2Width.value) return;
  const floatNum = (!css2NoFloat || css2NoFloat.checked) ? 0 : 1;
  let result = cssVwToPx(
    css2Input.value,
    css2Width.value,
    floatNum === 0 ? 5 : 1,
    css2Remove.checked
  );
  if (floatNum === 0) {
    // 정수로 반올림
    result = result.replace(/([0-9]+\.[0-9]+)px/g, (m, p1) => Math.round(parseFloat(p1)) + 'px');
  }
  css2Output.value = result;
}
document.getElementById('css2-btn').onclick = calcCss2;
css2Input.addEventListener('keydown', function(e) { if (e.key === 'Enter') calcCss2(); });
css2Width.addEventListener('keydown', function(e) { if (e.key === 'Enter') calcCss2(); });
if (css2NoFloat) css2NoFloat.addEventListener('change', calcCss2);
// 닫기 버튼 동작
const closeBtn = document.querySelector('.close-btn');
if (closeBtn) closeBtn.onclick = () => window.close && window.close();

// 복사 버튼 기능
function copyToClipboard(value, btn) {
  if (!value) return;
  navigator.clipboard.writeText(value).then(() => {
    const org = btn.textContent;
    btn.textContent = '복사됨!';
    setTimeout(() => { btn.textContent = org; }, 1000);
  });
}
document.getElementById('vw-copy-btn').onclick = function() {
  copyToClipboard(document.getElementById('vw-output').value, this);
};
document.getElementById('px-copy-btn').onclick = function() {
  copyToClipboard(document.getElementById('px-output').value, this);
};
// css1-output 복사 버튼
const css1CopyBtn = document.getElementById('css1-copy-btn');
if (css1CopyBtn) {
  css1CopyBtn.onclick = function() {
    copyToClipboard(document.getElementById('css1-output').value, this);
  };
}
// css2-output 복사 버튼
const css2CopyBtn = document.getElementById('css2-copy-btn');
if (css2CopyBtn) {
  css2CopyBtn.onclick = function() {
    copyToClipboard(document.getElementById('css2-output').value, this);
  };
} 