Add-Type -ReferencedAssemblies System.Drawing, System.Windows.Forms -Path "C:\Users\lg\.gemini\antigravity\brain\44470555-939d-4160-8744-09bb2f099064\scratch\DirectInjector.cs"

$js = @"
(function autoNextDreamCampus() {
    console.log('%c[DreamCampus Auto-Next Running!]', 'background: #222; color: #bada55; font-size: 16px;');
    window.alert = function(msg) { console.log('[Alert Suppressed]:', msg); return true; };

    function advance() {
        try {
            const nextModalBtn = document.querySelector('.jconfirm-buttons .btn-purple, .jconfirm-buttons button');
            if (nextModalBtn && (nextModalBtn.innerText.includes('다음 차시') || nextModalBtn.innerText.includes('확인'))) {
                console.log('[Auto-Next] Clicking next lesson button');
                nextModalBtn.click();
                return;
            }

            const iframe = document.getElementById('iframe');
            if (iframe && iframe.contentWindow) {
                const iWin = iframe.contentWindow;
                const iDoc = iframe.contentDocument || iWin.document;
                
                const media = iDoc ? iDoc.querySelector('video, audio') : null;
                if (media) {
                    if (media.paused && media.currentTime === 0) {
                        media.play().catch(() => {});
                    }
                    if (media.ended || (media.duration > 0 && media.currentTime >= media.duration - 0.8)) {
                        console.log('[Auto-Next] Media ended! Advancing page...');
                        if (typeof iWin.goNextPage === 'function') {
                            iWin.goNextPage();
                        } else {
                            const nextIcon = iDoc.querySelector('.vjs-icon-next, .nextBtn');
                            if (nextIcon) nextIcon.click();
                            else if (document.getElementById('page_next')) document.getElementById('page_next').click();
                        }
                        return;
                    }
                } else {
                    const nextBtn = document.getElementById('page_next');
                    if (nextBtn && nextBtn.classList.contains('arrow')) {
                        nextBtn.click();
                        return;
                    }
                }
            }

            const nextBtn = document.getElementById('page_next');
            if (nextBtn && nextBtn.classList.contains('arrow')) {
                nextBtn.click();
            }
        } catch(err) {
            console.error('[Auto-Next Error]', err);
        }
    }

    advance();
    if (window._dreamCampusInterval) clearInterval(window._dreamCampusInterval);
    window._dreamCampusInterval = setInterval(advance, 1500);
})();
"@

[DirectInjector]::Execute($js, "C:\Users\lg\.gemini\antigravity\brain\44470555-939d-4160-8744-09bb2f099064\scratch\direct_after.png")
