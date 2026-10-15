const fs = require('fs');
const readline = require('readline');

async function search() {
  const filePath = 'C:/Users/lg/Desktop/Today/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.csv';
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const targets = ['오픈와이즈', '인디페이퍼', '대명기획', '지플러스디자인', '우둥불', '삼수니 다락방', '그린토이나라', '규성애드', '부산일보 사직지국'];
  let lNum = 0;
  for await (const line of rl) {
    lNum++;
    for (const t of targets) {
      if (line.includes(t)) {
        console.log(`L${lNum}: ${line}`);
      }
    }
  }
}
search();
