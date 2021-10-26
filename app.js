const express = require('express');
const app = express();

const puppeteer = require('puppeteer');

const PORT = process.env.PORT || 3000

const getLyrics = async (music) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.letras.mus.br/?q=${music}`);
    await page.waitForSelector('#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child(1) > div.gs-webResult.gs-result > div.gsc-thumbnail-inside > div > a')
    await page.click("#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child(1) > div.gs-webResult.gs-result > div.gsc-thumbnail-inside > div > a")
    
    await page.waitForSelector("#js-lyric-cnt > article > div.cnt-letra-trad.g-pr.g-sp > div.cnt-letra.p402_premium")
    const nodes = await page.evaluate(() => {
        const elements = document.getElementsByClassName('cnt-letra p402_premium')
        
        return elements[0].outerText
    })
    console.log(nodes)
    browser.close()
    return nodes
}

// `https://www.letras.mus.br/?q=${music}` 

app.get('/', (req, res) => {
    res.send('<h1>Welcome to my API!</h1>')
})

app.get('/song/:title', async function(req, res) {
    const lyrics = await getLyrics(req.params.title)
    await res.json({
        song: lyrics,
    })
})

app.listen(PORT)