const express = require('express');
const app = express();

const puppeteer = require('puppeteer');

const getLyrics = async (music) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.letras.mus.br/?q=${music}`);
    await page.click("#___gcse_0 > div > div > div > div.gsc-wrapper > div.gsc-resultsbox-visible > div > div > div.gsc-expansionArea > div:nth-child(1) > div.gs-webResult.gs-result > div.gsc-thumbnail-inside > div > a")

    const lyrics = await page.evaluate(() => {
        return document.getElementsByClassName('cnt-letra p402_premium')[0].innerHTML;
    });
    await browser.close();
    return lyrics
}

// `https://www.letras.mus.br/?q=${music}` 

app.get('/song/:title', async function(req, res) {
    const lyrics = await getLyrics(req.params.title)
    await res.json({
        song: lyrics,
    })
})

app.listen(3000)