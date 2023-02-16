const puppeteer = require('puppeteer');

(async () => {
  // Set up Puppeteer browser and page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Go to Github search page
  const query = 'puppeteer';
  const encodedQuery = encodeURIComponent(query);
  var url=`https://github.com/search?q=${encodedQuery}&type=Repositories`;
  console.log(url);
  await page.goto(url);

  // Wait for search results to load
  await page.waitForSelector('ul.repo-list');

  // Get the search results
  const searchResults = await page.evaluate(() => {
    const results = [];

    // Get all the search result elements
    const searchResultElements = document.querySelectorAll('ul.repo-list > li');

    // Iterate through each search result element and extract the href, title, and description
    for (let i = 0; i < searchResultElements.length; i++) {
      const searchResultElement = searchResultElements[i];
      const searchResult = { href: null, title: null, description: null };

      // Extract the href from the link element
      const linkElement = searchResultElement.querySelector('h3 > a');
      if (linkElement) {
        searchResult.href = linkElement.href;
      }

      // Extract the title from the title element
      const titleElement = searchResultElement.querySelector('h3 > a');
      if (titleElement) {
        searchResult.title = titleElement.textContent.trim();
      }

      // Extract the description from the description element
      const descriptionElement = searchResultElement.querySelector('div.py-1 > p');
      if (descriptionElement) {
        searchResult.description = descriptionElement.textContent.trim();
      }

      // Add the search result to the search results array
      results.push(searchResult);
    }

    return results;
  });

  // Log the search results
  console.log(searchResults);

  // Close the Puppeteer browser
  await browser.close();
})();