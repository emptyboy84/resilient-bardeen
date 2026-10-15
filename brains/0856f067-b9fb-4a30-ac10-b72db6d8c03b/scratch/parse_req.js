const input = `괴정만화					051-206-3991		사하구	사하구 괴정동 낙동대로 성현빌딩  	만화						
티앤북스`;

const lines = input.split('\n');
lines.forEach((line, lineIdx) => {
  const parts = line.split('\t');
  console.log(`--- Line ${lineIdx} (length: ${parts.length}) ---`);
  parts.forEach((p, i) => console.log(`${i}: ${JSON.stringify(p)}`));
});
