async () => {
  const nuxt = window.useNuxtApp();
  const pinia = nuxt.$pinia || nuxt.vueApp.config.globalProperties.$pinia;
  const store = pinia._s.get('searchStore');
  const list = [{"idx":51,"bizno":"6090783506","name":"디에스엠","rep":"최정갑","addr":"부산 기장군 정관읍 산단3로 101-17"},{"idx":52,"bizno":"6090786764","name":"에스텍","rep":"전재현","addr":"경남 김해시 진례면 고모로581번길 11, C동 (고모리)"},{"idx":53,"bizno":"6090787481","name":"한빛테크","rep":"김기찬","addr":"경남 창원시 의창구 대산면 봉강가술로559번길 19, 동현정공(주) 공장내 (가술리)"},{"idx":54,"bizno":"6090788398","name":"와이테크","rep":"윤치량","addr":"경남 창원시 마산회원구 봉암공단10길 29 (봉암동)"},{"idx":55,"bizno":"6090788952","name":"한수테크","rep":"한근기","addr":"경남 김해시 진영읍 본산로110번길 40 (본산리)"},{"idx":56,"bizno":"6090792607","name":"부마정공","rep":"김선례","addr":"경남 창원시 마산회원구 봉암공단11길 51-1 (봉암동)"},{"idx":57,"bizno":"6090793019","name":"문영산업","rep":"박왕석","addr":"경남 창원시 의창구 대산면 진산대로260번길 73 (우암리)"},{"idx":58,"bizno":"6090793590","name":"칠성프라스틱","rep":"김형성","addr":"경남 창원시 성산구 공단로166번길 13-41 (신촌동)"},{"idx":59,"bizno":"6090793741","name":"대아정밀","rep":"김해룡","addr":""},{"idx":60,"bizno":"6090794172","name":"우일금속","rep":"박정수","addr":"경남 창원시 의창구 죽전로 15, (삼양공업사 내) (팔용동)"},{"idx":61,"bizno":"6090799478","name":"케이엠티에스","rep":"김경돌","addr":"경남 창원시 의창구 차상로150번길 68, A동 305호 (팔용동,네오산업공구상가)"},{"idx":62,"bizno":"6090817814","name":"가야정기","rep":"박희성","addr":"경남 창원시 의창구 동읍 주남로128번길 17, 외2필지 (월잠리)"},{"idx":63,"bizno":"6090848296","name":"신창웰텍","rep":"신창훈","addr":"경남 창원시 의창구 차상로8번길 25 (팔용동)"},{"idx":64,"bizno":"6090848302","name":"백승정밀","rep":"김상실","addr":"경남 김해시 진영읍 하계로 247-7 (하계리)"},{"idx":65,"bizno":"6090852785","name":"파워엠텍","rep":"서호원","addr":"경남 김해시 진영읍 하계로 262-14 (하계리)"},{"idx":66,"bizno":"6090853028","name":"부경기전","rep":"위성봉","addr":"경남 함안군 칠북면 유계길 87-1 (검단리)"},{"idx":67,"bizno":"6090856097","name":"세종상사","rep":"노정래","addr":"경남 창원시 진해구 여명로 52 (여좌동)"},{"idx":68,"bizno":"6090857742","name":"동평테크","rep":"류만열","addr":"경남 창원시 의창구 죽전로 21 (팔용동)"},{"idx":69,"bizno":"6090858004","name":"두연Tech","rep":"김호영","addr":"경남 창원시 의창구 사화로 210, 209호 (팔용동)"},{"idx":70,"bizno":"6090859172","name":"창신정공","rep":"허용호","addr":"경남 김해시 진영읍 본산1로 86 (본산리)"},{"idx":71,"bizno":"6090863341","name":"삼진테크","rep":"권순일","addr":"경남 김해시 진영읍 본산2로79번길 24-44 (본산리)"},{"idx":72,"bizno":"6090868157","name":"대경정밀공업사","rep":"이규양","addr":"경남 창원시 의창구 차룡로 63 (팔용동)"},{"idx":73,"bizno":"6090871031","name":"성현정밀","rep":"이종덕","addr":""},{"idx":74,"bizno":"6090871346","name":"고성정밀","rep":"고중수","addr":"경남 김해시 한림면 가산로 130 (가산리)"},{"idx":75,"bizno":"6090875610","name":"PSTEC","rep":"류시권","addr":"경남 창원시 성산구 월림로 71-22, B동 (신촌동)"},{"idx":76,"bizno":"6090876754","name":"성산하이스피드","rep":"","addr":"경상남도 창원시"},{"idx":77,"bizno":"6090877831","name":"신화기업","rep":"이승기","addr":"경남 창원시 의창구 북면 천주로769번길 76 (동전리)"},{"idx":78,"bizno":"6090882542","name":"대현계전","rep":"김도인","addr":"경남 창원시 성산구 완암로 50, 메카동 5층 520호 (성산동,창원sk테크노파크)"},{"idx":79,"bizno":"6090884443","name":"창원일렉트론","rep":"심재범","addr":"경남 창원시 성산구 성주로137번길 19 (남산동)"},{"idx":80,"bizno":"6090884540","name":"한빛전기","rep":"김가영","addr":"경남 창원시 의창구 평산로163번길 12, 1층 101호 (서상동)"},{"idx":81,"bizno":"6090889282","name":"부강시스템","rep":"최병천","addr":"경남 창원시 성산구 완암로 50, (성산동,SK테크노파크 테크동 314호)"},{"idx":82,"bizno":"6090889491","name":"리엔지니어링","rep":"이영관","addr":"경남 창원시 진해구 중원로79번길 20 (송학동)"},{"idx":83,"bizno":"6090893767","name":"한국씨스코","rep":"방명옥","addr":"경상남도 창원시 성산구 반월로60번길 34-6 ()"},{"idx":84,"bizno":"6090894989","name":"삼현산업","rep":"이상호","addr":"경남 창원시 의창구 북면 백월로327번길 17-11 (월백리)"},{"idx":85,"bizno":"6090930172","name":"한불테크","rep":"황수원","addr":"경남 창원시 성산구 남면로 219, 코리아지식산업센터 제2동 제1,2,3층 제16호 (대원동)"},{"idx":86,"bizno":"6090930298","name":"진오토","rep":"박진규","addr":"경남 김해시 진례면 고모로 514 (고모리)"},{"idx":87,"bizno":"6090933354","name":"디자인거산","rep":"","addr":"경남 창원시 성산구 완암로 50"},{"idx":88,"bizno":"6090934668","name":"유일테크","rep":"이송수","addr":"경남 창원시 의창구 도계로173번길 12 (명서동)"},{"idx":89,"bizno":"6090935726","name":"C.EN.C","rep":"정석규","addr":""},{"idx":90,"bizno":"6090940684","name":"금현테크","rep":"김명현","addr":"경남 창원시 의창구 원이대로 663 (신월동,은아아파트)"},{"idx":91,"bizno":"6090943565","name":"명신하이테크","rep":"이명자","addr":"경남 창원시 마산회원구 봉암공단5길 57, 1층 (봉암동)"},{"idx":92,"bizno":"6090945485","name":"한국테크","rep":"김대선","addr":"경남 창원시 마산회원구 팔용로 245-1 (구암동)"},{"idx":93,"bizno":"6090945544","name":"유성테크","rep":"최수효","addr":"경남 창원시 성산구 연덕로27번길 23 (웅남동, B동)"},{"idx":94,"bizno":"6090946989","name":"건보테크","rep":"우장근","addr":"경남 창원시 성산구 연덕로15번길 14 (웅남동)"},{"idx":95,"bizno":"6090947504","name":"대천정밀","rep":"전재윤","addr":""},{"idx":96,"bizno":"6090949837","name":"신영에프앤티","rep":"박성규","addr":"경남 창원시 마산회원구 봉암공단10길 23 (봉암동)"},{"idx":97,"bizno":"6090955867","name":"(주)성진기계","rep":"","addr":"경상남도 밀양시"},{"idx":98,"bizno":"6090961957","name":"서진정밀","rep":"서병완","addr":"경남 창원시 의창구 죽전로 36 (팔용동)"},{"idx":99,"bizno":"6090964444","name":"나라메카트론","rep":"박대관","addr":"경남 창원시 의창구 대산면 주남로382번길 41 (제동리)"},{"idx":100,"bizno":"6090965292","name":"세신엔지니어링","rep":"한기융","addr":"경남 창원시 성산구 완암로 50, 메카동 107호 (성산동,창원sk테크노파크)"}];

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