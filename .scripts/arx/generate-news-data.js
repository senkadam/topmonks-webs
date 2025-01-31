const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const origNews = [
  {
    date: "2020-05-15",
    title:
      "ARX Equity Partners nominated for the Central and Eastern Europe Deal of the Year Award and the Nagrody PSIK Private Equity Deal of the Year Award",
    link:
      "https://www.arxequity.com/arx-equity-partners-nominated-for-the-central-and-eastern-europe-deal-of-the-year-award-and-the-nagrody-psik-private-equity-deal-of-the-year-award/"
  },
  {
    date: "2020-03-26",
    title: "ARX Equity Partners Exits DC Bled for 3.6x",
    link:
      "https://www.arxequity.com/arx-equity-partners-exits-dc-bled-for-3-6x/"
  },
  {
    date: "2019-10-16",
    title:
      "ARX Equity Partners completes acquisition of Czech engineering business TES Vsetin",
    link:
      "https://www.arxequity.com/arx-equity-partners-completes-acquisition-of-czech-engineering-business-tes-vsetin-2019-10-15/"
  },
  {
    date: "2019-08-12",
    title: "ARX Equity Partners exits Anwis",
    link: "https://www.arxequity.com/arx-equity-partners-exits-anwis/"
  },
  {
    date: "2019-08-08",
    title:
      "Sava Re d.d. announces agreement to acquire Diagnostični center Bled d.o.o.",
    link:
      "https://www.arxequity.com/sava-re-d-d-announces-agreement-to-acquire-diagnosticni-center-bled-d-o-o/"
  },
  {
    date: "2019-06-18",
    title: "Warema files for approval to acquire Anwis",
    link:
      "https://www.arxequity.com/warema-files-for-approval-to-acquire-anwis/"
  },
  {
    date: "2019-04-25",
    title:
      "ARX Equity Partners wins the 2019 Central and Eastern Europe Deal of the Year Award",
    link:
      "https://www.arxequity.com/arx-equity-partners-wins-the-2019-central-and-eastern-europe-deal-of-the-year-award/"
  },
  {
    date: "2019-04-01",
    title:
      "ARX Equity Partners completes acquisition of two Czech facades businesses",
    link:
      "https://www.arxequity.com/arx-equity-partners-completes-acquisition-of-two-czech-facades-businesses/"
  },
  {
    date: "2019-03-29",
    title: "DC Bled continues its expansion with the acquisition of Fontana",
    link:
      "https://www.arxequity.com/dc-bled-continues-its-expansion-with-the-acquisition-of-fontana/"
  },
  {
    date: "2018-10-22",
    title: "ARX Equity Partners completes sale of Fincentrum to Swiss Life",
    link:
      "https://www.arxequity.com/arx-equity-partners-completes-sale-of-fincentrum-to-swiss-life/"
  },
  {
    date: "2018-09-04",
    title: "ARX portfolio company Fincentrum acquired by the Swiss Life Group",
    link:
      "https://www.arxequity.com/arx-portfolio-company-fincentrum-acquired-by-the-swiss-life-group/"
  },
  {
    date: "2018-08-01",
    title: "DC Bled completes second diagnostic clinic acquisition",
    link:
      "https://www.arxequity.com/dc-bled-completes-second-diagnostic-clinic-acquisition/"
  },
  {
    date: "2018-07-02",
    title:
      "ARX Equity Partners completes buyout of Hungarian mobile device repair business",
    link:
      "https://www.arxequity.com/arx-equity-partners-completes-buyout-of-hungarian-mobile-device-repair-business/"
  },
  {
    date: "2018-04-03",
    title: "ARX Equity Partners Exits VUES",
    link: "https://www.arxequity.com/arx-equity-partners-exits-vues/"
  },
  {
    date: "2018-02-19",
    title: "Moog Announces Agreement to Acquire VUES",
    link: "https://www.arxequity.com/moog-announces-agreement-acquire-vues/"
  },
  {
    date: "2017-10-05",
    title: "ARX Equity Partners Exits KVK Holding",
    link: "https://www.arxequity.com/arx-equity-partners-exits-kvk-holding/"
  },
  {
    date: "2017-09-05",
    title: "ARX portfolio company KVK Holding acquired by Sika",
    link:
      "https://www.arxequity.com/arx-portfolio-company-kvk-holding-acquired-sika/"
  },
  {
    date: "2017-08-22",
    title: "ARX exits Manag a.s.",
    link: "https://www.arxequity.com/arx-exits-manag-s/"
  },
  {
    date: "2017-01-31",
    title: "ARX Equity Partners acquires Czech baby food producer",
    link:
      "https://www.arxequity.com/arx-equity-partners-acquires-czech-baby-food-producer/"
  },
  {
    date: "2016-09-01",
    title: "DC Bled makes first add-on in Slovenia",
    link: "https://www.arxequity.com/dc-bled-makes-first-add-slovenia/"
  },
  {
    date: "2016-07-11",
    title:
      "ARX CEE IV holds first close towards € 100 million target, supported by the EU COSME programme",
    link:
      "https://www.arxequity.com/arx-cee-iv-holds-first-close-towards-e-100-million-target-supported-by-the-eu-cosme-programme/"
  },
  {
    date: "2016-04-18",
    title: "ARX exits Tomplast d.o.o.",
    link: "https://www.arxequity.com/arx-exits-tomplast-d-o-o/"
  },
  {
    date: "2015-11-09",
    title:
      "Brian Wardrop named Private Equity Professional of the last 20 years in Czech Republic",
    link:
      "https://www.arxequity.com/brian-wardrop-named-private-equity-professional-of-the-last-20-years-in-czech-republic/"
  },
  {
    date: "2015-04-03",
    title:
      "Jaroslav Horak named EY Entrepreneur Of The Year Nominee in Czech Republic",
    link:
      "https://www.arxequity.com/jaroslav-horak-named-ey-entrepreneur-of-the-year-nominee-in-czech-republic/"
  },
  {
    date: "2015-03-16",
    title: "ARX Equity Partners acquires Slovenian healthcare provider",
    link:
      "https://www.arxequity.com/arx-equity-partners-acquires-slovenian-healthcare-provider-3/"
  },
  {
    date: "2015-01-16",
    title: "ARX exits Lanex a.s.",
    link: "https://www.arxequity.com/arx-exits-lanex-a-s/"
  },
  {
    date: "2015-01-15",
    title: "ARX has completed the exit of its Kakadu investment",
    link:
      "https://www.arxequity.com/arx-has-completed-the-exit-kakadu-investment/"
  },
  {
    date: "2014-08-21",
    title: "ARX acquires ANWIS Polska",
    link: "https://www.arxequity.com/arx-acquires-anwis-polska/"
  },
  {
    date: "2014-06-04",
    title:
      "Jacek Korpala named Private Equity Personality of the Year 2013 in Poland",
    link:
      "https://www.arxequity.com/jacek-korpala-named-private-equity-personality-of-the-year-2013-in-poland/"
  },
  {
    date: "2014-02-10",
    title: "ARX and Darby acquire Gramex Kft.",
    link: "https://www.arxequity.com/arx-and-darby-acquire-gramex-kft/"
  },
  {
    date: "2013-12-19",
    title: "ARX Equity Partners Fully Exits Ergis-Eurofilms",
    link:
      "https://www.arxequity.com/arx-equity-partners-fully-exits-ergis-eurofilms/"
  },
  {
    date: "2013-04-08",
    title: "Unilever Czech Republic acquires SAVO brand",
    link:
      "https://www.arxequity.com/unilever-czech-republic-acquires-savo-brand/"
  },
  {
    date: "2013-04-05",
    title: "ARX Equity Partners invests in Fincentrum a.s.",
    link:
      "https://www.arxequity.com/arx-equity-partners-invests-in-fincentrum-a-s/"
  },
  {
    date: "2012-12-17",
    title: "Moonray Healthcare acquires Lexum",
    link: "https://www.arxequity.com/moonray-healthcare-acquires-lexum/"
  },
  {
    date: "2011-06-28",
    title: "ARX Equity Partners acquires Manag",
    link: "https://www.arxequity.com/arx-equity-partners-acquires-manag/"
  },
  {
    date: "2010-12-20",
    title: "ARX investment in CS Recycling",
    link: "https://www.arxequity.com/arx-investment-in-cs-recycling/"
  },
  {
    date: "2010-11-02",
    title:
      "ARX Equity Partners joins Benson Oak Capital as investor in Bochemie",
    link:
      "https://www.arxequity.com/arx-equity-partners-joins-benson-oak-capital-as-investor-in-bochemie/"
  },
  {
    date: "2010-09-04",
    title: "ARX acquires Krkonošské vápenky Kunčice a.s.",
    link:
      "https://www.arxequity.com/arx-acquires-krkonosske-vapenky-kuncice-a-s/"
  },
  {
    date: "2010-01-21",
    title:
      "ARX supports its portfolio company Lexum in the acquisition of Intermedica",
    link:
      "https://www.arxequity.com/arx-supports-its-portfolio-company-lexum-in-the-acquisition-of-intermedica/"
  },
  {
    date: "2009-10-08",
    title: "ARX completes € 102 M second close of ARX III",
    link:
      "https://www.arxequity.com/arx-completes-e-102-m-second-close-of-arx-iii/"
  },
  {
    date: "2009-04-23",
    title:
      "Professor Martin Filipec partners with ARX to acquire 100% of the Lexum Group",
    link:
      "https://www.arxequity.com/professor-martin-filipec-partners-with-arx-to-acquire-100-of-the-lexum-group/"
  },
  {
    date: "2009-03-06",
    title: "ARX acquires controlling stake in Kakadu",
    link: "https://www.arxequity.com/arx-acquires-controlling-stake-in-kakadu/"
  },
  {
    date: "2008-10-26",
    title:
      "ARX acquires Lanex, Singing Rock and successfully exits Donit Tesnit",
    link:
      "https://www.arxequity.com/arx-acquires-lanex-singing-rock-and-successfully-exits-donit-tesnit/"
  },
  {
    date: "2008-09-20",
    title: "ARX holds first close of ARX CEE III LP",
    link: "https://www.arxequity.com/arx-holds-first-close-of-arx-cee-iii-lp/"
  },
  {
    date: "2008-04-05",
    title:
      "ARX supports its portfolio company Tomplast in the add-on acquisition of Unitplast",
    link:
      "https://www.arxequity.com/arx-supports-its-portfolio-company-tomplast-in-the-add-on-acquisition-of-unitplast/"
  },
  {
    date: "2008-02-07",
    title: "Axon Leasing and Finance Zrt. Attracts blue-chip investors",
    link:
      "https://www.arxequity.com/axon-leasing-and-finance-zrt-attracts-blue-chip-investors/"
  },
  {
    date: "2007-07-06",
    title:
      "DBG acquires controlling interest in Slovenian plastic components producer Tomplast",
    link:
      "https://www.arxequity.com/dbg-acquires-controlling-interest-in-slovenian-plastic-components-producer-tomplast/"
  },
  {
    date: "2007-07-02",
    title: "Companies controlled by DBG merged: Erigs S.A. and Eurofilms S.A",
    link:
      "https://www.arxequity.com/companies-controlled-by-dbg-merged-erigs-s-a-and-eurofilms-s-a/"
  },
  {
    date: "2006-08-17",
    title:
      "DBG and 3TS acquire controlling interest in Polish children’s clothing retailer Komex",
    link:
      "https://www.arxequity.com/dbg-and-3ts-acquire-controlling-interest-in-polish-childrens-clothing-retailer-komex/"
  },
  {
    date: "2006-06-07",
    title:
      "DBG has indirectly sold its 17% shareholding in Eurofilms during its IPO",
    link:
      "https://www.arxequity.com/dbg-has-indirectly-sold-its-17-shareholding-in-eurofilms-during-its-ipo/"
  },
  {
    date: "2006-04-26",
    title: "DBG acquires controlling interest in VUES Brno",
    link: "https://www.arxequity.com/4-2/"
  },
  {
    date: "2006-01-11",
    title: "DBG exchanges its participation in Flanco for shares in Flamingo",
    link: "https://www.arxequity.com/3-2/"
  },
  {
    date: "2003-08-27",
    title: "Management buy out of Ergis",
    link:
      "https://www.arxequity.com/arx-equity-partners-acquires-slovenian-healthcare-provider-2/"
  },
  {
    date: "2003-01-28",
    title: "DBG Eastern Europe Announces first close of fund II",
    link:
      "https://www.arxequity.com/arx-equity-partners-acquires-slovenian-healthcare-provider/"
  },
  {
    date: "2000-07-17",
    title: "DBG Fund sold Czech On Line at a record price",
    link: "https://www.arxequity.com/5-2/"
  }
];

async function getContent(link) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link);
  const content = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("section.post-content p"))
      .map(x => x.innerText)
      .join("/n/n");
  });

  await browser.close();
  return content;
}

(async () => {
  for (let news of origNews) {
    const { title, date, link } = news;
    const content = await getContent(link);
    const markdown = `---
title: ${title}
date: ${date}
originalUrl: ${link}
image:
---

${content}
`;
    fs.writeFileSync(
      path.resolve(`./arx.monks.cloud/src/data/news/${date}.md`),
      markdown
    );
  }
})();
