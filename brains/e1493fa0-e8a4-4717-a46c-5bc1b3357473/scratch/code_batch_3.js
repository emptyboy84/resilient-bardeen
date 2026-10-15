async () => {
  const nuxt = window.useNuxtApp();
  const pinia = nuxt.$pinia || nuxt.vueApp.config.globalProperties.$pinia;
  const store = pinia._s.get('searchStore');
  const list = [{"idx":101,"bizno":"6090965574","name":"오리엔텍","rep":"박주현","addr":"경남 함안군 칠서면 삼칠로 553 (청계리)"},{"idx":102,"bizno":"6090968381","name":"한국씨엠티","rep":"한상훈","addr":"경남 창원시 마산회원구 봉암공단4길 109 (봉암동)"},{"idx":103,"bizno":"6090970437","name":"부평산업","rep":"전혜숙","addr":"경남 창원시 성산구 공단로166번길 13-22 (신촌동)"},{"idx":104,"bizno":"6090971213","name":"평화기술","rep":"김성태","addr":"경남 창원시 마산회원구 봉암공단11길 72 (봉암동)"},{"idx":105,"bizno":"6090972037","name":"영진제관","rep":"안상수","addr":"경남 김해시 진영읍 서부로 297-20 (의전리)"},{"idx":106,"bizno":"6090974433","name":"원창정공","rep":"서석현","addr":"경남 김해시 진영읍 서부로378번길 5-1 (의전리)"},{"idx":107,"bizno":"6090975470","name":"티앤지","rep":"","addr":"경상남도 김해시"},{"idx":108,"bizno":"6090977804","name":"대아기계","rep":"박식","addr":""},{"idx":109,"bizno":"6090978327","name":"재성정밀","rep":"지효준","addr":"경남 창원시 성산구 연덕로27번길 44 (웅남동)"},{"idx":110,"bizno":"6090979670","name":"용호산업","rep":"김대성","addr":"경남 창원시 성산구 완암로 50, SK테크노파크 메카동 203호, 204호 2층 (성산동)"},{"idx":111,"bizno":"6090984227","name":"JUN MOLD","rep":"장용준","addr":"경남 창원시 성산구 성주로81번길 28 (남산동)"},{"idx":112,"bizno":"6090987374","name":"스타테크","rep":"배용주","addr":"경남 창원시 마산회원구 봉암공단7길 37 (봉암동)"},{"idx":113,"bizno":"6090989106","name":"세원산업","rep":"조현철","addr":"경남 창원시 진해구 남영로527번길 98 (남양동)"},{"idx":114,"bizno":"6090989289","name":"코리아파인텍","rep":"강판근","addr":"경남 창원시 마산회원구 봉암공단14길 16 (봉암동)"},{"idx":115,"bizno":"6090993838","name":"재성정밀","rep":"하태준","addr":"경남 창원시 마산회원구 봉암북14길 46 (봉암동)"},{"idx":116,"bizno":"6091034704","name":"성협나노텍","rep":"차갑주","addr":"경남 창원시 의창구 창원대로363번길 11, 3동 7호 (팔용동,표준3공장)"},{"idx":117,"bizno":"6091035488","name":"해비이엔지","rep":"김성완","addr":"경남 창원시 의창구 두대로81번길 16-1 (대원동)"},{"idx":118,"bizno":"6091037278","name":"우진","rep":"강상모","addr":"경남 창원시 의창구 하남천서길5번길 36 (도계동)"},{"idx":119,"bizno":"6091041826","name":"기안정밀사","rep":"홍순일","addr":"경남 창원시 성산구 완암로 50, SK테크노파크 테크동 지하1층 B109-1호 (성산동)"},{"idx":120,"bizno":"6091042164","name":"신영테크","rep":"안성민","addr":"경남 창원시 성산구 완암로 50, 메카동 9층 919호 (성산동,창원sk테크노파크)"},{"idx":121,"bizno":"6091044177","name":"프루이드서비스","rep":"박정훈","addr":"경남 함안군 칠원읍 경남대로 1939-2 (운서리)"},{"idx":122,"bizno":"6091047043","name":"창원중전기","rep":"배인철","addr":"경남 창원시 의창구 차상로 76, 108호 (팔용동)"},{"idx":123,"bizno":"6091051154","name":"아진테크","rep":"최주식","addr":"경남 김해시 장유로55번안길 35-40 (부곡동)"},{"idx":124,"bizno":"6091053792","name":"정도기공","rep":"최남현","addr":"경남 창원시 마산회원구 내서읍 중리공단로 171 (중리)"},{"idx":125,"bizno":"6091054049","name":"엠테크","rep":"방인수","addr":"경남 창원시 성산구 공단로 602 (성산동,대림자동차사륜부품공장내)"},{"idx":126,"bizno":"6091055242","name":"한성정밀","rep":"홍성훈","addr":"경남 김해시 주촌면 골든루트로 80-80 (농소리)"},{"idx":127,"bizno":"6091058161","name":"대산기업","rep":"배차한","addr":"경남 창원시 성산구 귀곡동 555-1번지"},{"idx":128,"bizno":"6091059059","name":"부영정밀","rep":"민춘규","addr":"경남 창원시 성산구 성주로81번길 28 (남산동)"},{"idx":129,"bizno":"6091062914","name":"케이피엔지니어링","rep":"김길석","addr":"경남 창원시 성산구 창원천로162번길 3 (반지동)"},{"idx":130,"bizno":"6091074313","name":"남일전기","rep":"박수곤","addr":"경남 창원시 성산구 대암로115번길 6-8 (대방동)"},{"idx":131,"bizno":"6091076723","name":"태일산업","rep":"유현상","addr":"경남 함안군 칠원읍 운무로 217-19 (운서리)"},{"idx":132,"bizno":"6091079453","name":"한국래핑","rep":"권영태","addr":"경남 창원시 성산구 완암로 50, SK테크노파크 제테크동 제8층 821호 (성산동)"},{"idx":133,"bizno":"6091079749","name":"금강기계","rep":"윤상원","addr":"경남 함안군 칠원읍 석전3길 16 (용정리)"},{"idx":134,"bizno":"6091085315","name":"유신에스티","rep":"서원주","addr":"경남 함안군 칠서면 공단상가2길 53 (대치리)"},{"idx":135,"bizno":"6091092155","name":"창조테크","rep":"신정규","addr":"경남 창원시 의창구 창원대로363번길 11, 5동 4호 (팔용동,창원제3아파트형공장)"},{"idx":136,"bizno":"6091092344","name":"J-FACORP","rep":"김종곤","addr":"경남 창원시 성산구 완암로 50, 테크동 917호 (성산동,창원sk테크노파크)"},{"idx":137,"bizno":"6091092456","name":"수환엔지니어링","rep":"김석건","addr":"경남 김해시 상동면 동북로437번길 21 (매리)"},{"idx":138,"bizno":"6091098106","name":"덕운기계","rep":"이수용","addr":"경남 김해시 진영읍 하계로 247-17 (하계리)"},{"idx":139,"bizno":"6091131330","name":"윈텍","rep":"홍상표","addr":"경남 창원시 의창구 차상로150번길 68, 159호 (팔용동)"},{"idx":140,"bizno":"6091134642","name":"서진산업(주)","rep":"","addr":"경상남도 창원시"},{"idx":141,"bizno":"6091134808","name":"SMTEC","rep":"채종춘","addr":"경남 창원시 의창구 동읍 주남로128번길 24-4, 에스엠텍 (월잠리)"},{"idx":142,"bizno":"6091135184","name":"우리정공","rep":"정의용","addr":"경남 창원시 마산회원구 봉암공단1길 121 (봉암동)"},{"idx":143,"bizno":"6091139142","name":"풍원정밀","rep":"류장옥","addr":"경남 창원시 성산구 남면로 219, 코리아지식산업센터 제2동 제1,2,3층 제25호 (대원동)"},{"idx":144,"bizno":"6091142540","name":"화성제이아이지","rep":"곽상개","addr":"경남 창원시 성산구 월림로39번길 63-18 (신촌동)"},{"idx":145,"bizno":"6091144136","name":"나우텍","rep":"이동섭","addr":"경남 창원시 의창구 평산로78번길 20 (팔용동)"},{"idx":146,"bizno":"6091144306","name":"은성정밀","rep":"김종하","addr":"경남 창원시 성산구 연덕로15번길 50 (웅남동)"},{"idx":147,"bizno":"6091146129","name":"옥산기계","rep":"김학만","addr":"경남 창원시 성산구 연덕로27번길 73 (웅남동)"},{"idx":148,"bizno":"6091148414","name":"F．M．C","rep":"강태규","addr":"경남 창원시 마산회원구 봉암공단5길 76 (봉암동)"},{"idx":149,"bizno":"6091154731","name":"티엠시","rep":"이형민","addr":"경남 창원시 의창구 충혼로 91, 창원전문대학 벤처센타 5호 (두대동)"},{"idx":150,"bizno":"6091156404","name":"선진광학","rep":"박종생","addr":"경남 창원시 의창구 북면 천주로577번길 10 (감계리)"}];

  async function queryNice(keyword) {
    if (!keyword) return { keyword, totalCount: 0, results: [] };
    store.isFetched = false;
    const input = document.querySelector('input[placeholder*="기업명"]');
    input.value = keyword;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Press Enter
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));

    // Wait until isFetched is true
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 100));
      if (store.isFetched && store.searchKeyword === keyword) break;
    }

    return {
      keyword,
      totalCount: store.totalCount || 0,
      results: (store.searchResultList || []).map(r => ({
        bizno: r.bizno,
        name: r.korentrnm,
        rep: r.korreprnm,
        addr: r.koraddr,
        industry: r.sanupscd_kor
      }))
    };
  }

  const output = [];
  for (const item of list) {
    let res = await queryNice(item.bizno);
    let match = null;
    let source = 'bizno';

    if (res.results && res.results.length > 0) {
      match = res.results[0];
    } else if (item.name) {
      // Fallback to searching by company name
      res = await queryNice(item.name);
      if (res.results && res.results.length === 1) {
        match = res.results[0];
        source = 'name_exact';
      } else if (res.results && res.results.length > 1) {
        // match by rep or region
        const byRep = res.results.find(r => item.rep && r.rep && (r.rep.includes(item.rep) || item.rep.includes(r.rep)));
        if (byRep) {
          match = byRep;
          source = 'name_rep_match';
        } else {
          const byRegion = res.results.find(r => r.addr && (r.addr.includes('경남') || r.addr.includes('창원') || r.addr.includes('김해') || r.addr.includes('함안')));
          if (byRegion) {
            match = byRegion;
            source = 'name_region_match';
          }
        }
      }
    }

    output.push({
      idx: item.idx,
      rawBizno: item.bizno,
      rawName: item.name,
      found: !!match,
      industry: match ? match.industry : '',
      matchedName: match ? match.name : '',
      matchedRep: match ? match.rep : '',
      matchedAddr: match ? match.addr : '',
      source: match ? source : 'not_found'
    });

    await new Promise(r => setTimeout(r, 100));
  }

  return output;
}