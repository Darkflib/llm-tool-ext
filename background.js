// Setup context menu options
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "expandText",
      title: "Expand Text",
      contexts: ["selection"]
    });
  
    chrome.contextMenus.create({
      id: "reduceText",
      title: "Reduce Text",
      contexts: ["selection"]
    });
  
    chrome.contextMenus.create({
      id: "rewriteFormal",
      title: "Rewrite as Formal",
      contexts: ["selection"]
    });
  
    chrome.contextMenus.create({
      id: "rewriteCasual",
      title: "Rewrite as Casual",
      contexts: ["selection"]
    });
  });
  
  // Handle context menu actions
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    const selectedText = info.selectionText;
    
    if (info.menuItemId === "expandText") {
      processText("expand", selectedText, tab);
    } else if (info.menuItemId === "reduceText") {
      processText("reduce", selectedText, tab);
    } else if (info.menuItemId === "rewriteFormal") {
      processText("rewrite", selectedText, tab, "formal");
    } else if (info.menuItemId === "rewriteCasual") {
      processText("rewrite", selectedText, tab, "casual");
    }
  });
  
  // Function to handle the text processing
  async function processText(action, text, tab, tone = null) {
    const apiKey = await getApiKey();  // Get API key from storage
    console.log('API Key:', apiKey);
  
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };
    
    console.log(headers);

    let prompt = "";
    if (action === "expand") {
      prompt = `Expand the following text: "${text}"`;
    } else if (action === "reduce") {
      prompt = `Summarize and reduce the following text: "${text}"`;
    } else if (action === "rewrite") {
      if (tone === "formal") {
        prompt = `Rewrite the following text with a formal tone: "${text}"`;
      } else if (tone === "casual") {
        prompt = `Rewrite the following text with a casual tone: "${text}"`;
      }
    }
  
    console.log('Prompt:', prompt);

    const data = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    };
  
    console.log('Data:', data);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const result = await response.json();
      const modifiedText = result.choices[0].message.content;
      
      console.log('Result:', result);
      console.log('Modified Text:', modifiedText);

        // Insert the modified text into the active tab
        // Open result.html in a new tab and pass the modified text via query parameters
        const encodedText = encodeURIComponent(modifiedText);
        const url = `result.html?modifiedText=${encodedText}`;
        chrome.tabs.create({ url: url });

/*
      // Open a small popup window and inject the modified text
      const popupWindow = window.open('', 'popup', 'width=600,height=400');
      popupWindow.document.write(`<pre style="white-space: pre-wrap; word-wrap: break-word;">${modifiedText}</pre>`);
      popupWindow.document.title = "Modified Text";

        // Open a new tab and inject the modified text
        chrome.tabs.create({ url: 'about:blank' }, function (newTab) {
          chrome.scripting.executeScript({
            target: { tabId: newTab.id },
            func: (modifiedText) => {
              document.body.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word;">${modifiedText}</pre>`;
            },
            args: [modifiedText]
          });
        });
 */

    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // This function will display the modified text as an alert (you can customize this)
  function insertModifiedText(modifiedText) {
    alert(`Modified Text: ${modifiedText}`);
  }
  
  // Helper function to retrieve the stored API key
  function getApiKey() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['apiKey'], function (result) {
        resolve(result.apiKey);
      });
    });
  }

  