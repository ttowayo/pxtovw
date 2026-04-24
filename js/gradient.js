document.addEventListener("DOMContentLoaded", function () {
  const preview = document.getElementById("gradient-preview");
  const codeResult = document.getElementById("gradient-code-result");
  const copyBtn = document.getElementById("copy-gradient-btn");
  const typeBtns = document.querySelectorAll(".btn-type");
  const angleSlider = document.getElementById("gradient-angle");
  const angleVal = document.getElementById("angle-val");
  const stopsList = document.getElementById("stops-list");
  const addStopBtn = document.getElementById("add-stop-btn");
  const presetGrid = document.getElementById("preset-grid");
  const angleControlBox = document.getElementById("angle-control-box");

  let gradientType = "linear";
  let angle = 135;
  let stops = [
    { color: "#667eea", position: 0 },
    { color: "#764ba2", position: 100 },
  ];

  const presets = [
    { name: "Sublime Light", colors: ["#6a11cb", "#2575fc"] },
    { name: "Sunset", colors: ["#ff5f6d", "#ffc371"] },
    { name: "Deep Ocean", colors: ["#2193b0", "#6dd5ed"] },
    { name: "Emerald", colors: ["#348f50", "#56b4d3"] },
    { name: "Purple Bliss", colors: ["#360033", "#0b8793"] },
    { name: "Lush", colors: ["#a8ff78", "#78ffd6"] },
    { name: "Royal", colors: ["#141e30", "#243b55"] },
    { name: "Fire", colors: ["#f12711", "#f5af19"] },
  ];

  function init() {
    renderStops();
    renderPresets();
    updateGradient();
  }

  function renderStops() {
    stopsList.innerHTML = "";
    stops.sort((a, b) => a.position - b.position);

    stops.forEach((stop, index) => {
      const stopEl = document.createElement("div");
      stopEl.className = "stop-item";
      stopEl.innerHTML = `
        <input type="color" value="${stop.color}" data-index="${index}" class="stop-color" />
        <input type="number" value="${stop.position}" data-index="${index}" class="stop-pos" min="0" max="100" />
        <span style="font-size: 12px; color: #888;">%</span>
        <div style="flex: 1;"></div>
        ${stops.length > 2 ? `<button class="remove-stop" data-index="${index}">&times;</button>` : ""}
      `;
      stopsList.appendChild(stopEl);
    });

    // Add listeners
    document.querySelectorAll(".stop-color").forEach((input) => {
      input.addEventListener("input", (e) => {
        const idx = e.target.dataset.index;
        stops[idx].color = e.target.value;
        updateGradient();
      });
    });

    document.querySelectorAll(".stop-pos").forEach((input) => {
      input.addEventListener("input", (e) => {
        const idx = e.target.dataset.index;
        stops[idx].position = parseInt(e.target.value) || 0;
        updateGradient();
      });
    });

    document.querySelectorAll(".remove-stop").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.currentTarget.dataset.index;
        stops.splice(idx, 1);
        renderStops();
        updateGradient();
      });
    });
  }

  function renderPresets() {
    presetGrid.innerHTML = "";
    presets.forEach((preset) => {
      const pEl = document.createElement("div");
      pEl.className = "preset-item";
      pEl.style.background = `linear-gradient(135deg, ${preset.colors.join(", ")})`;
      pEl.title = preset.name;
      pEl.onclick = () => applyPreset(preset.colors);
      presetGrid.appendChild(pEl);
    });
  }

  function applyPreset(colors) {
    stops = colors.map((c, i) => ({
      color: c,
      position: Math.round((i / (colors.length - 1)) * 100),
    }));
    renderStops();
    updateGradient();
  }

  function updateGradient() {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopString = sortedStops
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ");

    let gradientString = "";
    if (gradientType === "linear") {
      gradientString = `linear-gradient(${angle}deg, ${stopString})`;
    } else {
      gradientString = `radial-gradient(circle, ${stopString})`;
    }

    const fullCss = `background: ${gradientString};`;
    preview.style.background = gradientString;
    preview.style.boxShadow = `0 15px 45px rgba(0,0,0,0.15)`;
    codeResult.textContent = fullCss;
  }

  // Events
  typeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      typeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      gradientType = btn.dataset.type;
      
      if (gradientType === "radial") {
        angleControlBox.style.display = "none";
      } else {
        angleControlBox.style.display = "block";
      }
      
      updateGradient();
    });
  });

  angleSlider.addEventListener("input", (e) => {
    angle = e.target.value;
    angleVal.textContent = angle;
    updateGradient();
  });

  addStopBtn.addEventListener("click", () => {
    if (stops.length >= 10) return;
    stops.push({ color: "#ffffff", position: 50 });
    renderStops();
    updateGradient();
  });

  copyBtn.addEventListener("click", function () {
    const text = codeResult.textContent;
    navigator.clipboard.writeText(text).then(() => {
      const originalText = this.textContent;
      this.textContent = "✅ Copied!";
      setTimeout(() => {
        this.textContent = originalText;
      }, 1500);
    });
  });

  init();
});
