document.addEventListener("DOMContentLoaded", function () {
  const hexInput = document.getElementById("hex-input");
  const rgbInput = document.getElementById("rgb-input");
  const hslInput = document.getElementById("hsl-input");
  const preview = document.getElementById("color-preview");
  const hexDisplay = document.getElementById("preview-hex-display");
  const mainPicker = document.getElementById("main-color-picker");
  const variantsContainer = document.getElementById("color-variants");
  const chips = document.querySelectorAll(".color-chip");
  const copyBtns = document.querySelectorAll(".copy-btn");

  // HEX to RGB
  function hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex.split("").map(s => s + s).join("");
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }

  // RGB to HEX
  function rgbToHex(r, g, b) {
    const toHex = (c) => {
      const hex = Math.max(0, Math.min(255, c)).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + toHex(r) + toHex(g) + toHex(b);
  }

  // RGB to HSL
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  // HSL to RGB
  function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  function updateFromHex(hexValue) {
    const val = hexValue || hexInput.value;
    const rgb = hexToRgb(val);
    if (rgb) {
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      hexInput.value = hex;
      rgbInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      mainPicker.value = hex;
      updatePreview(hex);
      generateVariants(hsl.h, hsl.s);
    }
  }

  function updateFromRgb() {
    const matches = rgbInput.value.match(/\d+/g);
    if (matches && matches.length >= 3) {
      const r = parseInt(matches[0]), g = parseInt(matches[1]), b = parseInt(matches[2]);
      const hex = rgbToHex(r, g, b);
      hexInput.value = hex;
      const hsl = rgbToHsl(r, g, b);
      hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      mainPicker.value = hex;
      updatePreview(hex);
      generateVariants(hsl.h, hsl.s);
    }
  }

  function updateFromHsl() {
    const matches = hslInput.value.match(/\d+/g);
    if (matches && matches.length >= 3) {
      const h = parseInt(matches[0]), s = parseInt(matches[1]), l = parseInt(matches[2]);
      const rgb = hslToRgb(h, s, l);
      rgbInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      hexInput.value = hex;
      mainPicker.value = hex;
      updatePreview(hex);
      generateVariants(h, s);
    }
  }

  function updatePreview(color) {
    preview.style.backgroundColor = color;
    preview.style.boxShadow = `0 10px 30px ${color}4D`; // 4D is 30% alpha
    hexDisplay.textContent = color.toUpperCase();
    
    const rgb = hexToRgb(color);
    if (rgb) {
      const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
      preview.style.color = brightness > 125 ? "#333" : "#fff";
    }
  }

  function generateVariants(h, s) {
    variantsContainer.innerHTML = "";
    const lightSteps = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    
    lightSteps.forEach(l => {
      const rgb = hslToRgb(h, s, l);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      
      const variant = document.createElement("div");
      variant.className = "variant-item";
      variant.style.textAlign = "center";
      variant.innerHTML = `
        <div style="background: ${hex}; height: 40px; border-radius: 8px; cursor: pointer; border: 1px solid #eee;" onclick="window.updateColorFromVariant('${hex}')"></div>
        <span style="font-size: 10px; color: #888; font-family: monospace;">${l}%</span>
      `;
      variantsContainer.appendChild(variant);
    });
  }

  window.updateColorFromVariant = (hex) => {
    updateFromHex(hex);
  };

  hexInput.addEventListener("input", () => updateFromHex());
  rgbInput.addEventListener("input", updateFromRgb);
  hslInput.addEventListener("input", updateFromHsl);

  mainPicker.addEventListener("input", (e) => {
    updateFromHex(e.target.value);
  });

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const color = chip.getAttribute("data-color");
      updateFromHex(color);
    });
  });

  // Initial variants
  updateFromHex(hexInput.value);

  copyBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);
      input.select();
      document.execCommand("copy");
      
      const originalText = this.textContent;
      this.textContent = "Copied!";
      setTimeout(() => {
        this.textContent = originalText;
      }, 1000);
    });
  });
});
