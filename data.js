/* CareLink – static catalogue + demo seed data (ALL DEMO / SAMPLE DATA) */
const SKILLS = ['communication', 'event', 'organisation', 'languages', 'logistics', 'teamwork'];
const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_BY_GETDAY = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const SLOTS = ['morning', 'afternoon', 'evening'];
const EXPS = ['none', 'some', 'experienced'];
const PARTNER_STATES = ['unconfirmed', 'inprogress', 'confirmed'];

const HOSPITALS = [
  { id: 'h1', name: 'Bệnh viện Chợ Rẫy', area: { vi: 'Quận 5 / khu Chợ Lớn', en: 'District 5 / Cho Lon area' }, cat: { vi: 'Đa khoa / tuyến cuối', en: 'General / tertiary referral' } },
  { id: 'h2', name: 'Bệnh viện Nhân dân 115', area: { vi: 'Quận 10 / khu Sư Vạn Hạnh', en: 'District 10 / Su Van Hanh area' }, cat: { vi: 'Đa khoa / cấp cứu và chuyên khoa', en: 'General / emergency and specialist care' } },
  { id: 'h3', name: 'Bệnh viện Nhân dân Gia Định', area: { vi: 'Bình Thạnh / khu Nơ Trang Long', en: 'Binh Thanh / No Trang Long area' }, cat: { vi: 'Đa khoa', en: 'General hospital' } },
  { id: 'h4', name: 'Bệnh viện Thống Nhất', area: { vi: 'Tân Bình / khu Lý Thường Kiệt', en: 'Tan Binh / Ly Thuong Kiet area' }, cat: { vi: 'Đa khoa', en: 'General hospital' } },
  { id: 'h5', name: 'Bệnh viện Từ Dũ', area: { vi: 'Quận 1 / khu Cống Quỳnh', en: 'District 1 / Cong Quynh area' }, cat: { vi: 'Sản phụ khoa', en: 'Obstetrics and gynaecology' } },
  { id: 'h6', name: 'Bệnh viện Hùng Vương', area: { vi: 'Quận 5 / khu Hồng Bàng', en: 'District 5 / Hong Bang area' }, cat: { vi: 'Sản phụ khoa', en: 'Obstetrics and gynaecology' } },
  { id: 'h7', name: 'Bệnh viện Nhi Đồng 1', area: { vi: 'Quận 10 / khu Sư Vạn Hạnh', en: 'District 10 / Su Van Hanh area' }, cat: { vi: 'Nhi khoa', en: 'Paediatrics' } },
  { id: 'h8', name: 'Bệnh viện Nhi Đồng 2', area: { vi: 'Quận 1 / khu Lý Tự Trọng', en: 'District 1 / Ly Tu Trong area' }, cat: { vi: 'Nhi khoa', en: 'Paediatrics' } },
  { id: 'h9', name: 'Bệnh viện Bình Dân', area: { vi: 'Quận 3 / khu Điện Biên Phủ', en: 'District 3 / Dien Bien Phu area' }, cat: { vi: 'Ngoại khoa và tiết niệu', en: 'Surgery and urology' } },
  { id: 'h10', name: 'Bệnh viện Bệnh Nhiệt đới', area: { vi: 'Quận 5 / khu Võ Văn Kiệt', en: 'District 5 / Vo Van Kiet area' }, cat: { vi: 'Truyền nhiễm và bệnh nhiệt đới', en: 'Infectious and tropical diseases' } },
];

/* Sample meeting points – MUST be confirmed with each hospital before real use */
const MEET = [
  { vi: 'Sảnh đón tiếp chính khu khám bệnh (mẫu)', en: 'Main outpatient reception lobby (sample)' },
  { vi: 'Khu vực gần cổng chính, bàn tình nguyện (mẫu)', en: 'Near the main gate, volunteer table (sample)' },
  { vi: 'Quầy thông tin tầng trệt (mẫu)', en: 'Ground-floor information desk (sample)' },
];
HOSPITALS.forEach((h, i) => { h.meet = MEET[i % 3]; h.map = 'map-' + h.id + (h.id === 'h3' ? '.png' : '.jpg'); });

const CATS = {
  guidance: {
    icon: 'pin',
    name: { vi: 'Hướng dẫn bệnh nhân & người nhà', en: 'Patient Guidance' },
    tasks: [
      { vi: 'Chỉ đường đến các khoa, phòng và khu vực theo bản đồ do bệnh viện cung cấp', en: 'Guide visitors to departments, rooms and areas using hospital-provided maps' },
      { vi: 'Giải thích các bước thủ tục hành chính cơ bản đã được bệnh viện xác nhận', en: 'Explain basic administrative steps that the hospital has verified' },
      { vi: 'Hỗ trợ sắp xếp hàng chờ khi được bệnh viện cho phép', en: 'Support queue organisation where authorised by the hospital' },
      { vi: 'Chuyển câu hỏi y tế đến nhân viên bệnh viện', en: 'Refer any medical question to hospital staff' },
    ],
    req: [
      { vi: 'Giao tiếp lịch sự, kiên nhẫn', en: 'Polite and patient communication' },
      { vi: 'Hoàn thành buổi định hướng ngắn trước ca', en: 'Complete the short pre-shift briefing' },
      { vi: 'Từ 18 tuổi trở lên (hoặc theo quy định của bệnh viện)', en: 'Aged 18+ (or as the hospital requires)' },
    ],
  },
  donation: {
    icon: 'box',
    name: { vi: 'Phát quà & nhu yếu phẩm', en: 'Donation Distribution' },
    tasks: [
      { vi: 'Chuẩn bị và sắp xếp nước uống, suất ăn nhẹ hoặc vật phẩm quyên góp', en: 'Prepare and arrange water, light meals or donated items' },
      { vi: 'Phát vật phẩm theo danh sách và hướng dẫn của điều phối viên', en: 'Distribute items following the coordinator’s list and instructions' },
      { vi: 'Ghi nhận số lượng phát bằng biểu mẫu giấy của CareLink', en: 'Record quantities on CareLink’s paper form' },
      { vi: 'Giữ khu vực phát gọn gàng, đảm bảo vệ sinh', en: 'Keep the distribution area tidy and hygienic' },
    ],
    req: [
      { vi: 'Có thể đứng và nâng vật nhẹ trong vài giờ', en: 'Able to stand and lift light items for a few hours' },
      { vi: 'Tuân thủ quy định vệ sinh thực phẩm', en: 'Follow food-hygiene rules' },
      { vi: 'Làm việc nhóm tốt', en: 'Good teamwork' },
    ],
  },
  booth: {
    icon: 'info',
    name: { vi: 'Hỗ trợ gian hàng CareLink', en: 'Booth Support' },
    tasks: [
      { vi: 'Đón tiếp và chào hỏi người đến gian hàng hỗ trợ CareLink', en: 'Welcome people who walk up to the CareLink support booth' },
      { vi: 'Cung cấp thông tin hướng dẫn đã được bệnh viện xác nhận', en: 'Share guidance information verified by the hospital' },
      { vi: 'Giữ gian hàng ngăn nắp, bổ sung tờ rơi và bản đồ', en: 'Keep the booth tidy; restock leaflets and maps' },
      { vi: 'Báo cáo sự cố hoặc phản hồi cho người giám sát', en: 'Report incidents or feedback to the supervisor' },
    ],
    req: [
      { vi: 'Kỹ năng giao tiếp tốt', en: 'Good communication skills' },
      { vi: 'Biết thêm ngoại ngữ là lợi thế', en: 'Additional languages are a plus' },
      { vi: 'Hoàn thành buổi định hướng an toàn', en: 'Complete the safety orientation' },
    ],
  },
  event: {
    icon: 'users',
    name: { vi: 'Hỗ trợ sự kiện', en: 'Event Support' },
    tasks: [
      { vi: 'Hỗ trợ đăng ký và đón tiếp tại hoạt động cộng đồng', en: 'Support sign-in and welcome at community activities' },
      { vi: 'Chuẩn bị không gian, vật dụng và biển chỉ dẫn', en: 'Set up the space, supplies and signage' },
      { vi: 'Hỗ trợ điều phối nhóm và giữ trật tự theo hướng dẫn', en: 'Help coordinate groups and keep order as instructed' },
      { vi: 'Dọn dẹp và kiểm đếm vật dụng sau hoạt động', en: 'Tidy up and count supplies after the activity' },
    ],
    req: [
      { vi: 'Tinh thần chủ động, nhiệt tình', en: 'Proactive and enthusiastic' },
      { vi: 'Kỹ năng tổ chức là lợi thế', en: 'Organisation skills are a plus' },
      { vi: 'Hoàn thành buổi định hướng an toàn', en: 'Complete the safety orientation' },
    ],
  },
};

const COMMON_SAFETY = [
  { vi: 'KHÔNG chẩn đoán, tư vấn y khoa, diễn giải kết quả xét nghiệm, gợi ý điều trị hay thực hiện thủ thuật lâm sàng.', en: 'Do NOT diagnose, give medical advice, interpret test results, recommend treatment or perform clinical procedures.' },
  { vi: 'Luôn đeo thẻ tình nguyện viên và tuân thủ quy định kiểm soát nhiễm khuẩn của bệnh viện.', en: 'Always wear your volunteer badge and follow the hospital’s infection-control rules.' },
  { vi: 'Không thu thập thông tin sức khỏe, không chụp ảnh bệnh nhân.', en: 'Do not collect health information or photograph patients.' },
  { vi: 'Gặp tình huống khẩn cấp hoặc khó xử: gọi nhân viên bệnh viện và liên hệ người giám sát ngay.', en: 'In an emergency or difficult situation: call hospital staff and contact your supervisor immediately.' },
  { vi: 'Báo cáo mọi sự cố cho điều phối viên trong ngày.', en: 'Report any incident to the coordinator the same day.' },
];
const DRESS = { vi: 'Áo/thẻ tình nguyện viên CareLink (hoặc áo sáng màu), quần dài, giày kín mũi.', en: 'CareLink volunteer shirt/badge (or a light-coloured top), long trousers, closed shoes.' };
const PREP = { vi: 'Có mặt trước giờ ca 15 phút tại điểm hẹn, mang theo giấy tờ tùy thân và chai nước cá nhân.', en: 'Arrive 15 minutes before your shift at the meeting point; bring photo ID and your own water bottle.' };

/* ---------------- seed ---------------- */
function _iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function _off(n) { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return _iso(d); }

function seedState() {
  const CONTACT = { name: 'Phạm Thu Hà (điều phối viên mẫu / sample coordinator)', phone: '0900 000 001 (mẫu)', channel: 'coordinator@carelink.example' };
  const O = (id, hid, cat, off, tv, te, dv, de, shifts, tags, status = 'published') => ({
    id, hid, cat, date: _off(off), title: { vi: tv, en: te }, desc: { vi: dv, en: de }, tags, status, sample: true,
    shifts: shifts.map((s, i) => ({ id: id + '-s' + i, start: s[0], end: s[1], cap: s[2], base: s[3] })),
    meet: null, tasks: null, safety: null, contact: CONTACT,
  });
  const opps = [
    O('o1', 'h1', 'booth', 2, 'Trực gian hàng hỗ trợ CareLink', 'CareLink Support Booth Shift', 'Hỗ trợ vận hành gian hàng CareLink: đón tiếp, cung cấp thông tin hướng dẫn đã được xác nhận và giữ gian hàng ngăn nắp.', 'Help run the CareLink booth: welcome visitors, share verified guidance information and keep the booth tidy.', [['07:30', '11:30', 6, 1], ['13:00', '17:00', 6, 2]], ['communication', 'organisation']),
    O('o2', 'h1', 'guidance', 4, 'Hướng dẫn lối đi khu khám bệnh', 'Outpatient Area Wayfinding', 'Đứng tại các điểm đông người để chỉ đường tới khu khám, quầy thủ tục và nhà vệ sinh.', 'Stand at busy points to point people towards clinics, registration counters and facilities.', [['07:00', '11:00', 8, 3]], ['communication', 'languages']),
    O('o3', 'h3', 'donation', 3, 'Phát nước và suất ăn nhẹ', 'Water & Light Meal Distribution', 'Chuẩn bị và phát nước uống, bánh cho người nhà chờ khám theo danh sách của điều phối viên.', 'Prepare and hand out water and snacks to waiting families, following the coordinator’s list.', [['08:00', '11:00', 5, 1], ['14:00', '17:00', 5, 0]], ['logistics', 'teamwork']),
    O('o4', 'h2', 'guidance', 5, 'Hỗ trợ xếp hàng khu tiếp đón', 'Reception Queue Support', 'Hỗ trợ sắp xếp hàng chờ tại khu tiếp đón (khi được bệnh viện cho phép) và hướng dẫn thủ tục cơ bản.', 'Help organise the queue at the reception area (where authorised) and explain basic procedures.', [['08:00', '12:00', 6, 2]], ['organisation', 'communication']),
    O('o5', 'h7', 'event', 6, 'Hoạt động cộng đồng cuối tuần', 'Weekend Community Activity', 'Hỗ trợ tổ chức hoạt động cộng đồng tại sảnh: đón tiếp, chuẩn bị vật dụng và điều phối nhóm.', 'Help run a community activity in the lobby: welcome, supplies setup and group coordination.', [['09:00', '12:00', 10, 5]], ['event', 'teamwork']),
    O('o6', 'h5', 'booth', 7, 'Trực gian hàng hỗ trợ CareLink', 'CareLink Support Booth Shift', 'Đón tiếp và cung cấp thông tin hướng dẫn tại gian hàng CareLink.', 'Welcome and share guidance information at the CareLink booth.', [['08:00', '12:00', 4, 1], ['13:00', '16:00', 4, 0]], ['communication', 'languages']),
    O('o7', 'h4', 'guidance', 3, 'Hướng dẫn thủ tục cho người cao tuổi', 'Wayfinding Support for Older Visitors', 'Đi cùng và chỉ đường cho người cao tuổi đến các quầy thủ tục (không hỗ trợ y tế).', 'Walk older visitors to registration counters and show them the way (no medical assistance).', [['07:30', '11:30', 5, 1]], ['communication', 'teamwork']),
    O('o8', 'h9', 'donation', 8, 'Phân phối vật phẩm quyên góp', 'Donated Item Distribution', 'Sắp xếp và phát vật phẩm quyên góp theo danh sách, ghi nhận số lượng.', 'Sort and distribute donated items from the list and record quantities.', [['09:00', '12:00', 6, 2]], ['logistics', 'organisation']),
    O('o9', 'h10', 'booth', 9, 'Trực gian hàng hỗ trợ CareLink', 'CareLink Support Booth Shift', 'Hỗ trợ gian hàng CareLink; ưu tiên bạn biết thêm ngoại ngữ.', 'Support the CareLink booth; extra languages are welcome.', [['08:00', '12:00', 4, 2]], ['languages', 'communication']),
    O('o10', 'h8', 'event', 10, 'Chiều hoạt động cùng các gia đình', 'Family Activity Afternoon', 'Hỗ trợ tổ chức hoạt động chiều cho các gia đình: chuẩn bị, đón tiếp, dọn dẹp.', 'Help run an afternoon activity for families: setup, welcome and clean-up.', [['14:00', '17:00', 8, 3]], ['event', 'teamwork']),
    O('o11', 'h6', 'guidance', 11, 'Hướng dẫn lối đi khu khám', 'Clinic Area Wayfinding', 'Chỉ đường đến các khu khám và quầy thủ tục đã được bệnh viện xác nhận.', 'Show the way to clinic areas and counters verified by the hospital.', [['07:30', '11:30', 5, 0]], ['communication']),
    O('o12', 'h1', 'donation', 6, 'Phát quà tặng quyên góp', 'Donated Gift Distribution', 'Hỗ trợ phát quà tặng quyên góp theo danh sách của điều phối viên. (Ca này đã đủ người – có thể vào danh sách chờ.)', 'Help distribute donated gifts from the coordinator’s list. (This shift is full – you can join the waitlist.)', [['15:00', '18:00', 3, 3]], ['logistics']),
    O('o13', 'h2', 'booth', 12, 'Trực gian hàng hỗ trợ CareLink', 'CareLink Support Booth Shift', 'Hỗ trợ gian hàng CareLink buổi sáng.', 'Support the CareLink booth in the morning.', [['08:00', '12:00', 5, 1]], ['communication', 'organisation']),
    O('o14', 'h3', 'event', 13, 'Ngày hội cộng đồng nhỏ', 'Small Community Day', 'Hỗ trợ đăng ký, đón tiếp và điều phối nhóm tại ngày hội nhỏ.', 'Support sign-in, welcome and group coordination at a small community day.', [['08:30', '11:30', 12, 6]], ['event', 'organisation']),
    O('o15', 'h4', 'donation', 15, 'Phát nước (bản nháp)', 'Water Distribution (draft)', 'Bản nháp do điều phối viên soạn – chưa công bố.', 'Coordinator draft – not yet published.', [['08:00', '11:00', 5, 0]], ['logistics'], 'draft'),
    // past activities (history)
    O('p1', 'h1', 'booth', -21, 'Trực gian hàng hỗ trợ CareLink', 'CareLink Support Booth Shift', 'Ca đã hoàn thành.', 'Completed shift.', [['07:30', '11:30', 6, 3]], ['communication']),
    O('p2', 'h3', 'donation', -14, 'Phát nước và suất ăn nhẹ', 'Water & Light Meal Distribution', 'Ca đã hoàn thành.', 'Completed shift.', [['08:00', '11:00', 5, 2]], ['logistics']),
    O('p3', 'h2', 'guidance', -8, 'Hướng dẫn lối đi khu tiếp đón', 'Reception Wayfinding', 'Ca đã hoàn thành.', 'Completed shift.', [['07:00', '11:00', 6, 3]], ['communication']),
    O('p4', 'h7', 'event', -2, 'Hoạt động cộng đồng cuối tuần', 'Weekend Community Activity', 'Ca đã hoàn thành, đang chờ duyệt giờ.', 'Completed shift, awaiting hour verification.', [['09:00', '12:00', 10, 5]], ['event']),
  ];

  const U = (id, name, email, org, extra = {}) => Object.assign({
    id, name, email, phone: '0900 000 ' + String(100 + parseInt(id.slice(1), 10)), org, skills: ['communication'], prefs: [], noPref: true,
    days: ['sat', 'sun'], slots: ['morning'], exp: 'none', createdSample: true,
  }, extra);
  const users = [
    U('v1', 'Nguyễn Minh Anh', 'minhanh.demo@example.com', 'Trường đại học (mẫu)', { skills: ['communication', 'organisation', 'languages'], prefs: ['h1', 'h3', 'h2'], noPref: false, days: ['tue', 'sat', 'sun'], slots: ['morning'], exp: 'some' }),
    U('v2', 'Trần Quốc Bảo', 'bao.demo@example.com', 'Trường đại học (mẫu)'),
    U('v3', 'Lê Thị Hoa', 'hoa.demo@example.com', 'Trường đại học (mẫu)'),
    U('v4', 'Phạm Gia Huy', 'huy.demo@example.com', 'Câu lạc bộ cộng đồng (mẫu)'),
    U('v5', 'Võ Ngọc Lan', 'lan.demo@example.com', 'Trường đại học (mẫu)'),
    U('v6', 'Đặng Minh Khoa', 'khoa.demo@example.com', 'Trường đại học (mẫu)'),
    U('v7', 'Hoàng Thảo Vy', 'vy.demo@example.com', 'Cộng đồng (mẫu)'),
  ];

  const R = (id, vid, oid, si, status, x = {}) => Object.assign({
    id, vid, oid, sid: oid + '-s' + si, status, att: 'none', inAt: null, outAt: null, hours: 0, hstat: 'none', outcome: '', cancelReq: null, reqNote: '', checks: [], created: Date.now() - 86400000 * 3,
  }, x);
  const done = (hrs, note, off) => ({ att: 'out', hours: hrs, hstat: 'verified', outcome: note, inAt: Date.now() + off * 86400000, outAt: Date.now() + off * 86400000 + hrs * 3600000, checks: [0, 1, 2] });
  const regs = [
    R('r1', 'v1', 'p1', 0, 'completed', done(4, 'Hỗ trợ gian hàng: đón tiếp và hướng dẫn / Booth support: welcome and guidance', -21)),
    R('r2', 'v1', 'p2', 0, 'completed', done(3, 'Phát nước và suất ăn nhẹ / Water and snack distribution', -14)),
    R('r3', 'v1', 'p3', 0, 'completed', done(4, 'Hướng dẫn lối đi khu tiếp đón / Reception wayfinding', -8)),
    R('r4', 'v1', 'p4', 0, 'completed', { att: 'out', hours: 3, hstat: 'pending', inAt: Date.now() - 2 * 86400000, outAt: Date.now() - 2 * 86400000 + 3 * 3600000, checks: [0, 1] }),
    R('r5', 'v1', 'o1', 0, 'confirmed'),
    R('r6', 'v1', 'o3', 1, 'pending'),
    R('r7', 'v1', 'o12', 0, 'waitlisted'),
    R('r8', 'v1', 'o9', 0, 'cancelled', { reqNote: 'Trùng lịch học / Class clash' }),
    R('r9', 'v2', 'o1', 0, 'confirmed'),
    R('r10', 'v3', 'o1', 0, 'confirmed', { cancelReq: 'cancel', reqNote: 'Em bị ốm / I am unwell' }),
    R('r11', 'v4', 'o1', 1, 'pending'),
    R('r12', 'v5', 'o2', 0, 'pending'),
    R('r13', 'v6', 'o3', 0, 'confirmed'),
    R('r14', 'v7', 'o4', 0, 'pending'),
    R('r15', 'v2', 'p4', 0, 'completed', { att: 'out', hours: 3, hstat: 'pending', inAt: Date.now() - 2 * 86400000, outAt: Date.now() - 2 * 86400000 + 3 * 3600000 }),
    R('r16', 'v3', 'p4', 0, 'completed', { att: 'out', hours: 3, hstat: 'pending', inAt: Date.now() - 2 * 86400000, outAt: Date.now() - 2 * 86400000 + 3 * 3600000 }),
    R('r17', 'v2', 'p3', 0, 'completed', done(4, '', -8)),
    R('r18', 'v4', 'o12', 0, 'confirmed'),
    R('r19', 'v5', 'o12', 0, 'confirmed'),
    R('r20', 'v6', 'o12', 0, 'confirmed'),
  ];
  // v4..v6 confirmed on o12 fill the sample full shift; base set to 0 for it so waitlist logic stays consistent
  opps.find(o => o.id === 'o12').shifts[0].base = 0;

  const H = n => Date.now() - n * 3600000;
  const notifs = [
    { id: 'n1', to: 'v1', title: { vi: 'Nhắc lịch ca sắp tới', en: 'Upcoming shift reminder' }, msg: { vi: 'Bạn có ca “Trực gian hàng hỗ trợ CareLink” sắp diễn ra. Hãy đến điểm hẹn trước 15 phút.', en: 'You have an upcoming “CareLink Support Booth Shift”. Please arrive 15 minutes early.' }, at: H(3), read: false },
    { id: 'n2', to: 'all', title: { vi: 'Buổi định hướng an toàn tình nguyện viên', en: 'Volunteer safety orientation' }, msg: { vi: 'Buổi định hướng ngắn (30 phút) trước ca đầu tiên – xem lại quy tắc phi y tế và cách báo cáo sự cố.', en: 'A short 30-minute orientation before your first shift – review the non-medical rules and how to report incidents.' }, at: H(30), read: false },
    { id: 'n3', to: 'v1', title: { vi: 'Giờ tình nguyện đã được duyệt', en: 'Volunteer hours verified' }, msg: { vi: 'Điều phối viên đã duyệt 4 giờ cho ca “Hướng dẫn lối đi khu tiếp đón”.', en: 'The coordinator verified 4 hours for “Reception Wayfinding”.' }, at: H(24 * 7), read: true },
  ];
  const incidents = [
    { id: 'i1', vid: 'v2', oid: 'p3', type: 'feedback', text: 'Gian hàng cần thêm bản đồ giấy. / The booth needs more paper maps.', at: H(24 * 8), resolved: true },
    { id: 'i2', vid: 'v3', oid: 'p4', type: 'incident', text: 'Một nhóm đông gây chen lấn ở sảnh; đã báo bảo vệ bệnh viện. / A large group caused crowding in the lobby; reported to hospital security.', at: H(24 * 2), resolved: false },
  ];
  const hospStatus = {}; HOSPITALS.forEach(h => { hospStatus[h.id] = 'unconfirmed'; });
  return { v: 2, seedDay: _off(0), lang: 'vi', meId: null, role: null, users, opps, regs, notifs, incidents, hospStatus, sent: [], seq: 100, notifOn: true };
}

