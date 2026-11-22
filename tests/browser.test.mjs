import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
const { chromium } = await import("../.ci-deps/node_modules/playwright/index.mjs");
const base="http://127.0.0.1:8765";
const server=spawn("python3",["-m","http.server","8765","--bind","127.0.0.1"],{stdio:"ignore"});
async function waitServer(){
  for(let i=0;i<35;i++){
    try{const r=await fetch(base+"/index.html");if(r.ok)return;}catch(e){}
    await new Promise(resolve=>setTimeout(resolve,250));
  }
  throw new Error("static server did not start");
}
let browser;
test.before(async()=>{
  await waitServer();
  browser=await chromium.launch({headless:true});
});
test.after(async()=>{
  await browser?.close();
  server.kill("SIGTERM");
});
test("consent rejects map preloading and can be revoked",async()=>{
  const context=await browser.newContext({viewport:{width:1280,height:800}});
  await context.route(/fonts\.googleapis\.com|fonts\.gstatic\.com/,r=>r.abort());
  await context.route(/www\.google\.com\/maps/,r=>r.abort());
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto(base+"/contatti.html");
  await page.locator(".kts-cookie-banner").waitFor({state:"visible"});
  assert.equal(await page.locator(".google-map iframe").getAttribute("src"),null);
  await page.getByRole("button",{name:"Rifiuta",exact:true}).click();
  assert.equal(await page.locator(".google-map iframe").getAttribute("src"),null);
  await page.locator("#kts-map-activate").click();
  assert.match(await page.locator(".google-map iframe").getAttribute("src"),/google\.com\/maps/);
  await page.getByRole("button",{name:"Gestisci cookie"}).click();
  await page.locator("#kts-maps-choice").uncheck();
  await page.getByRole("button",{name:"Salva preferenze"}).click();
  assert.equal(await page.locator(".google-map iframe").getAttribute("src"),null);
  assert.equal(errors.length,0,"uncaught page errors "+errors.join(", "));
  await context.close();
});
test("IT/EN navigation translates service descriptions",async()=>{
  const context=await browser.newContext({viewport:{width:1280,height:800}});
  await context.route(/fonts\.googleapis\.com|fonts\.gstatic\.com/,r=>r.abort());
  const page=await context.newPage();
  await page.goto(base+"/attivita.html");
  await page.locator('[data-lang-switch="en"]').first().click();
  assert.equal(await page.locator(".service-list .service-title").first().textContent(),"M&A and extraordinary transactions");
  assert.equal(await page.locator("html").getAttribute("lang"),"en");
  await page.locator('[data-lang-switch="it"]').first().click();
  assert.match(await page.locator(".service-list .service-title").first().textContent(),/M&A e operazioni/);
  await context.close();
});
test("contact form exposes fallback if delivery is unavailable",async()=>{
  const context=await browser.newContext({viewport:{width:390,height:844}});
  await context.route(/fonts\.googleapis\.com|fonts\.gstatic\.com/,r=>r.abort());
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto(base+"/contatti.html");
  await page.getByRole("button",{name:"Rifiuta",exact:true}).click();
  await page.locator('[name="nome"]').fill("Utente di Test");
  await page.locator('[name="email"]').fill("utente@example.com");
  await page.locator('[name="servizio"]').selectOption("corporate");
  await page.locator('[name="messaggio"]').fill("Messaggio sintetico di collaudo.");
  await page.locator('[name="privacyAcknowledged"]').check();
  await page.locator('#kts-contact-form button[type="submit"]').click();
  await page.locator("#kts-form-fallback").waitFor({state:"visible"});
  assert.match(await page.locator("#kts-form-fallback").getAttribute("href"),/^mailto:info@ktsadvisory\.it/);
  assert.equal(errors.length,0,"uncaught page errors "+errors.join(", "));
  await context.close();
});