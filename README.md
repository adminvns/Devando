Devando - Developer Utilities API Service
=========================================

**Devando** is a lightning-fast, production-ready API suite that offers a powerful set of developer utilities as RESTful endpoints. From formatting JSON to generating UUIDs, Devando is designed to save time and boost your productivity.

> 🔥 Made with ❤️ by Devando | Built on Node.js + Express | Self-hosted with Render

🚀 Live Demo (Coming Soon)
--------------------------

You will be able to try all endpoints from the browser or Postman soon!

📌 Features (Tools Available)
-----------------------------

### 🧰 Formatter Tools

*   **JSON Formatter**: Beautify your JSON.
    
*   **URL Encoder/Decoder**: Encode and decode URLs seamlessly.
    
*   **Text Encoder/Decoder**: Encode/decode base64 strings.
    

### 🔐 Security Tools

*   **Hash Generator**: Generate MD5, SHA1, SHA256, and SHA512 hashes.
    
*   **Password Generator**: Create strong, random passwords with length & character set options.
    

### 📍 Utility Tools

*   **UUID Generator**: Generate UUID v4 in bulk (up to 100).
    
*   **Lorem Ipsum Generator**: Generate words, sentences, or paragraphs for mock content.
    
*   **Timezone Converter**: Convert between timezones (e.g. UTC → Asia/Kolkata).
    
*   **Regex Matcher**: Match regex pattern on given text.
    
*   **Calculator**: Perform simple arithmetic operations via API.
    

📢 API Endpoints
----------------

> All endpoints are under /api/

### JSON Formatter

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/json/format  Content-Type: application/json  {    "json": "{\"key\":\"value\"}",    "indent": 2  }   `

### URL Encode/Decode

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/url/encode  POST /api/url/decode  Content-Type: application/json  {    "text": "https://devando.io"  }   `

### Text Encode/Decode

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/text/encode  POST /api/text/decode  Content-Type: application/json  {    "text": "Hello World"  }   `

### Hash Generator

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/hash/generate  Content-Type: application/json  {    "text": "IronMan",    "algorithm": "sha256"  }   `

### Password Generator

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/password/generate  Content-Type: application/json  {    "length": 16,    "includeSymbols": true,    "includeNumbers": true  }   `

### UUID Generator

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/uuid/generate  Content-Type: application/json  {    "count": 5  }   `

### Lorem Ipsum Generator

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/lorem/generate  Content-Type: application/json  {    "type": "paragraph",    "count": 3  }   `

### Timezone Converter

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/timezone/convert  Content-Type: application/json  {    "from": "UTC",    "to": "Asia/Kolkata",    "datetime": "2025-06-12T12:00:00Z"  }   `

### Regex Matcher

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/regex/match  Content-Type: application/json  {    "pattern": "\\d+",    "text": "Order #1223 shipped on 2025-06-12"  }   `

### Calculator

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/calc  Content-Type: application/json  {    "expression": "(10 + 5) * 2"  }   `

🧪 Testing
----------

Use Postman or any REST client to test the endpoints. Make sure your headers include:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Content-Type: application/json   `

⚙️ Installation & Run Locally
-----------------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   git clone https://github.com/your-username/devando.git  cd devando  npm install  npm start   `

📜 License
----------

This project is licensed under the **Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International** License.

> ✅ You can use it personally or in projects, but **cannot sell or repackage** without permission.

🧠 SEO Keywords for Google Search (Metadata)
--------------------------------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Developer APIs, Free JSON Formatter API, UUID Generator REST API, Lorem Ipsum API, Text Encoder API, Hash Generator API, Secure Password Generator API, Timezone Converter API, Regex Matching API, Devando Developer Tools   `

Make sure to add these as meta tags or Open Graph tags in the public-facing frontend or documentation site.

👨‍💻 Maintained by
-------------------

**Mr. Stark** - Senior QA Engineer, Full-stack Dev, Guitarist & Founder of Devando ⚡GitHub: [github.com/adminvns](https://github.com/adminvns)LinkedIn: [linkedin.com/in/adminvns](https://linkedin.com/in/adminvns)

**🌟 Star the repo if you love it — Let’s build a smarter dev world together!**