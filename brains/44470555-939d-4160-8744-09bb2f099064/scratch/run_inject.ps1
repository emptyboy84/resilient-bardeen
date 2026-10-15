Add-Type -ReferencedAssemblies System.Drawing, System.Windows.Forms -Path "C:\Users\lg\.gemini\antigravity\brain\44470555-939d-4160-8744-09bb2f099064\scratch\AutoInjector.cs"

$js = @"
(function autoNextDreamCampus() {
    console.log('%c[DreamCampus Auto-Next Active]', 'color: #00ff00; font-size: 16px; font-weight: bold;');
    window.alert = function(msg) { console.log('[Alert Suppressed]:', msg); return true; };

    setInterval(() => {
        try {
            // 1. Next lesson popup
            const nextTimeBtn = document.querySelector('.jconfirm-buttons .btn-purple, .jconfirm-buttons button');
            if (nextTimeBtn && (nextTimeBtn.innerText.includes('다음 차시') || nextTimeBtn.innerText.includes('확인'))) {
                console.log('[Auto-Next] Clicking next lesson button');
                nextTimeBtn.click();
                return;
            }

            // 2. iframe media check
            const iframe = document.getElementById('iframe');
            if (iframe && iframe.contentWindow) {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc) {
                    const media = iframeDoc.querySelector('video, audio');
                    if (media) {
                        if (media.paused && media.currentTime === 0) {
                            media.play().catch(() => {});
                        }
                        if (media.ended || (media.duration > 0 && media.currentTime >= media.duration - 0.5)) {
                            const nextBtn = document.getElementById('page_next');
                            if (nextBtn) {
                                console.log('[Auto-Next] Video ended -> Clicking #page_next');
                                nextBtn.click();
                            }
                        }
                        return;
                    }
                }
            }

            // 3. Slide page check
            const nextBtn = document.getElementById('page_next');
            if (nextBtn && nextBtn.classList.contains('arrow')) {
                console.log('[Auto-Next] Arrow active -> Clicking #page_next');
                nextBtn.click();
            }
        } catch (e) {}
    }, 1500);
})();
"@

# Also allow pasting just in case DevTools prompts for it
[AutoInjector]::InjectAutoScript("allow pasting")
Start-Sleep -Milliseconds 300
[AutoInjector]::InjectAutoScript($js)

Start-Sleep -Seconds 2
[AutoInjector]::CaptureWindow("C:\Users\lg\.gemini\antigravity\brain\44470555-939d-4160-8744-09bb2f099064\scratch\after_inject.png")
