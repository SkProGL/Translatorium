chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'playground_data') {
        if (request.content) {
            inputTranslate.value = request.content.trim();
            TranslateWithDictionary(inputTranslate.value, storageObject);
        }
    }
});
onClick('#extension-home', () => { chrome.tabs.create({ url: chrome.runtime.getURL("main_page/main.html") }); });
onClick('#extension-playground', () => { chrome.tabs.create({ url: chrome.runtime.getURL("popup/playground.html") }); });
onClick('#extension-download', () => {
    if (favoritesArea) {
        let line = '';
        [...favoritesArea.children].map(r => {
            line += r.querySelector('.original').innerText + ' / ' + r.querySelector('.translated').innerText + '\n';
        });
        const date = new Date();
        let [day, month, year] = [date.getDate(), date.getMonth() + 1, date.getFullYear()]
        download(line, `${day}-${month}-${year}.txt`, 'text/plain')
    }
});
onClick('#in-clipboard', () => {
    clickNotify('Copied!');
    copyToClipboard(inputTranslate.value);
});
onClick('#out-clipboard', () => {
    clickNotify('Copied!');
    copyToClipboard(outputTranslate.innerText);
});
onClick('#in-speak', () => { textToSpeech(inputTranslate.value, currentSourceLanguage()); clickNotify('Speaking...') });
onClick('#out-speak', () => { textToSpeech(outputTranslate.innerText, targetSelect.value); clickNotify('Speaking...') });
onClick('#favorite', () => {
    addFavorite(inputTranslate.value, outputTranslate.innerText, currentSourceLanguage(true), targetSelect.value);
    if (!inputTranslate.value.trim()) { clickNotify("Text is empty!"); }
    else { clickNotify("Added to favorites!"); }
});
onClick("#in-scale-decrease", () => { fontSizeChange(-2); })
onClick("#in-scale-increase", () => { fontSizeChange(); })
reverseButton.onclick = swap;
sourceSelect.onchange = optionChange;
targetSelect.onchange = optionChange;
loadExtension();

inputTranslate.addEventListener('keyup', (e) => {
    clearTimeout(timeouts['t1']);
    timeouts['t1'] = setTimeout(function () {
        if (e.key === 'Tab' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') { return; };
        countWords();
        if (inputTranslate.value.trim() === '') {
            outputTranslate.innerText = '';
            inputTranslate.value = inputTranslate.value.trim();
            sourceSelect.options[0].innerText = 'Auto';
            sourceSelect.options[0].removeAttribute('temporary-value');
            removeSynonyms();
            return;
        }
        clearTimeout(timeouts['t2']);
        timeouts['t2'] = setTimeout(() => {
            inputTranslate.value = inputTranslate.value.trim();
        }, 1500);
        TranslateWithDictionary(inputTranslate.value, storageObject);
    }, 500);
});
inputTranslate.addEventListener('paste', () => {
    inputTranslate.value = inputTranslate.value.trim();
    TranslateWithDictionary(inputTranslate.value, storageObject);
});


document.addEventListener('wheel', (event) => {
    if (event.ctrlKey) { fontSizeChange(event.deltaY > 0 ? -2 : 2); }
});

document.addEventListener('keyup', function (e) {
    e.preventDefault();
    if (e.ctrlKey && e.key === 'Enter') {
        chrome.tabs.create({ url: 'https://translate.google.com/?text=' + inputTranslate.value, active: true });
    }
    else if (e.ctrlKey && e.key === "q") { swap(); }
    else if (e.altKey && e.key === "1") { sourceSelect.focus(); }
    else if (e.altKey && e.key === "2") { targetSelect.focus(); }
    else if (e.altKey && e.key === "i") { inputTranslate.focus(); }
    else if (e.ctrlKey && e.key === ".") {
        clickNotify('Copied!');
        copyToClipboard(outputTranslate.innerText);
    }
    else if (e.ctrlKey && e.altKey && e.key === "f") {
        addFavorite(inputTranslate.value, outputTranslate.innerText, currentSourceLanguage(true), targetSelect.value);
        if (!inputTranslate.value.trim()) { clickNotify("Text is empty!"); }
        else { clickNotify("Added to favorites!"); }

    }
})


xhrMicrosoft.addEventListener('readystatechange', async function () {
    if (this.readyState === this.DONE) {
        const responseData = JSON.parse(this.responseText)[0];
        const response = JSON.parse(this.responseText);

        // handle errors
        if (response.message) { outputTranslate.innerText = response.message; }
        if (!responseData) { return; }

        let detection = responseData && responseData.detectedLanguage && responseData.detectedLanguage.language || [],
            translation = responseData.translations[0].text;
        if (translation === '') { translation = inputTranslate.value; }

        // Autodetection check
        if (detection.length > 0) {
            if (sourceSelect.value === 'auto') {
                if (languageListMicrosoft[detection]) {
                    sourceSelect.options[0].innerText = 'Auto (' + languageListMicrosoft[detection] + ')';
                    sourceSelect.options[0].setAttribute('temporary-value', detection);
                }
                // sometimes autodetection returns unknown language tags(but works for most of the languages)
                else { sourceSelect.options[0].innerText = 'Auto (unsupported tag: ' + detection + ')'; }
            }
            else if (sourceSelect.options[0].hasAttribute('temporary-value')) { sourceSelect.options[0].removeAttribute('temporary-value'); }
        }
        let parts = '';
        if (response.length > 1) { response.forEach(e => { parts += e.translations[0].text; }); }
        else { parts = translation }

        showTranslation(parts, detection);
    }
});

xhrMicrosoftDictionary.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
        let exist = JSON.parse(this.responseText)[0]
        // console.log(exist);
        if (!exist || !exist.translations || !exist.translations.length) {
            // console.log('[NOT FOUND]');
            removeSynonyms();
            return;
        }
        let response = exist.translations || [],
            arr = {};
        for (i in response) {
            let partOfSpeech = response[i].posTag.toLowerCase(),
                synonyms = response[i].normalizedTarget;
            if (arr[partOfSpeech]) { arr[partOfSpeech].push(synonyms); }
            else { arr[partOfSpeech] = ([synonyms]); }
        }
        removeSynonyms();
        // console.log(arr);
        dictionaryArea.style.display = 'block';
        dictionaryArea.style.background = "linear-gradient(" + getRandomInt(361) + "deg, var(--bg-color)0%, var(--output-bg-color)100%)";
        for (j in arr) { showSynonyms(dictionaryTag[j.toUpperCase()], arr[j]); }
    }
});

for (const radioInput of document.querySelectorAll('.radio_input')) {
    radioInput.addEventListener('change', function () {
        if (this.checked) {
            storageObject.tooltip = this.value;
            // console.log(storageObject);
            SaveAndApply();
        }
    });
}
for (const radioLabel of document.querySelectorAll('.radio_label')) {
    radioLabel.onkeyup = (e) => {
        if (e.key === 'Enter') {
            document.querySelector('#' + radioLabel.getAttribute('for')).checked = true;
            storageObject.tooltip = document.querySelector('#' + radioLabel.getAttribute('for')).value;
            // console.log(storageObject);
            SaveAndApply()
        }
    }
}

/*xhrMicrosoft.addEventListener('readystatechange', async function () {
    if (this.readyState === this.DONE) {
        // console.log(this.response);
        // handle errors
        const responseData = JSON.parse(this.responseText)[0];
        if (JSON.parse(this.responseText).message) { outputTranslate.innerText = JSON.parse(this.responseText).message; }
        if (!responseData) { return; }
        let detection = responseData && responseData.detectedLanguage && responseData.detectedLanguage.language || [],
            translation = responseData.translations[0].text.replaceAll('\n\n', '\n');
        if (translation === '') { translation = inputTranslate.value; }
        // Autodetection check
        if (detection.length > 0) {
            if (sourceSelect.value === 'auto') {
                if (languageListMicrosoft[detection]) {
                    sourceSelect.options[0].innerText = 'Auto (' + languageListMicrosoft[detection] + ')';
                    sourceSelect.options[0].setAttribute('temporary-value', detection);
                }
                // sometimes autodetection returns unknown language tags(but works for most of the languages)
                else { sourceSelect.options[0].innerText = 'Auto (unsupported tag: ' + detection + ')'; }
            }
            else if (sourceSelect.options[0].hasAttribute('temporary-value')) { sourceSelect.options[0].removeAttribute('temporary-value'); }
        }
        showTranslation(translation, detection);
    }
});*/