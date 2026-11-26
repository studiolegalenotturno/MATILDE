# KTS Advisory — SEO nazionale, fase 1 (26 novembre 2026)

## Perimetro e criterio decisionale

**Mercato:** intero territorio italiano; la sede operativa a Napoli rimane un semplice recapito, non un filtro geografico.  
**Identità:** KTS Advisory è un progetto dei tre fondatori e non una società autonoma.  
**Esclusione espressa:** la crisi d'impresa non costituisce un cluster SEO, una pagina-obiettivo o un tema per campagne di acquisizione.  
**Obiettivo:** aumentare l'intercettazione di richieste pertinenti e misurare conversioni qualificate, non promettere posizioni o traffico non verificati.

Le query sotto riportate sono un set iniziale di ricerca e sperimentazione editoriale; **non sono dati di Google Search Console, stime di volume o classifiche SERP misurate**.

## Mappa delle sette aree

| Area | Keyword primaria candidata | Intento | Pagina-obiettivo | Stato |
|---|---|---|---|---|
| Operazioni straordinarie e M&A | consulenza acquisizione aziende; cessione azienda advisor; consulenza M&A Italia | Servizio, selezione consulente | `/consulenza-ma-operazioni-straordinarie.html` | Fase 1 |
| Finanza d'impresa e incentivi | consulenza rating bancario imprese; consulenza factoring aziende; anticipo fatture imprese | Soluzione finanziaria | `/finanza-impresa-rating-factoring.html` | Fase 1 |
| Aste giudiziarie | assistenza aste giudiziarie immobiliari; consulenza acquisto casa all'asta; assistenza partecipazione aste telematiche | Richiesta assistenza | `/assistenza-aste-giudiziarie.html` | Fase 1 |
| Real Estate & Hospitality | advisor investimenti alberghieri; due diligence hotel; acquisizione struttura alberghiera | Investimento B2B | Pagina dedicata da progettare | Fase 2 |
| Fiscalità e struttura societaria | consulenza fiscale società; pianificazione fiscale imprese; riorganizzazione societaria | Professionale specialistico | Pagina dedicata da progettare | Fase 2 |
| Operazioni internazionali | operazioni straordinarie cross border; consulenza internazionalizzazione imprese; export compliance | B2B nazionale/internazionale | Pagina dedicata da progettare | Fase 2 |
| Network e collaborazioni | partnership professionisti servizi alle imprese; collaborazioni studi professionali; network CAF professionisti | Candidatura B2B | `/lavora-con-noi.html` → modulo dedicato | Ottimizzazione successiva |

## Verifica pubblica concorrenziale (esempi di pagine pertinenti, non posizioni classificate)

- **M&A:** [Intesa Sanpaolo IMI](https://imi.intesasanpaolo.com/it/prodotti-e-servizi/investment-banking-e-finanza-strutturata/ma-advisory/), [EY](https://www.ey.com/it_it/services/strategy-transactions/buy-integrate), [CDI Global Italy](https://www.cdiglobal.it/faq/): pagine specializzate su fasi buy-side/sell-side, strutturazione e due diligence. Non sono concorrenti equiparabili per dimensioni; servono a confrontare copertura dei temi e aspettative dell'utente.
- **Finanza:** [Italfinance](https://italfinance.it/it/factoring), [Rating Advisor](https://www.ratingadvisor.it/), [C&G Finance](https://www.cgfinance.it/): presidiano query più circoscritte su factoring, rating e credito, con pagine dedicate e definizioni operative.
- **Aste:** [AVG](https://assistenzavenditegiudiziarie.it/servizi), [Astalex](https://www.astalex.it/servizi/servizi-di-supporto-alle-aste-giudiziarie/), [Astalegale](https://www.astalegale.net/): presentano percorsi di assistenza, analisi documentale, partecipazione e verifiche. Contenuti e promesse di questi siti non sono una verifica delle prestazioni effettive.

Questi esempi sono stati individuati con ricerche web esplorative al 26/11/2026. Per affermare *quali domini occupino le prime 10 posizioni* per ciascuna keyword occorre un monitoraggio SERP geograficamente e temporalmente ripetibile.

## Assetto iniziale del sito verificato

Prima degli interventi: homepage e pagina Attività istituzionali; `robots.txt` permissivo; `sitemap.xml` con 10 URL; metadati presenti ma senza pagine dedicate alle tre intenzioni di ricerca prioritarie.  
Interventi della fase 1:
1. Nuove tre pagine con titolo, description, H1, descrizione di servizio, ambiti, metodo, FAQ informative, link al contatto e indicazioni sulle attività riservate.
2. URL canonici auto-referenziali e metadati Open Graph.
3. Markup JSON-LD di tipo WebPage/BreadcrumbList, senza dichiarare recensioni, valutazioni o abilitazioni non verificate.
4. Link dalle schede della pagina Attività, mantenendo le descrizioni della navigazione IT/EN.
5. Sitemap incrementata da 10 a 13 URL e test automatici di coerenza; `robots.txt` già segnala la sitemap.

**Nota IT/EN:** le nuove tre pagine specialistiche sono in italiano, orientate alle query nazionali italiane; la sezione di ingresso sulla pagina Attività è tradotta. Eventuali landing inglesi dovranno essere autonome e correttamente collegate con hreflang, senza simulare traduzioni inesistenti.

## Misurazione: dati necessari da Google

Serve una proprietà Search Console verificata sul **dominio `ktsadvisory.it`** (preferibile, per coprire www e sottodomini). Dopo la verifica:

1. Inviare `https://www.ktsadvisory.it/sitemap.xml` nella sezione Sitemap.
2. Ispezionare homepage, pagina Attività e i tre nuovi URL; verificare canonical scelto da Google e stato indicizzazione.
3. Esportare per ogni query/pagina: impressioni, clic, CTR, posizione media, paese = Italia, tipo ricerca = Web. Distinguere query di marchio e query non brand.
4. Annotare i valori iniziali e confrontarli ogni 30 giorni. Se l'attività è molto recente, segnalare campioni ridotti e oscillazioni.
5. Incrociare i dati SEO con **contatti qualificati**, proposte e incarichi, con strumenti privacy-compliant; non confondere traffico con ricavi.
6. Non aggiungere un tag analitico o pixel senza prima verificare cookie consent e basi giuridiche.

### Indicazione operativa per Search Console

Accesso ufficiale: https://search.google.com/search-console/  
Documentazione Google: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap  
La presenza nella sitemap *non garantisce* indicizzazione o ranking. Non usare l'Indexing API per pagine di servizi: non è destinata a questo tipo di contenuti.

## Miglioramenti successivi (non eseguiti in fase 1)

- Pagine per le quattro aree ancora non coperte, subordinatamente a definizione precisa del servizio erogabile e fonti.
- Versioni inglesi coerenti dove utili, con segnalazioni hreflang reciproche.
- Approfondimenti realmente utili (checklist per acquisizioni, documento guida per factoring, come leggere una perizia d'asta), con revisione dei professionisti responsabili.
- Strategie di autorevolezza, citazioni e relazioni professionali senza link manipolativi.
- Misurazione delle conversioni nel rispetto della Privacy Policy e del consenso ove richiesto.

## Verifiche critiche del rilascio

Dati e fonti verificati; documentazione Google aggiornata; nessun volume inventato; perimetro nazionale; servizi effettivamente dichiarati; attività regolamentate riservate ai soggetti abilitati; prudenza sul factoring e sulle aste; URL e canonical coerenti; collegamenti interni e sitemap; controlli mobile, accessibilità, form contatti e non regressione del sito; nessun posizionamento garantito.

**Stato della Search Console e metriche reali:** da confermare tramite l'account con accesso alla proprietà; non considerare completata questa parte senza evidenze nel relativo servizio.
