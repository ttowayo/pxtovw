/**
 * PX to VW 변환기 공통 푸터 주입 스크립트
 */
(function() {
    function createFooter() {
        // 이미 푸터가 있으면 생성하지 않음
        if (document.querySelector('.app-footer')) return;

        const footer = document.createElement('footer');
        footer.className = 'app-footer';
        
        footer.innerHTML = `
            <div class="footer-content">
                <div class="footer-links">
                    <a href="about.html">사이트 소개</a>
                    <a href="privacy.html" class="privacy-link">개인정보처리방침</a>
                    <a href="terms.html">이용약관</a>
                    <a href="contact.html">문의하기</a>
                </div>
                <div class="footer-info">
                    <p>PX to VW 변환기는 웹 디자이너와 프론트엔드 개발자를 위한 무료 도구입니다.</p>
                    <p>모든 변환 결과는 참고용이며, 실제 적용 시 반드시 확인이 필요합니다.</p>
                    <p class="footer-copyright">© 2026 PX to VW. All rights reserved.</p>
                </div>
            </div>
        `;

        // body의 마지막에 추가하거나 특정 컨테이너 뒤에 추가
        const container = document.querySelector('.container') || 
                          document.querySelector('.guide-container') || 
                          document.querySelector('.blog-container') ||
                          document.querySelector('.clamp-container');
        
        if (container && container.parentElement === document.body) {
            // 메인 컨테이너가 body 바로 아래에 있는 경우 그 뒤에 삽입
            container.insertAdjacentElement('afterend', footer);
        } else {
            // 그 외의 경우 body 끝에 추가
            document.body.appendChild(footer);
        }
    }

    // DOM이 로드된 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFooter);
    } else {
        createFooter();
    }
})();
