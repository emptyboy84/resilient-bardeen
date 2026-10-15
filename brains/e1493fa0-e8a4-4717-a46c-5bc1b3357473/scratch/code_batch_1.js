async () => {
  const nuxt = window.useNuxtApp();
  const pinia = nuxt.$pinia || nuxt.vueApp.config.globalProperties.$pinia;
  const store = pinia._s.get('searchStore');
  const list = [{"idx":1,"bizno":"6090653247","name":"청우정공","rep":"이상원","addr":"경남 김해시 생림면 상동로 78-73 (나전리)"},{"idx":2,"bizno":"6090657239","name":"도경테크","rep":"하임숙","addr":"경남 창원시 의창구 평산로70번길 20 (팔용동)"},{"idx":3,"bizno":"6090657409","name":"한웅정공","rep":"한기수","addr":"경남 함안군 칠원읍 무기로 69 (무기리)"},{"idx":4,"bizno":"6090658771","name":"백봉제어기계","rep":"","addr":"경남 창원시 성산구 완암로 50"},{"idx":5,"bizno":"6090658790","name":"선도","rep":"윤양호","addr":"경남 창원시 의창구 차룡로 1 (팔용동)"},{"idx":6,"bizno":"6090659111","name":"진양산업","rep":"하희자","addr":"경남 창원시 의창구 대산면 봉강가술로537번길 36 (가술리)"},{"idx":7,"bizno":"6090662896","name":"한국열처리","rep":"","addr":"경상남도 창원시"},{"idx":8,"bizno":"6090663046","name":"호성정기","rep":"이상민","addr":"경남 창원시 성산구 공단로474번길 15 (성산동)"},{"idx":9,"bizno":"6090663347","name":"코리아펀치","rep":"김향곤","addr":"경남 창원시 의창구 차룡로 49, 1층 (팔용동)"},{"idx":10,"bizno":"6090665646","name":"철원정밀공업사","rep":"박진철","addr":"경남 창원시 의창구 차룡단지로 27"},{"idx":11,"bizno":"6090665909","name":"거성정밀","rep":"송경복","addr":"경남 창원시 마산회원구 봉암북13길 43-25 (봉암동)"},{"idx":12,"bizno":"6090671376","name":"광진전자","rep":"","addr":"경상남도 김해시"},{"idx":13,"bizno":"6090673281","name":"청록엔지니어링","rep":"유이경","addr":"경남 창원시 마산회원구 봉암공단5길 81"},{"idx":14,"bizno":"6090678568","name":"PLUS산전","rep":"이규준","addr":"경남 창원시 의창구 태복산로11번길 7 (도계동)"},{"idx":15,"bizno":"6090679913","name":"태창산업","rep":"박창옥","addr":"경남 창원시 성산구 웅남로 328 (웅남동)"},{"idx":16,"bizno":"6090680972","name":"대현제어","rep":"최준관","addr":"경남 창원시 성산구 완암로 50, 메카동 318호 (성산동,창원sk테크노파크)"},{"idx":17,"bizno":"6090681627","name":"화성감리","rep":"","addr":"경상남도 창원시"},{"idx":18,"bizno":"6090687000","name":"진메탈테크","rep":"조국제","addr":"경남 김해시 진영읍 본산로269번길 15-17 (본산리)"},{"idx":19,"bizno":"6090687257","name":"LC하이텍","rep":"이희현","addr":"경남 창원시 마산회원구 봉암공단6길 15 (봉암동)"},{"idx":20,"bizno":"6090687499","name":"태린정밀","rep":"김춘회","addr":"경남 창원시 의창구 팔용로346번길 21 (팔용동)"},{"idx":21,"bizno":"6090689497","name":"K．T．S","rep":"박치영","addr":"경남 창원시 성산구 반월로68번길 5, A동 102호 (신촌동)"},{"idx":22,"bizno":"6090694189","name":"전도기계","rep":"전형도","addr":"경남 창원시 의창구 평산로38번길 35, 차룡단지 (팔용동)"},{"idx":23,"bizno":"6090695719","name":"신영산업","rep":"양기우","addr":""},{"idx":24,"bizno":"6090696270","name":"에이치에스티","rep":"박정만","addr":"경남 창원시 성산구 월림로 74 (신촌동)"},{"idx":25,"bizno":"6090696284","name":"지원정비공업사","rep":"최지원","addr":"경남 창원시 의창구 무역로503번길 5-26, 1층 (팔용동,유통단지)"},{"idx":26,"bizno":"6090697487","name":"성신전자","rep":"박선옥","addr":"경남 창원시 의창구 죽전로74번길 33 (팔용동)"},{"idx":27,"bizno":"6090711429","name":"알파 테크노파크점","rep":"","addr":"경남 창원시 성산구 완암로 50"},{"idx":28,"bizno":"6090713067","name":"신광테크","rep":"이기두","addr":"경남 창원시 성산구 완암로 50, 창원SK테크노파크 메카존 2층 219호 (성산동)"},{"idx":29,"bizno":"6090716972","name":"진영산업","rep":"정진영","addr":"경남 김해시 진례면 고모로 71-15 (산본리)"},{"idx":30,"bizno":"6090717175","name":"혜원테크","rep":"정성일","addr":"경남 창원시 성산구 남면로 219, 1동 5호"},{"idx":31,"bizno":"6090721228","name":"서부테크","rep":"임진태","addr":"경남 진주시 사봉면 산업단지로 102 (사곡리)"},{"idx":32,"bizno":"6090723871","name":"예성테크","rep":"성윤복","addr":"경남 김해시 진례면 고모로216번길 73 (송현리)"},{"idx":33,"bizno":"6090725151","name":"부민에프에이씨","rep":"김종관","addr":"경남 창원시 성산구 월림로39번길 63-35 (신촌동)"},{"idx":34,"bizno":"6090725340","name":"원일정밀","rep":"조제건","addr":"경남 창원시 성산구 월림로65번길 6-55 (신촌동)"},{"idx":35,"bizno":"6090725471","name":"거성정밀","rep":"이철현","addr":"경남 창원시 의창구 동읍 백월로 489-14 (화양리)"},{"idx":36,"bizno":"6090731236","name":"주미엔지니어링","rep":"강희승","addr":"경남 창원시 의창구 차상로150번길 32, 3층 203-1호 (팔용동,팔용종합프라자)"},{"idx":37,"bizno":"6090731798","name":"한길정밀","rep":"이성일","addr":"경남 창원시 의창구 북면 감계로156번길 6-9 (감계리)"},{"idx":38,"bizno":"6090732351","name":"원테크","rep":"박종원","addr":"경남 창원시 성산구 반월로60번길 34-16 (신촌동)"},{"idx":39,"bizno":"6090732856","name":"유선정밀","rep":"최석근","addr":"경남 창원시 의창구 반계로 31, 1층 103호 (팔용동,공장동)"},{"idx":40,"bizno":"6090733097","name":"우경테크","rep":"박민식","addr":"경남 김해시 진영읍 김해대로 94-21 (좌곤리)"},{"idx":41,"bizno":"6090736279","name":"거산정밀","rep":"이두재","addr":"경남 창원시 성산구 월림로65번길 17 (신촌동)"},{"idx":42,"bizno":"6090737152","name":"지오시스","rep":"","addr":"경상남도 창원시"},{"idx":43,"bizno":"6090743426","name":"선우테크","rep":"이정환","addr":"경남 창원시 의창구 죽전로82번길 35 (팔용동)"},{"idx":44,"bizno":"6090745235","name":"동우하이텍","rep":"최석호","addr":"경남 함안군 칠원읍 원서로 139-28 (용정리)"},{"idx":45,"bizno":"6090769877","name":"하이텍","rep":"최기용","addr":"경남 창원시 의창구 북면 동전로45번길 9 (감계리)"},{"idx":46,"bizno":"6090771922","name":"신원정밀","rep":"신석동","addr":"경남 창원시 의창구 죽전로74번길 47, 1층 (팔용동)"},{"idx":47,"bizno":"6090771956","name":"동일정공","rep":"이도연","addr":"경남 창원시 의창구 북면 천주로769번길 90-16 (동전리)"},{"idx":48,"bizno":"6090773333","name":"신광산기","rep":"정순오","addr":"경남 창원시 성산구 성산패총로38번길 14, 1층 (성산동,(주)대림메탈공장)"},{"idx":49,"bizno":"6090774671","name":"성화기계","rep":"이석규","addr":"경남 창원시 성산구 곰절길9번길 26 (성주동)"},{"idx":50,"bizno":"6090775326","name":"대상정공","rep":"황종구","addr":"경남 창원시 성산구 완암로 50, SK테크노파크 메카동 B114 (성산동)"}];

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