document.addEventListener("DOMContentLoaded", function () {
  // --- DOM Elements ---
  const baseWInput = document.getElementById("base-w");
  const baseHInput = document.getElementById("base-h");
  const calcWInput = document.getElementById("calc-w");
  const calcHInput = document.getElementById("calc-h");
  const previewBox = document.getElementById("ratio-preview-box");
  const modernCode = document.getElementById("modern-code");
  const legacyCode = document.getElementById("legacy-code");

  // --- Functions ---

  function updateAll(triggerSource) {
    let bw = parseFloat(baseWInput.value) || 1;
    let bh = parseFloat(baseHInput.value) || 1;
    let cw = parseFloat(calcWInput.value) || 0;
    let ch = parseFloat(calcHInput.value) || 0;

    if (triggerSource === "w") {
      ch = Math.round(cw * (bh / bw));
      calcHInput.value = ch;
    } else if (triggerSource === "h") {
      cw = Math.round(ch * (bw / bh));
      calcWInput.value = cw;
    } else {
      // Base ratio changed, update height based on current width
      ch = Math.round(cw * (bh / bw));
      calcHInput.value = ch;
    }

    // Update Preview
    const paddingVal = ((bh / bw) * 100).toFixed(2);
    previewBox.style.width = "100%";
    previewBox.style.aspectRatio = `${bw} / ${bh}`;
    previewBox.setAttribute("data-dimensions", `${calcWInput.value} x ${calcHInput.value}`);

    // Update Code
    modernCode.innerText = `aspect-ratio: ${bw} / ${bh};`;
    legacyCode.innerHTML = `.container {
  position: relative;
  width: 100%;
  padding-top: ${paddingVal}%; /* (${bh} / ${bw}) * 100 */
}
.content {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
}`.replace(/\n/g, "<br>");
  }

  // --- Event Listeners ---

  baseWInput.addEventListener("input", () => updateAll("base"));
  baseHInput.addEventListener("input", () => updateAll("base"));
  calcWInput.addEventListener("input", () => updateAll("w"));
  calcHInput.addEventListener("input", () => updateAll("h"));

  document.querySelectorAll(".preset-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      baseWInput.value = this.dataset.w;
      baseHInput.value = this.dataset.h;
      updateAll("base");
    });
  });

  // Initial Run
  updateAll("base");
});
