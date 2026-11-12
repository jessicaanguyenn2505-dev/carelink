/* CareLink – router, event handling, actions */
const $ = s => document.querySelector(s);
const D = {
  hq: '', login: { email: '', code: '', err: '', cerr: '', busy: false }, setup: null, prefs: null, ex: null, reg: {}, schTab: 'up',
  inc: { text: '' }, cTab: 'ov', assign: {}, ann: { aud: 'all', title: '', msg: '', err: '' }, of: null, busy: false,
};
const PUBLIC = ['welcome', 'login', 'setup'];
const COORD = ['coord', 'coord-opp'];
let lastKey = null;

function parseRoute() { const h = location.hash.replace(/^#\/?/, ''); const [name, ...rest] = h.split('/'); return { name: name || '', param: rest.join('/') }; }
function go(h) { if (location.hash === h) render(); else location.hash = h; }

function blankSetup() { return { name: '', email: '', phone: '', org: '', skills: [], prefs: [], noPref: false, days: [], slots: [], exp: '', accept: false, errors: {}, editId: '' }; }
function blankOpp() { return { id: '', hid: '', cat: 'guidance', date: addDays(todayStr(), 7), title: '', desc: '', tasks: '', safety: '', meet: '', cname: 'CareLink Coordinator', cphone: '', shifts: [{ start: '08:00', end: '12:00', cap: 5 }], ack: false, errors: {} }; }

function enter(name, param) {
  const u = ST.meId ? me() : null;
  if (name === 'setup') { D.setup = blankSetup(); D.hq = ''; }
  if (name === 'edit-profile') { D.setup = Object.assign(blankSetup(), JSON.parse(JSON.stringify(u)), { editId: u.id, errors: {} }); D.hq = ''; }
  if (name === 'prefs') { D.prefs = { prefs: [...u.prefs], noPref: u.noPref }; D.hq = ''; }
  if (name === 'login') D.login = { email: '', code: '', err: '', cerr: '', busy: false };
  if (name === 'register') { const o = opp(param); D.reg = { sid: o && o.shifts.length === 1 ? o.shifts[0].id : null, ack: false, err: '', done: null, busy: false }; }
  if (name === 'checkin') { D.inc = { text: '' }; D.busy = false; }
  if (name === 'coord-opp') {
    const o = param !== 'new' ? opp(param) : null;
    if (!o) D.of = blankOpp();
    else D.of = { id: o.id, hid: o.hid, cat: o.cat, date: o.date, title: L(o.title), desc: L(o.desc), tasks: o.tasks ? o.tasks.map(L).join('\n') : '', safety: o.safety ? o.safety.map(L).join('\n') : '', meet: o.meet ? L(o.meet) : '', cname: o.contact.name, cphone: o.contact.phone, shifts: o.shifts.map(s => ({ start: s.start, end: s.end, cap: s.cap })), ack: false, errors: {} };
  }
  if (name === 'explore' && !D.ex) D.ex = { q: '', scope: u && !u.noPref && u.prefs.length ? 'mine' : 'all', cat: 'all', hid: '', range: 'any', time: 'any', open: false };
}

function render(keepScroll) {
  let { name, param } = parseRoute();
  const role = ST.role;
  if (!name) name = role === 'coord' ? 'coord' : role ? 'home' : 'welcome';
  let redirect = null;
  if (!role && !PUBLIC.includes(name)) redirect = '#/welcome';
  else if (role === 'volunteer' && (COORD.includes(name) || name === 'welcome' || name === 'login' || (name === 'setup'))) redirect = '#/home';
  else if (role === 'coord' && !COORD.includes(name)) redirect = '#/coord';
  if (redirect) { if (location.hash !== redirect) { location.hash = redirect; return; } }
  const key = name + '/' + param;
  const changed = key !== lastKey;
  if (changed) { lastKey = key; enter(name, param); }
  const y = window.scrollY;

  let v;
  try {
    const fn = name === 'coord' ? C.coord : name === 'coord-opp' ? C.coordOpp : name === 'edit-profile' ? V.setup : V[name];
    v = fn ? fn(param) : { title: '404', body: empty('alert', T('err.nf'), '') };
  } catch (e) { console.error(e); v = { title: T('err.title'), body: empty('alert', T('err.title'), T('err.generic'), `<button class="btn" data-act="reload">${T('btn.retry')}</button>`) }; }

  const app = $('#app'); app.className = 'app' + (v.wide ? ' wide' : '');
  let html = '';
  if (!v.hideTop) {
    const left = v.back ? `<button class="icon-btn" data-act="back" data-to="${v.back}" aria-label="${T('btn.back')}">${icon('back', 20)}</button>` : `<div class="logo-mini">${LOGO}</div>`;
    const right = v.coord ? `${langToggle()}<button class="icon-btn" data-act="logout" aria-label="${T('btn.logout')}" title="${T('btn.logout')}">${icon('logout', 18)}</button>`
      : `${langToggle()}${ST.role === 'volunteer' ? `<button class="icon-btn" data-act="open" data-to="#/notifications" aria-label="${T('notif.title')}">${icon('bell', 18)}${unreadCount() ? `<span class="dot">${unreadCount()}</span>` : ''}</button>` : ''}`;
    const title = v.logo ? '<span class="wordmark">CARELINK</span>' : esc(v.title || '');
    html += `<header class="topbar">${left}<h1>${v.coord && !v.back ? '<span class="wordmark">CARELINK</span> · ' : ''}${v.coord ? esc(v.title) + ` <span class="pill-demo">${T('c.restricted')}</span>` : title}</h1><div class="tb-r">${right}</div></header>`;
  }
  html += v.bare ? v.body : `<main class="content">${v.body}</main>`;
  if (v.nav) html += bottomNav(v.nav);
  app.innerHTML = html;
  document.title = 'CareLink – ' + (v.title || T('app.tagline'));
  if (changed && !keepScroll) window.scrollTo(0, 0); else window.scrollTo(0, y);
}

function bottomNav(active) {
  const items = [['home', 'home', 'nav.home'], ['explore', 'search', 'nav.explore'], ['schedule', 'calendar', 'nav.schedule'], ['impact', 'chart', 'nav.impact'], ['profile', 'user', 'nav.profile']];
  return `<nav class="bnav" aria-label="Main">${items.map(([k, ic, l]) => `<button class="nav-item" data-act="open" data-to="#/${k}" ${active === k ? 'aria-current="page"' : ''}><span class="ic-wrap">${icon(ic, 22)}</span>${T(l)}</button>`).join('')}</nav>`;
}

/* ---------- helpers ---------- */
function setPath(obj, path, val) { const p = path.split('.'); let o = obj; for (let i = 0; i < p.length - 1; i++) o = o[p[i]]; o[p[p.length - 1]] = val; }
function hctx() { return parseRoute().name === 'prefs' ? 'prefs' : 'setup'; }
function refreshHosp(ctx) {
  const d = D[ctx], list = $('#hospList'); if (!list) return;
  list.innerHTML = hospRows(ctx); list.classList.toggle('disabled-list', d.noPref);
  $('#hospCount').textContent = d.noPref ? T('hosp.all') : T('hosp.count', d.prefs.length);
  const b = document.querySelector('.hosp.nopref'); b.setAttribute('aria-checked', d.noPref); b.querySelector('.box').innerHTML = d.noPref ? icon('check', 16) : '';
}
const LIVE = {
  ex() { $('#exResults').innerHTML = exResults(); },
  hospList() { refreshHosp(hctx()); },
};
const valid = { email: s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s), phone: s => s.replace(/\D/g, '').length >= 8 };

function meetModal(hid, oid) {
  const h = hosp(hid), o = oid ? opp(oid) : null;
  showModal(`<h3>${icon('pin', 20)} ${T('meet.title')}</h3><p><b>${h.name}</b></p><div class="meta">${icon('pin', 15)} ${L(h.area)} · ${L(h.cat)}</div>
    <div class="card" style="margin-top:12px"><b>${T('opp.meet')}</b><p>${L(o ? meetOf(o) : h.meet)}</p></div>
    <div class="row">${partnerBadge(hid)}<span class="pill-demo">${T('demo.tag')}</span></div>
    <p class="small muted" style="margin-top:10px">${T('meet.note')}</p>
    <button class="btn block" style="margin-top:14px" data-act="closeModal">${T('btn.close')}</button>`);
}

/* ---------- actions ---------- */
const ACT = {
  open(d) { go(d.to); },
  back(d) { go(d.to); },
  reload() { location.reload(); },
  closeModal() { closeModal(); },
  confirmYes() { const cb = _confirmCb; closeModal(); if (cb) cb(); },
  lang(d) { LANG = d.l; ST.lang = d.l; save(); document.documentElement.lang = d.l; render(true); },
  logout() { logout(); D.ex = null; lastKey = null; go('#/welcome'); },
  resetDemo() { askConfirm(T('settings.reset'), T('settings.resetq'), T('btn.yes'), () => { resetDemo(); D.ex = null; lastKey = null; go('#/welcome'); toast(T('settings.resetdone'), 'success'); }); },

  loginDemo() { loginUser('v1', 'volunteer'); D.ex = null; go('#/home'); },
  loginEmail() {
    const l = D.login; if (l.busy) return; l.err = '';
    if (!valid.email(l.email)) { l.err = T('err.email'); return render(true); }
    l.busy = true; render(true);
    setTimeout(() => {
      const u = ST.users.find(x => x.email.toLowerCase() === l.email.trim().toLowerCase());
      l.busy = false;
      if (!u) { l.err = T('login.notfound'); return render(true); }
      loginUser(u.id, 'volunteer'); D.ex = null; go('#/home');
    }, 600);
  },
  loginCoord() {
    const l = D.login; l.cerr = '';
    if (l.code.trim().toUpperCase() !== 'CARELINK-DEMO') { l.cerr = T('login.badcode'); return render(true); }
    loginUser(null, 'coord'); go('#/coord');
  },

  tog(d) { const arr = D[d.ctx][d.k], i = arr.indexOf(d.v); if (i >= 0) arr.splice(i, 1); else arr.push(d.v); render(true); },
  toggleHosp(d) { const s = D[d.ctx], i = s.prefs.indexOf(d.id); if (i >= 0) s.prefs.splice(i, 1); else s.prefs.push(d.id); s.noPref = false; refreshHosp(d.ctx); },
  toggleNoPref(d) { const s = D[d.ctx]; s.noPref = !s.noPref; if (s.noPref) s.prefs = []; refreshHosp(d.ctx); },
  saveSetup() {
    const s = D.setup, e = {}, edit = !!s.editId;
    if (!s.name.trim()) e.name = T('err.required');
    if (!valid.email(s.email.trim())) e.email = T('err.email');
    else if (ST.users.some(u => u.email.toLowerCase() === s.email.trim().toLowerCase() && u.id !== s.editId)) e.email = T('err.emailused');
    if (!valid.phone(s.phone)) e.phone = T('err.phone');
    if (!s.noPref && !s.prefs.length) e.hosp = T('err.hosp');
    if (!edit && !s.accept) e.accept = T('err.accept');
    s.errors = e;
    if (Object.keys(e).length) { render(true); const el = document.querySelector('.err'); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    const data = { name: s.name.trim(), email: s.email.trim(), phone: s.phone.trim(), org: s.org.trim(), skills: s.skills, prefs: s.noPref ? [] : s.prefs, noPref: s.noPref, days: s.days, slots: s.slots, exp: s.exp };
    upsertUser(data, edit ? s.editId : null); D.ex = null; toast(T('toast.saved'), 'success'); go(edit ? '#/profile' : '#/home');
  },
  savePrefs() {
    const p = D.prefs; if (!p.noPref && !p.prefs.length) return toast(T('err.hosp'), 'error');
    const u = me(); u.prefs = p.noPref ? [] : p.prefs; u.noPref = p.noPref; save(); D.ex = null; toast(T('toast.prefs'), 'success'); go('#/profile');
  },

  exSet(d) { D.ex[d.k] = d.v; render(true); },
  exReset() { const u = me(); D.ex = { q: '', scope: !u.noPref && u.prefs.length ? 'mine' : 'all', cat: 'all', hid: '', range: 'any', time: 'any', open: false }; render(true); },
  meet(d) { meetModal(d.id, d.oid); },
  pickShift(d) { D.reg.sid = d.id; D.reg.err = ''; render(true); },
  confirmReg() {
    const r = D.reg; if (r.busy) return; const id = parseRoute().param;
    if (!r.sid) { r.err = T('err.shift'); return render(true); }
    if (!r.ack) { r.err = T('err.ack'); return render(true); }
    r.err = ''; r.busy = true; render(true);
    setTimeout(() => { const x = register(id, r.sid); r.busy = false; r.done = x.id; render(); window.scrollTo(0, 0); toast(x.status === 'waitlisted' ? T('toast.wait') : T('toast.reg'), 'success'); }, 600);
  },
  schTab(d) { D.schTab = d.v; render(true); },
  reqOpen(d) {
    showModal(`<h3>${d.type === 'cancel' ? T('btn.reqcancel') : T('btn.reqchange')}</h3><p class="small muted" style="margin-bottom:10px">${T('req.note')}</p>
      <textarea id="req-note" placeholder="${T('req.ph')}" autofocus></textarea><div class="row" style="margin-top:14px"><button class="btn" data-act="reqSend" data-id="${d.id}" data-type="${d.type}">${T('btn.send')}</button><button class="btn ghost" data-act="closeModal">${T('btn.cancel')}</button></div>`);
  },
  reqSend(d) { requestChange(d.id, d.type, $('#req-note').value.trim()); closeModal(); toast(T('toast.req'), 'success'); render(true); },
  withdraw(d) { askConfirm(T('btn.withdraw'), T('sch.withdrawq'), T('btn.yes'), () => { withdraw(d.id); toast(T('toast.withdrawn'), 'success'); render(true); }); },
  scan(d) { if (D.busy) return; D.busy = true; render(true); setTimeout(() => { checkIn(d.id); D.busy = false; render(true); toast(T('toast.in'), 'success'); }, 1100); },
  checkOut(d) { checkOut(d.id); render(true); toast(T('toast.out'), 'success'); },
  taskTog(d) { const r = reg(d.rid), i = +d.i, k = r.checks.indexOf(i); if (k >= 0) r.checks.splice(k, 1); else r.checks.push(i); save(); },
  sendInc(d) { const t = D.inc.text.trim(); if (!t) return toast(T('err.required'), 'error'); addIncident(d.type, t, d.oid); D.inc.text = ''; toast(T('toast.sent'), 'success'); render(true); },
  markRead() { notifsFor(ST.meId).forEach(n => n.read = true); save(); render(true); },
  hist(d) {
    const r = reg(d.id), o = opp(r.oid), s = shiftOf(r);
    showModal(`<h3>${esc(L(o.title))}</h3><dl class="kv"><dt>${T('opp.title')}</dt><dd>${L(CATS[o.cat].name)}</dd><dt>${T('ex.hospital')}</dt><dd>${hosp(o.hid).name}</dd><dt>${T('f.date')}</dt><dd>${fmtDate(o.date, true)} · ${s.start}–${s.end}</dd><dt>${T('m.hours')}</dt><dd>${fmtH(r.hours)} ${T('unit.h')}</dd><dt>${T('hours.status')}</dt><dd>${T('hours.verified')}</dd>${r.outcome ? `<dt>${T('c.outcome')}</dt><dd>${esc(r.outcome)}</dd>` : ''}</dl><button class="btn block" style="margin-top:14px" data-act="closeModal">${T('btn.close')}</button>`);
  },
  cert(d) {
    const u = me(), m = +d.m;
    showModal(`<div class="cert"><div class="big-logo" style="display:flex;justify-content:center">${LOGO.replace('<img', '<img style="width:70px;height:78px;object-fit:cover;border-radius:14px"')}</div><div class="muted small" style="margin-top:8px">${T('cert.title')}</div><h2>${T('cert.name', m)}</h2><p>${T('cert.certify')}</p><div class="name">${esc(u.name)}</div>
      <p>${T('cert.body', fmtH(verifiedHours(u.id)))}</p><p class="small muted">${fmtDate(todayStr(), true)}</p><div class="stamp">${T('cert.demo')}</div></div>
      <div class="row no-print" style="margin-top:14px"><button class="btn" data-act="print">${icon('download', 18)} ${T('btn.print')}</button><button class="btn ghost" data-act="closeModal">${T('btn.close')}</button></div>`);
  },
  print() { window.print(); },

  /* coordinator */
  cTab(d) { D.cTab = d.v; render(true); },
  oppStatus(d) { setOppStatus(d.id, d.v); toast(T('toast.saved'), 'success'); render(true); },
  oppPublish(d) {
    const o = opp(d.id), doIt = () => { setOppStatus(d.id, 'published'); toast(T('toast.published'), 'success'); render(true); };
    if (partner(o.hid) !== 'confirmed') askConfirm(T('c.publish'), T('c.publishwarn'), T('c.publishyes'), doIt); else doIt();
  },
  approveReg(d) { if (approveReg(d.id) === false) toast(T('c.full'), 'error'); else toast(T('toast.saved'), 'success'); render(true); },
  declineReg(d) { declineReg(d.id); toast(T('toast.saved'), 'success'); render(true); },
  resolve(d) { resolveRequest(d.id, d.v === '1'); toast(T('toast.saved'), 'success'); render(true); },
  assign() {
    const a = D.assign; if (!a.oid || !a.sid || !a.vid) return toast(T('err.assign'), 'error');
    const r = assignVolunteer(a.vid, a.oid, a.sid); if (r === 'dup') return toast(T('c.dup'), 'error');
    D.assign = {}; toast(T('toast.assigned'), 'success'); render(true);
  },
  approveHours(d) { const el = $('#oc-' + d.id); approveHours(d.id, el ? el.value.trim() : ''); toast(T('toast.approved'), 'success'); render(true); },
  exportCsv() { exportCSV(); toast(T('toast.exported'), 'success'); },
  resolveInc(d) { ST.incidents.find(i => i.id === d.id).resolved = true; save(); render(true); },
  setPartner(d, el) {
    const v = el.value;
    if (v === 'confirmed') askConfirm(T('partner.confirmed'), T('c.partnerq'), T('btn.yes'), () => { ST.hospStatus[d.id] = v; save(); render(true); toast(T('toast.saved'), 'success'); });
    else { ST.hospStatus[d.id] = v; save(); render(true); }
    if (v === 'confirmed') render(true);
  },
  sendAnn() {
    const a = D.ann; if (!a.title.trim() || !a.msg.trim()) { a.err = T('err.required'); return render(true); }
    const n = sendAnnouncement(a.aud, a.title.trim(), a.msg.trim()); D.ann = { aud: 'all', title: '', msg: '', err: '' }; toast(T('toast.annsent', n), 'success'); render(true);
  },
  addShift() { D.of.shifts.push({ start: '13:00', end: '17:00', cap: 5 }); render(true); },
  rmShift(d) { D.of.shifts.splice(+d.i, 1); render(true); },
  saveOpp(d) {
    const f = D.of, e = {}, pub = d.pub === '1', base = f.id ? opp(f.id) : null;
    if (!f.title.trim()) e.title = T('err.required'); if (!f.hid) e.hid = T('err.required'); if (!f.date) e.date = T('err.required');
    const sh = f.shifts.map(s => ({ start: s.start, end: s.end, cap: Math.max(1, parseInt(s.cap, 10) || 0) }));
    if (!sh.length || sh.some(s => !s.start || !s.end || toMin(s.start) >= toMin(s.end))) e.shifts = T('err.shifts');
    if (pub && f.hid && partner(f.hid) !== 'confirmed' && !f.ack) e.ack = T('err.ackhosp');
    f.errors = e; if (Object.keys(e).length) return render(true);
    const id = f.id || uid('o'), lines = t => t.split('\n').map(x => x.trim()).filter(Boolean).map(x => ({ vi: x, en: x }));
    const tx = (old, val) => { const o = Object.assign({ vi: '', en: '' }, old || {}); o[LANG] = val; const ot = LANG === 'vi' ? 'en' : 'vi'; if (!o[ot]) o[ot] = val; return o; };
    const o = {
      id, hid: f.hid, cat: f.cat, date: f.date, title: tx(base && base.title, f.title.trim()), desc: tx(base && base.desc, f.desc.trim()),
      tasks: f.tasks.trim() ? lines(f.tasks) : null, safety: f.safety.trim() ? lines(f.safety) : null, meet: f.meet.trim() ? { vi: f.meet.trim(), en: f.meet.trim() } : null,
      contact: { name: f.cname, phone: f.cphone, channel: base ? base.contact.channel : 'coordinator@carelink.example' }, tags: base ? base.tags : [], sample: base ? base.sample : false,
      status: pub ? 'published' : (base && base.status !== 'draft' ? base.status : 'draft'),
      shifts: sh.map((s, i) => ({ id: id + '-s' + i, start: s.start, end: s.end, cap: s.cap, base: base && base.shifts[i] ? base.shifts[i].base : 0 })),
    };
    saveOpp(o); toast(pub ? T('toast.published') : T('toast.saved'), 'success'); go('#/coord');
  },
};

/* ---------- global events ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  if (el.tagName === 'SELECT' || el.tagName === 'OPTION') return;
  const a = el.dataset.act;
  if (a === 'closeModal' && e.target !== el && !e.target.closest('button[data-act=closeModal]')) return;
  if (ACT[a]) ACT[a](el.dataset, el, e);
});
function onField(e) {
  const el = e.target;
  if (el.dataset && el.dataset.bind) {
    const v = el.type === 'checkbox' ? el.checked : el.value;
    if (el.dataset.bind === 'notifOn') { ST.notifOn = v; save(); } else setPath(D, el.dataset.bind, v);
    if (e.type === 'input' && el.dataset.live && LIVE[el.dataset.live]) LIVE[el.dataset.live]();
    if (e.type === 'change' && el.dataset.rerender) render(true);
  }
}
document.addEventListener('input', onField);
document.addEventListener('change', e => {
  onField(e);
  const el = e.target.closest && e.target.closest('select[data-act]'); if (el && ACT[el.dataset.act]) ACT[el.dataset.act](el.dataset, el, e);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role=link][data-act]')) { e.preventDefault(); e.target.click(); }
});
window.addEventListener('hashchange', () => { closeModal(); render(); });

load();
document.documentElement.lang = LANG;
render();
