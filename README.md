# CareLink – Connecting Hearts, Sharing Care

**EN** · Volunteer-first prototype for discovering, registering for and coordinating **non-medical** support activities at public hospitals in Ho Chi Minh City. Two roles only: **Volunteer** and a restricted **Coordinator/Admin**. No patient accounts or patient-facing screens: patients and families are served offline at the CareLink booth.

**VI** · Bản mẫu nền tảng kết nối tình nguyện viên với các hoạt động hỗ trợ **phi y tế** tại bệnh viện công ở TP.HCM. Chỉ có hai vai trò: **Tình nguyện viên** và **Điều phối viên** (truy cập hạn chế). Không có tài khoản hay màn hình dành cho bệnh nhân.

> ⚠️ **Prototype / Bản mẫu.** All data is simulated and kept in the browser (`localStorage`). No live hospital integration, real-time capacity, real QR scanning or AI matching. The 10 hospitals are a *sample catalogue*; each shows “Partnership not yet confirmed” until a coordinator changes it. Update official addresses and meeting points with each hospital before real use.

## Features
- Bilingual UI (Tiếng Việt / English), toggle on every screen
- Welcome, sign-up/log-in, volunteer profile with searchable **multi-select hospital preferences** (+ “No preference”)
- Home with rule-based recommendations, Explore with search & filters, Opportunity details, Shift registration (Pending / Waitlisted), My Schedule (cancel / change requests go to coordinator), simulated QR check-in/out (hours stay *Pending verification*), My Impact (verified hours, badges, demo certificate), Profile
- Coordinator dashboard: create/edit/publish/close opportunities, approve/decline registrations, assign volunteers, waitlist, cancellation requests, attendance & hour verification, incident/feedback log, partnership status, announcements, CSV export

## Run locally
No build step and no dependencies. Open `index.html` in a browser, or serve the folder with any static server:
```bash
python -m http.server 8000
```
**Demo access:** “Use sample account” on the login page (volunteer) · coordinator code `CARELINK-DEMO`.

## Publish on GitHub Pages
1. Create a new public repository (e.g. `carelink`) on github.com.
2. Upload every file in this folder (including the hidden `.github` and `.nojekyll`) – or `git init && git add . && git commit -m "CareLink prototype" && git branch -M main && git remote add origin <repo-url> && git push -u origin main`.
3. In **Settings → Pages**, set **Source = GitHub Actions** (the included workflow `.github/workflows/pages.yml` deploys on every push to `main`). Alternatively choose “Deploy from a branch → main / root”.
4. Your site will be at `https://<username>.github.io/carelink/`.

## Structure
```
index.html          app shell
css/styles.css      design tokens + components
js/i18n.js          VI/EN dictionary
js/data.js          hospitals, categories, demo seed data
js/store.js         state, persistence, business rules
js/ui.js            reusable components
js/screens.js       volunteer screens
js/coord.js         coordinator screens
js/app.js           router + actions
assets/logo.png     CareLink logo
```

## Safeguards
Volunteers never diagnose, give medical advice, interpret results, recommend treatment or perform clinical procedures. Collect minimum personal data; restrict coordinator access; confirm hospital permissions in writing before publishing real activities.

MIT License.
