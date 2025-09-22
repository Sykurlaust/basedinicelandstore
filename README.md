
# BASEDINICELAND

**Live:** https://sykurlaust.github.io/basedinicelandstore/

## What it is
A small multi-page site with a **glass/frosted** style on top of a glacier background.

## Pages
Home (`index`), Contact, Store, Team, Login, Signup  
(All files are in **docs/**.)

## Tailwind CSS (how I used it)
- **Glass look:** `bg-white/10` + `backdrop-blur-2xl` + `ring-1` + `border` + `shadow`.
- **Shapes:** `rounded-[999px]` pills (nav), `rounded-3xl` cards, `rounded-full` avatars.
- **Layout:** responsive grids (`md:grid-cols-2`, `lg:grid-cols-4`) and centered containers.
- **Hover:** light hover backgrounds; store cards swap images on hover.

## Why Tailwind helped
- Fast styling in HTML, consistent spacing/colors, easy to reuse the same card style.

## What was harder
- Long class names in HTML.
- If I change `src/input.css`, I must rebuild CSS.




I used Ai to help me with this detailed README.md