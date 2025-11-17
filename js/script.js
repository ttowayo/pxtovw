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

      const propertiesString = filteredProperties.length > 0 
        ? filteredProperties.join(";\n") + ";\n" 
        : "";
      return selector + propertiesString + closingBrace;
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

      const propertiesString = filteredProperties.length > 0 
        ? filteredProperties.join(";\n") + ";\n" 
        : "";
      return selector + propertiesString + closingBrace;
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
    const value = this.getAttribute("data-value");
    vw1Width.value = value;
    // CSS1 섹션의 너비도 함께 변경
    if (css1Width) {
      css1Width.value = value;
    }
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
    const value = this.getAttribute("data-value");
    vw2Width.value = value;
    // CSS2 섹션의 너비도 함께 변경
    if (css2Width) {
      css2Width.value = value;
    }
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

  // 페이지 로드 시 초기 상태 설정
  setInitialMobileState();
}

// Supabase 방문자 카운트 기능
// Supabase 클라이언트 초기화
const supabase = window.supabase.createClient(
  window.SUPABASE_CONFIG.url,
  window.SUPABASE_CONFIG.anonKey
);

// 방문자 중복 체크 함수
async function checkDuplicateVisit() {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 브라우저 정보로 방문자 식별 (IP는 클라이언트에서 얻을 수 없으므로 User Agent + 기타 정보 조합)
    const visitorFingerprint = generateVisitorFingerprint();

    // console.log("방문자 식별 정보:", visitorFingerprint);

    // 오늘 같은 방문자가 이미 방문했는지 확인
    const { data: existingVisit, error } = await supabase
      .from("visit_logs")
      .select("*")
      .eq("visit_date", today)
      .eq("visitor_fingerprint", visitorFingerprint)
      .limit(1);

    if (error) {
      // console.error("중복 방문 체크 오류:", error);
      return false; // 오류 시 중복이 아닌 것으로 처리
    }

    const isDuplicate = existingVisit && existingVisit.length > 0;
    // console.log("중복 방문 여부:", isDuplicate);

    return isDuplicate;
  } catch (error) {
    // console.error("중복 방문 체크 예외:", error);
    return false;
  }
}

// 방문자 식별 정보 생성 함수
function generateVisitorFingerprint() {
  const userAgent = navigator.userAgent;
  const language = navigator.language;
  const platform = navigator.platform;
  const screenResolution = `${screen.width}x${screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const colorDepth = screen.colorDepth;
  const pixelRatio = window.devicePixelRatio || 1;

  // 추가 브라우저 정보
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "top";
  ctx.font = "14px Arial";
  ctx.fillText("Browser fingerprint", 2, 2);
  const canvasFingerprint = canvas.toDataURL();

  // 브라우저 정보 조합
  const fingerprint = `${userAgent}|${language}|${platform}|${screenResolution}|${timezone}|${colorDepth}|${pixelRatio}|${canvasFingerprint}`;

  // 간단한 해시 생성 (실제로는 더 정교한 해시 함수 사용 권장)
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32비트 정수로 변환
  }

  return Math.abs(hash).toString(36);
}

// 방문자 카운트 함수들
async function incrementVisitCount() {
  try {
    const today = new Date().toISOString().split("T")[0];
    // console.log("방문자 카운트 시작 - 날짜:", today);

    // 중복 방문 체크
    const isDuplicate = await checkDuplicateVisit();
    if (isDuplicate) {
      // console.log("중복 방문으로 카운트하지 않음");
      return;
    }

    // 오늘 날짜의 방문 기록 확인 - 더 안전한 방식
    let existingRecord = null;
    try {
      const { data, error } = await supabase
        .from("visitor_stats")
        .select("*")
        .eq("visit_date", today);

      if (error) {
        // console.error("방문 기록 조회 오류:", error);
        return;
      }

      existingRecord = data && data.length > 0 ? data[0] : null;
      // console.log("기존 기록:", existingRecord);
    } catch (err) {
      // console.error("방문 기록 조회 예외:", err);
      return;
    }

    if (existingRecord) {
      // 기존 기록이 있으면 카운트 증가
      // console.log("기존 기록 업데이트:", existingRecord.total_visits + 1);
      const { error: updateError } = await supabase
        .from("visitor_stats")
        .update({
          total_visits: existingRecord.total_visits + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("visit_date", today);

      if (updateError) {
        // console.error("방문 카운트 업데이트 오류:", updateError);
      } else {
        // console.log("방문자 카운트 업데이트 성공");
      }
    } else {
      // 새로운 날짜면 새 기록 생성
      // console.log("새 기록 생성");
      const { error: insertError } = await supabase
        .from("visitor_stats")
        .insert({
          visit_date: today,
          total_visits: 1,
        });

      if (insertError) {
        // console.error("방문 기록 생성 오류:", insertError);
      } else {
        // console.log("방문자 카운트 생성 성공");
      }
    }

    // 방문 로그 기록 (중복이 아닌 경우에만)
    await logVisit();
  } catch (error) {
    // console.error("방문자 카운트 오류:", error);
  }
}

// 방문 로그 기록 함수
async function logVisit() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const visitorFingerprint = generateVisitorFingerprint();

    // 방문자 정보 수집
    const visitorInfo = {
      visit_date: today,
      user_agent: navigator.userAgent,
      visitor_fingerprint: visitorFingerprint,
      language: navigator.language,
      platform: navigator.platform,
      screen_resolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    // console.log("방문 로그 기록:", visitorInfo);

    const { error } = await supabase.from("visit_logs").insert(visitorInfo);

    if (error) {
      // console.error("방문 로그 기록 오류:", error);
    } else {
      // console.log("방문 로그 기록 성공");
    }
  } catch (error) {
    // console.error("방문 로그 오류:", error);
  }
}

// 방문자 통계 조회 함수
async function loadVisitorStats() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // console.log("조회할 날짜:", { today, yesterday });

    // 오늘 방문자 수 - 더 안전한 방식
    let todayData = null;
    try {
      const { data, error } = await supabase
        .from("visitor_stats")
        .select("total_visits")
        .eq("visit_date", today);

      if (error) {
        // console.error("오늘 데이터 조회 오류:", error);
      } else {
        todayData = data && data.length > 0 ? data[0] : null;
        // console.log("오늘 데이터:", todayData);
      }
    } catch (err) {
      // console.error("오늘 데이터 조회 예외:", err);
    }

    // 어제 방문자 수 - 더 안전한 방식
    let yesterdayData = null;
    try {
      const { data, error } = await supabase
        .from("visitor_stats")
        .select("total_visits")
        .eq("visit_date", yesterday);

      if (error) {
        // console.error("어제 데이터 조회 오류:", error);
      } else {
        yesterdayData = data && data.length > 0 ? data[0] : null;
        // console.log("어제 데이터:", yesterdayData);
      }
    } catch (err) {
      // console.error("어제 데이터 조회 예외:", err);
    }

    // 전체 방문자 수 (모든 날짜 합계)
    let totalData = null;
    try {
      const { data, error } = await supabase
        .from("visitor_stats")
        .select("total_visits");

      if (error) {
        // console.error("전체 데이터 조회 오류:", error);
      } else {
        totalData = data;
        // console.log("전체 데이터:", totalData);
      }
    } catch (err) {
      // console.error("전체 데이터 조회 예외:", err);
    }

    // 결과 업데이트
    const visitToday = document.getElementById("visit-today");
    const visitYesterday = document.getElementById("visit-yesterday");
    const visitTotal = document.getElementById("visit-total");

    if (visitToday) {
      visitToday.textContent = todayData?.total_visits || 0;
    }
    if (visitYesterday) {
      visitYesterday.textContent = yesterdayData?.total_visits || 0;
    }
    if (visitTotal) {
      const totalVisits =
        totalData?.reduce((sum, record) => sum + record.total_visits, 0) || 0;
      visitTotal.textContent = totalVisits;
    }

    // console.log("방문자 통계 업데이트 완료");
  } catch (error) {
    // console.error("방문자 통계 조회 오류:", error);
  }
}

// 주기적으로 통계 업데이트 (선택사항)
setInterval(loadVisitorStats, 60000); // 1분마다 업데이트

// 디버깅용 테스트 함수
async function testSupabaseConnection() {
  try {
    // console.log("Supabase 연결 테스트 시작...");

    // 기본 연결 테스트
    const { data, error } = await supabase
      .from("visitor_stats")
      .select("*")
      .limit(1);

    if (error) {
      // console.error("연결 테스트 실패:", error);
      return false;
    }

    // console.log("연결 테스트 성공:", data);
    return true;
  } catch (error) {
    // console.error("연결 테스트 오류:", error);
    return false;
  }
}

// 페이지 로드 시 연결 테스트 실행
document.addEventListener("DOMContentLoaded", async function () {
  // 연결 테스트
  const isConnected = await testSupabaseConnection();

  if (isConnected) {
    // 방문자 카운트 증가
    await incrementVisitCount();

    // 방문자 통계 로드
    await loadVisitorStats();
  } else {
    // console.error("Supabase 연결 실패 - 방문자 카운트 기능 비활성화");
  }
});
