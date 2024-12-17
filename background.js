chrome.action.onClicked.addListener(async (tab) => {
    try {
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['popup.js'],
        });
        console.log('Script inyectado correctamente');
    } catch (error) {
        console.error('Error inyectando el script:', error.message);
    }
});

