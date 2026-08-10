// 자간(Letter Spacing) 변환기

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
Array.from(document.getElementsByClassName("ls-preset-btn")).forEach((btn) => {
  btn.onclick = function () {
    const fontSize = document.getElementById("ls-font-size");
    if (fontSize) fontSize.value = this.getAttribute("data-value");
  };
});

// 1) 자간 PX -> EM (폰트 크기 기준)
const lsFontSize = document.getElementById("ls-font-size");
const lsFloat = document.getElementById("ls-float");
const lsPxInput = document.getElementById("ls-px-input");
const lsEmOutput = document.getElementById("ls-em-output");
const lsUnitCheck = document.getElementById("ls-unit-check");

function calcLsPxToEm() {
  if (!lsPxInput || !lsFontSize || lsPxInput.value === "" || !lsFontSize.value) return;
  const floatNum = Math.min(5, parseInt(lsFloat ? lsFloat.value : 3) || 3);
  let result = (parseFloat(lsPxInput.value) / parseFloat(lsFontSize.value)).toFixed(floatNum);
  if (lsUnitCheck && lsUnitCheck.checked) result += "em";
  if (lsEmOutput) lsEmOutput.value = result;
}

const lsPxBtn = document.getElementById("ls-px-btn");
if (lsPxBtn) lsPxBtn.onclick = calcLsPxToEm;
if (lsPxInput) lsPxInput.addEventListener("keydown", (e) => { if (e.key === "Enter") calcLsPxToEm(); });
if (lsFontSize) lsFontSize.addEventListener("keydown", (e) => { if (e.key === "Enter") calcLsPxToEm(); });

// 2) 피그마 % -> EM
const lsFigmaInput = document.getElementById("ls-figma-input");
const lsFigmaOutput = document.getElementById("ls-figma-output");

function calcLsFigma() {
  if (!lsFigmaInput || lsFigmaInput.value === "") return;
  const em = parseFloat(lsFigmaInput.value) / 100;
  if (lsFigmaOutput) lsFigmaOutput.value = parseFloat(em.toFixed(4)) + "em";
}

const lsFigmaBtn = document.getElementById("ls-figma-btn");
if (lsFigmaBtn) lsFigmaBtn.onclick = calcLsFigma;
if (lsFigmaInput) lsFigmaInput.addEventListener("keydown", (e) => { if (e.key === "Enter") calcLsFigma(); });

// 3) 포토샵/일러스트 VA -> EM
const lsPsInput = document.getElementById("ls-ps-input");
const lsPsOutput = document.getElementById("ls-ps-output");

function calcLsPs() {
  if (!lsPsInput || lsPsInput.value === "") return;
  const em = parseFloat(lsPsInput.value) / 1000;
  if (lsPsOutput) lsPsOutput.value = parseFloat(em.toFixed(4)) + "em";
}

const lsPsBtn = document.getElementById("ls-ps-btn");
if (lsPsBtn) lsPsBtn.onclick = calcLsPs;
if (lsPsInput) lsPsInput.addEventListener("keydown", (e) => { if (e.key === "Enter") calcLsPs(); });

// 복사 버튼
[
  { btn: "ls-px-copy-btn", val: "ls-em-output" },
  { btn: "ls-figma-copy-btn", val: "ls-figma-output" },
  { btn: "ls-ps-copy-btn", val: "ls-ps-output" }
].forEach((item) => {
  const btn = document.getElementById(item.btn);
  const out = document.getElementById(item.val);
  if (btn && out) {
    btn.onclick = function () { window.copyToClipboard(out.value, this); };
  }
});

// 초기화 버튼
[
  { btn: "ls-px-clear-btn", in: "ls-px-input", out: "ls-em-output" },
  { btn: "ls-figma-clear-btn", in: "ls-figma-input", out: "ls-figma-output" },
  { btn: "ls-ps-clear-btn", in: "ls-ps-input", out: "ls-ps-output" }
].forEach((item) => {
  const btn = document.getElementById(item.btn);
  const inn = document.getElementById(item.in);
  const out = document.getElementById(item.out);
  if (btn && inn && out) {
    btn.onclick = function () { inn.value = ""; out.value = ""; };
  }
});
