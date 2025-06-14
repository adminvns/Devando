function loadTool(tool) {
    const container = document.getElementById('tool-container');
  
    const templates = {
      json: `
        <h2>🧾 JSON Formatter</h2>
        <textarea id="json-input" placeholder="Paste JSON here..."></textarea>
        <button onclick="formatJSON()">Format</button>
        <pre id="json-output"></pre>
      `,      uuid: `
        <h2>🔑 UUID Generator</h2>
        <label>Count (1-50): <input type="number" id="uuid-count" value="5" min="1" max="50" /></label>
        <button onclick="generateUUIDs()">Generate</button>
        <div class="hint">Maximum 50 UUIDs can be generated at once</div>
        <ul id="uuid-list"></ul>
      `,lorem: `
        <h2>📄 Lorem Ipsum Generator</h2>
        <label>Type:
          <select id="lorem-type" onchange="updateLoremMaxCount()">
            <option value="word">Words (max 1000)</option>
            <option value="sentence">Sentences (max 100)</option>
            <option value="paragraph" selected>Paragraphs (max 50)</option>
          </select>
        </label>
        <label>Count: <input type="number" id="lorem-count" value="3" min="1" /></label>
        <button onclick="generateLorem()">Generate</button>
        <div class="hint">Maximum count depends on type: Words (1000), Sentences (100), Paragraphs (50)</div>
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
    `,
    timezone: `
  <h2>🌍 Timezone Converter</h2>
  <label>From Timezone:
    <select id="from-tz">
      <option value="Asia/Kolkata">Asia/Kolkata</option>
      <option value="UTC">UTC</option>
      <option value="America/New_York">America/New_York</option>
      <option value="Europe/London">Europe/London</option>
    </select>
  </label>
  <label>To Timezone:
    <select id="to-tz">
      <option value="UTC">UTC</option>
      <option value="Asia/Kolkata">Asia/Kolkata</option>
      <option value="America/Los_Angeles">America/Los_Angeles</option>
      <option value="Europe/Berlin">Europe/Berlin</option>
    </select>
  </label>
  <label>Date & Time:
    <input type="datetime-local" id="tz-input">
  </label>
  <button onclick="convertTimezone()">Convert</button>
  <div id="tz-output"></div>
`,
password: `
  <h2>🔐 Password Generator</h2>
  <label>Length (4-128): <input type="number" id="pw-length" value="12" min="4" max="128" /></label><br/>
  <label><input type="checkbox" id="pw-uppercase" checked /> Uppercase</label>
  <label><input type="checkbox" id="pw-lowercase" checked /> Lowercase</label>
  <label><input type="checkbox" id="pw-numbers" checked /> Numbers</label>
  <label><input type="checkbox" id="pw-symbols" checked /> Symbols</label><br/>
  <button onclick="generatePassword()">Generate</button>
  <div class="hint">Password length must be between 4 and 128 characters.</div>
  <pre id="pw-output"></pre>
`

    };
  
    container.innerHTML = templates[tool] || `<p>Tool not found! Integration in Progress....</p>`;
  }
    async function formatJSON() {
    const input = document.getElementById('json-input').value;
    try {
      // Parse the input to validate it's valid JSON
      const jsonObj = JSON.parse(input);
      const response = await fetch('/api/json/format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonObj)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to format JSON');
      }
      
      const formatted = await response.text();
      document.getElementById('json-output').textContent = formatted;
    } catch (error) {
      const msg = `Error: ${error.message}`;
      document.getElementById('json-output').textContent = msg;
      showToast(msg);
    }
  }
  
  async function generateUUIDs() {
    const count = parseInt(document.getElementById('uuid-count').value);
    if (isNaN(count) || count < 1 || count > 50) {
      const msg = 'Count must be between 1 and 50';
      document.getElementById('uuid-list').innerHTML = `<li>${msg}</li>`;
      showToast(msg);
      return;
    }
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
    function updateLoremMaxCount() {
    const type = document.getElementById('lorem-type').value;
    const countInput = document.getElementById('lorem-count');
    const maxCounts = {
      word: 1000,
      sentence: 100,
      paragraph: 50
    };
    countInput.max = maxCounts[type];
    countInput.value = Math.min(countInput.value, maxCounts[type]);
  }

  async function generateLorem() {
    const type = document.getElementById('lorem-type').value;
    const count = parseInt(document.getElementById('lorem-count').value);
    const maxCounts = {
      word: 1000,
      sentence: 100,
      paragraph: 50
    };
    
    if (isNaN(count) || count < 1 || count > maxCounts[type]) {
      const msg = `Count must be between 1 and ${maxCounts[type]} for ${type}s`;
      document.getElementById('lorem-output').innerText = msg;
      showToast(msg);
      return;
    }

    try {
      const response = await fetch('/api/lorem/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, count })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate lorem ipsum');
      }
        const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate lorem ipsum');
      }
      document.getElementById('lorem-output').innerText = data.content;
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
    if (!input) {
      const msg = 'Please enter text to encode/decode';
      document.getElementById('base64-output').textContent = msg;
      showToast(msg);
      return;
    }
    try {
      const res = await fetch(`/api/base64/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'encode' ? { text: input } : { encoded: input })
      });
      
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || `Failed to ${mode} text`);
      }
      
      const result = await res.text();
      document.getElementById('base64-output').textContent = result;
    } catch (error) {
      const msg = `Error: ${error.message}`;
      document.getElementById('base64-output').textContent = msg;
      showToast(msg);
    }
  }
  async function generateHash() {
    const algo = document.getElementById('hash-type').value;
    const input = document.getElementById('hash-input').value;
    try {      const res = await fetch('/api/generateHash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, algorithm: algo })
      });
      const hash = await res.text();
      document.getElementById('hash-output').textContent = hash;
    } catch (error) {
      const msg = `Error: ${error.message}`;
      document.getElementById('hash-output').textContent = msg;
      showToast(msg);
    }
  }
  async function urlAction(mode) {
    const input = document.getElementById('url-input').value;
    if (!input) {
      const msg = 'Please enter a URL to encode/decode';
      document.getElementById('url-output').textContent = msg;
      showToast(msg);
      return;
    }
    try {
      const res = await fetch(`/api/url/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: input })
      });
      
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || `Failed to ${mode} URL`);
      }
      
      const result = await res.text();
      document.getElementById('url-output').textContent = result;
    } catch (error) {
      const msg = `Error: ${error.message}`;
      document.getElementById('url-output').textContent = msg;
      showToast(msg);
    }
  }

  async function convertTimezone() {
  const from = document.getElementById('from-tz').value;
  const to = document.getElementById('to-tz').value;
  const datetime = document.getElementById('tz-input').value;

  try {
    const params = new URLSearchParams({ from, to, datetime });
    const response = await fetch(`/api/timezone/convert?${params.toString()}`);
    const data = await response.json();

    if (data.converted) {
      document.getElementById('tz-output').innerHTML = `
        <strong>Original (${data.original.timezone}):</strong> ${data.original.formatted}<br/>
        <strong>Converted (${data.converted.timezone}):</strong> ${data.converted.formatted}
      `;
    } else {
      document.getElementById('tz-output').innerText = 'Conversion failed';
    }
  } catch (error) {
    document.getElementById('tz-output').innerText = `Error: ${error.message}`;
    showToast(`Error: ${error.message}`);
  }
}

async function generatePassword() {
  const length = parseInt(document.getElementById('pw-length').value);
  const includeUppercase = document.getElementById('pw-uppercase').checked;
  const includeLowercase = document.getElementById('pw-lowercase').checked;
  const includeNumbers = document.getElementById('pw-numbers').checked;
  const includeSymbols = document.getElementById('pw-symbols').checked;

  if (isNaN(length) || length < 4 || length > 128) {
    const msg = 'Password length must be between 4 and 128 characters';
    document.getElementById('pw-output').innerText = msg;
    showToast(msg);
    return;
  }

  if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
    const msg = 'At least one character type must be selected';
    document.getElementById('pw-output').innerText = msg;
    showToast(msg);
    return;
  }

  try {
    const response = await fetch('/api/generatePassword', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      document.getElementById('pw-output').innerText = `Error: ${errorText}`;
      showToast(`Error: ${errorText}`);
      return;
    }

    const password = await response.text();
    document.getElementById('pw-output').innerText = password;
  } catch (error) {
    document.getElementById('pw-output').innerText = `Error: ${error.message}`;
    showToast(`Error: ${error.message}`);
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
