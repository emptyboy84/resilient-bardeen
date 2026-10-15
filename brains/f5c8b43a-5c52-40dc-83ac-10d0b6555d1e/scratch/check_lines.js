const fs = require('fs');
const readline = require('readline');

const filePath = "C:\\Users\\lg\\Desktop\\Today\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_여기까지했어요.csv";

async function checkSpecificLines() {
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const targetLines = new Set([12006, 20476, 20495]);
    let lineNum = 0;

    for await (const line of rl) {
        lineNum++;
        if (targetLines.has(lineNum)) {
            console.log(`Line ${lineNum}: ${line.substring(0, 150)}`);
        }
    }
}

checkSpecificLines().catch(console.error);
