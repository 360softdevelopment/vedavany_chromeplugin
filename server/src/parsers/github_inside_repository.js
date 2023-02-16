const puppeteer = require('puppeteer');

async function queryGithubInsideRepository(query)
{
  // Set up Puppeteer browser and page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Go to Github search within repository page
  const repo = 'vishnugpt/gptens';
  const encodedQuery = encodeURIComponent(query);
  const url = `https://github.com/${repo}/search?q=${encodedQuery}&type=Code`;
  console.log(`Navigating to URL: ${url}`);
  await page.goto(url);

  // Wait for search results to load
  const selector = 'div.code-list';
  console.log(`Waiting for selector: ${selector}`);


  page.on('console', async msg => {
    const args = msg.args();
    const vals = [];
    for (let i = 0; i < args.length; i++) {
      vals.push(await args[i].jsonValue());
    }
    console.log(vals.map(v => typeof v === 'object' ? JSON.stringify(v, null, 2) : v).join('\t'));
  });


  await page.waitForSelector(selector);
  
  // Get the search results
  const searchResults = await page.evaluate(() => {
    const results = [];

    // Get all the search result elements
    const searchResultElements = document.querySelectorAll('div.code-list > div.code-list-item');
    console.log(`Found ${searchResultElements.length} search result elements`);

    // Iterate through each search result element and extract the href, title, and description
    for (let i = 0; i < searchResultElements.length; i++) {
      console.log("!!!!");
      const searchResultElement = searchResultElements[i];
      const searchResult = { href: null, title: null, snippet_with_line_num: null, snippet_without_line_num:null };

      // Extract the href from the link element
      const linkElement = searchResultElement.querySelector('a');
      if (linkElement) {
        searchResult.href = linkElement.href;
      }

      // Extract the title from the title element
      const titleElement = searchResultElement.querySelector('a');
      if (titleElement) {
        searchResult.title = titleElement.textContent.trim();
      }


      // Extract the snippet from the code element
      const codeElement = searchResultElement.querySelector('.blob-wrapper');
      if (codeElement) {
        const codeLines = codeElement.querySelectorAll('.blob-code-inner');
        console.log(`Found ${codeLines.length} code lines`);
        let snippet = '';
        let code='';
        for (let j = 0; j < codeLines.length; j++) {
          const codeLine = codeLines[j];
          const lineText = codeLine.textContent.trim();
          //if (lineText.includes(query)) {
            const lineNumber = codeLine.parentElement.querySelector('.blob-num').textContent.trim();
            snippet += `${lineNumber}: ${lineText}\n`;
            code += `${lineText}\n`;
          //}
        }
        searchResult.snippet_with_line_num = snippet;
        searchResult.snippet_without_line_num = code;

        searchResult.body=snippet;
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
};


async function main()
{
  console.log(queryGithubInsideRepository("github"));
}

main();