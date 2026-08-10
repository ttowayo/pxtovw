// 행간(Line Height) 계산기

// 공통 복사 함수 (방어 코드)
if (typeof window.copyToClipboard === "undefined") {
  window.copyToClipboard = function (value, btn) {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      const org = btn.textContent;
      btn.textContent = "✅ Copied!";
      setTimeout(() => { btn.textContent = org; }, 1000);
    });
  };
}

// 폰트 사이즈 프리셋
Array.from(document.getElementsByClassName("lh-preset-btn")).forEach((btn) => {
  btn.onclick = function () {
    const fontSize = document.getElementById("lh-font-size");
    if (fontSize) fontSize.value = this.getAttribute("data-value");
  };
});

// 1) 행간 PX -> line-height 비율 / % / em
const lhFontSize = document.getElementById("lh-font-size");
const lhFloat = document.getElementById("lh-float");
const lhPxInput = document.getElementById("lh-px-input");
const lhRatioOutput = document.getElementById("lh-ratio-output");
const lhPercentOutput = document.getElementById("lh-percent-output");
const lhEmOutput = document.getElementById("lh-em-output");

function calcLineHeight() {
  if (!lhPxInput || !lhFontSize || lhPxInput.value === "" || !lhFontSize.value) return;
  const floatNum = Math.min(5, parseInt(lhFloat ? lhFloat.value : 3) || 3);
  const ratio = parseFloat(lhPxInput.value) / parseFloat(lhFontSize.value);
  const rounded = parseFloat(ratio.toFixed(floatNum));
  if (lhRatioOutput) lhRatioOutput.value = rounded;
  if (lhPercentOutput) lhPercentOutput.value = parseFloat((ratio * 100).toFixed(Math.max(0, floatNum - 2))) + "%";
  if (lhEmOutput) lhEmOutput.value = rounded + "em";
}

const lhCalcBtn = document.getElementById("lh-calc-btn");
if (lhCalcBtn) lhCalcBtn.onclick = calcLineHeight;
if (lhPxInput) lhPxInput.addEventListener("keydown", (e) => { if (e.key === "Enter") calcLineHeight(); });
if (lhFontSize) lhFontSize.addEventListener("keydown", (e) => { if (e.key === "Enter") calcLineHeight(); });

// 2) line-height 비율 -> 행간 PX
const lh2FontSize = document.getElementById("lh2-font-size");
const lhRatioInput = document.getElementById("lh-ratio-input");
const lhPxOutput = document.getElementById("lh-px-output");

function calcLineHeightReverse() {
  if (!lhRatioInput || !lh2FontSize || lhRatioInput.value === "" || !lh2FontSize.value) return;
  const px = parseFloat(lhRatioInput.value) * parseFloat(lh2FontSize.value);
  if (lhPxOutput) lhPxOutput.value = parseFloat(px.toFixed(2)) + "px";
}

const lh2CalcBtn = document.getElementById("lh2-calc-btn");
if (lh2CalcBtn) lh2CalcBtn.onclick = calcLineHeightReverse;
if (lhRatioInput) lhRatioInput.addEventListener("keydown", (e) => { if (e.key === "Enter") calcLineHeightReverse(); });
if (lh2FontSize) lh2FontSize.addEventListener("keydown", (e) => { if (e.key === "Enter") calcLineHeightReverse(); });

// 복사 버튼 (비율 값 복사)
[
  { btn: "lh-copy-btn", val: "lh-ratio-output" },
  { btn: "lh2-copy-btn", val: "lh-px-output" }
].forEach((item) => {
  const btn = document.getElementById(item.btn);
  const out = document.getElementById(item.val);
  if (btn && out) {
    btn.onclick = function () { window.copyToClipboard(out.value, this); };
  }
});

// 초기화 버튼
const lhClearBtn = document.getElementById("lh-clear-btn");
if (lhClearBtn) {
  lhClearBtn.onclick = function () {
    ["lh-px-input", "lh-ratio-output", "lh-percent-output", "lh-em-output"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
  };
}
const lh2ClearBtn = document.getElementById("lh2-clear-btn");
if (lh2ClearBtn) {
  lh2ClearBtn.onclick = function () {
    ["lh-ratio-input", "lh-px-output"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
  };
}
