// const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const Company = require('../models/companyModel');
const Vacancy = require('../models/vacancyModel');
const APIFeatures = require('../utils/apiFeatures');

const axiosHeader = {
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,en;q=0.5',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/115.0',
  Cookie:
    'bcookie="v=2&bcdf333c-3289-4eea-88fe-3b1865ddb528"; bscookie="v=1&20230720174904e0ea3088-eb4f-44d5-8542-4ce34b67e3a3AQGPSQeGxjTjL10D9Tk1PdjRdnPmB-0V"; G_ENABLED_IDPS=google; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-637568504%7CMCIDTS%7C19568%7CMCMID%7C10933060741451415231798706509444132992%7CMCAAMLH-1691254503%7C6%7CMCAAMB-1691254503%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1690656903s%7CNONE%7CvVersion%7C5.1.1; aam_uuid=11447885901154388081745537617118315339; recent_history=AQHn7G2tv46s9QAAAYmik1s-0fqBpgmR4Wu6l2E464aLkG04DXaTlxmsda1aDV6lJjpIojQDRuuLhJ71rTBXIIMNtEQsltGiPtDajBxlo8ROlwUA5fWXvDy-fyi8kq5_DxMCeFG2ghWcUQT4r-j1Yp127lzWveJMVmU75kEKu3S9pBtx5E49u_XNa4sV3QtDCa7fytMa4IzZEivuuoy1-T3s9ySHa-sVdjuABAHOGOOCYaXnOMIqTqag5IWZQvu8ZbA9lBOB7tWIW_S0PHbS9xankmutbSMh4StlVOE1R9woZVJRdNlfQW8Mk802EMTcCNRuJKbOM5tKPNlWOYLACN3DbJqzThvOR4ZQdKOKNXIzryIhpsswc33ijEw0g4uvGZUrDqebjHc95MuYR_sZjGuXkzW-6fjfvIMgDoyzG-ykxmw2jH3J2ubQWuYkl5Lm_qCXlXu6oXztnfdmGnKyVRcsvZhCEdf6IlZhloWW-Eq6w85fCvWnNHHIIDDqM0OWP8yXBScaJTCjUmPYYNkq6i3og0xhDOywSObZad_e9L5uNOzuQSCDQVHTuH5hkzGyqBhoWiB8RgX-yplK-SYawHGTCZzONO8TPcEWMphFPpqUrInyM-z89mrbBibLVJQUTavHBm4-1EKeO4UGJJbEtSCdubZrht1r7uVVVgobR7wZ3sNyA0_PezoMqFswCpxtDFau; _gcl_au=1.1.1653505146.1689875375; lidc="b=TGST04:s=T:r=T:a=T:p=T:g=2981:u=1:x=1:i=1690649702:t=1690736102:v=2:sig=AQGnvahpOrdyB6_wlaMugVP69gIYMTRJ"; fid=AQEkEoydmS7E8gAAAYmYzIQOZKwnhcJmE1x5LzE8vomen5xJvXUsl8tziH-eCSmDXrO6c7a9Ch4ijQ; fcookie=AQE71vR8vUd-dAAAAYmYzKk5GKVZokxJctEH-CUVOiI_weQCA8D3aPV1GvnZQyzWFJE0daozOjC0PZp9rTXcgolEg5qCI_A7iwcjahDc_LyVj9Y6txAIriXadWdwZkaO5kpW6PnCcWss1tXq5GZAekNtfjYU9oZb8i4I5sKObxtojR0JvtMiXeWz2_8DQYw6zyjxLzCx7DAUFuUu65ADxF0n0dim3GpKn2aPji_YErDkAFHXibDGdMV7ioCuw8ClbuDMESnXAxXqv1Iuvk3jXHWyULP6PUWiZKqVmzNsgVV5ZaiqF18Tz2mdpqP9mfPOFlkU7ZSxPeZaF+C8OENuPg==; JSESSIONID=ajax:1101916313279185008; lang=v=2&lang=en-US; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; PLAY_SESSION=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InNlc3Npb25faWQiOiI2NDI3Zjg0NC04YzI4LTQ0MzAtYWE0YS02M2I2ZTE4YWY4YWV8MTY5MDY1MDU3MiIsImFsbG93bGlzdCI6Int9IiwicmVjZW50bHktc2VhcmNoZWQiOiIiLCJyZWZlcnJhbC11cmwiOiJodHRwczovL3d3dy5nb29nbGUuY29tLyIsImFpZCI6IiIsInJlY2VudGx5LXZpZXdlZCI6IjU2OTA5Mnw1NDQ5NzZ8NTQxODc4IiwiQ1BULWlkIjoic8KRwoM7O8KLTXLCrcKzwqRcdTAwMEJ-XHUwMDA3I8OFIiwiZXhwZXJpZW5jZSI6ImVudGl0eSIsInRyayI6IiJ9LCJuYmYiOjE2OTA2NTA2MjYsImlhdCI6MTY5MDY1MDYyNn0.nZ-WxxfqiBcwqoqE7isWiT0qj8wZEAg55x7bZTMCNeQ; PLAY_LANG=en',
};

function wait(delay) {
  // const delay =
  //   Math.floor(Math.random() * (seconds_to - seconds_from + 1)) + seconds_from;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function wait(delay1, delay2) {
  const delay = Math.floor(Math.random() * (delay2 - delay1 + 1)) + delay1;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function getDateTime() {
  const timestamp = Date.now(); // Get current timestamp
  const localizedTime = new Date(timestamp).toLocaleString();
  return localizedTime;
}

async function fetchLinkedHtml(name, country = 'Bahrain', maxDelay = 5000) {
  // Introduce a delay of 1 second (1000 milliseconds) before making the next request
  // console.log(
  //   `${getDateTime()}:- entering fetchLinkedHtml(: ${name}, ${country}, ${maxDelay})`
  // );
  // const minDelay = Math.floor(maxDelay / 2);
  // const delay =
  //   Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  // await new Promise((resolve) => setTimeout(resolve, delay));
  await wait(Math.floor(maxDelay / 2), maxDelay);

  // console.log(
  //   `${getDateTime()}:- trying axios get  https://www.linkedin.com/jobs/search?keywords=${name}&location=${country} ........`
  // );
  try {
    const response = await axios.get('https://www.linkedin.com/jobs/search', {
      params: {
        keywords: name,
        location: country,
      },
      headers: axiosHeader,
      // {
      //   'User-Agent':
      //     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/115.0',
      //   Accept:
      //     'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      //   'Accept-Language': 'en-US,en;q=0.5',
      //   Connection: 'keep - alive',
      // },
    });

    // console.log('axios data received successfully.'); // The response data returned from the server.
    // console.log('exiting fetchLinkedHtml.');
    return response.data;
  } catch (error) {
    // console.log(`ERROR IN fetchLinkedHtml(): ${error}`);
    throw error;
  }
}

function extractLinkedInfo(html, companyName, country = 'Bahrain') {
  const $ = cheerio.load(html);

  const jobTitles = [];
  const jobLinks = [];
  const companies = [];
  const images = [];
  const timesPosted = [];

  const vacancies = [];

  $('.base-search-card__title').each((_, element) => {
    jobTitles.push($(element).text().trim());
  });

  // $('.base-search-card__subtitle a').each((index, element) => {
  $('.base-card__full-link').each((index, element) => {
    const link = $(element).attr('href');
    jobLinks.push(link);
  });

  $('.artdeco-entity-image').each((index, element) => {
    const link = $(element).attr('src');
    images.push(link);
  });

  // $('.base-search-card__subtitle').each((_, element) => {
  //   companies.push($(element).text().trim());
  // });

  $('.job-search-card__listdate').each((_, element) => {
    const time = $(element).text().trim();
    timesPosted.push(time);
  });

  for (let i = 0; i < jobTitles.length; i++) {
    const vacancy = {
      title: jobTitles[i],
      description: '',
      link: jobLinks[i],
      company: companyName,
      companyLogo: images[i],
      posted: timesPosted[i],
      country: country,
      lastUpdated: Date.now(),
    };

    vacancies.push(vacancy);
  }

  return vacancies;
}

async function fetchExtractJD(vacancies, maxDelay = 5000) {
  const fetchHtmlContent = async (link) => {
    await wait(Math.floor(maxDelay / 2), maxDelay);

    try {
      const response = await axios.get(link, {
        headers: axiosHeader,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const extractJD = async (html) => {
    const $ = cheerio.load(html);

    // $(
    //   '.show-more-less-html__markup show-more-less-html__markup--clamp-after-5'
    // ).each((_, element) => {
    //   jd = $(element).text().trim();
    // });
    const targetDiv = $(
      '.show-more-less-html__markup.show-more-less-html__markup--clamp-after-5'
    );
    const text = targetDiv.text().trim();

    return text;
  };

  const extractExtraInfo = async (html) => {
    const $ = cheerio.load(html);

    // const targetDiv = $(
    //   '.description__job-criteria-text.description__job-criteria-text--criteria'
    // );
    const targetDiv = $(
      '.description__job-criteria-text.description__job-criteria-text--criteria'
    );
    // seniority: String,
    //     employment: String,
    //     function: String,
    //     industries: String,
    return targetDiv
      .text()
      .trim()
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item !== '');
  };

  // console.log(`Running fetchExtractJD for vacancies[${vacancies.length}]:`);
  // console.log(vacancies);

  // Traverse the vacancies array and update each vacancy
  for (const vacancy of vacancies) {
    // console.log(`fetchExtractJD(): Traversing:`)
    // console.log(vacancy)
    if (vacancy.link) {
      const html = await fetchHtmlContent(vacancy.link);

      // console.log(html);
      vacancy.description = await extractJD(html);
      // console.log(
      //   `description for ${vacancy.company}->${vacancy.title}: ${vacancy.description}`
      // );
      extraInfo = await extractExtraInfo(html);
      vacancy.seniority = extraInfo[0];
      vacancy.employment = extraInfo[1];
      vacancy.function = extraInfo[2];
      vacancy.industries = extraInfo[3];

      // console.log(
      //   `seniority for ${vacancy.company}->${vacancy.title}: ${vacancy.seniority}`
      // );
    }
    // else {
    //   console.log('Vacancy detailed links is not available!!!');
    //   console.log(vacancy);
    // }
  }

  // console.log(`fetchExtractJD(): Traversing vacancies finished.`)
}

async function saveVacancies(vacancies) {
  if (vacancies.length) {
    try {
      // console.log(`Running saveVacancies(${vacancies.length}):`);
      // console.log(vacancies)

      for (let i = 0; i < vacancies.length; i++) {
        // console.log(`iteration ${i}:`)
        // console.log(
        //   `saveVacancies(): finding company for #${i} - ${vacancies[i].title}`
        // );
        // Check if the company already exists
        let company = await Company.findOne({
          name: vacancies[i].company,
        });

        // console.log(
        //   `saveVacancies(): company found ${company} - creating new one? (${
        //     !company && vacancies[i].company
        //   })`
        // );

        // If the company doesn't exist, create a new one
        // console.log(`saveVacancies(): Finding ${vacancies[i].company} with logo`);
        if (company && !company.image) {
          // update company
          await Company.findByIdAndUpdate(
            company._id,
            {
              image: vacancies[i].companyLogo,
            },
            {
              new: true,
              runValidators: true,
            }
          );
        } else if (!company && vacancies[i].company) {
          // creating new company
          company = await Company.create({
            name: vacancies[i].company,
            image: vacancies[i].companyLogo,
          });
        }

        // console.log(
        //   `saveVacancies(): Trying to finding '${vacancies[i].company}' -> '${vacancies[i].title}' in DB:`
        // );

        const vacancy = await Vacancy.findOne({
          title: vacancies[i].title,
          Company: company._id,
        });

        // console.log(`DB record found: ${vacancy}`);

        if (vacancy && vacancies[i].title) {
          // console.log(`DB Update of vacancy ${vacancies[i].title}:`);
          // console.log(vacancies[i]);
          await Vacancy.findByIdAndUpdate(
            vacancy._id,
            {
              description: vacancies[i].description,
              link: vacancies[i].link,
              country: vacancies[i].country,
              posted: vacancies[i].posted,
              seniority: vacancies[i].seniority,
              employment: vacancies[i].employment,
              function: vacancies[i].function,
              industries: vacancies[i].industries,
              lastUpdated: vacancies[i].lastUpdated || Date.now(),
            },
            {
              new: true,
              runValidators: true,
            }
          );
        } else {
          await Vacancy.create({
            title: vacancies[i].title,
            description: vacancies[i].description,
            link: vacancies[i].link,
            Company: company._id, // Use the ObjectId of the company
            country: vacancies[i].country,
            posted: vacancies[i].posted,
            seniority: vacancies[i].seniority,
            employment: vacancies[i].employment,
            function: vacancies[i].function,
            industries: vacancies[i].industries,
            lastUpdated: vacancies[i].lastUpdated || Date.now(),
          });
        }
      }
    } catch (error) {
      console.log(
        'saveVacancies(): Error Saving vacancy/company:',
        error.message
      );
      throw error;
    }
  }
}

exports.ScrapeVacancies = async (req, res) => {
  try {
    const name = req.query.name;
    const country = req.query.country || 'Bahrain';

    if (!name) {
      return res.status(404).json({
        status: 'fail',
        message: 'Company name is a required parameters.',
      });
    }

    // main logic
    // console.log('running fetchLinkedHtml():');
    const html = await fetchLinkedHtml(name, country);
    // console.log('running extractLinkedInfo():');
    const vacancies = extractLinkedInfo(html, name);
    // console.log('running fetchExtractJD():');
    fetchExtractJD(vacancies);
    // console.log(vacancies);

    // console.log('running saveVacancies():');

    await saveVacancies(vacancies);

    // Send Response
    res.status(200).json({
      status: 'success',
      results: vacancies.length,
      data: {
        vacancies,
      },
    });
  } catch (err) {
    // console.error('Error fetching data:', error);
    res.status(400).json({
      status: 'fail',
      message: err, //'Invalid data sent!',
    });
  }
};

exports.UpdateAllVacancies = async (req, res) => {
  // console.time('UpdateAllVacancies');
  try {
    const country = req.query.country || 'Bahrain';
    const allCompanies = await Company.find();
    const allVacancies = await Vacancy.find().populate('Company');
    const scrapedVacancies = [];
    const actions = [];

    //update existing records of vacancies
    for (const company of allCompanies) {
      // console.log('UpdateAllVacancies(): entering company loop...');
      // console.log(company);

      // console.log(
      //   `UpdateAllVacancies():fetchLinkedHtml(${company.name}, ${country})`
      // );
      const html = await fetchLinkedHtml(company.name, country);
      // console.log(
      //   `UpdateAllVacancies():extractLinkedInfo(HTML, ${company.name})`
      // );
      const vacs = extractLinkedInfo(html, company.name);

      // console.log(`UpdateAllVacancies():fetchExtractJD( vacs[${vacs.length}]`);
      await fetchExtractJD(vacs);

      // console.log(
      //   `UpdateAllVacancies::fetchExtractJD(${vacs.length}) finished.`
      // );
      // console.log(scrapedVacancies);
      vacs.forEach((vac) => {
        // console.log(`\t- ${vac.title} - ${vac.company} `);
        actions.push({
          title: vac.title,
          //description: vac.description,
          company: vac.company,
          seniority: vac.seniority,

          action: 'updated',
          ts: Date.now(),
        });
      });
      // console.log(
      //   `Complete UpdateAllVacancies().\nRunning await UpdateAllVacancies::saveVacancies[${vacs.length}] ...`
      // );
      // console.log(vacs);

      await saveVacancies(vacs);
      // console.log('saveVacancies() finished.\nAdding in ScrapedVacances[].')
      scrapedVacancies.push(...vacs);
      // console.log('Complete saveVancies().  Exiting UpdateAllVancancies()...');
      // console.log(vacs);
      // wait(100);
    }
    // wait(100);
    // console.log('==> UpdateAllVacancies() companies loop finished.');

    //Discover & Update vacancies if they no longer exists
    // console.log('\nChecking for disabled ....');
    for (const vacancy of allVacancies) {
      // console.log(`\t Checking if ${vacancy.title} is disabled...`);
      let equiv_scraped = scrapedVacancies.some(
        (vac) =>
          vac.title === vacancy.title && vac.company === vacancy.Company.name
      );

      // console.log('\t Result of vacancy = ');
      // console.log(`\t\t${!equiv_scraped && vacancy.enabled}`);

      if (!equiv_scraped && vacancy.enabled) {
        // console.log(`\tFound disabled vacancy for: ${vacancy.title}`);
        actions.push({
          title: vacancy.title,
          company: vacancy.Company.name,
          action: 'disabled',
          ts: Date.now(),
        });

        await Vacancy.findByIdAndUpdate(vacancy._id, {
          enabled: false,
        });
      }
    }

    // console.log('UpdateAllVacancies() finished.');
    // Send Response
    res.status(200).json({
      status: 'success',
      results: actions.length,
      data: {
        actions,
      },
    });
  } catch (err) {
    // console.log('UpdateAllVacancies() Error fetching data:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message, //'Invalid data sent!',
    });
  }
};
