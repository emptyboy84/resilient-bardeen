const fs = require('fs');
const path = require('path');

const scratch = 'C:\\Users\\lg\\.gemini\\antigravity\\brain\\44470555-939d-4160-8744-09bb2f099064\\scratch';

function parseSNSS(filePath) {
    console.log(`\n========================================`);
    console.log(`Decoding SNSS file: ${path.basename(filePath)}`);
    console.log(`========================================`);

    const buf = fs.readFileSync(filePath);
    if (buf.length < 8) {
        console.log('File too short');
        return;
    }

    const magic = buf.toString('ascii', 0, 4);
    const version = buf.readInt32LE(4);
    console.log(`Magic: ${magic}, Version: ${version}, Size: ${buf.length}`);

    let offset = 8;
    const tabs = new Map(); // tabId -> { navigations: [], selectedNavIndex: 0, windowId: 0, indexInWindow: 0 }
    const windows = new Map(); // windowId -> { activeTabId: 0, selectedTabIndex: 0 }
    let activeWindowId = null;

    while (offset + 2 <= buf.length) {
        const payloadSize = buf.readUInt16LE(offset);
        offset += 2;
        if (offset + payloadSize > buf.length) break;

        const cmdId = buf.readUInt8(offset);
        const payload = buf.subarray(offset + 1, offset + payloadSize);
        offset += payloadSize;

        try {
            if (cmdId === 0) { // SetTabWindow: payload is [tabId (4B), windowId (4B)]
                const tabId = payload.readInt32LE(0);
                const winId = payload.readInt32LE(4);
                if (!tabs.has(tabId)) tabs.set(tabId, { navigations: [], title: '', url: '' });
                tabs.get(tabId).windowId = winId;
            } else if (cmdId === 1) { // SetTabIndexInWindow
                const tabId = payload.readInt32LE(0);
                const tabIndex = payload.readInt32LE(4);
                if (!tabs.has(tabId)) tabs.set(tabId, { navigations: [], title: '', url: '' });
                tabs.get(tabId).indexInWindow = tabIndex;
            } else if (cmdId === 2) { // TabClosed
                const tabId = payload.readInt32LE(0);
                tabs.delete(tabId);
            } else if (cmdId === 3) { // WindowClosed
                const winId = payload.readInt32LE(0);
                windows.delete(winId);
            } else if (cmdId === 4) { // SetSelectedNavigationIndex
                const tabId = payload.readInt32LE(0);
                const navIndex = payload.readInt32LE(4);
                if (!tabs.has(tabId)) tabs.set(tabId, { navigations: [], title: '', url: '' });
                tabs.get(tabId).selectedNavIndex = navIndex;
            } else if (cmdId === 5) { // SetSelectedTabInIndex
                const winId = payload.readInt32LE(0);
                const selectedIdx = payload.readInt32LE(4);
                if (!windows.has(winId)) windows.set(winId, {});
                windows.get(winId).selectedTabIndex = selectedIdx;
            } else if (cmdId === 6) { // UpdateTabNavigation (or command 1, depending on version)
                // In Chromium: payload starts with id (4), index (4), then pickled data
            }
            
            // Also let's extract strings (URL & Title) from payload if it contains http
            const strAscii = payload.toString('latin1');
            if (strAscii.includes('http://') || strAscii.includes('https://') || strAscii.includes('edge://')) {
                // Find tab id if possible (first 4 bytes)
                let tabId = null;
                if (payload.length >= 8) {
                    tabId = payload.readInt32LE(0);
                }
                
                // Extract URL
                const urlMatch = strAscii.match(/(https?:\/\/[^\s\x00-\x1F\x7F"<>{}|\\^`]+|edge:\/\/[^\s\x00-\x1F\x7F"<>{}|\\^`]+)/);
                const url = urlMatch ? urlMatch[0] : '';
                
                // Extract UTF-16 Title
                let title = '';
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
                    if (l >= 3 && l <= 120) {
                        const cand = payload.toString('utf16le', i, i + l * 2).trim();
                        if (cand.length > title.length && !cand.startsWith('http') && !cand.includes('{"') && !cand.includes('function')) {
                            title = cand;
                        }
                    }
                }

                if (url) {
                    if (tabId !== null && tabs.has(tabId)) {
                        const tab = tabs.get(tabId);
                        tab.url = url;
                        if (title) tab.title = title;
                    } else if (tabId !== null) {
                        tabs.set(tabId, { url, title, windowId: 0, indexInWindow: 0 });
                    }
                }
            }
        } catch (e) {
            // ignore
        }
    }

    console.log(`--- Active Tabs Found (${tabs.size}) ---`);
    for (const [id, tab] of tabs.entries()) {
        if (tab.url || tab.title) {
            console.log(`[Tab ID ${id}]`);
            console.log(`  Title: ${tab.title || '(No Title)'}`);
            console.log(`  URL:   ${tab.url || '(No URL)'}`);
            console.log(`  Win:   ${tab.windowId}, Index: ${tab.indexInWindow}`);
        }
    }
}

parseSNSS(path.join(scratch, 'Session_13432273693242804'));
parseSNSS(path.join(scratch, 'Tabs_13432266087143596'));
