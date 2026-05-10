let DATA = JSON.parse(localStorage.getItem('historia_data') || 'null') || {
  sections: [
    {
      id: 1, name: "HTML — Grunderna", cat: "red",
      subs: [
        { title: "Grundstruktur", content: "<!DOCTYPE html> deklarerar dokumenttypen. <html lang='sv'> är rotelementet. I <head> länkas CSS och JS. I <body> är allt synligt innehåll.\n\nLänka CSS: <link rel='stylesheet' href='style.css'>\nLänka JS: <script src='script.js' defer><\/script>" },
        { title: "Vanliga element", content: "h1–h3: rubriker\np: stycke\na: länk (href-attribut)\nul/ol + li: listor\ntable > tr > th/td: tabeller\nimg: bild (src, alt)\ndiv: block-behållare\nspan: inline-behållare\nbutton, input, label: formulär" },
        { title: "Block vs inline", content: "Block-element tar hela bredden: div, p, h1, table, ul\nInline-element tar bara så mycket plats som innehållet behöver: span, a, strong, em, img" }
      ]
    },
    {
      id: 2, name: "CSS — Selektorer & boxmodell", cat: "green",
      subs: [
        { title: "Selektorer", content: "Typ: p { }\nKlass: .röd { }\nID: #header { }\nAvkomling: div p { } — väljer p inuti div\nBarn: div > p { } — väljer direkt barn\nNästa syskon: h2 + p { }\nEfterkommande: h2 ~ p { }\nAttribut: input[type='text'] { }" },
        { title: "Specificitet", content: "Starkast: #id (100 poäng)\nMitten: .klass (10 poäng)\nSvagast: element p (1 poäng)\n\nDen regel med flest poäng vinner vid konflikt!" },
        { title: "Boxmodellen", content: "Utifrån in:\nmargin — utrymme utanför elementet\nborder — kanten runt elementet\npadding — utrymme inuti, mellan kant och innehåll\ncontent — själva innehållet\n\nKom ihåg: margin > border > padding > content" },
        { title: "Pseudoklasser", content: ":hover — när musen är över\n:nth-child(n) — n:te barnet\n:nth-last-child(n) — bakifrån\n:nth-of-type(n) — n:te av sin typ\n:not(.klass) — allt som inte har klassen\n:is(h1, h2) — matchar flera\n:has(p) — förälder som har p-barn\n\nPseudoelement:\n::first-letter\n::before\n::after" }
      ]
    },
    {
      id: 3, name: "JavaScript — DOM & Events", cat: "yellow",
      subs: [
        { title: "Hämta element", content: "const el = document.querySelector('.klass');\nconst alla = document.querySelectorAll('p');" },
        { title: "Ändra element", content: "el.textContent = 'Ny text';\nel.innerHTML = '<b>Fet</b>';\nel.style.color = 'red';\nel.classList.add('aktiv');\nel.classList.remove('aktiv');\nel.setAttribute('href', 'https://...');" },
        { title: "Skapa & ta bort", content: "const p = document.createElement('p');\np.textContent = 'Hej';\ndocument.body.append(p);\np.remove();" },
        { title: "Event listeners", content: "knapp.addEventListener('click', function() {\n  // körs vid klick\n});\n\nVanliga events: click, input, change, submit, mouseover\n\nFormulär: input.value ger det skrivna värdet" }
      ]
    }
  ],
  cards: [
    { id: 1, type: "flash", topic: "HTML", q: "Vad gör defer i <script defer>?", a: "Skriptet laddas men körs först när HTML-dokumentet är klart — undviker att JS körs innan element finns i DOM." },
    { id: 2, type: "flash", topic: "CSS", q: "Vad är skillnaden mellan margin och padding?", a: "Margin är utrymmet UTANFÖR elementets kant. Padding är utrymmet INUTI elementets kant, mellan kanten och innehållet." },
    { id: 3, type: "flash", topic: "CSS", q: "Vilket är starkast — ID, klass eller elementväljare?", a: "ID (#id) är starkast (100p), sedan klass (.klass, 10p), sedan elementväljare (p, 1p)." },
    { id: 4, type: "q", topic: "JavaScript", q: "Skriv JS-kod som gör att en knapp ändrar färg på ett stycke till blå när man klickar.", a: "const knapp = document.querySelector('button');\nconst text = document.querySelector('p');\nknapp.addEventListener('click', function() {\n  text.style.color = 'blue';\n});", hint1: "Tänk: querySelector, addEventListener, style.color", hint2: "Du behöver tre rader: hämta knappen, hämta stycket, lyssna på klick och ändra .style.color" },
    { id: 5, type: "q", topic: "HTML", q: "Skriv HTML-grundstrukturen med korrekt länkning av style.css och script.js.", a: "<!DOCTYPE html>\n<html lang='sv'>\n<head>\n  <meta charset='UTF-8'>\n  <title>Titel</title>\n  <link rel='stylesheet' href='style.css'>\n  <script src='script.js' defer><\/script>\n<\/head>\n<body>\n\n<\/body>\n<\/html>", hint1: "Glöm inte defer på script-taggen!", hint2: "link-taggen för CSS går i head. Script-taggen med defer kan också ligga i head." }
  ]
};

let nextSecId = Math.max(...DATA.sections.map(s => s.id), 0) + 1;
let nextCardId = Math.max(...DATA.cards.map(c => c.id), 0) + 1;

function save() {
  localStorage.setItem('historia_data', JSON.stringify(DATA));
}

/* NAV */
function goTo(page, tab) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  tab.classList.add('active');
  if (page === 'flash') renderFlash();
  if (page === 'ovning') renderOvning();
}

/* PAGE 1 — INFO */
function renderSections() {
  const list = document.getElementById('sections-list');
  list.innerHTML = DATA.sections.map(sec => `
    <div class="section">
      <div class="section-header" onclick="toggleSec(this)" data-id="${sec.id}">
        <div class="section-label">
          <span class="section-pill ${sec.cat === 'green' ? 'green' : sec.cat === 'yellow' ? 'yellow' : ''}">
            ${sec.cat === 'red' ? 'Viktigt' : sec.cat === 'green' ? 'Lär dig' : 'Extra'}
          </span>
          <span class="section-title-text">${sec.name}</span>
        </div>
        <span class="section-arrow">▾</span>
      </div>
      <div class="section-body">
        ${sec.subs.map(sub => `
          <div class="subsection">
            <h3>${sub.title}</h3>
            <pre style="white-space:pre-wrap;font-family:'DM Sans',sans-serif;font-size:0.92rem;line-height:1.7">${sub.content}</pre>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function toggleSec(header) {
  const body = header.nextElementSibling;
  header.classList.toggle('open');
  body.classList.toggle('open');
}

/* SECTION MODAL */
function openModal() {
  document.getElementById('sec-name').value = '';
  document.getElementById('sec-cat').value = 'red';
  document.getElementById('subsections-inputs').innerHTML = `
    <label>Underavsnitt 1 — titel</label>
    <input type="text" class="sub-title" placeholder="t.ex. Orsaker">
    <label>Underavsnitt 1 — innehåll</label>
    <textarea class="sub-content" placeholder="Skriv fakta här..."></textarea>
  `;
  document.getElementById('modal-section').classList.add('open');
}

function addSubInput() {
  const wrap = document.getElementById('subsections-inputs');
  const n = wrap.querySelectorAll('.sub-title').length + 1;
  wrap.insertAdjacentHTML('beforeend', `
    <label>Underavsnitt ${n} — titel</label>
    <input type="text" class="sub-title" placeholder="t.ex. Konsekvenser">
    <label>Underavsnitt ${n} — innehåll</label>
    <textarea class="sub-content" placeholder="Skriv fakta här..."></textarea>
  `);
}

function saveSection() {
  const name = document.getElementById('sec-name').value.trim();
  if (!name) return alert('Skriv ett ämnesnamn!');
  const cat = document.getElementById('sec-cat').value;
  const titles = [...document.querySelectorAll('.sub-title')].map(i => i.value.trim());
  const contents = [...document.querySelectorAll('.sub-content')].map(i => i.value.trim());
  const subs = titles.map((t, i) => ({ title: t || 'Avsnitt', content: contents[i] || '' }));
  DATA.sections.push({ id: nextSecId++, name, cat, subs });
  save();
  renderSections();
  closeModal('modal-section');
}

/* CARD MODAL */
function openCardModal() {
  document.getElementById('card-type').value = 'flash';
  document.getElementById('card-topic').value = '';
  document.getElementById('card-q').value = '';
  document.getElementById('card-a').value = '';
  document.getElementById('card-hint1').value = '';
  document.getElementById('card-hint2').value = '';
  document.getElementById('card-hints-wrap').style.display = 'none';
  document.getElementById('card-type').onchange = function () {
    document.getElementById('card-hints-wrap').style.display = this.value === 'q' ? 'block' : 'none';
  };
  document.getElementById('modal-card').classList.add('open');
}

function saveCard() {
  const type = document.getElementById('card-type').value;
  const topic = document.getElementById('card-topic').value.trim();
  const q = document.getElementById('card-q').value.trim();
  const a = document.getElementById('card-a').value.trim();
  if (!q || !a) return alert('Fyll i fråga och svar!');
  const card = { id: nextCardId++, type, topic: topic || 'Övrigt', q, a };
  if (type === 'q') {
    card.hint1 = document.getElementById('card-hint1').value.trim();
    card.hint2 = document.getElementById('card-hint2').value.trim();
  }
  DATA.cards.push(card);
  save();
  updateFcFilter();
  closeModal('modal-card');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

/* FLASHCARDS */
let fcCards = [], fcIdx = 0, fcCorrect = 0, fcTotal = 0;

function updateFcFilter() {
  const sel = document.getElementById('fc-filter');
  const cur = sel.value;
  const topics = [...new Set(DATA.cards.filter(c => c.type === 'flash').map(c => c.topic))];
  sel.innerHTML = '<option value="all">Alla ämnen</option>' +
    topics.map(t => `<option value="${t}" ${t === cur ? 'selected' : ''}>${t}</option>`).join('');
}

function renderFlash() {
  updateFcFilter();
  initFlash();
}

function initFlash() {
  const filter = document.getElementById('fc-filter').value;
  let pool = DATA.cards.filter(c => c.type === 'flash');
  if (filter !== 'all') pool = pool.filter(c => c.topic === filter);
  fcCards = pool.sort(() => Math.random() - 0.5);
  fcIdx = 0; fcCorrect = 0; fcTotal = 0;
  renderFcScore();
  showFcCard();
}

function showFcCard() {
  const inner = document.getElementById('fc-inner');
  inner.classList.remove('flipped');
  const empty = document.getElementById('fc-empty');
  if (fcCards.length === 0) {
    empty.style.display = 'block';
    document.querySelector('.fc-wrap').style.display = 'none';
    document.querySelector('.fc-nav').style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  document.querySelector('.fc-wrap').style.display = 'block';
  document.querySelector('.fc-nav').style.display = 'flex';
  const c = fcCards[fcIdx];
  document.getElementById('fc-q').textContent = c.q;
  document.getElementById('fc-a').textContent = c.a;
  document.getElementById('fc-progress').textContent = `Kort ${fcIdx + 1} av ${fcCards.length}`;
}

function flipCard() {
  document.getElementById('fc-inner').classList.toggle('flipped');
}

function fcNav(dir) {
  fcIdx = (fcIdx + dir + fcCards.length) % fcCards.length;
  showFcCard();
}

function markCorrect(yes) {
  fcTotal++;
  if (yes) fcCorrect++;
  renderFcScore();
  fcNav(1);
}

function renderFcScore() {
  const pct = fcTotal > 0 ? Math.round(fcCorrect / fcTotal * 100) : 0;
  document.getElementById('fc-fill').style.width = pct + '%';
  const txt = document.getElementById('fc-score-txt');
  txt.textContent = fcTotal > 0 ? pct + '%' : '–';
  txt.className = 'score-num ' + (pct >= 80 ? 'good' : fcTotal > 0 ? 'bad' : '');
}

/* ÖVNING */
let qCards = [], qIdx = 0, qCorrect = 0, qTotal = 0;

function renderOvning() {
  qCards = DATA.cards.filter(c => c.type === 'q').sort(() => Math.random() - 0.5);
  qIdx = 0; qCorrect = 0; qTotal = 0;
  renderQScore();
  showQ();
}

function showQ() {
  const wrap = document.getElementById('q-area-wrap');
  const empty = document.getElementById('q-empty');
  if (qCards.length === 0) { empty.style.display = 'block'; wrap.innerHTML = ''; return; }
  empty.style.display = 'none';
  const c = qCards[qIdx];
  wrap.innerHTML = `
    <div class="q-area">
      <div class="q-meta">Fråga ${qIdx + 1} av ${qCards.length} — ${c.topic}</div>
      <div class="q-text">${c.q}</div>
    </div>
    <div class="hint-btns">
      ${c.hint1 ? `<button class="hint-btn little" onclick="showHint('small')">💡 Liten ledtråd</button>` : ''}
      ${c.hint2 ? `<button class="hint-btn much" onclick="showHint('big')">🔦 Stor ledtråd</button>` : ''}
    </div>
    <div class="hint-box" id="hint-box">${c.hint1 || ''}</div>
    <div class="hint-box big" id="hint-box-big">${c.hint2 || ''}</div>
    <div class="answer-area">
      <textarea id="ans-input" placeholder="Skriv ditt svar här..."></textarea>
    </div>
    <div class="feedback" id="q-feedback"></div>
    <div class="q-actions">
      <button class="check-btn" onclick="checkAnswer()">Kolla svaret</button>
      <button class="next-btn" onclick="nextQ()">Nästa fråga →</button>
    </div>
  `;
}

function showHint(size) {
  const c = qCards[qIdx];
  if (size === 'small') {
    const b = document.getElementById('hint-box');
    b.textContent = c.hint1;
    b.classList.toggle('show');
  } else {
    const b = document.getElementById('hint-box-big');
    b.textContent = c.hint2;
    b.classList.toggle('show');
  }
}

function checkAnswer() {
  const ans = document.getElementById('ans-input').value.trim();
  if (!ans) return;
  const c = qCards[qIdx];
  const fb = document.getElementById('q-feedback');
  fb.innerHTML = `<strong>Facit:</strong><br><pre style="white-space:pre-wrap;font-family:'DM Sans',sans-serif;font-size:0.88rem;margin-top:0.4rem">${c.a}</pre>`;
  fb.className = 'feedback show incorrect';
}

function nextQ() {
  const ansEl = document.getElementById('ans-input');
  const ans = ansEl ? ansEl.value.trim() : '';
  const fb = document.getElementById('q-feedback');
  if (fb && fb.classList.contains('show') && ans) {
    if (confirm('Räkna det som rätt?')) { qCorrect++; }
    qTotal++;
  }
  qIdx = (qIdx + 1) % qCards.length;
  renderQScore();
  showQ();
}

function renderQScore() {
  const pct = qTotal > 0 ? Math.round(qCorrect / qTotal * 100) : 0;
  document.getElementById('q-fill').style.width = pct + '%';
  const txt = document.getElementById('q-score-txt');
  txt.textContent = qTotal > 0 ? `${qCorrect}/${qTotal} (${pct}%)` : '–';
  txt.className = 'score-num ' + (pct >= 80 ? 'good' : qTotal > 0 ? 'bad' : '');
}

/* INIT */
renderSections();
updateFcFilter();
initFlash();
