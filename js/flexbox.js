document.addEventListener("DOMContentLoaded", function () {
  const previewBox = document.getElementById("flex-preview-box");
  const containerCode = document.getElementById("container-code");
  const gapSlider = document.getElementById("flex-gap");
  const gapVal = document.getElementById("gap-val");
  const addItemBtn = document.getElementById("add-item-btn");
  const removeItemBtn = document.getElementById("remove-item-btn");
  const copyBtns = document.querySelectorAll(".btn-copy-code");
  const propGroups = document.querySelectorAll(".flex-btn-group");

  let currentSettings = {
    "flex-direction": "row",
    "justify-content": "flex-start",
    "align-items": "stretch",
    "flex-wrap": "nowrap",
    gap: "10px",
  };

  function updatePreview() {
    // Apply styles to preview box
    Object.keys(currentSettings).forEach((prop) => {
      previewBox.style[prop] = currentSettings[prop];
    });

    // Generate CSS Code
    const css = `.container {
  display: flex;
  flex-direction: ${currentSettings["flex-direction"]};
  justify-content: ${currentSettings["justify-content"]};
  align-items: ${currentSettings["align-items"]};
  flex-wrap: ${currentSettings["flex-wrap"]};
  gap: ${currentSettings["gap"]};
}`;
    containerCode.textContent = css;
  }

  // Property Button Listeners
  propGroups.forEach((group) => {
    const prop = group.dataset.prop;
    const buttons = group.querySelectorAll("button");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Update UI
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Update State
        currentSettings[prop] = btn.dataset.value;
        updatePreview();
      });
    });
  });

  // Gap Slider
  gapSlider.addEventListener("input", (e) => {
    const val = e.target.value;
    gapVal.textContent = val;
    currentSettings.gap = `${val}px`;
    updatePreview();
  });

  // Add/Remove Items
  addItemBtn.addEventListener("click", () => {
    const itemCount = previewBox.children.length;
    if (itemCount >= 20) return;
    
    const newItem = document.createElement("div");
    newItem.className = "flex-item";
    newItem.textContent = itemCount + 1;
    previewBox.appendChild(newItem);
  });

  removeItemBtn.addEventListener("click", () => {
    const itemCount = previewBox.children.length;
    if (itemCount <= 1) return;
    previewBox.removeChild(previewBox.lastElementChild);
  });

  // Copy Buttons
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const text = document.getElementById(targetId).textContent;
      
      navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.textContent;
        btn.textContent = "✅ Copied";
        btn.style.background = "#2b8a3e";
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = "#2196f3";
        }, 1500);
      });
    });
  });

  // Initialize
  updatePreview();
});
