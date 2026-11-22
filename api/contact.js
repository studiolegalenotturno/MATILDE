// KTS Advisory - endpoint contatti senza storage permanente.
// Secrets richiesti: RESEND_API_KEY, KTS_CONTACT_TO, KTS_CONTACT_FROM.
const LIMITS = { name: 120, company: 120, email: 254, telephone: 40, service: 80, message: 4000 };
const windowMs = 15 * 60 * 1000;
const maxRequests = 4;
const recent = new Map(); // Best effort per istanza. Attivare limiti distribuiti/WAF prima del rilascio.
const services = new Set(["corporate","executive","realestate","aste","partnership","other"]);
function throttle(ip) {
  const now = Date.now();
  const active = (recent.get(ip)||[]).filter(ts=>now-ts<windowMs);
  active.push(now); recent.set(ip,active);
  if (recent.size>1000) for (const [key,values] of recent) {
    if (!values.some(ts=>now-ts<windowMs)) recent.delete(key);
  }
  return active.length<=maxRequests;
}
function field(value, max) {
  return typeof value==="string" && value.trim().length<=max ? value.trim() : null;
}
function htmlEscape(value) {
  return String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function response(res,status,result) {
  res.setHeader("Cache-Control","no-store");
  res.setHeader("Content-Type","application/json; charset=utf-8");
  return res.status(status).json(result);
}
export default async function handler(req,res) {
  res.setHeader("Allow","POST");
  res.setHeader("X-Content-Type-Options","nosniff");
  if (req.method!=="POST") return response(res,405,{ok:false,error:"METHOD_NOT_ALLOWED"});
  const origin=String(req.headers.origin||"");
  const allowed=/^https:\/\/(www\.)?ktsadvisory\.it$/i.test(origin)
    || (/^https:\/\/matilde-[a-z0-9-]+\.vercel\.app$/i.test(origin) && process.env.VERCEL_ENV==="preview");
  if (!allowed) return response(res,403,{ok:false,error:"INVALID_ORIGIN"});
  if (!String(req.headers["content-type"]||"").toLowerCase().startsWith("application/json"))
    return response(res,415,{ok:false,error:"INVALID_CONTENT_TYPE"});
  if (Number(req.headers["content-length"]||0)>12000)
    return response(res,413,{ok:false,error:"PAYLOAD_TOO_LARGE"});
  const body=req.body && typeof req.body==="object" && !Array.isArray(req.body) ? req.body : null;
  if (!body) return response(res,400,{ok:false,error:"INVALID_BODY"});
  if (body.website) return response(res,200,{ok:true}); // Honeypot
  const name=field(body.name,LIMITS.name),company=field(body.company,LIMITS.company);
  const email=field(body.email,LIMITS.email),telephone=field(body.telephone,LIMITS.telephone);
  const service=field(body.service,LIMITS.service),message=field(body.message,LIMITS.message);
  if (!name || name.length<3 || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      || !message || message.length<10 || company===null || telephone===null
      || !services.has(service) || body.privacyAcknowledged!==true)
    return response(res,422,{ok:false,error:"VALIDATION_FAILED"});
  const ip=String(req.headers["x-forwarded-for"]||"unknown").split(",")[0].trim().slice(0,64);
  if (!throttle(ip)) return response(res,429,{ok:false,error:"RATE_LIMITED"});
  const key=process.env.RESEND_API_KEY,from=process.env.KTS_CONTACT_FROM,to=process.env.KTS_CONTACT_TO;
  if (!key || !from || !to) return response(res,503,{ok:false,error:"DELIVERY_UNAVAILABLE"});
  const subject="Nuova richiesta dal sito KTS - "+service.replace(/[\r\n]/g," ");
  const html=[
    ["Nome",name],["Email",email],["Telefono",telephone],
    ["Organizzazione",company],["Servizio",service],["Messaggio",message]
  ].map(pair=>"<p><strong>"+htmlEscape(pair[0])+":</strong> "+htmlEscape(pair[1]).replace(/\n/g,"<br>")+"</p>").join("");
  try {
    const remote=await fetch("https://api.resend.com/emails",{
      method:"POST",
      headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},
      body:JSON.stringify({from,to:[to],reply_to:email,subject,html})
    });
    if (!remote.ok) return response(res,502,{ok:false,error:"DELIVERY_FAILED"});
    const delivery=await remote.json();
    if (!delivery.id) return response(res,502,{ok:false,error:"DELIVERY_UNCONFIRMED"});
    return response(res,200,{ok:true});
  } catch (error) {
    return response(res,502,{ok:false,error:"DELIVERY_FAILED"});
  }
}
