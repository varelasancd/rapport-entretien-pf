import { useState } from "react";

// ═════════════════════════════════════════════════════════════════════════════
//  ⚙️  À PERSONNALISER — Lien du crédit (pied de page)
//  Remplacez l'URL ci-dessous par votre LinkedIn ou votre adresse e-mail.
//  Exemples :
//    LinkedIn : "https://www.linkedin.com/in/votre-profil"
//    E-mail   : "mailto:votre.email@exemple.ch"
// ═════════════════════════════════════════════════════════════════════════════
const CREDIT_URL = "https://www.linkedin.com/in/develly-varela-sanches";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const FONDS_NO = {
  "PF Pension - ESG 25 Fund":  "1205626",
  "PF Pension - ESG 50 Fund":  "1205620",
  "PF Pension - ESG 75 Fund":  "31679313",
  "PF Pension - ESG 100 Fund": "48478168",
};

const PRODUITS_CONSEIL = ["E-Gestion de patrimoine","Conseil en placement Plus","Conseil en fonds Base"];
const PRODUITS_EO = ["Fonds Self-Service","E-Trading (actions, ETF, obligations)","Cryptomonnaies","Produits structurés","Dépôt à terme","Obligations de caisse"];
const TOUS_PRODUITS = [...PRODUITS_CONSEIL, ...PRODUITS_EO];
const isEO = (p) => PRODUITS_EO.includes(p);

const DISCLAIMER_EO = `DÉCLARATION EXECUTION ONLY — Le client reconnait et confirme qu'il agit de sa propre initiative et prend ses décisions d'investissement de façon entièrement autonome. PostFinance SA n'a fourni aucun conseil en placement dans le cadre de cette transaction. Le client reconnait assumer l'entière et unique responsabilité de ses décisions d'investissement. PostFinance SA ne se porte pas responsable des gains ou pertes liés à ces placements.`;

const STRAT_DESC = {
  "Produit d'intérêts": "principalement dans des classes d'actifs à faible risque, comme les obligations. Afin d'améliorer ses opportunités de rendement, une petite partie des fonds investis est placée dans des titres plus risqués, comme les actions. À cela s'ajoutent des placements alternatifs visant à diversifier et à optimiser le portefeuille.",
  "Revenus": "majoritairement dans des classes d'actifs à faible risque, comme les obligations. Afin d'améliorer ses opportunités de rendement, une partie des fonds investis est placée dans des titres plus risqués, comme les actions. À cela s'ajoutent des placements alternatifs visant à diversifier et à optimiser le portefeuille.",
  "Équilibré": "à part égale dans des classes d'actifs à faible risque (p. ex. obligations) et à risque élevé (p. ex. actions). À cela s'ajoutent des placements alternatifs visant à diversifier et à optimiser le portefeuille.",
  "Croissance": "majoritairement dans des classes d'actifs à risque élevé, comme les actions. Afin d'atténuer les risques, une partie des fonds investis est également placée dans des titres moins risqués, comme les obligations. À cela s'ajoutent des placements alternatifs visant à diversifier et à optimiser le portefeuille.",
  "Gain de capital": "principalement dans des classes d'actifs à risque élevé, comme les actions. Afin d'atténuer les risques, une petite partie des fonds investis est placée dans des titres moins risqués, comme les obligations. À cela s'ajoutent des placements alternatifs visant à diversifier et à optimiser le portefeuille.",
};

// ─────────────────────────────────────────────────────────────────────────────
// PHRASES RÉGLEMENTAIRES — Trame placement
// ─────────────────────────────────────────────────────────────────────────────
const PT = {
  objectif: {
    M: (d) => `Le client estime que les taux d'intérêts de l'épargne sont bas et souhaite investir une partie de ses avoirs sur un horizon de ${d.horizon} ans afin de profiter du dynamisme des marchés et ainsi tenter d'obtenir un meilleur rendement sur le moyen long terme.\nLa situation financière du client est ${d.situation}. Il n'a pas de dette ${d.dette} et sa capacité d'épargne se situe à environ ${d.capEpargne} par mois. ${d.invest}.\nJ'ai expliqué au client les différents avantages des solutions de placement PostFinance ainsi que leur fonctionnement. Monsieur ${d.nom} a très rapidement exprimé son intérêt pour ${d.produit}.\nJ'ai détaillé le fonctionnement de ${d.produitDetail} et nous avons passé en revue les différentes caractéristiques, risques/opportunités et coûts liés à la solution de placement choisie. Pour ce faire, des documents tels que le descriptif du produit, le processus d'investissement, la vue d'ensemble des outils de placement ainsi que la liste des prix ont été utilisés. J'ai aussi rendu le client attentif au fait que les chiffres illustrés dans les différentes projections de performance ne représentent en rien une garantie et qu'il s'agit uniquement de chiffres projetés dans le cadre de différents scénarios possibles.`,
    F: (d) => `La cliente estime que les taux d'intérêts de l'épargne sont bas et souhaite investir une partie de ses avoirs sur un horizon de ${d.horizon} ans afin de profiter du dynamisme des marchés et ainsi tenter d'obtenir un meilleur rendement sur le moyen long terme.\nLa situation financière de la cliente est ${d.situation}. Elle n'a pas de dette ${d.dette} et sa capacité d'épargne se situe à environ ${d.capEpargne} par mois. ${d.invest}.\nJ'ai expliqué à la cliente les différents avantages des solutions de placement PostFinance ainsi que leur fonctionnement. Madame ${d.nom} a très rapidement exprimé son intérêt pour ${d.produit}.\nJ'ai détaillé le fonctionnement de ${d.produitDetail} et nous avons passé en revue les différentes caractéristiques, risques/opportunités et coûts liés à la solution de placement choisie. Pour ce faire, des documents tels que le descriptif du produit, le processus d'investissement, la vue d'ensemble des outils de placement ainsi que la liste des prix ont été utilisés. J'ai aussi rendu la cliente attentive au fait que les chiffres illustrés dans les différentes projections de performance ne représentent en rien une garantie et qu'il s'agit uniquement de chiffres projetés dans le cadre de différents scénarios possibles.`,
  },
  experience: {
    M: { avec: (nom) => `Monsieur ${nom} détient un portefeuille Self-Service composé de plusieurs fonds de placement regroupant tant le domaine des actions que celui des obligations, de l'immobilier ou encore des devises étrangères. Depuis le début de son placement, il a ainsi pu constater la différence de fluctuation d'un fonds à l'autre en fonction de l'évolution des marchés.\nLe client comprend très bien comment fonctionne un fonds ou un ETF ; il estime simplement ne pas avoir le savoir-faire nécessaire ni le temps disponible pour mener à bien une gestion efficace et professionnelle de son portefeuille.\nLes connaissances que le client a acquises ces dernières années sont donc le fruit de ses propres expériences en matière d'investissement. Il comprend parfaitement les opportunités et les risques associés aux placements et les accepte.`,
      sans: (nom) => `Le client ne possède pas encore d'expérience concrète dans le domaine des placements. Toutefois, suite à notre discussion et à mes explications détaillées, il possède à présent les connaissances nécessaires pour pouvoir évaluer et valider la solution proposée. De plus, grâce à la brochure « Risques inhérents au commerce d'instruments financiers » qui est systématiquement remise aux clients, Monsieur ${nom} pourra compléter ses connaissances s'il le souhaite.`,
    },
    F: { avec: (nom) => `Madame ${nom} détient un portefeuille Self-Service composé de plusieurs fonds de placement regroupant tant le domaine des actions que celui des obligations, de l'immobilier ou encore des devises étrangères. Depuis le début de son placement, elle a ainsi pu constater la différence de fluctuation d'un fonds à l'autre en fonction de l'évolution des marchés.\nLa cliente comprend très bien comment fonctionne un fonds ou un ETF ; elle estime simplement ne pas avoir le savoir-faire nécessaire ni le temps disponible pour mener à bien une gestion efficace et professionnelle de son portefeuille.\nLes connaissances que la cliente a acquises ces dernières années sont donc le fruit de ses propres expériences en matière d'investissement. Elle comprend parfaitement les opportunités et les risques associés aux placements et les accepte.`,
      sans: (nom) => `La cliente ne possède pas encore d'expérience concrète dans le domaine des placements. Toutefois, suite à notre discussion et à mes explications détaillées, elle possède à présent les connaissances nécessaires pour pouvoir évaluer et valider la solution proposée. De plus, grâce à la brochure « Risques inhérents au commerce d'instruments financiers » qui est systématiquement remise aux clients, Madame ${nom} pourra compléter ses connaissances si elle le souhaite.`,
    },
  },
  divergence: {
    M: {
      sans: (s) => `Le client ayant confirmé la stratégie recommandée (${s}) sans y apporter de modifications, sa mise en place ne relève donc aucun écart ni altération en matière de sous- ou surpondération du risque. Le mandat correspondant a été signé par le client et est joint au présent rapport.`,
      plus: (r,c) => `Malgré notre recommandation pour la stratégie ${r}, le client a préféré opter pour la stratégie ${c}. Je l'ai informé qu'il encourt des risques plus élevés qui ne correspondent ni à son profil, ni à son horizon de placement.\nLa divergence par rapport à la recommandation de placement de PostFinance est conforme au souhait explicite du client. Les risques de pertes ont été expliqués au client, qui les comprend et les accepte. Le mandat correspondant a été signé par le client et est joint au présent rapport.`,
      moins: (r,c) => `Malgré notre recommandation pour la stratégie ${r}, le client a préféré opter pour la stratégie ${c}. Je l'ai informé qu'il encourt certes un risque moins élevé, mais qu'il réduit ainsi ses opportunités de rendement, ce qui ne correspond ni à son profil, ni à son horizon de placement.\nLa divergence est conforme au souhait explicite du client. Le mandat correspondant a été signé par le client et est joint au présent rapport.`,
    },
    F: {
      sans: (s) => `La cliente ayant confirmé la stratégie recommandée (${s}) sans y apporter de modifications, sa mise en place ne relève donc aucun écart ni altération en matière de sous- ou surpondération du risque. Le mandat correspondant a été signé par la cliente et est joint au présent rapport.`,
      plus: (r,c) => `Malgré notre recommandation pour la stratégie ${r}, la cliente a préféré opter pour la stratégie ${c}. Je l'ai informée qu'elle encourt des risques plus élevés qui ne correspondent ni à son profil, ni à son horizon de placement.\nLa divergence par rapport à la recommandation de placement de PostFinance est conforme au souhait explicite de la cliente. Les risques de pertes ont été expliqués à la cliente, qui les comprend et les accepte. Le mandat correspondant a été signé par la cliente et est joint au présent rapport.`,
      moins: (r,c) => `Malgré notre recommandation pour la stratégie ${r}, la cliente a préféré opter pour la stratégie ${c}. Je l'ai informée qu'elle encourt certes un risque moins élevé, mais qu'elle réduit ainsi ses opportunités de rendement, ce qui ne correspond ni à son profil, ni à son horizon de placement.\nLa divergence est conforme au souhait explicite de la cliente. Le mandat correspondant a été signé par la cliente et est joint au présent rapport.`,
    },
  },
  esg: {
    M: {
      non: (nom) => `Après avoir présenté la brochure « Solutions de placement durables et responsables » qui explique la vue d'ensemble des approches de durabilité, les systèmes d'évaluation, les risques ESG ainsi que l'approche d'investissement responsable de PostFinance, le client me confirme qu'il n'accorde aucune attention particulière à cette thématique. Monsieur ${nom} a donc opté pour un investissement axé sur le Focus sélectionné.`,
      oui: () => `Oui, le client attache de l'importance à la durabilité et souhaite investir en prenant en compte des thèmes ESG.\nAprès avoir présenté la brochure « Solutions de placement durables et responsables », le client accepte la recommandation de PostFinance et opte pour une E-Gestion patrimoine avec un Focus Responsable.`,
      pref: () => `Le client s'intéresse à investir de manière durable mais sans aucunes préférences particulières. Après avoir présenté la brochure « Solutions de placement durables et responsables », le client décide d'opter pour un investissement axé sur le Focus sélectionné.`,
    },
    F: {
      non: (nom) => `Après avoir présenté la brochure « Solutions de placement durables et responsables » qui explique la vue d'ensemble des approches de durabilité, les systèmes d'évaluation, les risques ESG ainsi que l'approche d'investissement responsable de PostFinance, la cliente me confirme qu'elle n'accorde aucune attention particulière à cette thématique. Madame ${nom} a donc opté pour un investissement axé sur le Focus sélectionné.`,
      oui: () => `Oui, la cliente attache de l'importance à la durabilité et souhaite investir en prenant en compte des thèmes ESG.\nAprès avoir présenté la brochure « Solutions de placement durables et responsables », la cliente accepte la recommandation de PostFinance et opte pour une E-Gestion patrimoine avec un Focus Responsable.`,
      pref: () => `La cliente s'intéresse à investir de manière durable mais sans aucunes préférences particulières. Après avoir présenté la brochure « Solutions de placement durables et responsables », la cliente décide d'opter pour un investissement axé sur le Focus sélectionné.`,
    },
  },
};

const PP = {
  objectif: {
    M: (d) => `Le client estime que les taux d'intérêts du compte de prévoyance 3a sont bas et souhaite investir une partie de ses avoirs sur un horizon de placement de ${d.horizon} afin de profiter du dynamisme des marchés et ainsi tenter d'obtenir un meilleur rendement sur le moyen-long terme.\nLa situation financière du client est ${d.situation}. Il n'a pas de dette ${d.dette} et sa capacité d'épargne se situe à environ ${d.capEpargne} par mois. ${d.invest}.\nJ'ai expliqué au client les différents avantages des solutions de placement PostFinance ainsi que leur fonctionnement. Monsieur ${d.nom} a très rapidement exprimé son intérêt pour les fonds de prévoyance PF (PF Pension - ESG Fund) via son compte de prévoyance 3a PF N° ${d.noCompte}.\nJ'ai détaillé le fonctionnement des fonds de prévoyance PF (PF Pension - ESG Fund) et nous avons passé en revue les différentes caractéristiques, risques/opportunités et coûts liés à la solution de placement choisie.`,
    F: (d) => `La cliente estime que les taux d'intérêts du compte de prévoyance 3a sont bas et souhaite investir une partie de ses avoirs sur un horizon de placement de ${d.horizon} afin de profiter du dynamisme des marchés et ainsi tenter d'obtenir un meilleur rendement sur le moyen-long terme.\nLa situation financière de la cliente est ${d.situation}. Elle n'a pas de dette ${d.dette} et sa capacité d'épargne se situe à environ ${d.capEpargne} par mois. ${d.invest}.\nJ'ai expliqué à la cliente les différents avantages des solutions de placement PostFinance ainsi que leur fonctionnement. Madame ${d.nom} a très rapidement exprimé son intérêt pour les fonds de prévoyance PF (PF Pension - ESG Fund) via son compte de prévoyance 3a PF N° ${d.noCompte}.\nJ'ai détaillé le fonctionnement des fonds de prévoyance PF (PF Pension - ESG Fund) et nous avons passé en revue les différentes caractéristiques, risques/opportunités et coûts liés à la solution de placement choisie.`,
  },
  experience: {
    M: { avec: (nom) => `Monsieur ${nom} détient un portefeuille Self-Service composé de plusieurs fonds de placement regroupant tant le domaine des actions que celui des obligations, de l'immobilier ou encore des devises étrangères. Depuis le début de son placement, il a ainsi pu constater la différence de fluctuation d'un fonds à l'autre en fonction de l'évolution des marchés.\nLe client comprend très bien comment fonctionne un fonds ou un ETF.\nLes connaissances que le client a acquises ces dernières années sont donc le fruit de ses propres expériences en matière d'investissement. Il comprend parfaitement les opportunités et les risques associés aux placements et les accepte.\nDe plus, grâce à la brochure « Risques inhérents au commerce d'instruments financiers » qui est systématiquement remise aux clients, Monsieur ${nom} pourra compléter ses connaissances s'il le souhaite.`,
      sans: (nom) => `Le client ne possède pas encore d'expérience concrète dans le domaine des placements. Toutefois, à la suite de notre discussion et à mes explications détaillées, il possède à présent les connaissances nécessaires pour pouvoir évaluer et valider la solution proposée.\nDe plus, grâce à la brochure « Risques inhérents au commerce d'instruments financiers » qui est systématiquement remise aux clients, Monsieur ${nom} pourra compléter ses connaissances s'il le souhaite.`,
    },
    F: { avec: (nom) => `Madame ${nom} détient un portefeuille Self-Service composé de plusieurs fonds de placement regroupant tant le domaine des actions que celui des obligations, de l'immobilier ou encore des devises étrangères. Depuis le début de son placement, elle a ainsi pu constater la différence de fluctuation d'un fonds à l'autre en fonction de l'évolution des marchés.\nLa cliente comprend très bien comment fonctionne un fonds ou un ETF.\nLes connaissances que la cliente a acquises ces dernières années sont donc le fruit de ses propres expériences en matière d'investissement. Elle comprend parfaitement les opportunités et les risques associés aux placements et les accepte.\nDe plus, grâce à la brochure « Risques inhérents au commerce d'instruments financiers » qui est systématiquement remise aux clients, Madame ${nom} pourra compléter ses connaissances si elle le souhaite.`,
      sans: (nom) => `La cliente ne possède pas encore d'expérience concrète dans le domaine des placements. Toutefois, à la suite de notre discussion et à mes explications détaillées, elle possède à présent les connaissances nécessaires pour pouvoir évaluer et valider la solution proposée.\nDe plus, grâce à la brochure « Risques inhérents au commerce d'instruments financiers » qui est systématiquement remise aux clients, Madame ${nom} pourra compléter ses connaissances si elle le souhaite.`,
    },
  },
  divergence: {
    M: {
      sans: (s,f,no) => `Le profil d'investisseur a été rempli avec soin. Le résultat du profil est ${s}.\nLe client ayant confirmé la stratégie recommandée ${s} sans y apporter de modifications, sa mise en place ne relève donc aucun écart. Le client souhaite donc investir dans le ${f} (N° valeur : ${no}).`,
      plus: (r,c,nom) => `Malgré notre recommandation pour la stratégie ${r}, le client a préféré opter pour la stratégie ${c}.\nLa stratégie choisie par M. ${nom} n'est pas celle que nous lui avons recommandée. Le client est informé qu'il encourt des risques plus élevés qui ne correspondent ni à son profil d'investisseur, ni à son horizon de placement.\nNous avons déconseillé au client ce choix et nous avons préconisé d'opter pour l'une des stratégies de placement recommandées.`,
      moins: (r,c,nom) => `Malgré notre recommandation pour la stratégie ${r}, le client a préféré opter pour la stratégie ${c}.\nLa stratégie choisie par M. ${nom} n'est pas celle que nous lui avons recommandée. Le client est informé qu'il encourt certes un risque moins élevé, mais qu'il réduit ainsi ses opportunités de rendement.\nNous avons déconseillé au client ce choix et nous avons préconisé d'opter pour l'une des stratégies de placement recommandées.`,
    },
    F: {
      sans: (s,f,no) => `Le profil d'investisseur a été rempli avec soin. Le résultat du profil est ${s}.\nLa cliente ayant confirmé la stratégie recommandée ${s} sans y apporter de modifications, sa mise en place ne relève donc aucun écart. La cliente souhaite donc investir dans le ${f} (N° valeur : ${no}).`,
      plus: (r,c,nom) => `Malgré notre recommandation pour la stratégie ${r}, la cliente a préféré opter pour la stratégie ${c}.\nLa stratégie choisie par Madame ${nom} n'est pas celle que nous lui avons recommandée. La cliente est informée qu'elle encourt des risques plus élevés qui ne correspondent ni à son profil d'investisseur, ni à son horizon de placement.\nNous avons déconseillé à la cliente ce choix et nous avons préconisé d'opter pour l'une des stratégies de placement recommandées.`,
      moins: (r,c,nom) => `Malgré notre recommandation pour la stratégie ${r}, la cliente a préféré opter pour la stratégie ${c}.\nLa stratégie choisie par Madame ${nom} n'est pas celle que nous lui avons recommandée. La cliente est informée qu'elle encourt certes un risque moins élevé, mais qu'elle réduit ainsi ses opportunités de rendement.\nNous avons déconseillé à la cliente ce choix et nous avons préconisé d'opter pour l'une des stratégies de placement recommandées.`,
    },
  },
  esg: {
    M: {
      non: (f,no) => `Le client ne connaît pas le thème ESG. Je lui transmets les connaissances nécessaires à l'aide de la brochure « Solutions de placement durables ».\nAprès avoir présenté la brochure, le client me confirme qu'il n'accorde aucune attention particulière à cette thématique. Je l'informe toutefois que notre proposition de placement contient tout de même des critères de durabilité. Malgré ces informations, le client accepte la proposition de PostFinance et souscrit au fonds ${f} (N° valeur : ${no}).`,
      oui: (f,no) => `Oui, le client attache de l'importance à la durabilité et souhaite investir en prenant en compte des thèmes ESG.\nAprès avoir présenté la brochure « Solutions de placement durables », le client accepte la recommandation de PostFinance et opte pour le fonds ${f} (N° valeur : ${no}).`,
      pref: (f,no) => `Le client s'intéresse à investir de manière durable mais sans aucunes préférences particulières.\nAprès lui avoir présenté la brochure « Solutions de placement durables », le client accepte la proposition d'investissement et souscrit au fonds ${f} (N° valeur : ${no}).`,
    },
    F: {
      non: (f,no) => `La cliente ne connaît pas le thème ESG. Je lui transmets les connaissances nécessaires à l'aide de la brochure « Solutions de placement durables ».\nAprès avoir présenté la brochure, la cliente me confirme qu'elle n'accorde aucune attention particulière à cette thématique. Je l'informe toutefois que notre proposition de placement contient tout de même des critères de durabilité. Malgré ces informations, la cliente accepte la proposition de PostFinance et souscrit au fonds ${f} (N° valeur : ${no}).`,
      oui: (f,no) => `Oui, la cliente attache de l'importance à la durabilité et souhaite investir en prenant en compte des thèmes ESG.\nAprès avoir présenté la brochure « Solutions de placement durables », la cliente accepte la recommandation de PostFinance et opte pour le fonds ${f} (N° valeur : ${no}).`,
      pref: (f,no) => `La cliente s'intéresse à investir de manière durable mais sans aucunes préférences particulières.\nAprès lui avoir présenté la brochure « Solutions de placement durables », la cliente accepte la proposition d'investissement et souscrit au fonds ${f} (N° valeur : ${no}).`,
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// REPORT BUILDER
// Chaque élément du tableau L est une ligne unique.
// Les phrases avec \n internes sont splitées en lignes séparées.
// Le join final utilise \r\n pour compatibilité CRM Windows/PF.
// ─────────────────────────────────────────────────────────────────────────────
function buildReport(d) {
  const g = d.genre;
  const titre = g === "M" ? "Monsieur" : "Madame";
  const L = [];

  // push : accepte une chaîne avec \n internes et les éclate en lignes
  const push = (...args) => {
    args.forEach(txt => {
      if (txt === "" || txt === undefined || txt === null) { L.push(""); return; }
      String(txt).split(/\r?\n/).forEach(l => L.push(l));
    });
  };
  const blank = () => push("");
  const b = (t) => `**${t}**`;
  const kv = (k, v) => { if (v) push(`${k} : ${v}`); };
  const h1 = (t) => { blank(); push(b(`=== ${t} ===`)); blank(); };
  const h2 = (t) => { blank(); push(b(t)); blank(); };

  // ── EN-TÊTE
  push(b(`FEEDBACK D'ENTRETIEN — ${titre.toUpperCase()} ${(d.nom||"").toUpperCase()}`));
  push("=".repeat(60));
  const tono = { cordial:"Entretien cordial", sympathique:"Entretien très cordial / bon feeling", formel:"Entretien formel", difficile:"Entretien délicat" };
  push(`Remarque : ${tono[d.tonalite]||d.tonalite}`);
  blank();
  push(b("Objectif financier du client :"));
  push(d.objectifFinancier||"—");
  blank();
  push(b("Feed-back / commentaires :"));
  push(d.feedbackLibre||"—");

  // ── SITUATION PATRIMONIALE
  h1("SITUATION PATRIMONIALE");
  push(b("Assets PostFinance à ce jour :"));

  (d.comptesPrives||[]).forEach((c,i) => {
    if (c.no || c.montant) {
      push(`  Compte privé ${i+1}${c.no ? " — N° "+c.no : ""}${c.no && c.montant ? " |" : ""}${c.montant ? " CHF "+c.montant : ""}`);
    }
  });
  (d.comptesEpargne||[]).forEach((c,i) => {
    if (c.no || c.montant) {
      push(`  Compte épargne ${i+1}${c.no ? " — N° "+c.no : ""}${c.no && c.montant ? " |" : ""}${c.montant ? " CHF "+c.montant : ""}`);
    }
  });

  const plabels = { selfService:"Fonds Self-Service", egp:"E-Gestion de patrimoine", conseilBase:"Conseil en fonds Base", conseilPlus:"Conseil en placement Plus", etrading:"E-Trading", crypto:"Cryptomonnaies", structurés:"Produits structurés", depotTerme:"Dépôt à terme", obligCaisse:"Obligations de caisse" };
  // Nouveaux produits dynamiques (placements + assurances-vie)
  (d.produitsList||[]).forEach(item => {
    if (!item.type || item.type.startsWith("__sep")) return;
    const def = PRODUIT_DEFS[item.type];
    if (!def) return;
    const parts = [def.label];
    if (item.no)       parts.push(`N° ${item.no}`);
    if (item.depot)    parts.push(`CHF ${item.depot}`);
    if (item.perf)     parts.push(`Perf. ${item.perf}%`);
    if (item.strategie) parts.push(item.strategie);
    push(`  ${parts.join(" | ")}`);
    if (item.note)     push(`    → ${item.note}`);
  });

  (d.comptes3a||[]).forEach((c,i) => {
    if (c.no || c.montant) {
      push(`  Prévoyance 3a ${i+1}${c.no ? " — N° "+c.no : ""}${c.no && c.montant ? " |" : ""}${c.montant ? " CHF "+c.montant : ""}${c.fonds ? " | "+c.fonds : ""}`);
    }
  });

  if (d.autreEtab) {
    blank();
    push(b("Autre établissement bancaire :"));
    push(`  ${d.autreEtab}${d.autreEtabMontant ? " — CHF "+d.autreEtabMontant : ""}`);
  }

  blank();
  push(b("Situation professionnelle :"));
  kv("Salaire", d.salaire||"versé chez nous");
  if (d.tauxOccupation) kv("Taux d'occupation", d.tauxOccupation);
  if (d.employeur)      kv("Employeur", d.employeur);
  if (d.profession)     kv("Profession", d.profession);
  if (d.revenu)         kv("Revenu en CHF", d.revenu);

  blank();
  push(b("Capacité d'épargne :"));
  if (d.capaciteEpargne) kv("Épargne mensuelle", `CHF ${d.capaciteEpargne}`);
  if (d.tauxEpargne)     kv("Taux d'épargne", `${d.tauxEpargne}%`);

  blank();
  push(b("Financement :"));
  const finMap = { locataire:"Locataire", proprietaire:"Propriétaire", envisage:"Envisage un achat immobilier" };
  kv("Situation", finMap[d.financement]||d.financement);
  if (d.loyer)     kv("Prix du loyer", `CHF ${d.loyer}`);
  if (d.detteHypo) kv("Dettes hypothécaires", `CHF ${d.detteHypo}`);
  if (d.prixBien)  kv("Prix du bien immobilier", `CHF ${d.prixBien}`);

  // ── SERVICES BANCAIRES
  h1("SERVICES BANCAIRES");
  if (d.packageBancaire) kv("Package bancaire",   d.packageBancaire);
  if (d.carteCredit)     kv("Carte de crédit",    d.carteCredit);
  if (d.efinance)        kv("E-finance",           d.efinance);
  if (d.twint)           kv("Twint",               d.twint);
  if (d.pfApp)           kv("PostFinance App",     d.pfApp);
  if (d.sanitas)         kv("Sanitas",             d.sanitas);
  if (d.smartpoints)     kv("SmartPoints",         d.smartpoints);

  // ── PLACEMENTS
  h1("PLACEMENTS");
  if (!d.placementAborde) {
    push("Le sujet des placements n'a pas été abordé lors de cet entretien.");
  } else if (!d.placementSouscrit) {
    push("Je lui ai communiqué notre politique de solutions à court terme, moyen terme et long terme.");
    push("Je lui ai expliqué nos solutions de placement et modèles de conseil.");
    blank();
    push(b("Raison pour laquelle aucune solution de placement n'a été mise en place :"));
    push(d.placementRaisonNon||"—");
  } else {
    const eo = isEO(d.produitPlacement);
    if (eo) {
      push(`Produit souscrit : ${d.produitPlacement} (Execution Only — sans conseil)`);
      if (d.investP) { blank(); kv("Description", d.investP); }
      blank();
      push(b("DÉCLARATION EXECUTION ONLY"));
      push(DISCLAIMER_EO);
    } else {
      const produitLabel = d.produitPlacement==="E-Gestion de patrimoine"
        ? "l'E-Gestion de patrimoine, appréciant le fait de pouvoir déléguer la gestion et la prise de décision aux experts de PostFinance"
        : d.produitPlacement==="Conseil en placement Plus"
        ? "le Conseil en placement Plus, appréciant le fait de pouvoir prendre des décisions de placement de manière autonome et recevoir régulièrement des propositions de placement"
        : "le Conseil en fonds Base, appréciant le fait de pouvoir prendre des décisions de placement de manière autonome avec des conseils personnalisés sur demande";
      const produitDetail = d.produitPlacement==="E-Gestion de patrimoine" ? "la E-Gestion de patrimoine"
        : d.produitPlacement==="Conseil en placement Plus" ? "du Conseil en placement Plus" : "du Conseil en fonds Base";
      const detteStr = d.detteP==="particulière" ? "particulière"
        : d.detteP==="hypothèque" ? "en dehors de l'hypothèque"
        : d.detteP==="leasing" ? "en dehors du leasing" : "en dehors de la carte de crédit";
      const objDataP = { horizon:d.horizonPlacement, situation:d.situationP, dette:detteStr, capEpargne:d.capaciteEpargne||"—", invest:d.investP||`${titre} ${d.nom} souhaite investir`, nom:d.nom, produit:produitLabel, produitDetail };

      push(b("1. Informations sur les objectifs d'investissement et les solutions d'investissement discutées"));
      blank();
      push(PT.objectif[g](objDataP));
      blank();
      push(b("2. Informations sur les connaissances et expériences existantes du client/transmises au client"));
      blank();
      push(PT.experience[g][d.experienceP](d.nom));
      blank();
      push(b("3. Déviations de la recommandation de l'IP à la demande du client, y compris la justification"));
      blank();
      const axeDesc = { Suisse:"Suisse afin de mettre l'accent sur le marché national sans négliger la diversification internationale", Global:"Global afin de poursuivre une diversification internationale des investissements", Durable:"Durable afin de poursuivre un objectif Zéro émission nette pour le climat d'ici 2050", Responsable:"Responsable afin de tenir compte des critères de durabilité ESG", Avenir:"Avenir afin de tenir compte des évolutions technologiques et des mégatendances mondiales" };
      push(`Le profil d'investisseur a été rempli avec soin afin de refléter le plus fidèlement possible la capacité financière ainsi que la disposition aux risques ${g==="M"?"du client":"de la cliente"}. Le résultat du profil est ${d.profilP}.`);
      push(`La stratégie recommandée (${d.profilP}) a été soumise ${g==="M"?"au client":"à la cliente"}. Je lui ai expliqué que celle-ci investit ${STRAT_DESC[d.profilP]||""}`);
      push(`L'axe de placement sélectionné est le ${axeDesc[d.axePlacement]||d.axePlacement}.`);
      blank();
      if (d.divergenceP==="sans")       push(PT.divergence[g].sans(d.profilP));
      else if (d.divergenceP==="plus")  push(PT.divergence[g].plus(d.recStratP,d.choixStratP));
      else                              push(PT.divergence[g].moins(d.recStratP,d.choixStratP));
      blank();
      push(b("4. Connaissances et informations existantes/transmises sur les solutions de placements liées à la durabilité"));
      blank();
      if (d.esgP==="non")       push(PT.esg[g].non(d.nom));
      else if (d.esgP==="oui")  push(PT.esg[g].oui());
      else                      push(PT.esg[g].pref());
    }
  }

  // ── PRÉVOYANCE
  h1("PRÉVOYANCE");
  if (!d.prevoyanceAbordee) {
    push("Le sujet de la prévoyance n'a pas été abordé lors de cet entretien.");
  } else if (!d.prevoyanceSouscrite) {
    push(`J'ai expliqué le fonctionnement du système de prévoyance en Suisse ${g==="M"?"au client":"à la cliente"}.`);
    push(`Je ${g==="M"?"l'":"l'"}ai renseigné${g==="F"?"e":""} sur le fonctionnement du 3ème pilier en banque et en assurance.`);
    push(`Je ${g==="M"?"l'":"l'"}ai informé${g==="F"?"e":""} des conditions de retraits ainsi que du montant maximum déductible fiscalement.`);
    if (d.objectif3a) { blank(); push(b("Objectif de l'épargne 3a :")); push(d.objectif3a); }
    blank();
    push(b("Raison pour laquelle aucun fonds de prévoyance 3a n'a été mis en place :"));
    push(d.prevoyanceRaisonNon||"—");
  } else {
    const fondsNo = FONDS_NO[d.fondsPrevo]||"—";
    const dettePrevStr = d.dettePrev==="particulière" ? "particulière"
      : d.dettePrev==="hypothèque" ? "en dehors de l'hypothèque"
      : d.dettePrev==="leasing" ? "en dehors du leasing" : "en dehors de la carte de crédit";
    if (d.positions4Pucks) {
      push("Notre client dispose d'un dépôt Self-Service avec les positions suivantes :");
      push(b("4 Pucks :"));
      push(d.positions4Pucks);
      blank();
    }
    const objDataPrev = { horizon:d.horizonPrevo, situation:d.situationPrev, dette:dettePrevStr, capEpargne:d.capaciteEpargne||"—", invest:d.investPrev||`${titre} ${d.nom} souhaite investir`, nom:d.nom, noCompte:d.noCompte3a||"XXX.XXX.XXX" };

    push(b("1. Informations sur les objectifs d'investissement et les solutions d'investissement discutées"));
    blank();
    push(PP.objectif[g](objDataPrev));
    blank();
    push(b("2. Informations sur les connaissances et expériences existantes du client/transmises au client"));
    blank();
    push(PP.experience[g][d.experiencePrev](d.nom));
    blank();
    push(b("3. Déviations de la recommandation de l'IP à la demande du client, y compris la justification"));
    blank();
    push(`Le profil d'investisseur a été rempli avec soin. Le résultat du profil est ${d.profilPrev}.`);
    push(`La stratégie recommandée (${d.profilPrev}) a été soumise ${g==="M"?"au client":"à la cliente"}. Je lui ai expliqué que celle-ci investit ${STRAT_DESC[d.profilPrev]||""}`);
    blank();
    if (d.divergencePrev==="sans")       push(PP.divergence[g].sans(d.profilPrev,d.fondsPrevo,fondsNo));
    else if (d.divergencePrev==="plus")  push(PP.divergence[g].plus(d.recStratPrev,d.choixStratPrev,d.nom));
    else                                 push(PP.divergence[g].moins(d.recStratPrev,d.choixStratPrev,d.nom));
    blank();
    push(b("4. Connaissances et informations existantes/transmises sur les solutions de placements liées à la durabilité"));
    blank();
    if (d.esgPrev==="non")       push(PP.esg[g].non(d.fondsPrevo,fondsNo));
    else if (d.esgPrev==="oui")  push(PP.esg[g].oui(d.fondsPrevo,fondsNo));
    else                         push(PP.esg[g].pref(d.fondsPrevo,fondsNo));
    if (d.objectif3a) { blank(); push(b("Objectif de l'épargne 3a :")); push(d.objectif3a); }
  }

  if (d.resumeReco) {
    h1("RÉSUMÉ DE MES RECOMMANDATIONS");
    push(d.resumeReco);
  }

  // Jointure finale avec \r\n pour compatibilité CRM (Windows/PF)
  return L.join("\r\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — PostFinance
// ─────────────────────────────────────────────────────────────────────────────
const C = { teal:"#004B5A", tealDk:"#003744", tealLt:"#E8F2F4", tealMid:"#005F73", yellow:"#FFCC00", yellowDk:"#E6B800", white:"#FFFFFF", g50:"#F7F9FA", g100:"#EEF1F3", g200:"#D8DFE4", g400:"#8C9BAA", g600:"#556070", g900:"#1A2830", red:"#C00", green:"#1A7A3C", orange:"#C96A00" };
const F = "'Arial', 'Helvetica Neue', sans-serif";

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────────────────────
const mkPrivé  = () => ({ no:"", montant:"" });
const mkEpargne= () => ({ no:"", montant:"" });
const mk3a     = () => ({ no:"", montant:"", fonds:"" });
const mkPl     = () => ({ no:"", depot:"", perf:"", strategie:"", note:"" });

const INIT = {
  genre:"M", nom:"", tonalite:"cordial", feedbackLibre:"", objectifFinancier:"",
  comptesPrives:[mkPrivé()], comptesEpargne:[mkEpargne()], comptes3a:[mk3a()],
  produitsList: [],
  autreEtab:"", autreEtabMontant:"",
  salaire:"", tauxOccupation:"", employeur:"", profession:"", revenu:"",
  capaciteEpargne:"", tauxEpargne:"",
  packageBancaire:"", carteCredit:"", efinance:"", twint:"", pfApp:"", sanitas:"", smartpoints:"",
  financement:"locataire", loyer:"", detteHypo:"", prixBien:"",
  placementAborde:true, placementSouscrit:true, placementRaisonNon:"",
  produitPlacement:"E-Gestion de patrimoine", axePlacement:"Global",
  horizonPlacement:"", situationP:"stable", detteP:"particulière",
  investP:"", experienceP:"avec", profilP:"Équilibré", divergenceP:"sans",
  recStratP:"", choixStratP:"", esgP:"non",
  prevoyanceAbordee:true, prevoyanceSouscrite:true, prevoyanceRaisonNon:"",
  noCompte3a:"", fondsPrevo:"PF Pension - ESG 50 Fund",
  horizonPrevo:"5-8 ans", situationPrev:"stable", dettePrev:"particulière",
  investPrev:"", experiencePrev:"avec", profilPrev:"Équilibré", divergencePrev:"sans",
  recStratPrev:"", choixStratPrev:"", esgPrev:"non",
  positions4Pucks:"", objectif3a:"", resumeReco:"",
};

const STEPS = ["Entretien & client","Situation financière","Services bancaires","Placement","Prévoyance 3a","Résumé"];

// ─────────────────────────────────────────────────────────────────────────────
// UI HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const inp = { width:"100%", padding:"8px 10px", border:`1.5px solid ${C.g200}`, borderRadius:3, fontFamily:F, fontSize:13, color:C.g900, background:C.white, outline:"none", resize:"vertical", boxSizing:"border-box" };
const Inp = ({value,onChange,placeholder,type="text"}) => <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={inp} />;
const Txt = ({value,onChange,placeholder,rows=2}) => <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={inp} />;
const Sel = ({value,onChange,opts}) => (
  <select value={value} onChange={e=>onChange(e.target.value)} style={{...inp,cursor:"pointer",appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23004B5A' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 10px center",paddingRight:28}}>
    {opts.map(o=><option key={o.v??o} value={o.v??o}>{o.l??o}</option>)}
  </select>
);

const Lbl = ({children}) => <div style={{fontFamily:F,fontSize:11,fontWeight:700,color:C.teal,textTransform:"uppercase",letterSpacing:"0.6px",marginBottom:4}}>{children}</div>;
const Fld = ({label,children,half}) => <div style={{marginBottom:12,width:half?"calc(50% - 6px)":undefined}}><Lbl>{label}</Lbl>{children}</div>;

const Row = ({children}) => <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>{children}</div>;
const Col = ({children,w="50%"}) => <div style={{flex:`1 1 ${w}`,minWidth:160}}>{children}</div>;

function Card({title,accent,children,collapsible,defaultOpen=true}) {
  const [open,setOpen] = useState(defaultOpen);
  return (
    <div style={{border:`1px solid ${accent?C.teal:C.g200}`,borderRadius:5,marginBottom:12,overflow:"hidden"}}>
      <div onClick={()=>collapsible&&setOpen(o=>!o)} style={{background:accent?C.teal:C.g50,padding:"9px 14px",borderBottom:`1px solid ${accent?C.tealDk:C.g200}`,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:collapsible?"pointer":"default",userSelect:"none"}}>
        <span style={{fontFamily:F,fontSize:11,fontWeight:700,color:accent?C.yellow:C.teal,textTransform:"uppercase",letterSpacing:"0.8px"}}>{title}</span>
        {collapsible && <span style={{fontFamily:F,fontSize:12,color:accent?C.yellow:C.teal}}>{open?"▲":"▼"}</span>}
      </div>
      {(!collapsible||open) && <div style={{padding:"14px 14px 6px"}}>{children}</div>}
    </div>
  );
}

// Multi-account component
function MultiAccount({items,label,onChange,onAdd,onRemove,fields}) {
  return (
    <div>
      {items.map((item,i)=>(
        <div key={i} style={{border:`1px solid ${C.g200}`,borderRadius:4,padding:"10px 12px",marginBottom:8,position:"relative",background:C.g50}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontFamily:F,fontSize:11,fontWeight:700,color:C.teal,textTransform:"uppercase"}}>{label} {i+1}</span>
            {items.length>1 && <button type="button" onClick={()=>onRemove(i)} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontFamily:F,fontSize:12,fontWeight:700,padding:"0 4px"}}>✕ Supprimer</button>}
          </div>
          <Row>
            {fields.map(f=>(
              <Col key={f.key} w={f.w||"calc(50% - 6px)"}>
                <Fld label={f.label}>
                  {f.type==="sel"
                    ? <Sel value={item[f.key]||""} onChange={v=>onChange(i,f.key,v)} opts={f.opts} />
                    : <Inp value={item[f.key]||""} onChange={v=>onChange(i,f.key,v)} placeholder={f.ph} />
                  }
                </Fld>
              </Col>
            ))}
          </Row>
        </div>
      ))}
      <button type="button" onClick={onAdd} style={{padding:"7px 14px",background:C.white,border:`1.5px dashed ${C.teal}`,borderRadius:4,fontFamily:F,fontSize:12,fontWeight:600,color:C.teal,cursor:"pointer",width:"100%"}}>
        + Ajouter un {label.toLowerCase()}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DÉFINITION DES PRODUITS AVEC LEURS CHAMPS SPÉCIFIQUES
// ─────────────────────────────────────────────────────────────────────────────
const PRODUIT_DEFS = {
  // ── PLACEMENTS AVEC CONSEIL ──────────────────────────────────────────────
  egp: {
    label: "E-Gestion de patrimoine",
    cat: "placement",
    icon: "📊",
    fields: [
      { key:"no",       label:"N° de dépôt",              ph:"ex : 60-123456-7" },
      { key:"depot",    label:"Patrimoine investi (CHF)",  ph:"ex : 40'000" },
      { key:"perf",     label:"Performance depuis invest. (%)", ph:"ex : +8.5" },
      { key:"strategie",label:"Stratégie / Axe",          ph:"ex : Équilibré Global" },
      { key:"note",     label:"Remarque",                  ph:"Observations..." },
    ],
  },
  conseilPlus: {
    label: "Conseil en placement Plus",
    cat: "placement",
    icon: "📈",
    fields: [
      { key:"no",       label:"N° de dépôt",              ph:"ex : 60-123456-7" },
      { key:"depot",    label:"Patrimoine investi (CHF)",  ph:"ex : 30'000" },
      { key:"perf",     label:"Performance (%)",           ph:"ex : +5.2" },
      { key:"strategie",label:"Stratégie / Axe",          ph:"ex : Croissance Responsable" },
      { key:"note",     label:"Remarque",                  ph:"Observations..." },
    ],
  },
  conseilBase: {
    label: "Conseil en fonds Base",
    cat: "placement",
    icon: "📋",
    fields: [
      { key:"no",       label:"N° de dépôt",              ph:"ex : 60-123456-7" },
      { key:"depot",    label:"Avoirs (CHF)",              ph:"ex : 15'000" },
      { key:"perf",     label:"Performance (%)",           ph:"ex : +4.1" },
      { key:"strategie",label:"Fonds",                     ph:"ex : PF Global Balanced" },
      { key:"note",     label:"Remarque",                  ph:"Observations..." },
    ],
  },
  // ── PLACEMENTS EXECUTION ONLY ────────────────────────────────────────────
  selfService: {
    label: "Fonds Self-Service",
    cat: "placement",
    icon: "🗂️",
    fields: [
      { key:"no",       label:"N° de dépôt",              ph:"ex : 60-123456-7" },
      { key:"depot",    label:"Valeur du dépôt (CHF)",     ph:"ex : 25'000" },
      { key:"perf",     label:"Performance (%)",           ph:"ex : +6.3" },
      { key:"strategie",label:"Fonds détenus",             ph:"ex : PF Pension ESG 75, PF Balanced" },
      { key:"note",     label:"Remarque",                  ph:"Plan d'épargne, positions..." },
    ],
  },
  etrading: {
    label: "E-Trading (actions, ETF, obligations)",
    cat: "placement",
    icon: "💹",
    fields: [
      { key:"no",       label:"N° de dépôt",              ph:"ex : 60-123456-7" },
      { key:"depot",    label:"Valeur du portefeuille (CHF)", ph:"ex : 50'000" },
      { key:"perf",     label:"Performance (%)",           ph:"ex : +12.4" },
      { key:"strategie",label:"Positions principales",     ph:"ex : AAPL, NESN, SMI ETF" },
      { key:"note",     label:"Remarque",                  ph:"Stratégie, fréquence de trading..." },
    ],
  },
  crypto: {
    label: "Cryptomonnaies",
    cat: "placement",
    icon: "₿",
    fields: [
      { key:"no",       label:"N° de portefeuille",        ph:"ex : Portfolio ID" },
      { key:"depot",    label:"Valeur actuelle (CHF/USD)", ph:"ex : 5'000 USD" },
      { key:"perf",     label:"Performance (%)",           ph:"ex : +35" },
      { key:"strategie",label:"Cryptos détenues",          ph:"ex : BTC, ETH, SOL" },
      { key:"note",     label:"Remarque",                  ph:"Staking, hodl, trading..." },
    ],
  },
  structurés: {
    label: "Produits structurés",
    cat: "placement",
    icon: "🏗️",
    fields: [
      { key:"no",       label:"N° produit / référence",   ph:"ex : ISIN CH00123..." },
      { key:"depot",    label:"Montant investi (CHF)",     ph:"ex : 20'000" },
      { key:"strategie",label:"Type de produit",           ph:"ex : Barrier reverse convertible, Capital-garanti" },
      { key:"note",     label:"Échéance / remarque",       ph:"ex : Échéance 12/2025" },
    ],
  },
  depotTerme: {
    label: "Dépôt à terme",
    cat: "placement",
    icon: "🔒",
    fields: [
      { key:"no",       label:"N° de compte",              ph:"ex : 60-123456-7" },
      { key:"depot",    label:"Montant (CHF)",              ph:"ex : 50'000" },
      { key:"strategie",label:"Taux d'intérêt / durée",    ph:"ex : 2.1% — 12 mois" },
      { key:"note",     label:"Remarque",                  ph:"Échéance, renouvellement..." },
    ],
  },
  obligCaisse: {
    label: "Obligations de caisse",
    cat: "placement",
    icon: "📜",
    fields: [
      { key:"no",       label:"N° / référence",             ph:"ex : Oblig. caisse 2028" },
      { key:"depot",    label:"Valeur nominale (CHF)",       ph:"ex : 10'000" },
      { key:"strategie",label:"Taux / échéance",             ph:"ex : 1.8% — 2028" },
      { key:"note",     label:"Remarque",                   ph:"Observations..." },
    ],
  },
  // ── ASSURANCES-VIE ───────────────────────────────────────────────────────
  avRisquePur: {
    label: "Assurance-vie risque pur (décès / IAD)",
    cat: "assurance",
    icon: "🛡️",
    fields: [
      { key:"no",       label:"N° de police",               ph:"ex : PV-123456" },
      { key:"depot",    label:"Capital assuré (CHF)",        ph:"ex : 200'000" },
      { key:"strategie",label:"Prime mensuelle (CHF)",       ph:"ex : 45" },
      { key:"note",     label:"Couverture / bénéficiaires",  ph:"ex : Décès + IAD, bénéficiaire : conjoint" },
    ],
  },
  avMixte: {
    label: "Assurance-vie mixte (épargne + protection)",
    cat: "assurance",
    icon: "🏦",
    fields: [
      { key:"no",       label:"N° de police",               ph:"ex : PV-654321" },
      { key:"depot",    label:"Valeur de rachat actuelle (CHF)", ph:"ex : 35'000" },
      { key:"strategie",label:"Prime mensuelle / annuelle (CHF)", ph:"ex : 300/mois ou 3'600/an" },
      { key:"perf",     label:"Focus d'investissement",     ph:"ex : Fonds équilibré, taux garanti 1.25%" },
      { key:"note",     label:"Échéance / remarque",        ph:"ex : Échéance 2040, capital garanti CHF 80'000" },
    ],
  },
  av3aLiee: {
    label: "Assurance-vie 3a liée (pilier 3a en assurance)",
    cat: "assurance",
    icon: "🔐",
    fields: [
      { key:"no",       label:"N° de police",               ph:"ex : PV-789012" },
      { key:"depot",    label:"Avoir de prévoyance (CHF)",   ph:"ex : 18'000" },
      { key:"strategie",label:"Prime mensuelle / annuelle (CHF)", ph:"ex : 200/mois ou 2'400/an" },
      { key:"perf",     label:"Focus d'investissement",     ph:"ex : Fonds actions suisses, taux garanti" },
      { key:"note",     label:"Compagnie / couverture",     ph:"ex : Swiss Life via PF, décès + IAD" },
    ],
  },
  avLibrePassage: {
    label: "Assurance libre passage (2e pilier en assurance)",
    cat: "assurance",
    icon: "💼",
    fields: [
      { key:"no",       label:"N° de police",               ph:"ex : LP-345678" },
      { key:"depot",    label:"Avoir de libre passage (CHF)", ph:"ex : 80'000" },
      { key:"strategie",label:"Solution de placement",      ph:"ex : Fonds équilibré, taux garanti 1%" },
      { key:"note",     label:"Compagnie / remarque",       ph:"ex : AXA via PF, transfert prévu..." },
    ],
  },
};

const PRODUIT_OPTIONS_PLACEMENT = Object.entries(PRODUIT_DEFS)
  .filter(([,v]) => v.cat === "placement")
  .map(([k,v]) => ({ v: k, l: `${v.icon}  ${v.label}` }));

const PRODUIT_OPTIONS_ASSURANCE = Object.entries(PRODUIT_DEFS)
  .filter(([,v]) => v.cat === "assurance")
  .map(([k,v]) => ({ v: k, l: `${v.icon}  ${v.label}` }));

const mkProduitItem = (type = "") => ({ id: Date.now() + Math.random(), type, ...Object.fromEntries(["no","depot","perf","strategie","note"].map(k=>[k,""])) });

// Composant d'un produit dynamique dans la liste
function ProduitDynamiqueItem({ item, index, onUpdate, onRemove }) {
  const [open, setOpen] = useState(true);
  const def = PRODUIT_DEFS[item.type];
  const hasData = item.no || item.depot || item.strategie || item.perf || item.note;
  const catColor = def?.cat === "assurance" ? "#6A4C93" : C.teal;
  const catBg    = def?.cat === "assurance" ? "#F3EEF9" : C.tealLt;

  return (
    <div style={{ border: `1px solid ${hasData && def ? catColor : C.g200}`, borderRadius: 5, marginBottom: 8, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: def && hasData ? catBg : C.g50, padding: "9px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: open ? `1px solid ${C.g200}` : "none" }}>
        <div style={{ flex: 1 }}>
          <Sel
            value={item.type}
            onChange={v => onUpdate(index, "type", v)}
            opts={[
              { v: "", l: "— Sélectionner un produit —" },
              { v: "__sep_p", l: "── PLACEMENTS ─────────────────" },
              ...PRODUIT_OPTIONS_PLACEMENT,
              { v: "__sep_a", l: "── ASSURANCES-VIE ──────────────" },
              ...PRODUIT_OPTIONS_ASSURANCE,
            ]}
          />
        </div>
        <button type="button" onClick={() => setOpen(o => !o)}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: 11, color: C.g400, padding: "0 4px" }}>
          {open ? "▲" : "▼"}
        </button>
        <button type="button" onClick={() => onRemove(index)}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: F, fontSize: 12, color: C.red, fontWeight: 700, padding: "0 4px" }}>
          ✕
        </button>
      </div>

      {/* Fields */}
      {open && def && (
        <div style={{ padding: "12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {def.fields.map(f => (
              <div key={f.key} style={{ gridColumn: f.key === "note" ? "1 / -1" : undefined }}>
                <Fld label={f.label}>
                  {f.key === "note"
                    ? <Txt value={item[f.key] || ""} onChange={v => onUpdate(index, f.key, v)} placeholder={f.ph} rows={2} />
                    : <Inp value={item[f.key] || ""} onChange={v => onUpdate(index, f.key, v)} placeholder={f.ph} />
                  }
                </Fld>
              </div>
            ))}
          </div>
          {def.cat === "assurance" && (
            <div style={{ marginTop: 8, padding: "6px 10px", background: "#F3EEF9", borderRadius: 3, borderLeft: "3px solid #6A4C93" }}>
              <span style={{ fontFamily: F, fontSize: 11, color: "#6A4C93", fontWeight: 600 }}>Assurance-vie</span>
              <span style={{ fontFamily: F, fontSize: 11, color: "#6A4C93", marginLeft: 6 }}>Ces informations seront reportées dans la section Assets du rapport.</span>
            </div>
          )}
        </div>
      )}
      {open && !def && item.type && item.type.startsWith("__sep") && (
        <div style={{ padding: 8 }}><span style={{ fontFamily: F, fontSize: 11, color: C.g400 }}>Veuillez sélectionner un produit ci-dessus.</span></div>
      )}
    </div>
  );
}

function StatusPicker({aborde,souscrit,onAborde,onSouscrit}) {
  const opts=[{v:"as",l:"Abordé & souscrit",co:C.green,bg:"#E8F5EE"},{v:"an",l:"Abordé, non souscrit",co:C.orange,bg:"#FFF3E0"},{v:"na",l:"Non abordé",co:C.g400,bg:C.g100}];
  const cur=aborde?(souscrit?"as":"an"):"na";
  return (
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      {opts.map(o=>(
        <button key={o.v} type="button" onClick={()=>{if(o.v==="as"){onAborde(true);onSouscrit(true);}else if(o.v==="an"){onAborde(true);onSouscrit(false);}else{onAborde(false);onSouscrit(false);}}}
          style={{padding:"7px 14px",borderRadius:3,border:`1.5px solid ${cur===o.v?o.co:C.g200}`,background:cur===o.v?o.bg:C.white,color:cur===o.v?o.co:C.g400,fontFamily:F,fontSize:13,fontWeight:cur===o.v?700:400,cursor:"pointer"}}>
          {o.l}
        </button>
      ))}
    </div>
  );
}

const BtnP = ({children,onClick,full}) => <button type="button" onClick={onClick} style={{width:full?"100%":"auto",padding:"10px 22px",background:C.teal,color:C.white,border:"none",borderRadius:3,fontFamily:F,fontSize:13,fontWeight:700,cursor:"pointer"}}>{children}</button>;
const BtnS = ({children,onClick}) => <button type="button" onClick={onClick} style={{padding:"10px 18px",background:C.white,color:C.teal,border:`1.5px solid ${C.teal}`,borderRadius:3,fontFamily:F,fontSize:13,fontWeight:600,cursor:"pointer"}}>{children}</button>;
const BtnY = ({children,onClick}) => <button type="button" onClick={onClick} style={{padding:"11px 28px",background:C.yellow,color:C.teal,border:"none",borderRadius:3,fontFamily:F,fontSize:14,fontWeight:700,cursor:"pointer"}}>{children}</button>;

// PostFinance Logo SVG — fidèle à l'identité visuelle officielle
// Croix blanche avec bras arrondis sur fond jaune + texte teal
const PFLogo = ({height=36}) => (
  <svg height={height} viewBox="0 0 220 56" xmlns="http://www.w3.org/2000/svg" style={{display:"block"}}>
    {/* Fond jaune */}
    <rect width="220" height="56" rx="5" fill="#FFCC00"/>
    {/* Croix blanche (forme organique avec bras arrondis) */}
    <g transform="translate(10,8)">
      {/* Bras vertical */}
      <rect x="10" y="0"  width="12" height="40" rx="6" fill="white"/>
      {/* Bras horizontal */}
      <rect x="0"  y="10" width="32" height="12" rx="6" fill="white"/>
      {/* Coins arrondis de la croix — cercles aux intersections */}
      <circle cx="10" cy="10" r="6" fill="white"/>
      <circle cx="22" cy="10" r="6" fill="white"/>
      <circle cx="10" cy="30" r="6" fill="white"/>
      <circle cx="22" cy="30" r="6" fill="white"/>
    </g>
    {/* Texte PostFinance */}
    <text x="52" y="37" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="22" fill="#004B5A" letterSpacing="-0.3">PostFinance</text>
  </svg>
);

// Number selector (0-10)
function NumSelect({value,onChange,max=10}) {
  return (
    <select value={value} onChange={e=>onChange(Number(e.target.value))}
      style={{...inp,width:80,display:"inline-block",cursor:"pointer",appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23004B5A' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 8px center",paddingRight:24}}>
      {Array.from({length:max+1},(_,i)=><option key={i} value={i}>{i}</option>)}
    </select>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [step,setStep]=useState(0);
  const [data,setData]=useState({...INIT});
  const [report,setReport]=useState("");
  const [copied,setCopied]=useState(false);

  const set=k=>v=>setData(d=>({...d,[k]:v}));
  const setNested=(k,i,f,v)=>setData(d=>({...d,[k]:d[k].map((item,idx)=>idx===i?{...item,[f]:v}:item)}));
  const addAccount=(k,mk)=>setData(d=>({...d,[k]:[...d[k],mk()]}));
  const removeAccount=(k,i)=>setData(d=>({...d,[k]:d[k].filter((_,idx)=>idx!==i)}));

  // Produits dynamiques
  const addProduit = () => setData(d=>({...d, produitsList:[...d.produitsList, mkProduitItem("")]}));
  const removeProduit = (i) => setData(d=>({...d, produitsList:d.produitsList.filter((_,idx)=>idx!==i)}));
  const updateProduit = (i,field,val) => setData(d=>({...d, produitsList:d.produitsList.map((item,idx)=>idx===i?{...item,[field]:val}:item)}));

  const setNbPrives=(n)=>{
    const cur=data.comptesPrives;
    if(n>cur.length) setData(d=>({...d,comptesPrives:[...cur,...Array(n-cur.length).fill(null).map(mkPrivé)]}));
    else setData(d=>({...d,comptesPrives:cur.slice(0,n)}));
  };
  const setNbEpargne=(n)=>{
    const cur=data.comptesEpargne;
    if(n>cur.length) setData(d=>({...d,comptesEpargne:[...cur,...Array(n-cur.length).fill(null).map(mkEpargne)]}));
    else setData(d=>({...d,comptesEpargne:cur.slice(0,n)}));
  };
  const setNb3a=(n)=>{
    const cur=data.comptes3a;
    if(n>cur.length) setData(d=>({...d,comptes3a:[...cur,...Array(n-cur.length).fill(null).map(mk3a)]}));
    else setData(d=>({...d,comptes3a:cur.slice(0,n)}));
  };

  const nav=(prev,next,gen)=>(
    <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
      {prev>=0 && <BtnS onClick={()=>setStep(prev)}>← Retour</BtnS>}
      {gen ? <BtnY onClick={()=>{setReport(buildReport(data));setStep(STEPS.length);}}>✦ Générer le rapport</BtnY>
           : <BtnP onClick={()=>setStep(next)}>Suivant →</BtnP>}
    </div>
  );

  // Copie avec \r\n pour compatibilité CRM Windows / PostFinance
  const copy=()=>{
    const crmText = report.replace(/\r?\n/g, "\r\n");
    navigator.clipboard.writeText(crmText).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2200);});
  };

  // Infobanner CRM
  const crmInfo = (
    <div style={{background:C.tealLt,border:`1px solid ${C.teal}`,borderRadius:3,padding:"8px 12px",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
      <span style={{fontFamily:F,fontSize:11,color:C.teal,fontWeight:600}}>ℹ</span>
      <span style={{fontFamily:F,fontSize:11,color:C.teal}}>Le rapport généré utilise la mise en forme <strong>**gras**</strong> compatible CRM PostFinance. Les titres seront affichés en gras dans votre outil.</span>
    </div>
  );

  return (
    <div style={{fontFamily:F,background:C.g100,minHeight:"100vh"}}>
      {/* HEADER */}
      <div style={{background:C.yellow,borderBottom:`3px solid ${C.yellowDk}`,padding:"0 24px"}}>
        <div style={{maxWidth:800,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
          <PFLogo height={40} />
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:C.teal}}>Rapport d'entretien client</div>
            <div style={{fontFamily:F,fontSize:11,color:C.tealMid}}>Outil interne — Conseil clientèle privée</div>
          </div>
        </div>
      </div>

      {/* SUB-HEADER avec steps */}
      <div style={{background:C.teal,padding:"0 24px"}}>
        <div style={{maxWidth:800,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:44,overflow:"hidden"}}>
          <div style={{display:"flex",gap:0}}>
            {STEPS.map((s,i)=>(
              <div key={i} onClick={()=>i<step&&setStep(i)} style={{padding:"0 14px",height:44,display:"flex",alignItems:"center",cursor:i<step?"pointer":"default",borderBottom:i===step?`3px solid ${C.yellow}`:"3px solid transparent",transition:"border-color 0.2s"}}>
                <span style={{fontFamily:F,fontSize:11,fontWeight:i===step?700:400,color:i===step?C.yellow:i<step?"rgba(255,204,0,0.65)":"rgba(255,255,255,0.4)",whiteSpace:"nowrap"}}>{i+1}. {s}</span>
              </div>
            ))}
          </div>
          {step < STEPS.length && <span style={{fontFamily:F,fontSize:11,color:"rgba(255,255,255,0.5)",whiteSpace:"nowrap",marginLeft:12}}>{step+1}/{STEPS.length}</span>}
        </div>
      </div>

      {/* PROGRESS */}
      <div style={{height:3,background:C.g200}}><div style={{height:3,background:C.yellow,width:`${((step+1)/STEPS.length)*100}%`,transition:"width 0.3s"}} /></div>

      <div style={{maxWidth:800,margin:"0 auto",padding:"20px 20px 60px"}}>

        {/* STEP 0 */}
        {step===0 && (<>
          <Card title="Identité du client">
            <Row>
              <Col w="40%">
                <Fld label="Genre">
                  <div style={{display:"flex",gap:8}}>
                    {[["M","Monsieur"],["F","Madame"]].map(([v,l])=>(
                      <button key={v} type="button" onClick={()=>set("genre")(v)} style={{flex:1,padding:"8px",border:`2px solid ${data.genre===v?C.teal:C.g200}`,borderRadius:3,background:data.genre===v?C.teal:C.white,color:data.genre===v?C.white:C.g600,fontFamily:F,fontSize:13,fontWeight:data.genre===v?700:400,cursor:"pointer"}}>
                        {l}
                      </button>
                    ))}
                  </div>
                </Fld>
              </Col>
              <Col w="55%"><Fld label="Nom de famille"><Inp value={data.nom} onChange={set("nom")} placeholder="ex : Dupont" /></Fld></Col>
            </Row>
          </Card>
          <Card title="Qualité de l'entretien">
            <Fld label="Tonalité">
              <Sel value={data.tonalite} onChange={set("tonalite")} opts={[{v:"cordial",l:"Entretien cordial"},{v:"sympathique",l:"Entretien très cordial / bon feeling"},{v:"formel",l:"Entretien formel"},{v:"difficile",l:"Entretien délicat"}]} />
            </Fld>
          </Card>
          <Card title="Contenu de l'entretien">
            <Fld label="Objectif financier du client"><Txt value={data.objectifFinancier} onChange={set("objectifFinancier")} placeholder="ex : Améliorer sa retraite, constituer un capital, achat immobilier..." rows={2} /></Fld>
            <Fld label="Feed-back / commentaires"><Txt value={data.feedbackLibre} onChange={set("feedbackLibre")} placeholder="Contexte de vie, éléments importants, remarques particulières..." rows={5} /></Fld>
          </Card>
          {nav(-1,1,false)}
        </>)}

        {/* STEP 1 — Situation financière */}
        {step===1 && (<>
          {/* Comptes privés */}
          <Card title="Comptes privés CHF" accent>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,padding:"8px 12px",background:C.tealLt,borderRadius:3}}>
              <span style={{fontFamily:F,fontSize:12,color:C.teal,fontWeight:600}}>Nombre de comptes privés :</span>
              <NumSelect value={data.comptesPrives.length} onChange={setNbPrives} />
            </div>
            {data.comptesPrives.length>0 && (
              <MultiAccount
                items={data.comptesPrives} label="Compte privé"
                onChange={(i,f,v)=>setNested("comptesPrives",i,f,v)}
                onAdd={()=>addAccount("comptesPrives",mkPrivé)}
                onRemove={(i)=>removeAccount("comptesPrives",i)}
                fields={[{key:"no",label:"N° de compte",ph:"ex : 60-123456-7"},{key:"montant",label:"Solde (CHF)",ph:"ex : 5'000"}]}
              />
            )}
            {data.comptesPrives.length===0 && <p style={{fontFamily:F,fontSize:12,color:C.g400,textAlign:"center",padding:"8px 0"}}>Aucun compte privé</p>}
          </Card>

          {/* Comptes épargne */}
          <Card title="Comptes épargne CHF" accent>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,padding:"8px 12px",background:C.tealLt,borderRadius:3}}>
              <span style={{fontFamily:F,fontSize:12,color:C.teal,fontWeight:600}}>Nombre de comptes épargne :</span>
              <NumSelect value={data.comptesEpargne.length} onChange={setNbEpargne} />
            </div>
            {data.comptesEpargne.length>0 && (
              <MultiAccount
                items={data.comptesEpargne} label="Compte épargne"
                onChange={(i,f,v)=>setNested("comptesEpargne",i,f,v)}
                onAdd={()=>addAccount("comptesEpargne",mkEpargne)}
                onRemove={(i)=>removeAccount("comptesEpargne",i)}
                fields={[{key:"no",label:"N° de compte",ph:"ex : 60-654321-0"},{key:"montant",label:"Solde (CHF)",ph:"ex : 20'000"}]}
              />
            )}
            {data.comptesEpargne.length===0 && <p style={{fontFamily:F,fontSize:12,color:C.g400,textAlign:"center",padding:"8px 0"}}>Aucun compte épargne</p>}
          </Card>

          {/* Solutions de placement & assurances-vie existantes */}
          <Card title="Placements & assurances-vie existants" collapsible defaultOpen={true}>
            <div style={{fontFamily:F,fontSize:11,color:C.g600,marginBottom:12,padding:"8px 10px",background:C.g50,borderRadius:3,borderLeft:`3px solid ${C.teal}`}}>
              Ajoutez autant de produits que nécessaire. Sélectionnez le type dans la liste déroulante — les champs s'adaptent automatiquement.
            </div>
            {data.produitsList.map((item,i)=>(
              <ProduitDynamiqueItem key={item.id||i} item={item} index={i} onUpdate={updateProduit} onRemove={removeProduit} />
            ))}
            {data.produitsList.length===0 && (
              <p style={{fontFamily:F,fontSize:12,color:C.g400,textAlign:"center",padding:"12px 0",fontStyle:"italic"}}>
                Aucun produit ajouté — cliquez ci-dessous pour commencer
              </p>
            )}
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <button type="button" onClick={addProduit}
                style={{flex:1,padding:"9px",background:C.white,border:`1.5px dashed ${C.teal}`,borderRadius:4,fontFamily:F,fontSize:12,fontWeight:700,color:C.teal,cursor:"pointer"}}>
                📊 + Ajouter un placement
              </button>
              <button type="button"
                onClick={()=>setData(d=>({...d,produitsList:[...d.produitsList,mkProduitItem("avMixte")]}))}
                style={{flex:1,padding:"9px",background:C.white,border:`1.5px dashed #6A4C93`,borderRadius:4,fontFamily:F,fontSize:12,fontWeight:700,color:"#6A4C93",cursor:"pointer"}}>
                🛡️ + Ajouter une assurance-vie
              </button>
            </div>
          </Card>

          {/* Comptes prévoyance 3a existants */}
          <Card title="Comptes prévoyance 3a existants" accent>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,padding:"8px 12px",background:C.tealLt,borderRadius:3}}>
              <span style={{fontFamily:F,fontSize:12,color:C.teal,fontWeight:600}}>Nombre de comptes prévoyance 3a :</span>
              <NumSelect value={data.comptes3a.length} onChange={setNb3a} />
            </div>
            {data.comptes3a.length>0 && (
              <MultiAccount
                items={data.comptes3a} label="Compte 3a"
                onChange={(i,f,v)=>setNested("comptes3a",i,f,v)}
                onAdd={()=>addAccount("comptes3a",mk3a)}
                onRemove={(i)=>removeAccount("comptes3a",i)}
                fields={[
                  {key:"no",label:"N° de compte",ph:"ex : 60-999888-1"},
                  {key:"montant",label:"Solde (CHF)",ph:"ex : 8'000"},
                  {key:"fonds",label:"Fonds / placement actuel",ph:"ex : PF Pension ESG 50, taux d'intérêt"},
                ]}
              />
            )}
            {data.comptes3a.length===0 && <p style={{fontFamily:F,fontSize:12,color:C.g400,textAlign:"center",padding:"8px 0"}}>Aucun compte prévoyance 3a</p>}
          </Card>

          {/* Autre banque */}
          <Card title="Autre établissement bancaire">
            <Row>
              <Col><Fld label="Établissement"><Inp value={data.autreEtab} onChange={set("autreEtab")} placeholder="ex : UBS, Raiffeisen, Non" /></Fld></Col>
              <Col><Fld label="Montant (CHF)"><Inp value={data.autreEtabMontant} onChange={set("autreEtabMontant")} placeholder="ex : 10'000" /></Fld></Col>
            </Row>
          </Card>

          {/* Emploi */}
          <Card title="Situation professionnelle & revenus">
            <Row>
              <Col><Fld label="Salaire / situation"><Inp value={data.salaire} onChange={set("salaire")} placeholder="versé chez nous / CHF 90'000" /></Fld></Col>
              <Col><Fld label="Taux d'occupation"><Inp value={data.tauxOccupation} onChange={set("tauxOccupation")} placeholder="ex : 100%, 80%" /></Fld></Col>
              <Col><Fld label="Employeur"><Inp value={data.employeur} onChange={set("employeur")} placeholder="ex : EPFL, CFF..." /></Fld></Col>
              <Col><Fld label="Profession"><Inp value={data.profession} onChange={set("profession")} placeholder="ex : Ingénieur..." /></Fld></Col>
            </Row>
            <Row>
              <Col><Fld label="Revenu net annuel (CHF)"><Inp value={data.revenu} onChange={set("revenu")} placeholder="ex : 85'000" /></Fld></Col>
              <Col><Fld label="Épargne mensuelle (CHF)"><Inp value={data.capaciteEpargne} onChange={set("capaciteEpargne")} placeholder="ex : 1'000" /></Fld></Col>
              <Col><Fld label="Taux d'épargne (%)"><Inp value={data.tauxEpargne} onChange={set("tauxEpargne")} placeholder="ex : 15" /></Fld></Col>
            </Row>
          </Card>

          {/* Financement */}
          <Card title="Financement / logement">
            <Fld label="Situation">
              <Sel value={data.financement} onChange={set("financement")} opts={[{v:"locataire",l:"Locataire"},{v:"proprietaire",l:"Propriétaire"},{v:"envisage",l:"Envisage un achat immobilier"}]} />
            </Fld>
            {data.financement==="locataire" && <Row><Col><Fld label="Loyer mensuel (CHF)"><Inp value={data.loyer} onChange={set("loyer")} placeholder="ex : 1'800" /></Fld></Col></Row>}
            {data.financement==="proprietaire" && <Row><Col><Fld label="Dettes hypothécaires (CHF)"><Inp value={data.detteHypo} onChange={set("detteHypo")} placeholder="ex : 450'000" /></Fld></Col><Col><Fld label="Prix du bien (CHF)"><Inp value={data.prixBien} onChange={set("prixBien")} placeholder="ex : 700'000" /></Fld></Col></Row>}
          </Card>
          {nav(0,2,false)}
        </>)}

        {/* STEP 2 — Services */}
        {step===2 && (<>
          <Card title="Package & services PostFinance">
            <Row>
              <Col><Fld label="Package bancaire"><Inp value={data.packageBancaire} onChange={set("packageBancaire")} placeholder="ex : SmartPlus, Plus..." /></Fld></Col>
              <Col><Fld label="Carte de crédit"><Inp value={data.carteCredit} onChange={set("carteCredit")} placeholder="ex : Visa Gold, Non" /></Fld></Col>
            </Row>
            <Row>
              <Col><Fld label="E-finance"><Sel value={data.efinance} onChange={set("efinance")} opts={[{v:"",l:"—"},{v:"Oui",l:"Oui"},{v:"Non",l:"Non"},{v:"Proposé",l:"Proposé"}]} /></Fld></Col>
              <Col><Fld label="Twint"><Sel value={data.twint} onChange={set("twint")} opts={[{v:"",l:"—"},{v:"Oui",l:"Oui"},{v:"Non",l:"Non"},{v:"Proposé",l:"Proposé"}]} /></Fld></Col>
              <Col><Fld label="PostFinance App"><Sel value={data.pfApp} onChange={set("pfApp")} opts={[{v:"",l:"—"},{v:"Oui",l:"Oui"},{v:"Non",l:"Non"},{v:"Proposé",l:"Proposé"}]} /></Fld></Col>
            </Row>
            <Row>
              <Col><Fld label="Sanitas"><Sel value={data.sanitas} onChange={set("sanitas")} opts={[{v:"",l:"—"},{v:"Oui",l:"Oui"},{v:"Non",l:"Non"},{v:"Pas abordé",l:"Pas abordé"},{v:"Proposé",l:"Proposé"}]} /></Fld></Col>
              <Col><Fld label="SmartPoints (programme bonus)"><Sel value={data.smartpoints} onChange={set("smartpoints")} opts={[{v:"",l:"—"},{v:"Oui — inscrit",l:"Oui — inscrit"},{v:"Non — proposé",l:"Non — proposé"},{v:"Non — pas intéressé",l:"Non — pas intéressé"},{v:"Pas abordé",l:"Pas abordé"}]} /></Fld></Col>
            </Row>
          </Card>
          <div style={{background:C.tealLt,border:`1px solid ${C.teal}`,borderRadius:3,padding:"9px 12px",marginBottom:12}}>
            <span style={{fontFamily:F,fontSize:11,fontWeight:700,color:C.teal}}>ℹ SmartPoints</span>
            <span style={{fontFamily:F,fontSize:11,color:C.g600,marginLeft:6}}>Programme de fidélité PostFinance : cumul automatique de points lors de l'utilisation des solutions PF (paiements, placements, prévoyance).</span>
          </div>
          {nav(1,3,false)}
        </>)}

        {/* STEP 3 — Placement */}
        {step===3 && (<>
          <Card title="Placement — statut de l'entretien" accent>
            <StatusPicker aborde={data.placementAborde} souscrit={data.placementSouscrit} onAborde={set("placementAborde")} onSouscrit={set("placementSouscrit")} />
          </Card>
          {data.placementAborde && !data.placementSouscrit && (
            <Card title="Raison — aucun placement souscrit">
              <Fld label="Pourquoi aucune solution n'a-t-elle été mise en place ?">
                <Txt value={data.placementRaisonNon} onChange={set("placementRaisonNon")} rows={3} placeholder="ex : Le client souhaite d'abord terminer ses études. Il reviendra début 2027 pour ouvrir un dépôt Self-Service..." />
              </Fld>
            </Card>
          )}
          {data.placementAborde && data.placementSouscrit && (<>
            <Card title="Solution souscrite">
              <Fld label="Produit de placement">
                <Sel value={data.produitPlacement} onChange={set("produitPlacement")} opts={TOUS_PRODUITS} />
              </Fld>
              {isEO(data.produitPlacement) && (
                <div style={{background:"#FFF3CD",border:"1px solid #E0A800",borderRadius:3,padding:"9px 12px",marginBottom:8}}>
                  <span style={{fontFamily:F,fontSize:11,fontWeight:700,color:"#8A6000"}}>⚠ Execution Only — sans conseil</span>
                  <p style={{fontFamily:F,fontSize:11,color:"#5C4000",marginTop:4,lineHeight:1.5}}>Le rapport inclura la déclaration Execution Only. PostFinance ne fournit aucun conseil. Le client assume l'entière responsabilité de ses décisions.</p>
                </div>
              )}
              {!isEO(data.produitPlacement) && <Fld label="Axe de placement"><Sel value={data.axePlacement} onChange={set("axePlacement")} opts={["Suisse","Global","Durable","Responsable","Avenir"]} /></Fld>}
              <Row>
                <Col><Fld label="Description de l'investissement"><Txt value={data.investP} onChange={set("investP")} rows={2} placeholder="ex : investir CHF 20'000 + plan d'épargne CHF 300/mois" /></Fld></Col>
                {!isEO(data.produitPlacement) && <Col><Fld label="Horizon (années)"><Inp value={data.horizonPlacement} onChange={set("horizonPlacement")} placeholder="ex : 10" /></Fld></Col>}
              </Row>
            </Card>
            {!isEO(data.produitPlacement) && (<>
              <Card title="Situation financière">
                <Row>
                  <Col><Fld label="Situation"><Sel value={data.situationP} onChange={set("situationP")} opts={["saine","stable","confortable","excellente"]} /></Fld></Col>
                  <Col><Fld label="Dettes"><Sel value={data.detteP} onChange={set("detteP")} opts={[{v:"particulière",l:"Aucune dette"},{v:"hypothèque",l:"Hormis hypothèque"},{v:"leasing",l:"Hormis leasing"},{v:"carteCredit",l:"Hormis carte crédit"}]} /></Fld></Col>
                </Row>
              </Card>
              <Card title="Profil investisseur & divergence">
                <Row>
                  <Col><Fld label="Expérience"><Sel value={data.experienceP} onChange={set("experienceP")} opts={[{v:"avec",l:"Avec expérience"},{v:"sans",l:"Sans expérience"}]} /></Fld></Col>
                  <Col><Fld label="Profil résultat (IP)"><Sel value={data.profilP} onChange={set("profilP")} opts={["Produit d'intérêts","Revenus","Équilibré","Croissance","Gain de capital"]} /></Fld></Col>
                </Row>
                <Fld label="Divergence"><Sel value={data.divergenceP} onChange={set("divergenceP")} opts={[{v:"sans",l:"Sans divergence"},{v:"plus",l:"Plus risquée que recommandé"},{v:"moins",l:"Moins risquée que recommandé"}]} /></Fld>
                {data.divergenceP!=="sans" && <Row><Col><Fld label="Stratégie recommandée"><Inp value={data.recStratP} onChange={set("recStratP")} placeholder="ex : Équilibré" /></Fld></Col><Col><Fld label="Stratégie choisie"><Inp value={data.choixStratP} onChange={set("choixStratP")} placeholder="ex : Croissance" /></Fld></Col></Row>}
              </Card>
              <Card title="Durabilité (ESG)">
                <Fld label="Préférence ESG"><Sel value={data.esgP} onChange={set("esgP")} opts={[{v:"non",l:"Pas importante / sans attention particulière"},{v:"oui",l:"Oui, selon ESG"},{v:"pref",l:"Oui, sans préférence particulière"}]} /></Fld>
              </Card>
            </>)}
          </>)}
          {nav(2,4,false)}
        </>)}

        {/* STEP 4 — Prévoyance */}
        {step===4 && (<>
          <Card title="Prévoyance 3a — statut de l'entretien" accent>
            <StatusPicker aborde={data.prevoyanceAbordee} souscrit={data.prevoyanceSouscrite} onAborde={set("prevoyanceAbordee")} onSouscrit={set("prevoyanceSouscrite")} />
          </Card>
          {data.prevoyanceAbordee && !data.prevoyanceSouscrite && (
            <Card title="Prévoyance abordée — détails">
              <Fld label="Objectif de l'épargne 3a"><Inp value={data.objectif3a} onChange={set("objectif3a")} placeholder="ex : Améliorer la retraite et économies d'impôts" /></Fld>
              <Fld label="Raison pour laquelle aucun fonds 3a n'a été mis en place"><Txt value={data.prevoyanceRaisonNon} onChange={set("prevoyanceRaisonNon")} rows={3} placeholder="ex : Le client est encore étudiant et ne peut pas verser dans un 3a. Il est intéressé par une assurance-vie avec petite prime..." /></Fld>
            </Card>
          )}
          {data.prevoyanceAbordee && data.prevoyanceSouscrite && (<>
            <Card title="Compte & fonds souscrits">
              <Row>
                <Col><Fld label="N° compte prévoyance 3a"><Inp value={data.noCompte3a} onChange={set("noCompte3a")} placeholder="ex : 60-123456-7" /></Fld></Col>
                <Col><Fld label="Horizon de placement"><Sel value={data.horizonPrevo} onChange={set("horizonPrevo")} opts={["2-4 ans","5-8 ans","9-12 ans","plus de 12 ans"]} /></Fld></Col>
              </Row>
              <Fld label="Fonds de prévoyance PF">
                <Sel value={data.fondsPrevo} onChange={set("fondsPrevo")} opts={Object.keys(FONDS_NO).map(k=>({v:k,l:`${k}  (N° ${FONDS_NO[k]})`}))} />
              </Fld>
              <Fld label="Description de l'investissement"><Txt value={data.investPrev} onChange={set("investPrev")} rows={2} placeholder="ex : investir CHF 7'056 et placer tous les versements futurs dans le fonds sélectionné" /></Fld>
            </Card>
            <Card title="4 Pucks & objectif">
              <Fld label="Positions 4 Pucks (dépôt Self-Service)"><Txt value={data.positions4Pucks} onChange={set("positions4Pucks")} rows={3} placeholder="Détaillez les 4 pucks selon les documents PF..." /></Fld>
              <Fld label="Objectif de l'épargne 3a"><Inp value={data.objectif3a} onChange={set("objectif3a")} placeholder="ex : Retraite, achat immobilier, économies d'impôts" /></Fld>
            </Card>
            <Card title="Situation financière">
              <Row>
                <Col><Fld label="Situation"><Sel value={data.situationPrev} onChange={set("situationPrev")} opts={["saine","stable","confortable","excellente"]} /></Fld></Col>
                <Col><Fld label="Dettes"><Sel value={data.dettePrev} onChange={set("dettePrev")} opts={[{v:"particulière",l:"Aucune dette"},{v:"hypothèque",l:"Hormis hypothèque"},{v:"leasing",l:"Hormis leasing"},{v:"carteCredit",l:"Hormis carte crédit"}]} /></Fld></Col>
              </Row>
            </Card>
            <Card title="Profil investisseur & divergence">
              <Row>
                <Col><Fld label="Expérience"><Sel value={data.experiencePrev} onChange={set("experiencePrev")} opts={[{v:"avec",l:"Avec expérience"},{v:"sans",l:"Sans expérience"}]} /></Fld></Col>
                <Col><Fld label="Profil résultat (IP)"><Sel value={data.profilPrev} onChange={set("profilPrev")} opts={["Produit d'intérêts","Revenus","Équilibré","Croissance","Gain de capital"]} /></Fld></Col>
              </Row>
              <Fld label="Divergence"><Sel value={data.divergencePrev} onChange={set("divergencePrev")} opts={[{v:"sans",l:"Sans divergence"},{v:"plus",l:"Plus risquée que recommandé"},{v:"moins",l:"Moins risquée que recommandé"}]} /></Fld>
              {data.divergencePrev!=="sans" && <Row><Col><Fld label="Stratégie recommandée"><Inp value={data.recStratPrev} onChange={set("recStratPrev")} placeholder="ex : Équilibré" /></Fld></Col><Col><Fld label="Stratégie choisie"><Inp value={data.choixStratPrev} onChange={set("choixStratPrev")} placeholder="ex : Croissance" /></Fld></Col></Row>}
            </Card>
            <Card title="Durabilité (ESG)">
              <Fld label="Préférence ESG"><Sel value={data.esgPrev} onChange={set("esgPrev")} opts={[{v:"non",l:"Pas importante / sans attention particulière"},{v:"oui",l:"Oui, selon ESG"},{v:"pref",l:"Oui, sans préférence particulière"}]} /></Fld>
            </Card>
          </>)}
          {nav(3,5,false)}
        </>)}

        {/* STEP 5 — Résumé */}
        {step===5 && (<>
          {crmInfo}
          <Card title="Récapitulatif">
            <div style={{fontFamily:F,fontSize:12,lineHeight:2,color:C.g600}}>
              <strong style={{color:C.g900}}>{data.genre==="M"?"Monsieur":"Madame"} {data.nom}</strong><br/>
              Comptes privés : {data.comptesPrives.length} | Comptes épargne : {data.comptesEpargne.length} | Comptes 3a : {data.comptes3a.length}<br/>
              Placement :&nbsp;<span style={{fontWeight:700,color:data.placementSouscrit?C.green:data.placementAborde?C.orange:C.red}}>{data.placementSouscrit?"✓ Souscrit":data.placementAborde?"↻ Abordé, non souscrit":"— Non abordé"}</span>
              {data.placementSouscrit && <> — {data.produitPlacement}{isEO(data.produitPlacement)?" (EO)":` · ${data.axePlacement} · ${data.profilP}`}</>}<br/>
              Prévoyance :&nbsp;<span style={{fontWeight:700,color:data.prevoyanceSouscrite?C.green:data.prevoyanceAbordee?C.orange:C.red}}>{data.prevoyanceSouscrite?"✓ Souscrite":data.prevoyanceAbordee?"↻ Abordée, non souscrite":"— Non abordée"}</span>
              {data.prevoyanceSouscrite && <> — {data.fondsPrevo}</>}<br/>
              SmartPoints : {data.smartpoints||"—"}
            </div>
          </Card>
          <Card title="Résumé de mes recommandations" accent>
            <Fld label="Rédigez votre résumé personnalisé">
              <Txt value={data.resumeReco} onChange={set("resumeReco")} rows={6}
                placeholder={"ex : Diminuer ses avoirs du compte privé à CHF 5k\nOuverture d'un compte épargne avec 20k\nMise en place d'un 3a entre CHF 100 à 200/mois + plan d'épargne en fonds entre CHF 100 à 200/mois"} />
            </Fld>
          </Card>
          {nav(4,-1,true)}
        </>)}

        {/* RAPPORT FINAL */}
        {step===STEPS.length && report && (<>
          <div style={{padding:"16px 0 8px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <h2 style={{fontFamily:F,fontSize:20,fontWeight:700,color:C.g900,margin:0}}>Rapport généré</h2>
              <p style={{fontFamily:F,fontSize:12,color:C.g400,marginTop:3}}>Copiez le texte et collez-le dans votre CRM PostFinance.</p>
            </div>
            <PFLogo height={32} />
          </div>
          {/* Rendu visuel du rapport avec les **gras** rendus en HTML pour la preview */}
          <div style={{background:C.white,border:`1px solid ${C.g200}`,borderRadius:5,padding:"18px 20px",fontFamily:F,fontSize:12,lineHeight:1.8,color:C.g900,maxHeight:560,overflowY:"auto"}}>
            {report.split(/\r?\n/).map((line, i) => {
              // Rendu visuel des **titres** en gras pour la prévisualisation
              const rendered = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
              return (
                <div key={i} style={{minHeight:"1.1em"}}
                  dangerouslySetInnerHTML={{__html: rendered || "&nbsp;"}}
                />
              );
            })}
          </div>
          <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
            <button type="button" onClick={copy} style={{flex:1,minWidth:160,padding:"10px",background:copied?C.green:C.teal,color:C.white,border:"none",borderRadius:3,fontFamily:F,fontSize:13,fontWeight:700,cursor:"pointer",transition:"background 0.2s"}}>
              {copied?"✓ Copié !":"Copier le rapport"}
            </button>
            <BtnS onClick={()=>setStep(5)}>← Modifier</BtnS>
            <BtnS onClick={()=>{setData({...INIT});setReport("");setStep(0);}}>↺ Nouveau</BtnS>
          </div>
        </>)}

      </div>

      {/* PIED DE PAGE — Crédit */}
      <footer style={{borderTop:`1px solid ${C.g200}`,background:C.white,marginTop:40}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"20px",display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <PFLogo height={24} />
            <span style={{fontFamily:F,fontSize:11,color:C.g400}}>Outil interne — Rapport d'entretien clientèle privée</span>
          </div>
          <div style={{fontFamily:F,fontSize:12,color:C.g600}}>
            Conçu par{" "}
            <a href={CREDIT_URL} target="_blank" rel="noopener noreferrer"
               style={{color:C.teal,fontWeight:700,textDecoration:"none",borderBottom:`1.5px solid ${C.yellow}`}}>
              Develly Varela Sanches
            </a>
          </div>
        </div>
        <div style={{maxWidth:800,margin:"0 auto",padding:"0 20px 18px"}}>
          <p style={{fontFamily:F,fontSize:10,color:C.g400,lineHeight:1.6,margin:0}}>
            Logiciel open source distribué librement. PostFinance® est une marque de PostFinance SA ; cet outil n'est pas un produit officiel de PostFinance SA.
            Les données saisies ne sont jamais transmises à un serveur : tout reste dans votre navigateur.
          </p>
        </div>
      </footer>
    </div>
  );
}
