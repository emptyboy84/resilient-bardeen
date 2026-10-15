Title: Live Content

Description: Fetched live

Source: https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHhtCICmtnYk679qE1JR7vL-2x09o4x3SmGHMKbo-dG8twiGCCLZpLt9P5MsAP0VB8lCoJs0xIUcH8wyDiWYPjv9QWdlvGAQIZhY6SQzi0oJbI_27kQkoHTWa0GAmsBFkukpa0dlYyo2imnfjbp99YdO3Tzl3vdONMg2nonTtCzou6MH1yexRETYzbP-8UrNgY-BAB6GhVScngETh6G-cQ0Zuqe8Fa_VVSoS5OuFgEaq5ez5iuLpZPXwqST-zn23gsuPLv4texQ7L6m5Bq1ZtHWkI02_GqHPUUD6vF6zNEdO0-dpfItzCrjzbA7CR8Fx4WDUnOO4nDm9DN2d0zN0JR4_oXLfXWPsKs=

---

<!DOCTYPE html>
<html lang="ko">



<head><script>(function(i, s, o, g, r) {
    var a = s.createElement(o);
    var m = s.getElementsByTagName(o)[0];
    a.async = true;
    a.src = g;
    a.onload = function() {
        if (i[r].init) {
            i[r].init('https://js-error-tracer-api.cafe24.com', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlZ2duYnVncy5jYWZlMjQuY29tIiwiYXVkIjoianMtZXJyb3ItdHJhY2VyLWFwaS5jYWZlMjQuY29tIiwibWFsbF9pZCI6ImVnZ25idWdzIiwic2hvcF9ubyI6MSwicGF0aF9yb2xlIjoiUFJPRFVDVF9ERVRBSUwiLCJsYW5ndWFnZV9jb2RlIjoia29fS1IiLCJjb3VudHJ5X2NvZGUiOiJLUiIsImlzX3l0cyI6ZmFsc2UsImlzX2NvbnRhaW5lciI6dHJ1ZSwid29ya3NwYWNlIjoicHJvZHVjdGlvbiJ9.GW0F_jaiNHrup9Ei1jYwV0xv_rtQBvx1XpNlRTWDn5E', {"errors":{"path":"\/api\/v1\/store","collectWindowErrors":true,"preventDuplicateReports":true,"storageKeyPrefix":"EC_JET.PRODUCT_DETAIL","samplingEnabled":true,"samplingRate":0.5},"vitals":{"path":"\/api\/v1\/vitals","samplingEnabled":true,"samplingRate":0.3},"resources":{"path":"\/api\/v1\/resources","samplingEnabled":true,"samplingRate":0.5,"durationThreshold":3000}});
        }
    };
    m.parentNode.insertBefore(a, m);
}(window, document, 'script', '//assets.poxo.com/jet/jet.js', 'EC_JET'));</script>
<script type="text/javascript">window.CAFE24 = window.CAFE24 || {};CAFE24.ROUTE = {"is_mobile":false,"is_need_route":false,"language_code":"ZZ","path":{"origin":"\/product\/\uc5d0\uadf8\ubc15\uc0ac-\uc870\ub07c-\uc544\ub3d9\uc6a9-\uc815\uae00\uc870\ub07c\/55\/category\/1\/display\/2\/","result":"\/product\/\uc5d0\uadf8\ubc15\uc0ac-\uc870\ub07c-\uc544\ub3d9\uc6a9-\uc815\uae00\uc870\ub07c\/55\/category\/1\/display\/2\/","prefix":""},"shop_no":0,"skin_code":"default","support_language_list":{"ar":"ar_EG","ar-EG":"ar_EG","de":"de_DE","de-DE":"de_DE","en":"en_US","en-IN":"en_IN","en-PH":"en_PH","en-US":"en_US","es":"es_ES","es-ES":"es_ES","hi":"hi_IN","hi-IN":"hi_IN","id":"id_ID","id-ID":"id_ID","it":"it_IT","it-IT":"it_IT","ja":"ja_JP","ja-JP":"ja_JP","ko":"ko_KR","ko-KR":"ko_KR","ms":"ms_MY","ms-MY":"ms_MY","pt":"pt_PT","pt-PT":"pt_PT","ru":"ru_RU","ru-RU":"ru_RU","th":"th_TH","th-TH":"th_TH","tr":"tr_TR","tr-TR":"tr_TR","vi":"vi_VN","vi-VN":"vi_VN","zh":"zh_CN","zh-CN":"zh_CN","zh-HK":"zh_HK","zh-MO":"zh_MO","zh-SG":"zh_SG","zh-TW":"zh_TW"}};</script><script type="text/javascript">if (typeof EC_ROUTE === "undefined") {
    /**
     * 프론트용 라우트 플러그인
     * @type {{bInit: boolean, init: EC_ROUTE.init}}
     * CAFE24.ROUTE 참조
     */
    var EC_ROUTE = {
        EC_DOMAIN_PATH_INFO: 'EC_DOMAIN_PATH_INFO',
        bInit: false,
        aFromList: [],
        aToList: [],
        aCleanFilter: null,
        init: function () {
            if (this.bInit || typeof CAFE24.ROUTE === 'undefined') {
                return;
            }
            this.bInit = true;
            this.aCleanFilter = [
                /^shop[1-9][0-9]*$/,
                /^(m|p)$/,
                new RegExp('^(' + Object.keys(CAFE24.ROUTE.support_language_list).join('|')  + ')$'),
                /^skin-(base|skin[1-9][0-9]*|mobile[0-9]*)$/,
            ];
        },
        isNeedRoute: function ()
        {
            return CAFE24.ROUTE.is_need_route;
        },
        /**
         *
         * @param iShopNo
         * @param bMobile
         * @param sFrontLanguage
         * @param sSkinCode
         * @returns {*|string}
         */
        getUrlDomain: function (iShopNo, bMobile, sFrontLanguage, sSkinCode)
        {
            var oRouteConfig = {};
            if (typeof iShopNo == 'undefined') {
                oRouteConfig.shop_no = CAFE24.SDE_SHOP_NUM;
            } else {
                oRouteConfig.shop_no = iShopNo;
            }
            if (typeof bMobile == 'undefined') {
                oRouteConfig.is_mobile = false;
            } else {
                oRouteConfig.is_mobile = bMobile;
            }
            if (typeof sFrontLanguage == 'undefined') {
                oRouteConfig.language_code = '';
            }else {
                oRouteConfig.language_code = sFrontLanguage; // 내부에서 로직으로 동작할땐 언어_지역 형태의 로케일 형태를 따른다.
            }
            if (typeof sSkinCode == 'undefined') {
                oRouteConfig.skin_code = '';
            }else {
                oRouteConfig.skin_code = sSkinCode;
            }

            var sDomain = '';
            if (oRouteConfig.shop_no != CAFE24.SDE_SHOP_NUM) {
                // 접근된 다른 멀티샵 도메인 정보는 primary domain 를 조회해야함으로 ajax 를 통해 정보를 얻는다.
                sDomain = this._getUrlDomainMultishop(oRouteConfig);
            } else {
                // 샵이 동일할 경우에는 접근된 domain 에 path 정보만 정리하여 반환함.
                sDomain = this._getUrlDomain(oRouteConfig);
            }
            return sDomain;
        },
        _getUrlDomainMultishop: function (oRouteConfig)
        {
            var sDomain = '';
            EC$.ajax({
                type: 'GET',
                url: '/exec/front/Shop/Domain',
                data: {
                    '_shop_no' : oRouteConfig.shop_no,
                    'is_mobile' : oRouteConfig.is_mobile,
                    'language_code' : oRouteConfig.language_code,
                    'skin_code' : oRouteConfig.skin_code,
                },
                async: false,
                dataType: 'json',
                cache: true,
                success: function(oResult) {
                    switch (oResult.code) {
                        case '0000' :
                            sDomain = oResult.data;
                            break;
                        default :
                            break;
                    }
                    return false;
                }
            });
            return sDomain;
        },
        _getUrlDomain: function (oRouteConfig)
        {
            oRouteConfig.domain = this._getCreateHost(oRouteConfig);
            return location.protocol + '//' + oRouteConfig.domain + this._getCreateUri(oRouteConfig);
        },
        _getCreateHost : function (oRouteConfig)
        {
            var sHost = location.host;
            var aHost = sHost.split('.');
            if (this.isBaseDomain(sHost)) {
                if (aHost.length > 3) {
                    aHost[0] = '';
                }
            } else if (oRouteConfig.is_mobile) {
                if (this.isMobileDomain()) {
                    oRouteConfig.is_mobile = false;
                }
            }
            return aHost.filter(Boolean).join('.');
        },
        _getCreateUri: function (oRouteInfo)
        {
            var aUrl = [];
            if (this.isBaseDomain() && oRouteInfo.shop_no > 1) {
                aUrl.push('shop' + oRouteInfo.shop_no);
            }
            if (oRouteInfo.is_mobile) {
                aUrl.push('m');
            }
            if (oRouteInfo.language_code != 'ZZ' && oRouteInfo.language_code != '') {
                var iIndex = Object.values(CAFE24.ROUTE.support_language_list).indexOf(oRouteInfo.language_code);
                if (iIndex !== -1) {
                    aUrl.push(Object.keys(CAFE24.ROUTE.support_language_list)[iIndex]);
                }
            }
            if (this.isBaseDomain() && oRouteInfo.skin_code != 'default' && oRouteInfo.skin_code != '') {
                aUrl.push('skin-' + oRouteInfo.skin_code);
            }
            var sUrl= '/';
            if (aUrl.length > 0) {
                sUrl= '/' + aUrl.join('/');
                sUrl = this.rtrim(sUrl, '/');
            }
            return sUrl;
        },
        /**
         * en, en-US => en_US
         */
        convertValidLanguageCode: function (sUrlLanguageCode)
        {
            if (typeof CAFE24.ROUTE.support_language_list[sUrlLanguageCode] != 'undefined') {
                return CAFE24.ROUTE.support_language_list[sUrlLanguageCode];
            }
            return false;
        },
        isMobileDomain: function (sHost)
        {
            if (typeof sHost == 'undefined') {
                sHost = location.host;
            }
            var aMatched = sHost.match(/^(m|mobile|skin\-mobile|skin\-mobile[0-9]+[\-]{2}shop[0-9]+|skin\-mobile[0-9]+|mobile[\-]{2}shop[0-9]+)\./i);
            return aMatched != null;
        },
        isBaseDomain: function (sHost)
        {
            if (typeof sHost == 'undefined') {
                sHost = location.host;
            }
            return sHost.indexOf(CAFE24.GLOBAL_INFO.getRootDomain()) !== -1;
        },
        removePrefixUrl: function (sUrl)
        {
            if (this.isNeedRoute()) {
                sUrl = sUrl.replace(this.getPrefixUrl('/'), '/'); // 자동으로  prefix 붙은 영역을 제거해준다.
            }
            return sUrl;
        },
        getPrefixUrl: function (sUrl)
        {
            if (this.isNeedRoute() === false) {
                return sUrl;
            }
            if (sUrl.indexOf('/') !== 0) {
                return sUrl;
            }
            if (sUrl.match(/^\/{2,}/) !== null) {
                return sUrl;
            }

            var iCachedPosition = this.aFromList.indexOf(sUrl);
            if (iCachedPosition > -1) {
                return this.aToList[iCachedPosition];
            }

            var bTailSlash = (sCleanUrl !== '/' && sUrl.substr(-1) === '/');
            var sCleanUrl = this.getCleanUrl(sUrl);
            var aPrefixPart = CAFE24.ROUTE.path.prefix.split('/');
            var aUrlPart = sCleanUrl.split('/');
            var bMatched = true;
            var sReturnUrl = sCleanUrl;
            if (aUrlPart.length < aPrefixPart.length) {
                bMatched = false;
            } else {
                for (var i = 0; i < aPrefixPart.length ; i++) {
                    if (aPrefixPart[i] != aUrlPart[i]) {
                        bMatched = false;
                        break;
                    }
                }
            }
            if (bMatched === false) {
                if (sCleanUrl == '/') {
                    sReturnUrl = CAFE24.ROUTE.path.prefix;
                } else {
                    sReturnUrl = CAFE24.ROUTE.path.prefix +  sCleanUrl;
                }
                sReturnUrl = bTailSlash ? sReturnUrl : this.rtrim(sReturnUrl, '/')
                this.aFromList.push(sUrl);
                this.aToList.push(sReturnUrl);
            }
            return sReturnUrl;
        },
        /**
         * document.location.pathname 이 필요할 경우 사용한다.
         * @returns {*}
         */
        getPathName: function()
        {
            if (typeof CAFE24.ROUTE.path.result == 'undefined') {
                return document.location.pathname;
            }
            return CAFE24.ROUTE.path.result;
        },
        rtrim: function (str, chr)
        {
            var rgxtrim = (!chr) ? new RegExp('\\s+$') : new RegExp(chr+'+$');
            return str.replace(rgxtrim, '');
        },
        getShopNo: function ()
        {
            return CAFE24.ROUTE.shop_no;
        },
        getSkinCode: function ()
        {
            return CAFE24.ROUTE.skin_code;
        },
        getLanguageCode: function ()
        {
            return CAFE24.ROUTE.language_code;
        },
        getMobile: function ()
        {
            return CAFE24.ROUTE.is_mobile;
        },
        getIsMobile: function ()
        {
            return CAFE24.ROUTE.is_mobile || CAFE24.ROUTE.skin_code.match(/^mobile[0-9]*$/);
        },
        getCleanUrl: function (sUrl)
        {
            if (sUrl === '/') {
                return sUrl;
            }

            var aUrl = sUrl.split('/');
            aUrl.shift();

            if (aUrl.length < 1) {
                return sUrl;
            }

            // 현재 4 depth 까지 미리보기 기능이 구현되어있음
            var iPos = 0;
            var bFind = false;
            for (var i = 0; i < aUrl.length ; i++) {
                bFind = false;
                for (var iSub = iPos, iSubCount = this.aCleanFilter.length; iSub < iSubCount ; iSub++) {
                    if (aUrl[i].match(this.aCleanFilter[iSub]) !== null) {
                        bFind = true;
                        iPos = iSub + 1;
                        aUrl.splice(i, 1);
                        i--; // aUrl 을 삭제해 주었으니 검색 조건을 -1 제거하여 초기화 한다. 다음 for i++ 로 증감 조회됨.
                        break;
                    }
                }
                if (bFind === false) {
                    break;
                }
            }
            return '/' + aUrl.join('/');
        },
        getIsEasyUrl : function ()
        {
            return !window.location.pathname.match(/^[\w\/\-\.]+(php|html|htm)$/i);
        }
    };
    EC_ROUTE.init();
}
</script>
<meta name="path_role" content="PRODUCT_DETAIL" />
<meta name="author" content="에그박사 공식몰" />
<meta name="description" content="에그박사 공식몰의 에그박사 조끼입니다. 어린이 자연관찰, 체험학습, 탐험 놀이에 어울리는 키즈 탐험 조끼 공식 굿즈를 만나보세요." />
<meta name="keywords" content="에그박사 조끼,에그박사 공식몰,에그박사 굿즈,어린이 조끼,키즈 조끼,탐험 조끼,어린이 탐험 조끼,자연관찰 조끼,체험학습 조끼" />
<meta name="design_html_path" content="/product/detail.html" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8">

	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="format-detection" content="telephone=no"/>    
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, minimum-scale=1.0, user-scalable=yes"/>
    <!-- PG크로스브라우징필수내용 -->
    <meta http-equiv="Cache-Control" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <meta http-equiv="Pragma" content="no-cache">
    <!-- // PG크로스브라우징필수내용 -->

        <!-- 해당 CSS는 쇼핑몰 전체 페이지에 영향을 줍니다. 삭제와 수정에 주의해주세요. -->
    
    
    
    
    
    
    
    
    
    
    
  	
    

	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&amp;family=Noto+Sans+KR:wght@300;400;500;700&amp;display=swap" rel="stylesheet">
	<link href="//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css" rel="stylesheet" type="text/css"><!-- theme03 -->
	<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&amp;display=swap" rel="stylesheet"><!-- theme03 -->
	<link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700&amp;family=Red+Hat+Display:wght@400;500;700&amp;display=swap" rel="stylesheet"><!-- theme04 -->

    
	
	

    
    
    
    <script>try{window.EZST={q:[],register:function(a,b){this.push([a,(b.init||b)(),arguments])}}}catch(e){}</script>
    <!--ez-favicon[-->
    <!--ez-favicon]-->
    
<script type="text/ez-prop">
	<ez-prop data-version="1.0.0">
		<ez-var data-prop="theme" data-namespace="ez.layout.theme" data-type="array">
			<ez-item data-id="theme01" data-name="MODERN" data-desc="(블랙+노토산스)" data-font="Noto Sans KR" data-background-color="#f5f5f5" override-value="html" data-font-css="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap">
				모던하고 차분한 스타일
				<!-- HTML도 <b>이렇게</b> 가능합니다.<br>
				세부 옵션은 <a href="https://sample.cafe24.com/theme01" target="_blank">이곳을</a> 통해 확인 할 수 있습니다. -->
			</ez-item>
			<ez-item data-id="theme02" data-name="SOFT" data-desc="은은하고 부드러운 스타일	" data-font="Noto Sans KR" data-background-color="#d8d9ed" data-font-css="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap"></ez-item>
			<ez-item data-id="theme03" data-name="BREEZY" data-desc="밝고 경쾌한 스타일" data-font="Spoqa Han Sans Neo" data-background-color="#ffc1a8" data-font-css="//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css"></ez-item>
			<ez-item data-id="theme04" data-name="FRESH" data-desc="시원하고 산뜻한 스타일" data-font="Nanum Gothic" data-background-color="#c3e7e7" data-font-css="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700&family=Red+Hat+Display:wght@400;500;700&display=swap"></ez-item>
		</ez-var>
	</ez-prop>
</script>
<script type="text/javascript" src="//wcs.naver.net/wcslog.js"></script>

            <script type="text/javascript">
            if(window.wcs) {
                if(!wcs_add) var wcs_add = {};
    
                // (2) 각 사이트별 식별자 설정
                wcs_add["wa"] = "s_2bd10ed50f24";
    
                // (3) 광고 전환추적을 위한 cookie domain설정
    
                if (window.wcs) {
                    wcs.inflow("eggnbugs.cafe24.com");
                }
    
                // 아래 Script는 개별 event 발생시 로그를 전송하기 위한 구역. 결제 완료 페이지이므로, PV event 와 결제완료 전환 event를 전송함
     
                
    
                // (5) 결제완료 전환 event 전송
    
                var _conv = {} // event 정보 담을 object 생성
    
                _conv.type = "view_product"  // object에 purchase event 세팅
    
                
    
                _conv.items = [       // 전환 event 행동의 내용 및 대상에 대한 정보 기술
                    
                {
                    id: "55",                                                //string 상품 id (필수)
                    name: "에그박사 조끼 아동용 정글조끼"       //string 상품 명 (필수)
                    
                }
            
                ];
    
                
    
                wcs.trans(_conv) // event 정보를 담은 object를 서버에 전송(위 item #1, #2 포함)
            }
            </script>
        
<script type="application/ld+json">{"@context":"https://schema.org","@type":"ProductGroup","@id":"https://dregg.shop/product/에그박사-조끼-아동용-정글조끼/55/","name":"에그박사 조끼 아동용 정글조끼","productGroupID":"cafe24_eggnbugs_1_55","variesBy":["size"],"hasVariant":[{"@type":"Product","name":"에그박사 조끼 아동용 정글조끼 S사이즈(100~110)","image":["https://ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/product/big/20260112/4387c3b09983aed325be5c6e36c8de97.jpg"],"description":"에그박사 공식몰의 에그박사 조끼입니다. 어린이 자연관찰, 체험학습, 탐험 놀이에 어울리는 키즈 탐험 조끼 공식 굿즈를 만나보세요.","brand":{"@type":"Brand","name":"에그박사"},"sku":"cafe24_eggnbugs_1_55_P00000CD000B","size":"S사이즈(100~110)","offers":{"@type":"Offer","url":"https://dregg.shop/product/에그박사-조끼-아동용-정글조끼/55/?item_code=P00000CD000B","priceCurrency":"KRW","price":35900,"availability":"https://schema.org/InStock"}},{"@type":"Product","name":"에그박사 조끼 아동용 정글조끼 M사이즈(120~130)","image":["https://ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/product/big/20260112/4387c3b09983aed325be5c6e36c8de97.jpg"],"description":"에그박사 공식몰의 에그박사 조끼입니다. 어린이 자연관찰, 체험학습, 탐험 놀이에 어울리는 키즈 탐험 조끼 공식 굿즈를 만나보세요.","brand":{"@type":"Brand","name":"에그박사"},"sku":"cafe24_eggnbugs_1_55_P00000CD000C","size":"M사이즈(120~130)","offers":{"@type":"Offer","url":"https://dregg.shop/product/에그박사-조끼-아동용-정글조끼/55/?item_code=P00000CD000C","priceCurrency":"KRW","price":35900,"availability":"https://schema.org/InStock"}},{"@type":"Product","name":"에그박사 조끼 아동용 정글조끼 L사이즈(140~150)","image":["https://ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/product/big/20260112/4387c3b09983aed325be5c6e36c8de97.jpg"],"description":"에그박사 공식몰의 에그박사 조끼입니다. 어린이 자연관찰, 체험학습, 탐험 놀이에 어울리는 키즈 탐험 조끼 공식 굿즈를 만나보세요.","brand":{"@type":"Brand","name":"에그박사"},"sku":"cafe24_eggnbugs_1_55_P00000CD000D","size":"L사이즈(140~150)","offers":{"@type":"Offer","url":"https://dregg.shop/product/에그박사-조끼-아동용-정글조끼/55/?item_code=P00000CD000D","priceCurrency":"KRW","price":35900,"availability":"https://schema.org/InStock"}}]}</script>
<!-- Google Site Verification -->
<meta name="google-site-verification" content="8YXd0g4Abj-64R8W4pMhOdbJlrCOvZwZk8a8eU4hG8M" />
<!-- Google Site Verification -->
<!-- Google Site Verification -->
<meta name="google-site-verification" content="odKrznoVRM7cKzjXKQMMkWnLdPUStp6Lh_lO-i3yrm0" />
<!-- Google Site Verification -->
<!-- Google Site Verification -->
<meta name="google-site-verification" content="Nw2_WkoXC_ayTRCFSSp7yB_MKB1hHFwowrSnx8CHs88" />
<!-- Google Site Verification -->
<link rel="canonical" href="https://dregg.shop/product/에그박사-조끼-아동용-정글조끼/55/" />
<meta property="og:url" content="https://dregg.shop/product/에그박사-조끼-아동용-정글조끼/55/" />
<meta property="og:title" content="에그박사 조끼 아동용 정글조끼 - 에그박사" />
<meta property="og:site_name" content="에그박사" />
<meta property="og:type" content="product" />
<meta property="og:image" content="https://ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/product/big/20260112/4387c3b09983aed325be5c6e36c8de97.jpg" />
<meta property="product:price:amount" content="35900" />
<meta property="product:price:currency" content="KRW" />
<meta property="product:sale_price:amount" content="34100" />
<meta property="product:sale_price:currency" content="KRW" />
<meta property="product:productId" content="55" />
<meta property="product:retailer_item_id" content="55" />
<meta name="naver-site-verification" content="3ef2ec6cecbb08f4633cbf95af8f9559a6cfc9df" />
<script type="text/javascript" src="//wcs.naver.net/wcslog.js"></script>
<script type="text/javascript">var CAFE24API = { instance: [], MALL_ID: 'eggnbugs', SHOP_NO: 1, basicAuthKeys: {}, setBasicAuthKey: function (clientId, basicAuthKey) { if (typeof basicAuthKey !== 'string') { return; } if (clientId) { CAFE24API.basicAuthKeys[clientId] = basicAuthKey; } else { CAFE24API.basicAuthKeys['default'] = basicAuthKey; } }, init: function (appInfo) { if (typeof appInfo == 'object') { if (appInfo.hasOwnProperty('client_id')) { var appKey = appInfo.client_id; } } else { var appKey = appInfo; } if (appKey) { if (!this.instance[appKey]) { CAFE24API.clientId = appKey; if (appInfo.hasOwnProperty('version')) { CAFE24API.version = appInfo.version; } else { if (CAFE24API.hasOwnProperty('version')) { delete CAFE24API.version; } } var copyObject = CAFE24API.constructor(); for (var attr in CAFE24API) { if (CAFE24API.hasOwnProperty(attr)) { copyObject[attr] = CAFE24API[attr]; } } this.instance[appKey] = copyObject; } return this.instance[appKey]; } }, initializeXhr: function () { try { return new XMLHttpRequest(); } catch (error) { return new window.ActiveXObject('Microsoft.XMLHTTP'); } }, fullPath: function (url) { return 'https://eggnbugs.cafe24api.com' + url; }, getLoginProvider: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'login': CAPP_ASYNC_METHODS.AppCommon.getLoginProvider() }); }, getCustomerProvider: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'login': CAPP_ASYNC_METHODS.AppCommon.getCustomerProvider() }); }, getMemberID: function (callback) { if (!CAPP_ASYNC_METHODS.IS_LOGIN) { callback(null); } else { callback(CAPP_ASYNC_METHODS.AppCommon.getMemberID()); } }, getEncryptedMemberId: function (client_id, callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, CAPP_ASYNC_METHODS.AppCommon.getEncryptedMemberId(client_id)); }, getMemberInfo: function (callback) { callback({ 'id': CAPP_ASYNC_METHODS.AppCommon.getMemberInfo() }); }, getCustomerIDInfo: function (callback) { if (!CAFE24API.__scopeErr(callback, 'application')) { return; } callback(null, { 'id': CAPP_ASYNC_METHODS.AppCommon.getCustomerIDInfo() }); }, getCustomerInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'customer': CAPP_ASYNC_METHODS.AppCommon.getCustomerInfo() }); }, getDefaultShippingAddress: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'shipping_address': CAPP_ASYNC_METHODS.AppCommon.getDefaultShippingAddress() }); }, getMileageInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'mileage': CAPP_ASYNC_METHODS.AppCommon.getMileageInfo() }); }, getPointInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'point': CAPP_ASYNC_METHODS.AppCommon.getPointInfo() }); }, getDepositInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'deposit': CAPP_ASYNC_METHODS.AppCommon.getDepositInfo() }); }, getCreditInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'credit': CAPP_ASYNC_METHODS.AppCommon.getCreditInfo() }); }, getCartList: function (callback) { if (!CAFE24API.__scopeErr(callback, 'personal')) { return; } CAPP_ASYNC_METHODS.AppCommon.getCartList().then(function (data) { callback(null, { 'carts': data }); }); }, getCartInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'personal')) { return; } callback(null, { 'cart': CAPP_ASYNC_METHODS.AppCommon.getCartInfo() }); }, getCartItemList: function (callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } callback(null, { 'items': CAPP_ASYNC_METHODS.AppCommon.getCartItemList() }); }, getCartCount: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'personal')) { return; } callback(null, CAPP_ASYNC_METHODS.AppCommon.getCartCount()); }, getCouponCount: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'promotion')) { return; } callback(null, CAPP_ASYNC_METHODS.AppCommon.getCouponCount()); }, getWishCount: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'personal')) { return; } callback(null, CAPP_ASYNC_METHODS.AppCommon.getWishCount()); }, getShopInfo: function (callback) { if (!CAFE24API.__scopeErr(callback, 'store')) { return; } callback(null, { 'shop': CAPP_ASYNC_METHODS.AppCommon.getShopInfo() }); }, addCurrentProductToCart: function (mall_id, time, app_key, member_id, hmac, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.addCurrentProductToCart(mall_id, time, app_key, member_id, hmac).then(function (data) { callback(null, { 'cart': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error('422'), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, precreateOrder: function (mall_id, time, app_key, member_id, hmac, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.precreateOrder(mall_id, time, app_key, member_id, hmac).then(function (data) { callback(null, { 'order': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error('422'), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, calculatePayment: function (mall_id, request_time, app_key, member_id, request_data_json, hmac, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.calculatePayment(mall_id, request_time, app_key, member_id, request_data_json, hmac).then(function (data) { callback(null, { 'expected_payment': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error('422'), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, precreateOrderV2: function (mall_id, time, app_key, member_id, request_data_json, hmac, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.precreateOrderV2(mall_id, time, app_key, member_id, request_data_json, hmac).then(function (data) { callback(null, { 'order': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error('422'), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, getOrderItemList: function (start_date, end_date, order_status, page, count, order_id, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.getOrderItemList(start_date, end_date, order_status, page, count, order_id).then(function (data) { callback(null, { 'items': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, getOrderDetailInfo: function (shop_no, order_id, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.getOrderDetailInfo(shop_no, order_id).then(function (data) { callback(null, { 'orders': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, getClaimableItemList: function (order_id, customer_service_type, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.getClaimableItemList(order_id, customer_service_type).then(function (data) { callback(null, { 'items': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, emptyCart: function (basket_shipping_type, callback) { if (!CAFE24API.__scopeErr(callback, 'personal')) { return; } CAPP_ASYNC_METHODS.AppCommon.emptyCart(basket_shipping_type).then(function (data) { callback(null, { 'result': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, deleteCartItems: function (basket_shipping_type, product_list, callback) { if (!CAFE24API.__scopeErr(callback, 'personal')) { return; } CAPP_ASYNC_METHODS.AppCommon.deleteCartItems(basket_shipping_type, product_list).then(function (data) { callback(null, { 'result': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, addCart: function (basket_type, prepaid_shipping_fee, product_list, callback) { if (!CAFE24API.__scopeErr(callback, 'personal')) { return; } CAPP_ASYNC_METHODS.AppCommon.addCart(basket_type, prepaid_shipping_fee, product_list).then(function (data) { callback(null, data); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }) }, addBundleProductsCart: function (basket_type, prepaid_shipping_fee, product_list, callback) { if (!CAFE24API.__scopeErr(callback, 'personal')) { return; } CAPP_ASYNC_METHODS.AppCommon.addBundleProductsCart(basket_type, prepaid_shipping_fee, product_list).then(function (data) { callback(null, data); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }) }, get: function (url, callback) { return CAFE24API.complete('GET', url, this, null, callback); }, post: function (url, params, callback) { return CAFE24API.complete('POST', url, this, params, callback); }, put: function (url, params, callback) { return CAFE24API.complete('PUT', url, this, params, callback); }, delete: function (url, callback) { return CAFE24API.complete('DELETE', url, this, null, callback); }, complete: function (method, url, obj, params, callback) { var xhr = CAFE24API.sendXhr(method, url, obj, params, callback); xhr.onreadystatechange = function () { if (xhr.readyState === XMLHttpRequest.DONE) { if (xhr.status >= 200 && xhr.status <= 208) { callback(null, JSON.parse(xhr.responseText)); } else { callback(new Error(xhr.status), JSON.parse(xhr.responseText)); } } }; }, sendXhr: function (method, url, obj, params, callback) { if (method !== 'POST') { var url = obj.fullPath(url); } var xhr = obj.initializeXhr(); var queryVars = {}; if (obj.clientId) queryVars['cafe24_app_key'] = obj.clientId; if (obj.version) queryVars['cafe24_api_version'] = obj.version; var basicAuthKey = CAFE24API.basicAuthKeys[obj.clientId] || CAFE24API.basicAuthKeys['default']; if (basicAuthKey && basicAuthKey.length > 0) { queryVars['authorization'] = 'Basic ' + basicAuthKey; } if (params === null) { var seperator = url.indexOf('?') == -1 ? '?' : '&'; var queryString = []; for (var key in queryVars) { queryString.push(key + '=' + encodeURIComponent(queryVars[key])); } if (queryString.length > 0) { url = url + seperator + queryString.join('&'); } } xhr.open(method, url, true); if (typeof params == 'object' && params !== null) { xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8'); for (var key in queryVars) { params[key] = queryVars[key]; } params = 'formData=' + JSON.stringify(params); } xhr.send(params || null); return xhr; }, __sessionErr: function (callback) { callback(new Error(403), { 'error': { code: 403, message: 'Failed to get session. Only available when log in.' } }); }, __scopeErr: function (callback, scope) { if (typeof CAFE24.APPSCRIPT_SDK_DATA != "undefined" && jQuery.inArray(scope, CAFE24.APPSCRIPT_SDK_DATA) > -1) { return true; } callback(new Error(403), { 'error': { code: 403, message: 'You do not have the necessary authority(scope) to use the SDK.' } }); }, __chkValidSessionScope: function (callback, scope) { if (!CAPP_ASYNC_METHODS.IS_LOGIN) { CAFE24API.__sessionErr(callback); return false; } if (!CAFE24API.__scopeErr(callback, scope)) { return false; } return true; } }; </script>
<script type="text/javascript">
window.CAFE24 = window.CAFE24 || {};
CAFE24.MANIFEST_CACHE_REVISION = '2610141514';
CAFE24.getDeprecatedNamespace = function(sDeprecatedNamespace, sSupersededNamespace) {
var sNamespace = sSupersededNamespace 
? sSupersededNamespace 
: sDeprecatedNamespace.replace(/^EC_/, '');
return CAFE24[sNamespace];
}
CAFE24.FRONT_LANGUAGE_CODE = "ko_KR";
CAFE24.MOBILE = false;
CAFE24.MOBILE_DEVICE = false;
CAFE24.MOBILE_USE = false;
var EC_MOBILE = CAFE24.MOBILE;
var EC_MOBILE_DEVICE = CAFE24.MOBILE_DEVICE;
var EC_MOBILE_USE = CAFE24.MOBILE_USE;
CAFE24.SKIN_CODE = "skin3";
CAFE24.FRONT_EXTERNAL_SCRIPT_VARIABLE_DATA = {"common_member_id_crypt":""};
var EC_FRONT_EXTERNAL_SCRIPT_VARIABLE_DATA = CAFE24.getDeprecatedNamespace('EC_FRONT_EXTERNAL_SCRIPT_VARIABLE_DATA');
CAFE24.SDE_SHOP_NUM = 1;CAFE24.SHOP = {getLanguage : function() { return "ko_KR"; },getSkinLanguageCode : function() { return "ko_KR"; },getCurrency : function() { return "KRW"; },getFlagCode : function() { return "KR"; },getTimezone: function() { return "Asia/Seoul" },getDateFormat: function() { return "Y-m-d" },isMultiShop : function() { return false; },isDefaultShop : function() { return true; },isDefaultLanguageShop : function(sLanguageCode) { return SHOP.isDefaultShop() && SHOP.isLanguageShop(sLanguageCode); },isKR : function() { return true; },isUS : function() { return false; },isJP : function() { return false; },isCN : function() { return false; },isTW : function() { return false; },isES : function() { return false; },isPT : function() { return false; },isVN : function() { return false; },isPH : function() { return false; },getCountryAndLangMap : function() { return {
"KR": "ko_KR",
"US": "en_US",
"JP": "ja_JP",
"CN": "zh_CN",
"TW": "zh_TW",
"VN": "vi_VN",
"PH": "en_PH"
}},isLanguageShop : function(sLanguageCode) { return sLanguageCode === "ko_KR"; },getDefaultShopNo : function() { return 1; },getProductVer : function() { return 2; },isSDE : function() { return true; },isMode : function() {return false; },getModeName : function() {return false; },isMobileAdmin : function() {return false; },isNewProMode : function() {return true; },isExperienceMall : function() { return false; },isDcollection : function() {return false; },isYoutubeShops : function() {return false; },getYtShopsShopNo : function() {return 0; },isFrontDesignChangeRequired : function() {return false;},isG2G : function() {return false; },isGlobale : function() {return false; },getAdminID : function() {return ''},getMallID : function() {return 'eggnbugs'},getCurrencyFormat : function(sPriceTxt, bIsNumberFormat) { 
sPriceTxt = String(sPriceTxt);
var aCurrencySymbol = ["","\uc6d0",false];
if (typeof CAFE24.SHOP_PRICE !== 'undefined' && isNaN(sPriceTxt.replace(/[,]/gi, '')) === false && bIsNumberFormat === true) {
// bIsNumberFormat 사용하려면 Ui(':libUipackCurrency')->plugin('Currency') 화폐 라이브러리 추가 필요
sPriceTxt = CAFE24.SHOP_PRICE.toShopPrice(sPriceTxt.replace(/[,]/gi, ''), true, CAFE24.SDE_SHOP_NUM);
}
try {
var sPlusMinusSign = (sPriceTxt.toString()).substr(0, 1);
if (sPlusMinusSign === '-' || sPlusMinusSign === '+') {
sPriceTxt = (sPriceTxt.toString()).substr(1);
return sPlusMinusSign + aCurrencySymbol[0] + sPriceTxt + aCurrencySymbol[1];
} else {
return aCurrencySymbol[0] + sPriceTxt + aCurrencySymbol[1];
}
} catch (e) {
return aCurrencySymbol[0] + sPriceTxt + aCurrencySymbol[1];
}
}};CAFE24.CURRENCY_INFO = {getOriginReferenceCurrency : function() {return 'USD'},getCurrencyList : function(sCurrencyCode) { var aCurrencyList = {"AED":{"currency_symbol":"&#1601;&#1604;&#1587;","decimal_place":2,"round_method_type":"R"},"AMD":{"currency_symbol":"\u058f","decimal_place":2,"round_method_type":"R"},"AOA":{"currency_symbol":"Kz","decimal_place":2,"round_method_type":"R"},"AUD":{"currency_symbol":"A$","decimal_place":2,"round_method_type":"R"},"BDT":{"currency_symbol":"&#2547;","decimal_place":2,"round_method_type":"R"},"BHD":{"currency_symbol":".&#1583;.&#1576;","decimal_place":3,"round_method_type":"R"},"BRL":{"currency_symbol":"R$","decimal_place":2,"round_method_type":"R"},"CAD":{"currency_symbol":"C$","decimal_place":2,"round_method_type":"R"},"CHF":{"currency_symbol":"Fr","decimal_place":2,"round_method_type":"R"},"CNY":{"currency_symbol":"&yen;","decimal_place":2,"round_method_type":"R"},"CRC":{"currency_symbol":"\u20a1","decimal_place":2,"round_method_type":"R"},"CVE":{"currency_symbol":"$","decimal_place":2,"round_method_type":"R"},"CZK":{"currency_symbol":"K&#269;","decimal_place":2,"round_method_type":"R"},"DJF":{"currency_symbol":"Fdj","decimal_place":0,"round_method_type":"F"},"DKK":{"currency_symbol":"kr","decimal_place":2,"round_method_type":"R"},"DZD":{"currency_symbol":"\u062f.\u062c","decimal_place":2,"round_method_type":"R"},"ETB":{"currency_symbol":"Br","decimal_place":2,"round_method_type":"R"},"EUR":{"currency_symbol":"\u20ac","decimal_place":2,"round_method_type":"R"},"GBP":{"currency_symbol":"&pound;","decimal_place":2,"round_method_type":"R"},"GEL":{"currency_symbol":"\u20be","decimal_place":2,"round_method_type":"R"},"GHS":{"currency_symbol":"GH\u20b5","decimal_place":2,"round_method_type":"R"},"GMD":{"currency_symbol":"D","decimal_place":2,"round_method_type":"R"},"GNF":{"currency_symbol":"FG","decimal_place":0,"round_method_type":"F"},"HKD":{"currency_symbol":"HK$","decimal_place":2,"round_method_type":"R"},"HUF":{"currency_symbol":"Ft","decimal_place":2,"round_method_type":"R"},"IDR":{"currency_symbol":"Rp","decimal_place":0,"round_method_type":"F"},"ILS":{"currency_symbol":"&#8362;","decimal_place":2,"round_method_type":"R"},"INR":{"currency_symbol":"&#8377;","decimal_place":2,"round_method_type":"R"},"JOD":{"currency_symbol":" &#1583;&#1610;&#1606;&#1575;&#1585;","decimal_place":3,"round_method_type":"R"},"JPY":{"currency_symbol":"&yen;","decimal_place":0,"round_method_type":"F"},"KES":{"currency_symbol":"KSh","decimal_place":2,"round_method_type":"R"},"KMF":{"currency_symbol":"CF","decimal_place":0,"round_method_type":"F"},"KWD":{"currency_symbol":"&#1583;&#1610;&#1606;&#1575;&#1585;","decimal_place":3,"round_method_type":"R"},"MAD":{"currency_symbol":"\u062f.\u0645.","decimal_place":2,"round_method_type":"R"},"MDL":{"currency_symbol":"L","decimal_place":2,"round_method_type":"R"},"MOP":{"currency_symbol":"MOP$","decimal_place":2,"round_method_type":"R"},"MVR":{"currency_symbol":"Rf","decimal_place":2,"round_method_type":"R"},"MWK":{"currency_symbol":"MK","decimal_place":2,"round_method_type":"R"},"MXN":{"currency_symbol":"Mex$","decimal_place":2,"round_method_type":"R"},"MYR":{"currency_symbol":"RM","decimal_place":2,"round_method_type":"R"},"NOK":{"currency_symbol":"kr","decimal_place":2,"round_method_type":"R"},"NZD":{"currency_symbol":"NZ$","decimal_place":2,"round_method_type":"R"},"PGK":{"currency_symbol":"K","decimal_place":2,"round_method_type":"R"},"PHP":{"currency_symbol":"&#8369;","decimal_place":2,"round_method_type":"R"},"PKR":{"currency_symbol":"&#8360;","decimal_place":2,"round_method_type":"R"},"PLN":{"currency_symbol":"z\u0142","decimal_place":2,"round_method_type":"R"},"RUB":{"currency_symbol":"\u0440\u0443\u0431","decimal_place":2,"round_method_type":"R"},"RWF":{"currency_symbol":"RF","decimal_place":0,"round_method_type":"F"},"SAR":{"currency_symbol":"&#65020;","decimal_place":2,"round_method_type":"R"},"SEK":{"currency_symbol":"kr","decimal_place":2,"round_method_type":"R"},"SGD":{"currency_symbol":"S$","decimal_place":2,"round_method_type":"R"},"SLL":{"currency_symbol":"Le","decimal_place":2,"round_method_type":"R"},"STN":{"currency_symbol":"Db","decimal_place":2,"round_method_type":"R"},"THB":{"currency_symbol":"&#3647;","decimal_place":2,"round_method_type":"R"},"TND":{"currency_symbol":"\u062f.\u062a","decimal_place":3,"round_method_type":"R"},"TOP":{"currency_symbol":"T$","decimal_place":2,"round_method_type":"R"},"TRY":{"currency_symbol":"TL","decimal_place":2,"round_method_type":"R"},"TWD":{"currency_symbol":"NT$","decimal_place":0,"round_method_type":"F"},"TZS":{"currency_symbol":"TSh","decimal_place":2,"round_method_type":"R"},"UGX":{"currency_symbol":"USh","decimal_place":0,"round_method_type":"F"},"USD":{"currency_symbol":"$","decimal_place":2,"round_method_type":"R"},"VND":{"currency_symbol":"&#8363;","decimal_place":0,"round_method_type":"F"},"VUV":{"currency_symbol":"VT","decimal_place":0,"round_method_type":"F"},"WST":{"currency_symbol":"WS$","decimal_place":2,"round_method_type":"R"},"XAF":{"currency_symbol":"FCFA","decimal_place":0,"round_method_type":"F"},"XOF":{"currency_symbol":"CFA","decimal_place":0,"round_method_type":"F"},"XPF":{"currency_symbol":"\u20a3","decimal_place":0,"round_method_type":"F"},"ZAR":{"currency_symbol":"R","decimal_place":2,"round_method_type":"R"},"ZMW":{"currency_symbol":"ZK","decimal_place":2,"round_method_type":"R"}}; return aCurrencyList[sCurrencyCode] },isUseReferenceCurrency : function() {return false }};CAFE24.COMMON_UTIL = {convertSslForString : function(sString) { return sString.replace(/http:/gi, '');},convertSslForHtml : function(sHtml) { return sHtml.replace(/((?:src|href)\s*=\s*['"])http:(\/\/(?:[a-z0-9\-_\.]+)\/)/ig, '$1$2');},getProtocol : function() { return 'https'; },moveSsl : function() { if (CAFE24.COMMON_UTIL.getProtocol() === 'http') { var oLocation = jQuery(window.location); var sUrl = 'https://' + oLocation.attr('host') + oLocation.attr('pathname') + oLocation.attr('search'); window.location.replace(sUrl); } },setEcCookie : function(sKey, sValue, iExpire) {var exdate = new Date();exdate.setDate(exdate.getDate() + iExpire);var setValue = escape(sValue) + "; domain=." + CAFE24.GLOBAL_INFO.getBaseDomain() + "; path=/;expires=" + exdate.toUTCString();document.cookie = sKey + "=" + setValue;}};CAFE24.SHOP_LIB_INFO = {getBankInfo : function() { 
var oBankInfo = "";
$.ajax({
type: "GET",
url: "/exec/front/Shop/Bankinfo",
dataType: "json",
async: false,
success: function(oResponse) {
oBankInfo = oResponse;
}
});
return oBankInfo; }};            var EC_SDE_SHOP_NUM = CAFE24.SDE_SHOP_NUM;
var SHOP = CAFE24.getDeprecatedNamespace('SHOP');
var EC_COMMON_UTIL = CAFE24.getDeprecatedNamespace('EC_COMMON_UTIL');
var EC_SHOP_LIB_INFO = CAFE24.getDeprecatedNamespace('EC_SHOP_LIB_INFO');
var EC_CURRENCY_INFO = CAFE24.getDeprecatedNamespace('EC_CURRENCY_INFO');
CAFE24.ROOT_DOMAIN = "cafe24.com";
CAFE24.API_DOMAIN = "cafe24api.com";
CAFE24.GLOBAL_INFO = (function() {
var oData = {"base_domain":"eggnbugs.cafe24.com","root_domain":"cafe24.com","api_domain":"cafe24api.com","is_global":false,"is_global_standard":false,"country_code":"KR","language_code":"ko_KR","admin_language_code":"ko_KR","front_language_code":"ko_KR"};
return {
getBaseDomain: function() {
return oData['base_domain'];
},
getRootDomain: function() {
return oData['root_domain'];
},
getApiDomain: function() {
return oData['api_domain'];
},
isGlobal: function() {
return oData['is_global'];
},
isGlobalStandard: function() {
return oData['is_global_standard'];
},
getCountryCode: function() {
return oData['country_code'];
},
getLanguageCode: function() {
return oData['language_code'];
},
getAdminLanguageCode: function() {
return oData['admin_language_code'];
},
getFrontLanguageCode: function() {
return oData['front_language_code'];
}
};
})();
var EC_ROOT_DOMAIN = CAFE24.ROOT_DOMAIN;
var EC_API_DOMAIN = CAFE24.API_DOMAIN;
var EC_TRANSLATE_LOG_STATUS = CAFE24.TRANSLATE_LOG_STATUS;
var EC_GLOBAL_INFO = CAFE24.getDeprecatedNamespace('EC_GLOBAL_INFO');
CAFE24.AVAILABLE_LANGUAGE = ["ko_KR","zh_CN","en_US","zh_TW","es_ES","pt_PT","vi_VN","ja_JP","en_PH"];
CAFE24.AVAILABLE_LANGUAGE_CODES = {"ko_KR":"KOR","zh_CN":"CHN","en_US":"ENG","zh_TW":"TWN","es_ES":"ESP","pt_PT":"PRT","vi_VN":"VNM","ja_JP":"JPN","en_PH":"PHL"};
var EC_AVAILABLE_LANGUAGE = CAFE24.AVAILABLE_LANGUAGE;
var EC_AVAILABLE_LANGUAGE_CODES = CAFE24.AVAILABLE_LANGUAGE_CODES;
CAFE24.GLOBAL_PRODUCT_LANGUAGE_CODES = {  
sClearanceCategoryCode: '',
sManualLink: '//support.cafe24.com/hc/ko/articles/7739013909529',
sHsCodePopupLink: 'https://www.wcotradetools.org/en/harmonized-system',
aCustomRegex: '"PHL" : "^[0-9]{8}[A-Z]?$"',
sCountryCodeData: 'kor',
sEnglishExampleURlForGlobal: '',
aReverseAddressCountryCode: ["VNM","PHL"],
aSizeGuideCountryAlign: '["US","UK","EU","KR","JP","CN"]',
aIsSupportTran: ["ja_JP","zh_CN","zh_TW","en_US","vi_VN","en_PH","pt_PT","es_ES"]
};
var EC_GLOBAL_PRODUCT_LANGUAGE_CODES = CAFE24.getDeprecatedNamespace('EC_GLOBAL_PRODUCT_LANGUAGE_CODES');
CAFE24.GLOBAL_ORDER_LANGUAGE_CODES = {
aModifyOrderLanguage: {"KR":"ko_KR","JP":"ja_JP","CN":"zh_CN","TW":"zh_TW","VN":"vi_VN","PH":"en_PH"},
aUseIdCardKeyCountry: ["CN","TW"],
aLanguageWithCountryCode: {"zh_CN":["CN","CHN","HK","HNK"],"ja_JP":["JP","JPN"],"zh_TW":["TW","TWN"],"ko_KR":["KR","KOR"],"vi_VN":["VN","VNM"],"en_PH":["PH","PHL"]},
aCheckDisplayRequiredIcon: ["ja_JP","zh_CN","zh_TW","en_US","vi_VN","en_PH"],
aSetReceiverName: {"zh_CN":{"sCountry":"CN","bUseLastName":true},"zh_TW":{"sCountry":"TW","bUseLastName":false},"ja_JP":{"sCountry":"JP","bUseLastName":true}},
aSetDeferPaymethodLanguage: {"ja_JP":"\uc77c\ubcf8","zh_CN":"\uc911\uad6d"},
aUseDeferPaymethod: ["ja_JP","zh_CN"],
aCheckShippingCompanyAndPaymethod: ["ja_JP","zh_CN"],
aSetDeferPaymethodLanguageForShipping: {"ja_JP":"\u65e5\u672c","zh_CN":"\uc911\uad6d"},
aCheckStoreByPaymethod: ["ja_JP","zh_CN"],
aCheckIsEmailRequiredForJs: ["en_US","zh_CN","zh_TW","ja_JP","vi_VN","en_PH"],
aSetIdCardKeyCountryLanguage: {"CN":"\uc911\uad6d\uc758","TW":"\ub300\ub9cc\uc758"},
aReverseGlobalAddress: ["en_PH","vi_VN","PHL","VNM","VN","PH"],
aNoCheckZipCode: ["KOR","JPN"],
aNotPostCodeAPICountryList: ["en_US","es_ES","pt_PT","en_PH"],
aEnableSearchExchangeAddr: ["KR","JP","CN","VN","TW","PH"],
aDuplicatedBaseAddr: ["TW","JP"],
aReverseAddressCountryCode: ["VN","PH"],
aCheckZipCode: ["PHL","en_PH","PH"]
};
var EC_GLOBAL_ORDER_LANGUAGE_CODES = CAFE24.getDeprecatedNamespace('EC_GLOBAL_ORDER_LANGUAGE_CODES');
CAFE24.GLOBAL_MEMBER_LANGUAGE_CODES = {  
sAdminWebEditorLanguageCode: 'ko' ,
oNotAvailDecimalPointLanguages: ["ko_KR","ja_JP","zh_TW","vi_VN"],
oAddressCountryCode: {"KOR":"ko_KR","JPN":"ja_JP","CHN":"zh_CN","TWN":"zh_TW","VNM":"vi_VN","PHL":"en_PH"},
};
var EC_GLOBAL_MEMBER_LANGUAGE_CODES = CAFE24.getDeprecatedNamespace('EC_GLOBAL_MEMBER_LANGUAGE_CODES');
CAFE24.GLOBAL_BOARD_LANGUAGE_CODES = {  
bUseLegacyBoard: true
};
var EC_GLOBAL_BOARD_LANGUAGE_CODES = CAFE24.getDeprecatedNamespace('EC_GLOBAL_BOARD_LANGUAGE_CODES');
CAFE24.GLOBAL_MALL_LANGUAGE_CODES = {
oDesign: {
oDesignAddReplaceInfo: {"group_id":"SKIN.ADD.ADMIN.DESIGNDETAIL","replacement":{"KR":"KOREAN","US":"ENGLISH","JP":"JAPANESE","CN":"SIMPLIFIED.CHINESE","TW":"TRADITIONAL.CHINESE","ES":"SPANISH","PT":"PORTUGUESE","PH":"ENGLISH"}},
oDesignDetailLanguageCountryMap: {"KR":"ko_KR","JP":"ja_JP","CN":"zh_CN","TW":"zh_TW","US":"en_US","ES":"es_ES","PT":"pt_PT","PH":"en_PH"},
oSmartDesignSwitchTipLink: {"edibot":{"img":"\/\/img.echosting.cafe24.com\/smartAdmin\/img\/design\/img_editor_dnd.png","link":"\/\/ecsupport.cafe24.com\/board\/free\/list.html?board_act=list&board_no=12&category_no=9&cate_no=9"},"smart":{"img":"\/\/img.echosting.cafe24.com\/smartAdmin\/img\/design\/ko_KR\/img_editor_smart.png","link":"\/\/sdsupport.cafe24.com"}},
oSmartDesignDecoShopList: ["ko_KR","ja_JP","zh_CN","en_US","zh_TW","es_ES","pt_PT"],
oSmartDesignDecoMultilingual: {"list":{"ko_KR":"KOREAN","en_US":"ENGLISH","ja_JP":"JAPANESE","zh_CN":"SIMPLIFIED.CHINESE","zh_TW":"TRADITIONAL.CHINESE","es_ES":"SPANISH","pt_PT":"PORTUGUESE","vi_VN":"VIETNAMESE"},"group_id":"EDITOR.LAYER.EDITING.DECO"},
aSmartDesignModuleShopList: ["ko_KR","ja_JP","zh_CN","en_US","zh_TW","es_ES","pt_PT"]
},
oStore: {
oMultiShopCurrencyInfo: {"en_US":{"currency":"USD"},"zh_CN":{"currency":"USD","sub_currency":"CNY"},"ja_JP":{"currency":"JPY"},"zh_TW":{"currency":"TWD"},"es_ES":{"currency":"EUR"},"pt_PT":{"currency":"EUR"},"ko_KR":{"currency":"KRW"},"vi_VN":{"currency":"VND"},"en_PH":{"currency":"PHP"}},
oBrowserRedirectLanguage: {"ko":{"primary":"ko_KR","secondary":"en_US"},"en":{"detail":{"en-ph":{"primary":"en_PH","secondary":"en_US"},"en-us":{"primary":"en_US","secondary":"es_ES"},"default":{"primary":"en_US","secondary":"es_ES"}}},"ja":{"primary":"ja_JP","secondary":"en_US"},"zh":{"detail":{"zh-cn":{"primary":"zh_CN","secondary":"en_US"},"zh-tw":{"primary":"zh_TW","secondary":"zh_CN"},"default":{"primary":"en_US","secondary":"ko_KR"}}},"es":{"primary":"es_ES","secondary":"en_US"},"pt":{"primary":"pt_PT","secondary":"en_US"},"vi":{"primary":"vi_VN","secondary":"en_US"},"default":{"primary":"en_US","secondary":"ko_KR"}},
aChangeableLanguages: ["en_US","ja_JP","ko_KR"],
aNoZipCodeLanguage: ["ko_KR","ja_JP"]
},
oMobile: {
sSmartWebAppFaqUrl: "https://support.cafe24.com/hc/ko/articles/8466586607641",
sAmpFaqUrl: "https://ecsupport.cafe24.com/board/free/read.html?no=1864&board_no=5&category_no=13&cate_no=13&category_no=13&category_no=13",
},
oPromotion: {
bQrCodeAvailable: true,
bSnsMarketingAvailable: true
},
oShippingReverseAddressLanguage: ["vi_VN","en_PH"] ,
oGlobalStandardSwitchHelpCodeLink: {"SH.DS":{"link":"\/\/serviceguide.cafe24shop.com\/en_PH\/SH.DS.html"},"PR.DS":{"link":"\/\/serviceguide.cafe24shop.com\/en_PH\/PR.DS.html"},"OR.SM.BO":{"link":"\/\/serviceguide.cafe24shop.com\/en_PH\/OR.SM.BO.html"},"DE.DS":{"link":"\/\/serviceguide.cafe24shop.com\/en_PH\/DE.DS.html"},"MB.DS":{"link":"\/\/serviceguide.cafe24shop.com\/en_PH\/MB.DS.html"},"PM.DS":{"link":"\/\/serviceguide.cafe24shop.com\/en_PH\/PM.DS.html"}},
getAdminMainLocaleLanguage: function(sSkinLocaleCode) {
var oLocaleData = [];
var locale = "";
var shopLangName = "";
if (sSkinLocaleCode == "US") {
locale = "en_US";
shopLangName = "ENGLISH";
} else if (sSkinLocaleCode == "JP") {
locale = "ja_JP";
shopLangName = "JAPANESE";
} else if (sSkinLocaleCode == "CN") {
locale = "zh_CN";
shopLangName = "SIMPLIFIED.CHINESE";
} else if (sSkinLocaleCode == "TW") {
locale = "zh_TW";
shopLangName = "TRADITIONAL.CHINESE";
} else if (sSkinLocaleCode == "ES") {
locale = "es_ES";
shopLangName = "SPANISH";
} else if (sSkinLocaleCode == "PT") {
locale = "pt_PT";
shopLangName = "PORTUGUESE";
} else if (sSkinLocaleCode == "VN") {
locale = "vi_VN";
shopLangName = "VIETNAMESE";
} else if(sSkinLocaleCode == "PH") {
locale = "en_PH";
shopLangName = "ENGLISH.PH";
}
oLocaleData["locale"] = locale;
oLocaleData["shopLangName"] = shopLangName;
return oLocaleData;
}
};
var EC_GLOBAL_MALL_LANGUAGE_CODES = CAFE24.getDeprecatedNamespace('EC_GLOBAL_MALL_LANGUAGE_CODES');
CAFE24.GLOBAL_DATETIME_INFO = {
oConstants: {"STANDARD_DATE_REGEX":"\/([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))\/","IN_ZONE":"inZone","OUT_ZONE":"outZone","IN_FORMAT":"inFormat","OUT_FORMAT":"outFormat","IN_DATE_FORMAT":"inDateFormat","IN_TIME_FORMAT":"inTimeFormat","OUT_DATE_FORMAT":"outDateFormat","OUT_TIME_FORMAT":"outTimeFormat","IN_FORMAT_DATE_ONLY":1,"IN_FORMAT_TIME_ONLY":2,"IN_FORMAT_ALL":3,"OUT_FORMAT_DATE_ONLY":1,"OUT_FORMAT_TIME_ONLY":2,"OUT_FORMAT_ALL":3,"DATE_ONLY":"YYYY-MM-DD","TIME_ONLY":"HH:mm:ss","FULL_TIME":"YYYY-MM-DD HH:mm:ss","ISO_8601":"YYYY-MM-DD[T]HH:mm:ssZ","YEAR_ONLY":"YYYY","MONTH_ONLY":"MM","DAY_ONLY":"DD","WEEK_ONLY":"e","TIME_H_I_ONLY":"HH:mm","TIME_HOUR_ONLY":"HH","TIME_MINUTE_ONLY":"mm","POSTGRE_FULL_TIME":"YYYY-MM-DD HH24:MI:SS","POSTGRE_TIME_ONLY":" HH24:MI:SS","MICRO_SECOND_ONLY":"u","SEOUL":"Asia\/Seoul","TOKYO":"Asia\/Tokyo","SHANGHAI":"Asia\/Shanghai","TAIPEI":"Asia\/Taipei","HANOI":"Asia\/Bangkok","LOS_ANGELES":"America\/Los_Angeles","LISBON":"Europe\/Lisbon","MADRID":"Europe\/Madrid","SINGAPORE":"Asia\/Singapore","UTC":"Etc\/UTC","MAX_DATETIME":"9999-12-31 23:59:59"},
oOptions: {"inZone":"Asia\/Seoul","inFormat":"YYYY-MM-DD HH:mm:ss","inDateFormat":"YYYY-MM-DD","inTimeFormat":"HH:mm:ss","outZone":"Asia\/Seoul","outFormat":"YYYY-MM-DD HH:mm:ss","outDateFormat":"YYYY-MM-DD","outTimeFormat":"HH:mm:ss"},
oPolicies: {"shop":{"outZone":"Asia\/Seoul","outFormat":"YYYY-MM-DD HH:mm:ss","outDateFormat":"YYYY-MM-DD","outTimeFormat":"HH:mm:ss"}},
sOverrideTimezone: '',
sMomentNamespace: 'EC_GLOBAL_MOMENT'
};
CAFE24.FRONT_JS_CONFIG_MANAGE = {"sSmartBannerScriptUrl":"https:\/\/app4you.cafe24.com\/SmartBanner\/tunnel\/scriptTags?vs=1563164396689206","sMallId":"eggnbugs","sDefaultAppDomain":"https:\/\/app4you.cafe24.com","cdnUrl":"https:\/\/ecimg.cafe24img.com\/pg2477b62196317055\/eggnbugs"};
var EC_FRONT_JS_CONFIG_MANAGE = CAFE24.getDeprecatedNamespace('EC_FRONT_JS_CONFIG_MANAGE');
CAFE24.FRONT_JS_CONFIG_MEMBER = {"sAuthUrl":"https:\/\/ipin-ec.cafe24.com\/certify\/v1\/?action=auth"};
var EC_FRONT_JS_CONFIG_MEMBER = CAFE24.getDeprecatedNamespace('EC_FRONT_JS_CONFIG_MEMBER');
CAFE24.FRONT_JS_CONFIG_SHOP = {"bDirectBuyOrderForm":false,"product_service_type":"standard","bIsExclusivePurchaseOnly":false,"is_cultural_tax":"F","bECUseItemSalePrice":false,"DROPSHIPPING":{"sellable":"T"},"sCouponDownloadPage":"\/coupon\/coupon_productdetail.html","sIsMileageOnlyProduct":"F","sIsLoginMember":"F","aOptionColorchip":[],"oCategoryInfo":{"1":{"category_no":55,"category_name":"\uc804\uccb4\uc0c1\ud488"}},"recent_period":365,"aProductPurchaseInfo_55":{"bIsSuccess":true,"sMessage":"","bReplaceLoginPage":false,"bIsDisplayPurchaseButton":true},"search_period":[],"calendar_config":{"maxDate":"2028-10-15","locale":"ko"}};
var EC_FRONT_JS_CONFIG_SHOP = CAFE24.getDeprecatedNamespace('EC_FRONT_JS_CONFIG_SHOP');
typeof window.CAFE24 === "undefined" && (window.CAFE24 = {});
CAFE24.FRONTEND = {"IS_RENDERED_LOGIN":"F","FW_MANIFEST_CACHE_REVISION":2610141514,"IS_WEB_VIEW":"F"};
CAFE24.ROUTE = {"is_mobile":false,"is_need_route":false,"language_code":"ZZ","path":{"origin":"\/product\/\uc5d0\uadf8\ubc15\uc0ac-\uc870\ub07c-\uc544\ub3d9\uc6a9-\uc815\uae00\uc870\ub07c\/55\/category\/1\/display\/2\/","result":"\/product\/\uc5d0\uadf8\ubc15\uc0ac-\uc870\ub07c-\uc544\ub3d9\uc6a9-\uc815\uae00\uc870\ub07c\/55\/category\/1\/display\/2\/","prefix":""},"shop_no":0,"skin_code":"default","support_language_list":{"ar":"ar_EG","ar-EG":"ar_EG","de":"de_DE","de-DE":"de_DE","en":"en_US","en-IN":"en_IN","en-PH":"en_PH","en-US":"en_US","es":"es_ES","es-ES":"es_ES","hi":"hi_IN","hi-IN":"hi_IN","id":"id_ID","id-ID":"id_ID","it":"it_IT","it-IT":"it_IT","ja":"ja_JP","ja-JP":"ja_JP","ko":"ko_KR","ko-KR":"ko_KR","ms":"ms_MY","ms-MY":"ms_MY","pt":"pt_PT","pt-PT":"pt_PT","ru":"ru_RU","ru-RU":"ru_RU","th":"th_TH","th-TH":"th_TH","tr":"tr_TR","tr-TR":"tr_TR","vi":"vi_VN","vi-VN":"vi_VN","zh":"zh_CN","zh-CN":"zh_CN","zh-HK":"zh_HK","zh-MO":"zh_MO","zh-SG":"zh_SG","zh-TW":"zh_TW"}};
</script>

<link rel="stylesheet" type="text/css" href="/ind-script/optimizer.php?filename=lY0xDsIwDEX3qCvnMAOcAIkDgDiA46YQ1bWtxJHg9lSdAIkh69d7_1nRe8EFSqraCiWgWmEqKg6ky6IyrMPO_lOJQlVunlVC1GcX3tz7AoyvVHoEx8ipS1ALnCWFiCI_LTSD60MNLp8f5-1jZcZG_sVzjnDLhjR_GyfkJCMWOAzHYQ8To1umeYu9AQ&type=css&k=b758a487536d5ddd1a2a876ed3a9cbf64a64aa69&t=1791953091"  /><link rel="stylesheet" type="text/css" href="/ind-script/optimizer_user.php?filename=ldTBbsMgDAbge9vrnoNtfYJJu_Sw057AgJt4A4xio7VvP5a2xyn4FCX8n2KBsUTcRxSaipNvKkcXRFzm2BK6uvRnUBdRgdKhrzzJQDyzp4SnDBMOG4iRlLjAP79JcOWmzoNQWH3gnLkMhm8fBsMYdv0Fd42MwDfV4ZIeSMHbRUKrYU5K1ahmTFZy5hSt28YXo-ipYCT3PjOreCpntiqYqICOnpH8UMXlkMnaOn2hu60bdue59QaQmevnTLVSmUara34veh3uuL-8zphH8_3i3_LPL2bxahZHgzANDUkU8QNL2zyPwK1yeQy-93W0vn3BZRN6hiW6BSsva1W_&type=css&k=dfbe53daff9fe1bd68a9bd19aef6193de8b76bd4&t=1767770430&user=T"  />
<style type="text/css">
#prdDetailContentLazy img[src=""], #prdDetailContentLazy img:not([src]) { visibility: hidden !important; height: 1px !important; }
</style>
<title>에그박사 조끼 | 어린이 탐험 조끼 공식 굿즈</title></head>
<body class="theme01" data-ez-theme="theme01">	<div id="skipNavigation">
		<p><a href="#category">전체상품목록 바로가기</a></p>
		<p><a href="#contents">본문 바로가기</a></p>
	</div>
	<div id="wrap">
<div class="main_top_banner ez-align-left" data-ez-module="top-banner" data-ez-align="left" data-ez-role="style.color" data-ez-display="visible" data-ez="contents-0pe4w36-1">
	<div class="top_banner_box_inner">
		<div class="top_banner_text"><!-- 최상단 배너 수정하는곳 -->
			<a data-ez-role="a" href="https://dregg.shop/member/agreement.html" data-href="https://dregg.shop/member/agreement.html" target="_self" style="color: black; font-weight: bold;">회원가입 즉시 3,000원 적립 + 전체상품 5% 할인까지!</a>
		</div><!-- //top_banner_text -->

		<div class="top_banner_close" data-ez-role="close">
			<input type="checkbox" name="chkbox" id="top_banner_box_cloase" value="1" data-ez-role="disable-term"><label for="top_banner_box_cloase" data-ez-role="disable-text">오늘 하루 보지 않기</label>
			<i aria-hidden="true" class="icon icoClose">닫기</i>
		</div><!-- //top_banner_close -->
	</div><!-- //top_banner_box_inner -->
</div>
<header id="header" class="layout6" data-ez-layout="layout6" data-ez="contents-073q35c-1">
	<ez-prop data-version="1.0.0" type="layout">
		<ez-var data-prop="layout" data-namespace="ez.layout.header.layout" data-type="array">
			<ez-item data-id="layout3" data-name="1단 기본형"></ez-item>
			<ez-item data-id="layout2" data-name="2단 좌측형"></ez-item>
			<ez-item data-id="layout4" data-name="2단 혼합형"></ez-item>
			<ez-item data-id="layout1" data-name="2단 중앙형 (아이콘 하단)"></ez-item>
			<ez-item data-id="layout5" data-name="2단 중앙형 (아이콘 상단)"></ez-item>
			<ez-item data-id="layout6" data-name="2단 슬라이딩 메뉴 노출형"></ez-item>
  	    </ez-var>
	</ez-prop>
	<div class="inner">
		<div class="toparea display_pc_only">
			<div class="toparea_shoppinginfo">
				                <div data-ez-group="shopping-info" data-ez-role="list">
				<ul class="xans-element- xans-layout xans-layout-shoppinginfo "><li class="displaynone"><a href="/myshop/mileage/historyList.html"> <strong></strong></a></li>
<li class="displaynone"><a href="/myshop/deposits/historyList.html"> <strong></strong></a></li>
<li class="displaynone"><a href="/myshop/coupon/coupon.html">쿠폰 <strong></strong></a></li>
<li class=""><a href="/myshop/wish_list.html">관심상품 <strong><span id="xans_myshop_interest_prd_cnt"></span></strong></a></li>
<li class="displaynone"></li>
<li class="displaynone"><a href="/order/basket.html">장바구니 <strong><span class="displaynone">()</span></strong></a></li>
</ul>
                </div>
			</div><!-- //toparea_shoppinginfo -->

			<div class="toparea_state" data-ez-group="top-util-menu" data-ez-role="list">
				<a data-ez-item="join" href="/member/agreement.html" class="xans-element- xans-layout xans-layout-statelogoff ">회원가입
</a>
				<a data-ez-item="login" href="/member/login.html" class="xans-element- xans-layout xans-layout-statelogoff ">로그인
</a>
												<a data-ez-item="order" href="/myshop/order/list.html">주문조회</a>
								<a data-ez-item="recent" href="/product/recent_view_product.html">최근본상품</a>
				<div class="toparea_state_board">
					<a data-ez-item="board" href="#none">고객센터 <i aria-hidden="true" class="icon icoArrowBottom"></i></a>
					<ul class="xans-element- xans-layout xans-layout-boardinfo"><li class="xans-record-"><a href="/board/공지사항/1/">공지사항</a></li>
<li class="xans-record-"><a href="/board/상품-사용후기/4/">상품 사용후기</a></li>
<li class="xans-record-"><a href="/board/상품-qa/6/">상품 Q&A</a></li>
<li class="xans-record-"><a href="/board/갤러리/8/">갤러리</a></li>
</ul>
				</div>
			</div><!-- //toparea_state -->
		</div><!-- //toparea -->

		<div class="top_nav_box" id="top_nav_box">
			<div class="xans-element- xans-layout xans-layout-logotop top_logo "><a href="/"><img src="//ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/upload/category/logo/v2_673850675cc2846b8e0939e4c2c56400_osN9bI5YWQ_top.jpg" alt="에그박사"></a>
</div>
<!-- //top_logo -->
			<div class="top_nav"><a href="javascript:;" class="eNavFold"><i aria-hidden="true" class="icon icoNav"></i></a></div>

			<div data-ez-module="menu-main/1" data-ez-mode="manual">
        <div class="xans-element- xans-layout xans-layout-category top_category">
<ul><li><a href="/category/%EC%A0%84%EC%B2%B4%EC%83%81%ED%92%88/55/">전체상품</a></li><li><a href="/category/%EC%9D%98%EB%A5%98-%EC%9E%A1%ED%99%94/42/">의류•잡화</a></li><li><a href="/category/%EB%B4%89%EC%A0%9C%EC%9D%B8%ED%98%95/43/">봉제인형</a></li><li><a href="/category/%ED%82%A4%EB%A7%81/44/">키링</a></li><li><a href="/category/%EC%95%A1%EC%84%B8%EC%84%9C%EB%A6%AC/45/">악세사리</a></li><li><a href="/category/%EB%AC%B8%EA%B5%AC-%EC%86%8C%ED%92%88/46/">문구•소품</a></li><li><a href="/category/%EB%86%80%EC%9D%B4%ED%95%99%EC%8A%B5%EC%99%84%EA%B5%AC/48/">놀이•학습완구</a></li></ul>
</div>
      </div><!-- //menu-main/1 -->

			<div class="top_mypage">
				<a href="javascript:;" class="eSearch"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewbox="0 0 24 24" class="icon" role="img">
    <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 19c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"></path>
    <path stroke="#000" stroke-linejoin="round" stroke-width="1.5" d="M22 22l-5-5"></path>
</svg></a>
				<a href="/myshop/index.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewbox="0 0 24 24" class="icon" role="img">
    <circle cx="11.5" cy="6.5" r="3.75" stroke="#000" stroke-width="1.5"></circle>
    <path stroke="#000" stroke-width="1.5" d="M1.78 21.25c.382-4.758 4.364-8.5 9.22-8.5h1c4.856 0 8.838 3.742 9.22 8.5H1.78z"></path>
</svg>
</a>
				<a href="/order/basket.html" class="xans-element- xans-layout xans-layout-orderbasketcount "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewbox="0 0 24 24" class="icon" role="img">
    <path fill="#000" d="M23.073 22.253l-1.946-14.31c-.04-.38-.368-.667-.758-.667h-3.656v-1.74c0-2.543-2.115-4.613-4.713-4.613-2.599 0-4.713 2.07-4.713 4.613v1.74H3.63c-.39 0-.717.288-.758.667L.927 22.253c-.022.21.047.42.192.577.144.157.35.247.566.247h20.63c.216 0 .421-.09.566-.247.145-.157.214-.366.192-.576zM8.81 5.537c0-1.72 1.431-3.122 3.19-3.122 1.758 0 3.19 1.401 3.19 3.122v1.74H8.81v-1.74zm-6.28 16.05l1.786-12.82h2.97v1.644c0 .412.342.746.762.746.421 0 .762-.334.762-.746V8.767h6.38v1.643c0 .412.34.746.761.746.42 0 .762-.334.762-.746V8.767h2.97l1.786 12.819H2.53z"></path>
</svg>
<span class="count displaynone EC-Layout_Basket-count-display"><span class="EC-Layout-Basket-count">0</span></span>
</a>
			</div><!-- //top_mypage -->
		</div><!-- //top_nav_box -->
	</div><!-- //inner -->
</header>
<!--#ez="1/14"-->
<aside id="aside" data-ez="contents-0av9w0z-1" class="xans-element- xans-layout xans-layout-slidepackage "><div class="navigation_member">
		<div class="xans-element- xans-layout xans-layout-logotop side_logo "><a href="/"><img src="//ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/upload/category/logo/v2_673850675cc2846b8e0939e4c2c56400_osN9bI5YWQ_top.jpg" alt="에그박사"></a>
</div>

		<div class="navigation_state" data-ez-group="top-util-menu" data-ez-role="list">
			<a data-ez-item="join" href="/member/agreement.html" class="xans-element- xans-layout xans-layout-statelogoff ">회원가입
</a>
			<a data-ez-item="login" href="/member/login.html" class="xans-element- xans-layout xans-layout-statelogoff ">로그인
</a>
									<a data-ez-item="order" href="/myshop/order/list.html">주문조회</a>
						<a data-ez-item="recent" href="/product/recent_view_product.html">최근본상품</a>
		</div>
<!-- //navigation_state -->
	</div>
<!-- //navigation_member -->
<nav class="navigation-menu" role="navigation">
		<div data-ez-module="menu-side/1"><div id="slideCateList" class="navigation-menu__category">
  <ul id="slide_add_category">
<li><a href="/category/%EC%A0%84%EC%B2%B4%EC%83%81%ED%92%88/55/" class="view">전체상품</a></li>
<li><a href="/category/%EC%9D%98%EB%A5%98-%EC%9E%A1%ED%99%94/42/" class="view">의류•잡화</a></li>
<li><a href="/category/%EB%B4%89%EC%A0%9C%EC%9D%B8%ED%98%95/43/" class="view">봉제인형</a></li>
<li><a href="/category/%ED%82%A4%EB%A7%81/44/" class="view">키링</a></li>
<li><a href="/category/%EC%95%A1%EC%84%B8%EC%84%9C%EB%A6%AC/45/" class="view">악세사리</a></li>
<li><a href="/category/%EB%AC%B8%EA%B5%AC-%EC%86%8C%ED%92%88/46/" class="view">문구•소품</a></li>
<li><a href="/category/%EB%86%80%EC%9D%B4%ED%95%99%EC%8A%B5%EC%99%84%EA%B5%AC/48/" class="view">놀이•학습완구</a></li>
</ul>
  </div></div>
<!-- //menu-side/1 -->

		<div class="cboth slide_line"></div>

        <div class="xans-element- xans-layout xans-layout-boardinfo navigation-menu__board"><div class="title">고객센터<button type="button" class="icoCategory">펼침</button>
</div>
<ul class="categoryList">
                <li class="xans-record-">
<a href="/board/공지사항/1/">공지사항</a> </li>
                <li class="xans-record-">
<a href="/board/상품-사용후기/4/">상품 사용후기</a> </li>
<li class="xans-record-">
<a href="/board/상품-qa/6/">상품 Q&A</a> </li>
<li class="xans-record-">
<a href="/board/갤러리/8/">갤러리</a> </li>
            </ul>
</div>
<!-- //navigation-menu__board -->

		    </nav>
<button type="button" class="btnClose"><i aria-hidden="true" class="icon icoClose"></i>닫기</button>
</aside>
<!--#ez="1/4"-->
<div id="container" data-ez="layout-10e0a4r-1">
			<div id="contents">
				<span class="xans-element- xans-layout xans-layout-mobileaction RTMB "><a href="#none" onclick="history.go(-1);return false;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewbox="0 0 24 24" class="icon">
	<path d="M7.29976 12.5L14.9998 20.1C15.3998 20.5 15.9998 20.5 16.3998 20.1C16.7998 19.7 16.7998 19.1 16.3998 18.7L9.49976 11.7L16.3998 4.7C16.7998 4.3 16.7998 3.7 16.3998 3.3C16.1998 3.1 15.9998 3 15.6998 3C15.3998 3 15.1998 3.1 14.9998 3.3L7.29976 10.9C6.89976 11.4 6.89976 12 7.29976 12.5C7.29976 12.4 7.29976 12.4 7.29976 12.5Z" fill="#000000"></path>
</svg>

뒤로가기</a>
</span>
				
<div data-ez-module="product-head-breadcrumb/1" data-ez="contents-0rst72x-1" class="xans-element- xans-product xans-product-headcategory section path "><span>현재 위치</span>
<ol>
        <li><a href="/">홈</a></li>
        <li class=""><a href="/category/전체상품/55/">전체상품</a></li>
        <li class="displaynone"><a href=""></a></li>
        <li class="displaynone"><a href=""></a></li>
        <li class="displaynone"><strong><a href=""></a></strong></li>
    </ol>
</div>
<div class="titleArea display_tablet_only" data-ez-module="product-detail-head-title-mobile/1" data-ez="contents-043cljk-1">
    <h2>상품상세 정보</h2>
</div>
<div data-ez="contents-120heqb-1" class="xans-element- xans-product xans-product-detail section"><!--
		$coupon_download_page = /coupon/coupon_productdetail.html
    -->
<div class="detailArea ">
        <div class="xans-element- xans-product xans-product-image imgArea"><div class="RW ">
                <div class="prdImg">
                    <div class="thumbnail">
                        <a href="/product/image_zoom2.html?product_no=55&cate_no=1&display_group=2" alt="P00000CD" onclick="window.open(this.href, 'image_zoom2', 'toolbar=no,scrollbars=auto,resizable=yes,width=450,height=693,left=0,top=0', this);return false;">
                            <img src="//ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/product/big/20260112/4387c3b09983aed325be5c6e36c8de97.jpg" alt="에그박사 조끼" class="BigImage ">                        </a>
                        <span class="wish"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_wish_before.png"  class="icon_img ec-product-listwishicon" alt="관심상품 등록 전" productno="55" categoryno="1" icon_status="off" login_status="T" individual-set="F" /></span>
                        <div id="zoom_wrap"></div>
                    </div>
                </div>

                <div class="xans-element- xans-product xans-product-addimage listImg"><div class="inner">
                        <ul class="list">
                            <li class="xans-record-"><img src="//ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/product/small/20260112/55e9f15782dd38b4641adfbc06aeaebd.jpg"  class="ThumbImage" alt="" /></li>
                            <li class="xans-record-"><img src="//ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/product/extra/small/20260112/58d85eba77658ca66c7953b4ed835a24.jpg"  class="ThumbImage" alt="" /></li>
<li class="xans-record-"><img src="//ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/product/extra/small/20260112/f64f035a9b20c209626ef31db0aa8955.jpg"  class="ThumbImage" alt="" /></li>
<li class="xans-record-"><img src="//ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/product/extra/small/20260112/d3e1f7f791245f784d7e77a81266c568.jpg"  class="ThumbImage" alt="" /></li>
                        </ul>
                    </div>
</div>
            </div>
<div class="RTMB ">
                <p class="prdImg">
                    <a href="#none" id="prdDetailImg" data-param="?product_no=55&cate_no=1&display_group=2" class="thumbnail">
                        <img src="//ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/product/big/20260112/4387c3b09983aed325be5c6e36c8de97.jpg" class="bigImage" alt="에그박사 조끼">                        <span class="wish"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_wish_before.png"  class="icon_img ec-product-listwishicon" alt="관심상품 등록 전" productno="55" categoryno="1" icon_status="off" login_status="T" individual-set="F" /></span>
                    </a>
                </p>
                <div class="xans-element- xans-product xans-product-mobileimage prdImg xans-record-"><!--
                        $swipe = yes
                    -->
<ul>
                        <li data-param="?product_no=55&cate_no=1&display_group=2">
                            <p class="thumbnail">
                                <img src="//ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/product/big/20260112/4387c3b09983aed325be5c6e36c8de97.jpg" class="ThumbImage" alt="에그박사 조끼">                            </p>
                        </li>
                        <li style='display:none' data-param="?product_no=55&cate_no=1&display_group=2"><img src="//ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/product/extra/big/20260112/58d85eba77658ca66c7953b4ed835a24.jpg"  class="ThumbImage" alt="" /></li><li style='display:none' data-param="?product_no=55&cate_no=1&display_group=2"><img src="//ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/product/extra/big/20260112/f64f035a9b20c209626ef31db0aa8955.jpg"  class="ThumbImage" alt="" /></li><li style='display:none' data-param="?product_no=55&cate_no=1&display_group=2"><img src="//ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/product/extra/big/20260112/d3e1f7f791245f784d7e77a81266c568.jpg"  class="ThumbImage" alt="" /></li>                    </ul>
</div>
            </div>
</div>

        <div class="infoArea" data-ez-role="ez-discount-tag">
            <div class="headingArea">
				<div class="icon">         </div>
                <h1>에그박사 조끼 아동용 정글조끼</h1>
                <span class="delivery displaynone">(해외배송 가능상품)</span>
            </div>
            <div class="topLogo displaynone">
                <span></span>
                <a href="#none" onclick=""><img src="" alt="공급사 바로가기"></a>
            </div>
            <div class="xans-element- xans-product xans-product-detaildesign"><!--
                    출력 갯수 지정 변수, 없으면 설정된 전체가 나옵니다.
                    count = 10
                -->
<table border="1">
                    <caption> 기본 정보</caption>
                    <tbody>
                        <tr class=" xans-record-">
                            <th scope="row"><span class="" style="font-size:16px;color:#000000;">상품명</span></th>
                            <td><span class="" style="font-size:16px;color:#000000;">에그박사 조끼 아동용 정글조끼</span></td>
                        </tr>
                        <tr class=" xans-record-">
                            <th scope="row"><span class="" style="font-size:12px;color:#000000;font-weight:bold;">판매가</span></th>
                            <td><span class="" style="font-size:12px;color:#000000;font-weight:bold;"><strong id="span_product_price_text">35,900원 </strong><input id="product_price" name="product_price" value="" type="hidden"  /></span></td>
                        </tr>
<tr class=" xans-record-">
                            <th scope="row"><span class="" style="font-size:12px;color:#000000;">회원할인가</span></th>
                            <td><span><span class="" style="font-size:12px;color:#000000;"><span id="span_optimum_discount_price">34,100원 <span style="font-size:12px;color:#333333;">(최대  1,800원 할인)</span></span></span></span></td>
                        </tr>
<tr class=" xans-record-">
                            <th scope="row"><span class="" style="font-size:12px;color:#333333;">국내·해외배송</span></th>
                            <td><span class="" style="font-size:12px;color:#333333;">국내배송</span></td>
                        </tr>
<tr class=" xans-record-">
                            <th scope="row"><span class="" style="font-size:12px;color:#333333;">배송방법</span></th>
                            <td><span class="" style="font-size:12px;color:#333333;">택배</span></td>
                        </tr>
<tr class=" xans-record-">
                            <th scope="row"><span class="" style="font-size:12px;color:#333333;">배송비</span></th>
                            <td><span class="" style="font-size:12px;color:#333333;"><span class="delv_price_B"><input id="delivery_cost_prepaid" name="delivery_cost_prepaid" value="P" type="hidden"  /><strong>3,000원</strong></span></span></td>
                        </tr>
                    </tbody>
                </table>
</div>

            <!--- 렌탈서비스 -->
            <table border="1" summary class="displaynone">
                <tbody>
                <tr class="rental">
                    <th scope="row">월 렌탈 금액</th>
                    <td>
                        <p class="rental-maximum">월 <span class="rental-maximum-price"></span>원</p>
<span>(<span class="rental-maximum-term"></span>개월 기준)</span>
                        <ul class="xans-element- xans-product xans-product-rental"><li class="">
<span class="rental-term"></span>개월 / 월 <span class="rental-price"></span>원</li>
</ul>
                    </td>
                </tr>
                </tbody>
            </table>

            <div class="regularDelivery displaynone">
                <table border="1" summary="정기결제">
                    <caption>정기결제</caption>
                    <tbody>
                    <tr>
                        <th scope="row">구매방법</th>
                        <td>
                            <label class="gLabel"><span class="displaynone"></span> 정기배송<span class="badge displaynone"> <i class="icoDown">할인</i></span></label>
                            <label class="gLabel displaynone"> 1회구매</label>
                        </td>
                    </tr>
                    <tr class="shippingCycle displaynone" id="">
                        <th scope="row">배송주기</th>
                        <td>
                                                    </td>
                    </tr>
                    <tr class="shippingNum displaynone" id="">
                        <th scope="row">정기배송 횟수</th>
                        <td>
                                                    </td>
                    </tr>
                    <tr class="shippingGuide" id="">
                        <th scope="row"><span class="displaynone">안내사항</span></th>
                        <td>
                            <div class="info displaynone" id="">
                                <p class="title"><strong>정기배송 할인</strong> <span class="icoSave">save</span></p>
                                <ul class="xans-element- xans-product xans-product-regulardiscount"><li class="">차 이상 구매 시 :  <span class="icoDown">할인</span>
</li>
</ul>
                            </div>
                            <div class="info">
                                <ul class="ec-base-help typeDash txt11">
                                    <li>배송주기, 정기배송 횟수는 상품 전체에 동일하게 적용됩니다.</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

			<p class="displaynone"><img src="//img.echosting.cafe24.com/skin/base_ko_KR/product/txt_naver.gif" alt="개인결제창을 통한 결제 시 네이버 마일리지 적립 및 사용이 가능합니다."></p>

            <table border="1" class="xans-element- xans-product xans-product-option xans-record-"><!--
                $use_per_add_option = yes
                -->
<caption>상품 옵션</caption>
<tbody class="xans-element- xans-product xans-product-option xans-record-"><tr>
                        <th scope="row">사이즈</th>
                        <td><select option_product_no="55" option_select_element="ec-option-select-finder" option_sort_no="1" option_type="T" item_listing_type="C" option_title="사이즈" product_type="product_option" product_option_area="product_option_55_0" name="option1" id="product_option_id1" class="ProductOption0" option_style="select" required="true" ><option value="*" selected link_image="">- [필수] 옵션을 선택해 주세요 -</option><option value="**" disabled link_image="">-------------------</option><optgroup label="사이즈"><option value="P00000CD000B"  link_image="">S사이즈(100~110)</option><option value="P00000CD000C"  link_image="">M사이즈(120~130)</option><option value="P00000CD000D"  link_image="">L사이즈(140~150)</option></optgroup></select><p class="value"></p>
</td>
                    </tr>
</tbody>
<tbody>
                                    </tbody>
<tbody>
                    <tr class="displaynone" id="">
                        <td colspan="2" class="selectButton"><a href="#none" class="btnSubmit sizeS" onclick="">옵션선택</a></td>
                    </tr>
                                    </tbody>
</table>

            
            <div class="guideArea">
                <p class="info ">(최소주문수량 1개 이상<span class="displaynone"> / 최대주문수량 0개 이하</span>)</p>
                <span class="sizeGuide displaynone"><a href="#none" class="size_guide_info" product_no="55">사이즈 가이드 <i aria-hidden="true" class="icon icoArrowRight"></i></a></span>
            </div>

            

            
            <div id="totalProducts" class="">
                <table border="1">
                    <caption>상품 목록</caption>
                    <colgroup>
                        <col style="width:auto;">
                        <col style="width:100px;">
                        <col style="width:50px;">
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">상품명</th>
                            <th scope="col">상품수</th>
                            <th scope="col">가격</th>
                        </tr>
                    </thead>
                    <tbody class="displaynone">
                        <tr>
                            <td>에그박사 조끼 아동용 정글조끼</td>
                            <td>
                                <span class="quantity">
                                    <input id="quantity" name="quantity_name" style="" value="0" type="text"  />                                    <a href="javascript:;" class="up QuantityUp">수량증가</a>
                                    <a href="javascript:;" class="down QuantityDown">수량감소</a>
                                </span>
                            </td>
                            <td class="right">
<span class="quantity_price">35900</span> <span class="mileage displaynone">(<img src="">  <span class="mileage_price"></span>)</span>
</td>
                        </tr>
                        <tr id="totalProductsOption" class="xans-element- xans-product xans-product-option option xans-record-"><!--
                            $use_per_add_option = yes
                            $default_option = yes
                            -->
<td class="middle" colspan="3">
                                <table border="1">
                                    <caption>옵션 정보</caption>
                                    <colgroup>
                                        <col style="width:30%;">
                                        <col style="width:auto;">
                                    </colgroup>
                                    <tbody>

                                                                                                            </tbody>
                                </table>
                            </td>
</tr>
                    </tbody>
                    <!-- 옵션선택 또는 세트상품 선택시 상품이 추가되는 영역입니다. 쇼핑몰 화면에는 아래와 같은 마크업구조로 표시됩니다. 삭제시 기능이 정상동작 하지 않습니다. -->
                    <tbody>
                        <!-- tr>
                            <td>
                                <p class="product">
                                    $상품명<br />
                                    <span>$옵션</span>
                                </p>
                            </td>
                            <td>
                                <span class="quantity">
                                    <input type="text" class="quantity_opt" />
                                    &nbsp;<a href="javascript:;" class="up eProductQuantityUpClass"><img src="//img.echosting.cafe24.com/skin/base_ko_KR/product/btn_count_up.gif" alt="수량증가" ></a>
                                    <a href="javascript:;" class="down eProductQuantityDownClass"><img src="//img.echosting.cafe24.com/skin/base_ko_KR/product/btn_count_down.gif" alt="수량감소" ></a>
                                </span>
                                <a href="#none"><img src="//img.echosting.cafe24.com/design/skin/default/product/btn_price_delete.gif" alt="삭제" class="option_box_del" ></a>
                            </td>
                            <td class="right">
                                <span>$가격</span>
                                <span class="mileage">(<img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/product/ico_pay_point.gif" > &nbsp;<span class="mileage_price">$적립금</span>)</span>
                            </td>
                        </tr -->
                    </tbody>

                    <!-- // 옵션선택 또는 세트상품 선택시 상품이 추가되는 영역입니다. 쇼핑몰 화면에는 아래와 같은 마크업구조로 표시됩니다. 삭제시 기능이 정상동작 하지 않습니다. -->
                </table>
            </div>

            <div id="totalPrice" class="totalPrice">
                <p class="ec-base-help txtWarn txt11 displaynone"> 단독구매상품</p>
                <strong class="title">TOTAL <span class="qty">(QUANTITY)</span></strong><span class="total"><strong><em>0</em></strong> (0개)</span>
            </div>
            <p class="ec-base-help displaynone EC-price-warning">할인가가 적용된 최종 결제예정금액은 주문 시 확인할 수 있습니다.</p>

            <div id="" class="xans-element- xans-product xans-product-action productAction"><div id="ec-product-price-info" class="displaynone" ec-data-custom="0원" ec-data-price="35900"></div>
<div class=" action_button ">
					<span class="sub_sold displaynone">SOLD OUT</span>
                    <a href="#none" class="btnSubmit sizeL " onclick="product_submit(1, '/exec/front/order/basket/', this)"><span id="actionBuy">BUY IT NOW</span><span class="displaynone" id="actionReserve">예약주문</span><span id="" class="displaynone">REGULAR DELIVERY</span></a>
					<button type="button" class="btnNormal sizeL actionCart " onclick="product_submit(2, '/exec/front/order/basket/', this)" id="actionCart">CART</button>
					<button type="button" class="btnNormal sizeL actionWish " onclick="add_wishlist(this, true);" id="actionWish">WISH LIST</button>
                </div>
<div class="ec-base-button soldout displaynone ">
                    <button type="button" class="btnSubmit gFull sizeL displaynone">SOLD OUT</button>
                    <button type="button" class="btnNormal gFull sizeL " onclick="add_wishlist(this, true);" id="actionWishSoldout">WISH LIST</button>
                </div>
<a href="/board/inquiry/write.html" class="btnNormal gFull sizeL mrt10 displaynone">대량구매문의</a>
<!-- 네이버 체크아웃 구매 버튼  -->
<div id="NaverChk_Button"></div>
<div id="appPaymentButtonBox"></div>
<div class="eventArea displaynone "></div>
</div>
            <div id="orderFixArea" class="xans-element- xans-product xans-product-action ec-base-button gFixed "><div class="ec-base-button gColumn ">
					<a href="#none" class="btnSubmit sizeM " onclick="product_submit(1, '/exec/front/order/basket/', this)"><span id="actionBuy">BUY IT NOW</span><span class="displaynone" id="actionReserve">예약주문</span><span id="" class="displaynone">REGULAR DELIVERY</span></a>
                    <button type="button" class="btnNormal sizeM actionCart " onclick="product_submit(2, '/exec/front/order/basket/', this)">CART</button>
                </div>
<div class="ec-base-button gColumn displaynone">
                    <button type="button" class="btnSubmit sizeM displaynone">SOLD OUT</button>
                    <button type="button" class="btnNormal sizeM " onclick="add_wishlist(this, true);" id="actionWishSoldout">WISH LIST</button>
                </div>
</div>
        </div>
    </div>
<div class="eventArea displaynone ">
        <h3>EVENT</h3>
        <div class="event"></div>
    </div>
</div>
<!--#ez="1/1"-->
<div data-ez="contents-17xc7by-1" class="xans-element- xans-product xans-product-additional section"><div class="boardReport displaynone ec-base-layer typeModal ">
    
    
    <div class="header">
        <h3>게시글 신고하기</h3>
    </div>
    <div class="content">
        <h4>신고사유</h4>
        <div class="box">
            <div class="selectBox">
                <ul>
                    <li><label class="label"><input type="radio" name="report_reason" value="1" class="radio" checked>관련없는 내용</label></li>
                    <li><label class="label"><input type="radio" name="report_reason" value="2" class="radio">욕설/비방</label></li>
                    <li><label class="label"><input type="radio" name="report_reason" value="3" class="radio">개인정보유출</label></li>
                    <li><label class="label"><input type="radio" name="report_reason" value="4" class="radio">광고/홍보글</label></li>
                    <li><label class="label"><input type="radio" name="report_reason" value="5" class="radio">기타</label></li>
                </ul>
            </div>
        </div>
        <p class="summary">신고해주신 내용은 쇼핑몰 운영자의 검토 후 내부 운영 정책에 의해 처리가 진행됩니다.</p>
    </div>

    <div class="ec-base-button report-button">
        <a href="#none" class="btnSubmit ecReportAction" onclick="">신고</a>
        <a href="#none" class="btnNormal ecReportCloseLayer" onclick="">취소</a>
    </div>
    <a href="#none" class="btnClose ecReportCloseLayer" onclick="">닫기</a>
</div>
<div id="detail" class="cboth"></div>
<div class="detail_tab ">
		<ul class="cboth title_detail">
			<li class="tab_open"><a href="#detail">상세정보</a></li>
			<li><a href="#review">상품후기 <span>0</span></a></li>
			<li><a href="#qna">상품문의 <span>0</span></a></li>
			<li><a href="#guide">배송/교환/환불 안내</a></li>
		</ul>
<!-- //title_detail -->
	</div>
<!-- //detail_tab -->
<div id="tabProduct" class="tabProduct display_tablet_only ">
        <ul>
            <li class="selected"><a href="#prdDetail" target="_self">상세정보</a></li>
            <li><a href="#prdInfo">구매안내</a></li>
            <li class=""><a href="#prdReview" name="use_review_mobile">상품후기 <span>0</span></a></li>
            <li class=""><a href="#prdQnA" name="use_qna_mobile">상품문의 <span>0</span></a></li>
        </ul>
    </div>
<div id="prdDetail" class="productDetail">
        <div><div class="edibot-product-detail" style="width:1000px;max-width:100%;margin:0 auto;"><div data-api="1.0.0" data-classid="jumper" data-created="2026-01-12 12:46:31" data-groupid="null" data-projectid="N260112_1245" data-sessionid="1" data-shoplang="ko_KR" data-shopno="1" data-version="2.0.0" type="application/json" class="-edibot-metadata"><!--{"api":"1.0.0","classid":"jumper","groupid":null,"mallid":"eggnbugs","projectid":"N260112_1245","sessionid":1,"version":"2.0.0","shopno":1,"shoplang":"ko_KR","created":"2026-01-12 12:46:31"}--></div>
<style>.edibot-product-detail .edb-img-tag-w:has(img[ec-data-src]:first-child) > div:has(div[data-aos] img[ec-data-src]) {visibility: hidden;}.edibot-product-detail .edb-img-tag-w > div:has(div[data-aos] img[ec-data-src]) { position:absolute; top: 0% !important; left: 50% !important; transform:translate(0%, 0%) rotate(0deg) !important;}.edibot-product-detail .edb-img-tag-w > div div[data-aos] div:has(img[ec-data-src]) { position:absolute !important; top: 0 !important; left: 0 !important; transform: none !important;}.edibot-product-detail *{ font-family:inherit; font-size:inherit; }.edibot-product-detail img[src=""], .edibot-product-detail img:not([src]) {visibility: hidden !important; height: 1px !important;}.edibot-product-detail div#edb-img-tag,.edibot-product-detail div#edb-img-tag *{position:unset;border:0;border-radius:0;box-sizing:content-box;height:auto;line-height:normal;min-height:auto;text-align:left;transform:none;margin:0;opacity:1;padding:0;transition:opacity .15s linear,background .15s linear,border .15s linear}.edibot-product-detail div#edb-img-tag .edb-tag{position:absolute;display:block;background:rgba(0,0,0,.3);border-radius:50%;border:1px solid transparent;box-shadow:0 4px 6px rgba(0,0,0,.2);box-sizing:border-box;cursor:pointer;height:32px;text-decoration:none;transform:translate(-50%,-50%);width:32px}.edibot-product-detail .edb-img-tag-w.hover div#edb-img-tag .edb-tag{opacity:0;visibility:hidden}.edibot-product-detail div#edb-img-tag .edb-tag:before{content:'';position:absolute;top:-1px;left:-1px;right:-1px;bottom:-1px}.edibot-product-detail div#edb-img-tag .edb-tag:after{content:"";position:absolute;top:0;left:0;right:0;bottom:0;display:block;background-color:#fff;border-radius:50%;box-shadow:0 4px 6px rgba(0,0,0,.2);height:10px;margin:auto;transition:transform .15s linear;width:10px}.edibot-product-detail div#edb-img-tag .edb-tag .edb-tag-name{position:absolute;display:block;align-items:center;background:#fff;box-shadow:0 6px 10px rgba(0,0,0,.2);color:#000;font-family:-apple-system,Apple SD Gothic Neo,malgun gothic,arial,sans-serif;font-size:12px;font-style:normal;line-height:36px;margin:50% 0 0 50%;max-width:201px;opacity:0;overflow:hidden;padding:0 28px 0 11px;text-decoration:none;text-overflow:ellipsis;transform:translate(-50%,-100%) translateY(-26px);visibility:hidden;white-space:nowrap}.edibot-product-detail div#edb-img-tag .edb-tag .edb-tag-name:after{content:'';position:absolute;top:0;bottom:1px;right:10px;margin:auto 0;background:url(//img.cafe24.com/csdstatic/edibot/v2/img/ui/ec/bg_tag.png) no-repeat;background-size:5px 9px;height:9px;margin-left:10px;width:5px}.edibot-product-detail div#edb-img-tag .edb-tag.top:before{margin-top:-10px}.edibot-product-detail div#edb-img-tag .edb-tag.right:before{margin-right:-10px}.edibot-product-detail div#edb-img-tag .edb-tag.right .edb-tag-name{transform:translate(26px,-50%)}.edibot-product-detail div#edb-img-tag .edb-tag.bottom:before{margin-bottom:-10px}.edibot-product-detail div#edb-img-tag .edb-tag.bottom .edb-tag-name{transform:translate(-50%,26px)}.edibot-product-detail div#edb-img-tag .edb-tag.left:before{margin-left:-10px}.edibot-product-detail div#edb-img-tag .edb-tag.left .edb-tag-name{transform:translate(-100%,-50%) translateX(-26px)}.edibot-product-detail .edb-img-tag-w.hover:hover div#edb-img-tag .edb-tag,.edibot-product-detail div#edb-img-tag .edb-tag:hover .edb-tag-name{opacity:1;visibility:visible}.edibot-product-detail div#edb-img-tag .edb-tag:hover{border:1px solid #eee;background-color:#009cff;box-shadow:none}.edibot-product-detail div#edb-img-tag .edb-tag:hover:after{transform:scale(.6)}.edibot-product-detail div#edb-img-tag .edb-tag .edb-tag-name:hover{text-decoration:underline}html:lang(ja) .edibot-product-detail div#edb-img-tag .edb-tag .edb-tag-name{font-family:-apple-system,verdana,Meiryo,"メイリオ",sans-serif}html:lang(en) .edibot-product-detail div#edb-img-tag .edb-tag .edb-tag-name,html:lang(vi) .edibot-product-detail div#edb-img-tag .edb-tag .edb-tag-name{font-family:-apple-system,Helvetica Neue,Helvetica,Arial,Sans-serif}@media only screen and (hover:none) and (pointer:coarse){.edibot-product-detail .edb-img-tag-w.hover div#edb-img-tag .edb-tag{opacity:1;visibility:visible}}</style>
<div style="position:relative;" class="edb-img-tag-w"><img alt="점퍼 상품상세 이미지-S1L3" ec-data-src="https://ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/upload/NNEditor/20260112/12319057b17be1bcea6f60283c736dfc.jpg" style="margin:0 auto; display: block; max-width:100%;"><img alt="점퍼 상품상세 이미지-S1L3" ec-data-src="https://ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/upload/NNEditor/20260112/49ae246709cd91a747b34b0e0e48a46e.jpg" style="margin:0 auto; display: block; max-width:100%;"><img alt="점퍼 상품상세 이미지-S1L3" ec-data-src="https://ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/upload/NNEditor/20260112/804a0c086122b58975d0d2511d95eaa6.jpg" style="margin:0 auto; display: block; max-width:100%;"><img alt="점퍼 상품상세 이미지-S1L3" ec-data-src="https://ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/upload/NNEditor/20260112/e338680c8aa69fba4cf5c7390b9d010d.jpg" style="margin:0 auto; display: block; max-width:100%;"></div><div style="display: block;content: ' ';height:100px!important;"></div>
</div></div>

		<!-- //product_relation -->
	</div>
<!-- //prdDetail -->
<div id="prdReview" class="">
		<div id="review" class="pdt150 cboth"></div>
		<div class="detail_tab">
			<ul class="cboth title_detail">
				<li><a href="#detail">상세정보</a></li>
				<li class="tab_open"><a href="#review">상품후기 <span>0</span></a></li>
				<li><a href="#qna">상품문의 <span>0</span></a></li>
				<li><a href="#guide">배송/교환/환불 안내</a></li>
			</ul>
<!-- //title_detail -->
		</div>
<!-- //detail_tab -->

		<div class="">
			<div class="board_title">
				<h2>REVIEW</h2>
				<div class="ec-base-button">
					<a href="/board/product/list.html?board_no=4&link_product_no=55" class="btnNormalFix">LIST</a>
					<a href="/board/product/write.html?board_no=4&product_no=55&cate_no=1&display_group=2" class="btnNormalFix">WRITE</a>
				</div>
			</div>
			<div class="contents">
				<p class="nodata">게시물이 없습니다</p>							</div>
		</div>
<!-- //상품리뷰 -->
	</div>
<!-- //prdReview -->
<div id="prdQnA" class="">
		<div id="qna" class="pdt150 cboth"></div>
		<div class="detail_tab">
			<ul class="cboth title_detail">
				<li><a href="#detail">상세정보</a></li>
				<li><a href="#review">상품후기 <span>0</span></a></li>
				<li class="tab_open"><a href="#qna">상품문의 <span>0</span></a></li>
				<li><a href="#guide">배송/교환/환불 안내</a></li>
			</ul>
<!-- //title_detail -->
		</div>
<!-- //detail_tab -->

		<div class="">
			<div class="board_title">
				<h2>Q&amp;A</h2>
				<div class="ec-base-button">
					<a href="/board/product/list.html?board_no=6" class="btnNormalFix">LIST</a>
					<a href="/board/product/write.html?board_no=6&product_no=55&cate_no=1&display_group=2" class="btnNormalFix">WRITE</a>
				</div>
			</div>
			<div class="contents">
				<p class="nodata">게시물이 없습니다</p>							</div>
		</div>
<!-- //상품문의 -->
	</div>
<!-- //prdQnA -->
<div id="prdInfo" class="">
		<div id="guide" class="pdt150 cboth"></div>
		<div class="detail_tab">
			<ul class="cboth title_detail">
				<li><a href="#detail">상세정보</a></li>
				<li><a href="#review">상품후기 <span>0</span></a></li>
				<li><a href="#qna">상품문의 <span>0</span></a></li>
				<li class="tab_open"><a href="#guide">배송/교환/환불 안내</a></li>
			</ul>
<!-- //title_detail -->
		</div>
<!-- //detail_tab -->

		<div class="detail_guide">
			<div class="ec-base-fold theme1 selected eToggle">
				<div class="title">
					<h2>PAYMENT INFO</h2>
				</div>
				<div class="contents">
					<div class="info">
						고액결제의 경우 안전을 위해 카드사에서 확인전화를 드릴 수도 있습니다. 확인과정에서 도난 카드의 사용이나 타인 명의의 주문등
      정상적인 주문이 아니라고 판단될 경우 임의로 주문을 보류 또는 취소할 수 있습니다. &nbsp; <br>
      <br>
     <br>
					</div>
				</div>
			</div>

			<div class="ec-base-fold theme1 selected eToggle">
				<div class="title">
					<h2>DELIVERY INFO</h2>
				</div>
				<div class="contents">
					<ul class="info delivery">
						<li>배송 방법 : 택배</li>
						<li>배송 지역 : 전국지역</li>
						<li>배송 비용 : 3,000원</li>
						<li>배송 기간 : 1일 ~ 5일</li>
						<li>배송 안내 : <p data-path-to-node="6"><b data-index-in-node="0" data-path-to-node="6">배송안내</b></p><p data-path-to-node="7,0,0">배송 방법 : 택배</p><p data-path-to-node="7,1,0">배송 지역 : 전국지역</p><p data-path-to-node="7,2,0">배송 비용 : 고정배송비 : 주문 금액에 상관없이 배송비는 3,000원입니다.</p><p data-path-to-node="7,3,0">배송 기간 : 1일 ~ 5일</p><p data-path-to-node="7,4,0">배송 안내 : 산간벽지나 도서지방은 별도의 추가금액을 지불하셔야 하는 경우가 있습니다.</p><p data-path-to-node="7,5,0">고객님께서 주문하신 상품은 입금 확인후 배송해 드립니다. 다만, 상품종류에 따라서 상품의 배송이 다소 지연될 수 있습니다.</p><br><br></li>
					</ul>
				</div>
			</div>

			<div class="ec-base-fold theme1 selected eToggle">
				<div class="title">
					<h2>EXCHANGE INFO</h2>
				</div>
				<div class="contents">
					<div class="info">
						<p data-path-to-node="8"><b data-index-in-node="0" data-path-to-node="8">교환/반품안내</b>
<b data-index-in-node="8" data-path-to-node="8">교환 및 반품 주소</b></p><p data-path-to-node="9,0,0">&nbsp; &nbsp; &nbsp; &nbsp; 46219 부산광역시 금정구 중앙대로 2065 (남산동) 청룡빌딩 3층</p><p data-path-to-node="10"><b data-index-in-node="0" data-path-to-node="10">교환 및 반품이 가능한 경우</b></p><p data-path-to-node="11,0,0">&nbsp; &nbsp; &nbsp; &nbsp; 상품을 수령하신 날로부터 <b data-index-in-node="14" data-path-to-node="11,0,0">30일 이내</b>에 교환 및 반품이 가능합니다. (결함이 있는 제품 및 결함이 없는 단순 변심 모두 포함)</p><p data-path-to-node="11,1,0">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;단, 반품 및 교환 시 상품은 사용되지 않은 <b data-index-in-node="25" data-path-to-node="11,1,0">'새 제품'</b> 상태를 유지해야 합니다.</p><p data-path-to-node="11,2,0"><b data-index-in-node="0" data-path-to-node="11,2,0">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;반품 배송비 안내:</b> 고객님의 단순 변심으로 인한 교환 및 반품을 포함하여 모든 반품 비용은 <b data-index-in-node="51" data-path-to-node="11,2,0">무료</b>이며, 별도의 재입고 수수료는 청구되지 않습니다. 반품에 필요한 배송 라벨은 발송되는 패키지에 함께 동봉되어 있습니다.</p><p data-path-to-node="12"><b data-index-in-node="0" data-path-to-node="12">교환 및 반품이 불가능한 경우</b></p><p data-path-to-node="13,0,0">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;이용자에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우 (다만, 재화 등의 내용을 확인하기 위하여 포장 등을 훼손한 경우는 제외)</p><p data-path-to-node="13,1,0">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;새 제품 상태가 아니며, 이용자의 사용 또는 일부 소비에 의하여 재화 등의 가치가 현저히 감소한 경우</p><p data-path-to-node="13,2,0">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;시간의 경과에 의하여 재판매가 곤란할 정도로 재화등의 가치가 현저히 감소한 경우</p><p data-path-to-node="13,3,0">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;복제가 가능한 재화등의 포장을 훼손한 경우</p><p data-path-to-node="13,4,0">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;개별 주문 생산되는 재화 등 청약철회시 판매자에게 회복할 수 없는 피해가 예상되어 소비자의 사전 동의를 얻은 경우</p>
<br>
					</div>
				</div>
			</div>

			<div class="ec-base-fold theme1 selected eToggle">
				<div class="title">
					<h2>SERVICE INFO</h2>
				</div>
				<div class="contents">
					<div class="info">
											</div>
				</div>
			</div>
		</div>
<!-- //detail_guide -->
	</div>
<!-- //prdInfo -->
</div>

<!--#ez="1/6"-->
			</div>
		</div>
<div class="bottom-nav RMB RTB" ez-module="bottom-navigation" data-ez="contents-0fm3pk3-1">
    <ul class="bottom-nav__tabBar">
        <li>
            <button type="button" class="btnNav eNavFold">
                <i aria-hidden="true" class="icon icoNav"></i>네비게이션
            </button>
        </li>

        <li>
            <button type="button" class="btnSearch eSearch">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewbox="0 0 24 24" class="icon" role="img">
    <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 19c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"></path>
    <path stroke="#000" stroke-linejoin="round" stroke-width="1.5" d="M22 22l-5-5"></path>
</svg>검색
            </button>
        </li>

        <li>
            <a href="/">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewbox="0 0 24 24" class="icon" role="img">
    <path stroke="#000" stroke-width="1.5" d="M12 3L2 11.36V22h7.692v-7.6h4.616V22H22V11.36L12 3z"></path>
</svg>홈
            </a>
        </li>

        
        <li class="xans-element- xans-layout xans-layout-statelogoff "><a href="/order/basket.html">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewbox="0 0 24 24" class="icon" role="img">
    <path fill="#000" d="M23.073 22.253l-1.946-14.31c-.04-.38-.368-.667-.758-.667h-3.656v-1.74c0-2.543-2.115-4.613-4.713-4.613-2.599 0-4.713 2.07-4.713 4.613v1.74H3.63c-.39 0-.717.288-.758.667L.927 22.253c-.022.21.047.42.192.577.144.157.35.247.566.247h20.63c.216 0 .421-.09.566-.247.145-.157.214-.366.192-.576zM8.81 5.537c0-1.72 1.431-3.122 3.19-3.122 1.758 0 3.19 1.401 3.19 3.122v1.74H8.81v-1.74zm-6.28 16.05l1.786-12.82h2.97v1.644c0 .412.342.746.762.746.421 0 .762-.334.762-.746V8.767h6.38v1.643c0 .412.34.746.761.746.42 0 .762-.334.762-.746V8.767h2.97l1.786 12.819H2.53z"></path>
</svg>
                Cart
                <span class="count displaynone EC-Layout_Basket-count-display">
                    <span class="EC-Layout-Basket-count"></span>
                </span>
            </a>
</li>

        <li>
            <a href="/myshop/index.html">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewbox="0 0 24 24" class="icon" role="img">
    <circle cx="11.5" cy="6.5" r="3.75" stroke="#000" stroke-width="1.5"></circle>
    <path stroke="#000" stroke-width="1.5" d="M1.78 21.25c.382-4.758 4.364-8.5 9.22-8.5h1c4.856 0 8.838 3.742 9.22 8.5H1.78z"></path>
</svg>
마이쇼핑
            </a>
        </li>
    </ul>

    <div class="bottom-nav__top">
        <a href="#wrap" title="화면 최상단으로 이동하기">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="20" fill="#1a1a1a" viewbox="0 0 14 20" class="icon" role="img">
<path d="M3,8.4C2.3,9,1.2,9,0.5,8.3c-0.6-0.7-0.6-1.7,0-2.4l5.3-5.2C6.5,0,7.6,0,8.3,0.7l5.2,5.1c0.7,0.7,0.7,1.8,0,2.5
	c-0.7,0.7-1.8,0.7-2.4,0L8.8,6.1l0,12.1c0,2.3-3.6,2.3-3.6,0l0-12L3,8.4z"></path>
</svg>
        </a>
    </div>
</div>


<div class="footer_margin" data-ez="module-1398wv3-1" data-ez-module="user-defined/1" data-ez-name="USER DEFINED" data-ez-type="plain">
</div>


<footer id="footer" class="layout1" data-ez-layout="layout1" data-ez="contents-044ibxi-1">

    <ez-prop data-version="1.0.0" type="layout">
        <ez-var data-prop="layout" data-namespace="ez.layout.footer.layout" data-type="array">

            <ez-item data-id="layout1" data-name="기본형"></ez-item>
            <ez-item data-id="layout2" data-name="좌우반전형"></ez-item>
            <ez-item data-id="layout3" data-name="중앙형"></ez-item>

        </ez-var>
    </ez-prop>


    <div class="xans-element- xans-layout xans-layout-footer inner "><!-- 하단 로고 -->
<div class="xans-element- xans-layout xans-layout-logobottom bt_logo "><a href="/"><img src="//ecimg.cafe24img.com/pg2477b62196317055/eggnbugs/web/upload/category/logo/v2_673850675cc2846b8e0939e4c2c56400_wbHYneZx5F_bottom.jpg" alt="에그박사"></a>
</div>
<!-- 하단 바로가기 -->
<div class="bt_util" data-ez-group="shortcut">

            <div data-ez-role="title" style="display:none;">
                바로가기
            </div>

            <ul data-ez-role="list">

                <li data-ez-item="company">
                    <a href="/shopinfo/company.html">회사소개</a>
                </li>

                <li data-ez-item="agreement">
                    <a href="/member/mall_agreement.html">이용약관</a>
                </li>

                <li data-ez-item="privacy">
                    <a href="/member/privacy.html">
                        <strong>개인정보처리방침</strong>
                    </a>
                </li>

                <li data-ez-item="guide">
                    <a href="/shopinfo/guide.html">이용안내</a>
                </li>

            </ul>

        </div>
<!-- 기본정보 / 고객센터 -->
<div class="bt_wrap">


            <!-- 쇼핑몰 기본정보 -->
            <div class="bt_info" data-ez-group="info">

                <div class="title" data-ez-role="title">
                    쇼핑몰 기본정보
                </div>

                <div class="bt_info_list" data-ez-role="list">

                    <div data-ez-item="company_name">
                        <span data-ez-role="field">상호명</span>
                        <span data-ez-role="value">디에그 주식회사</span>
                    </div>

                    <div data-ez-item="president_name">
                        <span data-ez-role="field">대표자명</span>
                        <span data-ez-role="value">김경민</span>
                    </div>

                    <div data-ez-item="address">
                        <span data-ez-role="field">사업장 주소</span>
                        <span data-ez-role="value">
                            46219 부산광역시 금정구 중앙대로 2065 (남산동) 청룡빌딩 3층                        </span>
                    </div>

                    <div data-ez-item="phone">
                        <span data-ez-role="field">대표 전화</span>
                        <span data-ez-role="value">070-4707-0615</span>
                    </div>

                    <div data-ez-item="company_regno">
                        <span data-ez-role="field">사업자 등록번호</span>
                        <span data-ez-role="value">580-81-01940</span>
                    </div>

                    <div data-ez-item="network_regno">
                        <span data-ez-role="field">통신판매업 신고번호</span>
                        <span data-ez-role="value">
                            제2025-부산금정-0319호 <a href="#none" onclick="window.open('http://www.ftc.go.kr/bizCommPop.do?wrkr_no=5808101940', 'bizCommPop', 'width=750, height=950;');return false;">[사업자정보확인]</a>                        </span>
                    </div>

                    <div data-ez-item="cpo_name">
                        <span data-ez-role="field">개인정보보호책임자</span>
                        <span data-ez-role="value">디에그 주식회사</span>
                    </div>

                </div>

            </div>


            <!-- 고객센터 -->
            <div data-ez-group="cs" class="xans-element- xans-layout xans-layout-info bt_cscenter "><div class="title" data-ez-role="title">
                    고객센터 정보
                </div>
<div data-ez-role="list">

                    <div data-ez-item="phone" class="bt_txt01">
                        <strong>상담/주문 전화</strong>
                        <span class="pdr10"></span>
                        <span data-ez-role="value">070-4707-0615</span>
                    </div>

                    <div data-ez-item="email" class="bt_txt02">
                        <strong>상담/주문 이메일</strong>
                        <span data-ez-role="value">eggnbugs@naver.com</span>
                    </div>

                    <div data-ez-item="runtime" class="bt_txt02">
                        <strong>CS운영시간</strong>
                        <span data-ez-role="value">am 10:00 - pm 17:00</span>
                    </div>

                </div>
</div>

        </div>
<!-- 구매안전서비스 -->
<div class="bt_escrow" data-ez-escrow style="display:none;">

            <a href="#" data-ez-link="#link">

                <img src="/SkinImg/img/bt_ew_allat.png" class="bt_ew_allat" alt="올앳" data-ez-escrow-id="allat">

                 <img src="/SkinImg/img/bt_ew_iniapy.png" class="bt_ew_iniapy" alt="이니시스" data-ez-escrow-id="inicis">

                 <img src="/SkinImg/img/bt_ew_kcp.png" class="bt_ew_kcp" alt="NHN한국사이버결제" data-ez-escrow-id="kcp">

                 <img src="/SkinImg/img/bt_ew_kicc.png" class="bt_ew_kicc" alt="한국정보통신" data-ez-escrow-id="kicc">

                 <img src="/SkinImg/img/bt_ew_ksnet.png" class="bt_ew_ksnet" alt="케이에스넷" data-ez-escrow-id="ksnet">

                 <img src="/SkinImg/img/bt_ew_nice.png" class="bt_ew_nice" alt="나이스페이먼츠" data-ez-escrow-id="nicepay">

                 <img src="/SkinImg/img/bt_ew_payments.png" class="bt_ew_payments" alt="토스페이먼츠" data-ez-escrow-id="dacom">

                 <img src="/SkinImg/img/bt_ew_settle.png" class="bt_ew_settle" alt="세틀뱅크" data-ez-escrow-id="settlebank">

                 <img src="/SkinImg/img/bt_ew_smartro.png" class="bt_ew_smartro" alt="스마트로" data-ez-escrow-id="smartro">

                 <span>
                    고객님은 안전거래를 위해 결제시 저희 쇼핑몰에서 가입한
                    구매안전 서비스를 이용하실 수 있습니다.
                    [서비스가입정보확인]
                </span>

            </a>

        </div>
<!-- Copyright / SNS -->
<div class="bt_wrap2">

    <div class="bt_copyright">
        Copyright © 에그박사. All Rights Reserved. Hosting by Cafe24 Corp.
    </div>
<!-- //bt_copyright -->

    <div class="bt_sns">
        <div class="bt_sns_box">

            <a href="https://www.instagram.com/dr_egg_official/" target="_blank" rel="noopener noreferrer" class="sns_instagram" aria-label="에그박사 공식 인스타그램">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewbox="0 0 20 20" class="icon" role="img">
<path d="M14.22,0H5.75C2.575,0.011,0.005,2.585,0,5.76l0,0v8.44c-0.006,3.183,2.567,5.769,5.75,5.78h8.45
	c3.187,0.006,5.774-2.573,5.78-5.76c0-0.003,0-0.007,0-0.01l0,0V5.76c-0.006-3.188-2.592-5.77-5.78-5.77 M18.15,14.37
	c0.006,2.11-1.7,3.824-3.81,3.83c-0.007,0-0.013,0-0.02,0H5.67c-2.115,0-3.83-1.715-3.83-3.83l0,0V5.76
	c-0.006-2.11,1.7-3.824,3.81-3.83c0.003,0,0.007,0,0.01,0h8.66c2.111,0,3.824,1.709,3.83,3.82l0,0V14.37z"></path>
<path d="M9.99,4.84c-2.866,0-5.19,2.324-5.19,5.19s2.324,5.19,5.19,5.19c2.862,0,5.184-2.318,5.19-5.18
	c0.006-2.866-2.314-5.194-5.18-5.2C9.997,4.84,9.993,4.84,9.99,4.84L9.99,4.84 M9.99,13.39c-1.856-0.011-3.351-1.524-3.34-3.38
	c0.011-1.856,1.524-3.351,3.38-3.34c1.852,0.011,3.345,1.518,3.34,3.37C13.354,11.895,11.845,13.39,9.99,13.39L9.99,13.39"></path>
<path d="M15.36,3.45c-0.668,0-1.21,0.542-1.21,1.21s0.542,1.21,1.21,1.21c0.668,0,1.21-0.542,1.21-1.21
	c0-0.003,0-0.007,0-0.01c0.006-0.657-0.523-1.195-1.18-1.2C15.38,3.45,15.37,3.45,15.36,3.45L15.36,3.45"></path>
</svg>

            </a>

            <a href="https://www.youtube.com/@eggbugs" target="_blank" rel="noopener noreferrer" class="sns_youtube" aria-label="에그박사 공식 유튜브">
                <svg xmlns="http://www.w3.org/2000/svg" width="28.94" height="20.52" fill="none" viewbox="0 0 28.94 20.52" class="icon" role="img">
	<g>
		<path class="cls-1" d="M28.5,3.74C28,1.52,26.91.68,25,.37,23.92.21,18.65,0,14.47,0S5,.21,3.93.37C2,.68,1,1.53.44,3.74A54.4,54.4,0,0,0,0,10.09v.34a54.76,54.76,0,0,0,.44,6.36C1,19,2,19.85,3.93,20.15c1.1.16,6.37.37,10.55.37h0c4.19,0,9.45-.21,10.55-.37,1.9-.3,2.94-1.16,3.49-3.36a54.76,54.76,0,0,0,.44-6.36v-.34A54.4,54.4,0,0,0,28.5,3.74ZM11,14V6.55l6.94,3.62Z"></path>
	</g>
</svg>

            </a>

        </div>
    </div>
<!-- //bt_sns -->

</div>
<!-- //bt_wrap2 -->
<style>

/* ========================================
   FOOTER COPYRIGHT + SNS
======================================== */

#footer .bt_wrap2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 35px;
    padding-top: 25px;
    border-top: 1px solid #e8e8e8;
    box-sizing: border-box;
}


/* Copyright */
#footer .bt_copyright {
    margin: 0;
    padding: 0;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.6;
    color: #999;
}


/* SNS */
#footer .bt_sns {
    margin: 0;
    padding: 0;
}


/* 아이콘 가로 정렬 */
#footer .bt_sns_box {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
}


/* SNS 버튼 */
#footer .bt_sns_box a {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 36px;
    height: 36px;

    padding: 0;
    margin: 0;

    color: #222;
    background: transparent;

    text-decoration: none;
    box-sizing: border-box;

    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}


/* SVG 크기 */
#footer .bt_sns_box a svg {
    display: block;

    width: 22px !important;
    height: 22px !important;

    max-width: 22px;
    max-height: 22px;

    fill: currentColor;
}


/* SVG 내부 색상 */
#footer .bt_sns_box a svg path,
#footer .bt_sns_box a svg circle,
#footer .bt_sns_box a svg rect {
    fill: currentColor;
}


/* 마우스 오버 */
#footer .bt_sns_box a:hover {
    opacity: 0.55;
    transform: translateY(-2px);
}


/* ========================================
   MOBILE
======================================== */

@media screen and (max-width: 767px) {

    #footer .bt_wrap2 {
        display: flex;
        flex-direction: column-reverse;
        align-items: flex-start;

        margin-top: 30px;
        padding-top: 22px;
    }

    #footer .bt_sns {
        width: 100%;
        margin-bottom: 20px;
    }

    #footer .bt_sns_box {
        justify-content: flex-start;
        gap: 12px;
    }

    #footer .bt_sns_box a {
        width: 34px;
        height: 34px;
    }

    #footer .bt_sns_box a svg {
        width: 21px !important;
        height: 21px !important;
    }

    #footer .bt_copyright {
        font-size: 11px;
        line-height: 1.7;
    }

}

</style>
<!-- 검색 레이어 -->
<form id="searchBarForm" name="" action="/product/search.html" method="get" target="_self" enctype="multipart/form-data" >
<input id="banner_action" name="banner_action" value="" type="hidden"  /><div data-ez="contents-0q0bwoy-1" class="xans-element- xans-layout xans-layout-searchheader "><!--
        $product_page=/product/detail.html
        $category_page=/product/list.html
    -->
<div class="title">
        SEARCH
    </div>
<fieldset>

        <legend>검색</legend>

        <input id="keyword" name="keyword" fw-filter="" fw-label="검색어" fw-msg="" class="inputTypeText" placeholder="" onmousedown="SEARCH_BANNER.clickSearchForm(this)" value="" type="text"  />
        <button type="button" class="btnDelete">
            삭제
        </button>

        <button type="button" class="btnSearch" onclick="SEARCH_BANNER.submitSearchBanner(this); return false;">

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewbox="0 0 24 24" class="icon" role="img">
    <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 19c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"></path>
    <path stroke="#000" stroke-linejoin="round" stroke-width="1.5" d="M22 22l-5-5"></path>
</svg>
            검색

        </button>

        <ul class="autoDrop" id=""></ul>

    </fieldset>
<button type="button" class="btnClose">
        <i aria-hidden="true" class="icon icoClose"></i>
        닫기
    </button>
</div>
</form><!--#ez="1/10"-->
<!--#ez="1/27"-->
</div>
<!-- //wrap -->

	<div id="progressPaybar" style="display:none;">
		<div id="progressPaybarBackground" class="layerProgress"></div>
		<div id="progressPaybarView">
			<div class="box">
				<h3>현재 결제가 진행중입니다.</h3>
				<p class="txt">
					본 결제 창은 결제완료 후 자동으로 닫히며,결제 진행 중에 본 결제 창을 닫으시면<br>
					주문이 되지 않으니 결제 완료 될 때 까지 닫지 마시기 바랍니다.
				</p>
				<div class="progressbar"><img src="//img.echosting.cafe24.com/skin/skin/common/img_loading.gif" alt="loading" loading="lazy"></div>
			</div>
		</div>
	</div>

	
	<div class="layer_shadow" id="layer_shadow"></div>
	<div id="layoutDimmed" class="dimmed"></div>

	
	
	
	
	
	
</footer></div><div id="multi_option" style="display:none;"></div>
<form id="frm_image_zoom" style="display:none;"></form>
<form id="frm_image_zoom" style="display:none;"></form>
<span itemscope="" itemtype="https://schema.org/Organization">
<link itemprop="url" href="https://dregg.shop">
<a itemprop="sameAs" href="https://www.instagram.com/dr_egg_official"></a>
<a itemprop="sameAs" href="https://www.youtube.com/@eggbugs"></a>
</span>
<script type="text/javascript" src="/app/Eclog/js/cid.generate.js?vs=7e81efda814711904acd3dfccfd1c824&u=eggnbugs.1"></script>
<script type="text/javascript" src="/app/Manage/js/inflowbeacon.js?vs=7e81efda814711904acd3dfccfd1c824&u=eggnbugs.1"></script>
<script>        (function (i, s, o, g) {
            var a = s.createElement(o), m = s.getElementsByTagName(o)[0];
            var initialized = false;
            var interval = null;

            function safeInit() {
              if (initialized) return;
              if (typeof i.initCaWebAnalytics === 'function') {
                try {
                  i.initCaWebAnalytics({"mid":"eggnbugs","stype":"e","domain":"","shop_no":1,"lang":"ko_KR","mobile_flag":"F","send_endpoint":"https://ca-log.cafe24data.com","path_role":"PRODUCT_DETAIL","category_no":55,"category_name":"전체상품"});
                  initialized = true;
                } finally {
                  if (interval) clearInterval(interval);
                  a.onload = a.onreadystatechange = a.onerror = null;
                }
              }
            }

            a.onload = a.onreadystatechange = function () {
              if (!a.readyState || a.readyState === 'loaded' || a.readyState === 'complete') {
                safeInit();
              }
            };

            a.onerror = function () {
              if (interval) { clearInterval(interval); interval = null; }
              a.onload = a.onreadystatechange = a.onerror = null;
            };

            interval = setInterval(safeInit, 200);
            setTimeout(function () {
              if (interval) { clearInterval(interval); interval = null; }
            }, 10000);

            safeInit();

            a.async = 1;
            a.setAttribute('crossorigin', 'anonymous');
            a.src = g;
            m.parentNode.insertBefore(a, m);
        })(window, document, 'script', "//optimizer.poxo.com/ca2/analytics.js?v=20261015");</script>

                <script>
                try {
                    // Account ID 적용
                    if (!wcs_add) var wcs_add = {};
                    wcs_add["wa"] = "s_2bd10ed50f24";
            
                    // 네이버 페이 White list가 있을 경우
                    wcs.checkoutWhitelist = ["eggnbugs.cafe24.com", "www.eggnbugs.cafe24.com", "m.eggnbugs.cafe24.com", "dregg.shop", "www.dregg.shop", "m.dregg.shop"];
                
                    // 레퍼러 
                    wcs.setReferer("https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHhtCICmtnYk679qE1JR7vL-2x09o4x3SmGHMKbo-dG8twiGCCLZpLt9P5MsAP0VB8lCoJs0xIUcH8wyDiWYPjv9QWdlvGAQIZhY6SQzi0oJbI_27kQkoHTWa0GAmsBFkukpa0dlYyo2imnfjbp99YdO3Tzl3vdONMg2nonTtCzou6MH1yexRETYzbP-8UrNgY-BAB6GhVScngETh6G-cQ0Zuqe8Fa_VVSoS5OuFgEaq5ez5iuLpZPXwqST-zn23gsuPLv4texQ7L6m5Bq1ZtHWkI02_GqHPUUD6vF6zNEdO0-dpfItzCrjzbA7CR8Fx4WDUnOO4nDm9DN2d0zN0JR4_oXLfXWPsKs=");

                    // 유입 추적 함수 호출
                    wcs.inflow("dregg.shop");

                    // 로그수집
                    wcs_do();
                } catch (e) {};
                </script>
            

<!-- External Script Start -->

<!-- yte -->
<!-- Event snippet for Youtube Evolution Conversion -->
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GT-M3K62HZV"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GT-M3K62HZV');
</script>
<!-- External Script End -->

<script type="text/javascript" src="/ind-script/i18n.php?v=2610141514&lang=ko_KR&domain=front&type=" charset="utf-8"></script>

<script src="/ind-script/optimizer.php?filename=vVnJcuM2EL1bvOY76KkslasljSeusWOX5YmrcoPApgQTW7BY5nx9mos9lkiaBKTkIIkC-jW2h-4HMDdEwE6ZIjVglTcU0iebsk-_y-TJ_pR3az3ThBbp0z8eTNn-_Jz8lpxPsocXB0YSbtuChCpVMIjDesMDOpkATXIZCCCcERuCwVqnTD0gbdQGUXsTmxEHjglIhRIgXQr0pn54ZG778H1JHEkEk6NoztZoCw_4PGRrtWHS5YOuFPVVw5fKiIWSzijOwQxZ33FvL7SeG5ZtBlv0jvGhutyoerRnVnG0U_LMKX3GmYSzNZFyuOUGSJUQSn5s80IkElciR7QBN-axtnYgNMd5fG9KtE5v1JpxSO_foZoedMY4YC1U5rHI7pie4jz3klaTkqJd5qlLxAGFpuI6DSJR0m8NT98DOfleckWyCabCO1K1cbu2YJ73p3UAohUvc8ZHyJBBTjx31dCsIMbNOzyoqlZbpfecX9bgr6QgKi2q7zv2ArzLzA_Aj7AWVKckI9pNbnFRE-Bbz_oPAJaw9puJtveQgwFJYeFN9VveGUa7DChtP7wq1kxurmSu4kLpesNq0P8fxDOMYdIiwWwcHojFkcdhBTgkAcbcg4meK2KyvXnG0mRdlU5c0D9hl16zAtK5UTvcOAtCtxCKXXSi3nTUAsPaRuEYp6Pv4ZnBzhFetI8L5aWbsN9fSVvzcKYPqTsJRdt_sxwTEols9Tjwa2wf5ZHmfsMwfTyjOkD6KPPKp7eCAN3QdVbRVGa26xQ9aNwncGq_W-Aa_qM-b4nMWmFxSreYiFhentorJi135ERwRQlm6UKNCRqPS9n-BOzRtstPNhr1NriJWPzcclkEIG51rUk-vzhDanj9v_67UjxT3p3GWW-OjHN1JcjmRK6WzKKmLBlqy6MdXqGTFWY3DivgUEu9U3XSoLs5sQWcaDEuvczaPHy8s0dhwx29uQhOm10H8pj250xmR8CXPYIkAP5XE4rCqIKfu-YI8SohJwBX7Dt88SyDqIaCV-kH9IJGD-9Bob65yLIVBukoB_fV-Z4WNoih73RZ62YiuLXGs4QjjKdzXyVTLBQqZAYIZssbPDuGxbj3S8WVoVumo9BtrPFl2JjrkPy3UiICFtXPVbWuUchm40VBL3FZGvgNkdhzc6SXSE5TkC4Ket1zkTC-SLgBWdVbMvUsbYEgASfoekdylIUfXKH9EHsTDgkYJGRGTPpL8mtynuacOM1oEQTln87lgRr8KKTW46wqwDzXQfzV0dB4tk6ggcPpBDtkszClduordHZgw7n9K6WqHzPr8Pg42_ieA28PhthS0uY70FqAWHc5PwK6NRkY2iXsCKxRO7E43XshMwU5EPFHsIv6ZBDe24E4P4JaglaWhbb1yOz2mtkYGD28WpiAM71hagTUxLYCSjzGZVHYWjIsIvpb8zSUMiAhZ3EUvSZlcHtfDMlCyXLhnRIYnGgNxki2C-Wo547dKe116KbwKL4EGNxSzyx8cpfNjfMKlUx1W4pZCKOkDe18Wam5N2UUTos9BxHbp6bVH6x6zVRG07LFP5D1EejqeBo7gEbR9p02xjjACRNkzSG4dU3c1igOs14NMKHp6x6h0wPRkwN-k_5mXG2YnGBudwklh6_pKtvP7cV2N5NX1ZYapt0kTPV6I72o9IkGWr9Ly0k37fVC9yKE1osP39gZ5R1cshes_xc&type=js&k=4b4eba862cbd86e49e05d86ca2ef437b546fec1c&t=1791953091" ></script><script src="/ind-script/optimizer_user.php?filename=jZBBDsIwDATvtFfekQNP4QVpYrVbHCfECRW8ngI9FjWntaVZ78rqqfOkGMXoDXIxs5oQfWUyKa_qivFULLif9azH8KYdgh2p0ZPpAVoa4bvYXZLtM9ZiBqtwH5suSJRPQxXP1AdI4321TF3KcNQU8x2ayN_-r4WLIcT9jvQyEJSD_ltcqFygU0zXCSlBxrZnMVYkkNQVfwM&type=js&k=bc2aedc8545ca29a780c8c95836f11c774fd311f&t=1767770430&user=T" ></script>
<script type="text/javascript">
var sIsFrontDesignChangeRequired = 'F';
var sYtshopping = 'F';
var sIsYoutubeShops = 'F';
var sIsValidChRef = 'F';
var sChRef = '';
var sIsDropshipping = 'F';
if (sIsValidChRef === 'T') {
sessionStorage.setItem('ch_ref', sChRef);
}
// ch_ref 존재 여부 체크
CAFE24.hasChRef = function() {
if (sIsValidChRef === 'T' && sessionStorage.getItem('ch_ref')) {
return true;
}
return false;
}
// ch_ref 데이터 조회
CAFE24.getChRefData = function() {
if (sIsValidChRef === 'T') {
return sessionStorage.getItem('ch_ref');
}
}
// 프론트 디자인 변경이 필요한지 여부 반환
CAFE24.checkChannelUI = function() {
// [ECHOSTING-598429] 드롭쉬핑은 항상 전체 UI 노출
if (sIsDropshipping === 'T') {
return false;
}
if ((sIsFrontDesignChangeRequired === 'T' && sessionStorage.getItem('ch_ref')) || sIsYoutubeShops === 'T') {
return true;
} else {
return false;
}
}
// 파라미터에 ch_ref 추가
CAFE24.attachChRef = function(sUrl) {
if (sUrl) {
var sChRef = CAFE24.getChRefData();
if (sChRef) {
var sSeparator = (sUrl.includes('?')) ? '&' : '?';
sUrl += sSeparator + 'ch_ref=' + sChRef;
}
}
return sUrl;
}
var sIsCheckout = 'F';
var sCheckoutToken = '';
if (sIsCheckout === 'T') {
sessionStorage.setItem('checkoutToken', sCheckoutToken);
} else {
sessionStorage.removeItem('checkoutToken');
}
CAFE24.getCheckoutToken = function() {
if (sIsCheckout === 'T') {
return sessionStorage.getItem('checkoutToken');
}
}
CAFE24.attachCheckoutParam = function(sUrl) {
if (sUrl) {
var sCheckoutToken = CAFE24.getCheckoutToken();
if (sCheckoutToken) {
var sSeparator = (sUrl.includes('?')) ? '&' : '?';
sUrl += sSeparator + 'checkoutToken=' + sCheckoutToken;
}
}
return sUrl;
}
CAFE24.MOBILE_WEB = false; var mobileWeb = CAFE24.MOBILE_WEB;
try {
var isUseLoginKeepingSubmit = false;
// isSeqNoKeyExpiretime
function isSeqNoKeyExpiretime(iExpiretime)
{
var sDate = new Date();
var iNow = Math.floor(sDate.getTime() / 1000);
// 유효시간 확인
if (iExpiretime > iNow) {
return false;
}
return true;
}
function isUseLoginKeeping()
{
// 디바이스 확인
if (EC_MOBILE_DEVICE === false) {
return;
}
// 로그인 여부
var isLogin = document.cookie.match(/(?:^| |;)iscache=F/) ? true : false
if (isLogin) {
return;
}
var sLoginKeepingInfo = localStorage.getItem('use_login_keeping_info');
var iSeqnoExpiretime;
var iSeqNoKey;
if (sLoginKeepingInfo == null) {
iSeqnoExpiretime = localStorage.getItem('seq_no_key_expiretime');
iSeqNoKey = localStorage.getItem('seq_no_key');
// 유효시간, key 값 확인
if (iSeqnoExpiretime === null || iSeqNoKey === null) {
return;
}
} else {
var oLoginKeepingInfo = JSON.parse(sLoginKeepingInfo);
iSeqNoKey = oLoginKeepingInfo.seq_no_key;
iSeqnoExpiretime = oLoginKeepingInfo.seq_no_key_expiretime;
if (isNaN(iSeqNoKey) === true || isNaN(iSeqnoExpiretime) === true) {
return;
}
}
if (isSeqNoKeyExpiretime(iSeqnoExpiretime) === false) {
return;
}
useLoginKeepingSubmit();
}
function findGetParamValue(paramKey)
{
var result = null,
tmp = [];
location.search.substr(1).split('&').forEach(function (item) {
tmp = item.split('=');
if (tmp[0] === paramKey) result = decodeURIComponent(tmp[1]);
});
return result;
}
function useLoginKeepingSubmit()
{
var iSeqnoExpiretime;
var iSeqNoKey;
var sUseLoginKeepingIp;
var sLoginKeepingInfo = localStorage.getItem('use_login_keeping_info');
if (sLoginKeepingInfo == null) {
iSeqnoExpiretime = localStorage.getItem('seq_no_key_expiretime');
iSeqNoKey = localStorage.getItem('seq_no_key');
} else {
var oLoginKeepingInfo = JSON.parse(sLoginKeepingInfo);
iSeqNoKey = oLoginKeepingInfo.seq_no_key;
iSeqnoExpiretime = oLoginKeepingInfo.seq_no_key_expiretime;
sUseLoginKeepingIp = oLoginKeepingInfo.use_login_keeping_ip;
}
var oForm = document.createElement('form');
oForm.method = 'post';
oForm.action = '/exec/front/member/LoginKeeping';
document.body.appendChild(oForm);
var oSeqNoObj = document.createElement('input');
oSeqNoObj.name = 'seq_no_key';
oSeqNoObj.type = 'hidden';
oSeqNoObj.value = iSeqNoKey;
oForm.appendChild(oSeqNoObj);
oSeqNoObj = document.createElement('input');
oSeqNoObj.name = 'seq_no_key_expiretime';
oSeqNoObj.type = 'hidden';
oSeqNoObj.value = iSeqnoExpiretime;
oForm.appendChild(oSeqNoObj);
var returnUrl = findGetParamValue('returnUrl');
if (returnUrl == '' || returnUrl == null) {
returnUrl = location.pathname + location.search;
}
oSeqNoObj = document.createElement('input');
oSeqNoObj.name = 'returnUrl';
oSeqNoObj.type = 'hidden';
oSeqNoObj.value = returnUrl;
oForm.appendChild(oSeqNoObj);
if (sUseLoginKeepingIp != undefined) {
oSeqNoObj = document.createElement('input');
oSeqNoObj.name = 'use_login_keeping_ip';
oSeqNoObj.type = 'hidden';
oSeqNoObj.value = sUseLoginKeepingIp;
oForm.appendChild(oSeqNoObj);
}
oForm.submit();
isUseLoginKeepingSubmit = true;
}
isUseLoginKeeping();
} catch(e) {
}
window.CAFE24=window.CAFE24||{};CAFE24.WEBMCP_Q=CAFE24.WEBMCP_Q||[];CAFE24.WEBMCP_Q.push(["init",{"isLogin":false,"shopNo":1,"mallPrefix":"cafe24_eggnbugs_1","pageType":""}]);
if (typeof CAFE24.SHOP_FRONT_NEW_LIKE_COMMON !== "undefined") {CAFE24.SHOP_FRONT_NEW_LIKE_COMMON.init({"bIsUseLikeProduct":false,"bIsUseLikeCategory":false});}
if (typeof CAFE24.SHOP_FRONT_REVIEW_TALK_REVIEW_COUNT !== "undefined") {CAFE24.SHOP_FRONT_REVIEW_TALK_REVIEW_COUNT.bIsReviewTalk = 'F';}
var iProductNo = 55;
var aSoldoutDisplay = {"55":"\ud488\uc808"};
var aReserveStockMessage = {"show_stock_message":"F","Q":"[\uc7ac\uace0 : [:PRODUCT_STOCK:]\uac1c][\ub2f9\uc77c\ubc1c\uc1a1]","R":"[\uc7ac\uace0 : [:PRODUCT_STOCK:]\uac1c][\uc608\uc57d\uc8fc\ubb38]","N":"","stock_message_replace_name":"[:\uc218\ub7c9:]"};
var product_min = '1';var order_limit_type = 'O';
var delvtype = 'A';
CAFE24.SHOP_CURRENCY_INFO = {"1":{"aShopCurrencyInfo":{"currency_code":"KRW","currency_no":"410","currency_symbol":"\uffe6","currency_name":"South Korean won","currency_desc":"\uffe6 \uc6d0 (\ud55c\uad6d)","decimal_place":0,"round_method_type":"F"},"aShopSubCurrencyInfo":null,"aBaseCurrencyInfo":{"currency_code":"KRW","currency_no":"410","currency_symbol":"\uffe6","currency_name":"South Korean won","currency_desc":"\uffe6 \uc6d0 (\ud55c\uad6d)","decimal_place":0,"round_method_type":"F"},"fExchangeRate":1,"fExchangeSubRate":null,"aFrontCurrencyFormat":{"head":"","tail":"\uc6d0"},"aFrontSubCurrencyFormat":{"head":"","tail":""},"bPresentmentEnabled":false,"aPresentmentCurrencyInfo":null,"fExchangePresentmentRate":null,"aFrontPresentmentCurrencyFormat":null,"bGlobaleEnabled":false}}; var SHOP_CURRENCY_INFO = CAFE24.SHOP_CURRENCY_INFO;
var mileage_val = '350';var mileage_generate_calc = '360';
var basket_type = 'A0000';var product_name = '에그박사 조끼 아동용 정글조끼';var product_max_type = 'F';var has_option = 'T';var mileage_icon = '//img.echosting.cafe24.com/design/skin/admin/ko_KR/ico_product_point.gif';var mileage_icon_alt = '적립금';var price_unit_head = '';var price_unit_tail = '원';var option_push_button = 'F';var product_image_tiny = '20260112/a71bfa219d77ba4e252cfdce6e4f861b.jpg';var is_adult_product = 'F';var is_individual_buy = 'F';var is_soldout_icon = 'F';var link_product_detail = '/product/에그박사-조끼-아동용-정글조끼/55/display/2/';var sIsNonmemberLimit = 'F';
var product_max = '-1';
var buy_unit_type = 'O';var buy_unit = '1';
var product_price = '35900';var product_price_content = '';var is_selling_price = 'S';var product_price_mobile = '35900';var mobile_dc_price = '';var isMobileDcStatus = 'F';var product_price_ref = '';var currency_disp_type = 'P';
$.data(document,'SameImage','F');
var _iPrdtPriceOrg = 32636;
var _iPrdtPriceTax = 3264;
var qrcode_class = 'EC_Qrcode6ad01ddfc8f5d';
var sSocialUrl="/exec/front/Product/Social/";
window.CAFE24=window.CAFE24||{};CAFE24.WEBMCP_Q=CAFE24.WEBMCP_Q||[];CAFE24.WEBMCP_Q.push(["setContext",{"page_type":"product","product_no":55,"product_name":"에그박사 조끼 아동용 정글조끼","default_item_code":"P00000CD000A"}]);
var sIsMileageDisplay = 'F';
var product_sale_price = 34100;
if (typeof CAFE24.SHOP_FRONT_NEW_OPTION_COMMON !== "undefined") {CAFE24.SHOP_FRONT_NEW_OPTION_COMMON.initObject();}
if (typeof CAFE24.SHOP_FRONT_NEW_OPTION_BIND !== "undefined") {CAFE24.SHOP_FRONT_NEW_OPTION_BIND.initChooseBox();}
if (typeof CAFE24.SHOP_FRONT_NEW_OPTION_DATA !== "undefined") {CAFE24.SHOP_FRONT_NEW_OPTION_DATA.initData();}
var sMileageUnit = '[:PRICE:]원';
var sIsDisplayNonmemberPrice = "F";
var sNonmemberPrice = '-';
if (typeof setCategoryCookie === "function") { setCategoryCookie({"category_no":55,"category_name":"\uc804\uccb4\uc0c1\ud488"}); }
if (typeof(ImageAction) !== 'undefined') { ImageAction.sUseAddimageAction = 'C' }
try {
EC$(".xans-product-image").find("p.prdImg").eq(0).remove();
} catch(e) { }
CAFE24.FRONT_XANS_TEMPLATE.setTemplate('xans-product-mobileimage', "<div class=\"xans-element- xans-product xans-product-mobileimage prdImg\">\n<!--\n                        $swipe = yes\n                    -->\n<ul>\n                        <li data-param=\"{$zoom_param}\">\n                            <p class=\"thumbnail\">\n                                <img src=\"{$big_img}\" class=\"{$thumb_img_class}\" alt=\"{$seo_alt_tag}\"><!--#--><span class=\"xans-element- xans-product xans-product-imagestyle\">\n<span class=\"prdIcon {$icon_class_name}\" style=\"background-image:url('{$icon_url}');\"><\/span>\n<\/span>\n<!--#-->\n                            <\/p>\n                        <\/li>\n                        {$aAddImage}\n                    <\/ul>\n<\/div>\n");
$S.bSlider = false;
$S.bGenerate = true;
if (typeof($S) !== 'undefined') {
$S.sModule = "xans-product-mobileimage";
$S.sGrid = "grid3";
$S.iLine = "1";
$S.iActive = "0";
$S.sMode = "single";
$S.iAutoSlideInterval = "0";
$S.sPagingType = "circle";
$S.sCache = "";
$S.init();
}
var _iPrdtPriceOrg = 32636;
var _iPrdtPriceTax = 3264;
var product_sale_price = 34100;
var option_type = 'T';var option_name_mapper = '사이즈';var option_stock_data = '{\"P00000CD000B\":{\"stock_price\":\"0.00\",\"use_stock\":false,\"use_soldout\":\"F\",\"is_display\":\"T\",\"is_selling\":\"T\",\"option_price\":35900,\"option_name\":\"\\uc0ac\\uc774\\uc988\",\"option_value\":\"S\\uc0ac\\uc774\\uc988(100~110)\",\"option_value_orginal\":[\"S\\uc0ac\\uc774\\uc988(100~110)\"],\"option_name_original\":[\"\\uc0ac\\uc774\\uc988\"],\"use_stock_original\":\"T\",\"use_soldout_original\":\"F\",\"use_soldout_today_delivery\":\"F\",\"is_auto_soldout\":\"F\",\"is_mandatory\":\"T\",\"option_id\":\"000B\",\"is_reserve_stat\":\"N\",\"item_image_file\":null,\"origin_option_added_price\":\"0.00\"},\"P00000CD000C\":{\"stock_price\":\"0.00\",\"use_stock\":false,\"use_soldout\":\"F\",\"is_display\":\"T\",\"is_selling\":\"T\",\"option_price\":35900,\"option_name\":\"\\uc0ac\\uc774\\uc988\",\"option_value\":\"M\\uc0ac\\uc774\\uc988(120~130)\",\"option_value_orginal\":[\"M\\uc0ac\\uc774\\uc988(120~130)\"],\"option_name_original\":[\"\\uc0ac\\uc774\\uc988\"],\"use_stock_original\":\"T\",\"use_soldout_original\":\"F\",\"use_soldout_today_delivery\":\"F\",\"is_auto_soldout\":\"F\",\"is_mandatory\":\"T\",\"option_id\":\"000C\",\"is_reserve_stat\":\"N\",\"item_image_file\":null,\"origin_option_added_price\":\"0.00\"},\"P00000CD000D\":{\"stock_price\":\"0.00\",\"use_stock\":false,\"use_soldout\":\"F\",\"is_display\":\"T\",\"is_selling\":\"T\",\"option_price\":35900,\"option_name\":\"\\uc0ac\\uc774\\uc988\",\"option_value\":\"L\\uc0ac\\uc774\\uc988(140~150)\",\"option_value_orginal\":[\"L\\uc0ac\\uc774\\uc988(140~150)\"],\"option_name_original\":[\"\\uc0ac\\uc774\\uc988\"],\"use_stock_original\":\"T\",\"use_soldout_original\":\"F\",\"use_soldout_today_delivery\":\"F\",\"is_auto_soldout\":\"F\",\"is_mandatory\":\"T\",\"option_id\":\"000D\",\"is_reserve_stat\":\"N\",\"item_image_file\":null,\"origin_option_added_price\":\"0.00\"}}';var stock_manage = '1';var item_count = '3';var item_listing_type = 'C';var product_option_price_display = 'T';
var add_option_name = '';
var iCategoryNo = '1';var iDisplayGroup = '2';var option_msg = '필수 옵션을 선택해 주세요.';var sLoginURL = 'login.html';var bPrdOptLayer = '';var sOptionType = 'T';
$(function() { CAFE24.FRONT_NEW_PRODUCT_LAZYLOAD.resetDetailContent();});
$(function() { CAFE24.FRONT_NEW_PRODUCT_LAZYLOAD.resetDetailContent();});
var bUseElastic = false;
var sSearchBannerUseFlag = 'F';
var sMileageName = '적립금';
var sMileageUnit = '[:PRICE:]원';
var sDepositName = '예치금';
var sDepositUnit = '원';
CAFE24.APPSCRIPT_ASSIGN_DATA = CAFE24.APPSCRIPT_ASSIGN_DATA || [{'src':'https://calendar-app.cafe24.com/openapi/inject.js?vs=20260806132413.1&client_id=A8RQp67UIt9nBlqvThz2jC'}];
CAFE24.APPSCRIPT_SDK_DATA = CAFE24.APPSCRIPT_SDK_DATA || ['store','supply','application','category','community','customer','design','notification','product','promotion','collection','order'];
var EC_APPSCRIPT_ASSIGN_DATA = CAFE24.getDeprecatedNamespace('EC_APPSCRIPT_ASSIGN_DATA');
var EC_APPSCRIPT_SDK_DATA = CAFE24.getDeprecatedNamespace('EC_APPSCRIPT_SDK_DATA');
</script></body>
</html>


