/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'autoscuola-viale-ungheria',
    /* nessun WhatsApp: il fisso della scheda Google (su Facebook segnato come «Cellulare») */
    whatsapp: { number: '', message: '', ids: [] },
    /* la scheda Google (tabella, 1/10/2026): lun–ven 9–12:30 e 15–19:30, sabato 9–12:30, domenica chiuso */
    hours: {
      0: [], 1: [['09:00', '12:30'], ['15:00', '19:30']], 2: [['09:00', '12:30'], ['15:00', '19:30']], 3: [['09:00', '12:30'], ['15:00', '19:30']],
      4: [['09:00', '12:30'], ['15:00', '19:30']], 5: [['09:00', '12:30'], ['15:00', '19:30']], 6: [['09:00', '12:30']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1060,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "L’Autoscuola del Viale Ungheria: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.servizi": "Specialists in",
      "n.percorso": "The route",
      "n.sede": "Our school",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "h.sotto": "Licences · Renewals · Vehicle paperwork",
      "h.dal": "Since 2001",
      "h.sopra": "Viale Ungheria 24, Milan",
      "h.testo": "The licence for cars and motorbikes, theory in class or online, driving lessons with our instructors; and then renewals and vehicle paperwork. Our motto: teaching people to take on the road.",
      "h.voto": "on Google, 181 reviews",
      "h.chi": "Michela B., in a review on Google (in English: «A well-organised driving school, for both theory lessons and driving lessons. Highly qualified staff, always available! By far the best in the area»)",
      "p.titolo": "The road-letter A",
      "p.desc": "The A of our logo is a piece of road: asphalt, a grey edge and a dashed centre line. It gets paved from the left foot up to the top and down to the right foot, then the centre line and the crossbar appear; then the school car, with the «Scuola guida» sign on the roof, or the motorbike drives all of it in its lane, and on arrival turns on the indicators.",
      "p.d0": "Category B licence: the school car, with the sign on the roof, drives the whole A.",
      "p.d1": "Category A licence: the motorbike drives the whole A, bends included.",
      "p.modi": "What you drive",
      "p.b0": "Car",
      "p.b1": "Motorbike",
      "p.nota": "The A on our sign is a piece of road: it was already there in 2001, on the U of «Ungheria».",
      "s.etichetta": "Specialists in",
      "s.titolo": "Just like our shop window",
      "s.c1": "Licences",
      "s.c1t": "For cars (B) and motorbikes (A). Theory in class or online, the quizzes on the app, driving lessons with our instructors until you are ready.",
      "s.c2": "Renewals",
      "s.c2t": "Renewing your driving licence: call us or drop in, we will tell you what you need.",
      "s.c3": "Vehicle paperwork",
      "s.c3t": "We are also a vehicle paperwork agency: ask us for the one you need.",
      "s.nota": "No prices here: for a quote, call us or drop in on Viale Ungheria.",
      "c.etichetta": "The route",
      "c.titolo": "From enrolment to the licence",
      "c.frase": "On average, getting your licence takes between 2 and 6 months. This is the road.",
      "c.t1": "Enrolment",
      "c.t1t": "Drop in with an ID document: we will tell you what else is needed. We take care of the rest!",
      "c.t2": "Theory",
      "c.t2t": "Lessons in class or online, and the quizzes on the app to practise whenever you like.",
      "c.t3": "Theory exam",
      "c.t3t": "At the Motorizzazione (the licensing office). Once you pass, you get the «foglio rosa» (learner’s permit) and start driving.",
      "c.t4": "Driving lessons",
      "c.t4t": "By car or by motorbike with our instructors, calmly, until you are ready for the exam.",
      "c.t5": "Driving test",
      "c.t5t": "With the examiner from the Motorizzazione Civile. And then you are off.",
      "k.etichetta": "Our school",
      "k.titolo": "The shop window, the classroom, the car",
      "a.vetrina": "Our shop window at Viale Ungheria 24: the sign with the road-letter A, the window stickers «Specialisti in: patenti, rinnovi, pratiche auto», the open glass door.",
      "k.vetrina": "The shop window, at Viale Ungheria 24",
      "a.aula": "The theory classroom with its rows of blue chairs.",
      "k.aula": "The theory classroom",
      "a.auto": "The school car, blue, with the «Scuola guida» sign on the tailgate, on an autumn avenue.",
      "k.auto": "The school car",
      "a.cartello": "The «Scuola guida» sign on the blue roof of the car, reflecting the trees.",
      "k.cartello": "The sign on the roof",
      "a.vista": "In the classroom: the letter chart for the eye test, the headphones, the reflectors and a model motorbike on the shelf.",
      "k.vista": "The classroom wall",
      "t1.etichetta": "Since 2001",
      "t1.titolo": "On 29 October we turn 25",
      "t1.q1": "29 October 2001",
      "t1.t1": "We open on Viale Ungheria. On the sign, the U of «Ungheria» is already a piece of road, with a red car on it.",
      "t1.q2": "29 October 2019",
      "t1.t2": "«We have come of age […] And for the occasion we decided to get a new look! From today we are the Autoscuola del Viale Ungheria!» New name, new shop window, and the road moves onto the A.",
      "t1.q3": "29 October 2026",
      "t1.t3": "Twenty-five years of driving licences, on Viale Ungheria of course.",
      "t1.frase": "«With us, getting your licence will be a continuous lesson, not only in theory […]. All this without ever forgetting fun, laughter and the odd little party now and then!»",
      "d.etichetta": "Reviews",
      "d.titolo": "Who got their licence with us",
      "d.voto": "on Google, 181 reviews",
      "d.t26": "Google, 2026",
      "d.t25": "Google, 2025",
      "d.nota": "From the reviews on Google, in Italian, as they were written. The line at the top comes from another student, also on Google.",
      "d.tutte": "All the reviews on Google",
      "r.etichetta": "Hours and where",
      "r.titolo": "Morning and afternoon, Saturday mornings",
      "r.testa": "Office",
      "r.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "r.chiuso": "closed",
      "r.nota": "Hours from our Google listing (October 2026). We close for holidays in August: we post it on Facebook and Instagram.",
      "w.mappa": "Map: L’Autoscuola del Viale Ungheria, Viale Ungheria 24, Milan",
      "w.dove": "Where",
      "w.dovev": "Viale Ungheria 24, 20138 Milan",
      "w.tram": "By tram",
      "w.tramv": "the 27, stop Viale Ungheria, about 160 metres away (it goes to the centre, as far as Piazza Fontana)",
      "w.bus": "By bus",
      "w.busv": "the 66 and the 88 at the Viale Ungheria stop, about 130 metres away (the 88 goes to Rogoredo, M3 and trains); the 45 and the 175 about 280",
      "w.tel": "Phone",
      "w.mail": "Email",
      "w.social": "Social",
      "f2.riga": "Licences · Renewals · Vehicle paperwork · since 2001",
      "f2.orario": "Monday–Friday 9 am–12:30 pm and 3–7:30 pm · Saturday 9 am–12:30 pm · Sunday closed",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · hours, rating and reviews from the Google listing (October 2026); the photos from their Facebook Page and their old website; the history and their words from their old website and their Page. We redrew the road-letter A ourselves, from their sign.",
      "f2.su": "Back to the top"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ L'AUTOSCUOLA DEL VIALE UNGHERIA — Viale Ungheria 24 ══════════
     la FIRMA — «la A-strada»: la A del loro logo è un pezzo di strada. Si asfalta dal piede sinistro su in cima e giù al piede
     destro, compaiono la mezzeria e la traversa; poi il mezzo della scuola (Auto: la patente B, col cartello sul tetto; Moto: la A)
     la percorre tutta nella sua corsia e all'arrivo mette le frecce. Lo stato è M (il mezzo), T (0…1) e V (0 al suo posto; fino a 1
     la A esce a destra; da −1 a 0 entra da sinistra la prossima, da asfaltare). Senza JS e alla fine: Auto, T = 1, V = 0 (l'HTML).
     L'attesa (classe nell'head): la A da asfaltare, il mezzo fermo al piede sinistro. Reduced-motion: tutto subito. rAF a tempo,
     guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[560,560],"via":600,"fasi":{"strada":{"t":0.04,"d":0.26},"segni":{"t":0.3,"d":0.08},"guida":{"t":0.38,"d":0.5},"frecce":{"t":0.9,"d":0.1}},"lunghezza":897,"corsia":22,"tratto":[0.047,0.944],"percorso":[[130,505,-76.7],[131.3,499.6,-76.7],[132.6,494.1,-76.7],[133.9,488.7,-76.7],[135.1,483.2,-76.7],[136.4,477.8,-76.7],[137.7,472.4,-76.7],[139,466.9,-76.7],[140.3,461.5,-76.7],[141.6,456,-76.7],[142.9,450.6,-76.7],[144.2,445.2,-76.7],[145.4,439.7,-76.7],[146.7,434.3,-76.7],[148,428.8,-76.7],[149.3,423.4,-76.7],[150.6,418,-76.7],[151.9,412.5,-76.7],[153.2,407.1,-76.7],[154.5,401.6,-76.7],[155.7,396.2,-76.7],[157,390.8,-76.7],[158.3,385.3,-76.7],[159.6,379.9,-76.7],[160.9,374.4,-76.7],[162.2,369,-76.7],[163.5,363.6,-76.7],[164.8,358.1,-76.7],[166,352.7,-76.7],[167.3,347.2,-76.7],[168.6,341.8,-76.7],[169.9,336.4,-76.7],[171.2,330.9,-76.7],[172.5,325.5,-76.7],[173.8,320,-76.7],[175.1,314.6,-76.7],[176.3,309.2,-76.7],[177.6,303.7,-76.7],[178.9,298.3,-76.7],[180.2,292.8,-76.7],[181.5,287.4,-76.7],[182.8,282,-76.7],[184.1,276.5,-76.7],[185.4,271.1,-76.7],[186.6,265.6,-76.7],[187.9,260.2,-76.7],[189.2,254.7,-76.7],[190.5,249.3,-76.7],[191.8,243.9,-76.7],[193.1,238.4,-76.7],[194.4,233,-76.7],[195.7,227.5,-76.7],[196.9,222.1,-76.7],[198.2,216.7,-76.7],[199.5,211.2,-76.7],[200.8,205.8,-76.7],[202.1,200.3,-76.7],[203.4,194.9,-76.7],[204.7,189.5,-76.7],[205.9,184,-76.7],[207.2,178.6,-76.7],[208.5,173.1,-76.7],[209.8,167.7,-76.7],[211.1,162.3,-76.7],[212.4,156.8,-76.7],[213.7,151.4,-76.7],[215.1,146,-73.3],[217,140.7,-67.7],[219.4,135.7,-60.7],[222.5,131,-52.1],[226.3,126.9,-42.7],[230.7,123.5,-32.2],[235.6,120.9,-22.5],[241,119.2,-13.6],[246.5,118.3,-6.2],[252,118,0],[257.6,118,0],[263.2,118,0],[268.8,118,0],[274.4,118,0],[280,118,0],[285.6,118,0],[291.2,118,0],[296.8,118,0],[302.4,118,0],[308,118,0],[313.5,118.3,6.2],[319,119.2,13.6],[324.4,120.9,22.5],[329.3,123.5,32.2],[333.7,126.9,42.7],[337.5,131,52.1],[340.6,135.7,60.7],[343,140.7,67.7],[344.9,146,73.3],[346.3,151.4,76.7],[347.6,156.8,76.7],[348.9,162.3,76.7],[350.2,167.7,76.7],[351.5,173.1,76.7],[352.8,178.6,76.7],[354.1,184,76.7],[355.3,189.5,76.7],[356.6,194.9,76.7],[357.9,200.3,76.7],[359.2,205.8,76.7],[360.5,211.2,76.7],[361.8,216.7,76.7],[363.1,222.1,76.7],[364.3,227.5,76.7],[365.6,233,76.7],[366.9,238.4,76.7],[368.2,243.9,76.7],[369.5,249.3,76.7],[370.8,254.7,76.7],[372.1,260.2,76.7],[373.4,265.6,76.7],[374.6,271.1,76.7],[375.9,276.5,76.7],[377.2,282,76.7],[378.5,287.4,76.7],[379.8,292.8,76.7],[381.1,298.3,76.7],[382.4,303.7,76.7],[383.7,309.2,76.7],[384.9,314.6,76.7],[386.2,320,76.7],[387.5,325.5,76.7],[388.8,330.9,76.7],[390.1,336.4,76.7],[391.4,341.8,76.7],[392.7,347.2,76.7],[394,352.7,76.7],[395.2,358.1,76.7],[396.5,363.6,76.7],[397.8,369,76.7],[399.1,374.4,76.7],[400.4,379.9,76.7],[401.7,385.3,76.7],[403,390.8,76.7],[404.3,396.2,76.7],[405.5,401.6,76.7],[406.8,407.1,76.7],[408.1,412.5,76.7],[409.4,418,76.7],[410.7,423.4,76.7],[412,428.8,76.7],[413.3,434.3,76.7],[414.6,439.7,76.7],[415.8,445.2,76.7],[417.1,450.6,76.7],[418.4,456,76.7],[419.7,461.5,76.7],[421,466.9,76.7],[422.3,472.4,76.7],[423.6,477.8,76.7],[424.9,483.2,76.7],[426.1,488.7,76.7],[427.4,494.1,76.7],[428.7,499.6,76.7],[430,505,76.7]],"modi":[{"nome":"Auto"},{"nome":"Moto"}],"tempi":{"inizio":300,"astrada":6400,"servi":480,"arriva":520,"astradaV":5800}};
  /* la A-strada a (M, T, V) — una sola fonte: la usano _avu_firma.mjs (l'HTML allo stato finale), main.js (via avu_main.cjs) e la
     prova (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS).
     La A del loro logo è un pezzo di strada: asfalto, bordo grigio, mezzeria tratteggiata. Si asfalta dal piede sinistro su fino in
     cima e giù fino al piede destro; poi compaiono la mezzeria e la traversa; poi il mezzo della scuola (l'auto per la B, la moto per
     la A) la percorre tutta nella sua corsia, rallentando nelle curve in cima, e all'arrivo mette le frecce. Col V la A esce a destra;
     la prossima, da asfaltare, entra da sinistra. */
  function creaAstrada(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w.t + w.d - 1e-9 ? 1 : c01((t - w.t) / w.d); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var q1 = function (c) { return svg.querySelector('.' + c); };
    var servito = q1('servito'), asfalto = q1('ve-asfalto'), mezzeria = q1('ve-mezzeria'), traversa = q1('ve-traversa');
    var mezzi = D.modi.map(function (_, m) { return svg.querySelector('.ve-mezzo[data-m="' + m + '"]'); });
    var frecce = D.modi.map(function (_, m) { return svg.querySelector('.ve-frecce[data-m="' + m + '"]'); });
    /* il punto del percorso a una distanza: i campioni sono a passi uguali (D.percorso: [x, y, angolo in gradi]) */
    function punto(s) {
      var P = D.percorso, n = P.length - 1, k = c01(s) * n, i = Math.min(n - 1, Math.floor(k)), f = k - i;
      return [P[i][0] + (P[i + 1][0] - P[i][0]) * f, P[i][1] + (P[i + 1][1] - P[i][1]) * f, P[i][2] + (P[i + 1][2] - P[i][2]) * f];
    }
    function disegna(m, t, v) {
      var F = D.fasi;
      /* 1. si asfalta: il bordo e l'asfalto si scoprono lungo la A, dal piede sinistro */
      asfalto.setAttribute('stroke-dashoffset', r1(D.lunghezza * (1 - dolce(fase(t, F.strada)))));
      /* 2. la mezzeria e la traversa */
      var s = r3(dolce(fase(t, F.segni)));
      mezzeria.setAttribute('opacity', s);
      traversa.setAttribute('opacity', s);
      /* 3. il mezzo percorre la A nella sua corsia (a destra della mezzeria) */
      /* dal tratto D.tratto[0] al D.tratto[1]: il mezzo parte e arriva tutto sull'asfalto */
      var p = punto(D.tratto[0] + (D.tratto[1] - D.tratto[0]) * dolce(fase(t, F.guida))), a = p[2] * Math.PI / 180, o = D.corsia;
      mezzi[m].setAttribute('transform', 'translate(' + r1(p[0] - o * Math.sin(a)) + ' ' + r1(p[1] + o * Math.cos(a)) + ') rotate(' + r1(p[2] + 90) + ')');
      /* 4. all'arrivo le frecce: due lampeggi */
      var f = fase(t, F.frecce);
      frecce[m].setAttribute('opacity', f > 0 && f < 1 && (f * 2) % 1 < 0.5 ? '1' : '0');
      /* col V la A esce a destra; la prossima entra da sinistra */
      servito.setAttribute('transform', 'translate(' + r1(D.via * v) + ' 0)');
    }
    var completo = !!(servito && asfalto && mezzeria && traversa) && mezzi.every(Boolean) && frecce.every(Boolean);
    return { disegna: disegna, pezzi: { mezzi: mezzi, frecce: frecce }, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('astrada-firma'), svgF = prendi('astradaSvg'), leggiF = prendi('astradaLeggi');
  var ASTRADA = svgF ? creaAstrada(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.astrada__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.astrada__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    ASTRADA.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) ASTRADA.disegna(k, 1, 0); });
    ASTRADA.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta la A da asfaltare */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: la A da asfaltare */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.astrada, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.astrada });
  }
  /* il gesto: scegliere con che cosa si guida. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è,
     la A esce a destra, entra da sinistra la prossima da asfaltare, e si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.astradaV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && ASTRADA && ASTRADA.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaAstrada); } catch (e) {}
    window.__astrada = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__astrada.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta la A da asfaltare */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__astrada.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
