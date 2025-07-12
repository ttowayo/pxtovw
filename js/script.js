// px -> vw 변환 함수
function pxToVw(px, viewport, floatNum) {
  if (!px || !viewport) return "";
  return ((parseFloat(px) / parseFloat(viewport)) * 100).toFixed(floatNum);
}
// vw -> px 변환 함수
function vwToPx(vw, viewport, floatNum) {
  if (!vw || !viewport) return "";
  return ((parseFloat(vw) * parseFloat(viewport)) / 100).toFixed(floatNum);
}
// CSS 내 px -> vw 변환
function cssPxToVw(css, viewport, floatNum, removeValue) {
  if (!removeValue) {
    return css.replace(
      /(\d+\.?\d*)px/g,
      (m, p1) => pxToVw(p1, viewport, floatNum) + "vw"
    );
  }
  // 속성 삭제: 숫자 단위가 없는 속성 전체 삭제
  return css.replace(
    /([^{]+{)([^}]+)(})/g,
    (match, selector, properties, closingBrace) => {
      const propertyList = properties.split(/;\s*/);
      const filteredProperties = propertyList
        .map((line) => {
          // 숫자+단위가 있으면 변환, 없으면 삭제
          if (/:[^;]*([0-9.]+\s*(px|vw|rem|em|%|vh|vmin|vmax))/i.test(line)) {
            return line.replace(
              /(\d+\.?\d*)px/g,
              (m, p1) => pxToVw(p1, viewport, floatNum) + "vw"
            );
          }
          return "";
        })
        .filter(Boolean);

      return selector + filteredProperties.join(";\n") + ";\n" + closingBrace;
    }
  );
}
// CSS 내 vw -> px 변환
function cssVwToPx(css, viewport, floatNum, removeValue) {
  if (!removeValue) {
    return css.replace(
      /(\d+\.?\d*)vw/g,
      (m, p1) => vwToPx(p1, viewport, floatNum) + "px"
    );
  }
  // 속성 삭제: 숫자 단위가 없는 속성 전체 삭제
  return css.replace(
    /([^{]+{)([^}]+)(})/g,
    (match, selector, properties, closingBrace) => {
      const propertyList = properties.split(/;\s*/);
      const filteredProperties = propertyList
        .map((line) => {
          if (/:[^;]*([0-9.]+\s*(px|vw|rem|em|%|vh|vmin|vmax))/i.test(line)) {
            return line.replace(
              /(\d+\.?\d*)vw/g,
              (m, p1) => vwToPx(p1, viewport, floatNum) + "px"
            );
          }
          return "";
        })
        .filter(Boolean);

      return selector + filteredProperties.join(";\n") + ";\n" + closingBrace;
    }
  );
}
// px -> vw 단일 변환
const pxInput = document.getElementById("px-input");
const vwOutput = document.getElementById("vw-output");
const vw1Width = document.getElementById("vw1-width");
const vw1Float = document.getElementById("vw1-float");
// 프리셋 버튼 이벤트
Array.from(document.getElementsByClassName("vw-preset-btn")).forEach((btn) => {
  btn.onclick = function () {
    vw1Width.value = this.getAttribute("data-value");
  };
});
// PX to VW 단위포함 기능
const vwUnitCheck = document.getElementById("vw-unit-check");
function updateVwOutputUnit() {
  if (!vwOutput.value) return;
  if (vwUnitCheck && vwUnitCheck.checked) {
    vwOutput.value = vwOutput.value.replace(/vw$/, "") + "vw";
  } else {
    vwOutput.value = vwOutput.value.replace(/vw$/, "");
  }
}
if (vwUnitCheck) {
  vwUnitCheck.addEventListener("change", updateVwOutputUnit);
}
// PX to VW 계산 시 단위포함 적용
function calcPxToVw() {
  if (!pxInput.value || !vw1Width.value) return;
  let result = pxToVw(
    pxInput.value,
    vw1Width.value,
    Math.min(3, parseInt(vw1Float.value) || 3)
  );
  if (vwUnitCheck && vwUnitCheck.checked) {
    result += "vw";
  }
  vwOutput.value = result;
}
document.getElementById("px-to-vw-btn").onclick = calcPxToVw;
pxInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") calcPxToVw();
});
vw1Width.addEventListener("keydown", function (e) {
  if (e.key === "Enter") calcPxToVw();
});
vw1Float.addEventListener("keydown", function (e) {
  if (e.key === "Enter") calcPxToVw();
});
// vw -> px 단일 변환
const vwInput = document.getElementById("vw-input");
const pxOutput = document.getElementById("px-output");
const vw2Width = document.getElementById("vw2-width");
const pxNoFloat = document.getElementById("px-no-float");
// VW to PX 프리셋 버튼 이벤트
Array.from(document.getElementsByClassName("vw2-preset-btn")).forEach((btn) => {
  btn.onclick = function () {
    vw2Width.value = this.getAttribute("data-value");
  };
});
// VW to PX 단위포함 기능
const pxUnitCheck = document.getElementById("px-unit-check");
function updatePxOutputUnit() {
  if (!pxOutput.value) return;
  if (pxUnitCheck && pxUnitCheck.checked) {
    pxOutput.value = pxOutput.value.replace(/px$/, "") + "px";
  } else {
    pxOutput.value = pxOutput.value.replace(/px$/, "");
  }
}
if (pxUnitCheck) {
  pxUnitCheck.addEventListener("change", updatePxOutputUnit);
}
// VW to PX 계산 시 단위포함 적용
function calcVwToPx() {
  if (!vwInput.value || !vw2Width.value) return;
  let result;
  if (!pxNoFloat || pxNoFloat.checked) {
    result = Math.round(vwToPx(vwInput.value, vw2Width.value, 5));
  } else {
    result = vwToPx(vwInput.value, vw2Width.value, 1);
  }
  if (pxUnitCheck && pxUnitCheck.checked) {
    result += "px";
  }
  pxOutput.value = result;
}
document.getElementById("vw-to-px-btn").onclick = calcVwToPx;
vwInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") calcVwToPx();
});
vw2Width.addEventListener("keydown", function (e) {
  if (e.key === "Enter") calcVwToPx();
});
if (pxNoFloat) pxNoFloat.addEventListener("change", calcVwToPx);
// CSS px -> vw 변환
const css1Input = document.getElementById("css1-input");
const css1Output = document.getElementById("css1-output");
const css1Width = document.getElementById("css1-width");
const css1Float = document.getElementById("css1-float");
const css1Remove = document.getElementById("css1-remove");
document.getElementById("css1-btn").onclick = function () {
  if (!css1Input.value || !css1Width.value) return;
  css1Output.value = cssPxToVw(
    css1Input.value,
    css1Width.value,
    Math.min(3, parseInt(css1Float.value) || 3),
    css1Remove.checked
  );
};
// CSS vw -> px 변환
const css2Input = document.getElementById("css2-input");
const css2Output = document.getElementById("css2-output");
const css2Width = document.getElementById("css2-width");
const css2Remove = document.getElementById("css2-remove");
const css2NoFloat = document.getElementById("css2-no-float");
function calcCss2() {
  if (!css2Input.value || !css2Width.value) return;
  const floatNum = !css2NoFloat || css2NoFloat.checked ? 0 : 1;
  let result = cssVwToPx(
    css2Input.value,
    css2Width.value,
    floatNum === 0 ? 5 : 1,
    css2Remove.checked
  );
  if (floatNum === 0) {
    // 정수로 반올림
    result = result.replace(
      /([0-9]+\.[0-9]+)px/g,
      (m, p1) => Math.round(parseFloat(p1)) + "px"
    );
  }
  css2Output.value = result;
}
document.getElementById("css2-btn").onclick = calcCss2;
css2Input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") calcCss2();
});
css2Width.addEventListener("keydown", function (e) {
  if (e.key === "Enter") calcCss2();
});
if (css2NoFloat) css2NoFloat.addEventListener("change", calcCss2);

// 복사 버튼 기능
function copyToClipboard(value, btn) {
  if (!value) return;
  navigator.clipboard.writeText(value).then(() => {
    const org = btn.textContent;
    btn.textContent = "✅ Copied!";
    setTimeout(() => {
      btn.textContent = org;
    }, 1000);
  });
}
document.getElementById("vw-copy-btn").onclick = function () {
  copyToClipboard(document.getElementById("vw-output").value, this);
};
document.getElementById("px-copy-btn").onclick = function () {
  copyToClipboard(document.getElementById("px-output").value, this);
};
// css1-output 복사 버튼
const css1CopyBtn = document.getElementById("css1-copy-btn");
if (css1CopyBtn) {
  css1CopyBtn.onclick = function () {
    copyToClipboard(document.getElementById("css1-output").value, this);
  };
}
// css2-output 복사 버튼
const css2CopyBtn = document.getElementById("css2-copy-btn");
if (css2CopyBtn) {
  css2CopyBtn.onclick = function () {
    copyToClipboard(document.getElementById("css2-output").value, this);
  };
}
// 내용지우기 버튼 기능 추가
// PX to VW
const vwClearBtn = document.getElementById("vw-clear-btn");
if (vwClearBtn) {
  vwClearBtn.onclick = function () {
    pxInput.value = "";
    vwOutput.value = "";
  };
}
// VW to PX
const pxClearBtn = document.getElementById("px-clear-btn");
if (pxClearBtn) {
  pxClearBtn.onclick = function () {
    vwInput.value = "";
    pxOutput.value = "";
  };
}
// CSS1
const css1ClearBtn = document.getElementById("css1-clear-btn");
if (css1ClearBtn) {
  css1ClearBtn.onclick = function () {
    css1Input.value = "";
    css1Output.value = "";
  };
}
// CSS2
const css2ClearBtn = document.getElementById("css2-clear-btn");
if (css2ClearBtn) {
  css2ClearBtn.onclick = function () {
    css2Input.value = "";
    css2Output.value = "";
  };
}

// Supabase 설정
const supabaseUrl = "https://vahiwfiwpsxhwyrtxgrw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhaGl3Zml3cHN4aHd5cnR4Z3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMDEyMjYsImV4cCI6MjA2Nzg3NzIyNn0.R3M7rb7fn1_d__REv_rg5TX1tadSlqvDHhsqrKh9RUc";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// 방문자 통계 기능
async function updateVisitStats() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // 오늘 방문자 수 조회 또는 생성
    let { data: todayData, error: todayError } = await supabaseClient
      .from("pxtove")
      .select("visit_count")
      .eq("visit_data", today)
      .single();

    if (todayError && todayError.code === "PGRST116") {
      // 오늘 데이터가 없으면 새로 생성
      const { data: newTodayData, error: insertError } = await supabaseClient
        .from("pxtove")
        .insert([{ visit_data: today, visit_count: 1 }])
        .select("visit_count")
        .single();

      if (insertError) {
        console.error("오늘 방문자 데이터 생성 실패:", insertError);
        return;
      }

      todayData = newTodayData;
    } else if (todayError) {
      console.error("오늘 방문자 데이터 조회 실패:", todayError);
      return;
    } else {
      // 오늘 데이터가 있으면 카운트 증가
      const { error: updateError } = await supabaseClient
        .from("pxtove")
        .update({ visit_count: todayData.visit_count + 1 })
        .eq("visit_data", today);

      if (updateError) {
        console.error("오늘 방문자 카운트 업데이트 실패:", updateError);
        return;
      }

      todayData.visit_count += 1;
    }

    // 어제 방문자 수 조회
    let { data: yesterdayData, error: yesterdayError } = await supabaseClient
      .from("pxtove")
      .select("visit_count")
      .eq("visit_data", yesterday)
      .single();

    if (yesterdayError && yesterdayError.code === "PGRST116") {
      yesterdayData = { visit_count: 0 };
    } else if (yesterdayError) {
      console.error("어제 방문자 데이터 조회 실패:", yesterdayError);
      yesterdayData = { visit_count: 0 };
    }

    // 전체 방문자 수 조회
    let { data: totalData, error: totalError } = await supabaseClient
      .from("pxtove")
      .select("visit_count");

    if (totalError) {
      console.error("전체 방문자 데이터 조회 실패:", totalError);
      return;
    }

    const totalCount = totalData.reduce((sum, row) => sum + row.visit_count, 0);

    // 화면 업데이트
    document.getElementById("visit-total").textContent = totalCount;
    document.getElementById("visit-today").textContent = todayData.visit_count;
    document.getElementById("visit-yesterday").textContent =
      yesterdayData.visit_count;
  } catch (error) {
    console.error("방문자 통계 업데이트 실패:", error);
  }
}

// 페이지 로드 시 방문자 통계 업데이트
document.addEventListener("DOMContentLoaded", function () {
  updateVisitStats();
});

// 모바일 전환 버튼 기능
const mobileToggleBtn = document.getElementById("mobile-toggle-btn");
const pxToVwBox = document.querySelector(".convert-box:first-child");
const vwToPxBox = document.querySelector(".convert-box:last-child");
const css1Box = document.querySelector(".css-box:first-child");
const css2Box = document.querySelector(".css-box:last-child");

if (mobileToggleBtn && pxToVwBox && vwToPxBox && css1Box && css2Box) {
  let isPxToVwVisible = true;

  // 초기 상태 설정 (모바일에서만 적용)
  function setInitialMobileState() {
    if (window.innerWidth <= 720) {
      pxToVwBox.classList.add("visible");
      vwToPxBox.classList.add("hidden");
      css1Box.classList.add("visible");
      css2Box.classList.add("hidden");
      mobileToggleBtn.textContent = "VW to PX";
      mobileToggleBtn.classList.remove("on");
    } else {
      pxToVwBox.classList.remove("visible", "hidden");
      vwToPxBox.classList.remove("visible", "hidden");
      css1Box.classList.remove("visible", "hidden");
      css2Box.classList.remove("visible", "hidden");
      mobileToggleBtn.classList.remove("on");
    }
  }

  // 전환 버튼 클릭 이벤트
  mobileToggleBtn.addEventListener("click", function () {
    if (window.innerWidth <= 720) {
      if (isPxToVwVisible) {
        // PX to VW에서 VW to PX로 전환
        pxToVwBox.classList.remove("visible");
        pxToVwBox.classList.add("hidden");
        vwToPxBox.classList.remove("hidden");
        vwToPxBox.classList.add("visible");
        css1Box.classList.remove("visible");
        css1Box.classList.add("hidden");
        css2Box.classList.remove("hidden");
        css2Box.classList.add("visible");
        mobileToggleBtn.textContent = "PX to VW";
        mobileToggleBtn.classList.add("on");
        isPxToVwVisible = false;
      } else {
        // VW to PX에서 PX to VW로 전환
        vwToPxBox.classList.remove("visible");
        vwToPxBox.classList.add("hidden");
        pxToVwBox.classList.remove("hidden");
        pxToVwBox.classList.add("visible");
        css2Box.classList.remove("visible");
        css2Box.classList.add("hidden");
        css1Box.classList.remove("hidden");
        css1Box.classList.add("visible");
        mobileToggleBtn.textContent = "VW to PX";
        mobileToggleBtn.classList.remove("on");
        isPxToVwVisible = true;
      }
    }
  });

  // 화면 크기 변경 시 이벤트
  // window.addEventListener("resize", function () {
  //   if (window.innerWidth > 720) {
  //     // 데스크탑에서는 모든 박스 표시
  //     pxToVwBox.classList.remove("visible", "hidden");
  //     vwToPxBox.classList.remove("visible", "hidden");
  //     css1Box.classList.remove("visible", "hidden");
  //     css2Box.classList.remove("visible", "hidden");
  //     mobileToggleBtn.classList.remove("on");
  //   } else {
  //     // 모바일에서는 초기 상태로 설정
  //     setInitialMobileState();
  //   }
  // });

  // 페이지 로드 시 초기 상태 설정
  setInitialMobileState();
}
