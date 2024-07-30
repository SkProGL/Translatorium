let storageObject = DEFAULT_SETTINGS,
    coordinates = [0, 0], recursionCount = 0,
    prevRange = '', prevContents = '',
    inProgress = false, lastRequest, [requestProgress, textBuffer] = [[], []],
    clipboard = '',
    temporaryProperties = { 'fullscreen': false, 'locked': false };
var remoteBubble, remoteTranslation, remoteDetection, remoteSource, remoteTarget;

const findAscendingTag = (el, tag, until) => {
    let i = 0;
    while (el.parentNode) {
        el = el.parentNode;
        if (el.tagName === tag) { return true; }
        else if (i > until) { return false; }
        i++;
    }
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.target === 'content' && request.action === 'loadParameters') {
        storageObject = request.content;
        loadBubble();
    }
});
chrome.storage.sync.get(['key'], (result) => {
    storageObject = result.key;

    // extraction of API keys
    if (result.key.apiKey === 'get') {
        let apiURL = 'https://rapidapi.com/microsoft-azure-org-microsoft-cognitive-services/api/microsoft-translator-text',
            playgroundURL = 'https://rapidapi.com/iframe-apps/api-playground/latest/Playground.html';
        if (document.location.href === apiURL) {
            setTimeout(() => {
                let iframe = document.querySelector("iframe");
                if (iframe) { document.location.href = iframe.src; }
            }, 6000);
        } else if (document.location.href.toString().includes(playgroundURL)) { getKey(); }
    }
    loadBubble();
});

function loadBubble() {
    let t = document.querySelectorAll('translatorium'),
        csst = document.querySelectorAll('#translatorium_css');
    if (t[0]) { t.forEach(n => n.remove()); }
    if (csst[0]) { csst.forEach(n => n.remove()); }

    if (prevContents) { restoreSelectedText(); }
    if (storageObject.tooltip === 'cloud') { setTimeout(() => { loadOrigin(); }, 400); }
    else if (storageObject.tooltip === 'window') {
        setTimeout(() => {
            advancedBubble();
            if (remoteSource) {
                remoteSource.value = storageObject.from;
                remoteTarget.value = storageObject.to;
            }
        }, 400);
    }
    else if (storageObject.tooltip === 'google' && window.getSelection().toString().length > 0) {
        var port = chrome.runtime.connect({ name: "sck" });
        let screen = {
            height: window.screen.availHeight,
            width: window.screen.availWidth
        }
        port?.postMessage({ run: "google", content: phraseToTranslate, dimensions: screen });
    }
    if (storageObject.tooltip === 'off') { return; }
    if (phraseToTranslate && window.getSelection().isCollapsed === false) {
        inProgress = false;
        if (phraseToTranslate.length > 220) { splitIntoRequests(phraseToTranslate); }
        else { apiRequest(phraseToTranslate, storageObject); }
    }


}
function injectCSS(path) {
    var link = document.createElement("link");
    link.href = chrome.runtime.getURL(path);
    link.rel = "stylesheet";
    link.id = "translatorium_css";
    document.getElementsByTagName("body")[0].appendChild(link);
}
function loadOrigin() {
    fetch(chrome.runtime.getURL('../tooltip_styles/tooltipOriginal.html')).then(r => r.text()).then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
        injectCSS("fonts/ubuntu.css");
        injectCSS("tooltip_styles/tooltipOriginal.css");

        remoteBubble = document.querySelector('#translatorium_bubble');
        remoteTranslation = document.querySelector('#translatorium_text');
        remoteDetection = document.querySelector('#bubble_detect');

    });
}

function advancedBubble() {
    fetch(chrome.runtime.getURL('../tooltip_styles/tooltipWindow.html')).then(r => r.text()).then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
        injectCSS("fonts/ubuntu.css");
        injectCSS("tooltip_styles/tooltipWindow.css");
        dragElement(document.getElementById('translatorium_controls_title'));

        // Basic(included in every template)
        remoteBubble = document.querySelector('#translatorium_bubble');
        remoteTranslation = document.querySelector('#translatorium_text');

        // Basic-additional
        remoteSource = document.querySelector('#translatorium_source');
        remoteTarget = document.querySelector('#translatorium_target');

        remoteTarget.innerText = '';
        listLanguageOptions(remoteSource, remoteTarget, languageListMicrosoft);

        // Additional
        let scaleDown = document.querySelector('#translatorium_controls_scale_down'),
            toolbar = document.querySelector('#translatorium_toolbar'),
            scaleUp = document.querySelector('#translatorium_controls_scale_up'),
            dropdown = document.querySelector('#translatorium_controls_dropdown'),
            logo = document.querySelector('#translatorium_controls_title'),
            mainMenu = document.querySelector('#translatorium_controls_main_menu'),
            fullscreen = document.querySelector('#translatorium_controls_fullscreen'),
            close = document.querySelector('#translatorium_controls_close'),
            clipboardShortcut = document.querySelector('#translatorium_hover_menu_clipboard'),
            playgroundShortcut = document.querySelector('#translatorium_hover_menu_playground'),
            googleShortcut = document.querySelector('#translatorium_hover_menu_google');

        scaleDown.onclick = () => { changeScale(-0.1, remoteBubble); }
        scaleUp.onclick = () => { changeScale(0.1, remoteBubble); }
        dropdown.onclick = () => {
            let visibility = window.getComputedStyle(toolbar).display;
            remoteBubble.style.width = 'auto';
            remoteBubble.style.height = 'auto';
            toolbar.style.display = (visibility === 'none') ? 'flex' : 'none';
        }
        logo.onclick = event => {
            if (event.detail === 2) {
                if (temporaryProperties.locked === false) {
                    temporaryProperties.locked = true;
                    logo.innerText = 'position lock';
                    logo.style.cursor = 'crosshair';
                } else {
                    temporaryProperties.locked = false;
                    logo.innerText = 'Translatorium';
                    logo.style.cursor = 'move';
                }
            }
        };

        mainMenu.onclick = () => { chrome.runtime.sendMessage({ action: "main_page" }); }
        fullscreen.onclick = () => { setFullScreen(remoteBubble); }
        close.onclick = () => {
            if (inProgress) {
                setTimeout(() => { remoteBubble.style.visibility = 'hidden' }, 400);
                inProgress = false;
            }
            else { remoteBubble.style.visibility = 'hidden' }
        }
        clipboardShortcut.onclick = () => {
            copyToClipboard(clipboard);
            let temp = remoteTranslation.innerText;
            remoteTranslation.innerText = "Copied!";
            setTimeout(() => { remoteTranslation.innerText = temp }, 1000)
        }
        playgroundShortcut.onclick = () => { chrome.runtime.sendMessage({ action: "playground", content: phraseToTranslate }); }
        googleShortcut.onclick = () => { chrome.runtime.sendMessage({ action: "open", content: `https://translate.google.com/?sl=auto&tl=${storageObject.to}&text=${phraseToTranslate}&op=translate` }); }

        remoteSource.onchange = optionChange;
        remoteTarget.onchange = optionChange;
        remoteTarget.value = storageObject.to;
    });

}

function setFullScreen(el) {
    let maxWidth = '100%', maxHeight = '100%', proportion = '100%', full = true;
    if (temporaryProperties.fullscreen) {
        maxWidth = '450px';
        maxHeight = '315px';
        proportion = 'auto';
        full = false;
    }
    el.style.scale = 1;
    el.style.maxWidth = maxWidth;
    el.style.maxHeight = maxHeight;
    el.style.width = proportion;
    el.style.height = proportion;
    temporaryProperties.fullscreen = full;

    el.style.left = 0;
    el.style.top = 0;
}
function optionChange() {
    // save settings on option change
    storageObject.from = remoteSource.value;
    storageObject.to = remoteTarget.value;

    inProgress = false;
    if (phraseToTranslate.length > 220) { splitIntoRequests(phraseToTranslate); }
    else { apiRequest(phraseToTranslate, storageObject); }
    chrome.storage.sync.set({ key: storageObject });
}

function changeScale(value, a) {
    let size = parseFloat(window.getComputedStyle(a).scale);
    if (size < 0.7 && value < 0) { return; }
    else if (size > 1.4 && value > 0) { return; }
    if (temporaryProperties.fullscreen) {
        setFullScreen(remoteBubble);
        return;
    }
    a.style.scale = size + value;
}

function getKey() {
    setTimeout(() => {
        // prevent infinite behaviour
        if (recursionCount > 4) { recursionCount = 0; return; }
        if (!document.querySelector('#x-rapidapi-key')) {
            getKey();
            recursionCount += 1;
        }
        else {
            storageObject.apiKey = document.querySelector('#x-rapidapi-key').parentElement.parentElement.innerText;
            chrome.storage.sync.set({ key: storageObject });
            chrome.runtime.sendMessage({ action: "main_page" });
            recursionCount = 0;
        }
    }, 2000);
}

xhrMicrosoft.addEventListener('readystatechange', async function () {
    var errorMessage = {
        401: 'Invalid API key. Please open "Main menu" to enable.'
    }
    // API key absent
    if (this.status === 401) {
        showTranslation(errorMessage[this.status], 'en', coordinates[0], coordinates[1]);
    }
    if (this.readyState === this.DONE) {
        const responseData = JSON.parse(this.responseText)[0];
        if (!responseData) { return; }
        let detection = responseData.detectedLanguage && responseData.detectedLanguage.language || [],
            translation = responseData.translations[0].text;
        // console.log(translation);
        // check whether requestProgress exists and length at least 1
        if (requestProgress && requestProgress.length > 0) {
            textBuffer += translation;
            clipboard = textBuffer;
            let index = requestProgress.indexOf(false);
            // everytime request is made, tooltip keeps coordinates
            (index === 0) ? showTranslation(textBuffer, detection, coordinates[0], coordinates[1]) : showTranslation(textBuffer, detection);
            // last request or aborted
            if (index === requestProgress.length - 1 || index === -1) {
                inProgress=false;
                [requestProgress, textBuffer] = [[], []];
                return;
            }
            requestProgress[index] = true;
        }
        else {
            if (lastRequest === true) {
                lastRequest = false;
                return;
            }
            clipboard = translation;
            showTranslation(translation, detection, coordinates[0], coordinates[1]);

        }
    }
});

function showTranslation(text, detect, x = -1, y = -1) {
    try {
        if (storageObject.tooltip === 'selection') {
            replaceSelectedText(text);
            return;
        }
        if (storageObject.tooltip === 'window') { bubbleTemplateWindow(detect); }
        else if (storageObject.tooltip === 'cloud') { bubbleTemplateOriginal(detect); }
        if (x > -1 || y > -1) {
            if (storageObject.tooltip !== 'window' || storageObject.tooltip === 'window' && !temporaryProperties.locked) {
                remoteBubble.style.left = x + 'px';
                remoteBubble.style.top = y + 'px';
            }
        }

        remoteTranslation.innerText = text;
        remoteBubble.style.visibility = 'visible';
    } catch (error) { console.log('[TRANSLATORIUM] error: ' + error); }
}

function bubbleTemplateOriginal(detect) {
    if (!remoteDetection) { return; }
    if (storageObject.from === 'auto') {
        remoteDetection.innerText = languageListMicrosoft[detect];
        remoteDetection.style.display = 'block';
    }
    else { remoteDetection.style.display = 'none'; }
}
function bubbleTemplateWindow(detect) {
    if (!remoteSource) { return; }
    if (storageObject.from === 'auto') {
        remoteSource.value = 'auto';
        remoteSource.options[0].innerText = 'Auto (' + languageListMicrosoft[detect] + ')';
        remoteSource.setAttribute('temporary-value', detect);
    }
    else {
        remoteSource.value = storageObject.from;
        if (remoteSource.options[0].hasAttribute('temporary-value')) {
            remoteSource.options[0].removeAttribute('temporary-value');
        }
    }
    remoteTarget.value = storageObject.to;
}

function replaceSelectedText(replacementText) {
    var sel, range;
    if (prevContents) { restoreSelectedText(); }
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            prevRange = range;
            prevContents = sel.getRangeAt(0).cloneContents();
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    }
}
function restoreSelectedText() {
    if (prevContents) {
        try {
            prevRange.deleteContents();
            prevRange.insertNode(prevContents);
        } catch (error) { console.log('[TRANSLATORIUM] error: ' + error); };
    }
    prevRange = prevContents = '';
    return;
}

function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    /*
    if present, the header is where you move the DIV from:
    otherwise, move the DIV from anywhere inside the DIV:
    */
    if (document.getElementById(elmnt.id + "header")) { document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown; }
    else { elmnt.onmousedown = dragMouseDown; }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get cursor position at startup:
        [pos3, pos4] = [e.clientX, e.clientY];
        document.onmouseup = closeDragElement;
        // call function, whenever cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set element's new position:
        let obj = cssComputedStyle(remoteBubble),
            a = obj.top - pos2,
            b = obj.left - pos1,
            c = window.innerHeight - obj.height,
            d = window.innerWidth - obj.width;
        a = ((a < 0) ? 0 : a);
        b = ((b < 0) ? 0 : b);
        // elmnt.parentNode.style.top = ((a > c) ? c : a) + 'px';
        // elmnt.parentNode.style.left = ((b > d) ? d : b) + 'px';
        remoteBubble.style.top = ((a > c) ? c : a) + 'px';
        remoteBubble.style.left = ((b > d) ? d : b) + 'px';
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

async function splitIntoRequests(t) {
    /* split every sentence with . or ! or ? or ; 
    without splitting dot after number,
    remove empty string in the end,
    merge fragments into chunks with length less than 200 characters */
    let fragments = breakIntoSentences(t);

    // create boolean-filled array to keep track of last successful request
    requestProgress = new Array(fragments.length).fill(false);
    inProgress = true;
    loop1: for (let i = 0; i < fragments.length; i++) {
        apiRequest(fragments[i], storageObject);
        while (requestProgress[i] === false) {
            if (inProgress === false) {
                [requestProgress, textBuffer] = [[], []];
                lastRequest = true;
                // if (storageObject.tooltip === 'cloud' && remoteBubble) { remoteBubble.style.visibility = 'hidden' }

                break loop1;

            }
            await new Promise(r => setTimeout(r, 500)); // wait half a second
        }
    }
    inProgress = false;
}

/*
Content Script used for accessing page information,
in this case addEventListener 'mouseup' will check if text is selected then make translation request.
Also it will choose whether translation can be shown in tooltip, replacement selection or hidden
it is dependent on settings set by user, by default it's bubble.
If mouse is placed over tooltip longer than 2 seconds, translation will be copied to clipboard.
*/
