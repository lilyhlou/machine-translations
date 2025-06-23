const HTMLTranslator = require('./translate.js');
const fs = require('fs');
const path = require('path');

async function translateArticles() {
    const translator = new HTMLTranslator();
    const outputDir = 'translated_articles';
    
    try {
        if (!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir);
        }

        // Example 1: Rest of World article 
        let url = 'https://restofworld.org/2025/ev-battery-manufacturing-local-pushback/'; // Replace with article URL you'd like to translate
        
        // See class names by opening the page in the browser and inspecting the elements
        const targetSelectors = ['.post-header__text__title', '.post-content', '.post-header__text__dek', '.post-header__text__section a'];
        const translatedHTML = await translator.scrapeAndTranslate(url, 'auto', 'es', targetSelectors); // 'auto' means detect source language, 'es' means translate to Spanish, replace with your target language code
        
        const outputPath1 = path.join(outputDir, 'translated_page.html');
        fs.writeFileSync(outputPath1, translatedHTML); // Save to file named translated_page.html, rename to your desired filename
        console.log(`Translation completed! Saved to ${outputPath1}`); 
        
        // Example 2: Translate entire page (no target selector)
        const translatedFullPage = await translator.scrapeAndTranslate(url, 'auto', 'es');
        const outputPath2 = path.join(outputDir, 'translated_full_page.html');
        fs.writeFileSync(outputPath2, translatedFullPage);        
        console.log(`Translation completed! Saved to ${outputPath2}`); 

        // Example 3: BBC aritcle 
        url = 'https://www.bbc.co.uk/rdnewslabs/projects/frank'; 
        const BBCtargetSelectors = ['body'];
        const translatedHTML_bbc = await translator.scrapeAndTranslate(url, 'auto', 'ko', BBCtargetSelectors); // 'auto' means detect source language, 'es' means translate to Spanish, replace with your target language code

        const outputPath3 = path.join(outputDir, 'translated_page_bbc.html');
        fs.writeFileSync(outputPath3, translatedHTML_bbc); // Save to file named translated_page.html, rename to your desired filename
        console.log(`Translation completed! Saved to ${outputPath3}`); 


        // Example 4: another BBC aritcle 
        url = 'https://www.bbc.com/news/articles/cgq3wlp22j9o'; 
        const BBCtargetSelectors2 = ['article'];
        const translatedHTML_bbc2 = await translator.scrapeAndTranslate(url, 'auto', 'ko', BBCtargetSelectors2); // 'auto' means detect source language, 'es' means translate to Spanish, replace with your target language code

        const outputPath4 = path.join(outputDir, 'translated_page_bbc2.html');
        fs.writeFileSync(outputPath4, translatedHTML_bbc2); // Save to file named translated_page.html, rename to your desired filename
        console.log(`Translation completed! Saved to ${outputPath4}`); 

    } catch (error) {
        console.error('Translation failed:', error);
    }
}

if (require.main === module) {
    translateArticles();
} 