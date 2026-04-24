document.addEventListener("DOMContentLoaded", function () {
  // --- DOM Elements ---
  const heightInput = document.getElementById("div-height");
  const freqInput = document.getElementById("div-freq");
  const flipHInput = document.getElementById("div-flip-h");
  const invertInput = document.getElementById("div-invert");
  const divColorInput = document.getElementById("div-color");
  const bgColorInput = document.getElementById("bg-color");

  const canvasTop = document.getElementById("canvas-top");
  const canvasBottom = document.getElementById("canvas-bottom");
  const dividerOutput = document.getElementById("divider-output");
  const codeDisplay = document.getElementById("div-code-display");
  const copyBtn = document.getElementById("copy-div-code");

  let currentShape = "wave";

  // --- Path Generation Logic ---

  function generatePath(shape, height, freq, flipH, invert) {
    const w = 1000; // Standard viewbox width
    const h = parseInt(height);
    const f = parseInt(freq);
    
    let path = "";

    if (shape === "wave") {
      path = `M0 100 V${100 - h / 10} `;
      for (let i = 0; i <= w; i += 10) {
        const angle = (i / w) * Math.PI * 2 * f;
        const y = (100 - h / 10) + Math.sin(angle) * (h / 20);
        path += `L${i} ${y} `;
      }
      path += `V100 H0 Z`;
    } else if (shape === "curve") {
      path = `M0 100 V${100 - h / 10} Q${w / 2} ${100 - h / 5} ${w} ${100 - h / 10} V100 H0 Z`;
    } else if (shape === "slant") {
      path = `M0 100 V${100 - h / 10} L${w} ${100} V100 H0 Z`;
    } else if (shape === "triangle") {
      path = `M0 100 V100 L${w / 2} ${100 - h / 10} L${w} 100 V100 H0 Z`;
    }

    return path;
  }

  function updateDivider() {
    const h = heightInput.value;
    const f = freqInput.value;
    const flipH = flipHInput.checked;
    const invert = invertInput.checked;
    const divColor = divColorInput.value;
    const bgColor = bgColorInput.value;

    // Update labels
    document.getElementById("h-val").innerText = h + "px";
    document.getElementById("f-val").innerText = f;

    // Update Canvas Colors
    canvasTop.style.backgroundColor = bgColor;
    canvasBottom.style.backgroundColor = divColor;

    // Generate Path
    const pathData = generatePath(currentShape, h, f, flipH, invert);
    
    // Build SVG
    let transform = "";
    if (flipH && invert) transform = 'transform="scale(-1, -1)" transform-origin="center"';
    else if (flipH) transform = 'transform="scale(-1, 1)" transform-origin="center"';
    else if (invert) transform = 'transform="scale(1, -1)" transform-origin="center"';

    const svgHTML = `<svg viewBox="0 0 1000 100" preserveAspectRatio="none" style="width: 100%; height: ${h}px; fill: ${divColor};">
  <path d="${pathData}" ${transform}></path>
</svg>`;

    dividerOutput.innerHTML = svgHTML;

    // Update Code
    codeDisplay.innerText = svgHTML;
  }

  // --- Event Listeners ---

  document.querySelectorAll(".shape-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".shape-btn").forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      currentShape = this.dataset.shape;
      updateDivider();
    });
  });

  [heightInput, freqInput, flipHInput, invertInput, divColorInput, bgColorInput].forEach((el) => {
    el.addEventListener("input", updateDivider);
  });

  copyBtn.addEventListener("click", function () {
    const text = codeDisplay.innerText;
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);

    const originalText = this.innerText;
    this.innerText = "Copied!";
    this.style.background = "#4caf50";
    setTimeout(() => {
      this.innerText = originalText;
      this.style.background = "";
    }, 1500);
  });

  // Initial Run
  updateDivider();
});
