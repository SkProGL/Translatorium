const DEFAULT_SETTINGS = {
    'apiKey': 'intro',
    'from': 'auto',
    'to': 'en',
    'tooltip': 'google', // window|cloud|selection|off
    'fontSize': '16px'
}, FAVORITE = [{
    'original': 'Your translation history',
    'from': 'en',
    'to': 'fr',
    'translated': 'Votre historique de traduction'
}];
var temporary = [];
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install" || details.reason === "update") {
        chrome.storage.sync.get(['key'], (result) => { if (!result.key) { chrome.storage.sync.set({ key: DEFAULT_SETTINGS }); } });
        chrome.storage.sync.get(['favoriteKey'], (result) => { if (!result.favoriteKey) { chrome.storage.sync.set({ favoriteKey: FAVORITE }); } });
        chrome.tabs.create({ url: chrome.runtime.getURL("main_page/main.html") });
    }
});

chrome.runtime.onMessage.addListener(function (message) {
    if (message.action === "main_page") { chrome.tabs.create({ url: chrome.runtime.getURL("main_page/main.html") }); }
    else if (message.action === "open") { chrome.tabs.create({ url: message.content }); }
    else if (message.action === "playground") {
        chrome.tabs.create({ url: chrome.runtime.getURL("popup/playground.html") });
        setTimeout(() => { chrome.runtime.sendMessage({ action: "playground_data", content: message.content }); }, 400);
    }
});

chrome.runtime.onConnect.addListener(function (port) {
    try {
        console.assert(port.name === "sck");
        port.onMessage.addListener(function (msg) {
            if (msg.run === 'google') {
                let u = 'https://translate.google.com/?text=' + msg.content;
                if (temporary.length) {
                    for (var i = 0; i < temporary.length; i++) { if (i > 0) { chrome.windows.remove(temporary[i]); } }
                    temporary = [temporary[0]];
                    chrome.windows.update(temporary[0], { focused: true }, () => {
                        chrome.windows.get(temporary[0], { populate: true }, (c) => {
                            chrome.tabs.update(c.tabs[0].id, { url: u, active: true });
                        })
                    });
                    return;
                }
                let w = parseInt(msg.dimensions.width / 2.5), h = parseInt(msg.dimensions.height / 3), t = parseInt(h / 7), l = parseInt(msg.dimensions.width - w);
                // console.log(w, h, t, l);
                if (w === NaN && h === NaN && t === NaN && l === NaN) {
                    console.log('[TRANSLATORIUM] properties are empty');
                    return;
                }
                chrome.windows.create({ url: u, type: 'popup', width: w, height: h, top: t, left: l }, () => {
                    chrome.windows.getAll({ populate: true, windowTypes: ['popup'] }, (callback) => {
                        callback.forEach(element => { temporary.push(element.id); });
                    })
                });
            }
            else if (msg.run === 'google_close') {
                if (temporary.length) {
                    for (var i = 0; i < temporary.length; i++) { chrome.windows.remove(temporary[i]); }
                    temporary = [];
                }
            }
        });
    } catch (error) { console.log('[TRANSLATORIUM] error: ' + error); }
});

chrome.contextMenus.removeAll();
chrome.contextMenus.create({ id: 'translator_reset_main', title: "Reset preferences", contexts: ["action"] });
chrome.contextMenus.create({ id: 'translator_reset_favorites', title: "Reset favorites", contexts: ["action"] });
chrome.contextMenus.create({ id: 'translator_reset_extension', title: "Reset extension (all of the above)", contexts: ["action"] });

function contextClick(info) {
    const { menuItemId } = info
    if (menuItemId === 'translator_reset_main') { chrome.storage.sync.set({ key: DEFAULT_SETTINGS }); }
    if (menuItemId === 'translator_reset_favorites') { chrome.storage.sync.set({ favoriteKey: FAVORITE }); }
    if (menuItemId === 'translator_reset_extension') {
        chrome.storage.sync.set({ key: DEFAULT_SETTINGS });
        chrome.storage.sync.set({ favoriteKey: FAVORITE });
    }
}
chrome.contextMenus.onClicked.addListener(contextClick);



/*
Used for extension initialization and background processes,
when first-installed opens home page, and creates default storage value for user data.
If right click extension icon, context menu will suggest reset settings.
*/