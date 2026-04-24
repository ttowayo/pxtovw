document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("css-input");
  const output = document.getElementById("css-output");
  const minifyBtn = document.getElementById("minify-btn");
  const formatBtn = document.getElementById("format-btn");
  const copyBtn = document.getElementById("copy-output-btn");
  const clearBtn = document.getElementById("clear-btn");
  const pasteBtn = document.getElementById("paste-btn");
  
  const inputCount = document.getElementById("input-char-count");
  const outputCount = document.getElementById("output-char-count");
  const reductionStat = document.getElementById("reduction-stat");

  function updateCounts() {
    if (!inputCount || !outputCount) return;
    inputCount.textContent = input.value.length.toLocaleString();
    outputCount.textContent = output.value.length.toLocaleString();
    
    if (input.value.length > 0 && output.value.length > 0 && reductionStat) {
      const reduction = ((input.value.length - output.value.length) / input.value.length * 100).toFixed(1);
      if (reduction > 0) {
        reductionStat.textContent = `Reduced by ${reduction}%`;
      } else {
        reductionStat.textContent = "";
      }
    } else if (reductionStat) {
      reductionStat.textContent = "";
    }
  }

  if (input) {
    input.addEventListener("input", updateCounts);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      input.value = "";
      output.value = "";
      updateCounts();
    });
  }

  if (pasteBtn) {
    pasteBtn.addEventListener("click", async () => {
      try {
        const text = await navigator.clipboard.readText();
        input.value = text;
        updateCounts();
      } catch (err) {
        alert("클립보드 접근 권한이 필요합니다.");
      }
    });
  }

  function minifyCSS(css) {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
      .replace(/\s+/g, " ") // Collapse whitespace
      .replace(/\s*([\{\}\:\;\,])\s*/g, "$1") // Remove spaces around symbols
      .replace(/\;\}/g, "}") // Remove last semicolon
      .trim();
  }

  function formatCSS(css) {
    // Minify first to get a clean string
    let clean = minifyCSS(css);
    
    let formatted = clean
      .replace(/\{/g, " {\n  ")
      .replace(/\}/g, "\n}\n\n")
      .replace(/\;/g, ";\n  ")
      .replace(/\,\s*/g, ", ")
      .replace(/:\s*/g, ": ")
      // Fix indentation for nested or closing braces
      .replace(/\n\s*\n/g, "\n")
      .replace(/\n\s*\}/g, "\n}")
      .trim();
    
    return formatted;
  }

  if (minifyBtn) {
    minifyBtn.addEventListener("click", () => {
      if (!input.value.trim()) return;
      output.value = minifyCSS(input.value);
      updateCounts();
    });
  }

  if (formatBtn) {
    formatBtn.addEventListener("click", () => {
      if (!input.value.trim()) return;
      output.value = formatCSS(input.value);
      updateCounts();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      if (!output.value) return;
      output.select();
      document.execCommand("copy");
      
      const originalText = this.textContent;
      this.textContent = "✅ 복사완료";
      setTimeout(() => {
        this.textContent = originalText;
      }, 1000);
    });
  }
});
