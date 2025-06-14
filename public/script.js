function loadTool(tool) {
    const container = document.getElementById('tool-container');
  
    const templates = {
      json: `
        <h2>🧾 JSON Formatter</h2>
        <textarea id="json-input" placeholder="Paste JSON here..."></textarea>
        <button onclick="formatJSON()">Format</button>
        <pre id="json-output"></pre>
      `,
      uuid: `
        <h2>🔑 UUID Generator</h2>
        <label>Count (max 100): <input type="number" id="uuid-count" value="5" /></label>
        <button onclick="generateUUIDs()">Generate</button>
        <ul id="uuid-list"></ul>
      `,
      lorem: `
        <h2>📄 Lorem Ipsum Generator</h2>
        <label>Type:
          <select id="lorem-type">
            <option value="word">Word</option>
            <option value="sentence">Sentence</option>
            <option value="paragraph" selected>Paragraph</option>
          </select>
        </label>
        <label>Count: <input type="number" id="lorem-count" value="3" /></label>
        <button onclick="generateLorem()">Generate</button>
        <div id="lorem-output"></div>
      `,
      regex: `
        <h2>🔍 Regex Matcher</h2>
        <label>Pattern: <input type="text" id="regex-pattern" placeholder="\\d+" /></label>
        <textarea id="regex-text" placeholder="Enter text here..."></textarea>
        <button onclick="matchRegex()">Match</button>
        <pre id="regex-output"></pre>
      `,
        base64: `
    <h2>🧬 Base64 Encoder/Decoder</h2>
    <textarea id="base64-input" placeholder="Enter text..."></textarea>
    <br>
    <button onclick="base64Action('encode')">Encode</button>
    <button onclick="base64Action('decode')">Decode</button>
    <pre id="base64-output"></pre>
    `,
        hash: `
        <h2>🔐 Hash Generator</h2>
        <label>Algorithm:
        <select id="hash-type">
            <option value="md5">MD5</option>
            <option value="sha1">SHA-1</option>
            <option value="sha256" selected>SHA-256</option>
        </select>
        </label>
        <textarea id="hash-input" placeholder="Enter text..."></textarea>
        <button onclick="generateHash()">Generate</button>
        <pre id="hash-output"></pre>
    `,
        url: `
    <h2>🌐 URL Encoder/Decoder</h2>
    <textarea id="url-input" placeholder="Enter text..."></textarea>
    <br>
    <button onclick="urlAction('encode')">Encode</button>
    <button onclick="urlAction('decode')">Decode</button>
    <pre id="url-output"></pre>
    `,
        calculator: `
    <h2>🧮 Calculator</h2>
    <input type="text" id="calc-expression" placeholder="e.g. (5 + 3) * 2" />
    <button onclick="evaluateCalc()">Calculate</button>
    <pre id="calc-output"></pre>
    `
    };
  
    container.innerHTML = templates[tool] || `<p>Tool not found! Integration in Progress....</p>`;
  }
  
  async function formatJSON() {
    const input = document.getElementById('json-input').value;
    try {
      const response = await fetch('/api/json/format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: input, indent: 2 })
      });
      const result = await response.json();
      document.getElementById('json-output').textContent = result.formatted || result.error;
    } catch (error) {
      const msg = `Error: ${error.message}`;
      document.getElementById('json-output').textContent = msg;
      showToast(msg);
    }
  }
  
  async function generateUUIDs() {
    const count = document.getElementById('uuid-count').value;
    try {
      const response = await fetch('/api/uuid/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });
      const data = await response.json();
      document.getElementById('uuid-list').innerHTML = data.uuids.map(u => `<li>${u}</li>`).join('');
    } catch (error) {
      const msg = `Error: ${error.message}`;
      document.getElementById('uuid-list').innerHTML = `<li>${msg}</li>`;
      showToast(msg);
    }
  }
  
  async function generateLorem() {
    const type = document.getElementById('lorem-type').value;
    const count = document.getElementById('lorem-count').value;
    try {
      const response = await fetch('/api/lorem/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, count })
      });
      const data = await response.json();
      document.getElementById('lorem-output').innerText = data.output || data.error;
    } catch (error) {
      const msg = `Error: ${error.message}`;
      document.getElementById('lorem-output').innerText = msg;
      showToast(msg);
    }
  }
  
  async function matchRegex() {
    const pattern = document.getElementById('regex-pattern').value;
    const text = document.getElementById('regex-text').value;
    try {
      const response = await fetch('/api/regex/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pattern, text })
      });
      const result = await response.json();
      document.getElementById('regex-output').textContent = result.matches?.join(', ') || result.error;
    } catch (error) {
      const msg = `Error: ${error.message}`;
      document.getElementById('regex-output').textContent = msg;
      showToast(msg);
    }
  }


  async function base64Action(mode) {
    const input = document.getElementById('base64-input').value;
    try {
      const res = await fetch(`/api/base64/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });
      const data = await res.json();
      document.getElementById('base64-output').textContent = data.output || data.error;
    } catch (error) {
      const msg = `Error: ${error.message}`;
      document.getElementById('base64-output').textContent = msg;
      showToast(msg);
    }
  }

  async function generateHash() {
    const algo = document.getElementById('hash-type').value;
    const input = document.getElementById('hash-input').value;
    try {
      const res = await fetch(`/api/hash/${algo}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });
      const data = await res.json();
      document.getElementById('hash-output').textContent = data.hash || data.error;
    } catch (error) {
      const msg = `Error: ${error.message}`;
      document.getElementById('hash-output').textContent = msg;
      showToast(msg);
    }
  }

  async function urlAction(mode) {
    const input = document.getElementById('url-input').value;
    try {
      const res = await fetch(`/api/url/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });
      const data = await res.json();
      document.getElementById('url-output').textContent = data.output || data.error;
    } catch (error) {
      const msg = `Error: ${error.message}`;
      document.getElementById('url-output').textContent = msg;
      showToast(msg);
    }
  }

  async function evaluateCalc() {
    const expression = document.getElementById('calc-expression').value;
    try {
      const res = await fetch('/api/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression })
      });
      const data = await res.json();
      document.getElementById('calc-output').textContent = data.result || data.error;
    } catch (error) {
      const msg = `Error: ${error.message}`;
      document.getElementById('calc-output').textContent = msg;
      showToast(msg);
    }
  }
    


  //toast
  
  function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
  
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
  
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }
  