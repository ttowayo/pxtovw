document.addEventListener("DOMContentLoaded", function () {
  // --- Helper Functions ---
  function hexToRgba(hex, opacity) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
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
    btn.style.color = "#fff";
    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.background = "";
      btn.style.color = "";
    }, 1500);
  }

  // --- Box Shadow Generator ---
  const boxX = document.getElementById("box-x");
  const boxY = document.getElementById("box-y");
  const boxBlur = document.getElementById("box-blur");
  const boxSpread = document.getElementById("box-spread");
  const boxOpacity = document.getElementById("box-opacity");
  const boxColor = document.getElementById("box-color");
  const boxShadowColor = document.getElementById("box-shadow-color");
  const boxPreview = document.getElementById("box-shadow-preview");
  const boxCode = document.getElementById("box-shadow-code");

  function updateBoxShadow() {
    const x = boxX.value;
    const y = boxY.value;
    const blur = boxBlur.value;
    const spread = boxSpread.value;
    const opacity = boxOpacity.value;
    const color = boxColor.value;
    const shadowColor = hexToRgba(boxShadowColor.value, opacity);

    const shadowStr = `${x}px ${y}px ${blur}px ${spread}px ${shadowColor}`;
    boxPreview.style.boxShadow = shadowStr;
    boxPreview.style.backgroundColor = color;
    boxCode.innerText = `box-shadow: ${shadowStr};`;

    document.getElementById("box-x-val").innerText = `${x}px`;
    document.getElementById("box-y-val").innerText = `${y}px`;
    document.getElementById("box-blur-val").innerText = `${blur}px`;
    document.getElementById("box-spread-val").innerText = `${spread}px`;
    document.getElementById("box-opacity-val").innerText = opacity;
  }

  [boxX, boxY, boxBlur, boxSpread, boxOpacity, boxColor, boxShadowColor].forEach(
    (el) => el.addEventListener("input", updateBoxShadow),
  );

  // --- Text Shadow Generator ---
  const textX = document.getElementById("text-x");
  const textY = document.getElementById("text-y");
  const textBlur = document.getElementById("text-blur");
  const textOpacity = document.getElementById("text-opacity");
  const textColor = document.getElementById("text-color");
  const textShadowColor = document.getElementById("text-shadow-color");
  const textPreview = document.getElementById("text-shadow-preview");
  const textCode = document.getElementById("text-shadow-code");

  function updateTextShadow() {
    const x = textX.value;
    const y = textY.value;
    const blur = textBlur.value;
    const opacity = textOpacity.value;
    const color = textColor.value;
    const shadowColor = hexToRgba(textShadowColor.value, opacity);

    const shadowStr = `${x}px ${y}px ${blur}px ${shadowColor}`;
    textPreview.style.textShadow = shadowStr;
    textPreview.style.color = color;
    textCode.innerText = `text-shadow: ${shadowStr};`;

    document.getElementById("text-x-val").innerText = `${x}px`;
    document.getElementById("text-y-val").innerText = `${y}px`;
    document.getElementById("text-blur-val").innerText = `${blur}px`;
    document.getElementById("text-opacity-val").innerText = opacity;
  }

  [textX, textY, textBlur, textOpacity, textColor, textShadowColor].forEach(
    (el) => el.addEventListener("input", updateTextShadow),
  );

  // --- Border Radius Generator ---
  const brTL = document.getElementById("br-tl");
  const brTR = document.getElementById("br-tr");
  const brBR = document.getElementById("br-br");
  const brBL = document.getElementById("br-bl");
  const brF = document.getElementById("br-f");
  const brPreview = document.getElementById("border-radius-preview");
  const brCode = document.getElementById("border-radius-code");

  function updateBorderRadius() {
    const tl = brTL.value;
    const tr = brTR.value;
    const br = brBR.value;
    const bl = brBL.value;
    const f = brF.value;

    const tl2 = 100 - tl;
    const tr2 = 100 - tr;
    const br2 = 100 - br;
    const bl2 = 100 - bl;

    // Mixed shape generation logic
    const radiusStr = `${tl}% ${100 - tl}% ${tr}% ${100 - tr}% / ${f}% ${
      100 - f
    }% ${100 - f}% ${f}%`;
    brPreview.style.borderRadius = radiusStr;
    brCode.innerText = `border-radius: ${radiusStr};`;

    document.getElementById("br-tl-val").innerText = `${tl}%`;
    document.getElementById("br-tr-val").innerText = `${tr}%`;
    document.getElementById("br-br-val").innerText = `${br}%`;
    document.getElementById("br-bl-val").innerText = `${bl}%`;
    document.getElementById("br-f-val").innerText = `${f}%`;
  }

  [brTL, brTR, brBR, brBL, brF].forEach((el) =>
    el.addEventListener("input", updateBorderRadius),
  );

  // --- Glassmorphism Generator ---
  const glassBlur = document.getElementById("glass-blur");
  const glassOpacity = document.getElementById("glass-opacity");
  const glassBorder = document.getElementById("glass-border");
  const glassPreview = document.getElementById("glass-preview");
  const glassCode = document.getElementById("glass-code");

  function updateGlass() {
    const blur = glassBlur.value;
    const opacity = glassOpacity.value;
    const border = glassBorder.value;

    const bg = `rgba(255, 255, 255, ${opacity})`;
    const filter = `blur(${blur}px)`;
    const borderStr = `1px solid rgba(255, 255, 255, ${border})`;

    glassPreview.style.backgroundColor = bg;
    glassPreview.style.backdropFilter = filter;
    glassPreview.style.webkitBackdropFilter = filter;
    glassPreview.style.border = borderStr;

    glassCode.innerHTML = `background: ${bg};<br>backdrop-filter: ${filter};<br>border: ${borderStr};`;

    document.getElementById("glass-blur-val").innerText = `${blur}px`;
    document.getElementById("glass-opacity-val").innerText = opacity;
    document.getElementById("glass-border-val").innerText = border;
  }

  [glassBlur, glassOpacity, glassBorder].forEach((el) =>
    el.addEventListener("input", updateGlass),
  );

  // --- Neumorphism Generator ---
  const neuDist = document.getElementById("neu-dist");
  const neuInt = document.getElementById("neu-int");
  const neuBlur = document.getElementById("neu-blur");
  const neuShape = document.getElementById("neu-shape");
  const neuPreview = document.getElementById("neu-preview");
  const neuCode = document.getElementById("neu-code");

  function updateNeu() {
    const dist = parseInt(neuDist.value);
    const intensity = parseFloat(neuInt.value);
    const blur = parseInt(neuBlur.value);
    const shape = neuShape.value;

    const color = "#e0e0e0"; // Fixed base color for demo, could be dynamic
    // Calculate highlight and shadow colors based on intensity
    // For #e0e0e0 (224, 224, 224)
    const shadow = Math.round(224 * (1 - intensity));
    const highlight = Math.min(255, Math.round(224 * (1 + intensity)));

    const shadowHex = `#${shadow.toString(16).repeat(3)}`;
    const highlightHex = `#${highlight.toString(16).repeat(3)}`;

    let bg = color;
    if (shape === "concave") {
      bg = `linear-gradient(145deg, ${shadowHex}, ${highlightHex})`;
    } else if (shape === "convex") {
      bg = `linear-gradient(145deg, ${highlightHex}, ${shadowHex})`;
    }

    const shadowStr = `${dist}px ${dist}px ${blur}px ${shadowHex}, -${dist}px -${dist}px ${blur}px ${highlightHex}`;

    neuPreview.style.background = bg;
    neuPreview.style.boxShadow = shadowStr;
    neuCode.innerHTML = `background: ${bg};<br>box-shadow: ${shadowStr};`;

    document.getElementById("neu-dist-val").innerText = `${dist}px`;
    document.getElementById("neu-int-val").innerText = intensity;
    document.getElementById("neu-blur-val").innerText = `${blur}px`;
  }

  [neuDist, neuInt, neuBlur, neuShape].forEach((el) =>
    el.addEventListener("input", updateNeu),
  );

  // --- CSS Filter Effects Generator ---
  const filterBlur = document.getElementById("filter-blur");
  const filterBright = document.getElementById("filter-bright");
  const filterContrast = document.getElementById("filter-contrast");
  const filterGray = document.getElementById("filter-gray");
  const filterSaturate = document.getElementById("filter-saturate");
  const filterHue = document.getElementById("filter-hue");
  const filterSepia = document.getElementById("filter-sepia");
  const filterInvert = document.getElementById("filter-invert");
  const filterPreview = document.getElementById("filter-preview");
  const filterCode = document.getElementById("filter-code");

  function updateFilter() {
    const blur = filterBlur.value;
    const bright = filterBright.value;
    const contrast = filterContrast.value;
    const gray = filterGray.value;
    const saturate = filterSaturate.value;
    const hue = filterHue.value;
    const sepia = filterSepia.value;
    const invert = filterInvert.value;

    const filterStr = `blur(${blur}px) brightness(${bright}%) contrast(${contrast}%) grayscale(${gray}%) saturate(${saturate}%) hue-rotate(${hue}deg) sepia(${sepia}%) invert(${invert}%)`;
    
    filterPreview.style.filter = filterStr;
    filterCode.innerText = `filter: ${filterStr};`;

    document.getElementById("filter-blur-val").innerText = `${blur}px`;
    document.getElementById("filter-bright-val").innerText = `${bright}%`;
    document.getElementById("filter-contrast-val").innerText = `${contrast}%`;
    document.getElementById("filter-gray-val").innerText = `${gray}%`;
    document.getElementById("filter-saturate-val").innerText = `${saturate}%`;
    document.getElementById("filter-hue-val").innerText = `${hue}deg`;
    document.getElementById("filter-sepia-val").innerText = `${sepia}%`;
    document.getElementById("filter-invert-val").innerText = `${invert}%`;
  }

  [filterBlur, filterBright, filterContrast, filterGray, filterSaturate, filterHue, filterSepia, filterInvert].forEach(
    (el) => el.addEventListener("input", updateFilter),
  );

  // --- Copy Buttons ---
  document.querySelectorAll(".copy-code-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const text = document.getElementById(targetId).innerHTML;
      copyToClipboard(text, this);
    });
  });

  // Initial runs
  updateBoxShadow();
  updateTextShadow();
  updateBorderRadius();
  updateGlass();
  updateNeu();
  updateFilter();
});

