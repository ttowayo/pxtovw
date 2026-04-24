document.addEventListener("DOMContentLoaded", function () {
  // --- DOM Elements ---
  const durationInput = document.getElementById("anim-duration");
  const delayInput = document.getElementById("anim-delay");
  const timingSelect = document.getElementById("anim-timing");
  const iterationSelect = document.getElementById("anim-iteration");

  const txInput = document.getElementById("anim-tx");
  const tyInput = document.getElementById("anim-ty");
  const rotInput = document.getElementById("anim-rot");
  const scaleInput = document.getElementById("anim-scale");
  const opInput = document.getElementById("anim-op");

  const previewBox = document.getElementById("preview-box");
  const codeDisplay = document.getElementById("anim-code-display");
  const copyBtn = document.getElementById("copy-anim-code");

  // Create a dynamic style tag for @keyframes
  let styleTag = document.getElementById("dynamic-anim-style");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "dynamic-anim-style";
    document.head.appendChild(styleTag);
  }

  // --- Functions ---

  function updateAnimation() {
    const dur = durationInput.value;
    const del = delayInput.value;
    const timing = timingSelect.value;
    const iteration = iterationSelect.value;

    const tx = txInput.value;
    const ty = tyInput.value;
    const rot = rotInput.value;
    const scale = scaleInput.value;
    const op = opInput.value;

    // Update labels
    document.getElementById("dur-val").innerText = dur + "s";
    document.getElementById("del-val").innerText = del + "s";
    document.getElementById("tx-val").innerText = tx + "px";
    document.getElementById("ty-val").innerText = ty + "px";
    document.getElementById("rot-val").innerText = rot + "deg";
    document.getElementById("scale-val").innerText = scale;
    document.getElementById("op-val").innerText = op;

    // Define Keyframes
    const keyframesName = "customAnim";
    const keyframesCSS = `@keyframes ${keyframesName} {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${scale});
    opacity: ${op};
  }
}`;

    styleTag.innerHTML = keyframesCSS;

    // Apply Animation to Preview Box
    // Force reflow to restart animation
    previewBox.style.animation = "none";
    void previewBox.offsetWidth; 
    previewBox.style.animation = `${keyframesName} ${dur}s ${timing} ${del}s ${iteration} alternate`;

    // Update Code Display
    const fullCode = `.animate-me {
  animation: ${keyframesName} ${dur}s ${timing} ${del}s ${iteration} alternate;
}

${keyframesCSS}`;

    codeDisplay.innerHTML = fullCode.replace(/\n/g, "<br>");
  }

  function applyPreset(preset) {
    // Default resets
    txInput.value = 0;
    tyInput.value = 0;
    rotInput.value = 0;
    scaleInput.value = 1;
    opInput.value = 1;
    durationInput.value = 1;

    if (preset === "shake") {
        styleTag.innerHTML = `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}`;
        previewBox.style.animation = "none"; void previewBox.offsetWidth;
        previewBox.style.animation = "shake 0.5s ease-in-out infinite";
        codeDisplay.innerHTML = `.animate-shake { animation: shake 0.5s ease-in-out infinite; }\n\n@keyframes shake { ... }`.replace(/\n/g, "<br>");
        return; // Presets handle their own code for complex ones
    } else if (preset === "pulse") {
        scaleInput.value = 1.2;
    } else if (preset === "bounce") {
        tyInput.value = -30;
        timingSelect.value = "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    } else if (preset === "heartbeat") {
        scaleInput.value = 1.3;
        durationInput.value = 0.8;
    }

    updateAnimation();
  }

  function copyToClipboard(text, btn) {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = text.replace(/<br>/g, "\n");
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);

    const originalText = btn.innerText;
    btn.innerText = "Copied!";
    btn.style.background = "#4caf50";
    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.background = "";
    }, 1500);
  }

  // --- Event Listeners ---

  [durationInput, delayInput, timingSelect, iterationSelect, txInput, tyInput, rotInput, scaleInput, opInput].forEach(input => {
    input.addEventListener("input", updateAnimation);
  });

  document.querySelectorAll(".preset-btn").forEach(btn => {
    btn.addEventListener("click", () => applyPreset(btn.dataset.preset));
  });

  copyBtn.addEventListener("click", function() {
    copyToClipboard(codeDisplay.innerHTML, this);
  });

  // Initial Run
  updateAnimation();
});
