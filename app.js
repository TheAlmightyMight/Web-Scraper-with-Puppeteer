import puppeteer from "puppeteer";
import { sendMail } from "./mailer.js";

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

  const markUp = `<section>
    <h1>Report for new vacancies on hh.ru</h1>
    <p>There are currently ${amount} vacancies that satisfy your request.</p>
    <h2>New records are:</h2>
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

  //   await page.screenshot({ path: "screenshot.png", fullPage: true });

  await browser.close();
};

main();
