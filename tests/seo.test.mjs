import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync, existsSync} from "node:fs";
import {join} from "node:path";

const root = process.cwd();
const base = "https://www.ktsadvisory.it/";
const pages = [
  ["consulenza-ma-operazioni-straordinarie.html","Consulenza M&amp;A"],
  ["finanza-impresa-rating-factoring.html","Finanza d'impresa"],
  ["assistenza-aste-giudiziarie.html","Assistenza aste giudiziarie"],
];
const read = name => readFileSync(join(root,name),"utf8");

for(const [file,title] of pages){
  test("SEO landing: "+file,()=>{
    const html = read(file);
    assert.match(html,/<!doctype html>/i);
    assert.match(html,/<html lang="it">/i);
    assert.match(html,new RegExp('<title>[^<]*'+title.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i"));
    assert.match(html,/<meta name="description" content="[^"]{80,200}">/i);
    assert.match(html,/<h1[ >]/i);
    assert.match(html,/<main\s+id="contenuto">/i);
    assert.match(html,/<a[^>]+href="contatti.html"/i);
    assert.match(html,/<meta name="robots" content="index,follow,max-image-preview:large">/);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/);
    assert.equal(canonical?.[1],base+file);
    const jsonld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(jsonld,"Missing structured data");
    const graph = JSON.parse(jsonld[1]);
    assert.equal(graph["@graph"][0].url,base+file);
    assert.ok(html.includes('assets/kts-cookie-consent.js'),"Keep consent widget");
    assert.doesNotMatch(html,/crisi d.impresa|crisi di impresa/i,"Excluded SEO topic");
  });
}

test("sitemap and internal links include all specialist pages",()=>{
  const sitemap = read("sitemap.xml");
  const activities = read("attivita.html");
  for(const [file] of pages){
    assert.ok(sitemap.includes(base+file),"Missing sitemap "+file);
    assert.ok(activities.includes('href="'+file+'"'),"Missing service link "+file);
    assert.ok(existsSync(join(root,file)),"Missing target page "+file);
  }
  assert.equal([...sitemap.matchAll(/<url>/g)].length,16);
  assert.ok(activities.includes('seoHubReadMore'),"Missing translation key");
  assert.ok(activities.includes('seoHubAuctionsTitle'));
});

test("SEO landing assets and existing navigation are preserved",()=>{
  assert.ok(existsSync(join(root,"assets/kts-seo-landing.css")));
  assert.ok(existsSync(join(root,"assets/kts-cookie-consent.js")));
  assert.ok(read("index.html").includes('href="attivita.html"'));
  assert.ok(read("robots.txt").includes("Sitemap: https://www.ktsadvisory.it/sitemap.xml"));
});

// Keep the exact Search Console verification token public at its original path.
// Removing or editing this file may invalidate Google ownership verification.
test("Google Search Console verification file remains unchanged",()=>{
  const file="google60132d2233694167.html";
  assert.ok(existsSync(join(root,file)),"Google ownership file must remain at site root");
  assert.equal(read(file),"google-site-verification: google60132d2233694167.html");
});

const guides = [
  ["guida-asta-immobiliare-verifiche-prima-offerta.html","assistenza-aste-giudiziarie.html","Aste immobiliari: 10 verifiche"],
  ["analisi-centrale-rischi-imprese.html","finanza-impresa-rating-factoring.html","Analisi Centrale dei Rischi"],
  ["due-diligence-acquisto-azienda-checklist.html","consulenza-ma-operazioni-straordinarie.html","Due diligence acquisizione azienda"],
];
for(const [guide,parent,keyword] of guides){
  test("National specialist guide: "+guide,()=>{
    const html = read(guide);
    assert.ok(html.includes('<title>'+keyword));
    assert.ok(html.includes('<link rel="canonical" href="'+base+guide+'">'));
    assert.equal([...html.matchAll(/<li><div><strong>/g)].length,10,"Expect 10 substantive checks");
    assert.ok(html.includes('href="'+parent+'"'));
    assert.ok(html.includes('href="contatti.html"'));
    assert.ok(html.includes("assets/kts-cookie-consent.js"));
    assert.doesNotMatch(html,/crisi d.impresa|crisi di impresa/i);
    const opening = '<script type="application/ld+json">';
    const begin = html.indexOf(opening);
    assert.ok(begin >= 0,"Missing JSON-LD script");
    const schema = JSON.parse(html.slice(begin+opening.length,html.indexOf('</script>',begin)));
    assert.equal(schema["@graph"][0].url,base+guide);
    assert.ok(read(parent).includes('href="'+guide+'"'),"Parent service must link to the guide");
    assert.ok(read("sitemap.xml").includes(base+guide),"Sitemap must link to guide");
  });
}

test("Brand structured data and priority homepage links",()=>{
  const html=read("index.html");
  const opening='<script type="application/ld+json">';
  const begin=html.indexOf(opening);
  const block=begin===-1?null:[null,html.slice(begin+opening.length,html.indexOf('</script>',begin))];
  assert.ok(block,"Homepage requires explicit WebSite identity");
  const schema=JSON.parse(block[1]);
  assert.equal(schema["@type"],"WebSite");
  assert.equal(schema.name,"KTS Advisory");
  assert.equal(schema.url,base);
  for(const [file] of pages)assert.ok(html.includes('href="'+file+'"'),"Homepage service link: "+file);
  assert.ok(html.includes('seoHomeHeading'),"Ensure bilingual homepage section");
  assert.equal(read("privacy-policy.html").split("<h1").length-1,1,"Privacy page must have a single H1");
});

test("Audited SEO descriptions fit concise snippet guidance",()=>{
  for(const file of ["finanza-impresa-rating-factoring.html","assistenza-aste-giudiziarie.html"]){
    const value=read(file).match(/<meta name="description" content="([^"]+)">/);
    assert.ok(value);
    assert.ok(value[1].length <= 160,file+" description length: "+value[1].length);
  }
});
