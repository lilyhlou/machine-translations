const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

class HTMLTranslator {

    /**
     * Get HTML markup from a URL
     */
    async fetchHTML(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Error fetching HTML:', error);
            throw error;
        }
    }

    /**
     * Translate text using LibreTranslate
     */
    async translateText(text, sourceLanguage = 'auto', targetLanguage = 'es') {
        try {
            const response = await fetch(`http://127.0.0.1:5000/translate`, { // libretranslate API, local server
                method: "POST",
                body: JSON.stringify({
                    q: text,
                    source: sourceLanguage,
                    target: targetLanguage,
                    format: "text"
                }),
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error(`Translation API error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.translatedText || text
        } catch (error) {
            console.error('Error translating text:', error);
            return text; // Return original text if translation fails
        }
    }

    /**
     * Translate HTML text content while preserving markup/html tags
     */
    async translateHTML(html, sourceLanguage = 'auto', targetLanguage = 'es', targetSelectors = null) {
        const dom = new JSDOM(html);
        const document = dom.window.document;
                
        let targetElements = [document.body];
        if (targetSelectors) {
            const selectors = Array.isArray(targetSelectors) ? targetSelectors : [targetSelectors];
            targetElements = [];
            
            for (const selector of selectors) {
                const selectedElements = document.querySelectorAll(selector);
                if (selectedElements.length > 0) {
                    targetElements.push(...Array.from(selectedElements));
                    console.log(`Found ${selectedElements.length} element(s) matching: ${selector}`);
                } else {
                    console.log(`Target selector "${selector}" not found`);
                }
            }
            
            // Fallback to body if no elements found
            if (targetElements.length === 0) {
                console.log('No target elements found, using body element');
                targetElements = [document.body];
            }
        }
        
        // Collect all text nodes from all target elements
        const textNodeMap = [];
        for (const targetElement of targetElements) {
            const elementTextNodes = this.collectTextNodes(targetElement);
            textNodeMap.push(...elementTextNodes);
        }
        
        if (textNodeMap.length === 0) {
            console.log('No text content found to translate');
            return html;
        }

        await this.translateTextNodes(textNodeMap, sourceLanguage, targetLanguage);
        
        // Remove all script tags to prevent re-hydration and other JS behavior
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => script.remove());

        return dom.serialize();
    }

    collectTextNodes(element) {
        const textNodes = [];
        const walker = element.ownerDocument.createTreeWalker(element, element.ownerDocument.defaultView.NodeFilter.SHOW_TEXT);

        let node;
        while (node = walker.nextNode()) {
            const text = node.textContent.trim();
            if (text && text.length > 0) {
                textNodes.push({
                    node: node,
                    text: text,
                    originalText: text
                });
            }
        }
        
        return textNodes;
    }

    async translateTextNodes(textNodeMap, sourceLanguage, targetLanguage) {
        for (const textNodeInfo of textNodeMap) {
            const originalText = textNodeInfo.text;
            
            // Translate each text node paragraph by paragraph
            const translatedText = await this.translateText(originalText, sourceLanguage, targetLanguage); 
            textNodeInfo.node.textContent = translatedText;
        }
    }

    /**
     * Main method to get website markup and translate text 
     */
    async scrapeAndTranslate(url, sourceLanguage = 'auto', targetLanguage = 'es', targetSelectors = null) {
        try {
            console.log(`Fetching content from: ${url}`);
            const html = await this.fetchHTML(url);
            
            console.log('Translating HTML content...');
            const translatedHTML = await this.translateHTML(html, sourceLanguage, targetLanguage, targetSelectors);
            
            return translatedHTML;
        } catch (error) {
            console.error('Error in scrapeAndTranslate:', error);
            throw error;
        }
    }
}

module.exports = HTMLTranslator;