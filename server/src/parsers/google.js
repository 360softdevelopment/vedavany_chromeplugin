async function loadGoogle(url) {
    // Set up Puppeteer browser and page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    // Go to Google search page
    //const query = 'puppeteer example';
    const encodedQuery = encodeURIComponent(url);
    await page.goto(`https://www.google.com/search?q=${encodedQuery}`);
  
    // Wait for search results to load
    await page.waitForSelector('div.g');
  
    // Get the search results tree structure
    const searchResults = await page.evaluate(() => {
      const results = [];
  
      // Get all the search result elements
      const searchResultElements = document.querySelectorAll('div.g');
  
      // Iterate through each search result element and extract the href, title, and description
      for (let i = 0; i < searchResultElements.length; i++) {
        const searchResultElement = searchResultElements[i];
        const searchResult = { href: null, title: null, body: null };
  
        // Extract the href from the link element
        const linkElement = searchResultElement.querySelector('div > div > div > a');
        if (linkElement) {
          searchResult.href = linkElement.href;
        }
  
        // Extract the title from the title element
        const titleElement = searchResultElement.querySelector('div > div > div > a > h3');
        if (titleElement) {
          searchResult.title = titleElement.textContent;
        }
  
        // Extract the description from the description element
        const descriptionElement = searchResultElement.querySelector('div > div > div > div > span');
        if (descriptionElement) {
          searchResult.body = descriptionElement.textContent;
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
  
    return searchResults;
  };