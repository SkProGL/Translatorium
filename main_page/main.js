let loginBtn = document.querySelector("#login"),
    retrieveBtn = document.querySelector("#retrieve"),
    apiInput = document.querySelector("#api-key"),
    resetPreferences = document.querySelector("#reset-preferences"),
    resetFavorites = document.querySelector("#reset-favorites"),
    timeout1 = null,
    storageObject = [],
    testPhrase = "Bonjour, votre traducteur fonctionne-t-il ? Si vous voyez ce message, c'est le cas.";

let introOption,
    availability = document.querySelector('#example_availability'),
    example = document.querySelector('#example');

const DEFAULT_SETTINGS = { 'apiKey': 'intro', 'from': 'auto', 'to': 'en', 'tooltip': 'google', 'fontSize': "16px" },
    FAVORITE = [{ 'original': 'Your translation history', 'from': 'en', 'to': 'fr', 'translated': 'Votre historique de traduction' }];

loginBtn.onclick = () => { chrome.tabs.create({ url: "https://rapidapi.com/auth/sign-up?referral=/microsoft-azure-org-microsoft-cognitive-services/api/microsoft-translator-text/pricing" }); }

chrome.storage.sync.get(['key'], (result) => {
    storageObject = result.key;
    // console.log(storageObject);
    if (storageObject?.apiKey === 'intro') {
        // console.log(example);
        example.style.display = 'block';
        document.body.style.overflow = 'hidden';
        storageObject.apiKey = '';
        chrome.storage.sync.set({ key: storageObject });
    }
    else if (storageObject.apiKey && storageObject.apiKey.length > 0 && storageObject.apiKey !== 'get') {
        apiInput.value = storageObject.apiKey;
    }
});

retrieveBtn.onclick = () => {
    if (confirm("Process will take ~30 seconds and API key will be extracted programmatically, meaning extension will have control over page and it's data.\n\nIn order for it to work you MUST BE logged into RapidAPI account.\n\nDo not use mouse or keyboard during this period. When done, you will be returned to this page!")) {
        storageObject.apiKey = 'get';
        chrome.storage.sync.set({ key: storageObject });
        chrome.tabs.create({ url: "https://rapidapi.com/microsoft-azure-org-microsoft-cognitive-services/api/microsoft-translator-text" });
    }
}
resetPreferences.onclick = () => { resetStorage(true); }
resetFavorites.onclick = () => { resetStorage(); }

apiInput.addEventListener('keyup', (e) => {
    clearTimeout(timeout1);
    timeout1 = setTimeout(function () {
        if (e.ctrlKey || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') { return; };
        apiRequest(testPhrase);
    }, 500);
});


function resetStorage(arg1 = false) {
    arg1 && chrome.storage.sync.set({ key: DEFAULT_SETTINGS });
    arg1 === false && chrome.storage.sync.set({ favoriteKey: FAVORITE });
    location.reload();
}

function apiRequest(text) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            let r = JSON.parse(this.responseText);
            if (r.message) { apiInput.setAttribute('err', '1'); }
            else {
                alert('Original: ' + testPhrase + "\n\nTranslated: " + r[0].translations[0].text);
                storageObject.apiKey = apiInput.value;
                chrome.storage.sync.set({ key: storageObject });
                apiInput.setAttribute('err', '0');
            }
        }
    });
    xhr.open("POST", "https://microsoft-translator-text.p.rapidapi.com/translate?to%5B0%5D=en&api-version=3.0&profanityAction=NoAction&textType=plain");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("X-RapidAPI-Key", apiInput.value);
    xhr.setRequestHeader("X-RapidAPI-Host", "microsoft-translator-text.p.rapidapi.com");
    xhr.send(JSON.stringify([{ "Text": text }]));
}








document.querySelector('input[value="google"]').checked = true;
availability.style.color = 'rgb(42 191 21)';
availability.innerText = `Ready to use
\n`;
document.querySelector('#example_description').innerText = `Google Translate popup - shown in top right corner, with everything you are used to, change window size (ctr + or ctrl -)
\nTo close - click anywhere with mouse
\n`;

for (const radioInput of document.querySelectorAll('.radio_input')) {
    radioInput.addEventListener('change', function () {
        if (this.checked) {
            let description = document.querySelector('#example_description');
            availability.style.color = 'rgb(191 152 21)';
            availability.innerText = `Microsoft API Account is needed to unlock
            \n*whole registration process is free and doesn't require credential info`;
            storageObject.tooltip = this.value;

            let v = this.value;

            if (v === 'google' || v === 'off') {
                availability.style.color = 'rgb(42 191 21)';
                availability.innerText = `Ready to use
                \n          `;
            }
            if (v === 'google') {
                description.innerText = `Google Translate popup - shown in top right corner, with everything you are used to, change window size (ctr + or ctrl -)
                \nTo close - click anywhere with mouse
                \n`;
                a = 0;

            }
            if (v === 'window') {
                description.innerText = `Window tooltip - move and lock, change scale, specify language, set to fullscreen and other advanced settings just in one menu!
                \nTo close - click on 'X'
                \n`;
                a = 1;
            }
            else if (v === 'cloud') {
                description.innerText = `Cloud tooltip - original and brief design, shows translation with detected language
                \nTo close - click anywhere with mouse
                \n`;
                a = 2;
            }
            else if (this.value === 'selection') {
                description.innerText = `Selection tooltip - text selected will be replaced with translation
                \nTo close - click anywhere with mouse
                \n`;
                a = 3;
            }
            else if (this.value === 'off') {
                description.innerText = `Off - turns off translation tooltip/popup
                \n
                \n`;
                a = 4;
            }
            document.querySelector('#example_image').src = chrome.runtime.getURL("examples/ex" + a + ".png");
        }
    });
}
document.querySelector('#example_close').onclick = () => {
    example.style.display = 'none';
    document.body.style.overflow = 'auto';
}
document.querySelector('#guide').onclick = () => {
    example.style.display = 'block';
    document.body.style.overflow = 'hidden';
}
document.querySelector('#help').onclick = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("main_page/help.html") });
}