var previous = '';

// mouseover selection, show tooltip
document.addEventListener('mousemove', function (e) {
    if (window.getSelection().isCollapsed === false && storageObject.tooltip === 'cloud' && document.body.contains(remoteBubble)) {
        try {
            if (window.getSelection().getRangeAt(0)) {
                insideTooltip = findAscendingTag(window.getSelection().getRangeAt(0).commonAncestorContainer, "TRANSLATORIUM");
                if (insideTooltip) { return; }

                clickInsideTooltip = findAscendingTag(e?.target, "TRANSLATORIUM");
                if (clickInsideTooltip) { return; }
            }
        } catch (error) { console.log('[TRANSLATORIUM] error: ' + error); }

        let coords = window.getSelection().getRangeAt(0).getBoundingClientRect();
        // move tooltip with mouse
        if (coords.x <= e.x && e.x <= coords.x + coords.width &&
            coords.y <= e.y && e.y <= coords.y + coords.height) {
            remoteBubble.style.left = e.x + 'px';
            remoteBubble.style.top = e.y + 'px';
            coordinates = [e.x, e.y, e.x - coords.x, e.y - coords.y];
        }
    }
});
document.addEventListener('mouseup', function (mouse) {
    let sel = window.getSelection(),
        insideTooltip = false;

    // used to handle extension context invalidated
    if (!chrome.runtime?.id) {
        console.log('[TRANSLATORIUM] runtime error');
        // Show bubble
        if (window.getSelection().isCollapsed === false) {
            if (storageObject.tooltip === 'google') {
                storageObject.tooltip = 'selection';
            }
            showTranslation('Chrome Translator Extension was reinitialized, please refresh current page or restart browser!', 'en', '5%', '5%');
        } else { restoreSelectedText(); }
        return;
    }
    if (storageObject.tooltip !== 'google') {
        // mouseclick to close selection except window tooltip
        if (sel.isCollapsed === true && storageObject.tooltip !== 'window') {
            if (prevContents) { restoreSelectedText(); }
            else if (remoteBubble && !findAscendingTag(mouse?.target, "TRANSLATORIUM")) { remoteBubble.style.visibility = 'hidden'; }
            inProgress = false;
            // console.log('no init');
            return;
        }
        // ignore mouse clicks when selection content is the same since last use and not collapsed while translation bubble shown
        // or has no length or is in request sending progress
        if (previous === sel.toString() && remoteBubble?.style.visibility === 'visible' ||
            previous === sel.toString() && prevContents ||
            sel.toString().trim().length < 1 || inProgress) {
            // console.log('[selection length] no init', previous === sel.toString(), sel.toString().trim().length < 1, inProgress);
            return;
        }
        // check if text is selected inside tooltip 
        try {
            if (sel.getRangeAt(0)) {
                insideTooltip = findAscendingTag(sel.getRangeAt(0).commonAncestorContainer, "TRANSLATORIUM");
                if (insideTooltip) {
                    // console.log('[inner selection] no init', insideTooltip);
                    return;
                }
                clickInsideTooltip = findAscendingTag(mouse?.target, "TRANSLATORIUM");
                if (clickInsideTooltip) {
                    // console.log('[inner mouse selection] no init', clickInsideTooltip);
                    return;
                }
            }
        } catch (error) { console.log('[TRANSLATORIUM] error: ' + error); }


        if (storageObject.tooltip === 'off' && remoteBubble) {
            remoteBubble.style.visibility = 'hidden';
            return;
        }
        if (previous === sel.toString() && remoteBubble?.style.visibility === 'hidden') {
            // console.log('[same selection] no init');
            return;
        }
        let text = sel.toString();
        previous = text;
        let location = sel.getRangeAt(0).getBoundingClientRect();
        coordinates = [mouse.x, mouse.y, mouse.x - location.x, mouse.y - location.y];
        phraseToTranslate = text;
        if (text.length > 220 && sel.isCollapsed === false) { splitIntoRequests(text); }
        else { apiRequest(text, storageObject); }
    }
    else {
        if (previous === sel.toString() || window.location.href.includes('translate.google.com')) { return; }

        var port = chrome.runtime?.connect({ name: "sck" });
        if (sel.isCollapsed === true || storageObject.tooltip === 'off') {
            port?.postMessage({ run: "google_close" });
            return;
        }

        let screen = {
            height: window.screen.availHeight,
            width: window.screen.availWidth
        }
        phraseToTranslate = previous = sel.toString();
        port?.postMessage({ run: "google", content: sel.toString(), dimensions: screen });
        return;

    }
});

window.addEventListener('scroll', function () {
    if (window.getSelection().focusNode !== null && storageObject.tooltip === 'cloud') {
        let rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
        remoteBubble.style.left = rect.x + coordinates[2] + 'px';
        remoteBubble.style.top = rect.y + coordinates[3] + 'px';
    }
});

document.addEventListener('keyup', function (e) {
    e.preventDefault();
    if (e.ctrlKey && e.key === ".") { copyToClipboard(clipboard); }
});
