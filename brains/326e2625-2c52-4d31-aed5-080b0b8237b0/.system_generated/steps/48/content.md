Title: Live Content

Description: Fetched live

Source: https://k-tass.com

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
            i[r].init('https://js-error-tracer-api.cafe24.com', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0YXNzMDYyMi5jYWZlMjQuY29tIiwiYXVkIjoianMtZXJyb3ItdHJhY2VyLWFwaS5jYWZlMjQuY29tIiwibWFsbF9pZCI6InRhc3MwNjIyIiwic2hvcF9ubyI6MSwicGF0aF9yb2xlIjoiTUFJTiIsImxhbmd1YWdlX2NvZGUiOiJrb19LUiIsImNvdW50cnlfY29kZSI6IktSIiwiaXNfeXRzIjpmYWxzZSwiaXNfY29udGFpbmVyIjpmYWxzZSwid29ya3NwYWNlIjoicHJvZHVjdGlvbiJ9.5-HYQNGfMDTx4v5lVTvLtV0B3S0ZfN3srmiflvukcds', {"errors":{"path":"\/api\/v1\/store","collectWindowErrors":true,"preventDuplicateReports":true,"storageKeyPrefix":"EC_JET.MAIN","samplingEnabled":true,"samplingRate":0.5},"vitals":{"path":"\/api\/v1\/vitals","samplingEnabled":true,"samplingRate":0.3},"resources":{"path":"\/api\/v1\/resources","samplingEnabled":true,"samplingRate":0.5,"durationThreshold":3000}});
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
<meta name="author" content="주식회사타스" />
<meta name="description" content="주식회사 타스는 최적의 자동화 생산 시스템을 제공합니다" />
<meta name="keywords" content="주식회사타스" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8">

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
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/xeicon@2.3.3/xeicon.min.css">
    <script src="https://use.fontawesome.com/631beff68d.js"></script> 
	<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&amp;family=Noto+Sans+KR:wght@300;400;500;700&amp;display=swap" rel="stylesheet">
	<link href="//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css" rel="stylesheet" type="text/css"><!-- theme03 -->
	<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&amp;display=swap" rel="stylesheet"><!-- theme03 -->
	<link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700&amp;family=Red+Hat+Display:wght@400;500;700&amp;display=swap" rel="stylesheet"><!-- theme04 -->
    <link rel="preload" href="https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_elice@1.0/EliceDigitalBaeum-Bd.woff2" as="font" type="font/woff2" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;600;700&amp;display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&amp;display=swap" rel="stylesheet">

    
	
	

    
    
    
    <script>try{window.EZST={q:[],register:function(a,b){this.push([a,(b.init||b)(),arguments])}}}catch(e){}</script>
    <!--ez-favicon[-->
    <!--ez-favicon]-->
    
<link rel="canonical" href="https://k-tass.com/" />
<link rel="alternate" hreflang="x-default" href="https://k-tass.com/" /><link rel="alternate" hreflang="ko-KR" href="https://k-tass.com/" />
<meta property="og:url" content="https://k-tass.com/" />
<meta property="og:title" content="주식회사 타스" />
<meta property="og:description" content="주식회사 타스는 최적의 자동화 생산 시스템을 제공합니다" />
<meta property="og:site_name" content="주식회사타스" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://k-tass.com/web/upload/share-image-1-0b8f3790483cce1ec743bae62c4742bc.png" />
<link rel="shortcut icon" href="/web/upload/favicon-01cddc03312f1b4bdf1fe0119fd4686b.ico" />
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
CAFE24.MOBILE_USE = false;
var EC_MOBILE = CAFE24.MOBILE;
var EC_MOBILE_DEVICE = CAFE24.MOBILE_DEVICE;
var EC_MOBILE_USE = CAFE24.MOBILE_USE;
CAFE24.SKIN_CODE = "skin1";
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
}},isLanguageShop : function(sLanguageCode) { return sLanguageCode === "ko_KR"; },getDefaultShopNo : function() { return 1; },getProductVer : function() { return 2; },isSDE : function() { return true; },isMode : function() {return false; },getModeName : function() {return false; },isMobileAdmin : function() {return false; },isNewProMode : function() {return true; },isExperienceMall : function() { return false; },isDcollection : function() {return false; },isYoutubeShops : function() {return false; },getYtShopsShopNo : function() {return 0; },isFrontDesignChangeRequired : function() {return false;},isG2G : function() {return false; },isGlobale : function() {return false; },getAdminID : function() {return ''},getMallID : function() {return 'tass0622'},getCurrencyFormat : function(sPriceTxt, bIsNumberFormat) { 
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
var oData = {"base_domain":"tass0622.cafe24.com","root_domain":"cafe24.com","api_domain":"cafe24api.com","is_global":false,"is_global_standard":false,"country_code":"KR","language_code":"ko_KR","admin_language_code":"ko_KR","front_language_code":"ko_KR"};
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
oPolicies: [],
sOverrideTimezone: '',
sMomentNamespace: 'EC_GLOBAL_MOMENT'
};
CAFE24.FRONT_JS_CONFIG_MANAGE = {"sSmartBannerScriptUrl":"https:\/\/app4you.cafe24.com\/SmartBanner\/tunnel\/scriptTags?vs=1563164396689206","sMallId":"tass0622","sDefaultAppDomain":"https:\/\/app4you.cafe24.com","sWebLogOffFlag":"F"};
var EC_FRONT_JS_CONFIG_MANAGE = CAFE24.getDeprecatedNamespace('EC_FRONT_JS_CONFIG_MANAGE');
typeof window.CAFE24 === "undefined" && (window.CAFE24 = {});
CAFE24.FRONTEND = {"IS_RENDERED_LOGIN":"F","FW_MANIFEST_CACHE_REVISION":2609021500,"IS_WEB_VIEW":"F"};
CAFE24.ROUTE = {"is_mobile":false,"is_need_route":false,"language_code":"ZZ","path":{"origin":"\/","result":"\/","prefix":""},"shop_no":0,"skin_code":"default","support_language_list":{"ar":"ar_EG","ar-EG":"ar_EG","de":"de_DE","de-DE":"de_DE","en":"en_US","en-IN":"en_IN","en-PH":"en_PH","en-US":"en_US","es":"es_ES","es-ES":"es_ES","hi":"hi_IN","hi-IN":"hi_IN","id":"id_ID","id-ID":"id_ID","it":"it_IT","it-IT":"it_IT","ja":"ja_JP","ja-JP":"ja_JP","ko":"ko_KR","ko-KR":"ko_KR","ms":"ms_MY","ms-MY":"ms_MY","pt":"pt_PT","pt-PT":"pt_PT","ru":"ru_RU","ru-RU":"ru_RU","th":"th_TH","th-TH":"th_TH","tr":"tr_TR","tr-TR":"tr_TR","vi":"vi_VN","vi-VN":"vi_VN","zh":"zh_CN","zh-CN":"zh_CN","zh-HK":"zh_HK","zh-MO":"zh_MO","zh-SG":"zh_SG","zh-TW":"zh_TW"}};
</script>

<link rel="stylesheet" type="text/css" href="/ind-script/optimizer.php?filename=lY2xCoAwDAX34Op39JvaEqXQ5pUkBf17BWeHrMcdNxWn5pGUDUsrp2qWDoV4qhgDsr1gn_8WVzL05Q1CBVdIX-6xQc83ayTwXDqHAkzqTZhKFvleDw&type=css&k=c39ac116ce20047f7b882a469c007f7c122f68fa&t=1753921730"  /><link rel="stylesheet" type="text/css" href="/ind-script/optimizer_user.php?filename=ldFBCgMxCAXQ_bTbniP0IF31BImRjDTRMCbQ3r4ZhtkVGpfqfyCqES8RlRI7fRHfXfYf6c0FrwQOVJ1mivhA7tdR3fRvHqQU4cnw0ZgMIyyjwKWTEYTe2vRKJ2o-2EVGqxHJjapRrZitJMjbKEYKjKRuEjtY_1l9IvbNeroxwO232WNlrJLx5KWPM-sq9blSrcRph18&type=css&k=9bd2bdfcef16cb9339db4074554c274af533c204&t=1759316819&user=T"  />

<title>주식회사 타스</title></head>
<body>	<div id="skipNavigation">
		<p><a href="#category">전체상품목록 바로가기</a></p>
		<p><a href="#contents">본문 바로가기</a></p>
	</div>
	<div id="wrap">
<header id="header" class="layout1" data-ez-layout="layout1" data-ez="contents-17wzn68-1">
	<div class="inner">
		<div class="top_nav_box" id="top_nav_box">
			<div class="xans-element- xans-layout xans-layout-logotop top_logo "><a href="/index.html"><img src="/img/mlogo.png"></a>
</div>
<!-- //top_logo -->
			<div class="top_mypage">
                <a href="javascript:;" class="eNavFold"><i aria-hidden="true" class="icon icoNav"></i></a>
			</div>
		</div><!-- //top_nav_box -->
	</div><!-- //inner -->
</header>
<!--#ez="1/10"-->
<aside id="aside" data-ez="contents-172zurq-1" class="xans-element- xans-layout xans-layout-slidepackage "><div class="img-box"><div class="bgs"></div></div>
<div class="menu-box">

    <nav class="navigation-menu" role="navigation">
		<div data-ez-module="menu-side/1"><div id="slideCateList" class="navigation-menu__category">
  <ul id="slide_add_category">
     <li>
         <a href="/ceo.html" class="view">기업소개</a>
         <p><a href="/ceo.html">CEO 인사말</a><a href="/history.html">회사연혁</a><a href="/summary.html">개요</a><a href="/certs.html">특허현황</a><a href="/location.html">오시는 길</a></p>
     </li>
     <li>
         <a href="/business1.html" class="view">사업분야</a>
         <p><a href="/business1.html">피팅 및 밸브 설비</a><a href="/business2.html">자동차 용품 설비</a><a href="/business3.html">2차 전지 설비</a><a href="/business4.html">자동화 검사 설비</a><a href="/business5.html">기타설비</a></p>
      </li>
  </ul>
  </div></div>
<!-- //menu-side/1 -->

    </nav>
    <button type="button" class="btnClose"><i aria-hidden="true" class="icon icoClose"></i>닫기</button>
    </div>
</aside>
<div data-ez-module="user-defined/1" data-ez-name="USER DEFINED" data-ez-type="plain" data-ez="module-1i47bvp-1"><style>
#aside .navigation-menu__category #slide_add_category li { margin:0 0; } 
#aside { background: rgba(255, 255, 255, 1); width:100% !important; display:flex; flex-direction:row; }
#aside .navigation-menu__category .view { font-size:34px; font-weight:500; color:#212121; padding:10px 20px; }
#aside .navigation-menu__category .view i { padding-right:10px; vertical-align:middle; }
#aside .navigation-menu__category .view:hover { font-weight:600; color:#203b71; transition: all ease .3s; }   
#aside .navigation-menu__category p { padding: 10px 20px; }
#aside .navigation-menu__category p a { display:block; padding:10px 20px; } 
#aside .navigation-menu__category p a { font-size:20px; color:#666; }
#aside .navigation-menu__category ul li { border-bottom: 1px solid #eee; padding:30px 0; }
#aside .navigation-menu__category ul li:last-child { border-bottom:none; }  
    
.dimmed { background: rgba(0,0,0,0); }
#aside .btnClose { right:100px; }
#aside .btnClose .icon:before, #aside .btnClose .icon:after { background:#222; }
    
.img-box { width: 680px; height: 100%; position: relative; }
.img-box .bgs { width: 100%; height: 100%; background: url(/img/menu_bg.jpg) no-repeat center center / cover; }

.menu-box { width:calc(100% - 880px); height:calc(100% - 100px); padding:90px 100px 0; overflow-y: scroll; scrollbar-width: none; }
   
    
@media all and (max-width:767px) {
    #aside { background: rgba(255, 255, 255, 1); z-index:99999; }
    #aside .navigation-menu { padding:0px 35px 0; }
    #aside .navigation-menu__category .view { font-size:22px; padding:10px 10px; }
    #aside .navigation-menu__category .view i { padding-right:5px; }
    #aside .btnClose { right:50px; }
    
    #aside .navigation-menu__category p a { font-size:18px; }
    
    .img-box { display:none; }
    .menu-box { width:100%; height:calc(100% - 50px); padding:50px 0 0; }
    #aside .navigation-menu__category ul li { padding:15px 0; }
    #aside .navigation-menu__category p { padding: 10px 10px; }
    #aside .navigation-menu__category p a { padding:6px 20px; }
    
} 
</style></div>
<!--#ez="1/2"-->
<div id="container" data-ez="layout-143bwi2-1">
			<div id="contents">
				<span class="xans-element- xans-layout xans-layout-mobileaction RTMB "><a href="#none" onclick="history.go(-1);return false;"></a>
</span>
				

<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.7/css/swiper.min.css">
<div class="sb-slider sb-style">
 <div class="swiper-container">
  <div class="swiper-wrapper">
      
   <div class="swiper-slide">
    <div class="slide-inner slide-bg-image" data-background="/img/main1.jpg">
     <div class="container">
      <div data-swiper-parallax="500" class="slide-title">
       <h2>TASS - Total Automation System Solution</h2>
      </div>
      <div data-swiper-parallax="700" class="slide-text">
        <span><b>주식회사 타스</b>는 최적의 자동화 생산 시스템을 제공합니다</span>
      </div>
     </div>
    </div>
   </div>

   <div class="swiper-slide">
    <div class="slide-inner slide-bg-image" data-background="/img/main2.jpg">
     <div class="container">
      <div data-swiper-parallax="500" class="slide-title">
       <h2>TASS - Total Automation System Solution</h2>
      </div>
      <div data-swiper-parallax="700" class="slide-text">
        <span><b>주식회사 타스</b>는 최적의 자동화 생산 시스템을 제공합니다</span>
      </div>
     </div>
    </div>     
   </div>
      
  </div>
  <!-- <div class="swiper-pagination"></div>
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div> -->
 </div>
</div>
<script src='//cdnjs.cloudflare.com/ajax/libs/Swiper/4.5.1/js/swiper.min.js'></script>


<div id="business"><div class="fp-tableCell">
			<div class="bg-box">
				<div class="title-box aos-init aos-animate" data-aos="fade-in">
					<h3>Our Business Line-up</h3>
				</div>
			</div>
			<div class="scroll-content">
				<div class="scroll-items">
					<div class="w1760">
						<div class="list-box">
							<div class="item short aos-init aos-animate on" data-aos="fade-up">
								<a href="/business1.html">
									<div class="figure">
										<figure>
											<img src="/img/mainsub1.jpg" alt="">
										 </figure>
									</div>
									<div class="txt">
										<h6>계장용 피팅 설비</h6>
										<span>View More</span>
									</div>
								</a>
							</div>
							<div class="item short end aos-init aos-animate on" data-aos="fade-up">
								<a href="/business2.html">
									<div class="figure">
										<figure>
											<img src="/img/mainsub04.jpg" alt="">
										 </figure>
									</div>
									<div class="txt">
										<h6>자동차 용품 설비</h6>
										<span>View More</span>
									</div>
								</a>
							</div>
							<div class="item short aos-init aos-animate on" data-aos="fade-up">
								<a href="/business1.html#main3">
									<div class="figure">
										<figure>
											<img src="/img/mainsub3.jpg" alt="">
										 </figure>
									</div>
									<div class="txt">
										<h6>볼 밸브 설비</h6>
										<span>View More</span>
									</div>
								</a>
							</div>
							<div class="item short aos-init aos-animate on" data-aos="fade-up">
								<a href="/business1.html#main4">
									<div class="figure">
										<figure>
											<img src="/img/mainsub4.jpg" alt="">
										 </figure>
									</div>
									<div class="txt">
										<h6>니들밸브 설비</h6>
										<span>View More</span>
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
</div>

<div class="bg">
    <div class="link-box">
    <div class="w1761">
        <h4>주식회사 타스<br>자동화설비 및 3D설계/조립/검사장비 문의</h4>
        <div class="link"><a href="mailto:hsh1084kr@naver.com" target="_blank">hsh1084kr@naver.com</a></div>
    </div>
    </div>
</div>

<style>
#header .inner .top_nav_box .top_logo img { filter:brightness(0) invert(1); }
#header .inner .top_nav_box .top_category > ul > li > a { color:#fff; }
.icon.icoNav { color: #fff; }
    
.sb-slider { width:100%; height:100vh; min-height:720px;display: -webkit-box;display: -ms-flexbox;display: flex;position: relative;z-index: 0;}

.sb-slider .swiper-slide {overflow: hidden;color: #fff;}
.sb-slider .swiper-container {width: 100%;height: 100%;position: absolute;left: 0;top: 0;}
.sb-slider .slide-inner {width: 100%;height: 100%;position: absolute;left: 0;top: 0;z-index: 1;background-size: cover;background-position: center;display: flex;justify-content: center;align-items: center;text-align: left;}
    
.sb-slider .swiper-button-prev,
.sb-slider .swiper-button-next {background: transparent;width: 25px;height: 25px;line-height: 23px;margin-top:100px;text-align: center;border: 1px solid #ccc;border-radius: 55px;opacity:1;visibility:visible;transition:all .3s ease;}

    
.sb-slider .swiper-button-prev {left:4%;transform:translateX(0px);}
.sb-slider .swiper-button-prev:before {font-family: "FontAwesome";content: "\f053";font-size: 9px;color: #aaa;font-style: normal;display: inline-block;vertical-align: middle;font-weight:100;}
.sb-slider .swiper-button-next {left:9%;transform:translateX(-50px);}
.sb-slider .swiper-button-next:before {font-family: "FontAwesome";content: "\f054";font-size: 9px;color: #aaa;font-style: normal;display: inline-block;vertical-align: middle;font-weight:100;}
    
.swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet { margin:0 10px; } 
.sb-slider .swiper-pagination-bullet {width: 12px;height: 12px;text-align: left;line-height: 12px;font-size: 12px;color: #fff;opacity: 0.3;background:#fff;transition:all .2s ease; }
.sb-slider .swiper-pagination-bullet-active {opacity:0.8;}
.sb-slider .swiper-container-horizontal > .swiper-pagination-bullets, .sb-slider .swiper-pagination-custom, .sb-slider .swiper-pagination-fraction {bottom: 30px;}

.sb-style { transition:all .4s ease; } 
.sb-style .slide-title, .sb-style .slide-text, .sb-style .slide-btns { margin:0 auto; text-align:left; }
.sb-style .slide-title h2 { color:#fff; font-size:60px; font-weight:500; line-height:1.1; text-transform: uppercase; letter-spacing:2px; font-family: 'DM Serif Display', serif; margin-bottom:40px; }
.sb-style .slide-text p { color:#fff; font-weight:300; font-size:17px; line-height:2.2; letter-spacing:-0.5px; opacity:0.8; }
.sb-style .slide-text span { font-size:17px; line-height:1.3; font-weight:300; opacity:0.8; letter-spacing:0px; }  
.sb-style .slide-text span br { display:none; }
    
.container { width:92%; max-width:1760px; margin:0 auto; text-align:left; position:absolute; bottom:0; padding-bottom:40px; transform: translateY(10rem); animation: up 1500ms linear forwards; }
@keyframes up { 100% { transform: translateY(0); } }  

/* business */
#business{ position: relative; }
#business .scroll-content { position: relative; overflow-y: auto; -ms-overflow-style: none; scrollbar-width: none; }
#business .bg-box { height:100%; position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: 100; mix-blend-mode: difference; pointer-events: none; }
#business .title-box { height:100%; display: flex; justify-content: center; align-items: center; text-align: center; position:sticky; top: 0; left: 0;}
#business .title-box h3 { color:#fff; font-size:110px; font-weight: 500; letter-spacing:1px; font-family: 'DM Serif Display', serif; opacity:0.2; }

.w1760 { max-width: 1450px; width:92%; margin: 0 auto; } 
.w1761 { max-width: 1760px; width:92%; margin: 0 auto; }  
    
#business .scroll-items { background: linear-gradient(to bottom, #121415, #1b1f28); padding:100px 0 100px; }
#business .list-box { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 350px 20px; padding: 100px 0 100px; }
#business .item { max-width: 620px; width: calc((100% - 20px) / 2); position: relative; align-self: flex-start; }
#business .list-box .item:nth-of-type(odd){ top:0px; }
#business .item .figure{ width: 100%; position: relative; overflow: hidden; padding-bottom: 109.679%; }
#business .item .figure figure { width: 100%; height: 100%; transition: opacity 0.8s 0.5s; }
#business .item .figure figure img { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1); transition: transform 0.8s; }

#business .item:nth-of-type(3n){ align-self: flex-start; }
#business .item.short .figure{ padding-bottom:90%; }

#business .item .txt{ display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; margin-top: 30px; }
#business .item .txt *{ font-family: var(--engFont); font-weight: 500; color: #fff; letter-spacing: -0.02em; }
#business .item .txt h6 { width: calc(100% - 200px); font-size: 28px; }
#business .item .txt span{ display: inline-block; font-size: 18px; line-height: 1; padding: 7px 30px 10px; border: 2px solid #FFF; border-radius: 100px; }
#business .item .txt span::after{ content: url("/img/business_arrow.svg"); margin-left: 15px; vertical-align: top; }

#business .title-box.aos-animate .char{ opacity: 1; transform: translateY(0); }

@media screen and (hover: hover){
	#business .item:hover .figure figure:not(.hover) img{ transform: translate(-50%, -50%) scale(1.05); }
	#business .item:hover .figure .hover img{ transform: translate(-50%, -50%) scale(1); }
}
    
.bg { width: 100vw; height:600px; background: url(/img/bottom.jpg) no-repeat center bottom / cover; z-index: 999; }
.link-box { position: absolute; bottom: 0; left: 0; right: 0; padding-bottom: 70px; }
.link-box h4 { color: #fff; font-size: 50px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.4; }
.link { overflow: hidden; margin-top: 20px; }
.link a { opacity: 1; display: inline-block; font-size: 20px; font-weight: 400; padding: 10px 0 0; color:#fff; opacity:.6; z-index: 99999; }
.link a:hover { padding-left:20px; transition:all .5s ease-in-out; }    
.link a::after{ content: url("/img/business_arrow.svg"); margin-left: 15px; vertical-align: top; }
.link a i { padding-right:10px; vertical-align:middle; }
    
.footer_margin { margin-top:0px !important; }
    
@media all and (max-width:767px) {
    .icon.icoNav { color: #fff; }
    .sb-slider { min-height:unset; }
    .sb-slider .swiper-pagination-bullet {width: 10px;height: 10px; }
    .sb-slider .swiper-button-prev, .sb-slider .swiper-button-next { display: none; }
    .sb-style .slide-title h2 { font-size:35px; line-height:1.2; margin-bottom:15px; letter-spacing:0; }
    .sb-style .slide-text span { font-size:15px; line-height:1.6; letter-spacing: -0.02em; }  
    .sb-style .slide-text span br { display:block; }
    
    .container { padding-bottom:40px; }
    
    #business .scroll-items { padding:40px 0 80px; }
    #business .bg-box { position: static; pointer-events: auto; mix-blend-mode:unset; }
    #business .list-box { gap:50px 20px; padding: 0; padding-top:0px; }
    #business .title-box { background:#121415; }
    #business .title-box h3 { font-size:35px; color:#fff; padding-top:60px; }
    .w1760 { width:calc(100% - 40px); padding: 0 20px; }
    #business .item .txt { flex-direction: column; align-items: flex-end; margin-top:20px;  }
    #business .item .txt h6 { width: 100%; font-size: 18px; text-align: right; }
    #business .item .txt span { font-size: 13px; margin-top:20px; padding: 5px 10px; }
    
    .bg { width: 100%; height:300px; }
    .link-box { padding-bottom: 30px; }
    .link-box h4 { font-size: 24px; line-height:1.5; }
    .link { margin-top:0px; }
    .link a { font-size: 15px; }
    .link a:hover { padding-left:10px; }    
    .link a i { padding-right:5px; }
}
</style>

<!--#ez="1/2"-->
			</div>
		</div>
<div class="bottom-nav RMB RTB" ez-module="bottom-navigation" data-ez="module-0r5ayxh-1">
    <ul class="bottom-nav__tabBar">
        <li><button type="button" class="btnNav eNavFold"><i aria-hidden="true" class="icon icoNav"></i>네비게이션</button></li>
        <li><button type="button" class="btnSearch eSearch">검색</button></li>
        <li><a href="/">홈</a></li>

    </ul>
    <div class="bottom-nav__top">
    </div>
</div>
<div class="footer_margin" data-ez="module-0wm4akx-1" data-ez-module="user-defined/1" data-ez-name="USER DEFINED" data-ez-type="plain"></div>
<footer id="footer" class="layout1" data-ez-layout="layout1" data-ez="module-013lvlj-1">

  <div class="xans-element- xans-layout xans-layout-footer inner "><div class="xans-element- xans-layout xans-layout-logobottom bt_logo "><a href="/"><img src="/img/mlogo.png"></a>
</div>
<!-- //bt_logo -->
<div class="bt_wrap">
			<div class="bt_info" data-ez-group="info">
                <div class="bt_info_list" data-ez-role="list">
                     <div><span><strong>주소</strong>경상남도 김해시 주촌면 서부로 1403번길 75</span></div>
                     <div><span><strong>전화</strong>070-5067-6285</span></div>
                     <div><span><strong>이메일</strong>hsh1084kr@naver.com</span></div>           
			  </div>
<!-- //bt_info_list -->
			</div>
<!-- //bt_info -->
		</div>
<!-- //bt_wrap -->
</div>
<!-- //inner -->
    <!-- <div id="fixsns"><a href="/" target="_blank" title="카카오톡 문의"><img src="/img/kakao.png"></a></div> -->
</footer>

<!--#ez="1/2"-->
<!--#ez="1/1"-->
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

	
	<div class="layer_shadow" id="layer_shadow"></div>
	<div id="layoutDimmed" class="dimmed"></div>

    
<style>
@media all and (max-width:767px) {
    #header .inner .top_nav_box .top_logo img { max-height:20px !important; }
    #container #contents { width:100%; }
    .footer_margin { margin-top:100px; }
} 
</style>
    
        <style>[pandassi-banner-group]:not([pandassi-banner-group="ready"]) { display:none !important; }</style>
        <script type="text/javascript">
            var spRndDate = new Date().getTime();
            var spBannerCode = '<script id="pandassi-banner-script" src="//tass0622.cafe24.com/web/upload/appfiles/0zdpAngaKBFnlCcCqpCU4A/e62e57adbed231dcc9bf20a9fafe9d8f.js?v='+ spRndDate +'"><\/script>';
            var spBannerScript = document.querySelector('#pandassi-banner-script');
            if (!spBannerScript) { document.write(spBannerCode) };
        </script>
    
	
	
	
	
	
	
<span itemscope="" itemtype="https://schema.org/Organization">
<link itemprop="url" href="https://k-tass.com">
</span>
<script type="text/javascript" src="/app/Eclog/js/cid.generate.js?vs=3d0b473968a0ec4ec41e3bf59df3aa51&u=tass0622.1"></script>
<script type="text/javascript" src="/app/Manage/js/inflowbeacon.js?vs=3d0b473968a0ec4ec41e3bf59df3aa51&u=tass0622.1"></script>
<script>        (function (i, s, o, g) {
            var a = s.createElement(o), m = s.getElementsByTagName(o)[0];
            var initialized = false;
            var interval = null;

            function safeInit() {
              if (initialized) return;
              if (typeof i.initCaWebAnalytics === 'function') {
                try {
                  i.initCaWebAnalytics({"mid":"tass0622","stype":"e","domain":"","shop_no":1,"lang":"ko_KR","mobile_flag":"F","send_endpoint":"https://ca-log.cafe24data.com","path_role":"MAIN"});
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
        })(window, document, 'script', "//optimizer.poxo.com/ca2/analytics.js?v=20260907");</script>
<script type="text/javascript" src="/ind-script/i18n.php?v=2609021500&lang=ko_KR&domain=front&type=" charset="utf-8"></script>

<script src="/ind-script/optimizer.php?filename=pZfLbtswEEX3sbb9DrUoUHSb2EgbxEGMxEHWI2okT0xyWD5iK19fSnaBOK5sUdnoxXs4fFyOyMqCwg3bdW7RcbAC8xeX07efOntxX6rj0kAGxDp_-RPQNvvb9-xH9nWQHrcerQbp9h8ywbwmHMcGKxMamaHIKp0IgCRwKUws9Wy7DhnLdaQOBrYEj54U5ooVap-juOsensmvlm8z8JAp0mdpSUXU4jI-92mdsaR91VsVi9AGvmarpqy9ZSnR9qkXMrhLY64slXVvxOBJ9pVVlrveXjiWUcf6wrO5kKTxogCt-yPvQMFKsT6t2YKOxtXRI8aiP1djp_aojIzj-F4KxuR3XJDE_OEdtWvBUR971IrLED-5DZkhlVdBi3ZQ8qgrg_CZ-mChodxRwGiU_Gnn0_eghLdGMpQDpCp4aGPcFw7t6-Gw9iCGZVORPGOGEisI0rddcwqsvzryQVv0uGJzUPl1B9_CGjhft9cFbVEeO_MEPO3m8uk_U9kDzLAI9UDtA1ZoUQucBtvem4UlcTyZoKE-nMwNFpLrAcP7r-LcxRZMzMfqB1Fi_zap4voHPy7q5-BT6WLllYzJiTyh69NMbWM832IzYGw7x01cdDJO6gC2HMCAa7TYXRPVClVx7OQz0L0t0QrtE7ErcGv0Yzkz0JvH5GKfcdLYKQfDOr21dzHzQZ3a0hkadpQa65ncak5uDCY4JHfNosBk6KGD1tjEHUk5il2yBzkd0d7Op6mWQY0VjbPoHJrkeL8slKlmuQyeYzIj0cExuW9SPRp_ZrRgE0zqoghxy6jQxiX1SumDO9v9Rx9XZAzp-rIsY5Z0qY1v5rTG_aIeY4uDCkYsn85Wv6ndPDejbbnnl1B8gr6Ju8KxHZihB5I3uuJUD0ggBYXE5OgG_Cpu3nHyGs8q8YDAqf6Zf9gH9iBmcMLf_f4mcTNzeJLpkbtNJuDU4cNy8HhN21j-Fw&type=js&k=f506bb3350e80602da6836006621bb326b3026a1&t=1788245873" ></script><script src="/ind-script/optimizer_user.php?filename=jc1RDkAwDMbxA_DqHIuzOAHbQlnbxbc9uL0hXoTEW5v_Ly2cr5wHjWKwkLRmhoFdKaZ6RoNnDf2mOZmhB9mDnsMvee2vtFSrzCpfldXl4O-TnEMiTBq7iWIkGX_9R6BC2EsufAc&type=js&k=f9894f86b49dd21019d1ee087db897dc092ad123&t=1759316890&user=T" ></script>
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
var aLogData = {"log_server1":"eclog2-181.cafe24.com","log_server2":"eclog2-181.cafe24.com","mid":"tass0622","stype":"e","domain":"","shop_no":1,"lang":"ko_KR","ver":2,"hash":"","ca":"cfa-js.cafe24.com\/cfa.js","etc":"","mobile_flag":"F"};
var sMileageName = '적립금';
var sMileageUnit = '[:PRICE:]원';
var sDepositName = '예치금';
var sDepositUnit = '원';
CAFE24.SHOP_CURRENCY_INFO = {"1":{"aShopCurrencyInfo":{"currency_code":"KRW","currency_no":"410","currency_symbol":"\uffe6","currency_name":"South Korean won","currency_desc":"\uffe6 \uc6d0 (\ud55c\uad6d)","decimal_place":0,"round_method_type":"F"},"aShopSubCurrencyInfo":null,"aBaseCurrencyInfo":{"currency_code":"KRW","currency_no":"410","currency_symbol":"\uffe6","currency_name":"South Korean won","currency_desc":"\uffe6 \uc6d0 (\ud55c\uad6d)","decimal_place":0,"round_method_type":"F"},"fExchangeRate":1,"fExchangeSubRate":null,"aFrontCurrencyFormat":{"head":"","tail":"\uc6d0"},"aFrontSubCurrencyFormat":{"head":"","tail":""},"bPresentmentEnabled":false,"aPresentmentCurrencyInfo":null,"fExchangePresentmentRate":null,"aFrontPresentmentCurrencyFormat":null,"bGlobaleEnabled":false}}; var SHOP_CURRENCY_INFO = CAFE24.SHOP_CURRENCY_INFO;
</script></body>
</html>


