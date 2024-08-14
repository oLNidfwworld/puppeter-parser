const puppeteer = require("puppeteer");
const fs = require('fs');

(async () => {
  const chromeWsPath =
    "ws://127.0.0.1:9222/devtools/browser/3b248b2f-4a36-4d92-aa02-6f0384e73e4d";
  // const browser = await puppeteer.connect({
  //   browserWSEndpoint: chromeWsPath,
  // });
    const browser = await puppeteer.launch({});
  const page = await browser.newPage(); 
  const productsSet = [];
  let itter = 1;
  await page.goto(`https://gzhel.ru/catalog/?PAGEN_1=${itter}`);

  while (true) {
    const productCards = await page.$$(".product__card");
 
    for (let i in productCards) { 
      const productCardTitle = await productCards[i].$eval(
        ".product__card--name",
        (element) => {
          return element.innerHTML.trim();
        }
      ); 
      productsSet.push(productCardTitle);   
    }
    console.log(`Current page is ${itter}. Array size is ${productsSet.length}`);

    const nextPageButton = await page.$("[data-button-next]"); 
    itter++; 
    if (nextPageButton) {
      await nextPageButton.click();
      await page.waitForNavigation();
    } else {
      console.log(itter);
      break;
    }
  }

  fs.writeFile('allProducts.json',  JSON.stringify(productsSet), ( error ) => {
    console.log(error);
  });
  
  await browser.close();
})();
