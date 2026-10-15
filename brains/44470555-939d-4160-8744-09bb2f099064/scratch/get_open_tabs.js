const fs = require('fs');
const path = require('path');

const scratch = 'C:\\Users\\lg\\.gemini\\antigravity\\brain\\44470555-939d-4160-8744-09bb2f099064\\scratch';
const buf = fs.readFileSync(path.join(scratch, 'Session_13432273693242804'));

console.log('Session file length:', buf.length);

let offset = 8;
const tabs = new Map();
let currentSelectedTabInWindow = {};

while (offset + 2 <= buf.length) {
    const payloadSize = buf.readUInt16LE(offset);
    offset += 2;
    if (offset + payloadSize > buf.length) break;

    const cmdId = buf.readUInt8(offset);
    const payload = buf.subarray(offset + 1, offset + payloadSize);
    offset += payloadSize;

    if (cmdId === 0 && payload.length >= 8) { // SetTabWindow(tabId, windowId)
        const tabId = payload.readInt32LE(0);
        const winId = payload.readInt32LE(4);
        if (!tabs.has(tabId)) tabs.set(tabId, { id: tabId });
        tabs.get(tabId).winId = winId;
    } else if (cmdId === 1 && payload.length >= 8) { // SetTabIndexInWindow(tabId, tabIndex)
        const tabId = payload.readInt32LE(0);
        const tabIndex = payload.readInt32LE(4);
        if (!tabs.has(tabId)) tabs.set(tabId, { id: tabId });
        tabs.get(tabId).tabIndex = tabIndex;
    } else if (cmdId === 2 && payload.length >= 4) { // TabClosed(tabId)
        const tabId = payload.readInt32LE(0);
        tabs.delete(tabId);
    } else if (cmdId === 4 && payload.length >= 8) { // SetSelectedNavigationIndex(tabId, index)
        const tabId = payload.readInt32LE(0);
        const navIndex = payload.readInt32LE(4);
        if (!tabs.has(tabId)) tabs.set(tabId, { id: tabId });
        tabs.get(tabId).selectedNavIndex = navIndex;
    } else if (cmdId === 5 && payload.length >= 8) { // SetSelectedTabInIndex(windowId, tabIndex)
        const winId = payload.readInt32LE(0);
        const tabIdx = payload.readInt32LE(4);
        currentSelectedTabInWindow[winId] = tabIdx;
    } else if (cmdId === 6 || cmdId === 25 || cmdId === 1) {
        // TabNavigation: extract URL & Title
        // Check if payload contains URL
        const str = payload.toString('latin1');
        const urlMatch = str.match(/https?:\/\/[^\s\x00-\x1F\x7F"<>{}|\\^`]+/);
        if (urlMatch && payload.length >= 8) {
            const tabId = payload.readInt32LE(0);
            if (!tabs.has(tabId)) tabs.set(tabId, { id: tabId });
            const tab = tabs.get(tabId);
            tab.url = urlMatch[0];

            // Look for UTF-16 title
            for (let i = 0; i < payload.length - 4; i += 2) {
                let l = 0;
                while (i + l * 2 + 1 < payload.length) {
                    const code = payload.readUInt16LE(i + l * 2);
                    if ((code >= 0x20 && code <= 0x7E) || (code >= 0xAC00 && code <= 0xD7A3) || (code >= 0x3000 && code <= 0x303F)) {
                        l++;
                    } else {
                        break;
                    }
                }
                if (l >= 3 && l <= 150) {
                    const cand = payload.toString('utf16le', i, i + l * 2).trim();
                    if (cand.length > (tab.title || '').length && !cand.startsWith('http') && !cand.includes('{"') && !cand.includes('function')) {
                        tab.title = cand;
                    }
                }
            }
        }
    }
}

console.log('Selected Tab Index by Window:', currentSelectedTabInWindow);

const sortedTabs = Array.from(tabs.values()).filter(t => t.url);
sortedTabs.sort((a, b) => (a.tabIndex || 0) - (b.tabIndex || 0));

console.log(`\n=== Currently Open Edge Tabs (${sortedTabs.length} tabs) ===`);
sortedTabs.forEach(t => {
    const isSelected = currentSelectedTabInWindow[t.winId] === t.tabIndex ? ' [ACTIVE / SELECTED]' : '';
    console.log(`Tab #${t.tabIndex} (Win: ${t.winId})${isSelected}`);
    console.log(`  Title: ${t.title || '(No Title)'}`);
    console.log(`  URL:   ${t.url}`);
});
