/* CareLink – restricted Coordinator / Admin screens (demo access only) */
const C = {};
const cTabs = [['ov', 'grid', 'c.tab.ov'], ['opps', 'clipboard', 'c.tab.opps'], ['regs', 'users', 'c.tab.regs'], ['att', 'check', 'c.tab.att'], ['hosp', 'building', 'c.tab.hosp'], ['ann', 'send', 'c.tab.ann']];
const reqList = () => ST.regs.filter(r => r.cancelReq);
const pendList = () => ST.regs.filter(r => r.status === 'pending');
const waitList = () => ST.regs.filter(r => r.status === 'waitlisted');
const hoursList = () => ST.regs.filter(r => r.hstat === 'pending');
const who = r => user(r.vid) || { name: '?', org: '' };

function cRow(r, acts) {
  const o = opp(r.oid), s = shiftOf(r), u = who(r);
  return `<div class="list-row"><div class="main"><b>${esc(u.name)}</b> <span class="muted small">· ${esc(u.org || '')}</span>
    <div class="meta">${icon('clipboard', 14)} ${esc(L(o.title))} · ${hosp(o.hid).name}</div>
    <div class="meta">${icon('calendar', 14)} ${fmtDate(o.date)} ${s ? s.start + '–' + s.end : ''}</div>
    ${r.reqNote && r.cancelReq ? `<div class="small" style="margin-top:4px">“${esc(r.reqNote)}”</div>` : ''}</div>
    <div class="row" style="gap:6px">${badge(dispStatus(r))}</div><div class="acts">${acts}</div></div>`;
}

C.coord = () => {
  const tab = D.cTab;
  let body = '';
  if (tab === 'ov') {
    const act = ST.opps.filter(o => o.status === 'published' && o.date >= todayStr());
    const shifts = act.reduce((a, o) => a + o.shifts.length, 0);
    const regsN = ST.regs.filter(r => ['pending', 'confirmed', 'waitlisted'].includes(r.status)).length;
    const att = ST.regs.filter(r => r.att !== 'none').length;
    const notes = ST.notifs.filter(n => n.to === 'coord').sort((a, b) => b.at - a.at).slice(0, 6);
    body = `${demoNote('c.demo')}
    <div class="metrics four">${metric(T('c.m.opps'), act.length, 'clipboard')}${metric(T('c.m.regs'), regsN, 'users')}${metric(T('c.m.shifts'), shifts, 'calendar')}${metric(T('c.m.att'), att, 'check')}</div>
    <div class="sec-title">${T('c.queue')}</div>
    <div class="queue">
      <button data-act="cTab" data-v="regs"><span style="color:var(--teal)">${icon('users', 24)}</span><span><b>${pendList().length}</b>${T('c.q.pend')}</span></button>
      <button data-act="cTab" data-v="regs"><span style="color:var(--coral)">${icon('alert', 24)}</span><span><b>${reqList().length}</b>${T('c.q.req')}</span></button>
      <button data-act="cTab" data-v="regs"><span style="color:var(--blue)">${icon('list', 24)}</span><span><b>${waitList().length}</b>${T('c.q.wait')}</span></button>
      <button data-act="cTab" data-v="att"><span style="color:var(--navy)">${icon('clock', 24)}</span><span><b>${hoursList().length}</b>${T('c.q.hours')}</span></button></div>
    <div class="c-two" style="margin-top:16px"><div class="card"><h3>${T('c.recent')}</h3>${notes.length ? notes.map(notifRow).join('') : `<p class="muted">${T('notif.none')}</p>`}</div>
    <div class="card"><h3>${T('c.quick')}</h3><div class="stack" style="margin-top:10px"><button class="btn block" data-act="open" data-to="#/coord-opp/new">${icon('plus', 18)} ${T('c.new')}</button><button class="btn sec block" data-act="cTab" data-v="ann">${icon('send', 18)} ${T('c.tab.ann')}</button></div></div></div>`;
  }
  if (tab === 'opps') {
    const list = [...ST.opps].sort((a, b) => b.date.localeCompare(a.date));
    body = `<div class="row between" style="margin-bottom:10px"><h2 style="color:var(--navy);font-size:18px">${T('c.tab.opps')}</h2><button class="btn" data-act="open" data-to="#/coord-opp/new">${icon('plus', 18)} ${T('c.new')}</button></div>
    <div class="card">${list.map(o => `<div class="list-row"><div class="main"><b>${esc(L(o.title))}</b> ${o.sample ? `<span class="pill-demo">${T('demo.tag')}</span>` : ''}
      <div class="meta">${icon('building', 14)} ${hosp(o.hid).name} · ${partnerBadge(o.hid)}</div>
      <div class="meta">${icon('calendar', 14)} ${fmtDate(o.date)} · ${timeRange(o)} · ${T('slots.left', remainingTotal(o), capTotal(o))}</div></div>
      ${badge(o.status)}
      <div class="acts"><button class="btn sm ghost" data-act="open" data-to="#/coord-opp/${o.id}">${icon('edit', 14)} ${T('btn.edit')}</button>
      ${o.status === 'published' ? `<button class="btn sm danger" data-act="oppStatus" data-id="${o.id}" data-v="closed">${T('c.close')}</button>` : `<button class="btn sm" data-act="oppPublish" data-id="${o.id}">${o.status === 'closed' ? T('c.reopen') : T('c.publish')}</button>`}</div></div>`).join('')}</div>`;
  }
  if (tab === 'regs') {
    const af = D.assign, o = af.oid ? opp(af.oid) : null;
    const vols = ST.users;
    const group = (title, arr, acts) => arr.length ? `<div class="card"><h3>${title} (${arr.length})</h3>${arr.map(r => cRow(r, acts(r))).join('')}</div>` : '';
    body = `<div class="card"><h3>${T('c.assign')}</h3><div class="form-grid" style="margin-top:10px">
      ${field(T('c.opp'), `<select data-bind="assign.oid" data-rerender="1"><option value="">—</option>${ST.opps.filter(x => x.status === 'published').map(x => `<option value="${x.id}" ${af.oid === x.id ? 'selected' : ''}>${esc(L(x.title))} · ${hosp(x.hid).name} · ${fmtDate(x.date)}</option>`).join('')}</select>`)}
      ${field(T('c.shift'), `<select data-bind="assign.sid"><option value="">—</option>${o ? o.shifts.map((s, i) => `<option value="${s.id}" ${af.sid === s.id ? 'selected' : ''}>${s.start}–${s.end} (${T('slots.left', remainingOf(o, s), s.cap)})</option>`).join('') : ''}</select>`)}
      ${field(T('c.vol'), `<select data-bind="assign.vid"><option value="">—</option>${vols.map(v => `<option value="${v.id}" ${af.vid === v.id ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select>`)}</div>
      <button class="btn" data-act="assign">${T('c.assignbtn')}</button></div>
    ${group(T('c.reqs'), reqList(), r => `<button class="btn sm teal" data-act="resolve" data-id="${r.id}" data-v="1">${T('btn.approve')}</button><button class="btn sm ghost" data-act="resolve" data-id="${r.id}" data-v="0">${T('btn.reject')}</button>`)}
    ${group(T('c.pend'), pendList(), r => `<button class="btn sm teal" data-act="approveReg" data-id="${r.id}">${T('btn.approve')}</button><button class="btn sm danger" data-act="declineReg" data-id="${r.id}">${T('btn.decline')}</button>`)}
    ${group(T('c.wait'), waitList(), r => `<button class="btn sm teal" data-act="approveReg" data-id="${r.id}">${T('c.promote')}</button><button class="btn sm danger" data-act="declineReg" data-id="${r.id}">${T('btn.decline')}</button>`)}
    ${group(T('c.conf'), ST.regs.filter(r => r.status === 'confirmed' && !r.cancelReq), r => '')}`;
  }
  if (tab === 'att') {
    const recs = ST.regs.filter(r => r.att !== 'none').sort((a, b) => (b.inAt || 0) - (a.inAt || 0));
    body = `<div class="row between" style="margin-bottom:10px"><h2 style="color:var(--navy);font-size:18px">${T('c.tab.att')}</h2><button class="btn sec" data-act="exportCsv">${icon('download', 18)} ${T('c.export')}</button></div>
    <div class="c-two"><div class="card"><h3>${T('c.q.hours')} (${hoursList().length})</h3>
      ${hoursList().length ? hoursList().map(r => cRow(r, `<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center"><input type="text" style="width:190px;min-height:38px;padding:6px 10px" id="oc-${r.id}" placeholder="${T('c.outcome')}"><button class="btn sm teal" data-act="approveHours" data-id="${r.id}">${T('c.approvehrs', fmtH(r.hours))}</button></div>`)).join('') : `<p class="muted" style="margin-top:8px">${T('c.nohours')}</p>`}</div>
    <div class="card"><h3>${T('c.records')}</h3>${recs.length ? recs.map(r => `<div class="list-row"><div class="main"><b>${esc(who(r).name)}</b><div class="meta">${esc(L(opp(r.oid).title))} · ${hosp(opp(r.oid).hid).name}</div><div class="meta">${icon('pin', 14)} ${T('c.in')} ${fmtTime(r.inAt)} · ${T('c.out')} ${fmtTime(r.outAt)}</div>${r.outcome ? `<div class="small" style="margin-top:3px">${icon('check', 12)} ${esc(r.outcome)}</div>` : ''}</div>${r.hstat === 'verified' ? badge('verified', T('hours.verified') + ' · ' + fmtH(r.hours) + ' ' + T('unit.h')) : r.hstat === 'pending' ? badge('pending', T('hours.pending')) : badge('checkedin')}</div>`).join('') : `<p class="muted">${T('notif.none')}</p>`}</div></div>
    <div class="card"><h3>${T('c.fb')}</h3>${ST.incidents.length ? ST.incidents.map(i => `<div class="list-row"><div class="main"><span class="badge b-${i.type === 'incident' ? 'requested' : 'unconfirmed'}">${icon(i.type === 'incident' ? 'alert' : 'info', 13)} ${T('ci.type.' + i.type)}</span> <b>${esc((user(i.vid) || { name: '?' }).name)}</b><div style="margin-top:4px">${esc(i.text)}</div><div class="small muted">${fmtTime(i.at)}</div></div>${i.resolved ? badge('verified', T('c.resolved')) : `<button class="btn sm ghost" data-act="resolveInc" data-id="${i.id}">${T('c.markres')}</button>`}</div>`).join('') : `<p class="muted">${T('notif.none')}</p>`}</div>
    <p class="small muted">${T('c.privacy')}</p>`;
  }
  if (tab === 'hosp') {
    body = `<div class="card"><h3>${T('c.tab.hosp')}</h3><p class="small muted" style="margin:4px 0 8px">${T('c.hospnote')}</p>${HOSPITALS.map(h => `<div class="list-row"><div class="main"><b>${h.name}</b><div class="meta">${icon('pin', 14)} ${L(h.area)} · ${L(h.cat)}</div><div class="meta small">${L(meetOf({ hid: h.id }))}</div></div>${partnerBadge(h.id)}<div class="acts"><select aria-label="${T('c.partner')}" data-act="setPartner" data-id="${h.id}" style="min-height:38px;padding:4px 8px">${PARTNER_STATES.map(p => `<option value="${p}" ${partner(h.id) === p ? 'selected' : ''}>${T('partner.' + p)}</option>`).join('')}</select></div></div>`).join('')}</div>`;
  }
  if (tab === 'ann') {
    const a = D.ann;
    body = `<div class="c-two"><div class="card"><h3>${T('c.sendann')}</h3><div style="margin-top:10px">
      ${field(T('c.audience'), `<select data-bind="ann.aud"><option value="all">${T('c.allvols')}</option>${ST.opps.filter(o => o.status === 'published').map(o => `<option value="${o.id}" ${a.aud === o.id ? 'selected' : ''}>${esc(L(o.title))} · ${fmtDate(o.date)}</option>`).join('')}</select>`)}
      ${field(T('c.anntitle'), `<input type="text" data-bind="ann.title" value="${esc(a.title)}">`, a.err)}
      ${field(T('c.annmsg'), `<textarea data-bind="ann.msg">${esc(a.msg)}</textarea>`)}
      <button class="btn" data-act="sendAnn">${icon('send', 18)} ${T('c.send')}</button></div></div>
    <div class="card"><h3>${T('c.sent')}</h3>${ST.sent.length ? ST.sent.map(s => `<div class="notif read"><span class="nd"></span><div><b>${esc(s.title)}</b><span class="small muted">${esc(s.msg)}</span><div class="small muted">${fmtTime(s.at)} · ${T('c.recipients', s.n)}</div></div></div>`).join('') : `<p class="muted">${T('notif.none')}</p>`}</div></div>`;
  }
  return {
    wide: true, coord: true, title: T('c.title'), body: `
    <div class="tabs" role="tablist">${cTabs.map(([k, ic, l]) => `<button class="tab" role="tab" aria-selected="${tab === k}" data-act="cTab" data-v="${k}">${icon(ic, 16)} ${T(l)}${k === 'regs' && (pendList().length + reqList().length) ? ` <span class="n">${pendList().length + reqList().length}</span>` : ''}</button>`).join('')}</div>${body}`
  };
};

/* ---------- create / edit opportunity ---------- */
C.coordOpp = () => {
  const f = D.of, e = f.errors || {}, edit = !!f.id;
  const need = partner(f.hid) !== 'confirmed' && f.hid;
  return {
    wide: true, coord: true, title: edit ? T('c.edit') : T('c.new'), back: '#/coord', body: `
    <div class="card"><div class="form-grid">
      ${field(T('c.otitle') + ' *', `<input type="text" data-bind="of.title" value="${esc(f.title)}">`, e.title)}
      ${field(T('c.hospital') + ' *', `<select data-bind="of.hid" data-rerender="1"><option value="">—</option>${HOSPITALS.map(h => `<option value="${h.id}" ${f.hid === h.id ? 'selected' : ''}>${h.name} — ${T('partner.' + partner(h.id))}</option>`).join('')}</select>`, e.hid)}
      ${field(T('c.cat'), `<select data-bind="of.cat">${Object.keys(CATS).map(k => `<option value="${k}" ${f.cat === k ? 'selected' : ''}>${L(CATS[k].name)}</option>`).join('')}</select>`)}
      ${field(T('f.date') + ' *', `<input type="date" data-bind="of.date" value="${f.date}">`, e.date)}
    </div>
    ${field(T('c.desc'), `<textarea data-bind="of.desc">${esc(f.desc)}</textarea>`)}
    <div class="form-grid">${field(T('c.tasks'), `<textarea data-bind="of.tasks" placeholder="${T('c.tasksph')}">${esc(f.tasks)}</textarea>`)}${field(T('c.safety'), `<textarea data-bind="of.safety" placeholder="${T('c.safetyph')}">${esc(f.safety)}</textarea>`)}</div>
    <div class="form-grid">${field(T('c.meet'), `<input type="text" data-bind="of.meet" value="${esc(f.meet)}" placeholder="${T('c.meetph')}">`)}${field(T('c.cname'), `<input type="text" data-bind="of.cname" value="${esc(f.cname)}">`)}${field(T('c.cphone'), `<input type="text" data-bind="of.cphone" value="${esc(f.cphone)}">`)}</div>
    <div class="lbl">${T('c.shifts')}</div>
    ${f.shifts.map((s, i) => `<div class="shift-edit"><div><label class="small muted">${T('c.start')}</label><input type="time" data-bind="of.shifts.${i}.start" value="${s.start}"></div><div><label class="small muted">${T('c.end')}</label><input type="time" data-bind="of.shifts.${i}.end" value="${s.end}"></div><div><label class="small muted">${T('c.cap')}</label><input type="number" min="1" data-bind="of.shifts.${i}.cap" value="${s.cap}"></div>${f.shifts.length > 1 ? `<button class="icon-btn" data-act="rmShift" data-i="${i}" aria-label="${T('btn.remove')}">${icon('trash', 18)}</button>` : '<span></span>'}</div>`).join('')}
    ${e.shifts ? `<div class="err">${icon('alert', 14)} ${e.shifts}</div>` : ''}
    ${f.shifts.length < 4 ? `<button class="btn sm ghost" data-act="addShift">${icon('plus', 14)} ${T('c.addshift')}</button>` : ''}
    </div>
    ${need ? `<div class="card warn"><label class="check"><input type="checkbox" data-bind="of.ack" ${f.ack ? 'checked' : ''}><span>${T('c.ack')}</span></label>${e.ack ? `<div class="err">${icon('alert', 14)} ${e.ack}</div>` : ''}</div>` : ''}
    <div class="row"><button class="btn ghost" data-act="saveOpp" data-pub="0">${T('c.savedraft')}</button><button class="btn" data-act="saveOpp" data-pub="1">${T('c.savepub')}</button></div>`
  };
};
