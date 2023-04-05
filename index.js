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
getWords();

