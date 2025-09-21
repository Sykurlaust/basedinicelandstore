# BASEDINICELAND 

**Pages:** index, team, store, contact, login, signup  
**Live demo:** (paste your GitHub Pages URL here)

## Description
Floating glass navbar + glass cards over a glacier background. Store uses image hover swap; Team has glass profile cards. Login/Signup reuse the same glass card style for consistency.

## UI Framework: Tailwind CSS
- **Used for:** glass effects (`bg-white/10`, `backdrop-blur-2xl`), rounded pills, responsive grids, hover states.
- **Easier:** fast styling, consistent spacing, no custom CSS files.
- **Harder:** long class lists, need a build step (unless you submit only the built `output.css`).

## Dev (optional)
```bash
npm install
npm run build   # outputs docs/output.css
