Title: Live Content

Description: Fetched live

Source: http://ssadaaircon.com/board/gallery/read.html?no=121&board_no=8

---

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "//www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="//www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">



<head><script>(function(i, s, o, g, r) {
    var a = s.createElement(o);
    var m = s.getElementsByTagName(o)[0];
    a.async = true;
    a.src = g;
    a.onload = function() {
        if (i[r].init) {
            i[r].init('https://js-error-tracer-api.cafe24.com', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzc2FkYTAzMS5jYWZlMjQuY29tIiwiYXVkIjoianMtZXJyb3ItdHJhY2VyLWFwaS5jYWZlMjQuY29tIiwibWFsbF9pZCI6InNzYWRhMDMxIiwic2hvcF9ubyI6MSwicGF0aF9yb2xlIjoiQk9BUkRfR0FMTEVSWV9ERVRBSUwiLCJsYW5ndWFnZV9jb2RlIjoia29fS1IiLCJjb3VudHJ5X2NvZGUiOiJLUiIsImlzX3l0cyI6ZmFsc2UsImlzX2NvbnRhaW5lciI6ZmFsc2UsIndvcmtzcGFjZSI6InByb2R1Y3Rpb24ifQ.eD_y0RhAzZae79nQ20MyC_cvn1bXzi20chImapTtRLU', {"errors":{"path":"\/api\/v1\/store","collectWindowErrors":true,"preventDuplicateReports":true,"storageKeyPrefix":"EC_JET.BOARD_GALLERY_DETAIL","samplingEnabled":true,"samplingRate":0.5},"vitals":{"path":"\/api\/v1\/vitals","samplingEnabled":true,"samplingRate":0.3},"resources":{"path":"\/api\/v1\/resources","samplingEnabled":true,"samplingRate":0.5,"durationThreshold":3000}});
        }
    };
    m.parentNode.insertBefore(a, m);
}(window, document, 'script', '//assets.poxo.com/jet/jet.js', 'EC_JET'));</script>
<script type="text/javascript">window.CAFE24 = window.CAFE24 || {};CAFE24.ROUTE = {"is_mobile":false,"is_need_route":false,"language_code":"ZZ","path":{"origin":"\/board\/gallery\/read.html","result":"\/board\/gallery\/read.html","prefix":""},"shop_no":0,"skin_code":"default","support_language_list":{"ar":"ar_EG","ar-EG":"ar_EG","de":"de_DE","de-DE":"de_DE","en":"en_US","en-IN":"en_IN","en-PH":"en_PH","en-US":"en_US","es":"es_ES","es-ES":"es_ES","hi":"hi_IN","hi-IN":"hi_IN","id":"id_ID","id-ID":"id_ID","it":"it_IT","it-IT":"it_IT","ja":"ja_JP","ja-JP":"ja_JP","ko":"ko_KR","ko-KR":"ko_KR","ms":"ms_MY","ms-MY":"ms_MY","pt":"pt_PT","pt-PT":"pt_PT","ru":"ru_RU","ru-RU":"ru_RU","th":"th_TH","th-TH":"th_TH","tr":"tr_TR","tr-TR":"tr_TR","vi":"vi_VN","vi-VN":"vi_VN","zh":"zh_CN","zh-CN":"zh_CN","zh-HK":"zh_HK","zh-MO":"zh_MO","zh-SG":"zh_SG","zh-TW":"zh_TW"}};</script><script type="text/javascript">if (typeof EC_ROUTE === "undefined") {
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
<meta name="path_role" content="BOARD_GALLERY_DETAIL" />
<meta name="author" content="냉난방기 전문설치 싸다에어컨" />
<meta name="description" content="시공갤러리입니다." />
<meta name="keywords" content="시공갤러리" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.2, minimum-scale=1.0, user-scalable=yes"/>    
    <!-- PG크로스브라우징필수내용 -->
    <meta http-equiv="Cache-Control" content="no-cache"/>
    <meta http-equiv="Expires" content="0"/>
    <meta http-equiv="Pragma" content="no-cache"/>
    <!-- // PG크로스브라우징필수내용 -->

  	<!-- // 디자인모어 css 및 js -->
	
 	 <!-- 서브페이지 전체 css -->
    <!-- 1025px - 1400px 까지 해상도에서의 css -->
	<!-- 821px - 1024px 까지 해상도에서의 css -->
	<!-- 481px - 820px 까지 해상도에서의 css -->
	<!-- 220px - 480px 까지 해상도에서의 css -->
	

      <!-- 배너 슬라이드  --> <!--  삭제와 수정에 주의해주세요. -->
    
    
    <link rel="stylesheet" href="/xeicon/xeicon.min.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.0/font/bootstrap-icons.css"/>
    
	<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
	<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
    <!-- // 디자인모어 css 및 js -->


        <!-- 해당 CSS는 쇼핑몰 전체 페이지에 영향을 줍니다. 삭제와 수정에 주의해주세요. -->
    
    
    
    
    
    
    
    
    
    

    <!-- 스마트디자인에서는 JQuery 1.4.4 버전이 내장되어있습니다. 추가로 호출하면 충돌이 생길 수 있습니다. -->
     
    


    <script src="/js/jquery-1.11.0.min.js" charset="utf-8"></script> 
    <script src="/js/jquery.sidebar.js" charset="utf-8"></script>
    
<link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&amp;display=swap" rel="stylesheet"/>

    
    
<meta name="naver-site-verification" content="d94d63213bbd823d0ecc352cc62ae4b44152ef4f"/>
<!-- Google Channel Site Verification -->
<meta name="google-site-verification" content="ZJoBzdMBwu6smxmayIhd-4DM5W6Gbk2JSuA9EMVlL50" />
<!-- Google Channel Site Verification -->

<link rel="canonical" href="https://ssadaaircon.com/article/시공갤러리/8/121/" />
<meta property="og:url" content="https://ssadaaircon.com/article/시공갤러리/8/121/" />
<meta property="og:title" content="[2014년] 서울 은평 냉난방기 설치시공갤러리 - 싸다에어컨" />
<meta property="og:description" content="시공갤러리입니다." />
<meta property="og:site_name" content="싸다에어컨" />
<meta property="og:type" content="article" />
<meta name="naver-site-verification" content="c147cef1d49f4fc1caaaf5b6924ac6d9a9c2baea" />
<link rel="amphtml" href="https://ssadaaircon.com/amp/board/read.html?no=121&board_no=8" />
<link rel="shortcut icon" href="/web/upload/favicon-d7ae5baadce29bb5d4d8655be8b58fca.ico" />
<script type="text/javascript" src="//wcs.naver.net/wcslog.js"></script>
<script type="text/javascript">var CAFE24API = { instance: [], MALL_ID: 'ssada031', SHOP_NO: 1, basicAuthKeys: {}, setBasicAuthKey: function (clientId, basicAuthKey) { if (typeof basicAuthKey !== 'string') { return; } if (clientId) { CAFE24API.basicAuthKeys[clientId] = basicAuthKey; } else { CAFE24API.basicAuthKeys['default'] = basicAuthKey; } }, init: function (appInfo) { if (typeof appInfo == 'object') { if (appInfo.hasOwnProperty('client_id')) { var appKey = appInfo.client_id; } } else { var appKey = appInfo; } if (appKey) { if (!this.instance[appKey]) { CAFE24API.clientId = appKey; if (appInfo.hasOwnProperty('version')) { CAFE24API.version = appInfo.version; } else { if (CAFE24API.hasOwnProperty('version')) { delete CAFE24API.version; } } var copyObject = CAFE24API.constructor(); for (var attr in CAFE24API) { if (CAFE24API.hasOwnProperty(attr)) { copyObject[attr] = CAFE24API[attr]; } } this.instance[appKey] = copyObject; } return this.instance[appKey]; } }, initializeXhr: function () { try { return new XMLHttpRequest(); } catch (error) { return new window.ActiveXObject('Microsoft.XMLHTTP'); } }, fullPath: function (url) { return 'https://ssada031.cafe24api.com' + url; }, getLoginProvider: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'login': CAPP_ASYNC_METHODS.AppCommon.getLoginProvider() }); }, getCustomerProvider: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'login': CAPP_ASYNC_METHODS.AppCommon.getCustomerProvider() }); }, getMemberID: function (callback) { if (!CAPP_ASYNC_METHODS.IS_LOGIN) { callback(null); } else { callback(CAPP_ASYNC_METHODS.AppCommon.getMemberID()); } }, getEncryptedMemberId: function (client_id, callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, CAPP_ASYNC_METHODS.AppCommon.getEncryptedMemberId(client_id)); }, getMemberInfo: function (callback) { callback({ 'id': CAPP_ASYNC_METHODS.AppCommon.getMemberInfo() }); }, getCustomerIDInfo: function (callback) { if (!CAFE24API.__scopeErr(callback, 'application')) { return; } callback(null, { 'id': CAPP_ASYNC_METHODS.AppCommon.getCustomerIDInfo() }); }, getCustomerInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'customer': CAPP_ASYNC_METHODS.AppCommon.getCustomerInfo() }); }, getDefaultShippingAddress: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'shipping_address': CAPP_ASYNC_METHODS.AppCommon.getDefaultShippingAddress() }); }, getMileageInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'mileage': CAPP_ASYNC_METHODS.AppCommon.getMileageInfo() }); }, getPointInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'point': CAPP_ASYNC_METHODS.AppCommon.getPointInfo() }); }, getDepositInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'deposit': CAPP_ASYNC_METHODS.AppCommon.getDepositInfo() }); }, getCreditInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'customer')) { return; } callback(null, { 'credit': CAPP_ASYNC_METHODS.AppCommon.getCreditInfo() }); }, getCartList: function (callback) { if (!CAFE24API.__scopeErr(callback, 'personal')) { return; } CAPP_ASYNC_METHODS.AppCommon.getCartList().then(function (data) { callback(null, { 'carts': data }); }); }, getCartInfo: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'personal')) { return; } callback(null, { 'cart': CAPP_ASYNC_METHODS.AppCommon.getCartInfo() }); }, getCartItemList: function (callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } callback(null, { 'items': CAPP_ASYNC_METHODS.AppCommon.getCartItemList() }); }, getCartCount: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'personal')) { return; } callback(null, CAPP_ASYNC_METHODS.AppCommon.getCartCount()); }, getCouponCount: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'promotion')) { return; } callback(null, CAPP_ASYNC_METHODS.AppCommon.getCouponCount()); }, getWishCount: function (callback) { if (!CAFE24API.__chkValidSessionScope(callback, 'personal')) { return; } callback(null, CAPP_ASYNC_METHODS.AppCommon.getWishCount()); }, getShopInfo: function (callback) { if (!CAFE24API.__scopeErr(callback, 'store')) { return; } callback(null, { 'shop': CAPP_ASYNC_METHODS.AppCommon.getShopInfo() }); }, addCurrentProductToCart: function (mall_id, time, app_key, member_id, hmac, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.addCurrentProductToCart(mall_id, time, app_key, member_id, hmac).then(function (data) { callback(null, { 'cart': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error('422'), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, precreateOrder: function (mall_id, time, app_key, member_id, hmac, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.precreateOrder(mall_id, time, app_key, member_id, hmac).then(function (data) { callback(null, { 'order': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error('422'), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, calculatePayment: function (mall_id, request_time, app_key, member_id, request_data_json, hmac, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.calculatePayment(mall_id, request_time, app_key, member_id, request_data_json, hmac).then(function (data) { callback(null, { 'expected_payment': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error('422'), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, precreateOrderV2: function (mall_id, time, app_key, member_id, request_data_json, hmac, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.precreateOrderV2(mall_id, time, app_key, member_id, request_data_json, hmac).then(function (data) { callback(null, { 'order': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error('422'), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, getOrderItemList: function (start_date, end_date, order_status, page, count, order_id, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.getOrderItemList(start_date, end_date, order_status, page, count, order_id).then(function (data) { callback(null, { 'items': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, getOrderDetailInfo: function (shop_no, order_id, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.getOrderDetailInfo(shop_no, order_id).then(function (data) { callback(null, { 'orders': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, getClaimableItemList: function (order_id, customer_service_type, callback) { if (!CAFE24API.__scopeErr(callback, 'order')) { return; } CAPP_ASYNC_METHODS.AppCommon.getClaimableItemList(order_id, customer_service_type).then(function (data) { callback(null, { 'items': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, emptyCart: function (basket_shipping_type, callback) { if (!CAFE24API.__scopeErr(callback, 'personal')) { return; } CAPP_ASYNC_METHODS.AppCommon.emptyCart(basket_shipping_type).then(function (data) { callback(null, { 'result': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, deleteCartItems: function (basket_shipping_type, product_list, callback) { if (!CAFE24API.__scopeErr(callback, 'personal')) { return; } CAPP_ASYNC_METHODS.AppCommon.deleteCartItems(basket_shipping_type, product_list).then(function (data) { callback(null, { 'result': data }); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }); }, addCart: function (basket_type, prepaid_shipping_fee, product_list, callback) { if (!CAFE24API.__scopeErr(callback, 'personal')) { return; } CAPP_ASYNC_METHODS.AppCommon.addCart(basket_type, prepaid_shipping_fee, product_list).then(function (data) { callback(null, data); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }) }, addBundleProductsCart: function (basket_type, prepaid_shipping_fee, product_list, callback) { if (!CAFE24API.__scopeErr(callback, 'personal')) { return; } CAPP_ASYNC_METHODS.AppCommon.addBundleProductsCart(basket_type, prepaid_shipping_fee, product_list).then(function (data) { callback(null, data); }).catch(function (data) { if (data) { callback(new Error('422'), { 'error': { code: data.code, message: data.message } }); } else { callback(new Error(422), { 'error': { code: 422, message: 'This sdk is not available on the current page' } }); } }) }, get: function (url, callback) { return CAFE24API.complete('GET', url, this, null, callback); }, post: function (url, params, callback) { return CAFE24API.complete('POST', url, this, params, callback); }, put: function (url, params, callback) { return CAFE24API.complete('PUT', url, this, params, callback); }, delete: function (url, callback) { return CAFE24API.complete('DELETE', url, this, null, callback); }, complete: function (method, url, obj, params, callback) { var xhr = CAFE24API.sendXhr(method, url, obj, params, callback); xhr.onreadystatechange = function () { if (xhr.readyState === XMLHttpRequest.DONE) { if (xhr.status >= 200 && xhr.status <= 208) { callback(null, JSON.parse(xhr.responseText)); } else { callback(new Error(xhr.status), JSON.parse(xhr.responseText)); } } }; }, sendXhr: function (method, url, obj, params, callback) { if (method !== 'POST') { var url = obj.fullPath(url); } var xhr = obj.initializeXhr(); var queryVars = {}; if (obj.clientId) queryVars['cafe24_app_key'] = obj.clientId; if (obj.version) queryVars['cafe24_api_version'] = obj.version; var basicAuthKey = CAFE24API.basicAuthKeys[obj.clientId] || CAFE24API.basicAuthKeys['default']; if (basicAuthKey && basicAuthKey.length > 0) { queryVars['authorization'] = 'Basic ' + basicAuthKey; } if (params === null) { var seperator = url.indexOf('?') == -1 ? '?' : '&'; var queryString = []; for (var key in queryVars) { queryString.push(key + '=' + encodeURIComponent(queryVars[key])); } if (queryString.length > 0) { url = url + seperator + queryString.join('&'); } } xhr.open(method, url, true); if (typeof params == 'object' && params !== null) { xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8'); for (var key in queryVars) { params[key] = queryVars[key]; } params = 'formData=' + JSON.stringify(params); } xhr.send(params || null); return xhr; }, __sessionErr: function (callback) { callback(new Error(403), { 'error': { code: 403, message: 'Failed to get session. Only available when log in.' } }); }, __scopeErr: function (callback, scope) { if (typeof CAFE24.APPSCRIPT_SDK_DATA != "undefined" && jQuery.inArray(scope, CAFE24.APPSCRIPT_SDK_DATA) > -1) { return true; } callback(new Error(403), { 'error': { code: 403, message: 'You do not have the necessary authority(scope) to use the SDK.' } }); }, __chkValidSessionScope: function (callback, scope) { if (!CAPP_ASYNC_METHODS.IS_LOGIN) { CAFE24API.__sessionErr(callback); return false; } if (!CAFE24API.__scopeErr(callback, scope)) { return false; } return true; } }; </script>
<script type="text/javascript">
window.CAFE24 = window.CAFE24 || {};
CAFE24.MANIFEST_CACHE_REVISION = '2609161505';
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
CAFE24.SKIN_CODE = "skin4";
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
}},isLanguageShop : function(sLanguageCode) { return sLanguageCode === "ko_KR"; },getDefaultShopNo : function() { return 1; },getProductVer : function() { return 2; },isSDE : function() { return true; },isMode : function() {return false; },getModeName : function() {return false; },isMobileAdmin : function() {return false; },isNewProMode : function() {return true; },isExperienceMall : function() { return false; },isDcollection : function() {return false; },isYoutubeShops : function() {return false; },getYtShopsShopNo : function() {return 0; },isFrontDesignChangeRequired : function() {return false;},isG2G : function() {return false; },isGlobale : function() {return false; },getAdminID : function() {return ''},getMallID : function() {return 'ssada031'},getCurrencyFormat : function(sPriceTxt, bIsNumberFormat) { 
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
var oData = {"base_domain":"ssada031.cafe24.com","root_domain":"cafe24.com","api_domain":"cafe24api.com","is_global":false,"is_global_standard":false,"country_code":"KR","language_code":"ko_KR","admin_language_code":"ko_KR","front_language_code":"ko_KR"};
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
CAFE24.FRONT_JS_CONFIG_MANAGE = {"sSmartBannerScriptUrl":"https:\/\/app4you.cafe24.com\/SmartBanner\/tunnel\/scriptTags?vs=1563164396689206","sMallId":"ssada031","sDefaultAppDomain":"https:\/\/app4you.cafe24.com","sWebLogOffFlag":"F"};
var EC_FRONT_JS_CONFIG_MANAGE = CAFE24.getDeprecatedNamespace('EC_FRONT_JS_CONFIG_MANAGE');
CAFE24.FRONT_JS_CONFIG_MEMBER = {"sAuthUrl":"https:\/\/ipin-ec.cafe24.com\/certify\/v1\/?action=auth"};
var EC_FRONT_JS_CONFIG_MEMBER = CAFE24.getDeprecatedNamespace('EC_FRONT_JS_CONFIG_MEMBER');
CAFE24.FRONT_JS_CONFIG_SHOP = {"search_period":[],"calendar_config":{"maxDate":"2028-09-18","locale":"ko"}};
var EC_FRONT_JS_CONFIG_SHOP = CAFE24.getDeprecatedNamespace('EC_FRONT_JS_CONFIG_SHOP');
CAFE24.FRONT_JS_ARTICLES = {"121":{"no":121,"ucc_url":null}};
var EC_FRONT_JS_ARTICLES = CAFE24.getDeprecatedNamespace('EC_FRONT_JS_ARTICLES');
CAFE24.FRONT_JS_CONFIG_BOARD = {"iMaxAttachFileSize":2097152,"iMaxResizeWidth":1280,"iBoardNo":8};
var EC_FRONT_JS_CONFIG_BOARD = CAFE24.getDeprecatedNamespace('EC_FRONT_JS_CONFIG_BOARD');
typeof window.CAFE24 === "undefined" && (window.CAFE24 = {});
CAFE24.BOARD = {"config_8":{"board_no":8,"use_block":"F","use_report":"F"}};
CAFE24.FRONTEND = {"IS_RENDERED_LOGIN":"F","FW_MANIFEST_CACHE_REVISION":2609161505,"IS_WEB_VIEW":"F"};
CAFE24.ROUTE = {"is_mobile":false,"is_need_route":false,"language_code":"ZZ","path":{"origin":"\/board\/gallery\/read.html","result":"\/board\/gallery\/read.html","prefix":""},"shop_no":0,"skin_code":"default","support_language_list":{"ar":"ar_EG","ar-EG":"ar_EG","de":"de_DE","de-DE":"de_DE","en":"en_US","en-IN":"en_IN","en-PH":"en_PH","en-US":"en_US","es":"es_ES","es-ES":"es_ES","hi":"hi_IN","hi-IN":"hi_IN","id":"id_ID","id-ID":"id_ID","it":"it_IT","it-IT":"it_IT","ja":"ja_JP","ja-JP":"ja_JP","ko":"ko_KR","ko-KR":"ko_KR","ms":"ms_MY","ms-MY":"ms_MY","pt":"pt_PT","pt-PT":"pt_PT","ru":"ru_RU","ru-RU":"ru_RU","th":"th_TH","th-TH":"th_TH","tr":"tr_TR","tr-TR":"tr_TR","vi":"vi_VN","vi-VN":"vi_VN","zh":"zh_CN","zh-CN":"zh_CN","zh-HK":"zh_HK","zh-MO":"zh_MO","zh-SG":"zh_SG","zh-TW":"zh_TW"}};
</script>
<link rel="stylesheet" type="text/css" href="//img.echosting.cafe24.com/editors/froala/css/froala_style_ec.min.css?vs=2609161505" charset="utf-8"/>

<link rel="stylesheet" type="text/css" href="/ind-script/optimizer.php?filename=ldExDsIwDAXQPcrKOcwAF4AbIHEAJ3VRVDe2HFeC21MmKBISWb_-8x-sJjfDGYyaLJYJcmswmlSHLPMsNa7BTn-3KIcmvHiRGpLcu-qLe98A44OsBzgmpi4gGrhUCglr_drikuBaFPMEl88rZ2SqAxoc4jHuYWR0LXnaYlSFk6ANW7vGMb3imFjy1EeMVMz_Me9fPgE&type=css&k=14c70ebc0a9f7f23e5da8ec1ff8a906067997263&t=1744181180"  /><link rel="stylesheet" type="text/css" href="/ind-script/optimizer_user.php?filename=lZTBagQhDEDvu732O5wuc9hPaA-FQr8ganRkHSMaofv3dYeWQtthzU3xPUmiSbV4tFiDT6peQpqVqVWtZFtEpQmKVQXBvoG5gMeHfvhY7xqG1hUTyyTXkuFA6X_crlTweFtv5s9WgjctoJ_maZLg02kW4OeT5PL5vENHuFJjpaEGs_G30u_V8A-M5tA3eGhBKDBR5JCF1oJRquTSv4hhqQU-JGCUZgVaaOjGLK62pg95YFGaTKeMUOkHWO5265e-tv4D6kL5fQk5h-RHxcr9ZSJ5ck6spGEDoZjluU-uvYx-9VmNweIrpjZEmx6Pp3IdDWebcC_J0ajgiHjgLb4HdKay9cgn&type=css&k=9936de1f6ebdf41d7dfbbdb62e56d1e40ab8e4dd&t=1734661823&user=T"  />

<title>[2014년] 서울 은평 냉난방기 설치 시공갤러리 - 싸다에어컨</title></head>
<body id="main"><div id="skipNavigation">
    <p><a href="#category">전체상품목록 바로가기</a></p>
    <p><a href="#contents">본문 바로가기</a></p>
</div>
 

    
    
<div class="all_menu_bg"></div>
    

<!-- 오른쪽 고정 퀵 메뉴 -->
<!-- right_fixed -->
<!-- 오른쪽바 -->
<div class="sidebar">

<div id="sidebar" class="right">
	<div class="toggle" mode="on"></div>
	<div class="toggle2"><a href="#"><img src="/dmore_skin/_MD_images/r_top_bt.png"/></a></div> <!-- 상단으로 버튼 -->
	<div class="toggle3"><a href="#footer"><img src="/dmore_skin/_MD_images/r_bottom_bt.png"/></a></div> <!-- 하단으로 버튼 -->

	<div class="sidebody">

		<!-- 이곳에 코딩하시면 됩니다 -->
		<div class="position1">    

			<!-- 상담 배너 -->
 			<div class="right_banner_wrap">    
<div class="right_banner_area">    
 	         
    <div class="right_banner_01"><a href="https://ssadarent.com/" target="_blank" style="cursor:pointer" alt="카카오톡"><img src="/dmore_skin/_MD_images/r_banner_01.jpg" border="0"/></a></div>

    <div class="right_banner_02"><a href="https://talk.naver.com/W42G06" target="_blank" style="cursor:pointer" alt="네이버톡"><img src="/dmore_skin/_MD_images/r_banner_02.gif" border="0"/></a></div>
    
</div>    
</div>    


			<!-- 게시판 배너 -->
 			<div class="right_comm_wrap">

<div class="right_comm_area">

<div class="right_comm_1dan">

<!--- 커뮤니티 1 --->
<div class="right_comm_01">
<a href="/board/free/list.html?board_no=1">
<div class="right_comm_icon"><img src="/dmore_skin/_MD_images/r_comm_01.png"/>공지사항</div>	
</a>
</div>
<!--- 커뮤니티 1 --->

<!--- 커뮤니티 2 --->
<div class="right_comm_02">
<a href="/board/free/list.html?board_no=2">
<div class="right_comm_icon"><img src="/dmore_skin/_MD_images/r_comm_02.png"/>이벤트</div>	
</a>
</div>
<!--- 커뮤니티 2 --->

<!--- 커뮤니티 3 --->
<div class="right_comm_03">
<a href="/board/free/list.html?board_no=3">
<div class="right_comm_icon"><img src="/dmore_skin/_MD_images/r_comm_03.png"/>질문답변</div>	
</a>
</div>
<!--- 커뮤니티 3 --->

</div>




<div class="right_comm_2dan">

<!--- 커뮤니티 4 --->
<div class="right_comm_04">
<a href="/board/product/list.html?board_no=6">
<div class="right_comm_icon"><img src="/dmore_skin/_MD_images/r_comm_04.png"/>문의하기</div>	
</a>
</div>
<!--- 커뮤니티 4 --->

<!--- 커뮤니티 5 --->
<div class="right_comm_05">
<a href="/board/product/list.html?board_no=4">
<div class="right_comm_icon"><img src="/dmore_skin/_MD_images/r_comm_05.png"/>후기</div>	
</a>
</div>
<!--- 커뮤니티 5 --->

<!--- 커뮤니티 6 --->
<div class="right_comm_06">
<a href="/board/gallery/list.html?board_no=8">
<span class="right_comm">
<div class="right_comm_icon"><img src="/dmore_skin/_MD_images/r_comm_06.png"/>시공갤러리</div>	
</span></a>
</div>
<!--- 커뮤니티 6 --->

</div>





</div>


</div>

			<!-- 마이페이지 -->
 			<div class="right_mypage_wrap">

<div class="right_mypage_area">



<div class="right_mypage_1dan">

<!--- 마이페이지 1 --->
<div class="right_mypage_01">
<a href="/myshop/index.html">
<div class="right_mypage_icon"><img src="/dmore_skin/_MD_images/r_mypage_01.png"/>마이쇼핑</div>	
</a>
</div>
<!--- 마이페이지 1 --->

<!--- 마이페이지 2 --->
<div class="right_mypage_02">
<a href="/order/basket.html">
<div class="right_mypage_icon"><img src="/dmore_skin/_MD_images/r_mypage_02.png"/>장바구니</div>	
</a>
</div>
<!--- 마이페이지 2 --->

<!--- 마이페이지 3 --->
<div class="right_mypage_03">
<a href="/myshop/order/list.html">
<div class="right_mypage_icon"><img src="/dmore_skin/_MD_images/r_mypage_03.png"/>주문조회</div>	
</a>
</div>
<!--- 마이페이지 3 --->

</div>




<div class="right_mypage_2dan">

<!--- 마이페이지 4 --->
<div class="right_mypage_04">
<a href="https://www.doortodoor.co.kr/parcel/pa_004.jsp" target="_blank">
<div class="right_mypage_icon"><img src="/dmore_skin/_MD_images/r_mypage_04.png"/>배송조회</div>	
</a>
</div>
<!--- 마이페이지 4 --->

<!--- 마이페이지 5 --->
<div class="right_mypage_05">
<a href="/myshop/wish_list.html">
<div class="right_mypage_icon"><img src="/dmore_skin/_MD_images/r_mypage_05.png"/>관심상품</div>	
</a>
</div>
<!--- 마이페이지 5 --->

<!--- 마이페이지 6 --->
<div class="right_mypage_06">
<a href="/product/recent_view_product.html">
<span class="right_mypage">
<div class="right_mypage_icon"><img src="/dmore_skin/_MD_images/r_mypage_06.png"/>최근상품</div>	
</span></a>
</div>
<!--- 마이페이지 6 --->

</div>




<div class="right_mypage_3dan">

<!--- 마이페이지 7 --->
<div class="right_mypage_07">
<a href="/myshop/mileage/historyList.html">
<div class="right_mypage_icon"><img src="/dmore_skin/_MD_images/r_mypage_07.png"/>적립금</div>	
</a>
</div>
<!--- 마이페이지 7 --->

<!--- 마이페이지 8 --->
<div class="right_mypage_08">
<a href="/myshop/deposits/historyList.html">
<div class="right_mypage_icon"><img src="/dmore_skin/_MD_images/r_mypage_08.png"/>예치금</div>	
</a>
</div>
<!--- 마이페이지 8 --->

<!--- 마이페이지 9 --->
<div class="right_mypage_09">
<a href="/board/free/list.html?board_no=9">
<span class="right_mypage">
<div class="right_mypage_icon"><img src="/dmore_skin/_MD_images/r_mypage_09.png"/>1:1문의</div>	
</span></a>
</div>
<!--- 마이페이지 9 --->

</div>




<div class="right_mypage_4dan">

<!--- 마이페이지 10 --->
<div class="right_mypage_10">
<a href="/myshop/coupon/coupon.html">
<div class="right_mypage_icon"><img src="/dmore_skin/_MD_images/r_mypage_10.png"/>쿠폰관리</div>	
</a>
</div>
<!--- 마이페이지 10 --->

<!--- 마이페이지 11 --->
<div class="right_mypage_11">
<a href="/myshop/board_list.html">
<div class="right_mypage_icon"><img src="/dmore_skin/_MD_images/r_mypage_11.png"/>내게시물</div>	
</a>
</div>
<!--- 마이페이지 11 --->

<!--- 마이페이지 12 --->
<div class="right_mypage_12">
<a href="/member/modify.html">
<span class="right_mypage">
<div class="right_mypage_icon"><img src="/dmore_skin/_MD_images/r_mypage_12.png"/>정보수정</div>	
</span></a>
</div>
<!--- 마이페이지 12 --->

</div>


</div>

</div>
 			
 			<!-- 고객센터 -->
 			<div class="right_callcenter_wrap">    
<div class="right_callcenter_area">    

<div class="right_callcenter">

   <div class="xans-element- xans-layout xans-layout-footer "><div class="right_callcenter_title">고객센터</div>
<div class="right_callcenter_no">080-095-2222</div>
<div class="right_callcenter_infor">오전10시 ~ 오후5시</div>
</div>

</div>

</div>    
</div>    

 

 		 </div>

		<!-- 이곳에 코딩하시면 됩니다 -->


	</div>
</div>

</div>

<!-- 오른쪽바 -->
<script type="text/javascript">

<!--
	var options = {};
	options["mode"] = "right"; //위치 top, bottom, left, right
	options["animation"] = 500; //이동시간 1초 1000 (이동시간은 길고 이동길이가 짧으면 뚝뚝 끈기는 현상이 있으니 적당히 조절해주세요.)
	$("#sidebar.right").slidebar(options)

//-->

 
/* 상단으로 버튼 */
$(function(){
		$(".toggle2").click(function(){
			$("html,body").animate({scrollTop:0}, 1200);  /*1200 속도 조정 */
			return false;
		});
	}); 


/* 하단으로 버튼 */
$(function(){
		$(".toggle3").click(function(){
			$( 'html, body' ).animate( { scrollTop : $(document).height()}, 1500 ); /*1500 속도 조정 */
			return false;
		});
	}); 

</script>

 <!-- right_fixed -->

<!-- 오른쪽 고정 퀵 메뉴 -->

<!-- 상단 이벤트 배너 영역 -->
<!-- 상단 이벤트 띠 배너 영역 -->
<div id="top_event_wrap">
<div class="top_event_inner">
<div class="top_event_area">

<div class="top_event_contents"><a href="#"><font color="#00fff1">무료견적출장</font> <b>080-095-2222</b> / <font color="#00fff1">팩스번호</font> <b>031-796-8133</b></a></div>

</div>
</div>
</div>
<!-- 상단 이벤트 띠 배너 영역 -->

<!-- 상단 이벤트 배너 영역 -->
    
<!-- 상단 로그인 영역 -->
<!-- 상단 로그인 영역 -->
<div class="top_log_wrap">
<div id="top_log_wrap">
<div class="top_log_inner">
<div class="top_log_area">

<div class="top_log_contents">

    <div class="xans-element- xans-layout xans-layout-statelogoff "><ul>
		<li><a href="/member/login.html" class="log">LOGIN</a></li>
        <li><a href="/member/join.html" class="tooltipTarget">JOIN</a></li>
		<li>
			<!-- 로그인 영역(마이페이지, 커뮤니티) 영역 -->
					<div class="menu">
			<ul>
		<li class="active sub">
<a href="/myshop/index.html">MY PAGE<div class="arrow1 down1"></div></a>
		    <ul style="margin-left:-20px;  ">
		         <li class="log_mypage_01"><a href="/myshop/order/list.html">주문내역</a></li>
		         <li class="log_mypage_02"><a href="/myshop/mileage/historyList.html">적립금</a></li>
		         <li class="log_mypage_03"><a href="/order/basket.html">장바구니</a></li>
		         <li class="log_mypage_03"><a href="/myshop/wish_list.html">관심상품</a></li>
		         <li class="log_mypage_03"><a href="/product/recent_view_product.html">최근본상품</a></li>
		         <li class="log_mypage_04"><a href="/myshop/board_list.html">게시물관리</a></li>
		         <li class="log_mypage_05"><a href="/myshop/addr/list.html">배송주소록관리</a></li>
		    </ul>		
		</li>
		<li class="active sub">
<a href="/board/free/list.html?board_no=1">COMMUNITY<div class="arrow1 down1"></div></a>
		    <ul style="margin-left:-7px;  ">
		         <li class="log_comm_01"><a href="/board/free/list.html?board_no=1">공지사항</a></li>
		         <li class="log_comm_02"><a href="/board/free/list.html?board_no=2">이벤트</a></li>
		         <li class="log_comm_03"><a href="/board/free/list.html?board_no=3">자주하는질문</a></li>
		         <li class="log_comm_04"><a href="/board/product/list.html?board_no=6">문의하기</a></li>
		         <li class="log_comm_05"><a href="/board/product/list.html?board_no=4">구입후기</a></li>
		         <li class="log_comm_06"><a href="/board/gallery/list.html?board_no=8">시공갤러리</a></li>
		    </ul>		
		</li>
			</ul>
		</div>




 <!--- 임의로 수정 및 삭제시 오류가 생길 수 있습니다. --->
<style>

.menu {   position: relative;  height: 53px;   }
.menu ul {  list-style: none;  padding: 0;  margin: 0;  }
.menu:after, .menu > ul:after {  content: ".";  display: block;  clear: both;  visibility: hidden;  line-height: 0;  height: 0; }

.menu > ul > li {  display: inline-block;  position: relative;  margin: -3px 0 0 0;  padding: 0; height:53px; }
.menu > ul > li.sub > a {  padding-right: 0; }
.menu > ul > li.sub:last-child {  padding-right: 0; }

.menu ul li a {  display: block;  text-decoration: none;  }
  
.menu ul ul {  position: absolute;  left:-9999px;   top: 20px;  opacity: 0;
  -webkit-transition: opacity .5s ease, top .3s ease;
  -moz-transition: opacity .5s ease, top .3s ease;
  -ms-transition: opacity .5s ease, top .3s ease;
  -o-transition: opacity .5s ease, top .3s ease;
  transition: opacity .5s ease, top .3s ease;
  z-index: 1000;
 }

 .menu > ul > li:hover > ul {   left: auto;  top: 45px;  opacity: 1;  border-top: 2px solid #2425a7;  border-left: 1px solid #e8e8e8;  border-right: 1px solid #e8e8e8;  border-bottom: 1px solid #e8e8e8;   width: 100px; }
 

/* 하위 메뉴 */
.menu ul ul li a {
  width: 100px;
  padding: 0  0 0 0;
  line-height:28px;
  font-size: 12px;
  color: #929292;
  background: #ffffff;
  text-align:center;
  -webkit-transition: all .35s ease;
  -moz-transition: all .35s ease;
  -ms-transition: all .35s ease;
  -o-transition: all .35s ease;
  transition: all .35s ease;

}
 
.menu ul ul li:hover > a {
  background: #e8e8e8;
  color: #000;
}

.arrow1 {
   border: solid #929292;
  border-width: 0 1px 1px 0;
  display: inline-block;
  padding: 3px;
  margin:21px 0 0 6px; 
     vertical-align:top;

 }

.down1 {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
</style>

 
			<!-- 상단 배너 영역 -->
		</li>

		</ul>
</div>

    



</div>









</div>
</div>
</div>
</div>
<!-- 상단 로그인 영역 -->




<!-- 상단 로그인 영역 -->    
    
<!-- 상단 로고 영역 -->
<!-- 상단 로고 영역 -->
<div class="top_logo_wrap">
<div id="top_logo_wrap">
<div class="top_logo_inner">
<div class="top_logo_area">


<!-- 상단 로고 영역 -->
<div class="top_logo_contents">
     <a href="/">
     <img src="/dmore_skin/_MD_images/top_logo.gif" class="imgs"/>
      <img src="/dmore_skin/_MD_images/top_logo_ov.gif" class="imgs_ov"/>
      </a>
</div>



 <!--- 임의로 수정 및 삭제시 오류가 생길 수 있습니다. --->
 <style type="text/css">
.top_logo_contents .imgs {  position:absolute; left:50%;  top:-35px; transform: translate(-50%); }
.top_logo_contents .imgs:first-child{opacity:1;}
.top_logo_contents .imgs:last-child{opacity:0;}

.top_logo_contents .imgs_ov { position:absolute; left:50%;   top:-35px; transform: translate(-50%);   }
.top_logo_contents .imgs_ov:first-child{opacity:1;}
.top_logo_contents .imgs_ov:last-child{opacity:0;}
</style>
 <!--- 임의로 수정 및 삭제시 오류가 생길 수 있습니다. --->

<!-- 상단 로고 영역 -->

<!-- 상단 오른쪽 검색 영역 -->
<div class="top_search_contents">

     
<!--- 인기검색어 --->
<!--- 인기검색어 --->
<div class="top_seachword_area_warp">

<div class="tooltip2">
<div class="top_seachword_area">

    
<div class="top_seachword" id="scrolltext">
<div id="top_seachword">

<div class="searchword_form">
<!--- 인기검색어 --->
<p> </p><div class="no_title">1</div><a href="/product/search.html?banner_action=&amp;keyword=%EB%83%89%EB%82%9C%EB%B0%A9%EA%B8%B0" style="color:#656565;">냉난방기</a>
<p> </p><div class="no_title">2</div><a href="/product/search.html?banner_action=&amp;keyword=%EC%97%90%EC%96%B4%EC%BB%A8" style="color:#656565;">에어컨</a>
<p> </p><div class="no_title">3</div><a href="/product/search.html?banner_action=&amp;keyword=%EC%88%98%EB%8F%84%EA%B6%8C%EB%83%89%EB%82%9C%EB%B0%A9%EA%B8%B0" style="color:#656565;">수도권냉난방기</a>
<p> </p><div class="no_title">4</div><a href="/product/search.html?banner_action=&amp;keyword=%EC%97%85%EC%86%8C%EC%9A%A9%EB%83%89%EB%82%9C%EB%B0%A9%EA%B8%B0" style="color:#656565;">업소용냉난방기</a>
<p> </p><div class="no_title">5</div><a href="/product/search.html?banner_action=&amp;keyword=%EC%B2%9C%EC%9E%A5%ED%98%95%EB%83%89%EB%82%9C%EB%B0%A9%EA%B8%B0" style="color:#656565;">천장형냉난방기</a>
<!--- 인기검색어 --->

</div>

</div>
</div>

<div class="tooltiptext">
    <div class="tooltiptext_area">   
    <!--- 인기검색어 --->
    <p> </p><div class="no_title">1</div><a href="/product/search.html?banner_action=&amp;keyword=%EB%83%89%EB%82%9C%EB%B0%A9%EA%B8%B0" style="color:#656565;">냉난방기</a>
<p> </p><div class="no_title">2</div><a href="/product/search.html?banner_action=&amp;keyword=%EC%97%90%EC%96%B4%EC%BB%A8" style="color:#656565;">에어컨</a>
<p> </p><div class="no_title">3</div><a href="/product/search.html?banner_action=&amp;keyword=%EC%88%98%EB%8F%84%EA%B6%8C%EB%83%89%EB%82%9C%EB%B0%A9%EA%B8%B0" style="color:#656565;">수도권냉난방기</a>
<p> </p><div class="no_title">4</div><a href="/product/search.html?banner_action=&amp;keyword=%EC%97%85%EC%86%8C%EC%9A%A9%EB%83%89%EB%82%9C%EB%B0%A9%EA%B8%B0" style="color:#656565;">업소용냉난방기</a>
<p> </p><div class="no_title">5</div><a href="/product/search.html?banner_action=&amp;keyword=%EC%B2%9C%EC%9E%A5%ED%98%95%EB%83%89%EB%82%9C%EB%B0%A9%EA%B8%B0" style="color:#656565;">천장형냉난방기</a>
    <!--- 인기검색어 --->
    </div>
</div>

</div>
</div>
</div>
<!--- 인기검색어 --->



 <!--- 임의로 수정 및 삭제시 오류가 생길 수 있습니다. --->
<style>
.no_title { width:22px;  height:22px; line-height:23px; float:left; text-align:center; background:#2425a7; color:#fff;  border-radius:3px; margin:0 5px 0 0;}

.tooltip2 { position: relative; font-size:13px; }
.tooltip2 .tooltiptext {
    font-size:13px;
    visibility: hidden;
    width: 110px;
    background-color: #ffffff;
    color: #000000;
    border-radius: 5px;
    padding:0 10px 3px 5px;
	border:1px solid #e6e6e6;
	position: absolute;
    z-index:999999;
    top: 33px;
    left:-5px;
    line-height:23px;
    opacity: 0.1;
    transition: all 0.5s ease;
}

.tooltip2 .tooltiptext_area p { display: inline-block; padding:0; width:100%; text-align:left;  margin:2px 0 2px 0; font-size:13px;  }
.tooltip2 .tooltiptext_area a:hover { color:#000; font-weight:bold;   }
.tooltip2:hover .tooltiptext { visibility: visible; opacity: 1; }

 

 
</style>



<script type="text/javascript">
var scrollheight = $("#top_seachword").height();

function scrolltext(dur){
  $("#top_seachword").animate({"top":"-=23"},{
    duration: dur,
    easing: "linear",
    complete:function(){
      $("#top_seachword").children(":last").after("<div style='line-height:23px;'>"+
          $("#top_seachword").children(":first").html()+"</div>");
      if($("#top_seachword").children(":first").height() <=
           (parseInt($("#top_seachword").css("top"))*-1)){
        $("#top_seachword").children(":first").remove();
        $("#top_seachword").css({"top":0});
      }
      setTimeout("scrolltext(1000)", 2000);
    }
  });
}
setTimeout("scrolltext(1000)", 2000);
</script>





<!--- 인기검색어 --->

<!--- 검색창 --->
 <div class="top_seachform">


			   <form id="searchBarForm" name="" action="/product/search.html" method="get" target="_self" enctype="multipart/form-data" >
<input id="banner_action" name="banner_action" value="" type="hidden"  /><div class="xans-element- xans-layout xans-layout-searchheader "><!--
                $product_page=/product/detail.html
                $category_page=/product/list.html
            -->
<fieldset>
                <legend>검색</legend>
                 <input id="keyword" name="keyword" fw-filter="" fw-label="검색어" fw-msg="" class="inputTypeText" placeholder="" onmousedown="SEARCH_BANNER.clickSearchForm(this)" value="" type="text"  /><input type="image" src="/dmore_skin/_MD_images/search_bt.gif" alt="검색" onclick="SEARCH_BANNER.submitSearchBanner(this); return false;"/>
</fieldset>
</div>
</form>			   


</div>
<!--- 검색창 --->

<!--- 장바구니 아이콘 --->
<div class="top_basket_icon">
<a href="/order/basket.html"><img src="/dmore_skin/_MD_images/top_basket_icon.png"/>
 <span class="xans-element- xans-layout xans-layout-statelogoff cart_count displaynone EC-Layout_Basket-count-display "><span class="EC-Layout-Basket-count"></span>
</span>
</a>
</div>


 
<!--- 장바구니 아이콘 --->
    




</div>
 




<!-- 상단 오른쪽 검색 영역 -->






</div>
</div>
</div>
</div>
<!-- 상단 로고 영역 -->

<!-- 상단 로고 영역 -->
       
<!--- 상단 모바일 로고 영역 --->
<div class="top_logo_all_768">
<div class="top_logo_ta_768">

<!--- 왼쪽 --->
<div class="top_logo_left_768">

<!--- 아이콘 --->
<div class="top_menu_icon">
<i class="xi-bars"></i>
</div>
<!--- 아이콘 --->

</div>
<!--- 왼쪽 --->

<!--- 가운데쪽 --->
<div class="top_logo_center_768">
<a href="/"><img src="/dmore_skin/_MD_images/mo_top_logo_img.gif"/></a>
 
</div>
<!--- 가운데쪽 --->

<!--- 오른쪽 --->
<div class="top_logo_right_768">
<span><a href="/myshop/index.html"><i class="xi-user-o"></i></a></span>
<span><a href="/order/basket.html"><i class="xi-cart-o"></i>
<div class="xans-element- xans-layout xans-layout-statelogoff cart_count_mo displaynone EC-Layout_Basket-count-display "><div class="EC-Layout-Basket-count"></div>
</div>
</a>
</span>
<span><a href="/product/search.html"><i class="xi-search"></i></a></span>

 
</div>
<!--- 오른쪽 --->

</div>
</div>

<!--- 로고영역 --->

<!--- 전체메뉴 --->


<div class="all_menu_768">

<!--- 닫기버튼 --->
<div class="all_menu_close_bt">
<div class="all_menu_close_bt_st">
<i class="xi-close-circle-o"></i>  
</div>
</div>
<!--- 닫기버튼 --->

<!--- 환영문구 --->
<div class="all_left_text">

<div class="all_left_text_01">

<div class="xans-element- xans-layout xans-layout-statelogoff all_left_text_02 "><p>고객님은 <b>"로그아웃"</b>상태입니다.</p>
<p>회원가입을 하시면 더 많은 이벤트 혜택을 받으실 수 있습니다.</p>
<!-- 로그인 전 -->
</div>


</div>
</div>
<!--- 환영문구 --->

<!--- 로그인 --->
<div class="all_left_01_area">



<ul id="tabs">
    <li><a href="#" name="tab1">마이페이지</a></li>
    <li><a href="#" name="tab2">커뮤니티</a></li>
 </ul>

<div id="tab_content"> 
  


<div id="tab1">

<div class="xans-element- xans-layout xans-layout-statelogoff myshop_login "><ul>
    <li><a href="/member/login.html"><i class="xi-lock-o"></i><br/>로그인</a></li>
    <li><a href="/member/join.html"><i class="xi-users-plus"></i><br/>회원가입</a></li>
    <li><a href="/order/basket.html"><i class="xi-cart-o"></i><br/>장바구니</a></li>
    <li><a href="/myshop/index.html"><i class="xi-user-o"></i><br/>마이페이지</a></li>
</ul>
</div>

  
 
<div class="myshop_main">
<ul>
    <li class="wishList" style="letter-spacing: -0.1em;"><a href="/board/gallery/list.html?board_no=8"><i class="xi-heart-o"></i><br/><font color="#ff0000">시공갤러리</font></a></li>
    <li class="recentList"><a href="/product/recent_view_product.html"><i class="xi-eye-o"></i><br/>본 상품</a></li>
    <li class="comm_faq"><a href="/myshop/order/list.html"><i class="xi-forum-o"></i><br/>FAQ</a></li>
    <li class="orderList"><a href="/myshop/order/list.html"><i class="xi-truck"></i><br/>주문배송</a></li>
</ul>
</div>


</div>



<div id="tab2">

<div class="tab_comm">
<ul>
    <li><a href="/board/free/list.html?board_no=1"><i class="xi-crown"></i><br/>공지사항</a></li>
    <li><a href="/board/free/list.html?board_no=2"><i class="xi-gift-o"></i><br/>이벤트</a></li>
    <li><a href="/board/product/list.html?board_no=6"><i class="xi-comment-o"></i><br/>상품Q&amp;A</a></li>
    <li><a href="/board/product/list.html?board_no=4"><i class="xi-library"></i><br/>구입후기</a></li>
</ul>
</div>
 
<div class="myshop_main">
<ul>
    <li class="wishList"><a href="/myshop/wish_list.html"><i class="xi-heart-o"></i><br/>관심상품</a></li>
    <li class="recentList"><a href="/myshop/recent_list.html"><i class="xi-eye-o"></i><br/>본 상품</a></li>
    <li class="comm_faq"><a href="/myshop/order/list.html"><i class="xi-forum-o"></i><br/>FAQ</a></li>
    <li class="orderList"><a href="/myshop/order/list.html"><i class="xi-truck"></i><br/>주문배송</a></li>
</ul>
</div>

</div>





 </div>




 </div>


 
<script>
$(document).ready(function() {
    $("#tab_content").find("[id^='tab']").hide(); // Hide all content
    $("#tabs li:first").attr("id","current"); // Activate the first tab
    $("#tab_content #tab1").fadeIn(); // Show first tab's content
    
    $('#tabs a').click(function(e) {
        e.preventDefault();
        if ($(this).closest("li").attr("id") == "current"){ //detection for current tab
         return;       
        }
        else{             
          $("#tab_content").find("[id^='tab']").hide(); // Hide all content
          $("#tabs li").attr("id",""); //Reset id's
          $(this).parent().attr("id","current"); // Activate this
          $('#' + $(this).attr('name')).fadeIn(); // Show content for the current tab
        }
    });
});
</script>

<style>
#tabs {    overflow: hidden;   width:100%;   margin:20px 0 0 0;    list-style: none; }
#tabs li {    width:50%;   float: left;  margin: 0 0 0 0;    border : 1px solid #ddddec;    box-sizing:border-box; }
#tabs a {   position: relative;   width:100%;    text-align:center;   float: left;   background: #EFEFEF;   color: #444;   font-size:13px;     line-height:35px; }

#tabs a:hover,
#tabs a:hover::after,
#tabs a:focus,
#tabs a:focus::after {
  background: #fff;
}

#tabs a:focus {   outline: 0; }

#tabs a::after {
  content:'';
  position:absolute;
  z-index: 1;
  top: 0;
   bottom: 0;
   }

#tabs #current a,
#tabs #current a::after {
  background: #fff;
  z-index: 3;
}

#tab_content {   background: #fff;   padding: 0 0 0 0;   width:100%;      position: relative;  z-index: 2; }
 

</style>
 

<!--- 로그인 --->

<div class="all_left_line"></div>
 


 

<div class="all_left_03_area">
<div class="all_left_cate_title">CATEGORY VIEW</div>
</div>

<aside id="aside" class="xans-element- xans-layout xans-layout-slidepackage "><div id="slideCateList" class="categoryCont">
       
        <ul class="xans-element- xans-layout xans-layout-category categoryList"><li id="cate131" class="xans-record-">
                <a href="#none" class="cate" cate="?cate_no=131">삼성</a>
                <a href="/product/list.html?cate_no=131" class="view">상품보기</a>
                <!--button type="button" class="icoBookmark" id="icoBookmark">즐겨찾기 추가</button-->
            </li>
<li id="cate130" class="xans-record-">
                <a href="#none" class="cate" cate="?cate_no=130">LG</a>
                <a href="/product/list.html?cate_no=130" class="view">상품보기</a>
                <!--button type="button" class="icoBookmark" id="icoBookmark">즐겨찾기 추가</button-->
            </li>
<li id="cate132" class="xans-record-">
                <a href="#none" class="cate" cate="?cate_no=132">캐리어</a>
                <a href="/product/list.html?cate_no=132" class="view">상품보기</a>
                <!--button type="button" class="icoBookmark" id="icoBookmark">즐겨찾기 추가</button-->
            </li>
<li id="cate156" class="xans-record-">
                <a href="#none" class="cate" cate="?cate_no=156">1등급</a>
                <a href="/product/list.html?cate_no=156" class="view">상품보기</a>
                <!--button type="button" class="icoBookmark" id="icoBookmark">즐겨찾기 추가</button-->
            </li>
<li id="cate109" class="xans-record-">
                <a href="#none" class="cate" cate="?cate_no=109">개인결제창</a>
                <a href="/product/list.html?cate_no=109" class="view">상품보기</a>
                <!--button type="button" class="icoBookmark" id="icoBookmark">즐겨찾기 추가</button-->
            </li>
<li id="cate157" class="xans-record-">
                <a href="#none" class="cate" cate="?cate_no=157">이벤트 특가</a>
                <a href="/product/list.html?cate_no=157" class="view">상품보기</a>
                <!--button type="button" class="icoBookmark" id="icoBookmark">즐겨찾기 추가</button-->
            </li>
</ul>
        
        
 
 
		        
 
        
        
        
    </div>
</aside>

 

 

<script>

$(document).ready(function() {
  $(".all_left_shop").click(function() // 클릭할 클래스
  {
    $(".all_left_cate_sub").slideToggle(500);
  });
});
</script>

  
 
 

 
 
<div class="all_left_line all_left_line_sns"></div>
<!--- sns --->

<!--- sns --->
</div>

<!--- 전체메뉴 --->



<!--- 임의로 수정 및 삭제시 오류가 발생할 수 있으니 꼭! 백업 후 수정하시길 바랍니다. --->
<script>
$(window).scroll(function(){ 
    var height = $(document).scrollTop(); //실시간으로 스크롤의 높이를 측정
    if(height > 0){ 
    $('.top_logo_all_768').addClass('top_logo_all_768_fixed'); 
    }else if(height == 0){ 
      $('.top_logo_all_768').removeClass('top_logo_all_768_fixed');  
    } 
  });



 
$(document).ready(function() {

  $(".top_menu_icon").click(function() // 클릭할 클래스
  {
	$('.all_menu_bg').css({'display':'block'});
   $('.all_menu_768').css({'animation-name':'all_menu_768'});
   $('.all_menu_768').css({'animation-play-state':'running'});  
 
  });
});

$(document).ready(function() {
  $(".all_menu_close_bt_st").click(function() // 클릭할 클래스
  {
	$('.all_menu_bg').css({'display':'none'});
   $('.all_menu_768').css({'animation-name':'all_menu_768_close'});  
  
  });
});


 
</script>


 
<!--- 상단 모바일 로고 영역 --->
    
<!-- 상단 메뉴 영역 -->
 <div id="top_menu_wrap">
 <div class="top_menu_inner">
 <div class="top_menu_area">

<!-- top_menu_area -->
<div class="top_menu">



<div class="d_cate_wrap">	
<div class="inner">
        
<!-- 왼쪽 전체분류 영역 -->
  <!-- d_fullCate-->        
<div class="xans-element- xans-layout xans-layout-category d_fullCate"><div class="cate_total">
                <div class="toggle"><i></i></div>
                <div class="cate_total_title">브랜드전체보기</div>
            </div>
<div class="position">      
                <div class="inner_area">
                    <ul class="d1_wrap">
                        <li data-param="?cate_no=131" class="d1 xans-record-"><a href="/product/list.html?cate_no=131">삼성</a></li>
                        <li data-param="?cate_no=130" class="d1 xans-record-"><a href="/product/list.html?cate_no=130">LG</a></li>
                        <li data-param="?cate_no=132" class="d1 xans-record-"><a href="/product/list.html?cate_no=132">캐리어</a></li>
<li data-param="?cate_no=156" class="d1 xans-record-"><a href="/product/list.html?cate_no=156">1등급</a></li>
<li data-param="?cate_no=109" class="d1 xans-record-"><a href="/product/list.html?cate_no=109">개인결제창</a></li>
<li data-param="?cate_no=157" class="d1 xans-record-"><a href="/product/list.html?cate_no=157">이벤트 특가</a></li>
                         <li class="d1">
<a href="/board/free/list.html?board_no=1">COMMUNITY</a>
                            <div class="d2_wrap">
                                <div class="box">
                                    <ul class="xans-element- xans-layout xans-layout-boardinfo"><li class="d2 xans-record-"><a href="/board/공지사항/1/">공지사항</a></li>
<li class="d2 xans-record-"><a href="/board/이벤트/2/">이벤트</a></li>
<li class="d2 xans-record-"><a href="/board/질문답변/3/">질문답변</a></li>
<li class="d2 xans-record-"><a href="/board/구입후기/4/">구입후기</a></li>
</ul>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <!-- ul class="cs_wrap">
                        <li><a href="/product/list.html?cate_no=25">핫딜</a></li>
                        <li><a href="/product/list.html?cate_no=25">신상품세일</a></li>
                        <li><a href="/product/list.html?cate_no=25">정기배송</a></li>
                    </ul -->
                    
                </div>
                <div class="clear"></div>
            </div>
</div>
     
<!-- /d_fullCate-->
    
   
<!-- 왼쪽 전체분류 영역 -->
    
<!-- 상품분류 전체 영역 -->
        <!-- d_cate-->
        <div class="xans-element- xans-layout xans-layout-category d_cate"><div class="position">            
                <ul class="d1_wrap">
                    <li data-param="?cate_no=131" class="d1 xans-record-"><a href="/product/list.html?cate_no=131">삼성</a></li>
                    <li data-param="?cate_no=130" class="d1 xans-record-"><a href="/product/list.html?cate_no=130">LG</a></li>
<li data-param="?cate_no=132" class="d1 xans-record-"><a href="/product/list.html?cate_no=132">캐리어</a></li>
<li data-param="?cate_no=156" class="d1 xans-record-"><a href="/product/list.html?cate_no=156">1등급</a></li>
<li data-param="?cate_no=109" class="d1 xans-record-"><a href="/product/list.html?cate_no=109">개인결제창</a></li>
<li data-param="?cate_no=157" class="d1 xans-record-"><a href="/product/list.html?cate_no=157">이벤트 특가</a></li>
                    
                    <li class="d1">
<a href="/board/gallery/list.html?board_no=8">시공갤러리</a>                
                    </li>
<li class="d1">
<a href="/board/free/list.html?board_no=1">커뮤니티</a>
                        <div class="d2_wrap">
                            <div class="box">
                                <ul class="xans-element- xans-layout xans-layout-boardinfo"><li class="d2 xans-record-"><a href="/board/공지사항/1/">공지사항</a></li>
<li class="d2 xans-record-"><a href="/board/이벤트/2/">이벤트</a></li>
<li class="d2 xans-record-"><a href="/board/질문답변/3/">질문답변</a></li>
<li class="d2 xans-record-"><a href="/board/구입후기/4/">구입후기</a></li>
</ul>
                            </div>
                		</div>
                    </li>
                    
                </ul>
                <div class="clear"></div>
            </div>
</div>
        <!-- /d_cate-->
<!-- 상품분류 전체 영역 --> 
</div>
</div>        
             
             
</div>
<!-- top_menu_area -->


</div>
</div>
</div>
			   
 <!--- 임의로 수정 및 삭제시 오류가 생길 수 있습니다. --->
 <script>
$(window).scroll(function(){ 
    var height = $(document).scrollTop(); //실시간으로 스크롤의 높이를 측정
    if(height > 0){ 
      $('#top_menu_wrap').addClass('top_menu_wrap_fixed'); 
    }else if(height == 0){ 
      $('#top_menu_wrap').removeClass('top_menu_wrap_fixed'); 
    } 
  });

</script>
 <!--- 임의로 수정 및 삭제시 오류가 생길 수 있습니다. --->

<!-- 상단 메뉴 영역 -->
    
<!-- 상단 메뉴(모바일) 영역 -->
<div id="top_cate_wrap">
<div class="top_cate_inner">
<div class="top_cate_area">
    
 
    <!-- 상품분류 영역 -->
    <div class="menu_cate">  
    <div class="menu_cate_area">    
        
      
      <div id="slideCateList" class="categoryCont">
           <ul class="xans-element- xans-layout xans-layout-category categoryList4"><li id="cate131" class="xans-record-"><a href="/product/list.html?cate_no=131" class="cate">삼성</a></li>
<li id="cate130" class="xans-record-"><a href="/product/list.html?cate_no=130" class="cate">LG</a></li>
<li id="cate132" class="xans-record-"><a href="/product/list.html?cate_no=132" class="cate">캐리어</a></li>
<li id="cate156" class="xans-record-"><a href="/product/list.html?cate_no=156" class="cate">1등급</a></li>
<li id="cate109" class="xans-record-"><a href="/product/list.html?cate_no=109" class="cate">개인결제창</a></li>
<li id="cate157" class="xans-record-"><a href="/product/list.html?cate_no=157" class="cate">이벤트 특가</a></li>
</ul>
      </div>	  
        
    </div>            
    </div>    
    <!-- 상품분류 영역 -->  
 

 


	</div>
	</div>
	</div>


<!-- 임의로 수정 및 삭제 시 오류가 발생할 수 있습니다!! -->
<style>
    
/* 상단 메뉴 영역 */
#top_cate_wrap {  }
#top_cate_wrap .top_cate_inner { position:relative; width:100%; margin:0 auto; *zoom:1;  }
#top_cate_wrap .top_cate_area { width:100%; margin:0 0 0 0; }

 
#slideCateList .categoryList4 { font-size:0; line-height:0;   border-top :1px solid #000000; border-bottom :1px solid #000000; background:#00fff1; }
#slideCateList .categoryList4 > li { display:inline-block; width:33.3333333%; margin:0 0 0 ; text-align:Center; font-size:12px; line-height:40px; vertical-align:top;   border-bottom:1px solid #000;  border-right:1px solid #000; box-sizing:border-box;}

#slideCateList .categoryList4 > li:nth-child(3) { border-right:0; } /* 4번째 카테고리 오른쪽 라인 삭제 */
#slideCateList .categoryList4 > li:nth-child(6) { border-right:0; } /* 8번째 카테고리 오른쪽 라인 삭제 */
#slideCateList .categoryList4 > li:nth-child(9) { border-right:0; } /* 12번째 카테고리 오른쪽 라인 삭제 */
#slideCateList .categoryList4 > li:nth-child(12) { border-right:0; } /* 16번째 카테고리 오른쪽 라인 삭제 */ 

 
.top_cate_wrap_fixed { position:fixed; top:80px; background-color:#fff; width:100%;   border-bottom:1px solid #e8e8e8; border-top:1px solid #e8e8e8; z-index:999999; }
 


@media all and (min-width:481px) and (max-width:1400px) { 
.top_cate_wrap_fixed { position:fixed; top:80px; background-color:#fff; width:100%;  border-bottom:1px solid #e8e8e8; border-top:1px solid #e8e8e8; z-index:999999; }
}

 
</style>    
    
<script>
    $('.arrow').on('click', function() {
    $(this).toggleClass('active');
});
    
    
$(window).scroll(function(){ 
    var height = $(document).scrollTop(); //실시간으로 스크롤의 높이를 측정
    if(height > 0){ 
      $('#top_cate_wrap').addClass('top_cate_wrap_fixed'); 
    }else if(height == 0){ 
      $('#top_cate_wrap').removeClass('top_cate_wrap_fixed'); 
    } 
  });    
    
 </script>   
<!-- 상단 메뉴(모바일) 영역 -->
    
 
    
    <!--- 서브 내용 --->
<div class="sub_all">
<div class="sub_ta">

<div class="sub_left">

    <!-- 고객센터 왼쪽 영역 -->  
        <div class="sub_left_tilte">고객센터</div>
    
    
             <div class="xans-element- xans-layout xans-layout-boardinfo"><ul>
                    <li class="BoardInfo xans-record-">
<a href="/board/공지사항/1/">공지사항</a> </li>
                    <li class="BoardInfo xans-record-">
<a href="/board/이벤트/2/">이벤트</a> </li>
<li class="BoardInfo xans-record-">
<a href="/board/질문답변/3/">질문답변</a> </li>
<li class="BoardInfo xans-record-">
<a href="/board/구입후기/4/">구입후기</a> </li>
                </ul>
</div>
   
    
    
       <div class="sub_left_callcenter">
            <div class="xans-element- xans-layout xans-layout-footer "><div class="sub_left_callcenter_title">고객센터안내</div>
<div class="sub_left_callcenter_no">080-095-2222</div>
<div class="sub_left_callcenter_infor">오전10시 ~ 오후5시</div>
</div>
       </div>     
    
       <a href="/board/product/list.html?board_no=6">
           <div class="sub_left_comm_01"><i class="xi-message"></i>상품문의하기</div>
       </a>
    
       <a href="https://talk.naver.com/W42G06" target="_blank">
           <div class="sub_left_comm_03"><i class="xi-naver-square"></i>네이버톡톡 문의하기</div>
       </a>      
    
    
    
    <!-- 하단 고객센터 영역 -->  

</div>    
    
<div class="sub_board_mo">

<div class="xans-element- xans-board xans-board-readpackage-8 xans-board-readpackage xans-board-8 "><div class="xans-element- xans-board xans-board-title-8 xans-board-title xans-board-8 "><!--- 타이틀 --->
<div class="dmore_sub_title_ta">
        <span class="dmore_sub_title"><font color="#333333">시공갤러리</font></span>
    </div>
<!--- 타이틀 --->
</div>
<form id="BoardDelForm" name="" action="/exec/front/Board/del/8" method="post" target="_self" enctype="multipart/form-data" >
<input id="no" name="no" value="121" type="hidden"  />
<input id="bulletin_no" name="bulletin_no" value="122" type="hidden"  />
<input id="board_no" name="board_no" value="8" type="hidden"  />
<input id="list_url" name="list_url" value="/board/gallery/list.html?board_no=8" type="hidden"  />
<input id="bdf_modify_url" name="bdf_modify_url" value="/board/gallery/modify.html?board_act=edit&amp;no=121&amp;board_no=8" type="hidden"  />
<input id="bdf_del_url" name="bdf_del_url" value="/exec/front/Board/del/8" type="hidden"  />
<input id="bdf_action_type" name="bdf_action_type" value="" type="hidden"  /><div class="xans-element- xans-board xans-board-read-8 xans-board-read xans-board-8"><!--
            $delete_success_url = /board/gallery/list.html
            $login_page_url = /member/login.html
            $deny_access_url = /board/gallery/list.html
        -->
<div class="">
            <table border="1" summary="">
            <caption>게시판 상세</caption>
            <colgroup>
                <col style="width:130px;"/>
                <col style="width:auto;"/>
            </colgroup>
            <tbody>
            <!--- 상세내용 --->

			<div class="do_board_read_ta">

			<div class="do_board_read_01">[2014년] 서울 은평 냉난방기 설치</div>

			<div class="do_board_read_02"> 관리자			<span class="displaynone">(ip:)</span>
			<span>/ 2026-09-18</span>
			<span>/ <img src="//img.echosting.cafe24.com/skin/base/board/ico_point0.gif" alt="0점" style="margin-top:-2px;"/></span>
			<span>/ 조회수 20</span>
			<span style="display:block; margin-top:5px;"> <span class="txtNum displaynone"> <a href="#none" class="btnNormal" onclick="BOARD_READ.article_vote('/exec/front/Board/vote/8?no=121&page=&return_url=%2Fboard%2Fgallery%2Fread.html&eb1=b71482f393817349ece5d4393fad9581&board_no=8');"><img src="//img.echosting.cafe24.com/skin/base/common/btn_icon_recommend.gif" alt=""/> 추천하기</a></span>
			</span>
</div>

			<div class="do_board_read_03"><img src="//ssadaaircon.com/file_data/ssada031/2016/09/21/9f23d7120c25ff46d07aa3c4f22c2723.jpg"  border="0" alt="" width="587px" /><br><br/><div class="fr-view fr-view-article"><p>&nbsp;</p><p>싸다에어컨<br /><a href="http://www.ssadaaircon.com">www.ssadaaircon.com</a><br />친절상담 080-095-2222</p><p>&nbsp;</p><p><img style="width: 960px; height: 720px;" src="http://ssadaaircon.com/web/upload/NNEditor/20160921/14267324962626ADD_FILE1gal1.jpg" vspace="0" hspace="5"></p><p>&nbsp;</p></div></div>
                
			<div class="ec-base-button report-button">
			<span class="gRight">
			    <a href="#none" class="btnNormalFix sizeS displaynone" onclick="BOARD_READ.board_report_display('8','121');">신고</a>
			    <a href="#none" class="btnNormalFix sizeS ec-block-target-request-btn" onclick="APP_BOARD_BLOCK.setBlock('8','121','MEMBER');">차단</a>
			    <a href="#none" class="btnNormalFix sizeS ec-unblock-target-request-btn" onclick="APP_BOARD_BLOCK.unBlock('8','121','MEMBER');">차단해제</a>
			</span>
			</div>
			
<div class="boardReport displaynone ec-base-layer">
    
    
    <div class="header">
        <h1>게시글 신고하기</h1>
    </div>
    <div class="content">
        <h4>신고사유</h4>
        <div class="box">
            <div class="selectBox">
                <ul>
                    <li><label class="label"><input type="radio" name="report_reason" value="1" class="radio" checked/>관련없는 내용</label></li>
                    <li><label class="label"><input type="radio" name="report_reason" value="2" class="radio"/>욕설/비방</label></li>
                    <li><label class="label"><input type="radio" name="report_reason" value="3" class="radio"/>개인정보유출</label></li>
                    <li><label class="label"><input type="radio" name="report_reason" value="4" class="radio"/>광고/홍보글</label></li>
                    <li><label class="label"><input type="radio" name="report_reason" value="5" class="radio"/>기타</label></li>
                </ul>
            </div>
        </div>
        <p class="summary">신고해주신 내용은 쇼핑몰 운영자의 검토 후 내부 운영 정책에 의해 처리가 진행됩니다.</p>
    </div>


    <div class="ec-base-button">
        <a href="#none" class="btnSubmitFix sizeS" onclick="BOARD_READ.board_report('/exec/front/Board/report/8','121');">신고</a>
        <a href="#none" class="btnNormalFix sizeS" onclick="BOARD_READ.board_report_displaynone('');">취소</a>
    </div>
</div>

                
                
			<div class=" do_board_read_04">첨부파일 : <a href="#none" onclick="BOARD_READ.file_download('/exec/front/Board/download/?no=121&realname=2016/09/21/9f23d7120c25ff46d07aa3c4f22c2723.jpg&filename=1.jpg');">1.jpg</a> </div>
			<div class="displaynone  do_board_read_05">비밀번호 : <input id="password" name="password" fw-filter="" fw-label="비밀번호" fw-msg="" onkeydown="if (event.keyCode == 13 || event.which == 13) { return false; }" autocomplete="new-password" value="" type="password"  /> <span class="ec-base-help txtInfo">수정 및 삭제하려면 비밀번호를 입력하세요.</span>
</div>

			</div>

			<!--- 상세내용 --->

            </tbody>
            </table>
        </div>
<div class="ec-base-button ">
            <span class="gRight">
                <span class="displaynone">
                    <a href="#none" onclick="" class="btnNormalFix sizeS admin displaynone"></a>
                    <a href="#none" onclick="" class="btnNormalFix sizeS admin displaynone"></a>
                    <a href="#none" onclick="" class="btnNormalFix sizeS ">스팸신고</a>
                    <a href="#none" onclick="" class="btnNormalFix sizeS ">스팸해제</a>
    
                <a href="/board/시공갤러리/8/" class="btnNormalFix sizeS">목록</a>
  
                <a href="#none" onclick="BOARD_READ.article_delete('BoardDelForm','8');" class="btnNormalFix sizeS displaynone">삭제</a>
                <a href="/board/gallery/modify.html?board_act=edit&no=121&board_no=8" class="btnNormalFix sizeS displaynone">수정</a>
                <a href="/board/gallery/reply.html" class="btnSubmitFix sizeS displaynone">답변</a>
            </span>
        </span>
</div>
</div>
</form></div>

<div class="xans-element- xans-board xans-board-commentpackage-8 xans-board-commentpackage xans-board-8 "><form id="commentForm" name="" action="/exec/front/Board/CommentUpdate/8" method="post" target="_self" enctype="multipart/form-data" >
<input id="board_no" name="board_no" value="8" type="hidden"  />
<input id="no" name="no" value="121" type="hidden"  />
<input id="comment_no" name="comment_no" value="" type="hidden"  />
<input id="member_id" name="member_id" value="" type="hidden"  /><div class="xans-element- xans-board xans-board-commentform-8 xans-board-commentform xans-board-8 "><fieldset>
            <legend>댓글 수정</legend>
            <p>비밀번호 : <input id="comment_password" name="comment_password" fw-filter="isFill" fw-label="댓글비밀번호" fw-msg="" autocomplete="new-password" value="" type="password"  /> <span class="secret displaynone"><label>비밀댓글</label></span></p>
            <div class="view">
                <textarea id="comment_modify" name="comment_modify" fw-filter="isFill" fw-label="댓글내용" fw-msg="" ></textarea>                <span class="submit">
                    <a href="#none" class="btnEm sizeL" onclick="BOARD_COMMENT.comment_update_ok('commentForm');">수정</a>
                    <a href="#none" class="btnNormal sizeL" onclick="BOARD_COMMENT.comment_cancel_ok('commentForm');">취소</a>
                </span>
            </div>
            <p class="displaynone"> /  byte</p>
        </fieldset>
</div>
</form><form id="commentSecretForm" name="" action="/exec/front/Board/CommentSecret/8" method="post" target="_self" enctype="multipart/form-data" >
<input id="board_no" name="board_no" value="8" type="hidden"  />
<input id="comment_no" name="comment_no" value="" type="hidden"  />
<input id="pass_check" name="pass_check" value="F" type="hidden"  /><div class="xans-element- xans-board xans-board-commentformsecret-8 xans-board-commentformsecret xans-board-8 "><p>비밀번호 : <input id="secure_password" name="secure_password" fw-filter="isFill" fw-label="댓글비밀번호" fw-msg="" autocomplete="new-password" value="" type="password"  />            <a href="#none" class="btnNormal" onclick="BOARD_COMMENT.show_secret_comment('commentSecretForm');">확인</a>
            <a href="#none" class="btnNormal" onclick="BOARD_COMMENT.hide_secret_comment_form('commentSecretForm');">취소</a>
        </p>
</div>
</form><div class="xans-element- xans-board xans-board-commentwrite-8 xans-board-commentwrite xans-board-8 "><!-- 댓글권한 있음 -->
<div class="displaynone">
            <fieldset>
                <legend>댓글 입력</legend>
                <div class="input">
                    <strong>댓글달기</strong>
                    <span class="displaynone">이름 : </span><br/><br/>비밀번호 : <span class="secret displaynone"><label>비밀댓글</label></span><a href="#none" onclick="" class="btnNormal displaynone">관리자답변보기</a>
                    <p class="ec-base-help displaynone">영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 10자~16자</p>
                </div>
                <div class="view">
                                        <a href="#none" onclick="" class="btnEm sizeL displaynone">확인</a>
                </div>
                <p class="grade displaynone"></p>
                <p class="displaynone"> /  byte</p>
                <p class="captcha displaynone">
                                                             <span class="ec-base-help txtInfo">왼쪽의 문자를 공백없이 입력하세요.(대소문자구분)</span>
                </p>
            </fieldset>
        </div>
<!-- 댓글권한 없음 -->
<div class="">
            <p>관리자에게만 댓글 작성 권한이 있습니다.</p>
        </div>
</div>
</div>



<!-- 관리자 전용 메뉴 -->
<!-- // 관리자 전용 메뉴 -->

</div>

    
    
</div>
</div>
<!--- 서브 내용 --->

<div class="clear"></div> 

    
<!-- 하단 고객센터 영역 -->  
<!-- 하단 고객센터 영역 -->  
<div id="main_callcenter_wrap">
<div class="main_callcenter_inner">
<div class="main_callcenter_contents">


 <!-- 고객센터 영역 -->  
<div class="main_callcenter_area">
<div class="main_callcenter">

    <div class="xans-element- xans-layout xans-layout-footer "><div class="main_callcenter_title">CS CENTER</div>
<div class="main_callcenter_number">080-095-2222</div>
<div class="main_callcenter_infor">
            <ul>
               <li>오전10시 ~ 오후5시</li>
            </ul>
         </div>
</div>

</div>
</div>
 <!-- 고객센터 영역 -->  


 <!-- 입금계좌 영역 -->  
<div class="main_banking_area">
<div class="main_banking">

      <div class="main_banking_title">BANK INFO</div>
      <div class="main_banking_number_01">우리은행</div>
      <div class="main_banking_number_02">1005-204-807914</div>
      <div class="main_banking_infor">예금주 - 주식회사 K.H 시스템</div>

</div>
</div>
 <!-- 입금계좌 영역 -->  


 <!-- 반품/교환 영역 -->  
<div class="main_return_area">
<div class="main_return">

       <div class="main_return_title">RETURN / EXCHANGE</div>
       <div class="main_return_add"><div class="xans-element- xans-layout xans-layout-footer ">반품주소 :  경기 하남시 검단산로 61-8 2층</div>
</div>
       <div class="main_return_infor">반품 접수시 지정택배사를 이용하여 보내주세요.</div>
       <div class="main_return_bt"><a href="https://www.doortodoor.co.kr/parcel/pa_004.jsp" target="_blank" class="return_bt">택배 배송조회</a></div>
    
</div>
</div>
 <!-- 반품/교환 영역 -->  


 <!-- 게시판 영역 -->  
<div class="main_comm_area">
<div class="main_comm">

     <div class="main_comm_title">COMMUNITY</div>
     <div class="main_comm_01"><a href="/board/free/list.html?board_no=1">NOTICE</a></div>
     <div class="main_comm_02"><a href="/board/free/list.html?board_no=2">EVENT</a></div>
     <div class="main_comm_03"><a href="/board/product/list.html?board_no=6">Q&amp;A</a></div>
     <div class="main_comm_04"><a href="/board/product/list.html?board_no=4">REVIEW</a></div>
    
</div>
</div>
 <!-- 게시판 영역 -->  


 
</div>
</div>
</div>
<!-- 하단 고객센터 영역 -->  

<!-- 하단 고객센터 영역 -->         
    
<!-- 하단 메뉴 및 사업자정보 영역 -->  
<div id="main_copy_wrap">
<div class="main_copy_inner">
<div class="main_copy_contents">

 <!-- 하단 메뉴 영역 -->  
<!-- 하단 메뉴 영역 -->
<div class="bm_menu_area">

<ul>
     <li><a href="/index.html">홈</a></li>
     <li><a href="/shopinfo/company.html">회사소개</a></li>
     <li><a href="/member/agreement.html">이용약관</a></li>
     <li><a href="/member/privacy.html"><font color="#2425a7">개인정보취급방침</font> </a></li>
     <li><a href="/shopinfo/guide.html">이용안내</a></li>
</ul>

</div>
<!-- 하단 메뉴 영역 -->

 <!-- 하단 메뉴 영역 -->  


 <!-- 하단 사업자정보 영역 -->  
<!-- 하단 사업자정보 영역 -->
<div class="bm_copy_area">

 <div class="xans-element- xans-layout xans-layout-footer "><p class="address">
   상호명 : (주)K.H 시스템  / 대표자  : 김영훈 / 사업자등록번호 : 269-88-02357 / 통신판매업신고번호 : 제2022-경기하남-1596호 <a href="#none" onclick="window.open('http://www.ftc.go.kr/bizCommPop.do?wrkr_no=2698802357', 'bizCommPop', 'width=750, height=950;');return false;">[사업자정보확인]</a><br/>
   고객센터 : 080-095-2222 / 팩스 : 031-796-8133 / 주소 : 13024 경기 하남시 검단산로 61-8 2층 <br/>
   개인정보보호책임자 : <a href="mailto:kyh0371@hanmail.net">김영훈(kyh0371@hanmail.net)</a><br/>
   </p>
</div>

<div class="xans-element- xans-layout xans-layout-footer bm_copy ">Copyright by (주)K.H 시스템 . All rights reserved. 
<a href="http://d-more.kr" target="_blank"><font color="#999">DESIGN BY 디자인모어</font></a>
<br/>
<font color="#999">당사의 모든 제작물의 저작권은 (주)K.H 시스템 에 있습니다. 무단복제 또는 도용을 금합니다. / 호스팅 제공 : 카페24(주)</font>
</div>


</div>
<!-- 하단 사업자정보 영역 -->

 <!-- 하단 사업자정보 영역 -->  


</div>
</div>
</div>
<!-- 하단 메뉴 및 사업자정보 영역 -->     
    
<!-- 하단 게시판/고객센터 전체 영역(모바일) -->  

<!-- 하단 게시판/고객센터 전체 영역(모바일) -->     

<!-- 하단 PG사 영역 -->  
<div id="main_bm_pg_wrap">
<div class="main_bm_pg_inner">
<div class="main_bm_pg_area">
    
<div class="bm_pg">
     <ul>
          <li><a href="#"><img src="/dmore_skin/_MD_images/pg_bt_01.gif"/></a></li>
          <li><a href="#"><img src="/dmore_skin/_MD_images/pg_bt_02.gif"/></a></li>
          <li><a href="#"><img src="/dmore_skin/_MD_images/pg_bt_03.gif"/></a></li>
          <li><a href="#"><img src="/dmore_skin/_MD_images/pg_bt_04.gif"/></a></li>                
     </ul>              
</div>      
        
</div>
</div>
</div>
<!-- 하단 PG사 영역 -->    
    
<!-- 오른쪽 고정 상담 메뉴(모바일) -->
<!-- 오른쪽 고정 퀵 메뉴 -->
<div class="right_fixed_mo">    

<!-- 상단 버튼 1 -->
<a herf="#" target="_blank" style="cursor:pointer; display:none;" alt="카톡" class="right_fixed_01"><img src="/dmore_skin/_MD_images/r_quick_02.png" border="0"/></a>
<!-- 상단 버튼 1 -->

<!-- 상단 버튼 2 -->
<a herf="https://talk.naver.com/W42G06" target="_blank" style="cursor:pointer" alt="네이버톡" class="right_fixed_02"><img src="/dmore_skin/_MD_images/r_quick_01.png" border="0"/></a>
<!-- 상단 버튼 2 -->

<!-- 상단으로 버튼 -->
<a href="#" class="right_fixed_03"><img src="/dmore_skin/_MD_images/r_quick_03.png" border="0"/></a>
<!-- 상단으로 버튼 -->

<!-- 하단으로 버튼 -->
<a href="#footer" class="right_fixed_04"><img src="/dmore_skin/_MD_images/r_quick_04.png" border="0"/></a>
<!-- 하단으로 버튼 -->

</div>



<!-- 임의로 수정시 오류가 발생할 수 있습니다. -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script> 
<script>

/* 상단으로 버튼 */
$(function(){
		$(".right_fixed_03").click(function(){
			$("html,body").animate({scrollTop:0}, 1000);  /*1500 속도 조정 */
			return false;
		});
	}); 


/* 하단으로 버튼 */
$(function(){
		$(".right_fixed_04").click(function(){
			$( 'html, body' ).animate( { scrollTop : $(document).height()}, 1200 ); /*1500 속도 조정 */
			return false;
		});
	}); 

</script>




<!-- 오른쪽 고정 상담 메뉴(모바일) -->      

<!-- 결제를 위한 필수 영역 -->
<div id="progressPaybar" style="display:none;">
    <div id="progressPaybarBackground" class="layerProgress"></div>
    <div id="progressPaybarView">
        <div class="box">
            <p class="graph">
                <span><img src="//img.echosting.cafe24.com/skin/base_ko_KR/layout/txt_progress.gif" alt="현재 결제가 진행중입니다."/></span>
                <span><img src="//img.echosting.cafe24.com/skin/base/layout/img_loading.gif" alt=""/></span>
            </p>
            <p class="txt">
                본 결제 창은 결제완료 후 자동으로 닫히며,결제 진행 중에 본 결제 창을 닫으시면<br/>
                주문이 되지 않으니 결제 완료 될 때 까지 닫지 마시기 바랍니다.
            </p>
        </div>
    </div>
</div>
<!-- // 결제를 위한 필수 영역 -->


 
<script type="text/javascript">var sAuthSSLDomain = "https://login2.cafe24ssl.com";</script><script type="text/javascript" src="https://login2.cafe24ssl.com/crypt/AuthSSLManager.js"></script><script type="text/javascript" src="https://login2.cafe24ssl.com/crypt/AuthSSLManager.plugin.js"></script>
<span itemscope="" itemtype="https://schema.org/Organization">
<link itemprop="url" href="https://ssadaaircon.com">
<a itemprop="sameAs" href="https://blog.naver.com/ssadaaircon"></a>
<a itemprop="sameAs" href="https://smartstore.naver.com/ssadarent"></a>
</span>
<script type="text/javascript" src="/app/Eclog/js/cid.generate.js?vs=3d0b473968a0ec4ec41e3bf59df3aa51&u=ssada031.1"></script>
<script type="text/javascript" src="/app/Manage/js/inflowbeacon.js?vs=3d0b473968a0ec4ec41e3bf59df3aa51&u=ssada031.1"></script>
<script>        (function (i, s, o, g) {
            var a = s.createElement(o), m = s.getElementsByTagName(o)[0];
            var initialized = false;
            var interval = null;

            function safeInit() {
              if (initialized) return;
              if (typeof i.initCaWebAnalytics === 'function') {
                try {
                  i.initCaWebAnalytics({"mid":"ssada031","stype":"e","domain":"","shop_no":1,"lang":"ko_KR","mobile_flag":"F","send_endpoint":"https://ca-log.cafe24data.com","path_role":"BOARD_GALLERY_DETAIL"});
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
        })(window, document, 'script', "//optimizer.poxo.com/ca2/analytics.js?v=20260918");</script>

                <script>
                try {
                    // Account ID 적용
                    if (!wcs_add) var wcs_add = {};
                    wcs_add["wa"] = "s_4ab4b64c87c9";
            
                    // 네이버 페이 White list가 있을 경우
                    wcs.checkoutWhitelist = ["ssada031.cafe24.com", "www.ssada031.cafe24.com", "m.ssada031.cafe24.com", "ssadaaircon.com", "www.ssadaaircon.com", "m.ssadaaircon.com", "싸다에어컨.com", "www.싸다에어컨.com", "m.싸다에어컨.com"];
                
                    // 레퍼러 
                    wcs.setReferer("http://ssadaaircon.com/board/gallery/read.html?no=121&amp;board_no=8");

                    // 유입 추적 함수 호출
                    wcs.inflow("ssadaaircon.com");

                    // 로그수집
                    wcs_do();
                } catch (e) {};
                </script>
            

<!-- External Script Start -->

<!-- gcs -->
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-11130621664"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'AW-11130621664');
</script>


<script>
  gtag('event', 'conversion', {
      'send_to': 'AW-11130621664/XKqmCL_1vo0ZEOCdv7sp',
      'value': 0.0,
  });
</script>
<!-- yts -->
<!-- Event snippet for Youtube Shopping Conversion -->
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GT-NGPQ3DPW"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GT-NGPQ3DPW');
</script>
<!-- External Script End -->

<script type="text/javascript" src="/ind-script/i18n.php?v=2609161505&lang=ko_KR&domain=front&type=" charset="utf-8"></script>

<script src="/ind-script/optimizer.php?filename=vVjbcts2EH23-JrvoD1NO321pTrNxJ5obGfyDIJLEiaARXGxTH99l5ScWBdKAJ12NENSwJ5dYHn2AlaWKVihbXMLDoPlkD-6XFz8qbNH96Hanw3CMN7mj_8EsN3m9lv2R3YeJQ_PHqxm0m0GMo7YCpiGDVYmLDIDnlU6EaCRo66k4D4BeJF9pF-CIZr1aAcvGIs1obbeRsk8eKEgV6hA-xz47fDwXfjm4WXBPMuU0CfRUhQkCw_0PCbrjBXaV6OqkIfe8DVaNUftLUoJdkx6KYO7NObKirIetRi8kGNzlcVht2cOJcmhPvNozqTQcFYwrcctr4EclUJ9XOaZaWK7JmIZC_6UxkHagzKS_PhWlBmT32IhJOR3b1DrFeztcURaYRloyK2EiVFeBc17p-QkVwYiqNqhUCxuzyARJf-25ulboGQvnURWRoiq4Flv42vhwD5tu3UEYlB2lZAnyFBCxYL0_dacYtZf_eBBevooajGA_v_EVVIIakf-cdPwwJzQ9TSsAs_KPmXsMOW-QbP1Qq4Hh39hLcO87a9L8QxyP5qPgOcD_78doP8IYAFFqCNlHTDLmwhmeVZV3WuGPOkwI0MtKMyfmBTkJ7SvjvsxkNEDcxOV9e9Dl25fKWkwRAj41XobkAb-ozU3TJcyMvwS1FLCEPTGfrFWSi7-nY6QyBll0xbHktRPa6dpOSdVumQ2_5j9np3nFdUUI3ibBJUX53pnOUci5n6ImH6CkvKQn18VRSq4gwosaA7zYPt7t7SCRycDqpk12u5GOL8LuUJmyy0MjWZFP5oi2mHwoYAUSOA8RbwgCrQpAAsGrU9DbJfYt_y6DL65v79JUdf3INSyxVRgi0q4mE5AKFYTEZx4SfI1RSBkwez2EEOfwjSp3MKtgJxdx0TDhoy5I-LNzC4lo1B8829WUWvL_DSr7wMf64QbryhQvfAC3JjM3HbG4xfoInw7NFMzR00azOpwIMoOYJjrNF9fE6UVqAJsIuirLcFy7RNhV8y14KfizKF8FoVcbprpNOwcAxX99NXeUiSxOnWlC8pFTqTa-i5ccyhnR8A4huStWeCQDLobQC10VM_LSdgH9EzOJ6x34GkqZUBDJaZR9IZ1yfY-WVamkoVKDVIyE3wAU01fpXKUzmliiSaY1KAIjkyDpZB6EunOXayPiPeNMIZOSZdlSVnSpS6e2pQWNkE9hRZbCiaEz0Crv0X_XaibTMsN_oEV70B_9qCmbmBBh00hP-sKUzkgGTUZhYRk64b5xqKE2cFePML0TVx7YqIT_rr8zaiZ2f5INyLuVhmdMuQ-7__aHOX3K3k_7bgVxkdh-gN5ftl36gb48PGrYvtl7yB0K0MYMz_6ic1SOw7X4pnm_wU&type=js&k=da6943cf5d98939ad4f9d1d4f3866f81b6ca8285&t=1789444199" ></script><script src="/ind-script/optimizer_user.php?filename=jc4xDsIwDAXQA5SVc3jhJpwgJFbqEsdRfzz09gQQYimi27f-s2UknhJDciXcpV4oqa08PTNFgFBkCOXqpwVn_NExdM62bkfsdzyiX39426UlbOadbgESacE77MpRRlO1-qtVS174c1G9dMFs7TpLa1LzWHsA&type=js&k=0a3b35ace5f7f9f6cdc93708d449b421d1ce1f8f&t=1733727104&user=T" ></script>
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
var bUseElastic = false;
var sSearchBannerUseFlag = 'F';
EC$(function() {
try{
var ifame_width = parent.EC$('#blog_121').parent().width();
parent.EC$('#blog_121').contents().find('body').css( 'min-width', ifame_width);
parent.EC$('#blog_121').css('width', ifame_width);
if (parseInt(parent.EC$('#blog_121').css('height')) < (document.body.scrollHeight + 70)) {
parent.EC$('#blog_121').css('height', document.body.scrollHeight + 70);
}
}catch(e){};
});
EC$(function(){
FwValidator.bind("BoardDelForm", false);
});
var sFormId = 'BoardDelForm'
var sEleId = ["BoardDelForm::password"]
AuthSSL.Bind(sFormId, sEleId);
EC$(function(){
FwValidator.bind("commentForm", false);
});
EC$(function() {
EC$('#commentForm').css('display', 'none');
});
EC$(function(){
FwValidator.bind("commentSecretForm", false);
});
EC$(function() {
EC$('#commentSecretForm').css('display', 'none');
});
var aLogData = {"log_server1":"eclog2-181.cafe24.com","log_server2":"eclog2-181.cafe24.com","mid":"ssada031","stype":"e","domain":"","shop_no":1,"lang":"ko_KR","ver":2,"hash":"","ca":"cfa-js.cafe24.com\/cfa.js","etc":"","mobile_flag":"F"};
var sMileageName = '적립금';
var sMileageUnit = '[:PRICE:]원';
var sDepositName = '예치금';
var sDepositUnit = '원';
CAFE24.SHOP_CURRENCY_INFO = {"1":{"aShopCurrencyInfo":{"currency_code":"KRW","currency_no":"410","currency_symbol":"\uffe6","currency_name":"South Korean won","currency_desc":"\uffe6 \uc6d0 (\ud55c\uad6d)","decimal_place":0,"round_method_type":"F"},"aShopSubCurrencyInfo":null,"aBaseCurrencyInfo":{"currency_code":"KRW","currency_no":"410","currency_symbol":"\uffe6","currency_name":"South Korean won","currency_desc":"\uffe6 \uc6d0 (\ud55c\uad6d)","decimal_place":0,"round_method_type":"F"},"fExchangeRate":1,"fExchangeSubRate":null,"aFrontCurrencyFormat":{"head":"","tail":"\uc6d0"},"aFrontSubCurrencyFormat":{"head":"","tail":""},"bPresentmentEnabled":false,"aPresentmentCurrencyInfo":null,"fExchangePresentmentRate":null,"aFrontPresentmentCurrencyFormat":null,"bGlobaleEnabled":false}}; var SHOP_CURRENCY_INFO = CAFE24.SHOP_CURRENCY_INFO;
CAFE24.APPSCRIPT_ASSIGN_DATA = CAFE24.APPSCRIPT_ASSIGN_DATA || [{'src':'https://calendar-app.cafe24.com/openapi/inject.js?vs=20260122092000.1&client_id=A8RQp67UIt9nBlqvThz2jC'}];
CAFE24.APPSCRIPT_SDK_DATA = CAFE24.APPSCRIPT_SDK_DATA || ['application','store','category','community','customer','design','notification','product','promotion','supply'];
var EC_APPSCRIPT_ASSIGN_DATA = CAFE24.getDeprecatedNamespace('EC_APPSCRIPT_ASSIGN_DATA');
var EC_APPSCRIPT_SDK_DATA = CAFE24.getDeprecatedNamespace('EC_APPSCRIPT_SDK_DATA');
</script></body>
</html>


