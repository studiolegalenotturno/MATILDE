(function(){
  "use strict";
  function lang(){ return document.documentElement.lang==="en"?"en":"it"; }
  const copy={
    it:{
      sending:"Invio in corso…",
      received:"Richiesta acquisita dal sistema di invio. Riceverai riscontro attraverso i recapiti indicati.",
      failed:"Non è stato possibile inviare la richiesta. Puoi utilizzare il collegamento email sottostante.",
      validation:"Verifica i campi obbligatori e il messaggio (almeno 10 caratteri).",
      retry:"Il servizio non è temporaneamente disponibile. Puoi inviare un'email direttamente.",
      fallback:"Apri il programma email per inviare il messaggio",
      privacy:"Conferma di aver preso visione dell'informativa privacy."
    },
    en:{
      sending:"Sending…",
      received:"Your request was accepted by the delivery service. We will reply using the contact details you supplied.",
      failed:"The request could not be delivered. Please use the email link below.",
      validation:"Check required fields and provide a message of at least 10 characters.",
      retry:"This service is temporarily unavailable. You can send an email directly.",
      fallback:"Open your email application to send your message",
      privacy:"Please confirm you have read the privacy notice."
    }
  };
  function label(key){return copy[lang()][key];}
  function mailboxLink(values){
    const subject=encodeURIComponent("Richiesta sito KTS - "+(values.service||"contatti"));
    const body=encodeURIComponent(
      "Nome: "+values.name+"\nEmail: "+values.email+"\nTelefono: "+values.telephone+
      "\nOrganizzazione: "+values.company+"\nServizio: "+values.service+
      "\n\n"+values.message
    );
    return "mailto:info@ktsadvisory.it?subject="+subject+"&body="+body;
  }
  function init(){
    const form=document.getElementById("kts-contact-form");
    if(!form) return;
    const button=form.querySelector('button[type="submit"]');
    const status=document.getElementById("kts-form-status");
    const fallback=document.getElementById("kts-form-fallback");
    form.addEventListener("submit",async function(event){
      event.preventDefault();
      if(!form.reportValidity()) return;
      const entries=new FormData(form);
      const data={
        name:String(entries.get("nome")||"").trim(),
        email:String(entries.get("email")||"").trim(),
        company:String(entries.get("azienda")||"").trim(),
        telephone:String(entries.get("telefono")||"").trim(),
        service:String(entries.get("servizio")||"").trim(),
        message:String(entries.get("messaggio")||"").trim(),
        website:String(entries.get("website")||""),
        privacyAcknowledged:entries.get("privacyAcknowledged")==="yes"
      };
      status.textContent="";
      fallback.hidden=true;
      if(data.name.length<3||data.message.length<10||!data.service){
        status.textContent=label("validation");return;
      }
      if(!data.privacyAcknowledged){
        status.textContent=label("privacy");return;
      }
      button.disabled=true;
      status.textContent=label("sending");
      const controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),12000);
      try{
        const response=await fetch("/api/contact",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          credentials:"same-origin",
          body:JSON.stringify(data),
          signal:controller.signal
        });
        let result={};
        try{result=await response.json();}catch(e){}
        if(!response.ok||result.ok!==true)throw new Error("NOT_DELIVERED");
        status.textContent=label("received");
        form.reset();
      }catch(error){
        status.textContent=label("retry");
        fallback.href=mailboxLink(data);
        fallback.textContent=label("fallback");
        fallback.hidden=false;
      }finally{
        clearTimeout(timeout);
        button.disabled=false;
      }
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
  else init();
})();