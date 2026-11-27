# KTS Advisory — SEO nazionale, fase 2 — 27 novembre 2026

## Ambito e principi
KTS Advisory è un progetto professionale dei tre fondatori, non una SRL. Mercato: **Italia intera**, senza pagine geografiche artificiali. **Crisi d'impresa esclusa dal piano SEO**. Nessuna dichiarazione di risultati economici, posizionamenti garantiti o attività riservate svolte da soggetti privi di abilitazione.

Obiettivo: migliorare la pertinenza e l'utilità delle pagine su tre percorsi commerciali (operazioni M&A, finanza d'impresa e aste giudiziarie). La conversione finale da misurare è il contatto qualificato e l'incarico, non il volume di visite indiscriminato.

## Evidenze raccolte

### Google Search Console
- Proprietà con prefisso URL `https://www.ktsadvisory.it/`, account verificato.
- Al 27/11/2026, 13 URL originari tutti indicizzati in Search Console; le tre pagine commerciali pubblicate il 26/11 risultano indicizzate dal 27/11.
- Query e pagine Search Console interrogate per 28 giorni: **nessuna riga di performance restituita**; non attribuire impressioni, CTR, clic o posizione media non osservati.
- La presenza nell'indice non equivale al ranking su keyword.

### Keyword research OpenSEO, Italia / italiano
Stime mensili indicative, non dati proprietari Google Search Console né promesse di traffico:
- `consulenza aste immobiliari`: **140** ricerche / mese, keyword difficulty riportata 0 (dato fragile e non prova assenza di concorrenza).
- `finanza agevolata imprese`: **90** ricerche / mese, KD 23.
- `consulenza m&a`: **50** ricerche / mese, KD non disponibile.
- `come partecipare asta immobiliare`: **50** ricerche / mese, KD 0.
- `advisor m&a`: **40** ricerche / mese, KD 0.
- `analisi centrale rischi`: **40** ricerche / mese, KD 8.
- `assistenza aste giudiziarie`: **40** ricerche / mese, KD 42.
- `consulenza finanziaria imprese`: **20** ricerche / mese, KD 43.
- `assistenza aste immobiliari`: **20** ricerche / mese, KD non disponibile.
- `anticipo fatture pro solvendo`: **10** ricerche / mese, KD non disponibile.
- `consulenza internazionalizzazione imprese`: **10** ricerche / mese, KD non disponibile.
- `due diligence acquisizione azienda`: **10** ricerche / mese, KD non disponibile.

**Nota:** la chiamata ha restituito metriche per 12 delle 27 keyword richieste. Le altre query sono senza metriche restituite; non equivalgono a zero ricerche.

### SERP esplorative
- Ricerche nazionali eseguite su `consulenza aste immobiliari`, `analisi centrale rischi`, `advisor m&a`, oltre alla verifica precedente del marchio e delle keyword generiche.
- I risultati sono unione di letture multiple automatizzate, potenzialmente soggetti a variazioni geografiche e temporali. Le posizioni non devono essere presentate come ranking storico del sito KTS. Non è stato osservato KTS nelle prime venti posizioni delle tre query commerciali precedentemente esaminate.

### Audit tecnico prima dell'intervento
Audit OpenSEO `0d6136bf-e7f0-4c6f-8ed1-df2f36fe4eb5`: completato, **15 URL** esaminati. Nessun errore critico, quattro segnalazioni:
1. `privacy-policy.html`: due titoli H1, warning.
2. `assistenza-aste-giudiziarie.html`: descrizione meta troppo lunga, info.
3. `finanza-impresa-rating-factoring.html`: descrizione meta troppo lunga, info.
4. `index.html`: canonical diretto a `/`, info (comportamento intenzionale; **non da correggere**).
Nessun link interno rotto segnalato.

## Interventi sviluppati nella fase 2

1. **Identità del marchio:** markup `WebSite` su `index.html`, `name: KTS Advisory`, `url` canonico e `alternateName` con dominio. Non si dichiara KTS una società costituita.
2. **Collegamenti principali:** sezione non invasiva homepage → tre pagine servizi, con traduzioni IT/EN nel selettore già presente.
3. **Guide con contenuto pratico, non ripetitivo:**
   - `guida-asta-immobiliare-verifiche-prima-offerta.html`: 10 verifiche documentali per acquisto in asta, fonti del Ministero Giustizia e Tribunale.
   - `analisi-centrale-rischi-imprese.html`: 10 verifiche per interpretare la CR, accesso legittimo ai dati, riconciliazioni e rettifica presso intermediari, fonti Banca d'Italia (2026).
   - `due-diligence-acquisto-azienda-checklist.html`: 10 categorie per acquisizione e condizioni negoziali, fonti generali Registro Imprese/Normattiva.
4. **Internal linking:** ogni pagina servizio linka la guida pertinente e viceversa. Sitemap aggiornata da 13 a **16 URL**.
5. **Correzioni audit:** H1 privacy unico senza alterare la sostanza della policy; metadati dei due servizi ridotti senza keyword stuffing. `index.html` resta canonico a `/`.
6. **Regressioni:** test aggiornati per sitemap/URL, canonical, marca, fonti, cookie, contatti, mobile e selettore bilingue. Il file `google60132d2233694167.html` resta intatto e protetto da test.

## Fonti metodologiche

- [Google Search Central: contenuti affidabili e orientati agli utenti](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google Search Central: nomi dei siti e markup WebSite](https://developers.google.com/search/docs/appearance/site-names)
- [Google Search Central: collegamenti interni](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Banca d’Italia: accesso alla Centrale dei Rischi](https://www.bancaditalia.it/servizi-cittadino/servizi/accesso-cr/)
- [Tribunale di Monza: vendite giudiziarie](https://tribunale-monza.giustizia.it/it/dettaglio_comefareper.page?contentId=PRC7372&modelId=32)

## Misurazione successiva

- Data zero: 27/11/2026. **Non modificare la data senza nuova analisi.**
- Attendere la scoperta e indicizzazione dei tre nuovi URL; la pubblicazione non garantisce indicizzazione.
- Misurare tra circa 30 giorni: impressions organiche nazionali, query non-brand, clic, CTR, posizione media e variazione per pagina su Search Console.
- Incrociare con richieste commerciali qualificate, appuntamenti, proposte e incarichi, senza introdurre nuovi tracker prima della valutazione privacy.
- Aggiornare guide solo quando muta la normativa, emergono dati nuovi o si individuano problemi reali; evitare cambi di date fittizi.
- Restano da sviluppare, in una fase successiva separata, i cluster hospitality/real estate, fiscalità societaria, operazioni internazionali e network professionale, senza rientrare nella crisi d'impresa.

**Rischio residuo:** nessuna garanzia di prima pagina Google; notorietà del marchio e autorevolezza esterna da costruire; la sola creazione di nuove pagine non dimostra risultati commerciali.
