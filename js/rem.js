// px -> rem 변환 함수
function pxToRem(px, root, floatNum) {
  if (!px || !root) return "";
  return (parseFloat(px) / parseFloat(root)).toFixed(floatNum);
}
// rem -> px 변환 함수
function remToPx(rem, root, floatNum) {
  if (!rem || !root) return "";
  return (parseFloat(rem) * parseFloat(root)).toFixed(floatNum);
}

// CSS 내 px -> rem 변환
function cssPxToRem(css, root, floatNum, removeValue) {
  if (!removeValue) {
    return css.replace(
      /(\d+\.?\d*)px/g,
      (m, p1) => pxToRem(p1, root, floatNum) + "rem"
    );
  }
  // 블록 파싱 오류를 방지하기 위해 CSS 주석 제거
  const cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 속성 삭제: 숫자 단위가 없는 속성 전체 삭제
  return cleanCss.replace(
    /([^{]+{)([^}]+)(})/g,
    (match, selector, properties, closingBrace) => {
      const propertyList = properties.split(/;\s*/);
      const filteredProperties = propertyList
        .map((line) => {
          if (/:[^;]*([0-9.]+\s*(px|vw|rem|em|%|vh|vmin|vmax))/i.test(line)) {
            return line.replace(
              /(\d+\.?\d*)px/g,
              (m, p1) => pxToRem(p1, root, floatNum) + "rem"
            );
          }
          return "";
        })
        .filter(Boolean);

      const propertiesString =
        filteredProperties.length > 0
          ? filteredProperties.join(";\n") + ";\n"
          : "";
      return selector + propertiesString + closingBrace;
    }
  );
}

// CSS 내 rem -> px 변환
function cssRemToPx(css, root, floatNum, removeValue) {
  if (!removeValue) {
    return css.replace(
      /(\d+\.?\d*)rem/g,
      (m, p1) => remToPx(p1, root, floatNum) + "px"
    );
  }
  const cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, '');

  return cleanCss.replace(
    /([^{]+{)([^}]+)(})/g,
    (match, selector, properties, closingBrace) => {
      const propertyList = properties.split(/;\s*/);
      const filteredProperties = propertyList
        .map((line) => {
          if (/:[^;]*([0-9.]+\s*(px|vw|rem|em|%|vh|vmin|vmax))/i.test(line)) {
            return line.replace(
              /(\d+\.?\d*)rem/g,
              (m, p1) => remToPx(p1, root, floatNum) + "px"
            );
          }
          return "";
        })
        .filter(Boolean);

      const propertiesString =
        filteredProperties.length > 0
          ? filteredProperties.join(";\n") + ";\n"
          : "";
      return selector + propertiesString + closingBrace;
    }
  );
}

// px -> rem 단일 변환
const remPxInput = document.getElementById("rem-px-input");
const remOutput = document.getElementById("rem-output");
const rem1Root = document.getElementById("rem1-root");
const rem1Float = document.getElementById("rem1-float");

Array.from(document.getElementsByClassName("rem-preset-btn")).forEach((btn) => {
  btn.onclick = function () {
    const value = this.getAttribute("data-value");
    if(rem1Root) rem1Root.value = value;
    if(typeof cssRem1Root !== 'undefined' && cssRem1Root) {
      cssRem1Root.value = value;
    }
  };
});

const remUnitCheck = document.getElementById("rem-unit-check");
function updateRemOutputUnit() {
  if (!remOutput || !remOutput.value) return;
  if (remUnitCheck && remUnitCheck.checked) {
    remOutput.value = remOutput.value.replace(/rem$/, "") + "rem";
  } else {
    remOutput.value = remOutput.value.replace(/rem$/, "");
  }
}
if (remUnitCheck) remUnitCheck.addEventListener("change", updateRemOutputUnit);

function calcPxToRem() {
  if (!remPxInput || !rem1Root || !remPxInput.value || !rem1Root.value) return;
  let result = pxToRem(
    remPxInput.value,
    rem1Root.value,
    Math.min(5, parseInt(rem1Float ? rem1Float.value : 3) || 3)
  );
  if (remUnitCheck && remUnitCheck.checked) {
    result += "rem";
  }
  if (remOutput) remOutput.value = result;
}

const pxToRemBtn = document.getElementById("px-to-rem-btn");
if (pxToRemBtn) pxToRemBtn.onclick = calcPxToRem;
if (remPxInput) remPxInput.addEventListener("keydown", (e) => { if(e.key === "Enter") calcPxToRem(); });
if (rem1Root) rem1Root.addEventListener("keydown", (e) => { if(e.key === "Enter") calcPxToRem(); });

// rem -> px 단일 변환
const remInput = document.getElementById("rem-input");
const remPxOutput = document.getElementById("rem-px-output");
const rem2Root = document.getElementById("rem2-root");
const remPxNoFloat = document.getElementById("rem-px-no-float");
const remPxUnitCheck = document.getElementById("rem-px-unit-check");

Array.from(document.getElementsByClassName("rem2-preset-btn")).forEach((btn) => {
  btn.onclick = function () {
    const value = this.getAttribute("data-value");
    if(rem2Root) rem2Root.value = value;
    if(typeof cssRem2Root !== 'undefined' && cssRem2Root) {
      cssRem2Root.value = value;
    }
  };
});

function calcRemToPx() {
  if (!remInput || !rem2Root || !remInput.value || !rem2Root.value) return;
  let result;
  if (!remPxNoFloat || remPxNoFloat.checked) {
    result = Math.round(remToPx(remInput.value, rem2Root.value, 5));
  } else {
    result = remToPx(remInput.value, rem2Root.value, 1);
  }
  if (remPxUnitCheck && remPxUnitCheck.checked) {
    result += "px";
  }
  if (remPxOutput) remPxOutput.value = result;
}

const remToPxBtn = document.getElementById("rem-to-px-btn");
if (remToPxBtn) remToPxBtn.onclick = calcRemToPx;
if (remInput) remInput.addEventListener("keydown", (e) => { if(e.key === "Enter") calcRemToPx(); });
if (rem2Root) rem2Root.addEventListener("keydown", (e) => { if(e.key === "Enter") calcRemToPx(); });

// CSS Px to Rem
const cssRem1Input = document.getElementById("css-rem1-input");
const cssRem1Output = document.getElementById("css-rem1-output");
const cssRem1Root = document.getElementById("css-rem1-root");
const cssRem1Float = document.getElementById("css-rem1-float");
const cssRem1Remove = document.getElementById("css-rem1-remove");
const cssRem1Btn = document.getElementById("css-rem1-btn");

if (cssRem1Btn) {
  cssRem1Btn.onclick = function () {
    if (!cssRem1Input.value || !cssRem1Root.value) return;
    cssRem1Output.value = cssPxToRem(
      cssRem1Input.value,
      cssRem1Root.value,
      Math.min(5, parseInt(cssRem1Float ? cssRem1Float.value : 3) || 3),
      cssRem1Remove ? cssRem1Remove.checked : false
    );
  };
}

// CSS Rem to Px
const cssRem2Input = document.getElementById("css-rem2-input");
const cssRem2Output = document.getElementById("css-rem2-output");
const cssRem2Root = document.getElementById("css-rem2-root");
const cssRem2Remove = document.getElementById("css-rem2-remove");
const cssRem2NoFloat = document.getElementById("css-rem2-no-float");
const cssRem2Btn = document.getElementById("css-rem2-btn");

if (cssRem2Btn) {
  cssRem2Btn.onclick = function () {
    if (!cssRem2Input.value || !cssRem2Root.value) return;
    const floatNum = !cssRem2NoFloat || cssRem2NoFloat.checked ? 0 : 1;
    let result = cssRemToPx(
      cssRem2Input.value,
      cssRem2Root.value,
      floatNum === 0 ? 5 : 1,
      cssRem2Remove ? cssRem2Remove.checked : false
    );
    if (floatNum === 0) {
      result = result.replace(
        /([0-9]+\.[0-9]+)px/g,
        (m, p1) => Math.round(parseFloat(p1)) + "px"
      );
    }
    cssRem2Output.value = result;
  };
}

// 카피 버튼들
// 공통 함수 (script.js에 있다면 재활용 가능, 여기선 방어 코드)
if (typeof window.copyToClipboard === 'undefined') {
  window.copyToClipboard = function(value, btn) {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      const org = btn.textContent;
      btn.textContent = "✅ Copied!";
      setTimeout(() => { btn.textContent = org; }, 1000);
    });
  };
}

const copyIds = [
  { btn: "rem-copy-btn", val: "rem-output" },
  { btn: "rem-px-copy-btn", val: "rem-px-output" },
  { btn: "css-rem1-copy-btn", val: "css-rem1-output" },
  { btn: "css-rem2-copy-btn", val: "css-rem2-output" }
];
copyIds.forEach(item => {
  const btn = document.getElementById(item.btn);
  const out = document.getElementById(item.val);
  if(btn && out) {
    btn.onclick = function() { window.copyToClipboard(out.value, this); };
  }
});

// 초기화 버튼들
const clearIds = [
  { btn: "rem-clear-btn", in: "rem-px-input", out: "rem-output" },
  { btn: "rem-px-clear-btn", in: "rem-input", out: "rem-px-output" },
  { btn: "css-rem1-clear-btn", in: "css-rem1-input", out: "css-rem1-output" },
  { btn: "css-rem2-clear-btn", in: "css-rem2-input", out: "css-rem2-output" }
];
clearIds.forEach(item => {
  const btn = document.getElementById(item.btn);
  const inn = document.getElementById(item.in);
  const out = document.getElementById(item.out);
  if(btn && inn && out) {
    btn.onclick = function() { inn.value = ''; out.value = ''; };
  }
});

// 모바일 토글 버튼
const mobileRemToggleBtn = document.getElementById("mobile-toggle-rem-btn");
const pxToRemBox = document.getElementById("px-to-rem-box");
const remToPxBox = document.getElementById("rem-to-px-box");
const cssRem1Box = document.getElementById("css-rem1-box");
const cssRem2Box = document.getElementById("css-rem2-box");

if (mobileRemToggleBtn && pxToRemBox && remToPxBox && cssRem1Box && cssRem2Box) {
  let isPxToRemVisible = true;
  function setRemInitialMobileState() {
    if (window.innerWidth <= 720) {
      pxToRemBox.classList.add("visible");
      remToPxBox.classList.add("hidden");
      cssRem1Box.classList.add("visible");
      cssRem2Box.classList.add("hidden");
      mobileRemToggleBtn.textContent = "REM to PX";
      mobileRemToggleBtn.classList.remove("on");
    } else {
      pxToRemBox.classList.remove("visible", "hidden");
      remToPxBox.classList.remove("visible", "hidden");
      cssRem1Box.classList.remove("visible", "hidden");
      cssRem2Box.classList.remove("visible", "hidden");
      mobileRemToggleBtn.classList.remove("on");
    }
  }
  mobileRemToggleBtn.addEventListener("click", function () {
    if (window.innerWidth <= 720) {
      if (isPxToRemVisible) {
        pxToRemBox.classList.remove("visible"); pxToRemBox.classList.add("hidden");
        remToPxBox.classList.remove("hidden"); remToPxBox.classList.add("visible");
        cssRem1Box.classList.remove("visible"); cssRem1Box.classList.add("hidden");
        cssRem2Box.classList.remove("hidden"); cssRem2Box.classList.add("visible");
        mobileRemToggleBtn.textContent = "PX to REM";
        mobileRemToggleBtn.classList.add("on");
        isPxToRemVisible = false;
      } else {
        remToPxBox.classList.remove("visible"); remToPxBox.classList.add("hidden");
        pxToRemBox.classList.remove("hidden"); pxToRemBox.classList.add("visible");
        cssRem2Box.classList.remove("visible"); cssRem2Box.classList.add("hidden");
        cssRem1Box.classList.remove("hidden"); cssRem1Box.classList.add("visible");
        mobileRemToggleBtn.textContent = "REM to PX";
        mobileRemToggleBtn.classList.remove("on");
        isPxToRemVisible = true;
      }
    }
  });
  setRemInitialMobileState();
}
