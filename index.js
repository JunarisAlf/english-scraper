const puppeteer = require('puppeteer');
const fs = require('fs');

async function getWords() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.ef.com/wwen/english-resources/english-vocabulary/top-3000-words/');
    const element = await page.waitForSelector('#main-content > div > div > section > div > div > p');
    let words = await page.evaluate(() => {
        let string = document.querySelector('#main-content > div > div > section > div > div > p');
        string = string.innerText;
        return string.split('\n')
    })
    const jsonData = JSON.stringify(words);
    // Write JSON string to file
    fs.writeFile('./result/words.json', jsonData, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
    browser.close();
}
// getWords();
async function delay(time) {
    await new Promise(resolve => setTimeout(resolve, time));
}
async function getInfo(){
    const data = await fs.promises.readFile('./result/words.json');
    let words = JSON.parse(data);
    let finalRes = []
    words = ['all', 'any', 'about', 'simple']

    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    for (let i = 0; i < words.length; i++) {
        await page.goto(`https://translate.google.com/?sl=en&tl=id&text=${words[i]}&op=translate`);
        // get translation/meaning
        await page.waitForSelector('.kgnlhe');
        let translatedWords = await page.evaluate(() => {
            const translated = document.querySelectorAll('.kgnlhe')
            let tempWords = []
            translated.forEach((ind) => {
                tempWords.push(ind.innerText)
            })
            return tempWords
        })

        // get translation/meaning
        try{
            await page.waitForSelector('.AZPoqf.OvhKBb');
            let showMore = await page.waitForSelector('.I87fLc.D7YKlf.XzOhkf .ZShpvc .VK4HE');
            await showMore.click()
        }catch(err){
            console.log(err)
        }
        // await page.screenshot({path: 'screenshot.png', fullPage: true});
        await delay(500)
        let examples = await page.evaluate(() => {
            const exmp = document.querySelectorAll('.AZPoqf.OvhKBb')
            let tempExmp = []
            exmp.forEach((ex) => {
                tempExmp.push(ex.innerText)
            })
            return tempExmp
        })

        finalRes.push({
            engWord: words[i],
            idWord: translatedWords,
            examples
        })
        console.log('DONE: ', words[i])
    }
    console.log(finalRes)
    browser.close();

}
getInfo()
