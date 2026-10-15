const fs = require('fs');
const path = require('path');

const BRAIN_SRC = 'C:\\Users\\lg\\.gemini\\antigravity\\brain';
const TARGET_REPO = 'C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\main';
const BRAINS_DEST = path.join(TARGET_REPO, 'brains');
const BRAIN_DOCS_DEST = path.join(TARGET_REPO, 'brain_docs');
const CURRENT_CONV_ID = '6d0bcf14-1455-4bc3-b576-f71fd85e4d9c';

// Helper to safely format chat history markdown from transcript.jsonl
function generateChatHistory(convDir, convId) {
  const jsonlPath = path.join(convDir, '.system_generated', 'logs', 'transcript.jsonl');
  const fullJsonlPath = path.join(convDir, '.system_generated', 'logs', 'transcript_full.jsonl');
  const targetPath = fs.existsSync(fullJsonlPath) ? fullJsonlPath : (fs.existsSync(jsonlPath) ? jsonlPath : null);

  if (!targetPath) {
    return {
      firstPrompt: '(대화 로그 없음 / 시스템 생성 아티팩트 보관 세션)',
      startTime: null,
      messageCount: 0,
      chatMd: null
    };
  }

  let lines = [];
  try {
    const raw = fs.readFileSync(targetPath, 'utf8');
    lines = raw.split('\n').filter(l => l.trim().length > 0);
  } catch(e) {
    return { firstPrompt: '(로그 읽기 오류)', startTime: null, messageCount: 0, chatMd: null };
  }

  let userCount = 0;
  let assistantCount = 0;
  let firstPrompt = '';
  let startTime = null;

  const chatBlocks = [];

  for (const line of lines) {
    let entry;
    try {
      entry = JSON.parse(line);
    } catch(e) {
      continue;
    }

    if (!startTime && entry.created_at) {
      startTime = entry.created_at;
    }

    if (entry.type === 'USER_INPUT') {
      userCount++;
      const text = (entry.content || '').trim();
      if (!firstPrompt && text) {
        firstPrompt = text.replace(/[\r\n]+/g, ' ').slice(0, 100);
      }
      chatBlocks.push(`### 👤 USER (질문/요청 #${userCount})\n\n> ⏰ 일시: \`${entry.created_at || 'N/A'}\`\n\n${text || '*(내용 없음)*'}\n\n---`);
    } else if (entry.type === 'PLANNER_RESPONSE') {
      assistantCount++;
      let content = (entry.content || '').trim();
      let toolsSummary = '';

      if (entry.tool_calls && entry.tool_calls.length > 0) {
        const toolList = entry.tool_calls.map(tc => {
          const action = tc.args && tc.args.toolAction ? tc.args.toolAction : '';
          const summary = tc.args && tc.args.toolSummary ? tc.args.toolSummary : '';
          return `- **도구 호출**: \`${tc.name || 'tool'}\` ${action ? '(' + action + ')' : ''} ${summary ? ': ' + summary : ''}`;
        }).join('\n');
        toolsSummary = `\n\n#### 🛠 실행 도구 목록\n${toolList}`;
      }

      if (!content && toolsSummary) {
        content = '*(도구 실행 및 데이터 처리 수행)*';
      }

      chatBlocks.push(`### 🤖 ANTIGRAVITY (응답/실행 내용 #${assistantCount})\n\n> ⏰ 일시: \`${entry.created_at || 'N/A'}\`\n\n${content || '*(응답 완료)*'}${toolsSummary}\n\n---`);
    }
  }

  const header = `# 💬 대화 기록 (Chat History)

> **대화 세션 ID**: \`${convId}\`  
> **생성 일시**: \`${startTime || 'N/A'}\`  
> **총 사용자 요청 수**: ${userCount}건  
> **총 어시스턴트 응답/작업 수**: ${assistantCount}건  

---

`;

  const fullMd = header + chatBlocks.join('\n\n');
  return {
    firstPrompt: firstPrompt || '(프롬프트 없음)',
    startTime: startTime,
    messageCount: userCount + assistantCount,
    chatMd: fullMd
  };
}

// Recursive copy function
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function main() {
  console.log('=== [1] Brain Directory Scan Starting ===');
  const convDirs = fs.readdirSync(BRAIN_SRC).filter(d => {
    const p = path.join(BRAIN_SRC, d);
    return fs.statSync(p).isDirectory() && d !== 'tempmediaStorage';
  });

  console.log(`Found ${convDirs.length} conversation sessions in ${BRAIN_SRC}`);

  if (!fs.existsSync(BRAINS_DEST)) {
    fs.mkdirSync(BRAINS_DEST, { recursive: true });
  }

  const catalog = [];

  for (let i = 0; i < convDirs.length; i++) {
    const convId = convDirs[i];
    const srcPath = path.join(BRAIN_SRC, convId);
    const destPath = path.join(BRAINS_DEST, convId);

    if ((i + 1) % 20 === 0 || i === convDirs.length - 1) {
      console.log(`Processing [${i + 1}/${convDirs.length}]: ${convId}...`);
    }

    // 1. Copy files
    copyDirRecursive(srcPath, destPath);

    // 2. Parse Chat History
    const chatInfo = generateChatHistory(srcPath, convId);
    if (chatInfo.chatMd) {
      fs.writeFileSync(path.join(destPath, 'chat_history.md'), chatInfo.chatMd, 'utf8');
    }

    // 3. Check artifacts
    const files = fs.readdirSync(srcPath);
    const mdFiles = files.filter(f => f.endsWith('.md') && f !== 'chat_history.md');

    catalog.push({
      id: convId,
      startTime: chatInfo.startTime || 'N/A',
      firstPrompt: chatInfo.firstPrompt,
      messageCount: chatInfo.messageCount,
      mdFiles: mdFiles,
      hasChat: !!chatInfo.chatMd
    });
  }

  // Sort catalog chronologically (newest first)
  catalog.sort((a, b) => {
    if (a.startTime === 'N/A') return 1;
    if (b.startTime === 'N/A') return -1;
    return new Date(b.startTime) - new Date(a.startTime);
  });

  console.log('=== [2] Creating Master Catalog (brains/README.md) ===');
  let readme = `# 🧠 Antigravity 전체 브레인 세션 및 대화록 마스터 카탈로그 (Master Catalog)

> **총 대화 세션 수**: ${catalog.length}개  
> **아카이브 일시**: \`${new Date().toISOString()}\`  
> **저장소**: [resilient-bardeen](https://github.com/emptyboy84/resilient-bardeen) (\`main\` 브랜치)  
> **안내**: 각 세션별 폴더 내에 원본 아티팩트(\`*.md\`), 스크래치 스크립트(\`scratch/\`), 원본 대화 로그(\`transcript.jsonl\`), 그리고 읽기 편하게 변환된 대화록(\`chat_history.md\`)이 모두 보관되어 있습니다.

---

## 📋 세션 목록 (최신순)

| 번호 | 세션 ID | 시작 일시 | 주요 요청 / 첫 질문 요약 | 주요 아티팩트 | 대화록 링크 |
| :---: | :--- | :---: | :--- | :--- | :---: |
`;

  catalog.forEach((cat, idx) => {
    const num = idx + 1;
    const artifactsStr = cat.mdFiles.length > 0 ? cat.mdFiles.map(m => `\`${m}\``).join(', ') : '-';
    const chatLink = cat.hasChat ? `[열람](./${cat.id}/chat_history.md)` : '-';
    const cleanPrompt = cat.firstPrompt.replace(/\|/g, '\\|');
    readme += `| ${num} | [\`${cat.id}\`](./${cat.id}) | ${cat.startTime ? cat.startTime.slice(0, 19).replace('T', ' ') : '-'} | ${cleanPrompt} | ${artifactsStr} | ${chatLink} |\n`;
  });

  fs.writeFileSync(path.join(BRAINS_DEST, 'README.md'), readme, 'utf8');
  console.log('brains/README.md generated successfully!');

  // Copy current conversation into brain_docs
  console.log('=== [3] Updating brain_docs for Current Session ===');
  if (!fs.existsSync(BRAIN_DOCS_DEST)) {
    fs.mkdirSync(BRAIN_DOCS_DEST, { recursive: true });
  }

  const curSrc = path.join(BRAIN_SRC, CURRENT_CONV_ID);
  copyDirRecursive(curSrc, BRAIN_DOCS_DEST);

  // Generate current chat history for brain_docs/chat_history.md
  const curChat = generateChatHistory(curSrc, CURRENT_CONV_ID);
  if (curChat.chatMd) {
    fs.writeFileSync(path.join(BRAIN_DOCS_DEST, 'chat_history.md'), curChat.chatMd, 'utf8');
  }

  console.log('brain_docs/ updated successfully!');
  console.log('ALL BRAIN SYNC COMPLETED SUCCESSFULLY!');
}

main().catch(console.error);
