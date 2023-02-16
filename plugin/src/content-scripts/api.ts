export interface SearchResult {
    body: string
    href: string
    title: string
}

export async function apiSearch(query: string, numResults: number, timePeriod: string, region: string): Promise<SearchResult[]> {
    const pageOperatorMatches = query.match(/page:(\S+)/)
    let queryUrl: string

    if (pageOperatorMatches)
        queryUrl = pageOperatorMatches[1]

    let url: RequestInfo | URL

    if (queryUrl) {
        url = `http://localhost:3000/url_to_text?url=${queryUrl}`
    } else {
        
                url = `http://localhost:3000/search?`
                    + `max_results=${numResults}`
                    + `&q=${query}`
                    + (timePeriod ? `&time=${timePeriod}` : "")
                    + (region ? `&region=${region}` : "")
        /*

        let url = "https://www.google.com/search?q=" + encodeURIComponent(query) +
            "&num=" + encodeURIComponent(numResults);
        if (timePeriod) {
            url += "&tbs=qdr:" + encodeURIComponent(timePeriod);
        }
        if (region) {
            url += "&cr=" + encodeURIComponent(region);
        }
        */
    }
    console.log(url);
    const response = await fetch(url);
    console.log(response);
    const results = await response.json()
    return results.map((result: any) => {
        return {
            body: result.body,
            href: result.href,
            title: result.title
        }
    })
}
