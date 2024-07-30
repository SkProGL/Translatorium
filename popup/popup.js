let storageObject = DEFAULT_SETTINGS,
    previousOptionIndex = [], timeouts = [],
    sourceSelect = document.querySelector("#source-lang"),
    reverseButton = document.querySelector("#reverse-lang"),
    targetSelect = document.querySelector("#target-lang"),
    inputTranslate = document.querySelector('#input-translate'),
    outputTranslate = document.querySelector('#output-translate'),
    wordCount = document.querySelector('#in-word-count'),
    dictionaryArea = document.querySelector('#dictionary-area'),
    favoritesArea = document.querySelector('#favorites-area'),
    guide = document.querySelector('.bubble');

var tooltipDelay = function (elem, callback) {
    timeouts['t3'] = null;
    // guide.style.transition = '1s cubic-bezier(.49,0.1,.47,0.9)';
    guide.style.visibility = 'hidden';
    // set timeout to be a timer which will invoke callback function
    elem.onmouseenter = function (e) {
        if (guide.style.visibility === 'hidden') { timeouts['t3'] = setTimeout(callback, 1200); }
        else {
            clearTimeout(timeouts['t3']);
            // clearTimeout(timeouts['t4']);
        }
        tooltipPosition(e.x, e.y)
        guide.innerText = elem.getAttribute('hover-title');
    };
    elem.onmousemove = function (e) { tooltipPosition(e.x, e.y); }
    // clear timers
    elem.onmouseleave = function () {
        // timeouts['t4'] = setTimeout(() => {
        clearTimeout(timeouts['t3']);
        guide.style.visibility = 'hidden';
        // }, 300)
    }
};

function getStorage() {
    chrome.storage.sync.get(['key'], (result) => {
        storageObject = result.key
        // console.log(storageObject);
        document.querySelector('input[value="' + result.key.tooltip + '"]').checked = true;
        sourceSelect.value = result.key.from;
        targetSelect.value = result.key.to;
        inputTranslate.style.fontSize = result.key.fontSize;
        outputTranslate.style.fontSize = result.key.fontSize;
    });
    // document.querySelectorAll('input[value="' + 'guide' + '"]')[0].checked = true;
}

function onClick(id, action) {
    document.querySelector(id).onclick = action;
}

function loadExtension() {
    listLanguageOptions(sourceSelect, targetSelect, languageListMicrosoft);
    inputTranslate.focus();
    sourceSelect.value = storageObject.from;
    targetSelect.value = storageObject.to;
    previousOptionIndex[0] = sourceSelect.selectedIndex;
    previousOptionIndex[1] = targetSelect.selectedIndex;
    // favoritesArea.style.background = "linear-gradient(" + getRandomInt(361) + "deg, #1d1d1d 0%, rgb(8 8 8 / 31%) 100%)";
    favoritesArea.style.background = "linear-gradient(" + getRandomInt(361) + "deg, #1d1d1d 0%, rgb(19 19 19) 100%)";
    titleOnHover();
    loadFavorites();
    getStorage();
}
function optionChange() {
    inputTranslate.spellcheck = (sourceSelect.value === 'en' || sourceSelect.options[0].getAttribute('temporary-value') === 'en') ? true : false;
    // restricts setting the same option for both languages
    if (sourceSelect.selectedIndex - 1 === targetSelect.selectedIndex) {
        [sourceSelect.selectedIndex, targetSelect.selectedIndex] = [previousOptionIndex[0], previousOptionIndex[1]]
        swap();
    }
    storageObject.from = sourceSelect.value;
    storageObject.to = targetSelect.value;
    if (inputTranslate.value.length > 0) {
        TranslateWithDictionary(inputTranslate.value, storageObject);
    }
    previousOptionIndex = [sourceSelect.selectedIndex, targetSelect.selectedIndex];

    storageObject && SaveAndApply();
}
function swap() {
    let s = sourceSelect.selectedIndex;
    if (sourceSelect.selectedIndex === 0) { // autodetection enabled
        if (sourceSelect.options[0].hasAttribute('temporary-value')) {
            s = targetSelect.selectedIndex + 1;
            targetSelect.value = sourceSelect.options[0].getAttribute('temporary-value');
            sourceSelect.selectedIndex = s;
        } else { return; }
    } else {
        sourceSelect.selectedIndex = targetSelect.selectedIndex + 1;
        targetSelect.selectedIndex = s - 1;
    }
    storageObject.from = sourceSelect.value;
    storageObject.to = targetSelect.value;
    inputTranslate.value = (outputTranslate.innerText.trim() === '') ? '' : outputTranslate.innerText;
    TranslateWithDictionary(inputTranslate.value, storageObject);
    SaveAndApply();
}
function countWords() {
    let count = inputTranslate.value.trim().split(/\s+/).length;
    if (inputTranslate.value.trim().length === 0) { wordCount.innerText = ''; }
    else { wordCount.innerText = + (count === 1) ? count + ' word' : count + ' words'; }
}
function showTranslation(t) { outputTranslate.innerText = t; }

function fontSizeChange(arg = 2) {
    let size = parseInt(window.getComputedStyle(inputTranslate).fontSize);

    if (size <= 12 && arg < 0 || size >= 96 && arg > 0) { return; }
    inputTranslate.style.fontSize = size + arg + 'px';
    outputTranslate.style.fontSize = size + arg + 'px';
    storageObject.fontSize = size + arg + 'px';
    chrome.storage.sync.set({ key: storageObject });
}

function textToSpeech(t, detection) {
    let permitted = false
    const voiceList = [{ name: 'Microsoft George - English (United Kingdom)', lang: 'en-GB' }, { name: 'Microsoft Hazel - English (United Kingdom)', lang: 'en-GB' }, { name: 'Microsoft Susan - English (United Kingdom)', lang: 'en-GB' }, { name: 'Microsoft Irina - Russian (Russia)', lang: 'ru-RU' }, { name: 'Microsoft Pavel - Russian (Russia)', lang: 'ru-RU' }, { name: 'Google Deutsch', lang: 'de-DE' }, { name: 'Google US English', lang: 'en-US' }, { name: 'Google UK English Female', lang: 'en-GB' }, { name: 'Google UK English Male', lang: 'en-GB' }, { name: 'Google español', lang: 'es-ES' }, { name: 'Google español de Estados Unidos', lang: 'es-US' }, { name: 'Google français', lang: 'fr-FR' }, { name: 'Google हिन्दी', lang: 'hi-IN' }, { name: 'Google Bahasa Indonesia', lang: 'id-ID' }, { name: 'Google italiano', lang: 'it-IT' }, { name: 'Google 日本語', lang: 'ja-JP' }, { name: 'Google 한국의', lang: 'ko-KR' }, { name: 'Google Nederlands', lang: 'nl-NL' }, { name: 'Google polski', lang: 'pl-PL' }, { name: 'Google português do Brasil', lang: 'pt-BR' }, { name: 'Google русский', lang: 'ru-RU' }, { name: 'Google 普通话（中国大陆）', lang: 'zh-CN' }, { name: 'Google 粤語（香港）', lang: 'zh-HK' }, { name: 'Google 國語（臺灣）', lang: 'zh-TW' }],
        utterance = new SpeechSynthesisUtterance(t);
    voiceList.forEach((el) => {
        if (el.lang.includes(detection)) {
            permitted = true;
            detection = el.lang;
        }
    })
    if (t.trim().length > 0) {
        utterance.lang = ((permitted) ? detection : 'en-US').replace('en-GB', 'en-US');
    }
    else { utterance.text = "seems like textfield is empty"; }
    window.speechSynthesis.speak(utterance);
}
// detected language or en or current value
function currentSourceLanguage(detectionAllowed = false) {
    if (sourceSelect.value === 'auto' && sourceSelect.options[0].hasAttribute('temporary-value')) {
        return sourceSelect.options[0].getAttribute('temporary-value');
    }
    else if (sourceSelect.value === 'auto' && detectionAllowed === false) { return 'en'; }
    else { return sourceSelect.value; }
}
function showSynonyms(t, d = '') {
    let row = document.createElement('div'),
        title = document.createElement('div'),
        text = document.createElement('span'),
        description = document.createElement('div');
    quickSet(row, 'dictionary-row');
    quickSet(title, 'title', '', t);
    quickSet(description, 'description');
    quickSet(text, 'text-content');
    text.tabIndex = '0'; // make keyboard focusable
    d && d.map((n, i) => {
        text.innerText = ' ' + n + ((i === d.length - 1) ? '' : ',');
        description.appendChild(text.cloneNode(true));
    });
    description.onclick = () => { textOptionClick(event.target.innerText); }
    description.onkeyup = (e) => { if (e.key === 'Enter') { textOptionClick(event.target.innerText); } }
    row.appendChild(title);
    row.appendChild(description);
    dictionaryArea.appendChild(row);
}
function removeSynonyms() {
    dictionaryArea.style.display = 'none';
    dictionaryArea.innerText = '';
}
function textOptionClick(t) {
    swap();
    t = t.replaceAll(',', '').trim();
    inputTranslate.value = t;
    TranslateWithDictionary(t, storageObject);
    inputTranslate.focus();
}

function TranslateWithDictionary(text, obj) {
    if (text.length < 250) {
        apiRequest(text, obj);
        if (text.length < 30) { setTimeout(() => { dictionaryRequest(text, obj, targetSelect.value, currentSourceLanguage()); }, 1000); }
    }
    else { largeApiRequest(breakIntoSentences(text), obj); }
}

function tooltipPosition(mouseX, mouseY) {
    let x = (mouseX - guide.clientWidth / 2 > 0) ? mouseX - guide.clientWidth / 2 : 5,
        y = (mouseY > 40) ? mouseY - 30 : mouseY + 20;
    x = (mouseX + guide.clientWidth / 2 > window.innerWidth) ? window.innerWidth - (guide.clientWidth + 5) : x;
    guide.style.left = x + 'px';
    guide.style.top = y + 'px';
}
function titleOnHover() {
    const titles = document.querySelectorAll('[hover-title]');
    for (i in titles) { tooltipDelay(titles[i], function () { guide.style.visibility = 'visible'; }); }
}
function sendMessage(c, t = 'content', a = 'loadParameters') {
    chrome.tabs.query({}, function (tabs) {
        let message = { target: t, action: a, content: c };
        for (let i = 0; i < tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, message, function (result) {
                // message processing
                if (chrome.runtime.lastError && result) { console.log('[TRANSLATORIUM] error: ' + result); }
            })
        }
    });
}
function SaveAndApply() {
    chrome.storage.sync.set({ key: storageObject });
    sendMessage(storageObject);
}

function clickNotify(t) {
    wordCount.innerText = t;
    setTimeout(() => { countWords() }, 2000);
}
function quickSet(element, classList, attribute = '', text = '') {
    classList && (element.classList.add(classList));
    attribute && (element.setAttribute(attribute[0], attribute[1]));
    text && (element.innerText = text);
}
function translationTemplate(elem) {
    sourceSelect.value = storageObject.from = elem.parentNode.getAttribute('from-lang');
    targetSelect.value = storageObject.to = elem.parentNode.getAttribute('to-lang');
    inputTranslate.value = elem.innerText;
    outputTranslate.innerText = elem.parentNode.querySelector('.translated').innerText;

    SaveAndApply();
    if (inputTranslate.value.length < 30) {
        setTimeout(() => {
            dictionaryRequest(inputTranslate.value, storageObject, targetSelect.value, currentSourceLanguage())
        }, 1000);
    }
}

function addFavorite(s, t, from, to, save = true) {
    if (!s.trim()) { return; }

    favoritesArea.style.display = 'block';
    let row = document.createElement('div'),
        original = document.createElement('div'),
        star = document.createElement('button'),
        translated = document.createElement('div');
    quickSet(row, 'favorites-row');
    quickSet(original, 'original', ['hover-title', (languageListMicrosoft[from] || 'Auto') + ' to ' + languageListMicrosoft[to]], s);
    quickSet(star, 'star', ['hover-title', 'Unstar'], '✦');
    quickSet(translated, 'translated', ['hover-title', 'Copy'], t);

    row.setAttribute('from-lang', from);
    row.setAttribute('to-lang', to);
    original.tabIndex = '0';
    original.onclick = () => { translationTemplate(event.target); }
    original.onkeyup = (e) => { if (e.key === 'Enter') { translationTemplate(event.target); } }

    translated.onclick = () => {
        copyToClipboard(event.target.parentNode.querySelector('.original').innerText + ' ' + event.target.innerText)
        clickNotify('Copied!');
    }

    star.onclick = () => {
        event.target.parentNode.remove();
        saveFavorites();
        guide.style.visibility = 'hidden';
    }
    // original.onkeyup = (e) => { if (e.key === 'Enter') { textOptionClick(event.target.innerText); } }
    row.appendChild(original);
    row.appendChild(star);
    row.appendChild(translated);
    favoritesArea.prepend(row);
    save && saveFavorites();
    titleOnHover();
}
function saveFavorites() {
    let rows = [...favoritesArea.children],
        favoritesObject = [];
    // console.log(rows)
    rows.map(r => {
        let row = {
            'original': r.querySelector('.original').innerText,
            'from': r.getAttribute('from-lang'),
            'to': r.getAttribute('to-lang'),
            'translated': r.querySelector('.translated').innerText
        };
        favoritesObject.push(row);
    });
    // console.log(favoritesObject);
    // replaces if statement
    !favoritesObject.length && (favoritesArea.style.display = 'none');
    chrome.storage.sync.set({ favoriteKey: favoritesObject });
}
function loadFavorites() {
    chrome.storage.sync.get(['favoriteKey'], function (result) {
        // console.log(result.key[0]);
        if (result.favoriteKey?.[0]) {
            favoritesArea.style.display = 'block';
            result.favoriteKey.slice().reverse().map(e => { addFavorite(e.original, e.translated, e.from, e.to, false); });
        } else { favoritesArea.style.display = 'none'; }
    });
}

function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

/*
Extension popup menu(Advanced Menu), ranges from dictionary to translation history/favorites,
has 'text to speech', button 'copy to clipboard' and 'word counter' by default.
Live translation works by principle, while typing no translation requests made(to handle request overflow problem),
if stopped typing after 0.5 sec make request.
Settings changed in popup menu directly influence behaviour of an extension settings and page interaction.
*/
