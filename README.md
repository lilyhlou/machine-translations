# HTML Translator

This tool translates the content of a page (made with news articles and publications in mind) while preserving markup and styles. 

## Prerequisites

- **Node.js** (v14 or higher)
- **Python** (for LibreTranslate, v3.8 or higher)
- **pip** (Python package manager)

## Installation

### 1. Install LibreTranslate

First, install LibreTranslate using pip:

```bash
pip install libretranslate
```

### 2. Clone and Setup the Project

```bash
# Clone the Github repository
git clone https://github.com/lilyhlou/machine-translations.git
cd machine-translation

# Install Node.js dependencies
npm install
```

### 3. Start LibreTranslate Server

Start the LibreTranslate server on port 5000 (default):

```bash
libretranslate
```

The server will be available at `http://localhost:5000`

### 4. Update the translate-articles.js file with relevant URLs, languages you'd like to translate to/from, and relevant CSS selectors on the page (to translate specific sections of the page)

You can also visit localhost:5000 to see a UI that you can interact with and translate from. There is an option to upload files and you can download your HTML site to translate via LibreTranslate.

## Usage

### Web Interface (Recommended for File Uploads)
1. **Start the LibreTranslate server** (see step 3 above)
2. **Open your browser** and go to `http://localhost:5000`
2. **Download HTML** of article you'd like to translate. Uploading a file can be helpful if the HTML scraper hits a paywall or you want to translate a site in the full context, rather than paragraph by paragraph.
3. **Upload HTML files** through the web UI
4. **Select source and target languages**
5. **Download translated files**

### Programmatic Usage

#### Basic HTML Translation

Run with `node translate-articles.js` (or the name of the JS file you'd like to run).
After running, you should see your translated files in a folder marked, `translated_articles`.
**Examples are included in translate-articles.js**
```javascript
const HTMLTranslator = require('./translate.js');

async function translateExample() {
    const translator = new HTMLTranslator();
    
    // Translate a website
    const translatedHTML = await translator.scrapeAndTranslate(
        'https://example.com',
        'auto',  // source language
        'es'     // target language
    );
    
    console.log(translatedHTML);
}
```

#### Translate Specific Elements

```javascript
// Translate only content within specific CSS classes
const translatedHTML = await translator.scrapeAndTranslate(
    'https://example.com',
    'auto',
    'es',
    ['.article-content', '.headline']  // target selectors
);
```

## Language Codes

Common language codes supported by LibreTranslate:

| Language | Code |
|----------|------|
| English | `en` |
| Spanish | `es` |
| French | `fr` |
| German | `de` |
| Italian | `it` |
| Portuguese | `pt` |
| Russian | `ru` |
| Chinese | `zh` |
| Japanese | `ja` |
| Korean | `ko` |
| Arabic | `ar` |

Use `'auto'` for automatic language detection. See list of full language codes [here](https://libretranslate.com/languages).

## Quick Start Checklist

- [ ] Install LibreTranslate: `pip install libretranslate`
- [ ] Install Node.js dependencies: `npm install`
- [ ] Start LibreTranslate server: `libretranslate`
- [ ] Visit `http://localhost:5000` for web interface
- [ ] Or use programmatically: `node translate-articles.js` 
- [ ] Edit translate-articles.js with desired URLs, languages, and CSS selectors
