/* CareLink – state, persistence and business rules (demo, localStorage only) */
const KEY = 'carelink.demo.v2';
let ST;

function todayStr() { return _off(0); }
function addDays(s, n) { const [y, m, d] = s.split('-').map(Number); const dt = new Date(y, m - 1, d + n); return _iso(dt); }
function daysBetween(a, b) { const pa = a.split('-').map(Number), pb = b.split('-').map(Number); return Math.round((new Date(pb[0], pb[1] - 1, pb[2]) - new Date(pa[0], pa[1] - 1, pa[2])) / 864e5); }
function parseD(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function fmtDate(s, long) {
  const d = parseD(s);
  return new Intl.DateTimeFormat(LANG === 'vi' ? 'vi-VN' : 'en-GB', long ? { weekday: 'long', day: 'numeric', month: 'long' } : { weekday: 'short', day: 'numeric', month: 'short' }).format(d);
}
function fmtTime(ts) { return ts ? new Intl.DateTimeFormat(LANG === 'vi' ? 'vi-VN' : 'en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }).format(new Date(ts)) : '—'; }
function toMin(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }
function shiftHours(s) { return Math.max(0, (toMin(s.end) - toMin(s.start)) / 60); }
function fmtH(h) { return (Math.round(h * 10) / 10).toString().replace('.', LANG === 'vi' ? ',' : '.'); }

function load() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
  if (!s || s.v !== 2) s = seedState();
  // keep relative demo dates fresh
  const delta = daysBetween(s.seedDay, todayStr());
  if (delta !== 0) { s.opps.forEach(o => { o.date = addDays(o.date, delta); }); s.seedDay = todayStr(); }
  ST = s; LANG = ST.lang || 'vi';
  save();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(ST)); } catch (e) { /* storage blocked: app still works in memory */ } }
function resetDemo() { try { localStorage.removeItem(KEY); } catch (e) { } const lang = LANG; ST = seedState(); ST.lang = lang; save(); }
function uid(p) { return p + (++ST.seq); }

/* lookups */
const hosp = id => HOSPITALS.find(h => h.id === id);
const opp = id => ST.opps.find(o => o.id === id);
const user = id => ST.users.find(u => u.id === id);
const me = () => user(ST.meId);
const reg = id => ST.regs.find(r => r.id === id);
const shiftOf = r => { const o = opp(r.oid); return o && o.shifts.find(s => s.id === r.sid); };
const partner = hid => ST.hospStatus[hid] || 'unconfirmed';
const meetOf = o => o.meet || hosp(o.hid).meet;
const tasksOf = o => o.tasks || CATS[o.cat].tasks;
const safetyOf = o => (o.safety || []).concat(COMMON_SAFETY);

function takenOf(o, s) { return s.base + ST.regs.filter(r => r.oid === o.id && r.sid === s.id && (r.status === 'pending' || r.status === 'confirmed')).length; }
function remainingOf(o, s) { return Math.max(0, s.cap - takenOf(o, s)); }
function remainingTotal(o) { return o.shifts.reduce((a, s) => a + remainingOf(o, s), 0); }
function capTotal(o) { return o.shifts.reduce((a, s) => a + s.cap, 0); }
function myRegs(vid) { return ST.regs.filter(r => r.vid === (vid || ST.meId)); }
function myRegFor(oid) { return myRegs().find(r => r.oid === oid && r.status !== 'cancelled'); }
function dispStatus(r) { return r.status === 'confirmed' && r.att === 'in' ? 'checkedin' : r.status; }
function verifiedHours(vid) { return ST.regs.filter(r => r.vid === vid && r.hstat === 'verified').reduce((a, r) => a + r.hours, 0); }
function pendingHours(vid) { return ST.regs.filter(r => r.vid === vid && r.hstat === 'pending').reduce((a, r) => a + r.hours, 0); }
function completedCount(vid) { return ST.regs.filter(r => r.vid === vid && r.status === 'completed' && r.hstat === 'verified').length; }
function unreadCount() { return notifsFor(ST.meId).filter(n => !n.read).length; }
function notifsFor(vid) { return ST.notifs.filter(n => n.to === vid || n.to === 'all').sort((a, b) => b.at - a.at); }

function nextReg(vid) {
  const live = myRegs(vid).filter(r => ['confirmed', 'pending', 'waitlisted'].includes(r.status) && r.att !== 'out');
  const order = { confirmed: 0, pending: 1, waitlisted: 2 };
  return live.filter(r => { const o = opp(r.oid); return o && o.date >= todayStr(); })
    .sort((a, b) => opp(a.oid).date.localeCompare(opp(b.oid).date) || order[a.status] - order[b.status])[0];
}

/* rule-based recommendations (NOT AI) */
function recommend(u, limit = 4) {
  const prefs = !u.noPref && u.prefs.length ? u.prefs : null;
  return ST.opps.filter(o => o.status === 'published' && o.date >= todayStr() && remainingTotal(o) > 0 && !myRegFor(o.id))
    .map(o => {
      let score = 0; const why = [];
      if (prefs && prefs.includes(o.hid)) { score += 5; why.push('why.hosp'); }
      const di = DAY_BY_GETDAY[parseD(o.date).getDay()];
      if (u.days.includes(di)) { score += 2; why.push('why.day'); }
      const slotOf = s => toMin(s.start) < 720 ? 'morning' : toMin(s.start) < 1020 ? 'afternoon' : 'evening';
      if (o.shifts.some(s => u.slots.includes(slotOf(s)))) { score += 1; why.push('why.time'); }
      if (o.tags.some(t => u.skills.includes(t))) { score += 2; why.push('why.skill'); }
      return { o, score, why };
    }).sort((a, b) => b.score - a.score || a.o.date.localeCompare(b.o.date)).slice(0, limit);
}

/* ---------- notifications ---------- */
function pushNotif(to, title, msg, extra = {}) { ST.notifs.push(Object.assign({ id: uid('n'), to, title, msg, at: Date.now(), read: false }, extra)); }
const bi = (vi, en) => ({ vi, en });

/* ---------- volunteer actions ---------- */
function loginUser(id, role) { ST.meId = id; ST.role = role; save(); }
function logout() { ST.meId = null; ST.role = null; save(); }

function upsertUser(data, editingId) {
  if (editingId) { Object.assign(user(editingId), data); save(); return user(editingId); }
  const u = Object.assign({ id: uid('v') }, data); ST.users.push(u);
  pushNotif(u.id, bi('Chào mừng đến với CareLink', 'Welcome to CareLink'), bi('Hãy chọn bệnh viện bạn muốn tham gia và đăng ký ca đầu tiên. Lưu ý: bản mẫu dùng dữ liệu mô phỏng.', 'Pick your preferred hospitals and register for your first shift. Note: this prototype uses simulated data.'));
  ST.meId = u.id; ST.role = 'volunteer'; save(); return u;
}

function register(oid, sid) {
  const o = opp(oid), s = o.shifts.find(x => x.id === sid);
  const full = remainingOf(o, s) <= 0;
  const r = { id: uid('r'), vid: ST.meId, oid, sid, status: full ? 'waitlisted' : 'pending', att: 'none', inAt: null, outAt: null, hours: 0, hstat: 'none', outcome: '', cancelReq: null, reqNote: '', checks: [], created: Date.now() };
  ST.regs.push(r);
  pushNotif('coord', bi('Đăng ký mới', 'New registration'), bi(`${me().name} đăng ký “${L(o.title)}”.`, `${me().name} registered for “${L(o.title)}”.`), { oid });
  pushNotif(ST.meId, full ? bi('Đã vào danh sách chờ', 'Added to waitlist') : bi('Đã gửi đăng ký', 'Registration submitted'),
    full ? bi('Ca đã đủ người. Bạn sẽ được báo nếu có chỗ trống.', 'The shift is full. You will be notified if a place opens.') : bi('Đăng ký đang chờ điều phối viên xác nhận.', 'Your registration is waiting for coordinator confirmation.'), { oid });
  save(); return r;
}
function withdraw(rid) {
  const r = reg(rid); r.status = 'cancelled'; r.reqNote = r.reqNote || 'withdrawn';
  pushNotif('coord', bi('Tình nguyện viên rút đăng ký', 'Volunteer withdrew'), bi(`${user(r.vid).name} đã rút đăng ký “${L(opp(r.oid).title)}”.`, `${user(r.vid).name} withdrew from “${L(opp(r.oid).title)}”.`), { oid: r.oid });
  save();
}
function requestChange(rid, type, note) {
  const r = reg(rid); r.cancelReq = type; r.reqNote = note || '';
  pushNotif('coord', type === 'cancel' ? bi('Yêu cầu hủy ca', 'Cancellation request') : bi('Yêu cầu đổi ca', 'Shift-change request'), bi(`${user(r.vid).name} – “${L(opp(r.oid).title)}”.`, `${user(r.vid).name} – “${L(opp(r.oid).title)}”.`), { oid: r.oid });
  save();
}
function checkIn(rid) { const r = reg(rid); r.att = 'in'; r.inAt = Date.now(); save(); }
function checkOut(rid) {
  const r = reg(rid), s = shiftOf(r); r.att = 'out'; r.outAt = Date.now(); r.status = 'completed'; r.hours = shiftHours(s); r.hstat = 'pending';
  pushNotif('coord', bi('Giờ tình nguyện chờ duyệt', 'Hours awaiting verification'), bi(`${user(r.vid).name} đã check-out “${L(opp(r.oid).title)}” (${fmtH(r.hours)} giờ).`, `${user(r.vid).name} checked out of “${L(opp(r.oid).title)}” (${fmtH(r.hours)} h).`), { oid: r.oid });
  save();
}
function addIncident(type, text, oid) { ST.incidents.unshift({ id: uid('i'), vid: ST.meId, oid, type, text, at: Date.now(), resolved: false }); save(); }

/* ---------- coordinator actions ---------- */
function approveReg(rid) {
  const r = reg(rid), o = opp(r.oid), s = shiftOf(r);
  if (r.status === 'waitlisted' && remainingOf(o, s) <= 0) return false;
  r.status = 'confirmed';
  pushNotif(r.vid, bi('Đăng ký đã được xác nhận', 'Registration confirmed'), bi(`“${L(o.title)}” – ${fmtDate(o.date)} ${s.start}–${s.end}. ${PREP.vi}`, `“${L(o.title)}” – ${fmtDate(o.date)} ${s.start}–${s.end}. ${PREP.en}`), { oid: o.id });
  save(); return true;
}
function declineReg(rid) {
  const r = reg(rid), o = opp(r.oid); r.status = 'cancelled'; r.reqNote = 'declined';
  pushNotif(r.vid, bi('Đăng ký chưa được chấp nhận', 'Registration not accepted'), bi(`Đăng ký “${L(o.title)}” chưa được chấp nhận. Bạn có thể chọn ca khác.`, `Your registration for “${L(o.title)}” was not accepted. You can pick another shift.`), { oid: o.id });
  save();
}
function resolveRequest(rid, approve) {
  const r = reg(rid), o = opp(r.oid), type = r.cancelReq;
  if (approve) { r.status = 'cancelled'; }
  r.cancelReq = null;
  pushNotif(r.vid, approve ? bi('Yêu cầu đã được chấp thuận', 'Request approved') : bi('Yêu cầu chưa được chấp thuận', 'Request not approved'),
    approve ? bi(type === 'change' ? `Ca “${L(o.title)}” đã được hủy; vui lòng đăng ký ca mới.` : `Ca “${L(o.title)}” đã được hủy.`, type === 'change' ? `“${L(o.title)}” was cancelled; please register for a new shift.` : `“${L(o.title)}” was cancelled.`)
      : bi(`Bạn vẫn giữ ca “${L(o.title)}”. Liên hệ điều phối viên nếu cần.`, `You keep your place in “${L(o.title)}”. Contact the coordinator if needed.`), { oid: o.id });
  save();
}
function assignVolunteer(vid, oid, sid) {
  const ex = ST.regs.find(r => r.vid === vid && r.oid === oid && r.status !== 'cancelled');
  if (ex) return 'dup';
  const r = { id: uid('r'), vid, oid, sid, status: 'confirmed', att: 'none', inAt: null, outAt: null, hours: 0, hstat: 'none', outcome: '', cancelReq: null, reqNote: '', checks: [], created: Date.now() };
  ST.regs.push(r); const o = opp(oid);
  pushNotif(vid, bi('Bạn được phân công một ca', 'You were assigned a shift'), bi(`Điều phối viên đã phân công bạn vào “${L(o.title)}”.`, `The coordinator assigned you to “${L(o.title)}”.`), { oid });
  save(); return 'ok';
}
function approveHours(rid, outcome) {
  const r = reg(rid); r.hstat = 'verified'; if (outcome) r.outcome = outcome;
  pushNotif(r.vid, bi('Giờ tình nguyện đã được duyệt', 'Volunteer hours verified'), bi(`Điều phối viên đã duyệt ${fmtH(r.hours)} giờ cho “${L(opp(r.oid).title)}”.`, `The coordinator verified ${fmtH(r.hours)} h for “${L(opp(r.oid).title)}”.`), { oid: r.oid });
  save();
}
function saveOpp(o) { const i = ST.opps.findIndex(x => x.id === o.id); if (i >= 0) ST.opps[i] = o; else ST.opps.unshift(o); save(); }
function setOppStatus(id, st) { opp(id).status = st; save(); }
function sendAnnouncement(audience, title, msg) {
  let targets;
  if (audience === 'all') targets = ['all'];
  else targets = [...new Set(ST.regs.filter(r => r.oid === audience && ['confirmed', 'pending', 'waitlisted'].includes(r.status)).map(r => r.vid))];
  targets.forEach(t => pushNotif(t, { vi: title, en: title }, { vi: msg, en: msg }, audience === 'all' ? {} : { oid: audience }));
  ST.sent.unshift({ id: uid('a'), audience, title, msg, at: Date.now(), n: audience === 'all' ? ST.users.length : targets.length });
  save(); return targets.length;
}
function exportCSV() {
  const rows = [['Volunteer', 'Email', 'Organisation', 'Hospital', 'Activity', 'Date', 'Shift', 'Status', 'Attendance', 'Hours', 'HoursStatus']];
  ST.regs.forEach(r => { const u = user(r.vid), o = opp(r.oid), s = shiftOf(r); if (!u || !o) return; rows.push([u.name, u.email, u.org, hosp(o.hid).name, L(o.title), o.date, s ? s.start + '-' + s.end : '', r.status, r.att, r.hours, r.hstat]); });
  const csv = '﻿' + rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'carelink-demo-report.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
