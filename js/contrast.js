document.addEventListener("DOMContentLoaded", function () {
  const bgPicker = document.getElementById("bg-picker");
  const bgHex = document.getElementById("bg-hex");
  const textPicker = document.getElementById("text-picker");
  const textHex = document.getElementById("text-hex");
  const previewBox = document.getElementById("preview-box");
  const ratioDisplay = document.getElementById("contrast-ratio");

  const smallAA = document.getElementById("small-aa");
  const smallAAA = document.getElementById("small-aaa");
  const largeAA = document.getElementById("large-aa");
  const largeAAA = document.getElementById("large-aaa");

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  function getLuminance(r, g, b) {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function updateContrast() {
    const bg = bgHex.value;
    const text = textHex.value;

    if (!/^#[0-9A-F]{6}$/i.test(bg) || !/^#[0-9A-F]{6}$/i.test(text)) return;

    previewBox.style.backgroundColor = bg;
    previewBox.style.color = text;

    const rgb1 = hexToRgb(bg);
    const rgb2 = hexToRgb(text);

    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    ratioDisplay.textContent = ratio.toFixed(2) + ":1";

    // Update Status
    updateStatus(smallAA, ratio >= 4.5);
    updateStatus(smallAAA, ratio >= 7);
    updateStatus(largeAA, ratio >= 3);
    updateStatus(largeAAA, ratio >= 4.5);
  }

  function updateStatus(el, passes) {
    el.textContent = passes ? "Pass" : "Fail";
    el.className = passes ? "badge pass" : "badge fail";
  }

  // Sync Listeners
  bgPicker.addEventListener("input", (e) => {
    bgHex.value = e.target.value.toUpperCase();
    updateContrast();
  });
  bgHex.addEventListener("input", (e) => {
    let val = e.target.value;
    if (!val.startsWith("#")) val = "#" + val;
    if (val.length === 7) {
      bgPicker.value = val;
      updateContrast();
    }
  });

  textPicker.addEventListener("input", (e) => {
    textHex.value = e.target.value.toUpperCase();
    updateContrast();
  });
  textHex.addEventListener("input", (e) => {
    let val = e.target.value;
    if (!val.startsWith("#")) val = "#" + val;
    if (val.length === 7) {
      textPicker.value = val;
      updateContrast();
    }
  });

  // Initialize
  updateContrast();
});
