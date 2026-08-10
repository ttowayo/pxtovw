// px -> em 변환 함수
function pxToEm(px, base, floatNum) {
  if (!px || !base) return "";
  return (parseFloat(px) / parseFloat(base)).toFixed(floatNum);
}
// em -> px 변환 함수
function emToPx(em, base, floatNum) {
  if (!em || !base) return "";
  return (parseFloat(em) * parseFloat(base)).toFixed(floatNum);
}

// 프리셋 버튼
Array.from(document.getElementsByClassName("em-preset-btn")).forEach((btn) => {
  btn.onclick = function () {
    const value = this.getAttribute("data-value");
    const em1Base = document.getElementById("em1-base");
    const cssEm1Base = document.getElementById("css-em1-base");
    if (em1Base) em1Base.value = value;
    if (cssEm1Base) cssEm1Base.value = value;
  };
});
Array.from(document.getElementsByClassName("em2-preset-btn")).forEach((btn) => {
  btn.onclick = function () {
    const value = this.getAttribute("data-value");
    const em2Base = document.getElementById("em2-base");
    const cssEm2Base = document.getElementById("css-em2-base");
    if (em2Base) em2Base.value = value;
    if (cssEm2Base) cssEm2Base.value = value;
  };
});

// px -> em 단일 변환
const emPxInput = document.getElementById("em-px-input");
const emOutput = document.getElementById("em-output");
const em1Base = document.getElementById("em1-base");
const em1Float = document.getElementById("em1-float");
const emUnitCheck = document.getElementById("em-unit-check");

function calcPxToEm() {
  if (!emPxInput || !em1Base || !emPxInput.value || !em1Base.value) return;
  let result = pxToEm(
    emPxInput.value,
    em1Base.value,
    Math.min(5, parseInt(em1Float ? em1Float.value : 3) || 3)
  );
  if (emUnitCheck && emUnitCheck.checked) {
    result += "em";
  }
  if (emOutput) emOutput.value = result;
}

const pxToEmBtn = document.getElementById("px-to-em-btn");
if (pxToEmBtn) pxToEmBtn.onclick = calcPxToEm;
if (emPxInput) emPxInput.addEventListener("keydown", (e) => { if (e.key === "Enter") calcPxToEm(); });
if (em1Base) em1Base.addEventListener("keydown", (e) => { if (e.key === "Enter") calcPxToEm(); });

// em -> px 단일 변환
const emInput = document.getElementById("em-input");
const emPxOutput = document.getElementById("em-px-output");
const em2Base = document.getElementById("em2-base");
const emPxNoFloat = document.getElementById("em-px-no-float");
const emPxUnitCheck = document.getElementById("em-px-unit-check");

function calcEmToPx() {
  if (!emInput || !em2Base || !emInput.value || !em2Base.value) return;
  let result;
  if (!emPxNoFloat || emPxNoFloat.checked) {
    result = Math.round(emToPx(emInput.value, em2Base.value, 5));
  } else {
    result = emToPx(emInput.value, em2Base.value, 1);
  }
  if (emPxUnitCheck && emPxUnitCheck.checked) {
    result += "px";
  }
  if (emPxOutput) emPxOutput.value = result;
}

const emToPxBtn = document.getElementById("em-to-px-btn");
if (emToPxBtn) emToPxBtn.onclick = calcEmToPx;
if (emInput) emInput.addEventListener("keydown", (e) => { if (e.key === "Enter") calcEmToPx(); });
if (em2Base) em2Base.addEventListener("keydown", (e) => { if (e.key === "Enter") calcEmToPx(); });

// CSS 일괄 변환: px -> em
const cssEm1Input = document.getElementById("css-em1-input");
const cssEm1Output = document.getElementById("css-em1-output");
const cssEm1Base = document.getElementById("css-em1-base");
const cssEm1Float = document.getElementById("css-em1-float");
const cssEm1Btn = document.getElementById("css-em1-btn");

if (cssEm1Btn) {
  cssEm1Btn.onclick = function () {
    if (!cssEm1Input.value || !cssEm1Base.value) return;
    const floatNum = Math.min(5, parseInt(cssEm1Float ? cssEm1Float.value : 3) || 3);
    cssEm1Output.value = cssEm1Input.value.replace(
      /(\d+\.?\d*)px/g,
      (m, p1) => pxToEm(p1, cssEm1Base.value, floatNum) + "em"
    );
  };
}

// CSS 일괄 변환: em -> px
const cssEm2Input = document.getElementById("css-em2-input");
const cssEm2Output = document.getElementById("css-em2-output");
const cssEm2Base = document.getElementById("css-em2-base");
const cssEm2NoFloat = document.getElementById("css-em2-no-float");
const cssEm2Btn = document.getElementById("css-em2-btn");

if (cssEm2Btn) {
  cssEm2Btn.onclick = function () {
    if (!cssEm2Input.value || !cssEm2Base.value) return;
    const noFloat = !cssEm2NoFloat || cssEm2NoFloat.checked;
    let result = cssEm2Input.value.replace(
      /(\d+\.?\d*)em/g,
      (m, p1) => emToPx(p1, cssEm2Base.value, noFloat ? 5 : 1) + "px"
    );
    if (noFloat) {
      result = result.replace(
        /([0-9]+\.[0-9]+)px/g,
        (m, p1) => Math.round(parseFloat(p1)) + "px"
      );
    }
    cssEm2Output.value = result;
  };
}

// 카피 버튼
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

[
  { btn: "em-copy-btn", val: "em-output" },
  { btn: "em-px-copy-btn", val: "em-px-output" },
  { btn: "css-em1-copy-btn", val: "css-em1-output" },
  { btn: "css-em2-copy-btn", val: "css-em2-output" }
].forEach((item) => {
  const btn = document.getElementById(item.btn);
  const out = document.getElementById(item.val);
  if (btn && out) {
    btn.onclick = function () { window.copyToClipboard(out.value, this); };
  }
});

// 초기화 버튼
[
  { btn: "em-clear-btn", in: "em-px-input", out: "em-output" },
  { btn: "em-px-clear-btn", in: "em-input", out: "em-px-output" },
  { btn: "css-em1-clear-btn", in: "css-em1-input", out: "css-em1-output" },
  { btn: "css-em2-clear-btn", in: "css-em2-input", out: "css-em2-output" }
].forEach((item) => {
  const btn = document.getElementById(item.btn);
  const inn = document.getElementById(item.in);
  const out = document.getElementById(item.out);
  if (btn && inn && out) {
    btn.onclick = function () { inn.value = ""; out.value = ""; };
  }
});
