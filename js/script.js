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
  const cleanCss = css; // 주석 유지

  if (!removeValue) {
    return cleanCss.replace(
      /(\d+\.?\d*)px/g,
      (m, p1) => pxToVw(p1, viewport, floatNum) + "vw"
    );
  }

  // { } 괄호가 없는 경우 처리
  if (!cleanCss.includes("{")) {
    return processProperties(cleanCss, (line) =>
      line.replace(
        /(\d+\.?\d*)px/g,
        (m, p1) => pxToVw(p1, viewport, floatNum) + "vw"
      )
    , "");
  }

  // 속성 삭제: 숫자 단위가 없는 속성 전체 삭제
  return cleanCss.replace(
    /([^{]*{)([^}]+)(})/g,
    (match, selector, properties, closingBrace) => {
      const processed = processProperties(properties, (line) =>
        line.replace(
          /(\d+\.?\d*)px/g,
          (m, p1) => pxToVw(p1, viewport, floatNum) + "vw"
        )
      , "  ");
      if (processed) {
        return selector.trimEnd() + "\n  " + processed + "\n" + closingBrace.trim();
      }
      return selector.trimEnd() + closingBrace.trim();
    }
  );
}

// 속성 처리용 헬퍼 함수
function processProperties(properties, transformFn, indent = "  ") {
  const regex = /(\/\*[\s\S]*?\*\/)|([^:;{}]+:[^;{}]+;?)/g;
  let match;
  let result = [];
  while ((match = regex.exec(properties)) !== null) {
    let text = match[0].trim();
    if (!text) continue;
    
    if (text.startsWith("/*")) {
      result.push(transformFn(text));
    } else {
      if (/:[^;]*([0-9.]+\s*(px|vw|rem|em|%|vh|vmin|vmax))/i.test(text)) {
        result.push(transformFn(text));
      }
    }
  }
  
  if (result.length === 0) return "";
  
  return result.map(line => {
    if (!line.startsWith("/*") && !line.endsWith(";")) {
      return line + ";";
    }
    return line;
  }).join("\n" + indent);
}

// CSS 내 vw -> px 변환
function cssVwToPx(css, viewport, floatNum, removeValue) {
  const cleanCss = css; // 주석 유지

  if (!removeValue) {
    return cleanCss.replace(
      /(\d+\.?\d*)vw/g,
      (m, p1) => vwToPx(p1, viewport, floatNum) + "px"
    );
  }

  // { } 괄호가 없는 경우 처리
  if (!cleanCss.includes("{")) {
    return processProperties(cleanCss, (line) =>
      line.replace(
        /(\d+\.?\d*)vw/g,
        (m, p1) => vwToPx(p1, viewport, floatNum) + "px"
      )
    , "");
  }

  // 속성 삭제: 숫자 단위가 없는 속성 전체 삭제
  return cleanCss.replace(
    /([^{]*{)([^}]+)(})/g,
    (match, selector, properties, closingBrace) => {
      const processed = processProperties(properties, (line) =>
        line.replace(
          /(\d+\.?\d*)vw/g,
          (m, p1) => vwToPx(p1, viewport, floatNum) + "px"
        )
      , "  ");
      if (processed) {
        return selector.trimEnd() + "\n  " + processed + "\n" + closingBrace.trim();
      }
      return selector.trimEnd() + closingBrace.trim();
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
    if(vw1Width) vw1Width.value = value;
    // CSS1 섹션의 너비도 함께 변경
    if (typeof css1Width !== 'undefined' && css1Width) {
      css1Width.value = value;
    }
  };
});
// PX to VW 단위포함 기능
const vwUnitCheck = document.getElementById("vw-unit-check");
function updateVwOutputUnit() {
  if (!vwOutput || !vwOutput.value) return;
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
  if (!pxInput || !vw1Width || !pxInput.value || !vw1Width.value) return;
  let result = pxToVw(
    pxInput.value,
    vw1Width.value,
    Math.min(3, parseInt(vw1Float ? vw1Float.value : 3) || 3)
  );
  if (vwUnitCheck && vwUnitCheck.checked) {
    result += "vw";
  }
  if(vwOutput) vwOutput.value = result;
}
const pxToVwBtn = document.getElementById("px-to-vw-btn");
if (pxToVwBtn) pxToVwBtn.onclick = calcPxToVw;
if (pxInput) pxInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") calcPxToVw();
});
if (vw1Width) vw1Width.addEventListener("keydown", function (e) {
  if (e.key === "Enter") calcPxToVw();
});
if (vw1Float) vw1Float.addEventListener("keydown", function (e) {
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
  if (!vwInput || !vw2Width || !vwInput.value || !vw2Width.value) return;
  let result;
  if (!pxNoFloat || pxNoFloat.checked) {
    result = Math.round(vwToPx(vwInput.value, vw2Width.value, 5));
  } else {
    result = vwToPx(vwInput.value, vw2Width.value, 1);
  }
  if (pxUnitCheck && pxUnitCheck.checked) {
    result += "px";
  }
  if (pxOutput) pxOutput.value = result;
}
const vwToPxBtn = document.getElementById("vw-to-px-btn");
if (vwToPxBtn) vwToPxBtn.onclick = calcVwToPx;
if (vwInput) vwInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") calcVwToPx();
});
if (vw2Width) vw2Width.addEventListener("keydown", function (e) {
  if (e.key === "Enter") calcVwToPx();
});
if (pxNoFloat) pxNoFloat.addEventListener("change", calcVwToPx);
// CSS px -> vw 변환
const css1Input = document.getElementById("css1-input");
const css1Output = document.getElementById("css1-output");
const css1Width = document.getElementById("css1-width");
const css1Float = document.getElementById("css1-float");
const css1Remove = document.getElementById("css1-remove");
const css1Btn = document.getElementById("css1-btn");
if (css1Btn) {
  css1Btn.onclick = function () {
    if (!css1Input.value || !css1Width.value) return;
    css1Output.value = cssPxToVw(
      css1Input.value,
      css1Width.value,
      Math.min(3, parseInt(css1Float ? css1Float.value : 3) || 3),
      css1Remove ? css1Remove.checked : false
    );
  };
}
// CSS vw -> px 변환
const css2Input = document.getElementById("css2-input");
const css2Output = document.getElementById("css2-output");
const css2Width = document.getElementById("css2-width");
const css2Remove = document.getElementById("css2-remove");
const css2NoFloat = document.getElementById("css2-no-float");
function calcCss2() {
  if (!css2Input || !css2Width || !css2Input.value || !css2Width.value) return;
  const floatNum = !css2NoFloat || css2NoFloat.checked ? 0 : 1;
  let result = cssVwToPx(
    css2Input.value,
    css2Width.value,
    floatNum === 0 ? 5 : 1,
    css2Remove ? css2Remove.checked : false
  );
  if (floatNum === 0) {
    // 정수로 반올림
    result = result.replace(
      /([0-9]+\.[0-9]+)px/g,
      (m, p1) => Math.round(parseFloat(p1)) + "px"
    );
  }
  if (css2Output) css2Output.value = result;
}
const css2Btn = document.getElementById("css2-btn");
if (css2Btn) css2Btn.onclick = calcCss2;
if (css2Input) css2Input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") calcCss2();
});
if (css2Width) css2Width.addEventListener("keydown", function (e) {
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
const vwCopyBtn = document.getElementById("vw-copy-btn");
if (vwCopyBtn) {
  vwCopyBtn.onclick = function () {
    const vwOutputEl = document.getElementById("vw-output");
    if(vwOutputEl) copyToClipboard(vwOutputEl.value, this);
  };
}
const pxCopyBtn = document.getElementById("px-copy-btn");
if (pxCopyBtn) {
  pxCopyBtn.onclick = function () {
    const pxOutputEl = document.getElementById("px-output");
    if(pxOutputEl) copyToClipboard(pxOutputEl.value, this);
  };
}
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
const pxToVwBox = document.getElementById("px-to-vw-box");
const vwToPxBox = document.getElementById("vw-to-px-box");
const css1Box = document.getElementById("css1-box");
const css2Box = document.getElementById("css2-box");

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


// GNB 활성 메뉴 자동 스크롤 기능 (선택된 메뉴를 가장 앞으로)
document.addEventListener("DOMContentLoaded", function () {
  const scrollContainer = document.querySelector(".gnb-menu-inner");
  const activeItem = document.querySelector(".gnb-item.active");

  if (scrollContainer && activeItem) {
    // 활성 메뉴의 위치로 스크롤 이동
    const targetScroll = activeItem.offsetLeft - 30; // 여유 공간을 30px로 상향 조정
    scrollContainer.scrollLeft = targetScroll;
  }
});

// GNB 메뉴 마우스 드래그 스크롤 기능
document.addEventListener("DOMContentLoaded", function () {
  const scrollContainer = document.querySelector(".gnb-menu-inner");

  if (scrollContainer) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragged = false;

    scrollContainer.addEventListener("mousedown", (e) => {
      isDown = true;
      scrollContainer.classList.add("active-drag");
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
      isDragged = false;
    });

    scrollContainer.addEventListener("mouseleave", () => {
      isDown = false;
      scrollContainer.classList.remove("active-drag");
    });

    scrollContainer.addEventListener("mouseup", (e) => {
      isDown = false;
      scrollContainer.classList.remove("active-drag");
    });

    scrollContainer.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2; // 스크롤 속도 배율
      
      if (Math.abs(walk) > 5) {
        isDragged = true;
      }
      
      if (isDragged) {
        e.preventDefault();
        scrollContainer.scrollLeft = scrollLeft - walk;
      }
    });

    // 드래그 중 클릭(링크 이동) 방지
    scrollContainer.addEventListener("click", (e) => {
      if (isDragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }
});

/**
 * 공통 푸터 주입 기능
 */
document.addEventListener('DOMContentLoaded', function() {
    // 이미 푸터가 있으면 중복 생성 방지
    if (document.querySelector('.app-footer')) return;

    const footer = document.createElement('footer');
    footer.className = 'app-footer';

    // /en/ 하위 페이지에서도 링크가 동작하도록 경로 보정
    const pathPrefix = window.location.pathname.indexOf('/en/') !== -1 ? '../' : '';

    footer.innerHTML = `
        <div class="footer-content">
            <div class="footer-links">
                <a href="${pathPrefix}about.html">사이트 소개</a>
                <a href="${pathPrefix}privacy.html" class="privacy-link">개인정보처리방침</a>
                <a href="${pathPrefix}terms.html">이용약관</a>
                <a href="${pathPrefix}contact.html">문의하기</a>
                <div class="version-info">
                    <button id="version-btn" class="version-btn">
                        v2.2.0 <span>▼</span>
                    </button>
                    <div class="version-modal" id="version-modal">
                        <h3>
                            업데이트 노트
                            <button type="button" class="close-version-btn" id="close-version-btn">&times;</button>
                        </h3>
                        <div class="version-item">
                            <strong>v2.2.0 (2026.08.10)</strong>
                            <ul>
                                <li>PX ↔ EM 변환기 신규 추가</li>
                                <li>자간(Letter Spacing) 변환기 신규 추가 (피그마 %·포토샵 VA 지원)</li>
                                <li>행간(Line Height) 계산기 신규 추가</li>
                                <li>영어 버전 공개 (PX↔VW, PX↔REM, CSS Clamp)</li>
                                <li>주요 도구 페이지 FAQ 섹션 추가</li>
                                <li>모바일 화면 확대(핀치 줌) 허용 등 접근성 개선</li>
                                <li>검색엔진 최적화: 구조화 데이터 적용 및 사이트맵 정비</li>
                            </ul>
                        </div>
                        <div class="version-item">
                            <strong>v2.1.0 (2026.04.24)</strong>
                            <ul>
                                <li>Section Divider Generator 신규 추가</li>
                                <li>Aspect Ratio Calculator 신규 추가</li>
                                <li>CSS Animation Generator 신규 추가</li>
                            </ul>
                        </div>
                        <div class="version-item">
                            <strong>v2.0.0 (2026.04.24)</strong>
                            <ul>
                                <li>CSS Grid Generator 신규 추가</li>
                                <li>시각적 그리드 설계 및 자동 코드 생성 기능</li>
                            </ul>
                        </div>
                        <div class="version-item">
                            <strong>v1.6.0 (2026.04.24)</strong>
                            <ul>
                                <li>WCAG Contrast Checker 신규 추가</li>
                                <li>웹 접근성을 위한 컬러 대비 자동 검사</li>
                            </ul>
                        </div>
                        <div class="version-item">
                            <strong>v1.5.0 (2026.04.24)</strong>
                            <ul>
                                <li>CSS Flexbox Visualizer 신규 추가</li>
                                <li>레이아웃 속성 시각화 및 자동 코드 생성</li>
                            </ul>
                        </div>
                        <div class="version-item">
                            <strong>v1.4.0 (2026.04.24)</strong>
                            <ul>
                                <li>CSS Gradient Generator 신규 추가</li>
                                <li>컬러 변환기 시각적 컬러피커 기능 강화</li>
                                <li>CSS 도구(Minifier) 성능 및 UI 개선</li>
                            </ul>
                        </div>
                        <div class="version-item">
                            <strong>v1.3.0 (2026.04.24)</strong>
                            <ul>
                                <li>색상 변환기 (HEX ↔ RGB ↔ HSL) 추가</li>
                                <li>CSS Minifier / Formatter 도구 추가</li>
                                <li>CSS Clamp 생성기 UI 디자인 전면 개편</li>
                            </ul>
                        </div>
                        <div class="version-item">
                            <strong>v1.2.0 (2026.04.23)</strong>
                            <ul>
                                <li>CSS 스타일 및 시각화 생성기 추가</li>
                                <li>Box Shadow & Text Shadow 생성기</li>
                                <li>Border-Radius 생성기 (Liquid Shape)</li>
                                <li>글래스모피즘 & 뉴모피즘 생성기</li>
                            </ul>
                        </div>
                        <div class="version-item">
                            <strong>v1.1.0 (2026.03.23)</strong>
                            <ul>
                                <li>PX ↔ REM 변환기 및 CSS Clamp 생성기 기능 추가</li>
                                <li>상단 네비게이션(GNB) 추가 및 보조 도구 사용성 개선</li>
                                <li>모바일 환경 UI 최적화(가독성 개편 및 vw 적용 확대)</li>
                            </ul>
                        </div>
                        <div class="version-item">
                            <strong>v1.0.1 (2026.03.23)</strong>
                            <ul>
                                <li>CSS "속성삭제" 체크 시 주석이 포함된 경우 발생하는 변환 오류 수정</li>
                                <li>광고 배너 높이 조정</li>
                            </ul>
                        </div>
                        <div class="version-item">
                            <strong>v1.0.0 (2024.10.01)</strong>
                            <ul>
                                <li>PX ↔ VW 양방향 변환 기본 기능 출시</li>
                                <li>Breakpoints 프리셋 제공 및 CSS 텍스트 일괄 변환 지원</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer-info">
                <p>PX to VW 변환기는 웹 디자이너와 프론트엔드 개발자를 위한 무료 도구입니다.</p>
                <p>모든 변환 결과는 참고용이며, 실제 적용 시 반드시 확인이 필요합니다.</p>
                <p class="footer-copyright">© 2026 PX to VW. All rights reserved.</p>
            </div>
        </div>
    `;

    // 삽입 위치 결정 (메인 컨테이너 뒤 또는 body 끝)
    const container = document.querySelector('.container') || 
                      document.querySelector('.guide-container') || 
                      document.querySelector('.blog-container') ||
                      document.querySelector('.clamp-container');
    
    if (container && container.parentElement === document.body) {
        container.insertAdjacentElement('afterend', footer);
    } else {
        document.body.appendChild(footer);
    }

    // 버전 정보 모달창 기능 연결
    const versionBtn = document.getElementById("version-btn");
    const versionModal = document.getElementById("version-modal");
    const closeVersionBtn = document.getElementById("close-version-btn");

    if (versionBtn && versionModal) {
        versionBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            versionModal.classList.toggle("show");
        });

        if (closeVersionBtn) {
            closeVersionBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                versionModal.classList.remove("show");
            });
        }

        versionModal.addEventListener("click", function (e) {
            e.stopPropagation();
        });

        document.addEventListener("click", function (e) {
            if (versionModal.classList.contains("show")) {
                versionModal.classList.remove("show");
            }
        });
    }
});



