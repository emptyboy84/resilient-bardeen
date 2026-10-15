Title: Live Content

Description: Fetched live

Source: https://www.tattootati.com

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
            i[r].init('https://js-error-tracer-api.cafe24.com', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0Y21iLmNhZmUyNC5jb20iLCJhdWQiOiJqcy1lcnJvci10cmFjZXItYXBpLmNhZmUyNC5jb20iLCJtYWxsX2lkIjoidGNtYiIsInNob3Bfbm8iOjEsInBhdGhfcm9sZSI6Ik1BSU4iLCJsYW5ndWFnZV9jb2RlIjoia29fS1IiLCJjb3VudHJ5X2NvZGUiOiJLUiIsImlzX3l0cyI6ZmFsc2UsImlzX2NvbnRhaW5lciI6ZmFsc2UsIndvcmtzcGFjZSI6InByb2R1Y3Rpb24ifQ.LF0yGd6_3ZRxGyhGnFruiKgQUr6Wq0exmvIopHFxtuY', {"errors":{"path":"\/api\/v1\/store","collectWindowErrors":true,"preventDuplicateReports":true,"storageKeyPrefix":"EC_JET.MAIN","samplingEnabled":true,"samplingRate":0.5},"vitals":{"path":"\/api\/v1\/vitals","samplingEnabled":true,"samplingRate":0.3},"resources":{"path":"\/api\/v1\/resources","samplingEnabled":true,"samplingRate":0.5,"durationThreshold":3000}});
        }
    };
    m.parentNode.insertBefore(a, m);
}(window, document, 'script', '//assets.poxo.com/jet/jet.js', 'EC_JET'));</script>
<script type="text/javascript">window.CAFE24 = window.CAFE24 || {};CAFE24.ROUTE = {"is_mobile":false,"is_need_route":false,"language_code":"ZZ","path":{"origin":"\/","result":"\/","prefix":""},"shop_no":0,"skin_code":"default","support_language_list":{"ar":"ar_EG","ar-EG":"ar_EG","de":"de_DE","de-DE":"de_DE","en":"en_US","en-IN":"en_IN","en-PH":"en_PH","en-US":"en_US","es":"es_ES","es-ES":"es_ES","hi":"hi_IN","hi-IN":"hi_IN","id":"id_ID","id-ID":"id_ID","it":"it_IT","it-IT":"it_IT","ja":"ja_JP","ja-JP":"ja_JP","ko":"ko_KR","ko-KR":"ko_KR","ms":"ms_MY","ms-MY":"ms_MY","pt":"pt_PT","pt-PT":"pt_PT","ru":"ru_RU","ru-RU":"ru_RU","th":"th_TH","th-TH":"th_TH","tr":"tr_TR","tr-TR":"tr_TR","vi":"vi_VN","vi-VN":"vi_VN","zh":"zh_CN","zh-CN":"zh_CN","zh-HK":"zh_HK","zh-MO":"zh_MO","zh-SG":"zh_SG","zh-TW":"zh_TW"}};</script><script type="text/javascript">if (typeof EC_ROUTE === "undefined") {
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
<meta name="path_role" content="MAIN" />
<meta name="author" content="TATTOO TATi" />
<meta name="description" content="TATTOO TATi | 타투타티는 단순한 임시 타투 브랜드가 아닙니다.  우리는 당신의 정체성을 빛나게 할 생동감 있고 3차원적인 도구를 제공합니다." />
<meta name="keywords" content="TATTOO TATi" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8">

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
<link rel="apple-touch-icon-precomposed" sizes="180x180" href="https://tattootati.com/web/upload/NNEditor/20260406/881883d2373269583cbf35327b5b1457.png">
<link rel="apple-touch-icon" sizes="72x72" href="https://tattootati.com/web/upload/NNEditor/20260406/1cfb70ee19804bb409e25c99b08cf075.png">
<link rel="apple-touch-icon" sizes="114x114" href="https://tattootati.com/web/upload/NNEditor/20260406/b76e6a71af5de01b6871fe9d0f0c8c35.png">
<link rel="apple-touch-icon" sizes="144x144" href="https://tattootati.com/web/upload/NNEditor/20260406/b706290272a286862e289e982a9a5e97.png">
<link rel="icon" type="image/png" sizes="512x512" href="https://tattootati.com/web/upload/NNEditor/20260406/3111cd0fe7a32183bc798b2fde898018.png">
<link rel="icon" type="image/png" sizes="256x256" href="https://tattootati.com/web/upload/NNEditor/20260406/b4c1aaf8601cfb3ac1d21ec5c4771af5.png">
<link rel="icon" type="image/png" sizes="128x128" href="https://tattootati.com/web/upload/NNEditor/20260406/28180de945f2c6522f27362f5f9e370a.png">
<link rel="icon" type="image/png" sizes="64x64" href="https://tattootati.com/web/upload/NNEditor/20260406/d238092f67380eb2aa417eee5ef1fbc6.png">
<link rel="icon" type="image/png" sizes="48x48" href="https://tattootati.com/web/upload/NNEditor/20260406/ac2bc0b2b55c8a4638b8043afd30d6ed.png">
<link rel="icon" type="image/png" sizes="32x32" href="https://tattootati.com/web/upload/NNEditor/20260406/100489003db747503a962b6918075add.png">
<link rel="icon" type="image/png" sizes="16x16" href="https://tattootati.com/web/upload/NNEditor/20260406/0d21a4e7fca76a47993829e498836a1a.png">
<meta name="msapplication-TileColor" content="#ffffff"/><meta name="msapplication-TileImage" content="https://tattootati.com/web/upload/NNEditor/20260406/28180de945f2c6522f27362f5f9e370a.png"/><meta name="theme-color" content="#ffffff"/><!--ez-favicon]-->

    
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
        
<!-- Facebook Channel Site Verification -->
<meta name="facebook-domain-verification" content="06eg1k7gxps494clf71t9omy4kli9g" />
<!-- Facebook Channel Site Verification -->

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TATTOO TATi",
  "url": "https://tattootati.com",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "010-5959-8401",
    "contactType": "customer service",
    "email": "connect@twocommab.com"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "3F, 19-15, Dongpangyo-ro 52beon-gil, Bundang-gu, Seongnam-si, Gyeonggi-do, Republic of Korea",
    "postalCode": "13535",
    "addressCountry": "KOR"
  }
}
</script>
<!-- Cafe24 SEO -->
<meta name="google-site-verification" content="ePkR4oi4a48EbcAVNYOtZA_PVxfKjWdQVcSWxVVrNuI" />
<!-- Cafe24 SEO -->
<link rel="canonical" href="https://tattootati.com/" />
<link rel="alternate" hreflang="x-default" href="https://tattootati.com/" /><link rel="alternate" hreflang="ko-KR" href="https://tattootati.com/" /><link rel="alternate" href="https://m.tattootati.com/" />
<meta property="og:url" content="https://tattootati.com/" />
<meta property="og:title" content="TATTOO TATi | 타투타티" />
<meta property="og:description" content="TATTOO TATi | 타투타티는 단순한 임시 타투 브랜드가 아닙니다.  우리는 당신의 정체성을 빛나게 할 생동감 있고 3차원적인 도구를 제공합니다." />
<meta property="og:site_name" content="TATTOO TATi" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://www.tattootati.com/web/upload/share-image-1-25e234f13a7c9612212407fb0c39c384.png" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="TATTOO TATi | 타투타티" />
<meta name="twitter:description" content="TATTOO TATi | 타투타티는 단순한 임시 타투 브랜드가 아닙니다.  우리는 당신의 정체성을 빛나게 할 생동감 있고 3차원적인 도구를 제공합니다." />
<meta name="twitter:image" content="https://www.tattootati.com/web/upload/share-image-1-25e234f13a7c9612212407fb0c39c384.png" />
<meta name="naver-site-verification" content="5ceac4962dab66bdfbbc50068adb2e11c97fbb94" />
<link rel="shortcut icon" href="/web/upload/favicon-5f2971241bcafe8d528b7ca69c59be3c.ico" />
<script type="text/javascript">var CAFE24API = { instance: [], MALL_ID: 'tcmb', SHOP_NO: 1, basicAuthKeys: {}, setBasicAuthKey: function (clientId, basicAuthKey) { if (typeof basicAuthKey !== 'string') { return; } if (clientId) { CAFE24API.basicAuthKeys[clientId] = basicAuthKey; } else { CAFE24API.basicAuthKeys['default'] = basicAuthKey; } }, init: function (appInfo) { if (typeof appInfo == 'object') { if (appInfo.hasOwnProperty('client_id')) { var appKey = appInfo.client_id; } } else { var appKey = appInfo; } if (appKey) { if (!this.instance[appKey]) { CAFE24API.clientId = appKey; if (appInfo.hasOwnProperty('version')) { CAFE24API.version = appInfo.version; } else { if (CAFE24API.hasOwnProperty('version')) { delete CAFE24API.version; } } var copyObject = CAFE24API.constructor(); for (var attr in CAFE24API) { if (CAFE24API.hasOwnProperty(attr)) { copyObject[attr] = CAFE24API[attr]; } } this.instance[appKey] = copyObject; } return this.instance[appKey]; } }, initializeXhr: function () { try { return new XMLHttpRequest(); } catch (error) { return new window.ActiveXObject('Microsoft.XMLHTTP'); } }, fullPath: function (url) { return 'https://tcmb.cafe24api.com' + url; }, getLoginProvider: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'login': CAPP_ASYNC_METHODS.AppCommon.getLoginProvider() }); }, getCustomerProvider: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'login': CAPP_ASYNC_METHODS.AppCommon.getCustomerProvider() }); }, getMemberID: function (callback) { if (!CAPP_ASYNC_METHODS.IS_LOGIN) { callback(null); } else { callback(CAPP_ASYNC_METHODS.AppCommon.getMemberID()); } }, getEncryptedMemberId: function (client_id, callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, CAPP_ASYNC_METHODS.AppCommon.getEncryptedMemberId(client_id)); }, getMemberInfo: function (callback) { callback({ 'id': CAPP_ASYNC_METHODS.AppCommon.getMemberInfo() }); }, getCustomerIDInfo: function (callback) { if (!CAFE24API.__scopeErr(callback, 'application')) { return; } callback(null, { 'id': CAPP_ASYNC_METHODS.AppCommon.getCustomerIDInfo() }); }, getCustomerInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'customer': CAPP_ASYNC_METHODS.AppCommon.getCustomerInfo() }); }, getDefaultShippingAddress: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'shipping_address': CAPP_ASYNC_METHODS.AppCommon.getDefaultShippingAddress() }); }, getMileageInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'mileage': CAPP_ASYNC_METHODS.AppCommon.getMileageInfo() }); }, getPointInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'point': CAPP_ASYNC_METHODS.AppCommon.getPointInfo() }); }, getDepositInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'deposit': CAPP_ASYNC_METHODS.AppCommon.getDepositInfo() }); }, getCreditInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'credit': CAPP_ASYNC_METHODS.AppCommon.getCreditInfo() }); }, getCartList: function (callback) { if (!CAFE24API.__scopeErr(callback, 'personal')) { return; } CAPP_ASYNC_METHODS.AppCommon.getCartList().then(function (data) { callback(null, { 'carts': data }); }); }, getCartInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'personal')) { return; } callback(null, { 'cart': CAPP_ASYNC_METHODS.AppCommon.getCartInfo() }); }, getCartItemList: function (callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } callback(null, { 'items': CAPP_ASYNC_METHODS.AppCommon.getCartItemList() }); }, getCartCount: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'personal')) { return; } callback(null, CAPP_ASYNC_METHODS.AppCommon.getCartCount()); }, getCouponCount: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'promotion')) { return; } callback(null, CAPP_ASYNC_METHODS.AppCommon.getCouponCount()); }, getWishCount: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'personal')) { return; } callback(null, CAPP_ASYNC_METHODS.AppCommon.getWishCount()); }, getShopInfo: function (callback) { if (!CAFE24API.__scopeErr(callback, 'store')) { return; } callback(null, { 'shop': CAPP_ASYNC_METHODS.AppCommon.getShopInfo() }); }, addCurrentProductToCart: function (mall_id, time, app_key, member_id, hmac, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.addCurrentProductToCart(mall_id, time, app_key, member_id, hmac).then(function (data) { callback(null, { 'cart': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error('422'), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, precreateOrder: function (mall_id, time, app_key, member_id, hmac, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.precreateOrder(mall_id, time, app_key, member_id, hmac).then(function (data) { callback(null, { 'order': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error('422'), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, calculatePayment: function (mall_id, request_time, app_key, member_id, request_data_json, hmac, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.calculatePayment(mall_id, request_time, app_key, member_id, request_data_json, hmac).then(function (data) { callback(null, { 'expected_payment': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error('422'), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, precreateOrderV2: function (mall_id, time, app_key, member_id, request_data_json, hmac, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.precreateOrderV2(mall_id, time, app_key, member_id, request_data_json, hmac).then(function (data) { callback(null, { 'order': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error('422'), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, getOrderItemList: function (start_date, end_date, order_status, page, count, order_id, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.getOrderItemList(start_date, end_date, order_status, page, count, order_id).then(function (data) { callback(null, { 'items': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, getOrderDetailInfo: function (shop_no, order_id, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.getOrderDetailInfo(shop_no, order_id).then(function (data) { callback(null, { 'orders': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, getClaimableItemList: function (order_id, customer_service_type, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.getClaimableItemList(order_id, customer_service_type).then(function (data) { callback(null, { 'items': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, emptyCart: function (basket_shipping_type, callback) { if (!CAFE24API.__scopeErr(callback, 'personal')) { return; } CAPP_ASYNC_METHODS.AppCommon.emptyCart(basket_shipping_type).then(function (data) { callback(null, { 'result': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, deleteCartItems: function (basket_shipping_type, product_list, callback) { if (!CAFE24API.__scopeErr(callback, 'personal')) { return; } CAPP_ASYNC_METHODS.AppCommon.deleteCartItems(basket_shipping_type, product_list).then(function (data) { callback(null, { 'result': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, addCart: function (basket_type, prepaid_shipping_fee, product_list, callback) { if (!CAFE24API.__scopeErr(callback, 'personal')) { return; } CAPP_ASYNC_METHODS.AppCommon.addCart(basket_type, prepaid_shipping_fee, product_list).then(function (data) { callback(null, data); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }) }, addBundleProductsCart: function (basket_type, prepaid_shipping_fee, product_list, callback) { if (!CAFE24API.__scopeErr(callback, 'personal')) { return; } CAPP_ASYNC_METHODS.AppCommon.addBundleProductsCart(basket_type, prepaid_shipping_fee, product_list).then(function (data) { callback(null, data); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }) }, get: function (url, callback) { return CAFE24API.complete('GET', url, this, null, callback); }, post: function (url, params, callback) { return CAFE24API.complete('POST', url, this, params, callback); }, put: function (url, params, callback) { return CAFE24API.complete('PUT', url, this, params, callback); }, delete: function (url, callback) { return CAFE24API.complete('DELETE', url, this, null, callback); }, complete: function (method, url, obj, params, callback) { var xhr = CAFE24API.sendXhr(method, url, obj, params, callback); xhr.onreadystatechange = function () { if (xhr.readyState === XMLHttpRequest.DONE) { if (xhr.status >= 200 && xhr.status <= 208) { callback(null, JSON.parse(xhr.responseText)); } else { callback(new Error(xhr.status), JSON.parse(xhr.responseText)); } } }; }, sendXhr: function (method, url, obj, params, callback) { if (method !== 'POST') { var url = obj.fullPath(url); } var xhr = obj.initializeXhr(); var queryVars = {}; if (obj.clientId) queryVars['cafe24_app_key'] = obj.clientId; if (obj.version) queryVars['cafe24_api_version'] = obj.version; var basicAuthKey = CAFE24API.basicAuthKeys[obj.clientId] || CAFE24API.basicAuthKeys['default']; if (basicAuthKey && basicAuthKey.length > 0) { queryVars['authorization'] = 'Basic ' + basicAuthKey; } if (params === null) { var seperator = url.indexOf('?') == -1 ? '?' : '&'; var queryString = []; for (var key in queryVars) { queryString.push(key + '=' + encodeURIComponent(queryVars[key])); } if (queryString.length > 0) { url = url + seperator + queryString.join('&'); } } xhr.open(method, url, true); if (typeof params == 'object' && params !== null) { xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8'); for (var key in queryVars) { params[key] = queryVars[key]; } params = 'formData=' + JSON.stringify(params); } xhr.send(params || null); return xhr; }, __sessionErr: function (callback) { callback(new Error(403), { 'error': { code: 403, message: 'Failed to get session. Only available when log in.' } }); }, __scopeErr: function (callback, scope) { if (typeof CAFE24.APPSCRIPT_SDK_DATA != "undefined" && jQuery.inArray(scope, CAFE24.APPSCRIPT_SDK_DATA) > -1) { return true; } callback(new Error(403), { 'error': { code: 403, message: 'You do not have the necessary authority(scope) to use the SDK.' } }); }, __chkValidSessionScope: function (callback, scope) { if (!CAPP_ASYNC_METHODS.IS_LOGIN) { CAFE24API.__sessionErr(callback); return false; } if (!CAFE24API.__scopeErr(callback, scope)) { return false; } return true; } }; </script>
<script type="text/javascript">
window.CAFE24 = window.CAFE24 || {};
CAFE24.MANIFEST_CACHE_REVISION = '2609021500';
CAFE24.getDeprecatedNamespace = function(sDeprecatedNamespace, sSupersededNamespace) {
var sNamespace = sSupersededNamespace 
? sSupersededNamespace 
: sDeprecatedNamespace.replace(/^EC_/, '');
return CAFE24[sNamespace];
}
CAFE24.FRONT_LANGUAGE_CODE = "ko_KR";
CAFE24.MOBILE = false;
CAFE24.MOBILE_DEVICE = false;
CAFE24.MOBILE_USE = true;
var EC_MOBILE = CAFE24.MOBILE;
var EC_MOBILE_DEVICE = CAFE24.MOBILE_DEVICE;
var EC_MOBILE_USE = CAFE24.MOBILE_USE;
CAFE24.SKIN_CODE = "base";
CAFE24.FRONT_EXTERNAL_SCRIPT_VARIABLE_DATA = {"common_member_id_crypt":""};
var EC_FRONT_EXTERNAL_SCRIPT_VARIABLE_DATA = CAFE24.getDeprecatedNamespace('EC_FRONT_EXTERNAL_SCRIPT_VARIABLE_DATA');
CAFE24.SDE_SHOP_NUM = 1;CAFE24.SHOP = {getLanguage : function() { return "ko_KR"; },getSkinLanguageCode : function() { return "ko_KR"; },getCurrency : function() { return "KRW"; },getFlagCode : function() { return "KR"; },getTimezone: function() { return "Asia/Seoul" },getDateFormat: function() { return "Y-m-d" },isMultiShop : function() { return true; },isDefaultShop : function() { return true; },isDefaultLanguageShop : function(sLanguageCode) { return SHOP.isDefaultShop() && SHOP.isLanguageShop(sLanguageCode); },isKR : function() { return true; },isUS : function() { return false; },isJP : function() { return false; },isCN : function() { return false; },isTW : function() { return false; },isES : function() { return false; },isPT : function() { return false; },isVN : function() { return false; },isPH : function() { return false; },getCountryAndLangMap : function() { return {
"KR": "ko_KR",
"US": "en_US",
"JP": "ja_JP",
"CN": "zh_CN",
"TW": "zh_TW",
"VN": "vi_VN",
"PH": "en_PH"
}},isLanguageShop : function(sLanguageCode) { return sLanguageCode === "ko_KR"; },getDefaultShopNo : function() { return 1; },getProductVer : function() { return 2; },isSDE : function() { return true; },isMode : function() {return false; },getModeName : function() {return false; },isMobileAdmin : function() {return false; },isNewProMode : function() {return true; },isExperienceMall : function() { return false; },isDcollection : function() {return false; },isYoutubeShops : function() {return false; },getYtShopsShopNo : function() {return 0; },isFrontDesignChangeRequired : function() {return false;},isG2G : function() {return false; },isGlobale : function() {return false; },getAdminID : function() {return ''},getMallID : function() {return 'tcmb'},getCurrencyFormat : function(sPriceTxt, bIsNumberFormat) { 
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
var oData = {"base_domain":"tcmb.cafe24.com","root_domain":"cafe24.com","api_domain":"cafe24api.com","is_global":false,"is_global_standard":false,"country_code":"KR","language_code":"ko_KR","admin_language_code":"ko_KR","front_language_code":"ko_KR"};
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
CAFE24.FRONT_JS_CONFIG_MANAGE = {"sSmartBannerScriptUrl":"https:\/\/app4you.cafe24.com\/SmartBanner\/tunnel\/scriptTags?vs=1563164396689206","sMallId":"tcmb","sDefaultAppDomain":"https:\/\/app4you.cafe24.com","sWebLogOffFlag":"F"};
var EC_FRONT_JS_CONFIG_MANAGE = CAFE24.getDeprecatedNamespace('EC_FRONT_JS_CONFIG_MANAGE');
CAFE24.FRONT_JS_CONFIG_MEMBER = {"sAuthUrl":"https:\/\/ipin-ec.cafe24.com\/certify\/v1\/?action=auth"};
var EC_FRONT_JS_CONFIG_MEMBER = CAFE24.getDeprecatedNamespace('EC_FRONT_JS_CONFIG_MEMBER');
CAFE24.FRONT_JS_CONFIG_SHOP = {"aProductPurchaseInfo_19":{"bIsSuccess":true,"sMessage":"","bReplaceLoginPage":false,"bIsDisplayPurchaseButton":true},"aProductPurchaseInfo_18":{"bIsSuccess":true,"sMessage":"","bReplaceLoginPage":false,"bIsDisplayPurchaseButton":true},"aProductPurchaseInfo_16":{"bIsSuccess":true,"sMessage":"","bReplaceLoginPage":false,"bIsDisplayPurchaseButton":true},"aProductPurchaseInfo_14":{"bIsSuccess":true,"sMessage":"","bReplaceLoginPage":false,"bIsDisplayPurchaseButton":true},"search_period":[],"calendar_config":{"maxDate":"2028-09-04","locale":"ko"}};
var EC_FRONT_JS_CONFIG_SHOP = CAFE24.getDeprecatedNamespace('EC_FRONT_JS_CONFIG_SHOP');
typeof window.CAFE24 === "undefined" && (window.CAFE24 = {});
CAFE24.FRONTEND = {"IS_RENDERED_LOGIN":"F","FW_MANIFEST_CACHE_REVISION":2609021500,"IS_WEB_VIEW":"F"};
CAFE24.ROUTE = {"is_mobile":false,"is_need_route":false,"language_code":"ZZ","path":{"origin":"\/","result":"\/","prefix":""},"shop_no":0,"skin_code":"default","support_language_list":{"ar":"ar_EG","ar-EG":"ar_EG","de":"de_DE","de-DE":"de_DE","en":"en_US","en-IN":"en_IN","en-PH":"en_PH","en-US":"en_US","es":"es_ES","es-ES":"es_ES","hi":"hi_IN","hi-IN":"hi_IN","id":"id_ID","id-ID":"id_ID","it":"it_IT","it-IT":"it_IT","ja":"ja_JP","ja-JP":"ja_JP","ko":"ko_KR","ko-KR":"ko_KR","ms":"ms_MY","ms-MY":"ms_MY","pt":"pt_PT","pt-PT":"pt_PT","ru":"ru_RU","ru-RU":"ru_RU","th":"th_TH","th-TH":"th_TH","tr":"tr_TR","tr-TR":"tr_TR","vi":"vi_VN","vi-VN":"vi_VN","zh":"zh_CN","zh-CN":"zh_CN","zh-HK":"zh_HK","zh-MO":"zh_MO","zh-SG":"zh_SG","zh-TW":"zh_TW"}};
</script>

<link rel="stylesheet" type="text/css" href="/ind-script/optimizer.php?filename=lY1BCgIxDEX3pVvPERd6Am8geIA0ZqRMmpQ0A3p7ZVYiuOj2895_3e3h2MB52ObEQGPA4qYBZK2Z5s9w6P8ppjRMtqimqdhzCt8i5gKCL_YZIbAITwnWk1TlVFD1pyW1wK12pBWu3y8XFNY7OpzyOR9hEYxead3lNw&type=css&k=61732c6aac8d44fbd11c495dd901314cca505b98&t=1753857507"  /><link rel="stylesheet" type="text/css" href="/ind-script/optimizer_user.php?filename=lZRLDgIhDED3OlvPMX5O4cKVJ2CgzjQBSqYl6u1lNOrGxHbX0PdIoQUOsA7AOOZ-cAx9dHeqssToe8_cJ4e5a8GG_5EcMcAJctXhnlIi5davBR0LfrUkVhVt_FBFtPW8HXGDWYhgVIiiYLFJE0SjcaEYjBdGN5vQIG8zykyherFK4ZgvZJTciNmJsjd8xQJzl9A4Ly3RtF_K86m1w8aPnWprO09UzhOWgnlUllaHNctdO2ULLhMkJe5CeOHbnVXYW4WDXvj-Dw8&type=css&k=e410963df47809455cd582c9ce78bf96e28192fe&t=1777276445&user=T"  />
<style type="text/css">

</style>
<title>TATTOO TATi | 타투타티</title></head>
<body class="theme01" data-ez-theme="theme01">	<div id="skipNavigation">
		<p><a href="#category">전체상품목록 바로가기</a></p>
		<p><a href="#contents">본문 바로가기</a></p>
	</div>
	<div id="wrap">
<div class="main_top_banner ez-align-left" data-ez-module="top-banner" data-ez-align="left" data-ez-role="style.color" data-ez-display="visible" data-ez="contents-00jgowv-1">
	<div class="top_banner_box_inner">
		<div class="top_banner_text"><!-- 최상단 배너 수정하는곳 -->
			<a data-ez-role="a" href="#" data-href="#" target="_self" style="color: black;">첫 쇼핑을 지원하는 3,000원 할인 회원가입 쿠폰</a>
		</div><!-- //top_banner_text -->

		<div class="top_banner_close" data-ez-role="close">
			<input type="checkbox" name="chkbox" id="top_banner_box_cloase" value="1" data-ez-role="disable-term"><label for="top_banner_box_cloase" data-ez-role="disable-text">오늘 하루 보지 않기</label>
			<i aria-hidden="true" class="icon icoClose">닫기</i>
		</div><!-- //top_banner_close -->
	</div><!-- //top_banner_box_inner -->
</div>
<header id="header" class="layout5" data-ez-layout="layout5" data-ez="contents-1dd6t3x-1">
	<ez-prop data-version="1.0.0" type="layout">
		<ez-var data-prop="layout" data-namespace="ez.layout.header.layout" data-type="array">
			<ez-item data-id="layout3" data-name="1단 기본형"></ez-item>
			<ez-item data-id="layout2" data-name="2단 좌측형"></ez-item>
			<ez-item data-id="layout4" data-name="2단 혼합형"></ez-item>
			<ez-item data-id="layout1" data-name="2단 중앙형 (아이콘 하단)"></ez-item>
			<ez-item data-id="layout5" data-name="2단 중앙형 (아이콘 상단)"></ez-item>
  	    </ez-var>
	</ez-prop>
	<div class="inner">
		<div class="toparea display_pc_only">
			<div class="toparea_shoppinginfo">
				<div class="xans-element- xans-layout xans-layout-multishoplist "><button type="button" class="toggle">한국어 <i aria-hidden="true" class="icon icoArrowBottom"></i></button>
<ul class="xans-element- xans-layout xans-layout-multishoplistitem"><li class="selected xans-record-">
							<a href="//www.tattootati.com/">한국어</a>
						</li>
</ul>
</div>
                <div data-ez-group="shopping-info" data-ez-role="list">
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
<li class="xans-record-"><a href="/board/이용안내-faq/3/">이용안내 FAQ</a></li>
</ul>
				</div>
			</div><!-- //toparea_state -->
		</div><!-- //toparea -->

		<div class="top_nav_box" id="top_nav_box">
			<div class="xans-element- xans-layout xans-layout-logotop top_logo "><a href="/"><img src="/web/upload/category/logo/v2_accb1551c7d255107b02de2eb5dee6c9_PJxosOwa6H_top.jpg" alt="TATTOO TATi"></a>
</div>
<!-- //top_logo -->
			<div class="top_nav"><a href="javascript:;" class="eNavFold"><i aria-hidden="true" class="icon icoNav"></i></a></div>

			<div data-ez-module="menu-main/1" data-ez-mode="manual">
        <div class="xans-element- xans-layout xans-layout-category top_category">
<ul><li><a href="/category/%ED%83%80%ED%88%AC%ED%8E%9C/46/">Shop</a></li><li><a href="#">About US</a></li></ul>
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
<!--#ez="1/12"-->
<aside id="aside" data-ez="contents-08xfru3-1" class="xans-element- xans-layout xans-layout-slidepackage "><div class="navigation_member">
		<div class="xans-element- xans-layout xans-layout-logotop side_logo "><a href="/"><img src="/web/upload/category/logo/v2_accb1551c7d255107b02de2eb5dee6c9_PJxosOwa6H_top.jpg" alt="TATTOO TATi"></a>
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
<li><a href="/category/%ED%83%80%ED%88%AC%ED%8E%9C/46/" class="view">Shop</a></li>
<li><a href="#" class="view">About US</a></li>
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
<a href="/board/이용안내-faq/3/">이용안내 FAQ</a> </li>
            </ul>
</div>
<!-- //navigation-menu__board -->

		<div class="xans-element- xans-layout xans-layout-multishoplist "><button type="button" class="toggle">한국어 <i aria-hidden="true" class="icon icoArrowBottom"></i></button>
<ul class="xans-element- xans-layout xans-layout-multishoplistitem"><li class="selected xans-record-">
					<a href="//www.tattootati.com/">한국어</a>
				</li>
</ul>
</div>
    </nav>
<button type="button" class="btnClose"><i aria-hidden="true" class="icon icoClose"></i>닫기</button>
</aside>
<!--#ez="1/12"-->
<div id="container" data-ez="layout-1ksm57f-1">
			<div id="contents">
				<span class="xans-element- xans-layout xans-layout-mobileaction RTMB "><a href="#none" onclick="history.go(-1);return false;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewbox="0 0 24 24" class="icon">
	<path d="M7.29976 12.5L14.9998 20.1C15.3998 20.5 15.9998 20.5 16.3998 20.1C16.7998 19.7 16.7998 19.1 16.3998 18.7L9.49976 11.7L16.3998 4.7C16.7998 4.3 16.7998 3.7 16.3998 3.3C16.1998 3.1 15.9998 3 15.6998 3C15.3998 3 15.1998 3.1 14.9998 3.3L7.29976 10.9C6.89976 11.4 6.89976 12 7.29976 12.5C7.29976 12.4 7.29976 12.4 7.29976 12.5Z" fill="#000000"></path>
</svg>

뒤로가기</a>
</span>
				


<div app4you-smart-banner="smart-banner-admin-RES00001" app4you-smart-banner-html="true" class="xans-element- xans-smart-banner-admin xans-smart-banner-admin-RES00001 section section_full" data-ez="module-1g67mcw-1" data-ez-layoutsize="full" data-ez-size-pc="1920 600" data-ez-size-mobile="720 767" data-ez-banner-area-no="586419" style="--pc-width: 1920px; --pc-height: 600px; --mobile-width: 720px; --mobile-height: 767px;"><style>
  @media all and (min-width: 721px) {
    [data-ez="module-1g67mcw-1"].xans-smart-banner-admin.section.section_fixed {
      max-width: none !important;
      width: auto !important;
    }
    [data-ez="module-1g67mcw-1"].xans-smart-banner-admin.section.section_fixed img {
      width: auto !important;
      max-width: none !important;
      margin: 0 auto;
      display: block;
    }
  }
  @media all and (max-width: 720px) {
    [data-ez="module-1g67mcw-1"].xans-smart-banner-admin.section.section_fixed {
      max-width: 100% !important;
    }
    [data-ez="module-1g67mcw-1"].xans-smart-banner-admin.section.section_fixed img {
      width: auto !important;
      max-width: none !important;
      margin: 0 auto;
      display: block;
    }
  }
  </style>
  <div data-slider="true" data-type="full" data-mode="fade" data-minslides="1" data-maxslides="10" data-controls="true" data-adaptiveheight="true" data-autohover="true" data-responsive="true" class="smart-banner-wrapper circle" data-pager="true" data-auto="true" data-speed="500" data-pause="2000" data-banner-size-width="1920" data-banner-size-height="697">
    <ul style="width: auto; position: relative; visibility:hidden" class="smart-banner-bxslider">
      <li><a href="javascript:void(0)%5C;" target="_self" style="cursor:default"><picture>
      <source media="(max-width: 720px)" srcset="https://file.cafe24cos.com/banner-admin-live/upload/tcmb/b75fb581-24b4-426b-88f6-220e58ffba3d.jpeg"><img src="https://file.cafe24cos.com/banner-admin-live/upload/tcmb/c652df15-4623-4384-98ed-4af3148d8974.jpeg" style="width:100%"></source></picture></a></li>
      <li><a href="/product/%E1%84%90%E1%85%A1%E1%84%90%E1%85%AE%E1%84%90%E1%85%A1%E1%84%90%E1%85%B5-%E1%84%90%E1%85%A6%E1%86%B7%E1%84%91%E1%85%A9%E1%84%85%E1%85%A5%E1%84%85%E1%85%B5-%E1%84%90%E1%85%A1%E1%84%90%E1%85%AE%E1%84%91%E1%85%A6%E1%86%AB-I-AM-%E1%84%8C%E1%85%B5%E1%84%8B%E1%85%AF%E1%84%8C%E1%85%B5%E1%84%82%E1%85%B3%E1%86%AB-%E1%84%90%E1%85%A1%E1%84%90%E1%85%AE%E1%84%91%E1%85%A6%E1%86%AB/16/" target="_self" ontouchstart="APP4YOU_SMART_BANNER.incrementBanner('3192980')" onclick="APP4YOU_SMART_BANNER.incrementBanner('3192980')" style="cursor:pointer"><picture><source media="(max-width: 720px)" srcset="https://file.cafe24cos.com/banner-admin-live/upload/tcmb/ef8dc537-1806-4d2c-b5c2-df38944b628c.png"></source><img src="https://file.cafe24cos.com/banner-admin-live/upload/tcmb/7fd5d33a-952b-4543-f5a9-249fbb2f2961.png" style="width:100%"></picture></a></li>
    </ul>
  </div>
  
</div>
<!--#ez="1/4"-->
<section class="section main_product_category" data-ez-module="product-list-category/2" data-ez-layout="grid3" data-ez="contents-018qyf7-1">
	<ez-prop data-version="1.0.0">
		<ez-var data-prop="layout" data-namespace="ez.module.product-list-category.layout" data-type="array">
			<ez-item data-id="grid3" data-name="일반3단형(PC 3열/MOBILE 2열)"></ez-item>
			<ez-item data-id="grid4" data-name="일반4단형(PC 4열/MOBILE 2열)"></ez-item>
			<ez-item data-id="grid5" data-name="일반5단형(PC 5열/MOBILE 3열)"></ez-item>
			<ez-item data-id="grid3 list_gallery" data-name="이미지강조3단형(PC 3열/MOBILE 2열)"></ez-item>
			<ez-item data-id="grid4 list_gallery" data-name="이미지강조4단형(PC 4열/MOBILE 2열)"></ez-item>
			<ez-item data-id="grid5 list_gallery" data-name="이미지강조5단형(PC 5열/MOBILE 3열)"></ez-item>
		</ez-var>
	</ez-prop>
	<div class="main_product_inner">
		<div class="main_title ez-align-center" data-ez-role="ez-align" data-ez-align="center"><!-- 메인 베스트셀러 수정하는곳 -->
			<div class="main_title_txt01" data-ez-role="title">BEST! SELLER</div>
			<div class="main_title_txt02" data-ez-role="subtitle">베스트 셀러를 만나보세요</div>
		</div><!-- //main_title -->

		<ul class="main_product_tab" data-ez-role="tab-list">
			
			<li data-ez-role="tab-item"><button type="button" class="button" data-id="tabContent2" data-ez-role="name" data-name="템포러리 타투펜">템포러리 타투펜</button></li>
			
			
		</ul><!-- //main_product_tab -->
	</div><!-- //main_product_inner -->

	<div class="content_list" data-ez-role="content-list">
		

		<div class="tabcontent" id="tabContent2" data-ez-role="content-item">
			<div data-ez-holder="product_listmain">
				<div class="xans-element- xans-product xans-product-listmain-2 xans-product-listmain xans-product-2 ec-base-product"><!--
						$count = 100
						$basket_result = /product/add_basket.html
						$basket_option = /product/basket_option.html
						$moreview = yes
						$cache = yes
					-->
<ul class="prdList grid3" data-ez-role="layout ez-discount-tag">
						<!--
※ 상품진열 공통소스
-->
<li id="anchorBoxId_19" class="xans-record-">
	<div class="prdList__item">
		<div class="thumbnail">
			<a href="/product/나-사용-설명서-원데이-타투펜-14일-챌린지-워크북/19/category/1/display/3/?icid=MAIN.product_listmain_2"><img src="//www.tattootati.com/web/product/medium/202509/351ae185e8d0a6c86c1075826f4ff900.jpg" id="eListPrdImage19_3" alt="나 사용 설명서 원데이 타투펜과 14일 챌린지 워크북 세트 구성 이미지" loading="lazy"></a>
			<div class="likeButton displaynone"><button type="button"> <strong></strong></button></div>
			<div class="badge"><span></span></div>
			<div class="icon__box">
				<span class="wish"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_wish_before.png"  class="icon_img ec-product-listwishicon" alt="관심상품 등록 전" productno="19" categoryno="1" icon_status="off" login_status="F" individual-set="F" />WISH</span>
				<span class="cart"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_list_cart.gif"  onClick="CAPP_SHOP_NEW_PRODUCT_OPTIONSELECT.selectOptionCommon(19,  1, 'basket', '')" alt="장바구니 담기" class="ec-admin-icon cart" />ADD</span>
				<span class="option">OPTION</span>
			</div>
		</div>
		<div class="description" ec-data-custom="45000" ec-data-price="29800">
			<div class="name"><a href="/product/나-사용-설명서-원데이-타투펜-14일-챌린지-워크북/19/category/1/display/3/?icid=MAIN.product_listmain_2" class=""><span class="title displaynone"><span class="" style="font-size:12px;color:#555555;">상품명</span> :</span> <span class="" style="font-size:12px;color:#555555;">「나 사용 설명서」 (원데이 타투펜 + 14일 챌린지 워크북)</span></a></div>
			<ul class="xans-element- xans-product xans-product-listitem-2 xans-product-listitem xans-product-2 spec"><li class=" xans-record-">
					<strong class="title displaynone"><span class="" style="font-size:12px;color:#555555;">소비자가</span> :</strong> <span class="" style="font-size:12px;color:#555555;text-decoration:line-through;">45,000원</span>				</li>
<li class=" xans-record-">
					<strong class="title displaynone"><span class="" style="font-size:12px;color:#008BCC;font-weight:bold;">판매가</span> :</strong> <span class="" style="font-size:12px;color:#008BCC;font-weight:bold;">29,800원</span><span id="span_product_tax_type_text" style=""> </span>				</li>
</ul>
			<div class="icon">       </div>
		</div>
	</div>
</li>
<li id="anchorBoxId_18" class="xans-record-">
	<div class="prdList__item">
		<div class="thumbnail">
			<a href="/product/클리오-구달-넘버즈인-마녀공장-플래시세일-최대-74/18/category/1/display/3/?icid=MAIN.product_listmain_2"><img src="//www.tattootati.com/web/product/medium/202603/d00a779ba5bbdc412df3166b6730bd61.png" id="eListPrdImage18_3" alt="클리오 구달 넘버즈인 마녀공장 플래시세일 - 인기 브랜드 뷰티 제품 큐레이션 이미지" loading="lazy"></a>
			<div class="likeButton displaynone"><button type="button"> <strong></strong></button></div>
			<div class="badge"><span></span></div>
			<div class="icon__box">
				<span class="wish"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_wish_before.png"  class="icon_img ec-product-listwishicon" alt="관심상품 등록 전" productno="18" categoryno="1" icon_status="off" login_status="F" individual-set="F" />WISH</span>
				<span class="cart"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_list_cart.gif"  onClick="CAPP_SHOP_NEW_PRODUCT_OPTIONSELECT.selectOptionCommon(18,  1, 'basket', '')" alt="장바구니 담기" class="ec-admin-icon cart" />ADD</span>
				<span class="option">OPTION</span>
			</div>
		</div>
		<div class="description" ec-data-custom="" ec-data-price="5000">
			<div class="name"><a href="/product/클리오-구달-넘버즈인-마녀공장-플래시세일-최대-74/18/category/1/display/3/?icid=MAIN.product_listmain_2" class=""><span class="title displaynone"><span class="" style="font-size:12px;color:#555555;">상품명</span> :</span> <span class="" style="font-size:12px;color:#555555;">클리오 / 구달/ 넘버즈인 / 마녀공장 플래시세일 최대 74%</span></a></div>
			<ul class="xans-element- xans-product xans-product-listitem-2 xans-product-listitem xans-product-2 spec"><li class=" xans-record-">
					<strong class="title displaynone"><span class="" style="font-size:12px;color:#008BCC;font-weight:bold;">판매가</span> :</strong> <span class="" style="font-size:12px;color:#008BCC;font-weight:bold;">5,000원</span><span id="span_product_tax_type_text" style=""> </span>				</li>
</ul>
			<div class="icon">       </div>
		</div>
	</div>
</li>
<li id="anchorBoxId_16" class="xans-record-">
	<div class="prdList__item">
		<div class="thumbnail">
			<a href="/product/타투타티-템포러리-타투펜-i-am-지워지는-타투펜/16/category/1/display/3/?icid=MAIN.product_listmain_2"><img src="//www.tattootati.com/web/product/medium/202311/c5b00b01970e15b3fa3c5d8bb226eb5c.jpg" id="eListPrdImage16_3" alt="타투타티 템포러리 타투펜 I AM - 손목 위 작은 다짐을 기록하는 지워지는 타투펜 제품 이미지" loading="lazy"></a>
			<div class="likeButton displaynone"><button type="button"> <strong></strong></button></div>
			<div class="badge"><span></span></div>
			<div class="icon__box">
				<span class="wish"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_wish_before.png"  class="icon_img ec-product-listwishicon" alt="관심상품 등록 전" productno="16" categoryno="1" icon_status="off" login_status="F" individual-set="F" />WISH</span>
				<span class="cart"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_list_cart.gif"  onClick="category_add_basket('16','1', '3', 'A0000', false, '1', 'P000000Q', 'A', 'F', '0');" alt="장바구니 담기" class="ec-admin-icon cart" />ADD</span>
				<span class="option">OPTION</span>
			</div>
		</div>
		<div class="description" ec-data-custom="" ec-data-price="19900">
			<div class="name"><a href="/product/타투타티-템포러리-타투펜-i-am-지워지는-타투펜/16/category/1/display/3/?icid=MAIN.product_listmain_2" class=""><span class="title displaynone"><span class="" style="font-size:12px;color:#555555;">상품명</span> :</span> <span class="" style="font-size:12px;color:#555555;">타투타티 템포러리 타투펜 I AM (지워지는 타투펜)</span></a></div>
			<ul class="xans-element- xans-product xans-product-listitem-2 xans-product-listitem xans-product-2 spec"><li class=" xans-record-">
					<strong class="title displaynone"><span class="" style="font-size:12px;color:#008BCC;font-weight:bold;">판매가</span> :</strong> <span class="" style="font-size:12px;color:#008BCC;font-weight:bold;">19,900원</span><span id="span_product_tax_type_text" style=""> </span>				</li>
</ul>
			<div class="icon">       </div>
		</div>
	</div>
</li>
<li id="anchorBoxId_14" class="xans-record-">
	<div class="prdList__item">
		<div class="thumbnail">
			<a href="/product/타투타티-템포러리-타투펜-i-am-11/14/category/1/display/3/?icid=MAIN.product_listmain_2"><img src="//www.tattootati.com/web/product/medium/202311/7b42d81ab1fca0dd21b29aae4ececa0e.jpg" id="eListPrdImage14_3" alt="타투타티 템포러리 타투펜 I AM 1+1 - 스스로를 탐색하고 기록하는 타투펜 제품 이미지" loading="lazy"></a>
			<div class="likeButton displaynone"><button type="button"> <strong></strong></button></div>
			<div class="badge"><span></span></div>
			<div class="icon__box">
				<span class="wish"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_wish_before.png"  class="icon_img ec-product-listwishicon" alt="관심상품 등록 전" productno="14" categoryno="1" icon_status="off" login_status="F" individual-set="F" />WISH</span>
				<span class="cart"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_list_cart.gif"  onClick="category_add_basket('14','1', '3', 'A0000', false, '1', 'P000000O', 'A', 'F', '0');" alt="장바구니 담기" class="ec-admin-icon cart" />ADD</span>
				<span class="option">OPTION</span>
			</div>
		</div>
		<div class="description" ec-data-custom="" ec-data-price="34900">
			<div class="name"><a href="/product/타투타티-템포러리-타투펜-i-am-11/14/category/1/display/3/?icid=MAIN.product_listmain_2" class=""><span class="title displaynone"><span class="" style="font-size:12px;color:#555555;">상품명</span> :</span> <span class="" style="font-size:12px;color:#555555;">타투타티 템포러리 타투펜 I AM 1+1</span></a></div>
			<ul class="xans-element- xans-product xans-product-listitem-2 xans-product-listitem xans-product-2 spec"><li class=" xans-record-">
					<strong class="title displaynone"><span class="" style="font-size:12px;color:#008BCC;font-weight:bold;">판매가</span> :</strong> <span class="" style="font-size:12px;color:#008BCC;font-weight:bold;">34,900원</span><span id="span_product_tax_type_text" style=""> </span>				</li>
</ul>
			<div class="icon">       </div>
		</div>
	</div>
</li>
					</ul>
</div>
							</div>
		</div>

		

		
	</div><!-- //content-list -->
</section>
<section class="section main_video ez-align-center" data-ez-align="center" data-ez-module="video/1" data-ez-role="style.background" data-ez="contents-0uapfcc-1">
	<div class="main_title">
		<div class="main_title_txt01" data-ez-role="title">Drawing with the TattooTati Pen</div>
		<div class="main_title_txt02" data-ez-role="desc">아이엠 타투펜을 영상 속에서 만나보세요</div>
	</div><!-- //main_title -->

	<div class="main_video_box"><iframe data-ez-role="video" id="ytplayer" type="text/html" src="//www.youtube.com/embed/aYiudM8kI_Q" frameborder="0" allowfullscreen data-ez-rawsrc="https://youtu.be/aYiudM8kI_Q" loading="lazy"></iframe></div>
</section>
<div app4you-smart-banner="smart-banner-admin-RES00002" app4you-smart-banner-html="true" class="xans-element- xans-smart-banner-admin xans-smart-banner-admin-RES00002 section" data-ez="module-1pif45p-1" data-ez-name="메인롱배너" data-ez-size-pc="1230 360" data-ez-size-mobile="720 360" data-ez-layoutsize="fit" data-ez-banner-area-no="586420" data-ez-display="hidden" style="display: none;">
  <a href="javascript:void(0)%5C;" style="cursor:default">
    <picture>
      <source media="(max-width: 720px)" srcset="https://file.cafe24cos.com/banner-admin-live/upload/tcmb/5046b204-714b-4dfc-9d95-de16c2e99a9e.png"><img src="https://file.cafe24cos.com/banner-admin-live/upload/tcmb/b5407aa0-49a3-4d72-8daa-0aa8be043a0a.png" style="width:100%"></source></picture></a>
</div>
<!--#ez="1/4"-->
<section class="section main_text ez-textsize-medium ez-align-center" data-ez-module="text/1" data-ez-role="style.background" data-ez-align="center" data-ez-textsize="medium" style="background-color: rgb(245, 245, 245); margin-bottom: 120px;" data-ez="contents-0f5rpjh-1" data-ez-display="visible"><!-- 메인 텍스트배너 수정하는곳 -->
	<div class="main_text_title" data-ez-role="title" style="color: rgb(0, 0, 0); font-weight: bold;">WE ARE</div>
	<div class="main_text_txt" data-ez-role="desc" style="color: rgb(26, 26, 26);"><p><span data-sheets-userformat='{"2":513,"3":{"1":0},"12":0}' data-sheets-value='{"1":2,"2":"Tattoo Tati는 단순한 임시 타투 브랜드가 아닙니다. 우리는 자기 표현을 위한 캔버스입니다. 우리는 당신의 정체성을 빛나게 할 생동감 있고 3차원적인 도구를 제공합니다."}' style="font-size:10pt;font-family:Arial;font-style:normal;"><span style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);"><strong>Tattoo Tati는 단순한 임시 타투 브랜드가 아닙니다.  </strong></span></span><strong><span style="color: rgb(0, 0, 0);"><span data-sheets-userformat='{"2":513,"3":{"1":0},"12":0}' data-sheets-value='{"1":2,"2":"Tattoo Tati는 단순한 임시 타투 브랜드가 아닙니다. 우리는 자기 표현을 위한 캔버스입니다. 우리는 당신의 정체성을 빛나게 할 생동감 있고 3차원적인 도구를 제공합니다."}' style="font-size:10pt;font-family:Arial;font-style:normal;"><span style="background-color: rgb(255, 255, 255);">우리는 자기 표현을 위한 캔버스입니다. </span></span><br></span></strong><span data-sheets-userformat='{"2":513,"3":{"1":0},"12":0}' data-sheets-value='{"1":2,"2":"Tattoo Tati는 단순한 임시 타투 브랜드가 아닙니다. 우리는 자기 표현을 위한 캔버스입니다. 우리는 당신의 정체성을 빛나게 할 생동감 있고 3차원적인 도구를 제공합니다."}' style="font-size:10pt;font-family:Arial;font-style:normal;"><span style="color: rgb(0, 0, 0);"><span style="background-color: rgb(255, 255, 255);"><strong>우리는 당신의 정체성을 빛나게 할 생동감 있고 3차원적인 도구를 제공합니다.</strong></span></span></span></p></div>
	<div class="main_text_link"><a data-ez-role="a" href="#" target="_self">더 알아보기</a></div>
</section>
<section class="section main_image_text_gallery" data-ez-module="image-gallery/2" data-ez-role="style.background" data-ez-item-length="3" data-ez="contents-0nkoaua-1" data-ez-display="hidden" style="display: none;">
	<ez-prop data-version="1.0.0">
		<ez-var data-prop="image" data-namespace="ez.module.image-gallery.image">
			<ez-item data-id="size" data-pc="396 240" data-mobile="396 240"></ez-item>
		</ez-var>
		<ez-var data-prop="display" data-namespace="ez.module.image-gallery.display">
			<ez-item data-id="item" data-max="10"></ez-item>
			<ez-item data-id="column" data-default="3" data-min="1" data-max="5"></ez-item>
		</ez-var>
		<ez-var data-prop="layout" data-namespace="ez.module.image-gallery.layout">
			<ez-item data-id="mobile" data-default="slide">
				<ez-item data-id="options" data-type="array">
					<ez-item data-id="slide" data-name="슬라이드"></ez-item>
					<ez-item data-id="more" data-name="더보기"></ez-item>
					<ez-item data-id="none" data-name="사용안함"></ez-item>
				</ez-item>
			</ez-item>
		</ez-var>
	</ez-prop>

	<div class="main_title ez-align-center" data-ez-role="ez-align" data-ez-align="center"><!-- 온스토리 타이틀 수정하는곳 -->
		<div class="main_title_txt01" data-ez-role="title">캠페인 및 이벤트</div>
		<div class="main_title_txt02" data-ez-role="desc">요즘 가장 핫한 상품 온스토어</div>
	</div><!-- //main_title -->

    <div class="main_3dan_banner ez-mobile-layout-slide" data-ez-role="ez-mobile-layout" data-ez-mobile-layout="slide"><!-- 메인 3단배너 수정하는곳 -->
         <ul data-ez-role="image-list ez-column" class="ez-column-3" data-ez-column="3"><li data-ez-role="image-item ez-align">
				<a data-ez-role="a" href="#" target="_self">
					<picture>
						<source srcset="/shop1/skin-base/SkinImg/img/main_banner01_pc.jpg" media="(max-width: 1024px)" data-ez-role="img-pc" data-ez-eb>
						<img src="/shop1/skin-base/SkinImg/img/main_banner01_pc.jpg" data-ez-role="img-mobile" loading="lazy">
					 </source></picture>
					<div class="main_banner_txt">
						<div class="main_banner_txt01" data-ez-role="title" style="color: rgb(58, 58, 58);">스킨 세럼 파운데이션</div>
						<div class="main_banner_more" data-ez-role="desc" style="color: rgb(154, 154, 154);">자세히 살펴보기</div>
					</div><!--//main_banner_txt-->
				</a>
            </li><li data-ez-role="image-item ez-align">
				<a data-ez-role="a" href="#" target="_self">
					<picture>
						<source srcset="/shop1/skin-base/SkinImg/img/main_banner02_pc.jpg" media="(max-width: 1024px)" data-ez-role="img-pc" data-ez-eb>
						<img src="/shop1/skin-base/SkinImg/img/main_banner02_pc.jpg" data-ez-role="img-mobile" loading="lazy">
					 </source></picture>
					<div class="main_banner_txt">
						<div class="main_banner_txt01" data-ez-role="title" style="color: rgb(58, 58, 58);">웨이트리스 스킨 세럼</div>
						<div class="main_banner_more" data-ez-role="desc" style="color: rgb(154, 154, 154);">자세히 살펴보기</div>
					</div><!--//main_banner_txt-->
				</a>
            </li><li data-ez-role="image-item ez-align">
				<a data-ez-role="a" href="#" target="_self">
					<picture>
						<source srcset="/shop1/skin-base/SkinImg/img/main_banner03_pc.jpg" media="(max-width: 1024px)" data-ez-role="img-pc" data-ez-eb>
						<img src="/shop1/skin-base/SkinImg/img/main_banner03_pc.jpg" data-ez-role="img-mobile" loading="lazy">
					 </source></picture>
					<div class="main_banner_txt">
						<div class="main_banner_txt01" data-ez-role="title" style="color: rgb(58, 58, 58);">UV 베이비 에센스 SPF35</div>
						<div class="main_banner_more" data-ez-role="desc" style="color: rgb(154, 154, 154);">자세히 살펴보기</div>
					</div><!--//main_banner_txt-->
				</a>
            </li></ul>
		<div class="main_image_text_gallery_more"><a href="#none" class="main_image_text_gallery_more_btn">더보기</a></div>
	</div><!-- //main_3dan_banner -->
</section>
<section class="section main_product_slide" data-ez-module="product-list-slide/2" data-ez-layout="grid5_slide" data-ez="contents-1qbomw3-1" data-ez-display="hidden" style="display: none;">
	<ez-prop data-version="1.0.0">
		<ez-var data-prop="layout" data-namespace="ez.module.product-list.layout" data-type="array">
			<ez-item data-id="grid3_slide" data-name="일반3단형(PC 3열/MOBILE 2열)"></ez-item>
			<ez-item data-id="grid4_slide" data-name="일반4단형(PC 4열/MOBILE 2열)"></ez-item>
			<ez-item data-id="grid5_slide" data-name="일반5단형(PC 5열/MOBILE 3열)"></ez-item>
			<ez-item data-id="grid3_slide list_gallery" data-name="이미지강조3단형(PC 3열/MOBILE 2열)"></ez-item>
			<ez-item data-id="grid4_slide list_gallery" data-name="이미지강조4단형(PC 4열/MOBILE 2열)"></ez-item>
			<ez-item data-id="grid5_slide list_gallery" data-name="이미지강조5단형(PC 5열/MOBILE 3열)"></ez-item>
		</ez-var>
	</ez-prop>

	<div class="main_title ez-align-center" data-ez-role="ez-align" data-ez-align="center"><!-- 온라인 타이틀 수정하는곳 -->
		<div class="main_title_txt01" data-ez-role="title">ONLY! ON</div>
		<div class="main_title_txt02" data-ez-role="subtitle">오직 온라인에서만 만나보세요</div>
	</div><!-- //main_title -->

	<div data-ez-holder="product_listmain">
		<div class="xans-element- xans-product xans-product-listmain-1 xans-product-listmain xans-product-1 ec-base-product swiper-container special_slide"><ul class="swiper-wrapper prdList grid5_slide" data-ez-role="layout ez-discount-tag">
				<!--
※ 상품진열 슬라이드 공통소스
-->
<li id="anchorBoxId_16" class="swiper-slide xans-record-">
	<div class="prdList__item">
		<div class="thumbnail">
			<a href="/product/타투타티-템포러리-타투펜-i-am-지워지는-타투펜/16/category/1/display/2/?icid=MAIN.product_listmain_1"><img src="//www.tattootati.com/web/product/medium/202311/c5b00b01970e15b3fa3c5d8bb226eb5c.jpg" id="eListPrdImage16_2" alt="타투타티 템포러리 타투펜 I AM - 손목 위 작은 다짐을 기록하는 지워지는 타투펜 제품 이미지" class="swiper-lazy" loading="lazy"></a>
			<div class="likeButton displaynone"><button type="button"> <strong></strong></button></div>
			<div class="badge">BEST<span></span>
</div>
			<div class="icon__box">
				<span class="wish"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_wish_before.png"  class="icon_img ec-product-listwishicon" alt="관심상품 등록 전" productno="16" categoryno="1" icon_status="off" login_status="F" individual-set="F" />WISH</span>
				<span class="cart"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_list_cart.gif"  onClick="category_add_basket('16','1', '2', 'A0000', false, '1', 'P000000Q', 'A', 'F', '0');" alt="장바구니 담기" class="ec-admin-icon cart" />ADD</span>
				<span class="option">OPTION</span>
			</div>
		</div>
		<div class="description" ec-data-custom="" ec-data-price="19900">
			<div class="name"><a href="/product/타투타티-템포러리-타투펜-i-am-지워지는-타투펜/16/category/1/display/2/?icid=MAIN.product_listmain_1" class=""><span class="title displaynone"><span class="" style="font-size:12px;color:#555555;">상품명</span> :</span> <span class="" style="font-size:12px;color:#555555;">타투타티 템포러리 타투펜 I AM (지워지는 타투펜)</span></a></div>
			<ul class="xans-element- xans-product xans-product-listitem-1 xans-product-listitem xans-product-1 spec"><li class=" xans-record-">
					<strong class="title displaynone"><span class="" style="font-size:12px;color:#555555;font-weight:bold;">판매가</span> :</strong> <span class="" style="font-size:12px;color:#555555;font-weight:bold;">19,900원</span><span id="span_product_tax_type_text" style=""> </span>				</li>
<li class=" xans-record-">
					<strong class="title "><span class="" style="font-size:12px;color:#555555;">배송비</span> :</strong> <span class="" style="font-size:12px;color:#555555;">3,000원</span>				</li>
<li class=" xans-record-">
					<strong class="title "><span class="" style="font-size:12px;color:#555555;">사용후기</span> :</strong> <span class="" style="font-size:12px;color:#555555;">0</span>				</li>
</ul>
			<div class="icon">       </div>
		</div>
	</div>
</li>
<li id="anchorBoxId_18" class="swiper-slide xans-record-">
	<div class="prdList__item">
		<div class="thumbnail">
			<a href="/product/클리오-구달-넘버즈인-마녀공장-플래시세일-최대-74/18/category/1/display/2/?icid=MAIN.product_listmain_1"><img src="//www.tattootati.com/web/product/medium/202603/d00a779ba5bbdc412df3166b6730bd61.png" id="eListPrdImage18_2" alt="클리오 구달 넘버즈인 마녀공장 플래시세일 - 인기 브랜드 뷰티 제품 큐레이션 이미지" class="swiper-lazy" loading="lazy"></a>
			<div class="likeButton displaynone"><button type="button"> <strong></strong></button></div>
			<div class="badge">BEST<span></span>
</div>
			<div class="icon__box">
				<span class="wish"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_wish_before.png"  class="icon_img ec-product-listwishicon" alt="관심상품 등록 전" productno="18" categoryno="1" icon_status="off" login_status="F" individual-set="F" />WISH</span>
				<span class="cart"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_list_cart.gif"  onClick="CAPP_SHOP_NEW_PRODUCT_OPTIONSELECT.selectOptionCommon(18,  1, 'basket', '')" alt="장바구니 담기" class="ec-admin-icon cart" />ADD</span>
				<span class="option">OPTION</span>
			</div>
		</div>
		<div class="description" ec-data-custom="" ec-data-price="5000">
			<div class="name"><a href="/product/클리오-구달-넘버즈인-마녀공장-플래시세일-최대-74/18/category/1/display/2/?icid=MAIN.product_listmain_1" class=""><span class="title displaynone"><span class="" style="font-size:12px;color:#555555;">상품명</span> :</span> <span class="" style="font-size:12px;color:#555555;">클리오 / 구달/ 넘버즈인 / 마녀공장 플래시세일 최대 74%</span></a></div>
			<ul class="xans-element- xans-product xans-product-listitem-1 xans-product-listitem xans-product-1 spec"><li class=" xans-record-">
					<strong class="title displaynone"><span class="" style="font-size:12px;color:#555555;font-weight:bold;">판매가</span> :</strong> <span class="" style="font-size:12px;color:#555555;font-weight:bold;">5,000원</span><span id="span_product_tax_type_text" style=""> </span>				</li>
<li class=" xans-record-">
					<strong class="title "><span class="" style="font-size:12px;color:#555555;">배송비</span> :</strong> <span class="" style="font-size:12px;color:#555555;">3,000원</span>				</li>
<li class=" xans-record-">
					<strong class="title "><span class="" style="font-size:12px;color:#555555;">사용후기</span> :</strong> <span class="" style="font-size:12px;color:#555555;">0</span>				</li>
</ul>
			<div class="icon">       </div>
		</div>
	</div>
</li>
<li id="anchorBoxId_14" class="swiper-slide xans-record-">
	<div class="prdList__item">
		<div class="thumbnail">
			<a href="/product/타투타티-템포러리-타투펜-i-am-11/14/category/1/display/2/?icid=MAIN.product_listmain_1"><img src="//www.tattootati.com/web/product/medium/202311/7b42d81ab1fca0dd21b29aae4ececa0e.jpg" id="eListPrdImage14_2" alt="타투타티 템포러리 타투펜 I AM 1+1 - 스스로를 탐색하고 기록하는 타투펜 제품 이미지" class="swiper-lazy" loading="lazy"></a>
			<div class="likeButton displaynone"><button type="button"> <strong></strong></button></div>
			<div class="badge">BEST<span></span>
</div>
			<div class="icon__box">
				<span class="wish"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_wish_before.png"  class="icon_img ec-product-listwishicon" alt="관심상품 등록 전" productno="14" categoryno="1" icon_status="off" login_status="F" individual-set="F" />WISH</span>
				<span class="cart"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_list_cart.gif"  onClick="category_add_basket('14','1', '2', 'A0000', false, '1', 'P000000O', 'A', 'F', '0');" alt="장바구니 담기" class="ec-admin-icon cart" />ADD</span>
				<span class="option">OPTION</span>
			</div>
		</div>
		<div class="description" ec-data-custom="" ec-data-price="34900">
			<div class="name"><a href="/product/타투타티-템포러리-타투펜-i-am-11/14/category/1/display/2/?icid=MAIN.product_listmain_1" class=""><span class="title displaynone"><span class="" style="font-size:12px;color:#555555;">상품명</span> :</span> <span class="" style="font-size:12px;color:#555555;">타투타티 템포러리 타투펜 I AM 1+1</span></a></div>
			<ul class="xans-element- xans-product xans-product-listitem-1 xans-product-listitem xans-product-1 spec"><li class=" xans-record-">
					<strong class="title displaynone"><span class="" style="font-size:12px;color:#555555;font-weight:bold;">판매가</span> :</strong> <span class="" style="font-size:12px;color:#555555;font-weight:bold;">34,900원</span><span id="span_product_tax_type_text" style=""> </span>				</li>
<li class=" xans-record-">
					<strong class="title "><span class="" style="font-size:12px;color:#555555;">배송비</span> :</strong> <span class="" style="font-size:12px;color:#555555;">3,000원</span>				</li>
<li class=" xans-record-">
					<strong class="title "><span class="" style="font-size:12px;color:#555555;">사용후기</span> :</strong> <span class="" style="font-size:12px;color:#555555;">2</span>				</li>
</ul>
			<div class="icon">       </div>
		</div>
	</div>
</li>
<li id="anchorBoxId_19" class="swiper-slide xans-record-">
	<div class="prdList__item">
		<div class="thumbnail">
			<a href="/product/나-사용-설명서-원데이-타투펜-14일-챌린지-워크북/19/category/1/display/2/?icid=MAIN.product_listmain_1"><img src="//www.tattootati.com/web/product/medium/202509/351ae185e8d0a6c86c1075826f4ff900.jpg" id="eListPrdImage19_2" alt="나 사용 설명서 원데이 타투펜과 14일 챌린지 워크북 세트 구성 이미지" class="swiper-lazy" loading="lazy"></a>
			<div class="likeButton displaynone"><button type="button"> <strong></strong></button></div>
			<div class="badge">BEST<span></span>
</div>
			<div class="icon__box">
				<span class="wish"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_wish_before.png"  class="icon_img ec-product-listwishicon" alt="관심상품 등록 전" productno="19" categoryno="1" icon_status="off" login_status="F" individual-set="F" />WISH</span>
				<span class="cart"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_list_cart.gif"  onClick="CAPP_SHOP_NEW_PRODUCT_OPTIONSELECT.selectOptionCommon(19,  1, 'basket', '')" alt="장바구니 담기" class="ec-admin-icon cart" />ADD</span>
				<span class="option">OPTION</span>
			</div>
		</div>
		<div class="description" ec-data-custom="45000" ec-data-price="29800">
			<div class="name"><a href="/product/나-사용-설명서-원데이-타투펜-14일-챌린지-워크북/19/category/1/display/2/?icid=MAIN.product_listmain_1" class=""><span class="title displaynone"><span class="" style="font-size:12px;color:#555555;">상품명</span> :</span> <span class="" style="font-size:12px;color:#555555;">「나 사용 설명서」 (원데이 타투펜 + 14일 챌린지 워크북)</span></a></div>
			<ul class="xans-element- xans-product xans-product-listitem-1 xans-product-listitem xans-product-1 spec"><li class=" xans-record-">
					<strong class="title displaynone"><span class="" style="font-size:12px;color:#555555;">소비자가</span> :</strong> <span class="" style="font-size:12px;color:#555555;text-decoration:line-through;">45,000원</span>				</li>
<li class=" xans-record-">
					<strong class="title displaynone"><span class="" style="font-size:12px;color:#555555;font-weight:bold;">판매가</span> :</strong> <span class="" style="font-size:12px;color:#555555;font-weight:bold;">29,800원</span><span id="span_product_tax_type_text" style=""> </span>				</li>
<li class=" xans-record-">
					<strong class="title "><span class="" style="font-size:12px;color:#555555;">배송비</span> :</strong> <span class="" style="font-size:12px;color:#555555;">무료</span>				</li>
<li class=" xans-record-">
					<strong class="title "><span class="" style="font-size:12px;color:#555555;">사용후기</span> :</strong> <span class="" style="font-size:12px;color:#555555;">0</span>				</li>
</ul>
			<div class="icon">       </div>
		</div>
	</div>
</li>
			</ul>
<div class="swiper-scrollbar"></div>
</div>
	</div>
	<div class="swiper-button-prev swiper-button-prev-special_slide"></div>
	<div class="swiper-button-next swiper-button-next-special_slide"></div>
</section>
<section class="section main_product_list" data-ez-module="product-list/1" data-ez-layout="grid4" data-ez="contents-02uto24-1" data-ez-display="hidden" style="display: none;">
	<ez-prop data-version="1.0.0">
		<ez-var data-prop="layout" data-namespace="ez.module.product-list.layout" data-type="array">
			<ez-item data-id="grid3" data-name="일반3단형(PC 3열/MOBILE 1열)"></ez-item>
			<ez-item data-id="grid4" data-name="일반4단형(PC 4열/MOBILE 2열)"></ez-item>
			<ez-item data-id="grid5" data-name="일반5단형(PC 5열/MOBILE 2열)"></ez-item>
			<ez-item data-id="grid3 list_gallery" data-name="이미지강조3단형(PC 3열/MOBILE 1열)"></ez-item>
			<ez-item data-id="grid4 list_gallery" data-name="이미지강조4단형(PC 4열/MOBILE 2열)"></ez-item>
			<ez-item data-id="grid5 list_gallery" data-name="이미지강조5단형(PC 5열/MOBILE 2열)"></ez-item>
		</ez-var>
	</ez-prop>

	<div class="main_title ez-align-center" data-ez-role="ez-align" data-ez-align="center"><!-- 메인 새로운신상품 타이틀 수정하는곳 -->
		<div class="main_title_txt01" data-ez-role="title">NEW! ARRIVALS</div>
		<div class="main_title_txt02" data-ez-role="subtitle">언제나 새로운 신상품</div>
	</div><!-- //main_title -->

	<div data-ez-holder="product_listmain">
		<div class="xans-element- xans-product xans-product-listmain-1 xans-product-listmain xans-product-1 ec-base-product"><!--
				$count = 8
				$basket_result = /product/add_basket.html
				$basket_option = /product/basket_option.html
				$moreview = yes
				$cache = yes
			-->
<ul class="prdList grid4" data-ez-role="layout ez-discount-tag">
				<!--
※ 상품진열 공통소스
-->
<li id="anchorBoxId_16" class="xans-record-">
	<div class="prdList__item">
		<div class="thumbnail">
			<a href="/product/타투타티-템포러리-타투펜-i-am-지워지는-타투펜/16/category/1/display/2/?icid=MAIN.product_listmain_1"><img src="//www.tattootati.com/web/product/medium/202311/c5b00b01970e15b3fa3c5d8bb226eb5c.jpg" id="eListPrdImage16_2" alt="타투타티 템포러리 타투펜 I AM - 손목 위 작은 다짐을 기록하는 지워지는 타투펜 제품 이미지" loading="lazy"></a>
			<div class="likeButton displaynone"><button type="button"> <strong></strong></button></div>
			<div class="badge"><span></span></div>
			<div class="icon__box">
				<span class="wish"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_wish_before.png"  class="icon_img ec-product-listwishicon" alt="관심상품 등록 전" productno="16" categoryno="1" icon_status="off" login_status="F" individual-set="F" />WISH</span>
				<span class="cart"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_list_cart.gif"  onClick="category_add_basket('16','1', '2', 'A0000', false, '1', 'P000000Q', 'A', 'F', '0');" alt="장바구니 담기" class="ec-admin-icon cart" />ADD</span>
				<span class="option">OPTION</span>
			</div>
		</div>
		<div class="description" ec-data-custom="" ec-data-price="19900">
			<div class="name"><a href="/product/타투타티-템포러리-타투펜-i-am-지워지는-타투펜/16/category/1/display/2/?icid=MAIN.product_listmain_1" class=""><span class="title displaynone"><span class="" style="font-size:12px;color:#555555;">상품명</span> :</span> <span class="" style="font-size:12px;color:#555555;">타투타티 템포러리 타투펜 I AM (지워지는 타투펜)</span></a></div>
			<ul class="xans-element- xans-product xans-product-listitem-1 xans-product-listitem xans-product-1 spec"><li class=" xans-record-">
					<strong class="title displaynone"><span class="" style="font-size:12px;color:#555555;font-weight:bold;">판매가</span> :</strong> <span class="" style="font-size:12px;color:#555555;font-weight:bold;">19,900원</span><span id="span_product_tax_type_text" style=""> </span>				</li>
<li class=" xans-record-">
					<strong class="title "><span class="" style="font-size:12px;color:#555555;">배송비</span> :</strong> <span class="" style="font-size:12px;color:#555555;">3,000원</span>				</li>
<li class=" xans-record-">
					<strong class="title "><span class="" style="font-size:12px;color:#555555;">사용후기</span> :</strong> <span class="" style="font-size:12px;color:#555555;">0</span>				</li>
</ul>
			<div class="icon">       </div>
		</div>
	</div>
</li>
<li id="anchorBoxId_18" class="xans-record-">
	<div class="prdList__item">
		<div class="thumbnail">
			<a href="/product/클리오-구달-넘버즈인-마녀공장-플래시세일-최대-74/18/category/1/display/2/?icid=MAIN.product_listmain_1"><img src="//www.tattootati.com/web/product/medium/202603/d00a779ba5bbdc412df3166b6730bd61.png" id="eListPrdImage18_2" alt="클리오 구달 넘버즈인 마녀공장 플래시세일 - 인기 브랜드 뷰티 제품 큐레이션 이미지" loading="lazy"></a>
			<div class="likeButton displaynone"><button type="button"> <strong></strong></button></div>
			<div class="badge"><span></span></div>
			<div class="icon__box">
				<span class="wish"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_wish_before.png"  class="icon_img ec-product-listwishicon" alt="관심상품 등록 전" productno="18" categoryno="1" icon_status="off" login_status="F" individual-set="F" />WISH</span>
				<span class="cart"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_list_cart.gif"  onClick="CAPP_SHOP_NEW_PRODUCT_OPTIONSELECT.selectOptionCommon(18,  1, 'basket', '')" alt="장바구니 담기" class="ec-admin-icon cart" />ADD</span>
				<span class="option">OPTION</span>
			</div>
		</div>
		<div class="description" ec-data-custom="" ec-data-price="5000">
			<div class="name"><a href="/product/클리오-구달-넘버즈인-마녀공장-플래시세일-최대-74/18/category/1/display/2/?icid=MAIN.product_listmain_1" class=""><span class="title displaynone"><span class="" style="font-size:12px;color:#555555;">상품명</span> :</span> <span class="" style="font-size:12px;color:#555555;">클리오 / 구달/ 넘버즈인 / 마녀공장 플래시세일 최대 74%</span></a></div>
			<ul class="xans-element- xans-product xans-product-listitem-1 xans-product-listitem xans-product-1 spec"><li class=" xans-record-">
					<strong class="title displaynone"><span class="" style="font-size:12px;color:#555555;font-weight:bold;">판매가</span> :</strong> <span class="" style="font-size:12px;color:#555555;font-weight:bold;">5,000원</span><span id="span_product_tax_type_text" style=""> </span>				</li>
<li class=" xans-record-">
					<strong class="title "><span class="" style="font-size:12px;color:#555555;">배송비</span> :</strong> <span class="" style="font-size:12px;color:#555555;">3,000원</span>				</li>
<li class=" xans-record-">
					<strong class="title "><span class="" style="font-size:12px;color:#555555;">사용후기</span> :</strong> <span class="" style="font-size:12px;color:#555555;">0</span>				</li>
</ul>
			<div class="icon">       </div>
		</div>
	</div>
</li>
<li id="anchorBoxId_14" class="xans-record-">
	<div class="prdList__item">
		<div class="thumbnail">
			<a href="/product/타투타티-템포러리-타투펜-i-am-11/14/category/1/display/2/?icid=MAIN.product_listmain_1"><img src="//www.tattootati.com/web/product/medium/202311/7b42d81ab1fca0dd21b29aae4ececa0e.jpg" id="eListPrdImage14_2" alt="타투타티 템포러리 타투펜 I AM 1+1 - 스스로를 탐색하고 기록하는 타투펜 제품 이미지" loading="lazy"></a>
			<div class="likeButton displaynone"><button type="button"> <strong></strong></button></div>
			<div class="badge"><span></span></div>
			<div class="icon__box">
				<span class="wish"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_wish_before.png"  class="icon_img ec-product-listwishicon" alt="관심상품 등록 전" productno="14" categoryno="1" icon_status="off" login_status="F" individual-set="F" />WISH</span>
				<span class="cart"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_list_cart.gif"  onClick="category_add_basket('14','1', '2', 'A0000', false, '1', 'P000000O', 'A', 'F', '0');" alt="장바구니 담기" class="ec-admin-icon cart" />ADD</span>
				<span class="option">OPTION</span>
			</div>
		</div>
		<div class="description" ec-data-custom="" ec-data-price="34900">
			<div class="name"><a href="/product/타투타티-템포러리-타투펜-i-am-11/14/category/1/display/2/?icid=MAIN.product_listmain_1" class=""><span class="title displaynone"><span class="" style="font-size:12px;color:#555555;">상품명</span> :</span> <span class="" style="font-size:12px;color:#555555;">타투타티 템포러리 타투펜 I AM 1+1</span></a></div>
			<ul class="xans-element- xans-product xans-product-listitem-1 xans-product-listitem xans-product-1 spec"><li class=" xans-record-">
					<strong class="title displaynone"><span class="" style="font-size:12px;color:#555555;font-weight:bold;">판매가</span> :</strong> <span class="" style="font-size:12px;color:#555555;font-weight:bold;">34,900원</span><span id="span_product_tax_type_text" style=""> </span>				</li>
<li class=" xans-record-">
					<strong class="title "><span class="" style="font-size:12px;color:#555555;">배송비</span> :</strong> <span class="" style="font-size:12px;color:#555555;">3,000원</span>				</li>
<li class=" xans-record-">
					<strong class="title "><span class="" style="font-size:12px;color:#555555;">사용후기</span> :</strong> <span class="" style="font-size:12px;color:#555555;">2</span>				</li>
</ul>
			<div class="icon">       </div>
		</div>
	</div>
</li>
<li id="anchorBoxId_19" class="xans-record-">
	<div class="prdList__item">
		<div class="thumbnail">
			<a href="/product/나-사용-설명서-원데이-타투펜-14일-챌린지-워크북/19/category/1/display/2/?icid=MAIN.product_listmain_1"><img src="//www.tattootati.com/web/product/medium/202509/351ae185e8d0a6c86c1075826f4ff900.jpg" id="eListPrdImage19_2" alt="나 사용 설명서 원데이 타투펜과 14일 챌린지 워크북 세트 구성 이미지" loading="lazy"></a>
			<div class="likeButton displaynone"><button type="button"> <strong></strong></button></div>
			<div class="badge"><span></span></div>
			<div class="icon__box">
				<span class="wish"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_wish_before.png"  class="icon_img ec-product-listwishicon" alt="관심상품 등록 전" productno="19" categoryno="1" icon_status="off" login_status="F" individual-set="F" />WISH</span>
				<span class="cart"><img src="//img.echosting.cafe24.com/design/skin/admin/ko_KR/btn_list_cart.gif"  onClick="CAPP_SHOP_NEW_PRODUCT_OPTIONSELECT.selectOptionCommon(19,  1, 'basket', '')" alt="장바구니 담기" class="ec-admin-icon cart" />ADD</span>
				<span class="option">OPTION</span>
			</div>
		</div>
		<div class="description" ec-data-custom="45000" ec-data-price="29800">
			<div class="name"><a href="/product/나-사용-설명서-원데이-타투펜-14일-챌린지-워크북/19/category/1/display/2/?icid=MAIN.product_listmain_1" class=""><span class="title displaynone"><span class="" style="font-size:12px;color:#555555;">상품명</span> :</span> <span class="" style="font-size:12px;color:#555555;">「나 사용 설명서」 (원데이 타투펜 + 14일 챌린지 워크북)</span></a></div>
			<ul class="xans-element- xans-product xans-product-listitem-1 xans-product-listitem xans-product-1 spec"><li class=" xans-record-">
					<strong class="title displaynone"><span class="" style="font-size:12px;color:#555555;">소비자가</span> :</strong> <span class="" style="font-size:12px;color:#555555;text-decoration:line-through;">45,000원</span>				</li>
<li class=" xans-record-">
					<strong class="title displaynone"><span class="" style="font-size:12px;color:#555555;font-weight:bold;">판매가</span> :</strong> <span class="" style="font-size:12px;color:#555555;font-weight:bold;">29,800원</span><span id="span_product_tax_type_text" style=""> </span>				</li>
<li class=" xans-record-">
					<strong class="title "><span class="" style="font-size:12px;color:#555555;">배송비</span> :</strong> <span class="" style="font-size:12px;color:#555555;">무료</span>				</li>
<li class=" xans-record-">
					<strong class="title "><span class="" style="font-size:12px;color:#555555;">사용후기</span> :</strong> <span class="" style="font-size:12px;color:#555555;">0</span>				</li>
</ul>
			<div class="icon">       </div>
		</div>
	</div>
</li>
			</ul>
</div>
			</div>
</section>
<section class="section main_map ez-align-left" data-ez-module="map/1" data-ez-align="left" data-ez="contents-10zg2kh-1" data-ez-display="hidden" style="display: none;">
	<ez-prop data-version="1.0.0">
		<ez-var data-prop="image" data-namespace="ez.module.map.image">
			<ez-item data-id="size" data-pc="650 480" data-mobile="650 480"></ez-item>
		</ez-var>
	</ez-prop>
	<div class="main_map_banner"><!-- 메인 지도 -->
		<div class="main_map_banner_txt_box">
			<div class="main_map_banner_txt">
				<div class="main_map_banner_txt01" data-ez-role="title" style="font-weight: bold; color: rgb(58, 58, 58);">OUUI 오프라인 스토어</div>
				<div class="main_map_banner_txt02" data-ez-role="desc" style="color: rgb(138, 138, 138);">
					<p>매장에서는 고객 여러분을 따뜻하게 맞이하고</p>
					<p>기프트 구매를 위한 맞춤형 컨설팅을 제공해드립니다.<br><br></p>
					<p><span style="color: rgb(0, 0, 0);">운영시간 : 평일 09:00-18:00</span></p>
					<p><span style="color: rgb(0, 0, 0);">서울특별시 동작구 보라매로0길 00</span></p>
				</div><!-- //main_map_banner_txt02 -->
				<div class="main_long_banner_link"><span class="displaynone" data-ez-role="address">서울특별시 동작구 보라매로0길 00</span><a data-ez-role="a" href="https://www.google.com/maps/dir/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EB%8F%99%EC%9E%91%EA%B5%AC%20%EB%B3%B4%EB%9D%BC%EB%A7%A4%EB%A1%9C0%EA%B8%B8%2000" target="_blank">VIEW MORE<i aria-hidden="true" class="icon icoPlus">+</i></a></div>
			</div><!-- //main_map_banner_txt -->
		</div><!-- //main_long_banner_txt -->
		<picture>
			<source srcset="/SkinImg/img/main_map_pc.jpg" media="(max-width: 1024px)" data-ez-role="img-pc">
			<img src="/SkinImg/img/main_map_pc.jpg" data-ez-role="img-mobile" loading="lazy">
		 </source></picture>
	</div><!-- //main_map_banner -->
</section>
<section class="section" data-ez-module="html/1" data-ez-name="CUSTOM HTML" data-ez-type="plain" data-ez="contents-0ndl15b-1" data-ez-display="hidden" style="display: none;">
</section>

<!--#ez="1/4"-->
			</div>
		</div>
<div class="bottom-nav RMB RTB" data-ez="contents-0anj0sn-1" ez-module="bottom-navigation">
<ul class="bottom-nav__tabBar">
<li><button class="btnNav eNavFold" type="button"><i aria-hidden="true" class="icon icoNav"></i>네비게이션</button></li>
<li><button class="btnSearch eSearch" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewbox="0 0 24 24" class="icon" role="img">
    <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 19c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"></path>
    <path stroke="#000" stroke-linejoin="round" stroke-width="1.5" d="M22 22l-5-5"></path>
</svg>검색</button></li>
<li><a href="/"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewbox="0 0 24 24" class="icon" role="img">
    <path stroke="#000" stroke-width="1.5" d="M12 3L2 11.36V22h7.692v-7.6h4.616V22H22V11.36L12 3z"></path>
</svg>홈</a></li>
<li class="xans-element- xans-layout xans-layout-statelogoff "><a href="/order/basket.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewbox="0 0 24 24" class="icon" role="img">
    <path fill="#000" d="M23.073 22.253l-1.946-14.31c-.04-.38-.368-.667-.758-.667h-3.656v-1.74c0-2.543-2.115-4.613-4.713-4.613-2.599 0-4.713 2.07-4.713 4.613v1.74H3.63c-.39 0-.717.288-.758.667L.927 22.253c-.022.21.047.42.192.577.144.157.35.247.566.247h20.63c.216 0 .421-.09.566-.247.145-.157.214-.366.192-.576zM8.81 5.537c0-1.72 1.431-3.122 3.19-3.122 1.758 0 3.19 1.401 3.19 3.122v1.74H8.81v-1.74zm-6.28 16.05l1.786-12.82h2.97v1.644c0 .412.342.746.762.746.421 0 .762-.334.762-.746V8.767h6.38v1.643c0 .412.34.746.761.746.42 0 .762-.334.762-.746V8.767h2.97l1.786 12.819H2.53z"></path>
</svg>Cart <span class="count displaynone EC-Layout_Basket-count-display"><span class="EC-Layout-Basket-count"></span></span></a>
</li>
<li><a href="/myshop/index.html"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewbox="0 0 24 24" class="icon" role="img">
    <circle cx="11.5" cy="6.5" r="3.75" stroke="#000" stroke-width="1.5"></circle>
    <path stroke="#000" stroke-width="1.5" d="M1.78 21.25c.382-4.758 4.364-8.5 9.22-8.5h1c4.856 0 8.838 3.742 9.22 8.5H1.78z"></path>
</svg>
마이쇼핑</a></li>
</ul>
<div class="bottom-nav__top">
<a href="#wrap" title="화면 최상단으로 이동하기"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="20" fill="#1a1a1a" viewbox="0 0 14 20" class="icon" role="img">
<path d="M3,8.4C2.3,9,1.2,9,0.5,8.3c-0.6-0.7-0.6-1.7,0-2.4l5.3-5.2C6.5,0,7.6,0,8.3,0.7l5.2,5.1c0.7,0.7,0.7,1.8,0,2.5
	c-0.7,0.7-1.8,0.7-2.4,0L8.8,6.1l0,12.1c0,2.3-3.6,2.3-3.6,0l0-12L3,8.4z"></path>
</svg></a>
</div>
</div>
<div class="footer_margin" data-ez="module-00zenhe-1" data-ez-module="user-defined/1" data-ez-name="USER DEFINED" data-ez-type="plain"></div>
<footer class="layout1" data-ez="contents-1s32g35-1" data-ez-layout="layout1" id="footer">
<ez-prop data-version="1.0.0">
<ez-var data-namespace="ez.layout.footer.layout" data-prop="layout" data-type="array">
<ez-item data-id="layout1" data-name="기본형"></ez-item>
<ez-item data-id="layout2" data-name="좌우반전형"></ez-item>
<ez-item data-id="layout3" data-name="중앙형"></ez-item>
</ez-var>
</ez-prop>
<div class="xans-element- xans-layout xans-layout-footer inner "><div class="xans-element- xans-layout xans-layout-logobottom bt_logo "><a href="/"><img alt="TATTOO TATi" src="/web/upload/category/logo/v2_accb1551c7d255107b02de2eb5dee6c9_DPZ8JDPMfD_bottom.jpg"></a>
</div>
<!-- //bt_logo -->
<div class="bt_util" data-ez-group="shortcut">
<div data-ez-role="title" style="display:none;">바로가기</div>
<ul data-ez-role="list">
<li data-ez-item="company"><a href="/shopinfo/company.html">회사소개</a></li>
<li data-ez-item="agreement"><a href="/member/mall_agreement.html">이용약관</a></li>
<li data-ez-item="privacy"><a href="/member/privacy.html"><strong>개인정보처리방침</strong></a></li>
<li data-ez-item="guide"><a href="/shopinfo/guide.html">이용안내</a></li>
<li data-ez-item="faq"><a href="/board/board/3">자주묻는질문(FAQ)</a></li>
</ul>
</div>
<!-- //bt_util -->
<div class="bt_wrap">
<div class="bt_info" data-ez-group="info">
<div class="title" data-ez-role="title">쇼핑몰 기본정보</div>
<div class="bt_info_list" data-ez-role="list">
<div data-ez-item="company_name">
<span data-ez-role="field">상호명</span> <span data-ez-role="value">TWO COMMA B</span>
</div>
<div data-ez-item="president_name">
<span data-ez-role="field">대표자명</span> <span data-ez-role="value">JUYEON PARK</span>
</div>
<div data-ez-item="address">
<span data-ez-role="field">사업장 주소</span> <span data-ez-role="value">13535 3F, 19-15, Dongpangyo-ro 52beon-gil, Bundang-gu, Seongnam-si, Gyeonggi-do, Republic of Korea </span>
</div>
<div data-ez-item="phone">
<span data-ez-role="field">대표 전화</span> <span data-ez-role="value">010-5959-8401</span>
</div>
<div data-ez-item="company_regno">
<span data-ez-role="field">사업자 등록번호</span> <span data-ez-role="value">542-45-00373</span>
</div>
<div data-ez-item="network_regno">
<span data-ez-role="field">통신판매업 신고번호</span> <span data-ez-role="value">2021-성남분당씨-0248 <a href="#none" onclick="window.open('http://www.ftc.go.kr/bizCommPop.do?wrkr_no=5424500373', 'bizCommPop', 'width=750, height=950;');return false;">[사업자정보확인]</a></span>
</div>
<div data-ez-item="cpo_name">
<span data-ez-role="field">개인정보보호책임자</span> <span data-ez-role="value">JONGIL KIM</span>
</div>
</div>
<!-- //bt_info_list -->
</div>
<!-- //bt_info -->
<div data-ez-group="cs" class="xans-element- xans-layout xans-layout-info bt_cscenter "><div class="title" data-ez-role="title">고객센터 정보</div>
<div data-ez-role="list">
<div class="bt_txt01" data-ez-item="phone">
<strong>상담/주문 전화</strong><span class="pdr10"></span><span data-ez-role="value">010-5959-8401</span>
</div>
<div class="bt_txt02" data-ez-item="email">
<strong>상담/주문 이메일</strong><span data-ez-role="value">connect@twocommab.com</span>
</div>
<div class="bt_txt02" data-ez-item="runtime">
<strong>CS운영시간</strong><span data-ez-role="value">평일 : 9:00~ 15:00(토, 일, 공휴일 휴무)</span>
</div>
</div>
</div>
<!-- //bt_cscenter -->
<div class="bt_bank" data-ez-group="bank">
<div class="title" data-ez-role="title">결제정보</div>
<div class="title_sub"><strong>무통장 계좌정보</strong></div>
<div class="bt_txt02">
<ul data-ez-role="list"><li data-ez-role="item">
<span data-ez-role="bank_name">신한은행</span> <span class="pdr10"></span>
<span data-ez-role="account_number">110-531-968360</span><span class="pdr10"></span>
<span data-ez-role="account_name">투콤마비</span>
</li></ul>
</div>
<!-- //bt_txt02 -->
</div>
<!-- //bt_bank -->
</div>
<!-- //bt_wrap -->
<div class="bt_escrow" data-ez-escrow="" style="display:none;">
<!-- 구매안전서비스 배너 -->
<a data-ez-link="#link" href="#">
<img alt="올앳" class="bt_ew_allat" data-ez-escrow-id="allat" src="/SkinImg/img/bt_ew_allat.png">
 <img alt="이니시스" class="bt_ew_iniapy" data-ez-escrow-id="inicis" src="/SkinImg/img/bt_ew_iniapy.png">
 <img alt="NHN한국사이버결제" class="bt_ew_kcp" data-ez-escrow-id="kcp" src="/SkinImg/img/bt_ew_kcp.png">
 <img alt="한국정보통신" class="bt_ew_kicc" data-ez-escrow-id="kicc" src="/SkinImg/img/bt_ew_kicc.png">
 <img alt="케이에스넷" class="bt_ew_ksnet" data-ez-escrow-id="ksnet" src="/SkinImg/img/bt_ew_ksnet.png">
 <img alt="나이스페이먼츠" class="bt_ew_nice" data-ez-escrow-id="nicepay" src="/SkinImg/img/bt_ew_nice.png">
 <img alt="토스페이먼츠" class="bt_ew_payments" data-ez-escrow-id="dacom" src="/SkinImg/img/bt_ew_payments.png">
 <img alt="세틀뱅크" class="bt_ew_settle" data-ez-escrow-id="settlebank" src="/SkinImg/img/bt_ew_settle.png">
 <img alt="스마트로" class="bt_ew_smartro" data-ez-escrow-id="smartro" src="/SkinImg/img/bt_ew_smartro.png">
 <span>고객님은 안전거래를 위해 결제시 저희 쇼핑몰에서 가입한 구매안전 서비스를 이용하실 수 있습니다. [서비스가입정보확인]</span>
</a>
</div>
<!-- //bt_escrow -->
<div class="bt_wrap2">
<div class="bt_copyright">
				Copyright © TATTOO TATi. All Rights Reserved. Hosting by Cafe24 Corp.
			</div>
<!-- //bt_copyright -->
<div class="bt_sns" data-ez-group="sns" data-ez-role="list">
<div class="title" data-ez-role="title">SNS</div>
<a data-ez-item="instagram" href="https://instagram.com/tattootati_archive" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewbox="0 0 20 20" class="icon" role="img">
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
instagram</a>
<a data-ez-item="youtube" href="https://youtube.com/" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="28.94" height="20.52" fill="none" viewbox="0 0 28.94 20.52" class="icon" role="img">
	<g>
		<path class="cls-1" d="M28.5,3.74C28,1.52,26.91.68,25,.37,23.92.21,18.65,0,14.47,0S5,.21,3.93.37C2,.68,1,1.53.44,3.74A54.4,54.4,0,0,0,0,10.09v.34a54.76,54.76,0,0,0,.44,6.36C1,19,2,19.85,3.93,20.15c1.1.16,6.37.37,10.55.37h0c4.19,0,9.45-.21,10.55-.37,1.9-.3,2.94-1.16,3.49-3.36a54.76,54.76,0,0,0,.44-6.36v-.34A54.4,54.4,0,0,0,28.5,3.74ZM11,14V6.55l6.94,3.62Z"></path>
	</g>
</svg>
youtube</a>
<a data-ez-item="facebook" href="https://facebook.com/" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="21.18" fill="none" viewbox="0 0 11 21.18" class="icon" role="img">
	<path d="M7.14,21.18v-9.65h3.25l0.48-3.77H7.14v-2.4c0-1.09,0.31-1.83,1.87-1.83h2V0.15C10.04,0.05,9.065,0,8.09,0C5.22,0,3.25,1.76,3.25,5v2.76H0v3.76h3.24v9.66H7.14z"></path>
</svg>
facebook</a>
<a data-ez-item="kakao" href="https://pf.kakao.com/" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" fill="none" viewbox="0 0 23 20" class="icon" role="img">
	<g>
		<path class="cls-1" d="M9.19,7.31,8.42,9.39H10L9.22,7.31Z"></path>
		<path class="cls-1" d="M11.5,0C5.15,0,0,3.85,0,8.61c0,3.09,2.18,5.8,5.46,7.32-.24.85-.87,3.07-1,3.55s.23.59.48.43l4.43-2.85a15.15,15.15,0,0,0,2.13.15c6.35,0,11.5-3.85,11.5-8.6S17.85,0,11.5,0ZM5.84,11a.55.55,0,0,1-.56.53H5.16A.55.55,0,0,1,4.61,11V7.15H3.51a.54.54,0,1,1,0-1.08H6.87a.54.54,0,1,1,0,1.08h-1Zm5.51.5a.57.57,0,0,1-.71-.33l-.29-.76H8.06l-.29.77a.56.56,0,0,1-.71.32.52.52,0,0,1-.34-.67L8.37,6.61l0-.07A.78.78,0,0,1,9.22,6a.84.84,0,0,1,.79.45h0l1.68,4.34a.53.53,0,0,1-.34.67Zm3.61,0H12.67a.5.5,0,0,1-.52-.49h0a.38.38,0,0,1,0-.1s0-.06,0-.09V6.58A.62.62,0,0,1,12.77,6a.61.61,0,0,1,.62.59h0v3.9H15a.5.5,0,0,1,.5.5.51.51,0,0,1-.5.48Zm4.88-.07a.57.57,0,0,1-.77-.1l-1.65-2-.36.33v1.34a.6.6,0,0,1-.6.6.6.6,0,0,1-.64-.56V6.58a.62.62,0,0,1,1.24,0V8.11l2-1.84a.56.56,0,0,1,.78,0,.5.5,0,0,1,0,.73L18.21,8.49,20,10.66A.49.49,0,0,1,19.84,11.39Z"></path>
	</g>
</svg>
kakao</a>
<a data-ez-item="twitter" href="https://twitter.com/" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="22.46" height="18.25" fill="none" viewbox="0 0 22.46 18.25" class="icon" role="img">
<path d="M22.43,2.14c-0.838,0.377-1.728,0.623-2.64,0.73c0.955-0.578,1.666-1.485,2-2.55
	c-0.901,0.546-1.889,0.934-2.92,1.15c-1.725-1.872-4.642-1.991-6.514-0.266C11.41,2.076,10.871,3.303,10.87,4.59
	c0.008,0.336,0.048,0.671,0.12,1c-3.708-0.183-7.162-1.936-9.5-4.82c-1.243,2.126-0.601,4.853,1.46,6.2
	c-0.731-0.033-1.444-0.238-2.08-0.6v0.06c0.004,2.194,1.55,4.083,3.7,4.52c-0.394,0.108-0.801,0.162-1.21,0.16
	c-0.292-0.002-0.583-0.029-0.87-0.08c0.609,1.876,2.338,3.16,4.31,3.2c-1.625,1.289-3.636,1.993-5.71,2
	c-0.364,0-0.728-0.02-1.09-0.06c6.088,3.899,14.184,2.125,18.083-3.963c1.346-2.101,2.063-4.542,2.067-7.037V4.53
	c0.909-0.657,1.692-1.474,2.31-2.41"></path>
</svg>
twitter</a>
<a data-ez-item="blog" href="https://blog.naver.com/" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" fill="none" viewbox="0 0 23 20" class="icon" role="img">
	<g>
		<path d="M14.33,15.82,12,15.67v-.06l-.48,0-.5,0v.06l-2.33.15,2.22,3.76.06.09a.62.62,0,0,0,.84.24.59.59,0,0,0,.23-.24.24.24,0,0,0,.06-.09Z"></path>
		<path d="M12.86,7.88a.94.94,0,1,0,.9.93A.92.92,0,0,0,12.86,7.88Z"></path>
		<path d="M18.28,7.88a.94.94,0,1,0,.9.93h0A.9.9,0,0,0,18.28,7.88Z"></path>
		<path d="M19.37,0H3.62A3.7,3.7,0,0,0,0,3.77V12.7a3.7,3.7,0,0,0,3.63,3.76H19.36A3.7,3.7,0,0,0,23,12.7V3.77h0A3.7,3.7,0,0,0,19.37,0ZM7.08,8.76a2.1,2.1,0,0,1-2,2.26,1.33,1.33,0,0,1-1.18-.62v.47H2.5V4.81H3.91V7.12a1.79,1.79,0,0,1,1.2-.57C7,6.55,7.09,8.76,7.08,8.76ZM9.54,7v3.92H8.18V7.29c0-1.24-.64-1.21-.64-1.21V4.68C9.6,4.68,9.54,7,9.54,7Zm5.7,1.86C15.24,11,12.86,11,12.86,11a2.15,2.15,0,0,1-2.33-2.21,2.26,2.26,0,0,1,2.33-2.24A2.18,2.18,0,0,1,15.24,8.81Zm5.25,2a2.07,2.07,0,0,1-2.06,2.27h-.54V11.8h.34c1,0,.89-1.06.89-1.06V10.4a1.54,1.54,0,0,1-1.23.55C15.93,11,16,8.8,16,8.8a2,2,0,0,1,2-2.23,1.46,1.46,0,0,1,1.18.55V6.71h1.37Z"></path>
		<path d="M4.8,7.88a.94.94,0,1,0,.9.93A.92.92,0,0,0,4.8,7.88Z"></path>
	</g>
</svg>
blog</a>
</div>
<!-- //bt_sns -->
</div>
<!-- //bt_wrap2 -->
</div>
<!-- //inner -->
</footer>
<form id="searchBarForm" name="" action="/product/search.html" method="get" target="_self" enctype="multipart/form-data" >
<input id="banner_action" name="banner_action" value="" type="hidden"  /><div data-ez="contents-1qu8rq1-1" class="xans-element- xans-layout xans-layout-searchheader "><!--
		$product_page=/product/detail.html
		$category_page=/product/list.html
	-->
<div class="title">SEARCH</div>
<fieldset>
<legend>검색</legend>
		<input id="keyword" name="keyword" fw-filter="" fw-label="검색어" fw-msg="" class="inputTypeText" placeholder="" onmousedown="SEARCH_BANNER.clickSearchForm(this)" value="" type="text"  /><button class="btnDelete" type="button">삭제</button><button class="btnSearch" onclick="SEARCH_BANNER.submitSearchBanner(this); return false;" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewbox="0 0 24 24" class="icon" role="img">
    <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 19c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"></path>
    <path stroke="#000" stroke-linejoin="round" stroke-width="1.5" d="M22 22l-5-5"></path>
</svg> 검색</button><ul class="autoDrop" id=""></ul>
</fieldset>
<button class="btnClose" type="button"><i aria-hidden="true" class="icon icoClose"></i>닫기</button>
</div>
</form><!--#ez="1/4"-->
<!--#ez="1/15"-->
</div><!-- //wrap -->

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

	<div class="xans-element- xans-layout xans-layout-multishopshipping "><div class="worldshipLayer ec-base-layer typeModal">
			<div class="header">
				<h3>WORLD SHIPPING</h3>
			</div>
			<div class="content">
				<p class="desc">PLEASE SELECT THE DESTINATION COUNTRY AND LANGUAGE :</p>
				<select class="xans-element- xans-layout xans-layout-multishopshippingcountrylist"><option value="GH"  class="xans-record-">SHIPPING TO : 가나(GHANA)</option>
<option value="GA"  class="xans-record-">SHIPPING TO : 가봉(GABON)</option>
<option value="GY"  class="xans-record-">SHIPPING TO : 가이아나(GUYANA)</option>
<option value="GM"  class="xans-record-">SHIPPING TO : 감비아(GAMBIA)</option>
<option value="GT"  class="xans-record-">SHIPPING TO : 과테말라(GUATEMALA)</option>
<option value="GD"  class="xans-record-">SHIPPING TO : 그레나다(GRENADA)</option>
<option value="GE"  class="xans-record-">SHIPPING TO : 그루지야(GEORGIA)</option>
<option value="GR"  class="xans-record-">SHIPPING TO : 그리스(GREECE)</option>
<option value="GN"  class="xans-record-">SHIPPING TO : 기니(GUINEA)</option>
<option value="GW"  class="xans-record-">SHIPPING TO : 기니비소(GUINEA-BISSAU)</option>
<option value="NA"  class="xans-record-">SHIPPING TO : 나미비아(NAMIBIA)</option>
<option value="NG"  class="xans-record-">SHIPPING TO : 나이지리아(NIGERIA)</option>
<option value="ZA"  class="xans-record-">SHIPPING TO : 남아프리카공화국(SOUTH AFRICA)</option>
<option value="AN"  class="xans-record-">SHIPPING TO : 네덜란드(네덜란드령앤틸리스)(NETHERLANDS(ANTILLES))</option>
<option value="NL"  class="xans-record-">SHIPPING TO : 네덜란드(네델란드)(NETHERLANDS)</option>
<option value="AW"  class="xans-record-">SHIPPING TO : 네덜란드(아루바섬)(ARUBA)</option>
<option value="NP"  class="xans-record-">SHIPPING TO : 네팔(NEPAL)</option>
<option value="NO"  class="xans-record-">SHIPPING TO : 노르웨이(NORWAY)</option>
<option value="NZ"  class="xans-record-">SHIPPING TO : 뉴질란드(NEW ZEALAND)</option>
<option value="NE"  class="xans-record-">SHIPPING TO : 니제르(NIGER)</option>
<option value="NI"  class="xans-record-">SHIPPING TO : 니카라과(NICARAGUA)</option>
<option value="KR"  class="xans-record-">SHIPPING TO : 대한민국(KOREA (REP OF,))</option>
<option value="DK"  class="xans-record-">SHIPPING TO : 덴마크(DENMARK)</option>
<option value="GL"  class="xans-record-">SHIPPING TO : 덴마크(그린란드)(GREENLAND)</option>
<option value="FO"  class="xans-record-">SHIPPING TO : 덴마크(페로즈제도)(FAROE ISLANDS)</option>
<option value="DO"  class="xans-record-">SHIPPING TO : 도미니카공화국(DOMINICAN REPUBLIC)</option>
<option value="DM"  class="xans-record-">SHIPPING TO : 도미니카연방(DOMINICA)</option>
<option value="DE"  class="xans-record-">SHIPPING TO : 독일(GERMANY)</option>
<option value="TL"  class="xans-record-">SHIPPING TO : 동티모르(TIMOR-LESTE)</option>
<option value="LA"  class="xans-record-">SHIPPING TO : 라오스(LAO PEOPLE'S DEM REP)</option>
<option value="LR"  class="xans-record-">SHIPPING TO : 라이베리아(LIBERIA)</option>
<option value="LV"  class="xans-record-">SHIPPING TO : 라트비아(LATVIA)</option>
<option value="RU"  class="xans-record-">SHIPPING TO : 러시아(RUSSIAN FEDERATION)</option>
<option value="LB"  class="xans-record-">SHIPPING TO : 레바논(LEBANON)</option>
<option value="LS"  class="xans-record-">SHIPPING TO : 레소토(LESOTHO)</option>
<option value="RO"  class="xans-record-">SHIPPING TO : 루마니아(ROMANIA)</option>
<option value="LU"  class="xans-record-">SHIPPING TO : 룩셈부르크(LUXEMBOURG)</option>
<option value="RW"  class="xans-record-">SHIPPING TO : 르완다(RWANDA)</option>
<option value="LY"  class="xans-record-">SHIPPING TO : 리비아(LIBYAN ARAB JAMAHIRIYA)</option>
<option value="LI"  class="xans-record-">SHIPPING TO : 리첸쉬테인(LIECHTENSTEIN)</option>
<option value="LT"  class="xans-record-">SHIPPING TO : 리투아니아(LITHUANIA)</option>
<option value="MG"  class="xans-record-">SHIPPING TO : 마다가스카르(MADAGASCAR)</option>
<option value="MK"  class="xans-record-">SHIPPING TO : 마케도니아(MACEDONIA)</option>
<option value="MW"  class="xans-record-">SHIPPING TO : 말라위(MALAWI)</option>
<option value="MY"  class="xans-record-">SHIPPING TO : 말레이지아(MALAYSIA)</option>
<option value="ML"  class="xans-record-">SHIPPING TO : 말리(MALI)</option>
<option value="MX"  class="xans-record-">SHIPPING TO : 멕시코(MEXICO)</option>
<option value="MC"  class="xans-record-">SHIPPING TO : 모나코(MONACO)</option>
<option value="MA"  class="xans-record-">SHIPPING TO : 모로코(MOROCCO)</option>
<option value="MU"  class="xans-record-">SHIPPING TO : 모리셔스(MAURITIUS)</option>
<option value="MR"  class="xans-record-">SHIPPING TO : 모리타니(MAURITANIA)</option>
<option value="MZ"  class="xans-record-">SHIPPING TO : 모잠비크(MOZAMBIQUE)</option>
<option value="ME"  class="xans-record-">SHIPPING TO : 몬테네그로(MONTENEGRO)</option>
<option value="MD"  class="xans-record-">SHIPPING TO : 몰도바(MOLDOVA, REPUBLIC OF)</option>
<option value="MV"  class="xans-record-">SHIPPING TO : 몰디브(MALDIVES)</option>
<option value="MT"  class="xans-record-">SHIPPING TO : 몰타(MALTA)</option>
<option value="MN"  class="xans-record-">SHIPPING TO : 몽골(MONGOLIA)</option>
<option value="US"  selected="selected" class="xans-record-">SHIPPING TO : 미국(U.S.A)</option>
<option value="GU"  class="xans-record-">SHIPPING TO : 미국(괌)(GUAM)</option>
<option value="MH"  class="xans-record-">SHIPPING TO : 미국(마아샬제도)(MARSHALL ISLANDS)</option>
<option value="VI"  class="xans-record-">SHIPPING TO : 미국(버진제도)(VIRGIN ISLANDS U.S.)</option>
<option value="WS"  class="xans-record-">SHIPPING TO : 미국(사모아, 구 서사모아)(SAMOA)</option>
<option value="AS"  class="xans-record-">SHIPPING TO : 미국(사모아제도)(AMERICAN SAMOA)</option>
<option value="MP"  class="xans-record-">SHIPPING TO : 미국(사이판)(NORTHERN MARIANA ISLANDS)</option>
<option value="PW"  class="xans-record-">SHIPPING TO : 미국(팔라우섬)(PALAU)</option>
<option value="PR"  class="xans-record-">SHIPPING TO : 미국(푸에르토리코섬)(PUERTO RICO)</option>
<option value="MM"  class="xans-record-">SHIPPING TO : 미얀마(MYANMAR)</option>
<option value="FM"  class="xans-record-">SHIPPING TO : 미크로네시아(마이크로네시아)(MICRONESIA)</option>
<option value="VU"  class="xans-record-">SHIPPING TO : 바누아투(VANUATU)</option>
<option value="BH"  class="xans-record-">SHIPPING TO : 바레인(BAHRAIN)</option>
<option value="BB"  class="xans-record-">SHIPPING TO : 바베이도스(BARBADOS)</option>
<option value="BS"  class="xans-record-">SHIPPING TO : 바하마(BAHAMAS)</option>
<option value="BD"  class="xans-record-">SHIPPING TO : 방글라데시(BANGLADESH)</option>
<option value="VE"  class="xans-record-">SHIPPING TO : 베네수엘라(VENEZUELA)</option>
<option value="BJ"  class="xans-record-">SHIPPING TO : 베넹(BENIN)</option>
<option value="VN"  class="xans-record-">SHIPPING TO : 베트남(VIET NAM)</option>
<option value="BE"  class="xans-record-">SHIPPING TO : 벨기에(BELGIUM)</option>
<option value="BY"  class="xans-record-">SHIPPING TO : 벨라루스(BELARUS)</option>
<option value="BZ"  class="xans-record-">SHIPPING TO : 벨리세(BELIZE)</option>
<option value="BA"  class="xans-record-">SHIPPING TO : 보스니아헤르체코비나(Bosnia and Herzegovina)</option>
<option value="BW"  class="xans-record-">SHIPPING TO : 보츠와나(BOTSWANA)</option>
<option value="BO"  class="xans-record-">SHIPPING TO : 볼리비아(BOLIVIA)</option>
<option value="BF"  class="xans-record-">SHIPPING TO : 부르키나파소(BURKINA FASO)</option>
<option value="BT"  class="xans-record-">SHIPPING TO : 부탄(BHUTAN)</option>
<option value="BG"  class="xans-record-">SHIPPING TO : 불가리아(BULGARIA(REP))</option>
<option value="BR"  class="xans-record-">SHIPPING TO : 브라질(BRAZIL)</option>
<option value="BN"  class="xans-record-">SHIPPING TO : 브루네이(나이)(BRUNEI DARUSSALAM)</option>
<option value="BI"  class="xans-record-">SHIPPING TO : 브룬디(BURUNDI)</option>
<option value="SA"  class="xans-record-">SHIPPING TO : 사우디아라비아(SAUDI ARABIA)</option>
<option value="CY"  class="xans-record-">SHIPPING TO : 사이프러스(CYPRUS)</option>
<option value="SM"  class="xans-record-">SHIPPING TO : 산마리노(SAN MARINO)</option>
<option value="SN"  class="xans-record-">SHIPPING TO : 세네갈(SENEGAL)</option>
<option value="RS"  class="xans-record-">SHIPPING TO : 세르비아/코소보(SERBIA/KOSOVO)</option>
<option value="SC"  class="xans-record-">SHIPPING TO : 세이셸(SEYCHELLES)</option>
<option value="LC"  class="xans-record-">SHIPPING TO : 세인트 루시아(SAINT LUCIA)</option>
<option value="VC"  class="xans-record-">SHIPPING TO : 세인트빈센트그레나딘(SAINT VINCENT AND THE GRENADINES)</option>
<option value="KN"  class="xans-record-">SHIPPING TO : 세인트키츠네비스(SAINT KITTS AND NEVIS)</option>
<option value="SB"  class="xans-record-">SHIPPING TO : 솔로몬아일란드(SOLOMON ISLANDS)</option>
<option value="SR"  class="xans-record-">SHIPPING TO : 수리남(SURINAME)</option>
<option value="LK"  class="xans-record-">SHIPPING TO : 스리랑카(SRI LANKA)</option>
<option value="SZ"  class="xans-record-">SHIPPING TO : 스와질랜드(SWAZILAND)</option>
<option value="SE"  class="xans-record-">SHIPPING TO : 스웨덴(SWEDEN)</option>
<option value="CH"  class="xans-record-">SHIPPING TO : 스위스(SWITZERLAND)</option>
<option value="ES"  class="xans-record-">SHIPPING TO : 스페인(에스파니아)(SPAIN)</option>
<option value="SK"  class="xans-record-">SHIPPING TO : 슬로바키아(SLOVAKIA)</option>
<option value="SI"  class="xans-record-">SHIPPING TO : 슬로베니아(SLOVENIA)</option>
<option value="SL"  class="xans-record-">SHIPPING TO : 시에라리온(SIERRA LEONE)</option>
<option value="SG"  class="xans-record-">SHIPPING TO : 싱가포르(SINGAPORE)</option>
<option value="AE"  class="xans-record-">SHIPPING TO : 아랍에미레이트연합국(UNITED ARAB EMIRATES)</option>
<option value="AM"  class="xans-record-">SHIPPING TO : 아르메니아(ARMENIA)</option>
<option value="AR"  class="xans-record-">SHIPPING TO : 아르헨티나(ARGENTINA)</option>
<option value="IS"  class="xans-record-">SHIPPING TO : 아이슬란드(ICELAND)</option>
<option value="HT"  class="xans-record-">SHIPPING TO : 아이티(HAITI)</option>
<option value="IE"  class="xans-record-">SHIPPING TO : 아일란드(에이레)(IRELAND)</option>
<option value="AZ"  class="xans-record-">SHIPPING TO : 아제르바이잔(AZERBAIJAN)</option>
<option value="AF"  class="xans-record-">SHIPPING TO : 아프가니스탄(AFGHANISTAN)</option>
<option value="AD"  class="xans-record-">SHIPPING TO : 안도라(ANDORRA)</option>
<option value="AL"  class="xans-record-">SHIPPING TO : 알바니아(ALBANIA)</option>
<option value="DZ"  class="xans-record-">SHIPPING TO : 알제리(ALGERIA)</option>
<option value="AO"  class="xans-record-">SHIPPING TO : 앙골라(ANGOLA)</option>
<option value="AG"  class="xans-record-">SHIPPING TO : 앤티과바부다(ANTIGUA AND BARBUDA)</option>
<option value="ER"  class="xans-record-">SHIPPING TO : 에리트리아(ERITREA)</option>
<option value="EE"  class="xans-record-">SHIPPING TO : 에스토니아(ESTONIA)</option>
<option value="EC"  class="xans-record-">SHIPPING TO : 에콰도르(ECUADOR)</option>
<option value="SV"  class="xans-record-">SHIPPING TO : 엘살바도르(EL SALVADOR)</option>
<option value="GB"  class="xans-record-">SHIPPING TO : 영국(UNITED KINGDOM)</option>
<option value="MS"  class="xans-record-">SHIPPING TO : 영국(몽세라)(MONTSERRAT)</option>
<option value="BM"  class="xans-record-">SHIPPING TO : 영국(버뮤다섬)(BERMUDA)</option>
<option value="VG"  class="xans-record-">SHIPPING TO : 영국(버진제도)(VIRGIN ISLANDS BRITISH)</option>
<option value="AI"  class="xans-record-">SHIPPING TO : 영국(안귈라섬)(ANGUILLA)</option>
<option value="GI"  class="xans-record-">SHIPPING TO : 영국(지브롤터)(GIBRALTAR)</option>
<option value="KY"  class="xans-record-">SHIPPING TO : 영국(케이만제도)(CAYMAN ISLANDS)</option>
<option value="TC"  class="xans-record-">SHIPPING TO : 영국(터크스케이코스제도)(TURKS AND CAICOS ISLANDS)</option>
<option value="YE"  class="xans-record-">SHIPPING TO : 예멘(YEMEN)</option>
<option value="OM"  class="xans-record-">SHIPPING TO : 오만(OMAN)</option>
<option value="NF"  class="xans-record-">SHIPPING TO : 오스트레일리아(노퍽섬)(NORFOLK ISLAND)</option>
<option value="AU"  class="xans-record-">SHIPPING TO : 오스트레일리아(호주)(AUSTRALIA)</option>
<option value="AT"  class="xans-record-">SHIPPING TO : 오스트리아(AUSTRIA)</option>
<option value="HN"  class="xans-record-">SHIPPING TO : 온두라스(HONDURAS)</option>
<option value="JO"  class="xans-record-">SHIPPING TO : 요르단(JORDAN)</option>
<option value="UG"  class="xans-record-">SHIPPING TO : 우간다(UGANDA)</option>
<option value="UY"  class="xans-record-">SHIPPING TO : 우루과이(URUGUAY)</option>
<option value="UZ"  class="xans-record-">SHIPPING TO : 우즈베크(UZBEKISTAN)</option>
<option value="UA"  class="xans-record-">SHIPPING TO : 우크라이나(UKRAINE)</option>
<option value="ET"  class="xans-record-">SHIPPING TO : 이디오피아(ETHIOPIA)</option>
<option value="IQ"  class="xans-record-">SHIPPING TO : 이라크(IRAQ)</option>
<option value="IR"  class="xans-record-">SHIPPING TO : 이란(IRAN(ISLAMIC REP))</option>
<option value="IL"  class="xans-record-">SHIPPING TO : 이스라엘(ISRAEL)</option>
<option value="EG"  class="xans-record-">SHIPPING TO : 이집트(EGYPT)</option>
<option value="IT"  class="xans-record-">SHIPPING TO : 이탈리아(이태리)(ITALY)</option>
<option value="IN"  class="xans-record-">SHIPPING TO : 인도(INDIA)</option>
<option value="ID"  class="xans-record-">SHIPPING TO : 인도네시아(INDONESIA)</option>
<option value="JP"  class="xans-record-">SHIPPING TO : 일본(JAPAN)</option>
<option value="JM"  class="xans-record-">SHIPPING TO : 자메이카(JAMAICA)</option>
<option value="ZM"  class="xans-record-">SHIPPING TO : 잠비아(ZAMBIA)</option>
<option value="CN"  class="xans-record-">SHIPPING TO : 중국(CHINA(PEOPLE'S REP))</option>
<option value="MO"  class="xans-record-">SHIPPING TO : 중국(마카오)(MACAU)</option>
<option value="HK"  class="xans-record-">SHIPPING TO : 중국(홍콩)(HONG KONG)</option>
<option value="CF"  class="xans-record-">SHIPPING TO : 중앙 아프리카(CENTRAL AFRICAN REPUBLIC)</option>
<option value="DJ"  class="xans-record-">SHIPPING TO : 지부티(DJIBOUTI)</option>
<option value="ZW"  class="xans-record-">SHIPPING TO : 짐바브웨(ZIMBABWE)</option>
<option value="TD"  class="xans-record-">SHIPPING TO : 차드(CHAD)</option>
<option value="CZ"  class="xans-record-">SHIPPING TO : 체코(CZECH REP)</option>
<option value="CL"  class="xans-record-">SHIPPING TO : 칠레(CHILE)</option>
<option value="CM"  class="xans-record-">SHIPPING TO : 카메룬(CAMEROON)</option>
<option value="CV"  class="xans-record-">SHIPPING TO : 카보베르데(CAPE VERDE)</option>
<option value="KZ"  class="xans-record-">SHIPPING TO : 카자흐(KAZAKHSTAN)</option>
<option value="QA"  class="xans-record-">SHIPPING TO : 카타르(QATAR)</option>
<option value="KH"  class="xans-record-">SHIPPING TO : 캄보디아(CAMBODIA)</option>
<option value="CA"  class="xans-record-">SHIPPING TO : 캐나다(CANADA)</option>
<option value="KE"  class="xans-record-">SHIPPING TO : 케냐(KENYA)</option>
<option value="CR"  class="xans-record-">SHIPPING TO : 코스타리카(COSTA RICA)</option>
<option value="CI"  class="xans-record-">SHIPPING TO : 코트디봐르(COTE D IVOIRE)</option>
<option value="CO"  class="xans-record-">SHIPPING TO : 콜롬비아(COLOMBIA)</option>
<option value="CG"  class="xans-record-">SHIPPING TO : 콩고(CONGO)</option>
<option value="CU"  class="xans-record-">SHIPPING TO : 쿠바(CUBA)</option>
<option value="KW"  class="xans-record-">SHIPPING TO : 쿠웨이트(KUWAIT)</option>
<option value="HR"  class="xans-record-">SHIPPING TO : 크로아티아(CROATIA)</option>
<option value="KG"  class="xans-record-">SHIPPING TO : 키르키즈스탄(KYRGYZSTAN)</option>
<option value="KI"  class="xans-record-">SHIPPING TO : 키리바티(KIRIBATI)</option>
<option value="TH"  class="xans-record-">SHIPPING TO : 타이(태국)(THAILAND)</option>
<option value="TW"  class="xans-record-">SHIPPING TO : 타이완(대만)(TAIWAN)</option>
<option value="TJ"  class="xans-record-">SHIPPING TO : 타지키스탄(TAJIKISTAN)</option>
<option value="TZ"  class="xans-record-">SHIPPING TO : 탄자니아(TANZANIA(UNITED REP))</option>
<option value="TR"  class="xans-record-">SHIPPING TO : 터키(TURKEY)</option>
<option value="TG"  class="xans-record-">SHIPPING TO : 토고(TOGO)</option>
<option value="TO"  class="xans-record-">SHIPPING TO : 통가(TONGA)</option>
<option value="TM"  class="xans-record-">SHIPPING TO : 투르크메니스탄(TURKMENISTAN)</option>
<option value="TV"  class="xans-record-">SHIPPING TO : 투발루(TUVALU)</option>
<option value="TN"  class="xans-record-">SHIPPING TO : 튀니지(TUNISIA)</option>
<option value="TT"  class="xans-record-">SHIPPING TO : 트리니다드토바고(TRINIDAD AND TOBAGO)</option>
<option value="PA"  class="xans-record-">SHIPPING TO : 파나마(PANAMA(REP))</option>
<option value="PY"  class="xans-record-">SHIPPING TO : 파라과이(PARAGUAY)</option>
<option value="PK"  class="xans-record-">SHIPPING TO : 파키스탄(PAKISTAN)</option>
<option value="PG"  class="xans-record-">SHIPPING TO : 파푸아뉴기니(PAPUA NEW GUINEA)</option>
<option value="PE"  class="xans-record-">SHIPPING TO : 페루(PERU)</option>
<option value="PT"  class="xans-record-">SHIPPING TO : 포르투갈(PORTUGAL)</option>
<option value="PL"  class="xans-record-">SHIPPING TO : 폴란드(POLAND(REP))</option>
<option value="FR"  class="xans-record-">SHIPPING TO : 프랑스(FRANCE)</option>
<option value="GP"  class="xans-record-">SHIPPING TO : 프랑스(과데루프섬)(GUADELOUPE)</option>
<option value="GF"  class="xans-record-">SHIPPING TO : 프랑스(기아나)(FRENCH GUIANA)</option>
<option value="NC"  class="xans-record-">SHIPPING TO : 프랑스(뉴칼레도니아섬)(NEW CALEDONIA)</option>
<option value="RE"  class="xans-record-">SHIPPING TO : 프랑스(레위니옹섬)(REUNION)</option>
<option value="MQ"  class="xans-record-">SHIPPING TO : 프랑스(마르티니크섬)(MARTINIQUE)</option>
<option value="PF"  class="xans-record-">SHIPPING TO : 프랑스(폴리네시아)(FRENCH POLYNESIA)</option>
<option value="FJ"  class="xans-record-">SHIPPING TO : 피지(FIJI)</option>
<option value="FI"  class="xans-record-">SHIPPING TO : 필란드(FINLAND)</option>
<option value="PH"  class="xans-record-">SHIPPING TO : 필리핀(PHILIPPINES)</option>
<option value="HU"  class="xans-record-">SHIPPING TO : 헝가리(HUNGARY(REP))</option>
</select>
				<select class="xans-element- xans-layout xans-layout-multishopshippinglanguagelist"><option value="www.tattootati.com"  selected="selected" class="xans-record-">LANGUAGE : 한국어</option>
</select>
			</div>
			<div class="ec-base-button">
				<a href="#none" class="btnSubmitFix sizeM">GO</a>
			</div>
			<a href="#none" class="btnClose">닫기</a>
		</div>
</div>

	<div class="layer_shadow" id="layer_shadow"></div>
	<div id="layoutDimmed" class="dimmed"></div>

	
	
	
	
	
	
<span itemscope="" itemtype="https://schema.org/Organization">
<link itemprop="url" href="https://www.tattootati.com">
</span>
<script type="text/javascript" src="/app/Eclog/js/cid.generate.js?vs=3d0b473968a0ec4ec41e3bf59df3aa51&u=tcmb.1"></script>
<script type="text/javascript" src="/app/Manage/js/inflowbeacon.js?vs=3d0b473968a0ec4ec41e3bf59df3aa51&u=tcmb.1"></script>
<script>        (function (i, s, o, g) {
            var a = s.createElement(o), m = s.getElementsByTagName(o)[0];
            var initialized = false;
            var interval = null;

            function safeInit() {
              if (initialized) return;
              if (typeof i.initCaWebAnalytics === 'function') {
                try {
                  i.initCaWebAnalytics({"mid":"tcmb","stype":"e","domain":"","shop_no":1,"lang":"ko_KR","mobile_flag":"F","send_endpoint":"https://ca-log.cafe24data.com","path_role":"MAIN"});
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
        })(window, document, 'script', "//optimizer.poxo.com/ca2/analytics.js?v=20260904");</script>

<!-- External Script Start -->

<!-- fbe -->
<!-- CMC3 script -->
<div id="fbe_common_top_script" style="display:none;">
  <script type="text/javascript">
if (typeof facebookChannel === 'undefined') {
  var facebookChannel = {
    mall_id: CAFE24.SHOP.getMallID(),
    shop_no: CAFE24.SDE_SHOP_NUM,
    shop_id: CAFE24.SHOP.getMallID() + '.' + CAFE24.SDE_SHOP_NUM,
    external_id: null,
    event_id: null,

    setInitActivated: function(is_activated) {
      window.top.fbe_init_activated = !!is_activated;
    },
    getInitActivated: function() {
      return !!window.top.fbe_init_activated;
    },
    setEventActivated: function(event_type, is_activated) {
      if (typeof event_type === 'string' && event_type) {
        let key = 'fbe_' + event_type + '_activated'
        window.top[key] = !!is_activated;
      }
    },
    getEventActivated: function(event_type) {
      if (typeof event_type === 'string' && event_type) {
        let key = 'fbe_' + event_type + '_activated'
        return !!window.top[key];
      }
      return false;
    },
    getCookie: function(name) {
      return (name = (document.cookie + ';').match(name + '=.*;')) && name[0].split(/=|;/)[1];
    },
    getExternalId: function() {
      return facebookChannel.getCookie('fb_external_id');
    },
    getEventId: function() {
      return facebookChannel.getCookie('fb_event_id');
    },
    getInt: function(value) {
      let value_int = parseInt(value);
      value_int = isNaN(value_int) ? 0 : value_int;
      return value_int;
    },
    getFloat: function(value) {
      let value_float = parseFloat(value);
      value_float = isNaN(value_float) ? 0.00 : value_float.toFixed(2);
      return value_float;
    },
    init: function() {
      if (facebookChannel.getInitActivated()) {
        return;
      }
      facebookChannel.setInitActivated(true);

      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');

      if ((typeof EC_GLOBAL_INFO !== 'undefined' && EC_GLOBAL_INFO.getCountryCode() === 'US') || (typeof SHOP !== 'undefined' && SHOP.getLanguage() === 'en_US')) {
        fbq('dataProcessingOptions', ['LDU'], 0, 0);
      }

      if (typeof ECLOG !== 'undefined' && !!ECLOG.EXTERNAL_ID) {
        ECLOG.EXTERNAL_ID.chk(facebookChannel.shop_id, function(error, external_id) {
          if (error || !external_id) {
            external_id = facebookChannel.getExternalId();
            console.info('external_id is cookie value.', '(1)');
          }
          fbq('init', '312782328299342',{external_id: external_id}, {agent: 'plcafe24'});
          fbq('trackSingle', '312782328299342', 'PageView');
          facebookChannel.external_id = external_id;
          facebookChannel.basketEvent();
        });
      } else {
        let external_id = facebookChannel.getExternalId();
        console.info('external_id is cookie value.', '(2)');

        fbq('init', '312782328299342',{external_id: external_id}, {agent: 'plcafe24'});
        fbq('trackSingle', '312782328299342', 'PageView');
        facebookChannel.external_id = external_id;
        facebookChannel.basketEvent();
      }
    },
    pixelEvent: function(event_type, callback, is_cookie_event) {
      if (facebookChannel.getEventActivated(event_type)) {
        return;
      }
      facebookChannel.setEventActivated(event_type, true);
      is_cookie_event = !!is_cookie_event;

      let retry = 0;
      let execute = function() {
        if (!facebookChannel.external_id) {
          if (retry < 300) {
            retry++;
            if (retry >= 5) {
              console.warn('retry #' + retry, event_type);
            }
            setTimeout(execute, 1000);
          } else {
            console.warn('external_id is empty.');
          }
          return;
        }

        if (callback.length === 0) {
          callback();
        }
        else if (!is_cookie_event && typeof ECLOG !== 'undefined' && !!ECLOG.EVENT_ID) {
          ECLOG.EVENT_ID.chk(facebookChannel.shop_id, function(error, event_id) {
            if (error || !event_id) {
              event_id = facebookChannel.getEventId();
              console.info('event_id is cookie value.', '(1)');
            }
            facebookChannel.event_id = event_id;
            if (event_id) {
              callback(event_id);
            } else {
              console.warn('event_id is empty.', '(1)');
            }
          });
        }
        else {
          let event_id = facebookChannel.getEventId();
          console.info('event_id is cookie value.', '(2)');
          facebookChannel.event_id = event_id;
          if (event_id) {
            callback(event_id);
          } else {
            console.warn('event_id is empty.', '(2)');
          }
        }
      };
      execute();
    },
    messengerChatPlugin: function() {
      let event_type = 'messenger';
      let sdk_version = '';
      let locale = '';
      if (!sdk_version) {
        console.warn('sdk_version is empty.');
        return;
      }
      if (!locale) {
        console.warn('locale is empty.');
        return;
      }
      if (facebookChannel.getEventActivated(event_type)) {
        return;
      }
      facebookChannel.setEventActivated(event_type, true);

      window.fbAsyncInit = function() {
        FB.init({
          appId : '216637735743129',
          autoLogAppEvents : true,
          xfbml : true,
          version : sdk_version
        });
      };
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/' + locale + '/sdk/xfbml.customerchat.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    },
    basketEvent: function() {
      let event_key = 'AddToCart';
      if (facebookChannel.getEventActivated(event_key + '_listener')) {
        return;
      }
      facebookChannel.setEventActivated(event_key + '_listener', true);

      facebookChannel.pixelEvent(event_key, function(event_id) {
        EC$("body").bind("EC_PRODUCT_ACTION_BASKET", function(e, params) {
          try {
            // 필수 데이터 검증
            let validation_error = null;

            if (!params || typeof params !== 'object') {
              validation_error = 'params가 없거나 유효하지 않음';
            } else if (!params.product_no) {
              validation_error = 'product_no가 없음';
            } else if (!params.contents || params.contents.length === 0) {
              validation_error = 'contents가 비어있음';
            } else if (typeof params.total_price === 'undefined' || params.total_price === null) {
              validation_error = 'total_price가 없음';
            } else {
              // contents 배열의 각 항목 검증
              for (let i = 0; i < params.contents.length; i++) {
                let item = params.contents[i];
                if (!item.variant_code) {
                  validation_error = 'contents[' + i + '].variant_code가 없음';
                  break;
                }
                if (!item.quantity) {
                  validation_error = 'contents[' + i + '].quantity가 없음';
                  break;
                }
                if (typeof item.price === 'undefined' || item.price === null) {
                  validation_error = 'contents[' + i + '].price가 없음';
                  break;
                }
              }
            }

            // 검증 실패 시 로그 전송 후 종료
            if (validation_error) {
              console.warn('AddToCart 이벤트 무시: ' + validation_error);
              window.EC_JET?.message?.({
                mall_id: facebookChannel.mall_id,
                shop_no: facebookChannel.shop_no,
                pixel_id: 312782328299342,
                external_id: facebookChannel.external_id,
                event_id: event_id,
                validation_error: validation_error,
                params: params
              }, 'MBE_ADDTOCART_VALIDATION_ERROR');
              return;
            }

            let event_data = {
              contents: params.contents.map(function(v) {
                return {
                  id: params.product_no + '.' + v.variant_code,
                  quantity: facebookChannel.getInt(v.quantity),
                  item_price: facebookChannel.getFloat(v.price)
                };
              }),
              content_type: 'product',
              value: facebookChannel.getFloat(params.total_price),
              currency: params.currency
            };

            let event_log_data = Object.assign({
              mall_id: facebookChannel.mall_id,
              shop_no: facebookChannel.shop_no,
              pixel_id: 312782328299342,
              external_id: facebookChannel.external_id,
              event_id: event_id
            }, event_data);

            window.EC_JET?.message?.(event_log_data, 'MBE_ADDTOCART_EVENT');
            fbq('trackSingle', '312782328299342', event_key, event_data, {eventID: event_id});
          } catch (e) { console.error(e); }
        });
      });
    }
  };

  window.addEventListener('load', facebookChannel.init, false);
}
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=312782328299342&ev=PageView&noscript=1"
/></noscript>
</div>
<!-- CMC3 script -->

<!-- External Script End -->

<script type="text/javascript" src="//t1.kakaocdn.net/kakao_js_sdk/v1/kakao.min.js" charset="utf-8"></script>
<script type="text/javascript" src="/ind-script/i18n.php?v=2609021500&lang=ko_KR&domain=front&type=" charset="utf-8"></script>

<script src="/ind-script/optimizer.php?filename=vVnLVuM4EN0Tb_s7TJ95nNmSpJnhNAwcQg9rRS4nhWVJowfB_fVTsg1N4phYTnoWJI5U95Yk11PkhpWwUaZIDVjlDYf0yab4-Q-ZPNlPeXfWo2a8SJ_-9WCq9uuX5PfkfJA8vDgwkgnbDiRcqQJhHNYbEbHIBHiSy0gAE8hsDIZmnTL1hrRRK0JtHWzGHDgsIS1VCdKlwG_qh0d064fvc-ZYUqI8iBa4JFl4oOc-WasNSpf3Uinug-JLZcqZks4oIcD0Sd8Jby-0nhrMVr0avUPRN5cbVe_2zCpBckqeOaXPBEo4WzIp-zU3QK7KUsmPZV6YJMOVZCPagDvEWEs7KLWgc3wvyrROb9QSBaT371DNCjp77JEuVeZpyG5QDyHPveThUFKSyzx3SbljQkNxHYVkKOm3xk7fAwX7XgnFsgGipXcs6LhdWjDP28faA9FKVDmKA8aQQc68cGFrtmTGTTt2EKYWa6W3yC9r8FdWMJUW4fMOX0B0LfMD8Kx-l9_2vMoewByWfjVQ9ob2hJbmrtG6gZh7yMGA5DDzJnxXdwb5yKC4XGEN-v_DcUbRSFoyFTsOD8yiXI3DluBYFqLnzoFPFTPZ1onTaLIMowPfzd-wCX93jYfd6uALCxDAXQRBu8onux3EIlBviWj4km-FLCIQzdbSLy_OsBpe_65_LpTIlHenIXuz7eOprkq2OhHVHC2lggopJRxNeEUkCzJlAY2hYNRb_3CRhuimzBZwopdx6WXWOt3xZI-ljSd6o5h1cnw0gTxG_xRldgR8vif6RMD_IQfP2K6p9CTY1zSRhjwz0bsONQjF21-TnCpA5sZpPQ7sh2fg7SgckVq3gRexzvgDunCKx4TTaywgnRq1obJpxvgaYrHR_vAO1a55ILiVpjLHMRTplGKCABosVeRp3cMzwsYxUbSPM-Xl0FVYYIavB5iSY3levbZJB0sFLfwKqdZ_bhxMmde0-jYQ0eR1yUIlIjPbJSUGTQEJTs27BqHhJ615zcKbN6empa4B8-rUrNRhuCMPQijOqKUqVF-n8kPbgAhHVDJjJv01-S05T3NqLDXyIgoqPp_LneV84DGL2mPCBHVmde54Jer0jkxSpbRFsYGlUKu-ja9dSUwOHYLtk5mZSjv1FaoB2uqWb2KplYTJyu-pvvdgmK0kbz4jpUsol2AiQbcmA8O74eoArKnGxuL0vmJ4ELInxB_AUkCmqBS_2hsUsKfWPoCag1YWY3U9Uvu8L8MPgPF9-eYAjkpqiAbd16ACKgo42Sjsg6I8ORux3tpOY00GJOQ4zkSvWRWt70_DslhjufBOUS2JvAZTyNvE2mi4eblT2utYp_CWVIMhl3rG-MOdNxdZizVqTb3URZZRlLSxi69C-dY69Riz2CIY4T61Wf2F4fa6Gm2WLf6BLY9Ah_Z57AaaEvZK5irWBgTDki0FRGvXzK2NEjDZWywMUH29cxHbA9GDA36T_iaU3lEOELebhMog0bX7L-0tWzeTh2nLDWo3CBOuWtOLUMho4PUVfc66aW8vdCtCaD378B8BRnkHl_hC8_8B&type=js&k=05b507ae585e4c8e0598929d94769efaecc92a4e&t=1788245873" ></script><script src="/ind-script/optimizer_user.php?filename=jY5BDsIwDATvtFfe4cfwgjSxWle2Y8WJELyelnIskJPX0qxmPeGQ0GlWmIIjcHjkVvdMEVYHCaTj6lf_wznTRghq66LvZFguU9PEOMq5Yrfn1BjBynZjBQ-MgxWK2CN5hx7w-L9MiFkkn-7DJ5BS_T3945LGlXzJdlvIjHTeWi8&type=js&k=774408f8ea5a555b4479c0d68cb7b4f27049b7d0&t=1695177581&user=T" ></script>
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
CAFE24.FRONT_XANS_TEMPLATE.setTemplate('xans-product-listmain-2', "<div class=\"xans-element- xans-product xans-product-listmain-2 xans-product-listmain xans-product-2 ec-base-product\">\n<!--\n\t\t\t\t\t\t$count = 100\n\t\t\t\t\t\t$basket_result = \/product\/add_basket.html\n\t\t\t\t\t\t$basket_option = \/product\/basket_option.html\n\t\t\t\t\t\t$moreview = yes\n\t\t\t\t\t\t$cache = yes\n\t\t\t\t\t-->\n<ul class=\"prdList grid3\" data-ez-role=\"layout ez-discount-tag\">\n\t\t\t\t\t\t<!--\n\u203b \uc0c1\ud488\uc9c4\uc5f4 \uacf5\ud1b5\uc18c\uc2a4\n-->\n<!--$--><!--@--><li id=\"anchorBoxId_{$product_no}\">\n\t<div class=\"prdList__item\">\n\t\t<div class=\"thumbnail\">\n\t\t\t<a href=\"{$link_product_detail}\"><img src=\"{$image_medium}\" id=\"{$image_medium_id}\" alt=\"{$seo_alt_tag}\" loading=\"lazy\"><!--#--><span class=\"xans-element- xans-product xans-product-imagestyle-2 xans-product-imagestyle xans-product-2\">\n<span class=\"prdIcon {$icon_class_name}\" style=\"background-image:url('{$icon_url}');\"><\/span>\n<\/span>\n<!--#--><\/a>\n\t\t\t<div class=\"likeButton {$disp_likeprd_class}\"><button type=\"button\">{$disp_likeprd_icon} <strong>{$disp_likeprd_count}<\/strong><\/button><\/div>\n\t\t\t<div class=\"badge\"><span><\/span><\/div>\n\t\t\t<div class=\"icon__box\">\n\t\t\t\t<span class=\"wish\">{$list_wish_icon}WISH<\/span>\n\t\t\t\t<span class=\"cart\">{$basket_icon}ADD<\/span>\n\t\t\t\t<span class=\"option\">{$option_preview_icon}OPTION<\/span>\n\t\t\t<\/div>\n\t\t<\/div>\n\t\t<div class=\"description\" ec-data-custom=\"{$product_custom}\" ec-data-price=\"{$product_price}\">\n\t\t\t<div class=\"name\"><a href=\"{$link_product_detail}\" class=\"{$product_name_display|display}\"><span class=\"title {$product_name_title_display|display}\">{$product_name_title} :<\/span> {$product_name}<\/a><\/div>\n\t\t\t<!--#--><ul class=\"xans-element- xans-product xans-product-listitem-2 xans-product-listitem xans-product-2 spec\">\n<!--$--><!--@--><li class=\"{$item_display|display}\">\n\t\t\t\t\t<strong class=\"title {$item_title_display|display}\">{$item_title} :<\/strong> {$item_content}\n\t\t\t\t<\/li>\n<!--@--><li class=\"{$item_display|display}\">\n\t\t\t\t\t<strong class=\"title {$item_title_display|display}\">{$item_title} :<\/strong> {$item_content}\n\t\t\t\t<\/li>\n<!--$-->\n<\/ul>\n<!--#-->\n\t\t\t<div class=\"icon\">{$soldout_icon} {$stock_icon} {$recommend_icon} {$new_icon} {$product_icons} {$today_arrival_icon} {$pickup_icon} {$benefit_icons}<\/div>\n\t\t<\/div>\n\t<\/div>\n<\/li>\n<!--@--><li id=\"anchorBoxId_{$product_no}\">\n\t<div class=\"prdList__item\">\n\t\t<div class=\"thumbnail\">\n\t\t\t<a href=\"{$link_product_detail}\"><img src=\"{$image_medium}\" id=\"{$image_medium_id}\" alt=\"{$seo_alt_tag}\" loading=\"lazy\"><!--#--><span class=\"xans-element- xans-product xans-product-imagestyle-2 xans-product-imagestyle xans-product-2\">\n<span class=\"prdIcon {$icon_class_name}\" style=\"background-image:url('{$icon_url}');\"><\/span>\n<\/span>\n<!--#--><\/a>\n\t\t\t<div class=\"likeButton {$disp_likeprd_class}\"><button type=\"button\">{$disp_likeprd_icon} <strong>{$disp_likeprd_count}<\/strong><\/button><\/div>\n\t\t\t<div class=\"badge\"><span><\/span><\/div>\n\t\t\t<div class=\"icon__box\">\n\t\t\t\t<span class=\"wish\">{$list_wish_icon}WISH<\/span>\n\t\t\t\t<span class=\"cart\">{$basket_icon}ADD<\/span>\n\t\t\t\t<span class=\"option\">{$option_preview_icon}OPTION<\/span>\n\t\t\t<\/div>\n\t\t<\/div>\n\t\t<div class=\"description\" ec-data-custom=\"{$product_custom}\" ec-data-price=\"{$product_price}\">\n\t\t\t<div class=\"name\"><a href=\"{$link_product_detail}\" class=\"{$product_name_display|display}\"><span class=\"title {$product_name_title_display|display}\">{$product_name_title} :<\/span> {$product_name}<\/a><\/div>\n\t\t\t<!--#--><ul class=\"xans-element- xans-product xans-product-listitem-2 xans-product-listitem xans-product-2 spec\">\n<!--$--><!--@--><li class=\"{$item_display|display}\">\n\t\t\t\t\t<strong class=\"title {$item_title_display|display}\">{$item_title} :<\/strong> {$item_content}\n\t\t\t\t<\/li>\n<!--@--><li class=\"{$item_display|display}\">\n\t\t\t\t\t<strong class=\"title {$item_title_display|display}\">{$item_title} :<\/strong> {$item_content}\n\t\t\t\t<\/li>\n<!--$-->\n<\/ul>\n<!--#-->\n\t\t\t<div class=\"icon\">{$soldout_icon} {$stock_icon} {$recommend_icon} {$new_icon} {$product_icons} {$today_arrival_icon} {$pickup_icon} {$benefit_icons}<\/div>\n\t\t<\/div>\n\t<\/div>\n<\/li>\n<!--$-->\n\t\t\t\t\t<\/ul>\n<\/div>\n");
if (typeof($M) !== 'undefined') {
$M.sModule = "xans-product-listmain";
$M.iCount = 0;
$M.iCategoryNo = 0;
$M.iSortMethod = 0;
$M.init();
}
CAFE24.SHOP_CURRENCY_INFO = {"1":{"aShopCurrencyInfo":{"currency_code":"KRW","currency_no":"410","currency_symbol":"\uffe6","currency_name":"South Korean won","currency_desc":"\uffe6 \uc6d0 (\ud55c\uad6d)","decimal_place":0,"round_method_type":"F"},"aShopSubCurrencyInfo":null,"aBaseCurrencyInfo":{"currency_code":"KRW","currency_no":"410","currency_symbol":"\uffe6","currency_name":"South Korean won","currency_desc":"\uffe6 \uc6d0 (\ud55c\uad6d)","decimal_place":0,"round_method_type":"F"},"fExchangeRate":1,"fExchangeSubRate":null,"aFrontCurrencyFormat":{"head":"","tail":"\uc6d0"},"aFrontSubCurrencyFormat":{"head":"","tail":""},"bPresentmentEnabled":false,"aPresentmentCurrencyInfo":null,"fExchangePresentmentRate":null,"aFrontPresentmentCurrencyFormat":null,"bGlobaleEnabled":false}}; var SHOP_CURRENCY_INFO = CAFE24.SHOP_CURRENCY_INFO;
if (typeof CAFE24.SHOP_FRONT_NEW_OPTION_COMMON !== "undefined") {CAFE24.SHOP_FRONT_NEW_OPTION_COMMON.initObject();}
if (typeof CAFE24.SHOP_FRONT_NEW_OPTION_BIND !== "undefined") {CAFE24.SHOP_FRONT_NEW_OPTION_BIND.initChooseBox();}
if (typeof CAFE24.SHOP_FRONT_NEW_OPTION_DATA !== "undefined") {CAFE24.SHOP_FRONT_NEW_OPTION_DATA.initData();}
if (typeof CAFE24.SHOP_FRONT_NEW_LIKE_COMMON !== "undefined") {CAFE24.SHOP_FRONT_NEW_LIKE_COMMON.init({"bIsUseLikeProduct":false,"bIsUseLikeCategory":false});}
if (typeof CAFE24.SHOP_FRONT_REVIEW_TALK_REVIEW_COUNT !== "undefined") {CAFE24.SHOP_FRONT_REVIEW_TALK_REVIEW_COUNT.bIsReviewTalk = 'F';}
var basket_result = '/product/add_basket.html';
var basket_option = '/product/basket_option.html';
CAFE24.FRONT_XANS_TEMPLATE.setTemplate('xans-product-listmain-1', "<div class=\"xans-element- xans-product xans-product-listmain-1 xans-product-listmain xans-product-1 ec-base-product\">\n<!--\n\t\t\t\t$count = 8\n\t\t\t\t$basket_result = \/product\/add_basket.html\n\t\t\t\t$basket_option = \/product\/basket_option.html\n\t\t\t\t$moreview = yes\n\t\t\t\t$cache = yes\n\t\t\t-->\n<ul class=\"prdList grid4\" data-ez-role=\"layout ez-discount-tag\">\n\t\t\t\t<!--\n\u203b \uc0c1\ud488\uc9c4\uc5f4 \uacf5\ud1b5\uc18c\uc2a4\n-->\n<!--$--><!--@--><li id=\"anchorBoxId_{$product_no}\">\n\t<div class=\"prdList__item\">\n\t\t<div class=\"thumbnail\">\n\t\t\t<a href=\"{$link_product_detail}\"><img src=\"{$image_medium}\" id=\"{$image_medium_id}\" alt=\"{$seo_alt_tag}\" loading=\"lazy\"><!--#--><span class=\"xans-element- xans-product xans-product-imagestyle-1 xans-product-imagestyle xans-product-1\">\n<span class=\"prdIcon {$icon_class_name}\" style=\"background-image:url('{$icon_url}');\"><\/span>\n<\/span>\n<!--#--><\/a>\n\t\t\t<div class=\"likeButton {$disp_likeprd_class}\"><button type=\"button\">{$disp_likeprd_icon} <strong>{$disp_likeprd_count}<\/strong><\/button><\/div>\n\t\t\t<div class=\"badge\"><span><\/span><\/div>\n\t\t\t<div class=\"icon__box\">\n\t\t\t\t<span class=\"wish\">{$list_wish_icon}WISH<\/span>\n\t\t\t\t<span class=\"cart\">{$basket_icon}ADD<\/span>\n\t\t\t\t<span class=\"option\">{$option_preview_icon}OPTION<\/span>\n\t\t\t<\/div>\n\t\t<\/div>\n\t\t<div class=\"description\" ec-data-custom=\"{$product_custom}\" ec-data-price=\"{$product_price}\">\n\t\t\t<div class=\"name\"><a href=\"{$link_product_detail}\" class=\"{$product_name_display|display}\"><span class=\"title {$product_name_title_display|display}\">{$product_name_title} :<\/span> {$product_name}<\/a><\/div>\n\t\t\t<!--#--><ul class=\"xans-element- xans-product xans-product-listitem-1 xans-product-listitem xans-product-1 spec\">\n<!--$--><!--@--><li class=\"{$item_display|display}\">\n\t\t\t\t\t<strong class=\"title {$item_title_display|display}\">{$item_title} :<\/strong> {$item_content}\n\t\t\t\t<\/li>\n<!--@--><li class=\"{$item_display|display}\">\n\t\t\t\t\t<strong class=\"title {$item_title_display|display}\">{$item_title} :<\/strong> {$item_content}\n\t\t\t\t<\/li>\n<!--$-->\n<\/ul>\n<!--#-->\n\t\t\t<div class=\"icon\">{$soldout_icon} {$stock_icon} {$recommend_icon} {$new_icon} {$product_icons} {$today_arrival_icon} {$pickup_icon} {$benefit_icons}<\/div>\n\t\t<\/div>\n\t<\/div>\n<\/li>\n<!--@--><li id=\"anchorBoxId_{$product_no}\">\n\t<div class=\"prdList__item\">\n\t\t<div class=\"thumbnail\">\n\t\t\t<a href=\"{$link_product_detail}\"><img src=\"{$image_medium}\" id=\"{$image_medium_id}\" alt=\"{$seo_alt_tag}\" loading=\"lazy\"><!--#--><span class=\"xans-element- xans-product xans-product-imagestyle-1 xans-product-imagestyle xans-product-1\">\n<span class=\"prdIcon {$icon_class_name}\" style=\"background-image:url('{$icon_url}');\"><\/span>\n<\/span>\n<!--#--><\/a>\n\t\t\t<div class=\"likeButton {$disp_likeprd_class}\"><button type=\"button\">{$disp_likeprd_icon} <strong>{$disp_likeprd_count}<\/strong><\/button><\/div>\n\t\t\t<div class=\"badge\"><span><\/span><\/div>\n\t\t\t<div class=\"icon__box\">\n\t\t\t\t<span class=\"wish\">{$list_wish_icon}WISH<\/span>\n\t\t\t\t<span class=\"cart\">{$basket_icon}ADD<\/span>\n\t\t\t\t<span class=\"option\">{$option_preview_icon}OPTION<\/span>\n\t\t\t<\/div>\n\t\t<\/div>\n\t\t<div class=\"description\" ec-data-custom=\"{$product_custom}\" ec-data-price=\"{$product_price}\">\n\t\t\t<div class=\"name\"><a href=\"{$link_product_detail}\" class=\"{$product_name_display|display}\"><span class=\"title {$product_name_title_display|display}\">{$product_name_title} :<\/span> {$product_name}<\/a><\/div>\n\t\t\t<!--#--><ul class=\"xans-element- xans-product xans-product-listitem-1 xans-product-listitem xans-product-1 spec\">\n<!--$--><!--@--><li class=\"{$item_display|display}\">\n\t\t\t\t\t<strong class=\"title {$item_title_display|display}\">{$item_title} :<\/strong> {$item_content}\n\t\t\t\t<\/li>\n<!--@--><li class=\"{$item_display|display}\">\n\t\t\t\t\t<strong class=\"title {$item_title_display|display}\">{$item_title} :<\/strong> {$item_content}\n\t\t\t\t<\/li>\n<!--$-->\n<\/ul>\n<!--#-->\n\t\t\t<div class=\"icon\">{$soldout_icon} {$stock_icon} {$recommend_icon} {$new_icon} {$product_icons} {$today_arrival_icon} {$pickup_icon} {$benefit_icons}<\/div>\n\t\t<\/div>\n\t<\/div>\n<\/li>\n<!--$-->\n\t\t\t<\/ul>\n<\/div>\n");
if (typeof($M) !== 'undefined') {
$M.sModule = "xans-product-listmain";
$M.iCount = 0;
$M.iCategoryNo = 0;
$M.iSortMethod = 0;
$M.init();
}
var bUseElastic = false;
var sSearchBannerUseFlag = 'F';
var EC_SHOP_MULTISHOP_SHIPPING = {"bMultishopShipping":false,"bMultishopShippingCountrySelection":false,"bMultishopShippingLanguageSelection":false};
var aLogData = {"log_server1":"eclog2-181.cafe24.com","log_server2":"eclog2-181.cafe24.com","mid":"tcmb","stype":"e","domain":"","shop_no":1,"lang":"ko_KR","ver":2,"hash":"","ca":"cfa-js.cafe24.com\/cfa.js","etc":"","mobile_flag":"F"};
var sMileageName = '적립금';
var sMileageUnit = '[:PRICE:]원';
var sDepositName = '예치금';
var sDepositUnit = '원';
CAFE24.APPSCRIPT_ASSIGN_DATA = CAFE24.APPSCRIPT_ASSIGN_DATA || [{'src':'https://app4you.cafe24.com/SmartPopup/tunnel/scriptTags?vs=20260414041313.1&client_id=AyPifbe9TEq8i4fmvfUgaZ', 'integrity': 'sha384-j+WLOriOo0/sb+Ho5fn6lGPknv0cW+wMxOLlx8qpy01ShkkynynGNJQ53niqAdze'},{'src':'https://static.alphwidget.com/script/Push-Script/PRODUCTION/alphapush_funnel.js?vs=20260331044502.1&client_id=tgHZp6LCG5KuklqvIYgrtB'},{'src':'https://static.alphwidget.com/script/Push-Script/PRODUCTION/alphapush_main.js?vs=20260331044502.1&client_id=tgHZp6LCG5KuklqvIYgrtB'},{'src':'https://static.alphwidget.com/script/Common-Script/PRODUCTION/alphacore_alpha_data.js?vs=20260331044504.1&client_id=tgHZp6LCG5KuklqvIYgrtB'},{'src':'https://static.alphwidget.com/script/Push-Script/PRODUCTION/alphapush_onsite.js?vs=20260406004327.1&client_id=tgHZp6LCG5KuklqvIYgrtB'},{'src':'https://cax.channel.io/cafe24/plugins/dcaeb322-37af-4da6-b5ab-1b86cd6cf646.js?vs=20231121120815.1&client_id=QKWiDNLcK9koJO0swpfnuE'},{'src':'https://review.poxo.com/script/pro_review.js?mall_id=tcmb&shop_no=1&star=%23000000&graph=%23000000&url_api=pro-review.cafe24.com&url_static=https%3A%2F%2Freview.poxo.com%2Fscript&pro_review_mode=active&vs=20260428210713.1&client_id=w7eza2j1NKcXPrZPW3iwvF'}];
CAFE24.APPSCRIPT_SDK_DATA = CAFE24.APPSCRIPT_SDK_DATA || ['analytics','application','category','collection','community','customer','design','mileage','order','personal','privacy','product','promotion','salesreport','shipping','store','supply'];
var EC_APPSCRIPT_ASSIGN_DATA = CAFE24.getDeprecatedNamespace('EC_APPSCRIPT_ASSIGN_DATA');
var EC_APPSCRIPT_SDK_DATA = CAFE24.getDeprecatedNamespace('EC_APPSCRIPT_SDK_DATA');
</script></body>
</html>


