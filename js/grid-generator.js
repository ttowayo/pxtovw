document.addEventListener("DOMContentLoaded", function () {
  // --- DOM Elements ---
  const colsInput = document.getElementById("grid-cols");
  const rowsInput = document.getElementById("grid-rows");
  const colGapInput = document.getElementById("col-gap");
  const rowGapInput = document.getElementById("row-gap");
  const colWidthInput = document.getElementById("col-width");
  const colUnitSelect = document.getElementById("col-unit");
  const rowHeightInput = document.getElementById("row-height");
  const rowUnitSelect = document.getElementById("row-unit");

  const visualizer = document.getElementById("grid-visualizer");
  const codeDisplay = document.getElementById("grid-code-display");
  const copyBtn = document.getElementById("copy-grid-code");

  // --- Functions ---

  function updateGrid() {
    const cols = parseInt(colsInput.value) || 1;
    const rows = parseInt(rowsInput.value) || 1;
    const colGap = colGapInput.value || 0;
    const rowGap = rowGapInput.value || 0;
    
    const colWidth = colWidthInput.value;
    const colUnit = colUnitSelect.value;
    const rowHeight = rowHeightInput.value;
    const rowUnit = rowUnitSelect.value;

    // Build Column Template
    let colTemplate = "";
    if (colWidth.includes(" ")) {
      colTemplate = colWidth;
    } else {
      colTemplate = `repeat(${cols}, ${colWidth}${colUnit === 'auto' ? '' : colUnit})`;
    }

    // Build Row Template
    let rowTemplate = "";
    if (rowHeight.includes(" ")) {
      rowTemplate = rowHeight;
    } else {
      rowTemplate = `repeat(${rows}, ${rowHeight}${rowUnit === 'auto' ? '' : rowUnit})`;
    }

    // Apply Styles to Visualizer
    visualizer.style.gridTemplateColumns = colTemplate;
    visualizer.style.gridTemplateRows = rowTemplate;
    visualizer.style.columnGap = `${colGap}px`;
    visualizer.style.rowGap = `${rowGap}px`;

    // Clear and Redraw Grid Items
    visualizer.innerHTML = "";
    const totalItems = cols * rows;
    for (let i = 1; i <= totalItems; i++) {
      const item = document.createElement("div");
      item.className = "grid-item-sample";
      item.innerText = i;
      visualizer.appendChild(item);
    }

    // Update Code Display
    const code = `display: grid;
grid-template-columns: ${colTemplate};
grid-template-rows: ${rowTemplate};
gap: ${rowGap}px ${colGap}px;`;

    codeDisplay.innerHTML = code.replace(/\n/g, "<br>");
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

  [colsInput, rowsInput, colGapInput, rowGapInput, colWidthInput, colUnitSelect, rowHeightInput, rowUnitSelect].forEach(input => {
    input.addEventListener("input", updateGrid);
  });

  copyBtn.addEventListener("click", function() {
    copyToClipboard(codeDisplay.innerHTML, this);
  });

  // Initial Run
  updateGrid();
});
