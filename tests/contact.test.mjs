import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const handler = (await import("data:text/javascript;base64," + fs.readFileSync(new URL("../api/contact.js", import.meta.url)).toString("base64"))).default;

function request(payload={}, overrides={}) {
  return {
    method:"POST",
    headers:{"origin":"https://www.ktsadvisory.it","content-type":"application/json","x-forwarded-for":"192.0.2.1",...overrides},
    body:payload
  };
}
function response() {
  return {
    code:200, headers:{},
    setHeader(k,v){this.headers[k]=v;return this;},
    status(code){this.code=code;return this;},
    json(body){this.body=body;return this;}
  };
}
const valid={
  name:"Test Esempio", email:"test@example.com",telephone:"",
  company:"",service:"corporate",message:"Richiesta di informazioni di prova.",website:"",
  privacyAcknowledged:true
};
test("contact endpoint rejects GET",async()=>{
  const req=request(valid);req.method="GET";
  const res=response();await handler(req,res);assert.equal(res.code,405);
});
test("contact endpoint rejects foreign origin",async()=>{
  const res=response();await handler(request(valid,{origin:"https://attacker.example"}),res);
  assert.equal(res.code,403);
});
test("contact endpoint rejects invalid email",async()=>{
  const res=response();await handler(request({...valid,email:"invalid"}),res);
  assert.equal(res.code,422);
});
test("contact endpoint requires privacy acknowledgement",async()=>{
  const res=response();await handler(request({...valid,privacyAcknowledged:false}),res);
  assert.equal(res.code,422);
});
test("contact endpoint refuses when delivery is unconfigured",async()=>{
  const keys=["RESEND_API_KEY","KTS_CONTACT_TO","KTS_CONTACT_FROM"];
  const prior=keys.map(k=>process.env[k]);keys.forEach(k=>delete process.env[k]);
  const res=response();await handler(request(valid,{"x-forwarded-for":"192.0.2.9"}),res);
  assert.equal(res.code,503);assert.equal(res.body.ok,false);
  keys.forEach((k,i)=>{if(prior[i]!==undefined)process.env[k]=prior[i]});
});
test("contact endpoint sanitises HTML and responds on verified provider response",async()=>{
  const previous=global.fetch;const prior=Object.fromEntries(["RESEND_API_KEY","KTS_CONTACT_TO","KTS_CONTACT_FROM"].map(k=>[k,process.env[k]]));
  process.env.RESEND_API_KEY="mock";process.env.KTS_CONTACT_TO="recipient@example.com";process.env.KTS_CONTACT_FROM="sender@example.com";
  let email;
  global.fetch=async(url,opts)=>{
    assert.equal(url,"https://api.resend.com/emails");
    email=JSON.parse(opts.body);return {ok:true,json:async()=>({id:"mock-message-id"})};
  };
  try{
    const res=response();await handler(request({...valid,message:"A <script> malicious </script> example message."},{"x-forwarded-for":"192.0.2.12"}),res);
    assert.equal(res.code,200);assert.equal(res.body.ok,true);
    assert.equal(email.html.includes("<script>"),false);
    assert.equal(email.html.includes("&lt;script&gt;"),true);
  }finally{
    global.fetch=previous;
    for(const [k,v] of Object.entries(prior)){if(v===undefined)delete process.env[k];else process.env[k]=v}
  }
});
test("client and cookie scripts are valid JavaScript",()=>{
  for(const path of ["assets/kts-cookie-consent.js","assets/kts-contact-form.js"]){
    assert.doesNotThrow(()=>new vm.Script(fs.readFileSync(path,"utf8"),{filename:path}));
  }
});
test("site has metadata, consent resources and no broken local HTML links",()=>{
  const pages=["index.html","about.html","studio.html","approccio.html","attivita.html",
    "contatti.html","lavora-con-noi.html","private-market.html","privacy-policy.html","cookie-policy.html"];
  const set=new Set(pages);
  for(const page of pages){
    const html=fs.readFileSync(page,"utf8");
    assert.match(html,/<meta name="description"/);
    assert.match(html,/<link rel="canonical"/);
    assert.match(html,/assets\/kts-cookie-consent\.js/);
    assert.match(html,/assets\/kts-cookie-consent\.css/);
    for(const match of html.matchAll(/href=["']([^"']+\.html)(?:[?#][^"']*)?["']/g))
      if(!/^https?:\/\//.test(match[1])) assert.ok(set.has(match[1]),page+" -> "+match[1]);
  }
  const contatti=fs.readFileSync("contatti.html","utf8");
  assert.doesNotMatch(contatti,/<iframe\b[^>]*\ssrc\s*=/i);
  assert.match(contatti,/data-kts-map-src/);
  assert.match(contatti,/kts-contact-form\.js/);
});
