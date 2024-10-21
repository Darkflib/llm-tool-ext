        // This script retrieves the modified text passed from the background.js
        const params = new URLSearchParams(window.location.search);
        const modifiedText = params.get('modifiedText');
        document.getElementById('output').textContent = modifiedText;