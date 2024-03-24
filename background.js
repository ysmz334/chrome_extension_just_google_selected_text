chrome.commands.onCommand.addListener(function(command) {
    let google_com_base_url = "https://www.google.com/search?q=";
    if (command == "google_selected_text_in_new_tab") {
        googleSearchWithSelectedText(google_com_base_url, true);
    } else if (command == "google_selected_text_background") {
        googleSearchWithSelectedText(google_com_base_url, false);
    }
});

function getSelectedText() {
    const selected_text = encodeURI(
        window.getSelection ? window.getSelection()
        : document.getSelection ? document.getSelection()
        : "" );
    return selected_text;
}

async function googleSearchWithSelectedText(base_url, move_to_new_tab) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.scripting.executeScript({
            target : {tabId : tab.id},
            func: getSelectedText
        },
        function(results) {
            if (!results) {
                return false;
            }
            chrome.tabs.create({
                'url': base_url + decodeURI(results[0].result),
                'active': move_to_new_tab
            });
        }
    );
    return true;
}
