const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function getHTMLContent(htmlContent) {
  try {
    // Extract the content inside <head></head>
    const headStartIndex = htmlContent.indexOf('<head>');
    const headEndIndex = htmlContent.indexOf('</head>');
    const headContent = htmlContent.slice(headStartIndex + 6, headEndIndex);

    // Regular expression pattern to match <script> blocks inside <head></head>
    const scriptPattern = /<script\b[^>]*>([\s\S]*?)<\/script>/g;

    // Find all <script> blocks in the headContent
    const scriptBlocks = headContent.match(scriptPattern);

    // Get the content of the last <script> block
    const lastScriptContent = scriptBlocks
      ? scriptBlocks[scriptBlocks.length - 1]
      : null;

    // Regular expression pattern to match the image URL
    const imageUrlPattern = /"image":"([^"]+)"/;

    // Find the image URL using the regular expression pattern
    const imageUrlMatch = lastScriptContent.match(imageUrlPattern);

    // Extract the image URL from the match
    const imageUrl = imageUrlMatch ? imageUrlMatch[1] : null;

    console.log('Image URL:', imageUrl);
  } catch (error) {
    console.error('Error fetching HTML:', error.message);
    return null;
  }
}

const extractJDAndSave = async (url) => {
  try {
    const headers = {
      // Host: 'www.linkedin.com',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/115.0',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      Cookie:
        'bcookie="v=2&bcdf333c-3289-4eea-88fe-3b1865ddb528"; bscookie="v=1&20230720174904e0ea3088-eb4f-44d5-8542-4ce34b67e3a3AQGPSQeGxjTjL10D9Tk1PdjRdnPmB-0V"; G_ENABLED_IDPS=google; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C19568%7CMCMID%7C10933060741451415231798706509444132992%7CMCAAMLH-1691254503%7C6%7CMCAAMB-1691254503%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1690656903s%7CNONE%7CvVersion%7C5.1.1; aam_uuid=11447885901154388081745537617118315339; recent_history=AQHn7G2tv46s9QAAAYmik1s-0fqBpgmR4Wu6l2E464aLkG04DXaTlxmsda1aDV6lJjpIojQDRuuLhJ71rTBXIIMNtEQsltGiPtDajBxlo8ROlwUA5fWXvDy-fyi8kq5_DxMCeFG2ghWcUQT4r-j1Yp127lzWveJMVmU75kEKu3S9pBtx5E49u_XNa4sV3QtDCa7fytMa4IzZEivuuoy1-T3s9ySHa-sVdjuABAHOGOOCYaXnOMIqTqag5IWZQvu8ZbA9lBOB7tWIW_S0PHbS9xankmutbSMh4StlVOE1R9woZVJRdNlfQW8Mk802EMTcCNRuJKbOM5tKPNlWOYLACN3DbJqzThvOR4ZQdKOKNXIzryIhpsswc33ijEw0g4uvGZUrDqebjHc95MuYR_sZjGuXkzW-6fjfvIMgDoyzG-ykxmw2jH3J2ubQWuYkl5Lm_qCXlXu6oXztnfdmGnKyVRcsvZhCEdf6IlZhloWW-Eq6w85fCvWnNHHIIDDqM0OWP8yXBScaJTCjUmPYYNkq6i3og0xhDOywSObZad_e9L5uNOzuQSCDQVHTuH5hkzGyqBhoWiB8RgX-yplK-SYawHGTCZzONO8TPcEWMphFPpqUrInyM-z89mrbBibLVJQUTavHBm4-1EKeO4UGJJbEtSCdubZrht1r7uVVVgobR7wZ3sNyA0_PezoMqFswCpxtDFau; _gcl_au=1.1.1653505146.1689875375; lidc="b=TGST04:s=T:r=T:a=T:p=T:g=2981:u=1:x=1:i=1690649702:t=1690736102:v=2:sig=AQGnvahpOrdyB6_wlaMugVP69gIYMTRJ"; fid=AQEkEoydmS7E8gAAAYmYzIQOZKwnhcJmE1x5LzE8vomen5xJvXUsl8tziH-eCSmDXrO6c7a9Ch4ijQ; fcookie=AQE71vR8vUd-dAAAAYmYzKk5GKVZokxJctEH-CUVOiI_weQCA8D3aPV1GvnZQyzWFJE0daozOjC0PZp9rTXcgolEg5qCI_A7iwcjahDc_LyVj9Y6txAIriXadWdwZkaO5kpW6PnCcWss1tXq5GZAekNtfjYU9oZb8i4I5sKObxtojR0JvtMiXeWz2_8DQYw6zyjxLzCx7DAUFuUu65ADxF0n0dim3GpKn2aPji_YErDkAFHXibDGdMV7ioCuw8ClbuDMESnXAxXqv1Iuvk3jXHWyULP6PUWiZKqVmzNsgVV5ZaiqF18Tz2mdpqP9mfPOFlkU7ZSxPeZaF+C8OENuPg==; JSESSIONID=ajax:1101916313279185008; lang=v=2&lang=en-US; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; PLAY_SESSION=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InNlc3Npb25faWQiOiI2NDI3Zjg0NC04YzI4LTQ0MzAtYWE0YS02M2I2ZTE4YWY4YWV8MTY5MDY1MDU3MiIsImFsbG93bGlzdCI6Int9IiwicmVjZW50bHktc2VhcmNoZWQiOiIiLCJyZWZlcnJhbC11cmwiOiJodHRwczovL3d3dy5nb29nbGUuY29tLyIsImFpZCI6IiIsInJlY2VudGx5LXZpZXdlZCI6IjU2OTA5Mnw1NDQ5NzZ8NTQxODc4IiwiQ1BULWlkIjoic8KRwoM7O8KLTXLCrcKzwqRcdTAwMEJ-XHUwMDA3I8OFIiwiZXhwZXJpZW5jZSI6ImVudGl0eSIsInRyayI6IiJ9LCJuYmYiOjE2OTA2NTA2MjYsImlhdCI6MTY5MDY1MDYyNn0.nZ-WxxfqiBcwqoqE7isWiT0qj8wZEAg55x7bZTMCNeQ; PLAY_LANG=en',
    };
    // const newUrl = `${url.split('?')[0]}?lang=en`;
    // console.log(`New URL: ${newUrl}`);

    const response = await axios.get(url, {
      headers,
    });

    fs.writeFile('html.html', response.data, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return;
      }
      console.log('HTML content saved as html.html');
    });

    const $ = cheerio.load(response.data);

    const targetDiv = $(
      '.description__job-criteria-text.description__job-criteria-text--criteria'
    );

    const arr = targetDiv
      .text()
      .trim()
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item !== '');
    console.log(arr);

    getHTMLContent(response.data);
  } catch (error) {
    console.error('Error fetching the URL:', error);
    throw error;
  }
};

// ******************** MAIN ********************
const url =
  'https://bh.linkedin.com/jobs/view/consultant-business-management-treasury-financial-markets-department-%E2%80%93-1-year-contract-at-jobs-via-efinancialcareers-3618545976?refId=zmW6Yfg7LI4oYhwli%2FuwOg%3D%3D&trackingId=sKjcyMLc7O6lRysGR%2F9dvQ%3D%3D&position=3&pageNum=0&trk=public_jobs_jserp-result_search-card';

extractJDAndSave(url).catch((error) => {
  console.log(error);
});
