const fs = require('fs');

async function fetchSaraminJob() {
  const url = 'https://www.saramin.co.kr/zf_user/jobs/relay/view?view_type=list&rec_idx=45466721';
  console.log('Fetching Saramin job:', url);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  console.log('Status:', res.status);
  const html = await res.text();
  console.log('Len:', html.length);
  fs.writeFileSync('ws_saramin_job.html', html, 'utf8');

  const phones = html.match(/(?:051|02|070|01[016789])-[0-9]{3,4}-[0-9]{4}|1[568][0-9]{2}-[0-9]{4}/g);
  console.log('Phones in Saramin Job:', [...new Set(phones || [])]);

  const contacts = html.match(/(?:담당자|문의처|접수방법|근무지|연락처|전화)[\s\S]{0,250}/gi) || [];
  contacts.slice(0, 5).forEach((c, i) => {
    console.log(`\nContact ${i + 1}:`);
    console.log(c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  });

  const emails = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  console.log('Emails in Saramin Job:', [...new Set(emails || [])]);
}

fetchSaraminJob();
