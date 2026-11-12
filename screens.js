/* CareLink – volunteer screens. Each returns { title, back, nav, body, hideTop, bare } */
const V = {};

/* ---------- 01 Welcome ---------- */
V.welcome = () => ({
  hideTop: true, bare: true, body: `
  <section class="hero">
    <div class="lang-row">${langToggle()}</div>
    <div class="center">
      <div class="big-logo">${LOGO}</div>
      <h1>CareLink</h1>
      <div class="tag">${T('app.tagline')}</div>
      <p class="mission">${T('welcome.mission')}</p>
      <p class="reassure">${T('welcome.reassure')}</p>
    </div>
    <div class="btns">
      <button class="btn main block" data-act="open" data-to="#/setup">${T('btn.getstarted')} ${icon('back', 18).replace('<svg', '<svg style="transform:rotate(180deg)"')}</button>
      <button class="btn out block" data-act="open" data-to="#/login">${T('btn.login')}</button>
    </div>
    <p class="foot">${T('welcome.demo')}</p>
  </section>`
});

/* ---------- Login ---------- */
V.login = () => {
  const l = D.login;
  return {
    title: T('btn.login'), back: '#/welcome', body: `
    ${demoNote('login.demo')}
    <div class="card">
      <h3 style="margin-bottom:10px">${T('login.vol')}</h3>
      ${field(T('f.email'), `<input type="email" id="lg-email" data-bind="login.email" value="${esc(l.email)}" autocomplete="email" placeholder="name@example.com">`, l.err, 'lg-email')}
      <button class="btn block" data-act="loginEmail" ${l.busy ? 'disabled' : ''}>${l.busy ? '<span class="spinner"></span>' : T('btn.login')}</button>
      <div class="hr"></div>
      <button class="btn sec block" data-act="loginDemo">${icon('user', 18)} ${T('login.sample')}</button>
      <p class="small muted" style="margin-top:8px">${T('login.nopw')}</p>
    </div>
    <div class="card soft">
      <h3 style="margin-bottom:6px">${icon('lock', 18)} ${T('login.coord')}</h3>
      <p class="small muted" style="margin-bottom:10px">${T('login.coordnote')}</p>
      ${field(T('login.code'), `<input type="text" id="lg-code" data-bind="login.code" value="${esc(l.code)}" autocomplete="off" placeholder="CARELINK-DEMO">`, l.cerr, 'lg-code')}
      <button class="btn teal block" data-act="loginCoord">${T('login.coordbtn')}</button>
      <p class="small muted" style="margin-top:8px">${T('login.hint')}</p>
    </div>`
  };
};

/* ---------- 02 Profile setup / edit ---------- */
V.setup = () => {
  const d = D.setup, e = d.errors || {}, edit = !!d.editId;
  const tog = (k, arr, lab) => `<div class="chips">${arr.map(v => chip('tog', `data-ctx="setup" data-k="${k}" data-v="${v}"`, T(lab + v), d[k].includes(v))).join('')}</div>`;
  return {
    title: edit ? T('profile.edit') : T('setup.title'), back: edit ? '#/profile' : '#/welcome', body: `
    ${edit ? '' : `<p class="muted" style="margin:0 0 12px">${T('setup.intro')}</p>`}
    <div class="card">
      <h3 style="margin-bottom:12px">${T('setup.basic')}</h3>
      ${field(T('f.name') + ' *', `<input type="text" id="s-name" data-bind="setup.name" value="${esc(d.name)}" autocomplete="name">`, e.name, 's-name')}
      ${field(T('f.email') + ' *', `<input type="email" id="s-email" data-bind="setup.email" value="${esc(d.email)}" autocomplete="email">`, e.email, 's-email')}
      ${field(T('f.phone') + ' *', `<input type="tel" id="s-phone" data-bind="setup.phone" value="${esc(d.phone)}" autocomplete="tel">`, e.phone, 's-phone')}
      ${field(T('f.org'), `<input type="text" id="s-org" data-bind="setup.org" value="${esc(d.org)}" placeholder="${T('f.orgph')}">`, '', 's-org')}
      ${field(T('f.exp'), `<select id="s-exp" data-bind="setup.exp"><option value="">—</option>${EXPS.map(x => `<option value="${x}" ${d.exp === x ? 'selected' : ''}>${T('exp.' + x)}</option>`).join('')}</select>`, '', 's-exp')}
    </div>
    <div class="card"><h3 style="margin-bottom:10px">${T('setup.skills')}</h3>${tog('skills', SKILLS, 'skill.')}</div>
    <div class="card">${hospSelector('setup')}${e.hosp ? `<div class="err" role="alert">${icon('alert', 14)} ${e.hosp}</div>` : ''}</div>
    <div class="card">
      <h3 style="margin-bottom:10px">${T('setup.avail')}</h3>
      <div class="lbl">${T('f.days')}</div>${tog('days', DAYS, 'day.')}
      <div class="lbl" style="margin-top:12px">${T('f.slots')}</div>${tog('slots', SLOTS, 'slot.')}
    </div>
    ${edit ? '' : `<div class="card"><label class="check"><input type="checkbox" data-bind="setup.accept" ${d.accept ? 'checked' : ''}><span>${T('setup.accept')}</span></label>${e.accept ? `<div class="err" role="alert">${icon('alert', 14)} ${e.accept}</div>` : ''}</div>`}
    <button class="btn block" data-act="saveSetup">${edit ? T('btn.save') : T('setup.save')}</button>`
  };
};

/* ---------- Prefs (hospital preferences only) ---------- */
V.prefs = () => ({
  title: T('prefs.title'), back: '#/profile', body: `
  <div class="card">${hospSelector('prefs')}</div>
  <button class="btn block" data-act="savePrefs">${T('btn.updateprefs')}</button>`
});

/* ---------- 03 Home ---------- */
V.home = () => {
  const u = me(), nr = nextReg(u.id), rec = recommend(u), notes = notifsFor(u.id).slice(0, 3);
  const vh = verifiedHours(u.id), ph = pendingHours(u.id), done = completedCount(u.id);
  let next;
  if (nr) {
    const o = opp(nr.oid), s = shiftOf(nr), h = hosp(o.hid);
    next = `<article class="card" style="border-left:6px solid var(--teal)">
      <div class="opp-top"><span class="lbl" style="margin:0">${T('home.next')}</span>${badge(dispStatus(nr))}</div>
      <h3 data-act="open" data-to="#/opp/${o.id}" style="cursor:pointer">${esc(L(o.title))}</h3>
      <div class="meta">${icon('building', 15)} ${h.name}</div>
      <div class="meta">${icon('calendar', 15)} ${fmtDate(o.date, true)} · ${icon('clock', 15)} ${s.start}–${s.end}</div>
      <div class="meta">${icon('pin', 15)} ${L(meetOf(o))}</div>
      <div class="sch-actions">
        <button class="btn sm" data-act="open" data-to="#/opp/${o.id}">${T('btn.details')}</button>
        ${nr.status === 'confirmed' ? `<button class="btn sm teal" data-act="open" data-to="#/checkin/${nr.id}">${icon('qr', 16)} ${T('btn.checkin')}</button>` : ''}
      </div></article>`;
  } else next = `<div class="card">${empty('calendar', T('home.nonext'), T('home.nonext2'), `<button class="btn" data-act="open" data-to="#/explore">${T('btn.explore')}</button>`)}</div>`;
  return {
    nav: 'home', title: 'CareLink', logo: true, body: `
    <div class="hello" style="margin:6px 0 4px"><h2>${T('home.hello', esc(u.name))}</h2><p>${T('home.sub')}</p></div>
    ${demoNote()}
    ${next}
    <div class="metrics">${metric(T('m.hours'), fmtH(vh), 'clock')}${metric(T('m.shifts'), done, 'check')}${metric(T('m.pendinghrs'), fmtH(ph), 'alert')}</div>
    <div class="sec-title">${T('home.quick')}</div>
    <div class="grid3" style="gap:8px">
      <button class="card" style="padding:12px 6px;text-align:center;margin:0;font-weight:700;font-size:12.5px;color:var(--navy)" data-act="open" data-to="#/explore"><div style="color:var(--teal);margin-bottom:4px">${icon('search', 24)}</div>${T('btn.explore')}</button>
      <button class="card" style="padding:12px 6px;text-align:center;margin:0;font-weight:700;font-size:12.5px;color:var(--navy)" data-act="open" data-to="#/schedule"><div style="color:var(--teal);margin-bottom:4px">${icon('calendar', 24)}</div>${T('nav.schedule')}</button>
      <button class="card" style="padding:12px 6px;text-align:center;margin:0;font-weight:700;font-size:12.5px;color:var(--navy)" data-act="open" data-to="#/prefs"><div style="color:var(--teal);margin-bottom:4px">${icon('building', 24)}</div>${T('btn.updateprefs')}</button>
    </div>
    <div class="sec-title">${T('home.rec')}<a href="#/explore">${T('home.seeall')}</a></div>
    <p class="small muted" style="margin:-4px 0 10px">${T('home.rulebased')}</p>
    ${rec.length ? rec.map(x => oppCard(x.o, x.why)).join('') : `<div class="card">${empty('search', T('home.norec'), T('home.norec2'))}</div>`}
    <div class="sec-title">${T('home.news')}<a href="#/notifications">${T('home.seeall')}</a></div>
    <div class="card">${notes.length ? notes.map(notifRow).join('') : `<p class="muted">${T('notif.none')}</p>`}</div>`
  };
};
function notifRow(n) { return `<div class="notif ${n.read ? 'read' : ''}"><span class="nd" aria-label="${n.read ? '' : T('notif.unread')}"></span><div><b>${esc(L(n.title))}</b><span class="small muted">${esc(L(n.msg))}</span><div class="small muted" style="margin-top:2px">${fmtTime(n.at)}</div></div></div>`; }

V.notifications = () => {
  const list = notifsFor(ST.meId);
  return {
    title: T('notif.title'), back: '#/home', nav: 'home', body: `
    <div class="row between" style="margin:6px 0 10px"><span class="muted small">${T('notif.demo')}</span><button class="link" data-act="markRead">${T('notif.markread')}</button></div>
    <div class="card">${list.length ? list.map(notifRow).join('') : empty('bell', T('notif.none'), '')}</div>`
  };
};

/* ---------- 04 Explore ---------- */
function exFilter() {
  const f = D.ex, u = me(), q = f.q.toLowerCase().trim();
  const prefs = !u.noPref && u.prefs.length ? u.prefs : null;
  const lim = f.range === 'any' ? null : addDays(todayStr(), +f.range);
  const isAm = o => o.shifts.some(s => toMin(s.start) < 720), isPm = o => o.shifts.some(s => toMin(s.start) >= 720);
  let list = ST.opps.filter(o => o.status === 'published' && o.date >= todayStr());
  if (f.scope === 'mine' && prefs) list = list.filter(o => prefs.includes(o.hid));
  if (f.hid) list = list.filter(o => o.hid === f.hid);
  if (f.cat !== 'all') list = list.filter(o => o.cat === f.cat);
  if (q) list = list.filter(o => (o.title.vi + ' ' + o.title.en + ' ' + hosp(o.hid).name + ' ' + L(hosp(o.hid).area)).toLowerCase().includes(q));
  if (lim) list = list.filter(o => o.date <= lim);
  if (f.time === 'am') list = list.filter(isAm); if (f.time === 'pm') list = list.filter(isPm);
  if (f.open) list = list.filter(o => remainingTotal(o) > 0);
  return list.sort((a, b) => ((prefs && prefs.includes(b.hid)) - (prefs && prefs.includes(a.hid))) || a.date.localeCompare(b.date));
}
function exResults() {
  const list = exFilter(), u = me(), prefs = !u.noPref && u.prefs.length;
  if (!list.length) return empty('search', T('ex.empty'), T('ex.empty2'), D.ex.scope === 'mine' && prefs ? `<button class="btn sm" data-act="exSet" data-k="scope" data-v="all">${T('ex.showall')}</button>` : `<button class="btn sm ghost" data-act="exReset">${T('ex.reset')}</button>`);
  return `<p class="small muted" style="margin:0 0 8px" aria-live="polite">${T('ex.count', list.length)}</p>` + list.map(o => oppCard(o)).join('');
}
V.explore = () => {
  const f = D.ex, u = me(), prefs = !u.noPref && u.prefs.length;
  const pill = (k, v, l) => chip('exSet', `data-k="${k}" data-v="${v}"`, l, f[k] === v);
  return {
    nav: 'explore', title: T('nav.explore'), body: `
    ${demoNote()}
    <div class="search" style="margin-bottom:10px"><span aria-hidden="true">${icon('search', 18)}</span><input type="search" id="ex-q" placeholder="${T('ex.search')}" value="${esc(f.q)}" data-bind="ex.q" data-live="ex" aria-label="${T('ex.search')}"></div>
    <div class="seg" role="group" aria-label="${T('ex.scope')}" style="margin-bottom:10px">
      <button type="button" data-act="exSet" data-k="scope" data-v="mine" aria-pressed="${f.scope === 'mine'}" ${prefs ? '' : 'disabled style="opacity:.5"'}>${T('ex.mine')}</button>
      <button type="button" data-act="exSet" data-k="scope" data-v="all" aria-pressed="${f.scope === 'all'}">${T('ex.all')}</button>
    </div>
    <div class="tabs" role="group" aria-label="${T('ex.type')}">${pill('cat', 'all', T('ex.alltypes'))}${Object.keys(CATS).map(k => pill('cat', k, L(CATS[k].name))).join('')}</div>
    <div class="grid2" style="margin-bottom:10px">
      <select aria-label="${T('ex.hospital')}" data-bind="ex.hid" data-rerender="1"><option value="">${T('ex.anyhosp')}</option>${HOSPITALS.map(h => `<option value="${h.id}" ${f.hid === h.id ? 'selected' : ''}>${h.name}</option>`).join('')}</select>
      <select aria-label="${T('ex.date')}" data-bind="ex.range" data-rerender="1">${['any', '7', '14'].map(v => `<option value="${v}" ${f.range === v ? 'selected' : ''}>${T('ex.range.' + v)}</option>`).join('')}</select>
      <select aria-label="${T('ex.time')}" data-bind="ex.time" data-rerender="1">${['any', 'am', 'pm'].map(v => `<option value="${v}" ${f.time === v ? 'selected' : ''}>${T('ex.time.' + v)}</option>`).join('')}</select>
      <label class="check" style="background:#fff;border:1.5px solid #cfc6b3;border-radius:12px;padding:10px 12px;font-weight:600"><input type="checkbox" data-bind="ex.open" data-rerender="1" ${f.open ? 'checked' : ''}><span>${T('ex.open')}</span></label>
    </div>
    <div id="exResults">${exResults()}</div>`
  };
};

/* ---------- 05 Details ---------- */
V.opp = (id) => {
  const o = opp(id); if (!o) return { title: T('err.title'), back: '#/explore', body: empty('alert', T('err.nf'), '', `<button class="btn" data-act="open" data-to="#/explore">${T('btn.explore')}</button>`) };
  const h = hosp(o.hid), c = CATS[o.cat], r = myRegFor(o.id), past = o.date < todayStr();
  const closed = o.status !== 'published' || past, allFull = remainingTotal(o) <= 0;
  const li = (arr, ic) => `<ul class="list">${arr.map(x => `<li>${icon(ic, 16)}<span>${esc(L(x))}</span></li>`).join('')}</ul>`;
  let cta;
  if (r) cta = `<button class="btn block" data-act="open" data-to="#/schedule">${icon('calendar', 18)} ${T('btn.viewsched')} · ${T('st.' + dispStatus(r))}</button>`;
  else if (closed) cta = `<button class="btn block" disabled>${T('opp.closed')}</button>`;
  else cta = `<button class="btn block" data-act="open" data-to="#/register/${o.id}">${allFull ? T('btn.waitlist') : T('btn.register')}</button>`;
  return {
    title: T('opp.title'), back: '#/explore', nav: null, body: `
    <div class="d-hero"><span class="cat">${icon(c.icon, 14)} ${L(c.name)}</span><h2>${esc(L(o.title))}</h2>
      <div class="meta">${icon('building', 16)} ${h.name}</div><div class="meta">${icon('pin', 16)} ${L(h.area)}</div></div>
    <div class="row" style="margin-bottom:12px">${partnerBadge(o.hid)} ${r ? badge(dispStatus(r)) : ''}<span class="pill-demo">${T('demo.tag')}</span></div>
    ${partner(o.hid) !== 'confirmed' ? `<div class="notice blue" style="margin:0 0 12px">${icon('info', 16)}<span>${T('opp.partnernote')}</span></div>` : ''}
    <div class="card"><h3>${T('opp.about')}</h3><p style="margin-top:6px">${esc(L(o.desc))}</p></div>
    <div class="card"><h3>${T('opp.tasks')}</h3>${li(tasksOf(o), 'check')}</div>
    <div class="card"><h3>${T('opp.req')}</h3>${li(c.req, 'check')}</div>
    <div class="card"><h3>${T('opp.when')}</h3>
      <dl class="kv" style="margin-top:8px"><dt>${T('f.date')}</dt><dd>${fmtDate(o.date, true)}</dd>
      ${o.shifts.map((s, i) => `<dt>${T('shift.n', i + 1)}</dt><dd>${s.start}–${s.end} (${fmtH(shiftHours(s))} ${T('unit.h')}) · ${remainingOf(o, s) > 0 ? T('slots.left', remainingOf(o, s), s.cap) : T('slots.full')}</dd>`).join('')}
      <dt>${T('opp.need')}</dt><dd>${capTotal(o)} · ${T('opp.avail')}: ${remainingTotal(o)} <span class="pill-demo">${T('demo.tag')}</span></dd>
      <dt>${T('opp.meet')}</dt><dd>${L(meetOf(o))}</dd></dl>
      <button class="btn sec sm" style="margin-top:12px" data-act="meet" data-id="${h.id}" data-oid="${o.id}">${icon('pin', 16)} ${T('btn.viewmeet')}</button></div>
    <div class="card"><h3>${T('opp.prep')}</h3><p style="margin-top:6px">${L(PREP)}</p><p class="small muted" style="margin-top:6px"><b>${T('opp.dress')}:</b> ${L(DRESS)}</p></div>
    <div class="card warn"><h3 style="color:#a4402e">${icon('shield', 18)} ${T('opp.safety')}</h3>${li(safetyOf(o), 'alert').replace('class="list"', 'class="list warnl"')}</div>
    <div class="card"><h3>${T('opp.contact')}</h3><dl class="kv" style="margin-top:8px"><dt>${T('f.name')}</dt><dd>${esc(o.contact.name)}</dd><dt>${T('f.phone')}</dt><dd>${esc(o.contact.phone)}</dd><dt>${T('f.email')}</dt><dd>${esc(o.contact.channel)}</dd></dl></div>
    <div class="sticky-cta">${cta}</div>`
  };
};

/* ---------- 06 Register ---------- */
V.register = (id) => {
  const o = opp(id), d = D.reg; if (!o) return V.opp(id);
  if (d.done) {
    const r = reg(d.done), waitl = r.status === 'waitlisted';
    return {
      title: T('reg.title'), nav: 'schedule', body: `<div class="success"><div class="big">${icon(waitl ? 'list' : 'check', 44)}</div>
      <h2 style="color:var(--navy)">${waitl ? T('reg.waitdone') : T('reg.done')}</h2>
      <p class="muted" style="margin:8px 0 14px">${waitl ? T('reg.waitdone2') : T('reg.done2')}</p>
      <div class="row" style="justify-content:center">${badge(r.status)}</div></div>
      <div class="card"><h3>${esc(L(o.title))}</h3><div class="meta">${icon('building', 15)} ${hosp(o.hid).name}</div><div class="meta">${icon('calendar', 15)} ${fmtDate(o.date)} · ${shiftOf(r).start}–${shiftOf(r).end}</div></div>
      <button class="btn block" data-act="open" data-to="#/schedule">${T('btn.viewsched')}</button>
      <button class="btn ghost block" style="margin-top:10px" data-act="open" data-to="#/explore">${T('btn.explore')}</button>`
    };
  }
  const sel = o.shifts.find(s => s.id === d.sid), full = sel && remainingOf(o, sel) <= 0;
  return {
    title: T('reg.title'), back: '#/opp/' + o.id, body: `
    <div class="card"><h3>${esc(L(o.title))}</h3><div class="meta">${icon('building', 15)} ${hosp(o.hid).name}</div>
      <div class="lbl" style="margin-top:14px">${T('reg.date')}</div>
      <div class="chips"><span class="chip" aria-pressed="true">${icon('calendar', 14)} ${fmtDate(o.date, true)}</span></div></div>
    <div class="lbl">${T('reg.pick')}</div>
    <div role="radiogroup" aria-label="${T('reg.pick')}">${o.shifts.map(s => { const rem = remainingOf(o, s), on = d.sid === s.id; return `<button type="button" class="shift" role="radio" aria-checked="${on}" data-act="pickShift" data-id="${s.id}"><span class="radio">${on ? icon('check', 14) : ''}</span><span style="flex:1"><b>${s.start}–${s.end}</b><div class="small muted">${fmtH(shiftHours(s))} ${T('unit.h')}</div></span>${rem > 0 ? `<span class="slots">${T('slots.left', rem, s.cap)}</span>` : badge('waitlisted', T('slots.fullwait'))}</button>`; }).join('')}</div>
    ${d.err ? `<div class="err" role="alert" style="margin-bottom:10px">${icon('alert', 14)} ${d.err}</div>` : ''}
    <div class="card"><h3>${T('reg.summary')}</h3>${`<ul class="list">${tasksOf(o).slice(0, 3).map(x => `<li>${icon('check', 16)}<span>${esc(L(x))}</span></li>`).join('')}</ul>`}
      <p class="small muted" style="margin-top:6px">${T('reg.duration')}: ${sel ? fmtH(shiftHours(sel)) + ' ' + T('unit.h') : '—'}</p></div>
    <div class="card"><label class="check"><input type="checkbox" data-bind="reg.ack" ${d.ack ? 'checked' : ''}><span>${T('reg.ack')}</span></label></div>
    <div class="notice blue" style="margin:0 0 14px">${icon('info', 16)}<span>${T('reg.noauto')}</span></div>
    <button class="btn block" data-act="confirmReg" ${d.busy ? 'disabled' : ''}>${d.busy ? '<span class="spinner"></span>' : (full ? T('btn.waitlist') : T('btn.confirmreg'))}</button>`
  };
};

/* ---------- 07 Schedule ---------- */
const SCH = { up: r => r.status === 'confirmed', pend: r => ['pending', 'waitlisted'].includes(r.status), done: r => r.status === 'completed', canc: r => r.status === 'cancelled' };
V.schedule = () => {
  const mine = myRegs(), tab = D.schTab;
  const cnt = k => mine.filter(SCH[k]).length;
  const list = mine.filter(SCH[tab]).sort((a, b) => (opp(a.oid).date.localeCompare(opp(b.oid).date)) * (tab === 'up' || tab === 'pend' ? 1 : -1));
  const soon = mine.find(r => r.status === 'confirmed' && r.att === 'none' && opp(r.oid).date <= addDays(todayStr(), 3) && opp(r.oid).date >= todayStr());
  const card = r => {
    const o = opp(r.oid), s = shiftOf(r), st = dispStatus(r);
    let acts = `<button class="btn sm sec" data-act="open" data-to="#/opp/${o.id}">${T('btn.details')}</button>`;
    if (r.status === 'confirmed' && !r.cancelReq) {
      acts += `<button class="btn sm teal" data-act="open" data-to="#/checkin/${r.id}">${icon('qr', 15)} ${r.att === 'in' ? T('btn.continue') : T('btn.checkin')}</button>`;
      if (r.att === 'none') acts += `<button class="btn sm ghost" data-act="reqOpen" data-id="${r.id}" data-type="cancel">${T('btn.reqcancel')}</button><button class="btn sm ghost" data-act="reqOpen" data-id="${r.id}" data-type="change">${T('btn.reqchange')}</button>`;
    }
    if (r.status === 'pending' || r.status === 'waitlisted') acts += `<button class="btn sm ghost" data-act="withdraw" data-id="${r.id}">${T('btn.withdraw')}</button>`;
    if (r.status === 'cancelled') acts += `<button class="btn sm" data-act="open" data-to="#/register/${o.id}">${T('btn.regagain')}</button>`;
    return `<article class="card"><div class="opp-top"><span class="cat">${icon(CATS[o.cat].icon, 14)} ${L(CATS[o.cat].name)}</span>${badge(st)}</div>
      <h3>${esc(L(o.title))}</h3><div class="meta">${icon('building', 15)} ${hosp(o.hid).name}</div>
      <div class="meta">${icon('calendar', 15)} ${fmtDate(o.date)} · ${icon('clock', 15)} ${s.start}–${s.end}</div>
      <div class="meta">${icon('pin', 15)} ${L(meetOf(o))}</div>
      ${r.status === 'completed' ? `<div style="margin-top:8px">${r.hstat === 'verified' ? badge('verified', T('hours.verified') + ' · ' + fmtH(r.hours) + ' ' + T('unit.h')) : badge('pending', T('hours.pending') + ' · ' + fmtH(r.hours) + ' ' + T('unit.h'))}</div>` : ''}
      ${r.status === 'waitlisted' ? `<div class="notice blue">${icon('list', 16)}<span>${T('sch.waitnote')}</span></div>` : ''}
      ${r.cancelReq ? `<div class="notice">${icon('clock', 16)}<span>${r.cancelReq === 'cancel' ? T('sch.reqcancel') : T('sch.reqchange')}</span></div>` : ''}
      <div class="sch-actions">${acts}</div></article>`;
  };
  return {
    nav: 'schedule', title: T('nav.schedule'), body: `
    ${soon ? `<div class="notice" style="margin:6px 0 12px">${icon('bell', 16)}<span>${T('sch.remind', esc(L(opp(soon.oid).title)), fmtDate(opp(soon.oid).date))}</span></div>` : ''}
    <div class="tabs" role="tablist">${[['up', 'tab.up'], ['pend', 'tab.pend'], ['done', 'tab.done'], ['canc', 'tab.canc']].map(([k, l]) => `<button class="tab" role="tab" aria-selected="${tab === k}" data-act="schTab" data-v="${k}">${T(l)} <span class="n">${cnt(k)}</span></button>`).join('')}</div>
    ${list.length ? list.map(card).join('') : empty('calendar', T('sch.empty.' + tab), T('sch.empty2'), `<button class="btn" data-act="open" data-to="#/explore">${T('btn.explore')}</button>`)}
    <p class="small muted">${T('sch.note')}</p>`
  };
};

/* ---------- 08 Check-in / out ---------- */
V.checkin = (rid) => {
  const mine = myRegs().filter(r => r.status === 'confirmed' || (r.status === 'completed' && r.id === rid));
  let r = rid ? reg(rid) : mine.filter(x => x.status === 'confirmed').sort((a, b) => opp(a.oid).date.localeCompare(opp(b.oid).date))[0];
  if (!r || r.vid !== ST.meId) return { nav: 'schedule', title: T('ci.title'), body: demoNote('ci.demo') + `<div class="card">${empty('qr', T('ci.none'), T('ci.none2'), `<button class="btn" data-act="open" data-to="#/explore">${T('btn.explore')}</button>`)}</div>` };
  const o = opp(r.oid), s = shiftOf(r), h = hosp(o.hid);
  const step = r.att === 'out' ? 2 : r.att === 'in' ? 1 : 0;
  const others = ST.regs.filter(x => x.vid === ST.meId && x.status === 'confirmed' && x.id !== r.id);
  return {
    nav: 'schedule', title: T('ci.title'), back: '#/schedule', body: `
    ${demoNote('ci.demo')}
    ${others.length ? `<div class="tabs">${[r, ...others].map(x => `<button class="tab" data-act="open" data-to="#/checkin/${x.id}" aria-selected="${x.id === r.id}">${esc(L(opp(x.oid).title))}</button>`).join('')}</div>` : ''}
    <div class="card"><div class="opp-top"><h3>${esc(L(o.title))}</h3>${badge(dispStatus(r))}</div>
      <div class="meta">${icon('building', 15)} ${h.name}</div><div class="meta">${icon('calendar', 15)} ${fmtDate(o.date)} · ${icon('clock', 15)} ${s.start}–${s.end}</div><div class="meta">${icon('pin', 15)} ${L(meetOf(o))}</div></div>
    <div class="stepper" aria-label="${T('ci.progress')}">
      <div class="step on"><div class="c">${icon('qr', 16)}</div>${T('ci.s0')}</div><div class="bar ${step >= 1 ? 'on' : ''}"></div>
      <div class="step ${step >= 1 ? 'on' : ''}"><div class="c">${icon('pin', 16)}</div>${T('st.checkedin')}</div><div class="bar ${step >= 2 ? 'on' : ''}"></div>
      <div class="step ${step >= 2 ? 'on' : ''}"><div class="c">${icon('check', 16)}</div>${T('ci.s2')}</div></div>
    ${step === 0 ? `<div class="qr-box"><p class="small muted">${T('ci.scanhint')}</p><div class="scan-frame">${qrSvg(r.id + o.id)}<div class="line"></div></div>
        <button class="btn block" data-act="scan" data-id="${r.id}" ${D.busy ? 'disabled' : ''}>${D.busy ? '<span class="spinner"></span>' : icon('qr', 18) + ' ' + T('ci.simscan')}</button><p class="small muted" style="margin-top:8px">${T('ci.simnote')}</p></div>` : ''}
    ${step === 1 ? `<div class="card soft"><b>${icon('check', 18)} ${T('ci.in', fmtTime(r.inAt))}</b></div>
      <div class="card"><h3>${T('ci.tasks')}</h3>${tasksOf(o).map((t, i) => `<label class="check" style="padding:7px 0"><input type="checkbox" data-act="taskTog" data-rid="${r.id}" data-i="${i}" ${r.checks.includes(i) ? 'checked' : ''}><span>${esc(L(t))}</span></label>`).join('')}</div>
      <div class="card warn"><h3 style="color:#a4402e">${icon('shield', 18)} ${T('ci.onsite')}</h3><ul class="list warnl">${COMMON_SAFETY.slice(0, 4).map(x => `<li>${icon('alert', 16)}<span>${L(x)}</span></li>`).join('')}</ul></div>
      <button class="btn block" data-act="checkOut" data-id="${r.id}">${icon('check', 18)} ${T('btn.checkout')}</button>` : ''}
    ${step === 2 ? `<div class="success" style="padding:16px 0"><div class="big">${icon('check', 44)}</div><h2 style="color:var(--navy)">${T('ci.done')}</h2>
      <p class="muted" style="margin:8px 0">${T('ci.done2', fmtH(r.hours))}</p>${badge(r.hstat === 'verified' ? 'verified' : 'pending', r.hstat === 'verified' ? T('hours.verified') : T('hours.pending'))}</div>
      <button class="btn block" data-act="open" data-to="#/impact">${T('btn.viewimpact')}</button>` : ''}
    <div class="card" style="margin-top:14px"><h3>${icon('alert', 18)} ${T('ci.report')}</h3><p class="small muted" style="margin:4px 0 8px">${T('ci.reportnote')}</p>
      <textarea data-bind="inc.text" placeholder="${T('ci.reportph')}">${esc(D.inc.text)}</textarea>
      <div class="row" style="margin-top:8px"><button class="btn sm sec" data-act="sendInc" data-type="incident" data-oid="${o.id}">${T('ci.sendinc')}</button><button class="btn sm ghost" data-act="sendInc" data-type="feedback" data-oid="${o.id}">${T('ci.sendfb')}</button></div></div>
    <p class="small muted">${T('ci.contact')}: ${esc(o.contact.phone)}</p>`
  };
};

/* ---------- 09 Impact ---------- */
V.impact = () => {
  const u = me(), vh = verifiedHours(u.id), ph = pendingHours(u.id), done = completedCount(u.id);
  const verified = myRegs().filter(r => r.hstat === 'verified').sort((a, b) => opp(b.oid).date.localeCompare(opp(a.oid).date));
  const pend = myRegs().filter(r => r.hstat === 'pending');
  const hospN = new Set(verified.map(r => opp(r.oid).hid)).size;
  const bd = [['award', vh >= 1, 'badge.first'], ['clock', vh >= 10, 'badge.h10'], ['check', done >= 3, 'badge.s3'], ['building', hospN >= 2, 'badge.h2']];
  const certs = [10, 25];
  const row = r => { const o = opp(r.oid); return `<button class="card" style="width:100%;text-align:left;margin-bottom:10px;display:block" data-act="hist" data-id="${r.id}"><div class="row between"><b>${esc(L(o.title))}</b>${badge('verified', fmtH(r.hours) + ' ' + T('unit.h'))}</div><div class="meta">${icon('building', 15)} ${hosp(o.hid).name}</div><div class="meta">${icon('calendar', 15)} ${fmtDate(o.date)} · ${L(CATS[o.cat].name)}</div></button>`; };
  return {
    nav: 'impact', title: T('nav.impact'), body: `
    <div class="d-hero" style="text-align:center"><div style="font-size:13px;opacity:.9">${T('m.hours')}</div><div style="font-size:46px;font-weight:700;line-height:1.1">${fmtH(vh)}</div>
      <div style="font-size:13px;opacity:.9">${T('impact.verifiednote')}</div></div>
    <div class="metrics" style="grid-template-columns:1fr 1fr">${metric(T('m.shifts'), done, 'check')}${metric(T('m.pendinghrs'), fmtH(ph), 'alert')}</div>
    <div class="sec-title">${T('impact.badges')}</div>
    <div class="grid2" style="grid-template-columns:repeat(4,1fr);gap:8px">${bd.map(b => `<div class="badge-tile ${b[1] ? '' : 'locked'}"><div class="ic-w">${icon(b[0], 22)}</div>${T(b[2])}</div>`).join('')}</div>
    <div class="sec-title">${T('impact.certs')}</div>
    ${certs.map(m => vh >= m ? `<div class="card row between"><div><b>${T('cert.name', m)}</b><div class="small muted">${T('cert.demo')}</div></div><button class="btn sm" data-act="cert" data-m="${m}">${icon('download', 16)} ${T('btn.open')}</button></div>` : `<div class="card row between" style="opacity:.6"><div><b>${T('cert.name', m)}</b><div class="small muted">${T('cert.locked', fmtH(Math.max(0, m - vh)))}</div></div>${icon('lock', 20)}</div>`).join('')}
    ${pend.length ? `<div class="sec-title">${T('impact.pending')}</div>${pend.map(r => { const o = opp(r.oid); return `<div class="card"><div class="row between"><b>${esc(L(o.title))}</b>${badge('pending', T('hours.pending') + ' · ' + fmtH(r.hours) + ' ' + T('unit.h'))}</div><div class="meta">${icon('calendar', 15)} ${fmtDate(o.date)} · ${hosp(o.hid).name}</div><p class="small muted" style="margin-top:6px">${T('impact.pendnote')}</p></div>`; }).join('')}` : ''}
    <div class="sec-title">${T('impact.history')}</div>
    ${verified.length ? verified.map(row).join('') : `<div class="card">${empty('chart', T('impact.empty'), T('impact.empty2'), `<button class="btn" data-act="open" data-to="#/explore">${T('btn.explore')}</button>`)}</div>`}
    <p class="small muted">${T('impact.disclaimer')}</p>`
  };
};

/* ---------- Profile ---------- */
V.profile = () => {
  const u = me(), prefs = !u.noPref && u.prefs.length;
  return {
    nav: 'profile', title: T('nav.profile'), body: `
    <div class="card"><div class="row" style="flex-wrap:nowrap"><div class="avatar">${initials(u.name)}</div><div><h3 style="font-size:18px">${esc(u.name)}</h3><div class="muted small">${esc(u.org || '')}</div><div class="muted small">${esc(u.email)} · ${esc(u.phone)}</div></div></div>
      <div class="row" style="margin-top:12px"><button class="btn sm sec" data-act="open" data-to="#/edit-profile">${icon('edit', 15)} ${T('profile.edit')}</button></div></div>
    <div class="card"><div class="row between"><h3>${T('prefs.title')}</h3><button class="btn sm" data-act="open" data-to="#/prefs">${T('btn.updateprefs')}</button></div>
      <div class="chips" style="margin-top:10px">${prefs ? u.prefs.map(id => `<span class="chip" aria-pressed="false">${icon('building', 14)} ${hosp(id).name}</span>`).join('') : `<span class="chip">${T('hosp.all')}</span>`}</div>
      <p class="small muted" style="margin-top:8px">${T('hosp.disclaimer')}</p></div>
    <div class="card"><h3>${T('setup.avail')}</h3>
      <div class="chips" style="margin-top:8px">${u.days.map(d => `<span class="chip">${T('day.' + d)}</span>`).join('') || '—'}</div>
      <div class="chips" style="margin-top:8px">${u.slots.map(d => `<span class="chip">${T('slot.' + d)}</span>`).join('') || '—'}</div></div>
    <div class="card"><h3>${T('setup.skills')}</h3><div class="chips" style="margin-top:8px">${u.skills.map(k => `<span class="chip">${T('skill.' + k)}</span>`).join('') || '—'}</div>
      <p class="small muted" style="margin-top:8px">${T('f.exp')}: ${u.exp ? T('exp.' + u.exp) : '—'}</p></div>
    <div class="card"><h3>${T('help.title')}</h3>
      <ul class="list">${COMMON_SAFETY.map(x => `<li>${icon('shield', 16)}<span>${L(x)}</span></li>`).join('')}</ul>
      <div class="hr"></div><h3 style="font-size:15px">${T('help.booth')}</h3><p class="small" style="margin-top:4px">${T('help.booth2')}</p>
      <div class="hr"></div><p class="small muted">${T('help.contact')}: coordinator@carelink.example</p></div>
    <div class="card"><h3>${T('settings.title')}</h3>
      <div class="row between" style="margin:10px 0"><span>${T('settings.lang')}</span>${langToggle()}</div>
      <label class="check" style="margin:10px 0"><input type="checkbox" data-bind="notifOn" data-rerender="1" ${ST.notifOn ? 'checked' : ''}><span>${T('settings.notif')}</span></label>
      <div class="row"><button class="btn sm ghost" data-act="resetDemo">${T('settings.reset')}</button><button class="btn sm danger" data-act="logout">${icon('logout', 15)} ${T('btn.logout')}</button></div></div>
    <p class="small muted" style="text-align:center">${T('footer.demo')}</p>`
  };
};
