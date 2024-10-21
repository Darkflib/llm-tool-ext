document.addEventListener('DOMContentLoaded', function () {
    const apiKeyInput = document.getElementById('api-key');
    const saveButton = document.getElementById('save-api-key');
    const message = document.getElementById('message');

    // Load stored API key (if any)
    chrome.storage.local.get(['apiKey'], function (result) {
        if (result.apiKey) {
            apiKeyInput.value = result.apiKey;
            message.textContent = 'API Key loaded.';
        }
    });

    // Save API key to local storage
    saveButton.addEventListener('click', function () {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            chrome.storage.local.set({ apiKey: apiKey }, function () {
                message.textContent = 'API Key saved successfully!';
                message.style.color = 'green';
            });
        } else {
            message.textContent = 'Please enter a valid API key.';
            message.style.color = 'red';
        }
    });
});
