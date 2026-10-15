async () => {
  const nuxt = window.useNuxtApp();
  const pinia = nuxt.$pinia || nuxt.vueApp.config.globalProperties.$pinia;
  const store = pinia._s.get('searchStore');
  const list = [{"idx":151,"bizno":"6091159982","name":"아이엠씨오(IMCO)시스템","rep":"박인석","addr":"경남 창원시 의창구 차룡로48번길 44, 1층 에프102호(팔용동, 창원스마트업타워)"},{"idx":152,"bizno":"6091160719","name":"동양특수금속","rep":"전말선","addr":"경남 창원시 성산구 정동로62번길 91 (성주동)"},{"idx":153,"bizno":"6091168628","name":"한성산업사","rep":"허정민","addr":"경남 창원시 성산구 두산볼보로 22 (귀곡동)"},{"idx":154,"bizno":"6091177073","name":"하이드파워","rep":"원정구","addr":"경남 창원시 성산구 공단로166번길 13-51 (신촌동)"},{"idx":155,"bizno":"6091179858","name":"성우에스에프에이","rep":"이영길","addr":"경남 창원시 마산회원구 봉암공단1길 23 (봉암동)"},{"idx":156,"bizno":"6091182412","name":"성진정밀","rep":"이상욱","addr":"경남 창원시 성산구 완암로 3, 창원제4아파트형공장 7동 6호 (웅남동)"},{"idx":157,"bizno":"6091185705","name":"서림정밀","rep":"박문일","addr":""},{"idx":158,"bizno":"6091193035","name":"THEONE","rep":"남궁영호","addr":"경남 창원시 의창구 지귀로24번길 16, 3층 302호 (봉곡동,우성오피스텔)"},{"idx":159,"bizno":"6091194242","name":"가가이엔지","rep":"김윤호","addr":"경남 창원시 성산구 완암로 50, 테크동 406호 (성산동,창원sk테크노파크)"},{"idx":160,"bizno":"6091195163","name":"유니온콤","rep":"김정식","addr":"경남 밀양시 삼랑진읍 용전산업단지길 184, 1층 (용전리)"},{"idx":161,"bizno":"6091197502","name":"동명유압시스템","rep":"백철수","addr":"경남 함안군 칠원읍 용산6길 24-15, 나동 (용산리,우양테크)"},{"idx":162,"bizno":"6091198966","name":"연테크","rep":"박귀옥","addr":"경남 김해시 진례면 고모로582번길 27 (고모리)"},{"idx":163,"bizno":"6091214532","name":"창원메쉬","rep":"송치주","addr":"경남 김해시 한림면 김해대로927번길 54"},{"idx":164,"bizno":"6091218163","name":"에이치엘티","rep":"임상현","addr":"경남 함안군 칠원읍 석전1길 94-8 (용정리)"},{"idx":165,"bizno":"6091219070","name":"영림테크","rep":"백종천","addr":"경남 창원시 의창구 차룡단지로 67, 차룡단지 (팔용동)"},{"idx":166,"bizno":"6091219084","name":"창신TECH","rep":"김대갑","addr":"경남 창원시 성산구 창곡로 36 (신촌동)"},{"idx":167,"bizno":"6091222328","name":"영진","rep":"이재현","addr":"경남 김해시 월산로 112-55, 월산마을5단지두산위브아파트 제상가동 2층 201호 (부곡동)"},{"idx":168,"bizno":"6091225698","name":"서광엔지니어링","rep":"최기석","addr":"경남 창원시 의창구 북면 운무로 830 (무곡리)"},{"idx":169,"bizno":"6091229258","name":"대성테크","rep":"전박혁","addr":"경남 창원시 의창구 차상로62번길 5-4,  102호 (팔용동,정일빌딩)"},{"idx":170,"bizno":"6091232530","name":"동양카본","rep":"","addr":"경상남도 창원시"},{"idx":171,"bizno":"6091238136","name":"찬영","rep":"박윤주","addr":"경남 김해시 진례면 테크노밸리로 77-48 (고모리)"},{"idx":172,"bizno":"6091239983","name":"진우정밀","rep":"이하락","addr":"경남 창원시 성산구 창곡로 148 (신촌동)"},{"idx":173,"bizno":"6091244545","name":"일신테크","rep":"김종원","addr":"경남 창원시 의창구 북면 천주로769번길 56 (동전리)"},{"idx":174,"bizno":"6091245980","name":"유니테크","rep":"정광석","addr":"경남 김해시 진영읍 본산로110번길 26"},{"idx":175,"bizno":"6091246150","name":"지성","rep":"손창성","addr":"경남 창원시 마산회원구 봉암공단9길 26, 1층 (봉암동)"},{"idx":176,"bizno":"6091254102","name":"대동테크","rep":"유명도","addr":"경남 창원시 성산구 성주로81번길 15, 제2호동호 1층 (남산동)"},{"idx":177,"bizno":"6091255135","name":"대영정밀","rep":"정종두","addr":"경남 창원시 성산구 연덕로27번길 19 (웅남동)"},{"idx":178,"bizno":"6091255571","name":"은창정밀이디엠","rep":"김정채","addr":"경남 창원시 의창구 차상로8번길 11, 1층 (팔용동)"},{"idx":179,"bizno":"6091257394","name":"세정테크","rep":"이동식","addr":"경남 창원시 성산구 남면로 219, 2동 18호 (대원동,코리아지식산업센터)"},{"idx":180,"bizno":"6091257642","name":"세웅정공","rep":"송문덕","addr":"경남 창원시 의창구 차상로 76, 101호,102호 (팔용동)"},{"idx":181,"bizno":"6091262432","name":"영진정밀","rep":"송영숙","addr":"경남 창원시 의창구 평산로78번길 20 (팔용동)"},{"idx":182,"bizno":"6091263858","name":"현대정밀","rep":"정구대","addr":"경남 함안군 칠서면 무릉길 19-30 (무릉리)"},{"idx":183,"bizno":"6091271547","name":"나노텍","rep":"김재성","addr":"경남 창원시 의창구 평산로70번길 43 (팔용동)"},{"idx":184,"bizno":"6091274622","name":"한진정공","rep":"한종배","addr":"경남 김해시 진영읍 하계로 233-2 (하계리)"},{"idx":185,"bizno":"6091277518","name":"IDKOREA","rep":"이재경","addr":"경남 창원시 성산구 연덕로15번길 83 (웅남동)"},{"idx":186,"bizno":"6091281384","name":"덕창기업","rep":"배성국","addr":"경남 창원시 의창구 평산로70번길 43, 1층 (팔용동)"},{"idx":187,"bizno":"6091283102","name":"창용기계공업사","rep":"","addr":"경상남도 창원시"},{"idx":188,"bizno":"6091283548","name":"대성기공","rep":"장현숙","addr":"경남 창원시 의창구 차상로150번길 53, 104호 (팔용동)"},{"idx":189,"bizno":"6091284606","name":"진양테크","rep":"안윤효","addr":"경남 김해시 진영읍 하계로138번길 11 (방동리)"},{"idx":190,"bizno":"6091288198","name":"대신와이어","rep":"하태수","addr":"경남 창원시 마산회원구 봉암공단로 59-33 (봉암동)"},{"idx":191,"bizno":"6091288484","name":"J M Tec","rep":"김종수","addr":"경남 창원시 성산구 남면로113번길 25-40"},{"idx":192,"bizno":"6091288562","name":"태양정밀","rep":"신호영","addr":"경남 창원시 의창구 북면 백월로 106 (월촌리)"},{"idx":193,"bizno":"6091293217","name":"성호테크","rep":"김현의","addr":"경남 김해시 진례면 고모로 608 (고모리)"},{"idx":194,"bizno":"6091294934","name":"동이정공","rep":"이복동","addr":""},{"idx":195,"bizno":"6091295893","name":"제이씨티","rep":"송종찬","addr":"경남 함안군 산인면 신산로 161-2 (신산리,주식회사제이씨티)"},{"idx":196,"bizno":"6091296422","name":"남양정밀","rep":"한민석","addr":"경남 창원시 성산구 연덕로15번길 66 (웅남동)"},{"idx":197,"bizno":"6091315300","name":"해피밀","rep":"윤석재","addr":"경남 김해시 주촌면 골든루트로66번길 48-5, 15호 (농소리)"},{"idx":198,"bizno":"6091316124","name":"플로우솔루션","rep":"한기웅","addr":"경남 창원시 성산구 완암로 50, 메카동 1107호"},{"idx":199,"bizno":"6091320031","name":"연세에스병원","rep":"김진영","addr":"경남 창원시 진해구 해원로32번길 13 (이동)"},{"idx":200,"bizno":"6091322572","name":"경상테크","rep":"김경민","addr":"경남 김해시 진영읍 하계로 247-17 (하계리)"}];

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