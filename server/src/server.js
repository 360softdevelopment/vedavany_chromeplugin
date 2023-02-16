const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { JSDOM } = require('jsdom');
const puppeteer = require('puppeteer');
const cors = require('cors');


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/url_to_text', async (req, res) => {
  const { url } = req.query;
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const text = $('body').text();
    res.send(text);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting URL');
  }
});


app.get('/search', async (req, res) => {
  const { q, numResults } = req.query;
  const url = `https://yandex.com/search/?text=${encodeURIComponent(q)}&numdoc=${numResults}`;

  try {
    var results=await loadGoogle(url);
    console.log(123);
    console.log(results);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});










app.listen(port, () => console.log(`Microservice listening on port ${port}!`));
