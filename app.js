const express = require('express');
const app = express();

const puppeteer = require('puppeteer');

const PORT = process.env.PORT || 3000

const getLyrics = async (music, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox"]
        });

        const page = await browser.newPage();

        await page.goto(`https://www.letras.mus.br/?q=${music}`);
        await page.waitForSelector('#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child(1) > div.gs-webResult.gs-result > div.gsc-thumbnail-inside > div > a', {timeout: 5000})
        await page.click("#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child(1) > div.gs-webResult.gs-result > div.gsc-thumbnail-inside > div > a")
        
        await page.waitForSelector("#js-lyric-cnt > article > div.cnt-letra-trad.g-pr.g-sp > div.cnt-letra.p402_premium", {timeout: 5000})
        
        const nodes = await page.evaluate(() => {
            const elements = document.getElementsByClassName('cnt-letra p402_premium')
            
            return elements[0].outerText
        })

        console.log(nodes)

        browser.close()

        await res.json({song: nodes})
    } catch (err) {
        await res.json({song: "Song not found."})
    }
    
}

app.get('/', (req, res) => {
    res.send('<h1>Welcome to my API!</h1>')
})

app.get('/song/:title', function(req, res) {
    getLyrics(req.params.title, res)
})

app.listen(PORT)