const languageListMicrosoft = { 'af': 'Afrikaans', 'sq': 'Albanian', 'am': 'Amharic', 'ar': 'Arabic', 'hy': 'Armenian', 'as': 'Assamese', 'az': 'Azerbaijani', 'bn': 'Bangla', 'ba': 'Bashkir', 'eu': 'Basque', 'bs': 'Bosnian', 'bg': 'Bulgarian', 'yue': 'Cantonese (Traditional)', 'ca': 'Catalan', 'lzh': 'Chinese (Literary)', 'zh-Hans': 'Chinese Simplified', 'zh-Hant': 'Chinese Traditional', 'hr': 'Croatian', 'cs': 'Czech', 'da': 'Danish', 'prs': 'Dari', 'dv': 'Divehi', 'nl': 'Dutch', 'en': 'English', 'et': 'Estonian', 'fo': 'Faroese', 'fj': 'Fijian', 'fil': 'Filipino', 'fi': 'Finnish', 'fr-CA': 'French (Canada)', 'fr': 'French', 'gl': 'Galician', 'ka': 'Georgian', 'de': 'German', 'el': 'Greek', 'gu': 'Gujarati', 'ht': 'Haitian Creole', 'he': 'Hebrew', 'hi': 'Hindi', 'mww': 'Hmong Daw', 'hu': 'Hungarian', 'is': 'Icelandic', 'id': 'Indonesian', 'ikt': 'Inuinnaqtun', 'iu-Latn': 'Inuktitut (Latin)', 'iu': 'Inuktitut', 'ga': 'Irish', 'it': 'Italian', 'ja': 'Japanese', 'kn': 'Kannada', 'kk': 'Kazakh', 'km': 'Khmer', 'tlh-Latn': 'Klingon (Latin)', 'tlh-Piqd': 'Klingon (pIqaD)', 'ko': 'Korean', 'ku': 'Kurdish (Central)', 'kmr': 'Kurdish (Northern)', 'ky': 'Kyrgyz', 'lo': 'Lao', 'lv': 'Latvian', 'lt': 'Lithuanian', 'mk': 'Macedonian', 'mg': 'Malagasy', 'ms': 'Malay', 'ml': 'Malayalam', 'mt': 'Maltese', 'mr': 'Marathi', 'mn-Cyrl': 'Mongolian (Cyrillic)', 'mn-Mong': 'Mongolian (Traditional)', 'my': 'Myanmar (Burmese)', 'mi': 'Māori', 'ne': 'Nepali', 'nb': 'Norwegian', 'or': 'Odia', 'ps': 'Pashto', 'fa': 'Persian', 'pl': 'Polish', 'pt': 'Portuguese (Brazil)', 'pt-PT': 'Portuguese (Portugal)', 'pa': 'Punjabi', 'otq': 'Querétaro Otomi', 'ro': 'Romanian', 'ru': 'Russian', 'sm': 'Samoan', 'sr-Cyrl': 'Serbian (Cyrillic)', 'sr-Latn': 'Serbian (Latin)', 'sk': 'Slovak', 'sl': 'Slovenian', 'so': 'Somali', 'es': 'Spanish', 'sw': 'Swahili', 'sv': 'Swedish', 'ty': 'Tahitian', 'ta': 'Tamil', 'tt': 'Tatar', 'te': 'Telugu', 'th': 'Thai', 'bo': 'Tibubblen', 'ti': 'Tigrinya', 'to': 'Tongan', 'tr': 'Turkish', 'tk': 'Turkmen', 'uk': 'Ukrainian', 'hsb': 'Upper Sorbian', 'ur': 'Urdu', 'ug': 'Uyghur', 'uz': 'Uzbek (Latin)', 'vi': 'Vietnamese', 'cy': 'Welsh', 'yua': 'Yucatec Maya', 'zu': 'Zulu' },
    dictionaryListMicrosoft = { 'af': 'Afrikaans', 'ar': 'Arabic', 'bg': 'Bulgarian', 'bn': 'Bangla', 'bs': 'Bosnian', 'ca': 'Catalan', 'cs': 'Czech', 'cy': 'Welsh', 'da': 'Danish', 'de': 'German', 'el': 'Greek', 'en': 'English', 'es': 'Spanish', 'et': 'Estonian', 'fa': 'Persian', 'fi': 'Finnish', 'fr': 'French', 'he': 'Hebrew', 'hi': 'Hindi', 'hr': 'Croatian', 'hu': 'Hungarian', 'id': 'Indonesian', 'is': 'Icelandic', 'it': 'Italian', 'ja': 'Japanese', 'ko': 'Korean', 'lt': 'Lithuanian', 'lv': 'Latvian', 'ms': 'Malay', 'mt': 'Maltese', 'mww': 'Hmong Daw', 'nb': 'Norwegian', 'nl': 'Dutch', 'pl': 'Polish', 'pt': 'Portuguese (Brazil)', 'ro': 'Romanian', 'ru': 'Russian', 'sk': 'Slovak', 'sl': 'Slovenian', 'sr-Latn': 'Serbian (Latin)', 'sv': 'Swedish', 'sw': 'Swahili', 'ta': 'Tamil', 'th': 'Thai', 'tlh-Latn': 'Klingon (Latin)', 'tr': 'Turkish', 'uk': 'Ukrainian', 'ur': 'Urdu', 'vi': 'Vietnamese', 'zh-Hans': 'Chinese Simplified' },
    dictionaryTag = { 'ADJ': 'Adjectives', 'ADV': 'Adverbs', 'CONJ': 'Conjunctions', 'DET': 'Determiners', 'MODAL': 'Verbs', 'NOUN': 'Nouns', 'PREP': 'Prepositions', 'PRON': 'Pronouns', 'VERB': 'Verbs', 'OTHER': 'Other' },
    googleLanguageList = { 'af': 'Afrikaans', 'sq': 'Albanian', 'am': 'Amharic', 'ar': 'Arabic', 'hy': 'Armenian', 'as': 'Assamese', 'ay': 'Aymara', 'az': 'Azerbaijani', 'bm': 'Bambara', 'eu': 'Basque', 'be': 'Belarusian', 'bn': 'Bengali', 'bho': 'Bhojpuri', 'bs': 'Bosnian', 'bg': 'Bulgarian', 'ca': 'Catalan', 'ceb': 'Cebuano', 'ny': 'Chichewa', 'zh-CN': 'Chinese (Simplified)', 'zh-TW': 'Chinese (Traditional)', 'co': 'Corsican', 'hr': 'Croatian', 'cs': 'Czech', 'da': 'Danish', 'dv': 'Dhivehi', 'doi': 'Dogri', 'nl': 'Dutch', 'en': 'English', 'eo': 'Esperanto', 'et': 'Estonian', 'ee': 'Ewe', 'tl': 'Filipino', 'fi': 'Finnish', 'fr': 'French', 'fy': 'Frisian', 'gl': 'Galician', 'ka': 'Georgian', 'de': 'German', 'el': 'Greek', 'gn': 'Guarani', 'gu': 'Gujarati', 'ht': 'Haitian Creole', 'ha': 'Hausa', 'haw': 'Hawaiian', 'iw': 'Hebrew', 'hi': 'Hindi', 'hmn': 'Hmong', 'hu': 'Hungarian', 'is': 'Icelandic', 'ig': 'Igbo', 'ilo': 'Ilocano', 'id': 'Indonesian', 'ga': 'Irish', 'it': 'Italian', 'ja': 'Japanese', 'jw': 'Javanese', 'kn': 'Kannada', 'kk': 'Kazakh', 'km': 'Khmer', 'rw': 'Kinyarwanda', 'gom': 'Konkani', 'ko': 'Korean', 'kri': 'Krio', 'ku': 'Kurdish (Kurmanji)', 'ckb': 'Kurdish (Sorani)', 'ky': 'Kyrgyz', 'lo': 'Lao', 'la': 'Latin', 'lv': 'Latvian', 'ln': 'Lingala', 'lt': 'Lithuanian', 'lg': 'Luganda', 'lb': 'Luxembourgish', 'mk': 'Macedonian', 'mai': 'Maithili', 'mg': 'Malagasy', 'ms': 'Malay', 'ml': 'Malayalam', 'mt': 'Maltese', 'mi': 'Maori', 'mr': 'Marathi', 'mni-Mtei': 'Meiteilon (Manipuri)', 'lus': 'Mizo', 'mn': 'Mongolian', 'my': 'Myanmar (Burmese)', 'ne': 'Nepali', 'no': 'Norwegian', 'or': 'Odia (Oriya)', 'om': 'Oromo', 'ps': 'Pashto', 'fa': 'Persian', 'pl': 'Polish', 'pt': 'Portuguese', 'pa': 'Punjabi', 'qu': 'Quechua', 'ro': 'Romanian', 'ru': 'Russian', 'sm': 'Samoan', 'sa': 'Sanskrit', 'gd': 'Scots Gaelic', 'nso': 'Sepedi', 'sr': 'Serbian', 'st': 'Sesotho', 'sn': 'Shona', 'sd': 'Sindhi', 'si': 'Sinhala', 'sk': 'Slovak', 'sl': 'Slovenian', 'so': 'Somali', 'es': 'Spanish', 'su': 'Sundanese', 'sw': 'Swahili', 'sv': 'Swedish', 'tg': 'Tajik', 'ta': 'Tamil', 'tt': 'Tatar', 'te': 'Telugu', 'th': 'Thai', 'ti': 'Tigrinya', 'ts': 'Tsonga', 'tr': 'Turkish', 'tk': 'Turkmen', 'ak': 'Twi', 'uk': 'Ukrainian', 'ur': 'Urdu', 'ug': 'Uyghur', 'uz': 'Uzbek', 'vi': 'Vietnamese', 'cy': 'Welsh', 'xh': 'Xhosa', 'yi': 'Yiddish', 'yo': 'Yoruba', 'zu': 'Zulu' },
    DEFAULT_SETTINGS = {
        'apiKey': '',
        'from': 'auto',
        'to': 'en',
        'tooltip': 'google', // google|window|cloud|selection|off
        'fontSize': '16px'
    };
var xhrMicrosoftDictionary = new XMLHttpRequest(),
    xhrMicrosoft = new XMLHttpRequest(),
    phraseToTranslate;

function listLanguageOptions(a1, a2, languages) {
    let prev = ' ';
    for (i in languages) {
        let option = document.createElement('option');
        if (languages[i][0] !== prev[0]) {
            let group = document.createElement('optgroup');
            group.label = languages[i][0];
            a1.appendChild(group.cloneNode(true))
            a2.appendChild(group.cloneNode(true))
        }
        option.innerText = languages[i];
        option.value = i;
        prev = languages[i];
        a1.appendChild(option.cloneNode(true));
        a2.appendChild(option.cloneNode(true));
    }
}

function breakIntoSentences(src) {
    let fragments = src.match(/.*?\D[.!?;]+|.*/gs), n = [];
    if (fragments[fragments.length - 1].trim() === '') { fragments.pop(); }
    fragments.forEach((i) => {
        if (n.length && n[n.length - 1].length + i.length < 200) {
            n[n.length - 1] = n[n.length - 1] + i;
        } else { n.push(i); }
    });
    return n;
}

function apiRequest(t, obj) {
    let target = (obj.from === 'auto') ? '' : 'from=' + obj.from + '&';
    xhrMicrosoft.open("POST", "https://microsoft-translator-text.p.rapidapi.com/translate?to=" + obj.to + "&api-version=3.0&" + target + "profanityAction=NoAction&textType=plain");
    xhrMicrosoft.setRequestHeader("content-type", "application/json");
    xhrMicrosoft.setRequestHeader("x-rapidapi-key", obj.apiKey);
    xhrMicrosoft.setRequestHeader("x-rapidapi-host", "microsoft-translator-text.p.rapidapi.com");
    xhrMicrosoft.send(JSON.stringify([{ "text": t }]));
}

function largeApiRequest(t, obj) {
    let target = (obj.from === 'auto') ? '' : 'from=' + obj.from + '&';
    xhrMicrosoft.open("POST", "https://microsoft-translator-text.p.rapidapi.com/translate?to=" + obj.to + "&api-version=3.0&" + target + "profanityAction=NoAction&textType=plain");
    xhrMicrosoft.setRequestHeader("content-type", "application/json");
    xhrMicrosoft.setRequestHeader("x-rapidapi-key", obj.apiKey);
    xhrMicrosoft.setRequestHeader("x-rapidapi-host", "microsoft-translator-text.p.rapidapi.com");
    // required for long texts
    xhrMicrosoft.setRequestHeader("x-rapidapi-ua", "RapidAPI-Playground");

    let jsonData = [];
    if (Array.isArray(t)) { t.forEach((e, index) => { jsonData[index] = { "text": e }; }); }
    else { jsonData[0] = { "text": t }; }
    xhrMicrosoft.send(JSON.stringify(jsonData));
}

function dictionaryRequest(t, obj, target, src) {
    // console.log(obj, target, src);
    const data = JSON.stringify([{ "Text": t }]);
    // language not applicable
    if (!src in dictionaryListMicrosoft) { src = 'en'; }
    if (!target in dictionaryListMicrosoft) { target = 'en'; }
    // console.log('[CURRENT SOURCE LANG] ' + src + ' [TARGET] ' + target);
    xhrMicrosoftDictionary.open("POST", "https://microsoft-translator-text.p.rapidapi.com/Dictionary/Lookup?to=" + target + "&api-version=3.0&from=" + src);
    xhrMicrosoftDictionary.setRequestHeader("content-type", "application/json");
    xhrMicrosoftDictionary.setRequestHeader("X-RapidAPI-Key", obj.apiKey);
    xhrMicrosoftDictionary.setRequestHeader("X-RapidAPI-Host", "microsoft-translator-text.p.rapidapi.com");
    xhrMicrosoftDictionary.setRequestHeader("x-rapidapi-ua", "RapidAPI-Playground");
    xhrMicrosoftDictionary.onerror = function () { console.log('[TRANSLATORIUM] Dictionary reqest error'); };
    xhrMicrosoftDictionary.send(data);
}

function copyToClipboard(text) {
    let copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.blur();
    document.body.removeChild(copyFrom);
}

function cssProperties(elem, attrs) { for (let key in attrs) { elem.style.setProperty(key, attrs[key]); } }

function cssComputedStyle(elem) {
    let obj = Object.assign({}, window.getComputedStyle(elem));
    obj.top = parseInt(obj.top);
    obj.left = parseInt(obj.left);
    obj.width = parseInt(obj.width);
    obj.height = parseInt(obj.height);
    return obj;
}

function getRandomInt(max) { return Math.floor(Math.random() * max); }