# Victoria Benjamin — Portfolio

A responsive portfolio for Victoria (Yagazie) Benjamin, brand and content strategist and owner of Projenius.

## Run locally

Requires Node.js 18 or newer. No dependency installation or build step is needed.

```sh
npm start
```

Open http://localhost:4173. The preview server binds to the local machine only.

## Structure

- `dist/index.html`: portfolio, selected work, Projenius events and contact information.
- `dist/style.css`: responsive styling with upright Poppins typography.
- `dist/app.js`: case studies, project filtering and contact interactions.
- `dist/motion.js`: GSAP intro, scroll reveals and interaction animations.
- `dist/resume.html`: printable résumé.
- `dist/assets/`: supplied photography, event artwork and downloadable portfolio.
- `dist/vendor/`: GSAP 3.13.0 and ScrollTrigger, retaining their license notices.
- `server.mjs`: local static preview server.

## Hosting

Serve the `dist` directory with a static web host. No build command is required. Google Fonts supplies Poppins; the stylesheet provides a system fallback.

## Motion and accessibility

The site respects `prefers-reduced-motion`, retains native scrolling and supports keyboard navigation and dismissal of case studies with Escape. Content remains available if animation libraries fail to load.

## Content

Case studies are based on the supplied CV, portfolio deck and Projenius materials. Individual post metrics are not presented as campaign totals. Project BLVCK artwork is identified as artwork rather than installation photography.

Personal photographs, artwork and portfolio materials are included for this portfolio; no general reuse license is granted.
