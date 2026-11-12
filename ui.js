/* CareLink – reusable UI components */
const ICONS = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  chart: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  qr: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20h1"/>',
  back: '<polyline points="15 18 9 12 15 6"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  clipboard: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
  send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  mail: '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  heartless: '<circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/>',
};
function icon(n, s = 20) { return `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`; }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
const LOGO = '<img src="logo.png" alt="CareLink">';

/* status badge: icon + text (never colour only) */
const ST_ICON = { pending: 'clock', confirmed: 'check', waitlisted: 'list', checkedin: 'pin', completed: 'award', cancelled: 'x', draft: 'edit', published: 'check', closed: 'lock', verified: 'check', unconfirmed: 'info', inprogress: 'clock', confirmedp: 'check', requested: 'alert' };
function badge(st, label) { return `<span class="badge b-${st === 'confirmed' && label === 'p' ? 'confirmedp' : st}">${icon(ST_ICON[st] || 'info', 13)} ${label && label !== 'p' ? label : T('st.' + st)}</span>`; }
function partnerBadge(hid) { const p = partner(hid); return `<span class="badge b-${p === 'confirmed' ? 'confirmedp' : p === 'inprogress' ? 'pending' : 'unconfirmed'}">${icon(p === 'confirmed' ? 'check' : p === 'inprogress' ? 'clock' : 'info', 13)} ${T('partner.' + p)}</span>`; }

function metric(label, value, ic) { return `<div class="metric"><div class="i">${icon(ic, 20)}</div><div class="v">${value}</div><div class="l">${label}</div></div>`; }
function empty(ic, title, msg, btn) { return `<div class="empty"><div class="ic-big">${icon(ic, 32)}</div><h3>${title}</h3><p>${msg || ''}</p>${btn ? `<div style="margin-top:14px">${btn}</div>` : ''}</div>`; }
function skeleton(n = 3) { return Array.from({ length: n }, () => '<div class="skeleton"></div>').join(''); }
function demoNote(key) { return `<div class="demo-note">${icon('info', 16)}<span>${T(key || 'demo.note')}</span></div>`; }
function field(label, inner, err, id) { return `<div class="field"><label${id ? ` for="${id}"` : ''}>${label}</label>${inner}${err ? `<div class="err" role="alert">${icon('alert', 14)} ${err}</div>` : ''}</div>`; }
function chip(act, data, label, on, extra = '') { return `<button type="button" class="chip" data-act="${act}" ${data} aria-pressed="${on ? 'true' : 'false'}" ${extra}>${on ? icon('check', 14) : ''}${label}</button>`; }
function langToggle() { return `<div class="seg-lang" role="group" aria-label="Language / Ngôn ngữ"><button type="button" data-act="lang" data-l="vi" aria-pressed="${LANG === 'vi'}">VI</button><button type="button" data-act="lang" data-l="en" aria-pressed="${LANG === 'en'}">EN</button></div>`; }
function initials(n) { const p = n.trim().split(/\s+/); return (p[p.length - 1][0] || '?').toUpperCase(); }

function slotsLabel(o) {
  const rem = remainingTotal(o), cap = capTotal(o);
  if (rem <= 0) return `<span class="slots low">${T('slots.full')}</span>`;
  return `<span class="slots ${rem <= 2 ? 'low' : ''}">${T('slots.left', rem, cap)}<span class="pill-demo">${T('demo.tag')}</span></span>`;
}
function timeRange(o) {
  if (o.shifts.length === 1) return `${o.shifts[0].start}–${o.shifts[0].end}`;
  const a = o.shifts.map(s => s.start).sort()[0], b = o.shifts.map(s => s.end).sort().slice(-1)[0];
  return `${a}–${b} · ${T('shifts.n', o.shifts.length)}`;
}
function oppCard(o, why) {
  const h = hosp(o.hid), r = myRegFor(o.id), c = CATS[o.cat];
  return `<article class="card opp" data-act="open" data-to="#/opp/${o.id}" tabindex="0" role="link" aria-label="${esc(L(o.title))}">
    <div class="opp-top"><span class="cat">${icon(c.icon, 14)} ${L(c.name)}</span>${r ? badge(dispStatus(r)) : ''}</div>
    <h3>${esc(L(o.title))}</h3>
    <div class="meta">${icon('building', 15)} ${h.name}</div>
    <div class="meta">${icon('pin', 15)} ${L(h.area)}</div>
    <div class="meta">${icon('calendar', 15)} ${fmtDate(o.date)} · ${icon('clock', 15)} ${timeRange(o)}</div>
    ${why && why.length ? `<div class="chips" style="margin-top:8px">${why.map(w => `<span class="reason">${T(w)}</span>`).join('')}</div>` : ''}
    <div class="opp-foot">${slotsLabel(o)}<span class="vbtn">${T('btn.details')} ${icon('back', 14).replace('<svg', '<svg style="transform:rotate(180deg)"')}</span></div>
  </article>`;
}

/* hospital multi-select (searchable) – ctx = key in drafts D */
function hospRows(ctx) {
  const d = D[ctx], q = (D.hq || '').toLowerCase().trim();
  const list = HOSPITALS.filter(h => !q || (h.name + ' ' + L(h.area) + ' ' + L(h.cat)).toLowerCase().includes(q));
  if (!list.length) return `<div class="empty" style="padding:18px">${T('hosp.none')}</div>`;
  return list.map(h => { const on = d.prefs.includes(h.id); return `<button type="button" class="hosp" role="checkbox" aria-checked="${on}" data-act="toggleHosp" data-ctx="${ctx}" data-id="${h.id}"><span class="box">${on ? icon('check', 16) : ''}</span><span><b>${h.name}</b><span>${L(h.area)} · ${L(h.cat)}</span></span></button>`; }).join('');
}
function hospSelector(ctx) {
  const d = D[ctx];
  return `<div class="lbl" id="hosp-lbl">${T('hosp.q')}</div>
  <p class="muted small" style="margin-bottom:8px">${T('hosp.note')}</p>
  <div class="search"><span aria-hidden="true">${icon('search', 18)}</span><input type="search" id="hq" placeholder="${T('hosp.search')}" value="${esc(D.hq)}" data-bind="hq" data-live="hospList" aria-labelledby="hosp-lbl"></div>
  <button type="button" class="hosp nopref" role="checkbox" aria-checked="${d.noPref}" data-act="toggleNoPref" data-ctx="${ctx}"><span class="box">${d.noPref ? icon('check', 16) : ''}</span><span><b>${T('hosp.nopref')}</b></span></button>
  <div class="hosp-list ${d.noPref ? 'disabled-list' : ''}" id="hospList" role="group" aria-labelledby="hosp-lbl">${hospRows(ctx)}</div>
  <p class="small muted" style="margin-top:8px" id="hospCount">${d.noPref ? T('hosp.all') : T('hosp.count', d.prefs.length)}</p>
  <p class="small muted">${T('hosp.disclaimer')}</p>`;
}

/* QR pseudo-image (decorative demo) */
function qrSvg(seed) {
  let h = 0; for (const c of String(seed)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const n = 21; let out = '';
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#263238"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#263238"/>`;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) continue;
    h = (h * 1103515245 + 12345) >>> 0; if ((h >> 16) & 1) out += `<rect x="${x}" y="${y}" width="1" height="1" fill="#263238"/>`;
  }
  return `<svg class="qr" viewBox="0 0 21 21" shape-rendering="crispEdges" role="img" aria-label="Demo QR"><rect width="21" height="21" fill="#fff"/>${finder(0, 0)}${finder(14, 0)}${finder(0, 14)}${out}</svg>`;
}

/* modal / toast */
function showModal(html) { document.getElementById('modal').innerHTML = `<div class="overlay" data-act="closeModal"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`; const f = document.querySelector('#modal [autofocus],#modal button,#modal input'); if (f) try { f.focus(); } catch (e) { } }
function closeModal() { document.getElementById('modal').innerHTML = ''; }
function toast(msg, type) {
  const el = document.createElement('div'); el.className = 'toast ' + (type || ''); el.innerHTML = (type === 'error' ? icon('alert', 18) : icon('check', 18)) + '<span>' + esc(msg) + '</span>';
  const box = document.getElementById('toast'); box.appendChild(el); setTimeout(() => el.remove(), 3200);
}
let _confirmCb = null;
function askConfirm(title, msg, yesLabel, cb) {
  _confirmCb = cb;
  showModal(`<h3>${title}</h3><p>${msg}</p><div class="row" style="margin-top:16px"><button class="btn" data-act="confirmYes">${yesLabel}</button><button class="btn ghost" data-act="closeModal">${T('btn.cancel')}</button></div>`);
}


