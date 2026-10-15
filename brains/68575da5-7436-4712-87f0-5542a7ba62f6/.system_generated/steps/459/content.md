Title: Live Content

Description: Fetched live

Source: http://16709558.com/

---

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="google-site-verification" content="MfAcXK_keKMA8ShNy-vlrB0IRsziaKKDIMaCVxSjvLk">
<title>중앙아이티 원격지원</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{
    font-family:'Pretendard',sans-serif;
    color:#0F172A;
    background:#fff;
    min-height:100vh;
    position:relative;
    overflow-x:hidden;
    -webkit-font-smoothing:antialiased;
}
.mono{font-family:'JetBrains Mono',monospace}
a{text-decoration:none;color:inherit}

/* gradient mesh background */
.bg-mesh{
    position:absolute;inset:0;z-index:0;pointer-events:none;
    background:
        radial-gradient(circle at 78% 12%, rgba(37,99,235,0.10) 0%, transparent 45%),
        radial-gradient(circle at 92% 60%, rgba(6,182,212,0.08) 0%, transparent 50%),
        radial-gradient(circle at 0% 80%, rgba(99,102,241,0.05) 0%, transparent 50%);
}

.shell{position:relative;z-index:1;max-width:1280px;margin:0 auto;padding:10px 40px 20px}

/* ========== TOP BAR ========== */
.topbar{
    display:flex;justify-content:space-between;align-items:center;
    padding:14px 22px;border-radius:14px;
    background:rgba(255,255,255,0.7);
    backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
    border:1px solid rgba(15,23,42,0.05);
    box-shadow:0 4px 14px rgba(15,23,42,0.04);
    margin-bottom:18px;
    position:relative;z-index:50;
}
.brand{display:flex;align-items:center}
.brand a{display:block;line-height:0}
.brand img{height:42px;width:auto;display:block}

.nav{display:flex;gap:2px;align-items:center}
.nav-item{position:relative}
.nav-link{
    display:inline-block;color:#475569;font-size:13.5px;font-weight:600;
    padding:8px 14px;border-radius:9px;cursor:pointer;transition:.15s;
}
.nav-link:hover, .nav-item:hover > .nav-link{background:#F1F5F9;color:#0F172A}

/* multi-level dropdown */
.dropdown{
    position:absolute;list-style:none;
    background:#fff;border:1px solid #E2E8F0;border-radius:12px;
    box-shadow:0 16px 32px rgba(15,23,42,0.14);
    padding:6px 0;min-width:180px;
    opacity:0;visibility:hidden;transform:translateY(-4px);transition:.18s;
    z-index:60;
}
.lvl1{top:calc(100% + 6px);left:0}
.lvl2, .lvl3{top:-7px;left:100%;margin-left:6px}
.nav-item:hover > .lvl1{opacity:1;visibility:visible;transform:translateY(0)}
.dropdown > li{position:relative;list-style:none}
.dropdown > li > a, .dropdown > li > span{
    display:flex;align-items:center;justify-content:space-between;
    padding:9px 16px;font-size:13.5px;color:#334155;font-weight:500;cursor:pointer;
    white-space:nowrap;gap:14px;
}
.dropdown > li > span::after{content:'›';font-size:14px;color:#94A3B8}
.dropdown > li:hover > a, .dropdown > li:hover > span{background:#F1F5F9;color:#0F172A}
.dropdown > li:hover > .dropdown{opacity:1;visibility:visible;transform:translateY(0)}

.hot{
    display:inline-flex;align-items:center;gap:8px;font-size:13.5px;font-weight:800;color:#0F172A;
    padding:9px 16px;border-radius:999px;background:#fff;border:1px solid #E2E8F0;
    box-shadow:0 2px 6px rgba(15,23,42,0.05);
}
.hot .dot{width:7px;height:7px;border-radius:50%;background:#10B981;box-shadow:0 0 10px #10B981}

/* ========== HERO ========== */
.hero{display:grid;grid-template-columns:1.05fr 1fr;gap:32px;align-items:center;min-height:auto;margin-bottom:18px}

.hero .eyebrow{
    display:inline-flex;align-items:center;gap:10px;
    font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.18em;color:#2563EB;
    font-weight:700;margin-bottom:10px;
}
.hero .eyebrow::before{content:'';width:24px;height:1px;background:#2563EB}
.hero h1{
    font-size:54px;font-weight:900;letter-spacing:-0.04em;line-height:1.0;
    margin-bottom:8px;
}
.hero h1 .accent{
    background:linear-gradient(135deg,#2563EB 0%,#06B6D4 100%);
    -webkit-background-clip:text;background-clip:text;color:transparent;
}
.hero .en-sub{
    font-family:'JetBrains Mono',monospace;font-size:12px;color:#94A3B8;
    letter-spacing:0.15em;margin-bottom:10px;
}
.hero p{font-size:14px;color:#475569;line-height:1.6;max-width:520px;margin-bottom:14px}
.cta-group{display:flex;gap:12px;align-items:center}
.cta-secondary{
    display:inline-flex;align-items:center;gap:8px;
    color:#0F172A;font-weight:700;font-size:14px;
    padding:14px 18px;border-radius:12px;
    transition:.15s;
}
.cta-secondary:hover{background:#F1F5F9}
.cta-secondary .dot{width:7px;height:7px;border-radius:50%;background:#10B981;box-shadow:0 0 8px #10B981}

/* ========== HERO VISUAL (browser mock) ========== */
.hero-visual{position:relative;height:290px;display:flex;align-items:center;justify-content:center}
.glow{
    position:absolute;width:520px;height:420px;
    background:radial-gradient(ellipse at center, rgba(37,99,235,0.20) 0%, transparent 70%);
    filter:blur(40px);z-index:0;
}
.browser{
    position:relative;z-index:1;width:100%;max-width:540px;
    background:#fff;border-radius:16px;
    border:1px solid rgba(15,23,42,0.08);
    box-shadow:0 30px 60px rgba(15,23,42,0.18), 0 8px 18px rgba(15,23,42,0.08);
    overflow:hidden;
    transform:perspective(1200px) rotateY(-6deg) rotateX(2deg);
}
.browser-bar{
    display:flex;align-items:center;gap:14px;
    padding:11px 14px;background:#F8FAFC;
    border-bottom:1px solid #E2E8F0;
}
.browser-dots{display:flex;gap:6px}
.browser-dots span{width:11px;height:11px;border-radius:50%;display:block}
.browser-dots span:nth-child(1){background:#FF5F57}
.browser-dots span:nth-child(2){background:#FEBC2E}
.browser-dots span:nth-child(3){background:#28C840}
.browser-url{
    flex:1;background:#fff;border:1px solid #E2E8F0;border-radius:7px;
    padding:6px 12px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#64748B;
    display:flex;align-items:center;gap:7px;
}
.browser-url .lock{color:#10B981;font-size:10px}
.browser-body{padding:14px 18px;background:linear-gradient(180deg,#fff 0%,#F8FAFC 100%);min-height:170px;position:relative}
.session-strip{
    display:flex;align-items:center;justify-content:space-between;
    padding:10px 12px;background:#fff;border:1px solid #E2E8F0;border-radius:10px;
    margin-bottom:12px;font-size:12px;
}
.session-strip .live{display:flex;align-items:center;gap:8px;font-weight:700;color:#0F172A}
.session-strip .live .pulse{width:8px;height:8px;border-radius:50%;background:#10B981;position:relative;animation:pulse 2s ease-in-out infinite}
.session-strip .live .pulse::before{content:'';position:absolute;inset:-4px;border-radius:50%;background:#10B981;opacity:0.3;animation:ping 2s ease-in-out infinite}
@keyframes pulse{50%{opacity:0.6}}
@keyframes ping{0%{transform:scale(0.8);opacity:0.6}100%{transform:scale(2.2);opacity:0}}
.session-strip .agent{font-family:'JetBrains Mono',monospace;font-size:11px;color:#64748B}
.fake-rows{display:flex;flex-direction:column;gap:7px}
.fake-row{display:flex;align-items:center;gap:10px;padding:8px 10px;background:#fff;border:1px solid #E2E8F0;border-radius:9px}
.fake-row .ico{width:30px;height:30px;border-radius:8px;background:#EFF6FF;color:#2563EB;display:flex;align-items:center;justify-content:center;font-size:14px}
.fake-row .ln{flex:1;display:flex;flex-direction:column;gap:5px}
.fake-row .ln::before{content:'';height:7px;border-radius:3px;background:#E2E8F0;width:80%}
.fake-row .ln::after{content:'';height:5px;border-radius:3px;background:#F1F5F9;width:50%}
.fake-row .pct{font-family:'JetBrains Mono',monospace;font-size:10px;color:#94A3B8}

.sticker{
    position:absolute;background:#fff;
    border-radius:12px;padding:10px 14px;
    border:1px solid rgba(15,23,42,0.08);
    box-shadow:0 14px 28px rgba(15,23,42,0.12);
    display:flex;align-items:center;gap:10px;font-size:12px;font-weight:700;
    z-index:2;
}
.sticker .ico{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px}
.sticker .lbl{display:flex;flex-direction:column;gap:2px}
.sticker .lbl strong{font-size:13px;font-weight:800;color:#0F172A;line-height:1}
.sticker .lbl span{font-family:'JetBrains Mono',monospace;font-size:9px;color:#94A3B8;letter-spacing:0.1em}
.s1{top:8%;right:-3%;animation:bob 5s ease-in-out infinite}
.s1 .ico{background:#DBEAFE;color:#2563EB}
.s2{bottom:14%;left:-5%;animation:bob 5s ease-in-out infinite 1.5s}
.s2 .ico{background:#D1FAE5;color:#047857}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}

/* ========== CHANNEL GRID ========== */
.channels{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:12px}
.ch{
    position:relative;padding:12px 14px 14px;
    background:#fff;border:1px solid #E2E8F0;border-radius:16px;
    cursor:pointer;
    transition:.25s cubic-bezier(.2,.8,.2,1);
    overflow:hidden;
    display:flex;flex-direction:column;gap:6px;
}
.ch::before{
    content:'';position:absolute;inset:0;border-radius:18px;
    background:linear-gradient(135deg,var(--c1) 0%, var(--c2) 100%);
    opacity:0;transition:.25s;z-index:0;
}
.ch:hover{transform:translateY(-6px);border-color:transparent;box-shadow:0 24px 40px rgba(15,23,42,0.10)}
.ch:hover::before{opacity:1}
.ch:hover *{color:#fff;position:relative;z-index:1}
.ch:hover .ch-ico{background:rgba(255,255,255,0.2)!important;color:#fff!important}
.ch:hover .ch-num{color:rgba(255,255,255,0.7)!important}
.ch:hover .ch-arrow{background:rgba(255,255,255,0.2);color:#fff}
.ch > *{position:relative;z-index:1}
.ch-1{--c1:#2563EB;--c2:#0EA5E9}
.ch-2{--c1:#10B981;--c2:#059669}
.ch-3{--c1:#8B5CF6;--c2:#6D28D9}
.ch-4{--c1:#F59E0B;--c2:#D97706}
.ch-row{display:flex;align-items:center;justify-content:space-between}
.ch-num{font-family:'JetBrains Mono',monospace;font-size:11px;color:#94A3B8;letter-spacing:0.1em;font-weight:700}
.ch-arrow{
    width:30px;height:30px;border-radius:10px;background:#F1F5F9;color:#475569;
    display:flex;align-items:center;justify-content:center;font-size:14px;transition:.2s;
}
.ch-ico{
    width:44px;height:44px;border-radius:12px;
    color:var(--c1);
    display:flex;align-items:center;justify-content:center;font-size:22px;
    transition:.25s;margin:4px auto 2px;
}
.ch-1 .ch-ico{background:#DBEAFE}
.ch-2 .ch-ico{background:#D1FAE5}
.ch-3 .ch-ico{background:#EDE9FE}
.ch-4 .ch-ico{background:#FEF3C7}
.ch h3{font-size:18px;font-weight:800;letter-spacing:-0.02em;text-align:center;padding-bottom:4px}
.ch .badge-pri{position:absolute;top:14px;right:14px;background:#0F172A;color:#fff;font-size:9px;font-weight:800;padding:3px 8px;border-radius:5px;letter-spacing:0.1em;z-index:2}

/* ========== TRUST STRIP ========== */
.trust{
    display:flex;align-items:center;gap:32px;
    padding:12px 22px;border-radius:12px;
    background:#F8FAFC;border:1px solid #E2E8F0;
    width:fit-content;margin-left:auto;
}
.trust-item{display:flex;align-items:center;gap:12px}
.trust-item .ti-ico{width:34px;height:34px;border-radius:10px;background:#fff;border:1px solid #E2E8F0;display:flex;align-items:center;justify-content:center;font-size:15px}
.trust-item .ti-txt{display:flex;flex-direction:column;gap:2px}
.trust-item .ti-txt strong{font-size:13px;font-weight:800;color:#0F172A;letter-spacing:-0.01em;line-height:1}
.trust-item .ti-txt span{font-family:'JetBrains Mono',monospace;font-size:10px;color:#94A3B8;letter-spacing:0.08em}

@media(max-width:980px){
    .shell{padding:16px 16px 40px}
    .topbar{padding:10px 16px}
    .hero{grid-template-columns:1fr;gap:32px;min-height:auto;margin-bottom:40px}
    .hero h1{font-size:52px}
    .hero-visual{height:auto;min-height:340px}
    .browser{transform:none}
    .channels{grid-template-columns:repeat(2,1fr)}
    .trust{flex-direction:row;flex-wrap:wrap}
}
</style>
</head>
<body>
<div class="bg-mesh"></div>

<div class="shell">
    <header class="topbar">
        <div class="brand">
            <a href="http://192.168.10.158:8000/" target="_blank" rel="noopener"><img src="images/logo3.png" alt="(주)중앙아이티"></a>
        </div>
        <nav class="nav">
            <div class="nav-item">
                <span class="nav-link">다운로드</span>
                <ul class="dropdown lvl1">
                    <li><span>SAMSUNG</span><ul class='dropdown lvl2'><li><a href='print/2270DW.exe'>SL-T2270DW</a></li><li><a href='print/2275DW.exe'>SL-T2275DW</a></li><li><a href='print/k3250Driver.exe'>K3250NR_2025 Print</a></li><li><a href='print/x3220Driver.exe'>X3220NR_2025 Print</a></li><li><a href='print/k3250_x3220ScanDriver.exe'>K3250_X3220NR_2025 Scan</a></li><li><a href='print/Easy Printer Manager.exe'>Easy Printer Manager</a></li><li><a href='print/ScantoPCLite.exe'>ScantoPCLite</a></li><li><a href='print/x3220 펌웨어_리커버리.zip'>x3220 펌웨어_리커버리</a></li><li><a href='print/k3250 펌웨어_리커버리.zip'>k3250 펌웨어_리커버리</a></li><li><a href='print/'>----------------------</a></li><li><a href='print/X5280_BultDriver.zip'>X5280_BultDriver</a></li><li><a href='print/X5280print.exe'>X5280_2025print</a></li><li><a href='print/k5250print.exe'>k5250_2025print</a></li><li><a href='print/k5250_x5280원격스캔.zip'>k5250_x5280원격스캔</a></li><li><a href='print/FTP Scan Driver.zip'>FTP Scan Driver</a></li><li><a href='print/anonymous.txt'>FTP SCAN 설정계정</a></li></ul></li><li><span>CANON</span><ul class='dropdown lvl2'><li><a href='print/LBP212DW20250514.exe'>LBP212DW_2025</a></li><li><a href='print/Win11_LBP223_243DW_UFRII.exe'>Win11_LBP223_243DW_UFRII</a></li><li><a href='print/Win10_LBP223_243DW_UFRII.exe'>Win10_LBP223_243DW_UFRII</a></li><li><a href='print/Gx7092.exe'>Gx7092_2025</a></li><li><a href='print/Gx7192.exe'>Gx7192_2025</a></li><li><a href='print/MF635cxzip.zip'>MF635CX_2025</a></li><li><a href='print/MF645CMFDriver.exe'>MF645CX_2025</a></li><li><a href='print/MFscanutilitySETUP.exe'>MF SCAN Uitlity</a></li></ul></li><li><span>BROTHER</span><ul class='dropdown lvl2'><li><a href='print/DCP-T710-KOR.exe'>DCP-T710w 64비트</a></li><li><a href='print/DCP-T810-KOR.exe'>DCP-T810w 64비트</a></li><li><a href='print/'>----------------------</a></li><li><a href='print/Win11_MFC-T930DW.EXE'>Win11_T930DW</a></li><li><a href='print/Win11_MFC-T920DW.EXE'>Win11_T920DW</a></li><li><a href='print/Win11_MFC-L3760CDW.EXE'>Win11_L3760CDW</a></li><li><a href='print/'>----------------------</a></li><li><a href='print/Win10_MFC-T930DW.EXE'>Win10_T930DW</a></li><li><a href='print/Win10_MFC-T920DW.EXE'>Win10_T920DW</a></li><li><a href='print/Win10_MFC-L3760CDW.EXE'>Win10_L3760CDW</a></li><li><a href='print/'>----------------------</a></li><li><a href='print/Brother iPrint&Scan.exe'>Brother iPrint&Scan</a></li><li><a href='print/delinf_10790.EXE'>드라이버제거</a></li><li><a href='print/브라더복합기메뉴얼.jpg'>브라더복합기메뉴얼</a></li></ul></li><li><span>BIXOLON</span><ul class='dropdown lvl2'><li><a href='print/D420_Driver_V5.3.10.7630_한국어.zip'>D420_Driver_V5.3.10.7630_한국어</a></li><li><a href='print/NetConfigurationTool.exe'>NetConfigurationTool</a></li></ul></li><li><span>EPSON</span><ul class='dropdown lvl2'><li><a href='print/엡손L6290.zip'>엡손L6290</a></li></ul></li><li><span>프로그램</span><ul class='dropdown lvl2'><li><a href='print/TeamViewer_Setup_x64.exe'>TeamViewer_Setup_x64</a></li><li><a href='print/TeamViewer.exe'>TeamViewerQS</a></li><li><a href='print/JaitNetScan_v2.exe'>JaitNetScan_v2</a></li><li><a href='print/공유폴더 오류.zip'>공유폴더 오류</a></li><li><a href='print/SYSTEMBASE_Serial to USB드라이버.zip'>SYSTEMBASE_Serial to USB드라이버</a></li><li><a href='print/open.exe'>오픈오피스</a></li><li><a href='print/honey.exe'>꿀뷰</a></li><li><a href='print/bandi.exe'>반디집</a></li><li><a href='print/adobe.exe'>ADOBE READER</a></li></ul></li><li><span>동의서</span><ul class='dropdown lvl2'><li><a href='print/헬프유앱.apk'>JAIT.헬프유앱.apk</a></li><li><a href='print/헬프유앱addon.apk'>JAIT.헬프유앱addon.apk</a></li><li><a href='print/Synologyclient.exe'>JAIT.Synologyclient</a></li><li><a href='print/Anydesk.apk'>JAIT.Anydesk.apk</a></li><li><a href='print/pingtest.apk'>JAIT.pingtest.apk</a></li><li><a href='print/viwer14.apk'>JAIT.sign뷰어14.apk</a></li><li><a href='print/viwer15.apk'>JAIT.sign뷰어15.apk</a></li><li><a href='print/jaitsign-데모.apk'>JAIT.Sign-데모.apk</a></li><li><a href='print/jaitsign-new.apk'>JAIT.Sign-new.apk</a></li><li><a href='print/jaitsign.apk'>JAIT.Sign.apk</a></li><li><a href='print/JAIT.Sign_Setup.msi'>JAIT.Sign_설치</a></li></ul></li><li><span>매뉴얼</span><ul class='dropdown lvl2'><li><a href='print/25.04 전자동의서_메뉴얼.pdf'>25.04 동의서_매뉴얼</a></li></ul></li>                </ul>
            </div>
            <a class="nav-link" href="https://blog.naver.com/jungangit" target="_blank" rel="noopener">블로그</a>
        </nav>
        <span class="hot"><span class="dot"></span>고객센터 1670-9558</span>
    </header>

    <section class="hero">
        <div class="hero-text">
            <div class="eyebrow">REMOTE SUPPORT · 의료기관 IT 파트너</div>
            <h1>중앙아이티<br><span class="accent">원격지원</span></h1>
            <div class="en-sub">JOONG ANG INFORMATION TECHNOLOGY</div>
            <p>원격지원 서비스는 상담원이 고객의 화면을 함께 보면서 신속, 정확하게 도와드리는 고객지원서비스입니다. 원격지원은 팀뷰어 링크 프로그램을 통해 이루어집니다. 자세한 문의는 고객센터 연락처를 통해 문의하실 수 있습니다.</p>
            <div class="cta-group">
                <span class="cta-secondary"><span class="dot"></span>고객센터 1670-9558</span>
            </div>
        </div>

        <div class="hero-visual">
            <div class="glow"></div>
            <div class="browser">
                <div class="browser-bar">
                    <div class="browser-dots"><span></span><span></span><span></span></div>
                    <div class="browser-url"><span class="lock">🔒</span>helpu.kr/jait</div>
                </div>
                <div class="browser-body">
                    <div class="session-strip">
                        <div class="live"><span class="pulse"></span>원격 지원 세션 활성</div>
                        <div class="agent">AGENT · JOONG-AI-T</div>
                    </div>
                    <div class="fake-rows">
                        <div class="fake-row"><div class="ico">🖥️</div><div class="ln"></div><div class="pct">화면 공유</div></div>
                        <div class="fake-row"><div class="ico">🔐</div><div class="ln"></div><div class="pct">암호화 OK</div></div>
                        <div class="fake-row"><div class="ico">💬</div><div class="ln"></div><div class="pct">상담 진행</div></div>
                    </div>
                </div>
            </div>

            <div class="sticker s1">
                <div class="ico">🔒</div>
                <div class="lbl"><strong>암호화 세션</strong><span>SECURE</span></div>
            </div>
            <div class="sticker s2">
                <div class="ico">🟢</div>
                <div class="lbl"><strong>지금 연결 가능</strong><span>ONLINE</span></div>
            </div>
        </div>
    </section>

    <section class="channels">
        <a class="ch ch-1" href="http://helpu.kr/jait" target="_blank" rel="noopener">
            <div class="ch-row">
                <span class="ch-num">01</span>
                <span class="ch-arrow">→</span>
            </div>
            <div class="ch-ico">🎧</div>
            <h3>헬프 U</h3>
        </a>
        <a class="ch ch-2" href="http://helpu.kr/jsign" target="_blank" rel="noopener">
            <div class="ch-row">
                <span class="ch-num">02</span>
                <span class="ch-arrow">→</span>
            </div>
            <div class="ch-ico">📝</div>
            <h3>전자동의서</h3>
        </a>
        <a class="ch ch-3" href="https://get.teamviewer.com/6u5ryn4" target="_blank" rel="noopener">
            <div class="ch-row">
                <span class="ch-num">03</span>
                <span class="ch-arrow">→</span>
            </div>
            <div class="ch-ico">🖥️</div>
            <h3>팀뷰어</h3>
        </a>
        <a class="ch ch-4" href="https://jait.synology.me:9001/toner-system/client.php" target="_blank" rel="noopener">
            <div class="ch-row">
                <span class="ch-num">04</span>
                <span class="ch-arrow">→</span>
            </div>
            <div class="ch-ico">📦</div>
            <h3>소모품 요청</h3>
        </a>
    </section>

    <section class="trust">
        <div class="trust-item">
            <div class="ti-ico">📅</div>
            <div class="ti-txt"><strong>평일 09:00–18:00</strong><span>MON–FRI</span></div>
        </div>
        <div class="trust-item">
            <div class="ti-ico">📞</div>
            <div class="ti-txt"><strong>고객센터 1670-9558</strong><span>HOTLINE</span></div>
        </div>
    </section>
</div>
<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js/v4bc70e2c01a94c73b74392e4234840661791215815920" integrity="sha512-L0ha0OXavK/8okipN9F8BtP84dg9DUhPERbBXzwI6dgTA55d2+yweo3pn5CSFYs45/r8md2+xvUPtTdvTNRfjA==" data-cf-beacon='{"version":"2024.11.0","token":"3b224bf0551c47ca8c5d72e756391db6","r":1,"spa":2}' crossorigin="anonymous"></script>
</body>
</html>


