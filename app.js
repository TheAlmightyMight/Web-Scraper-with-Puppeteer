import puppeteer from "puppeteer";
import { sendMail } from "./mailer.js";
import DataBase from "./db.js";

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://hh.ru/search/vacancy?employment=probation&professional_role=96&schedule=remote&search_field=name&search_field=company_name&search_field=description&text=js&from=suggest_post&clusters=true&no_magic=true&ored_clusters=true&enable_snippets=true"
  );

  const amount = await page.$$eval(".serp-item", (options) => {
    return options.length;
  });

  const headings = await page.$$eval(".serp-item__title", (options) => {
    return options.map((el) => el.textContent);
  });

  const descriptions = await page.$$eval(
    "div[data-qa='vacancy-serp__vacancy_snippet_requirement']",
    (options) => {
      return options.map((el) => el.children[0].children[0].textContent);
    }
  );

  const results = [];
  for (let i = 0; i < amount; i++) {
    results.push({ title: headings[i], description: descriptions[i] });
  }

  const db = new DataBase();
  const info = await db.connectAndCompare(results);

  const markUp = `<section>
    <h1>Report for new vacancies on hh.ru</h1>
    <p>There are currently ${amount} vacancies that satisfy your request ${
    info.difference > 0
      ? "of which" + info.newVacancies.length + "are new ones"
      : ""
  }.</p>
    <h2>New records are:</h2>
    <ul>
    ${(() => {
      const arr = [];

      if (info.newVacancies.length !== 0) {
        for (let i = 0; i < info.newVacancies.length; i++) {
          arr.push(`<li>
              <h3>Title: ${info.newVacancies[i].title}</h3>
              <p>Info: ${info.newVacancies[i].description}</p>
            </li>`);
        }
        return arr.join("");
      } else {
        return "<li><p>There are none.</p></li>";
      }
    })()}
  </ul>
  <h2>Others:</h2>
    <ul>
      ${(() => {
        const arr = [];
        for (let i = 0; i < amount; i++) {
          arr.push(`<li>
              <h3>Title: ${headings[i]}</h3>
              <p>Info: ${descriptions[i]}</p>
            </li>`);
        }
        return arr.join("");
      })()}
    </ul>
    </section>`;

  sendMail(markUp);

  await browser.close();
};

const interval = (hours) => {
  main();
  return 1000 * 60 * 60 * hours;
};

setInterval(() => {
  main();
}, interval(3));
