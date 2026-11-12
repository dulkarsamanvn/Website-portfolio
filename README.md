# Dulkar Saman — Portfolio

A monochrome React + Vite portfolio with a centered portrait and a scroll-controlled technology display.

```sh
npm install
npm run dev
```

Use `npm run build` for the production bundle and `npm run preview` to serve it locally.

## Scroll experience

- `src/components/Hero.jsx` keeps the portrait horizontally centered on desktop and mobile, with subtle scroll parallax.
- `src/components/TechStack.jsx` shows twelve named technology logos in three rows of four, including React Native and a combined Django / DRF tile. Its CSS 3D perspective follows scroll position, matching web/mobile, backend, and data/cloud tiles highlight alongside the skills list, and individual tiles lift slightly on hover.
- The detailed skills list covers frontend, mobile, backend, AI/LLMs, APIs and real-time communication, authentication, databases, deployment and containers, PWAs, languages, tools/version control, and algorithms. The additions are drawn from the supplied resume, including its project and experience descriptions.
- All technology logos are local SVGs in `public/tech`. Upstream attribution and the license are included in that directory.
- The speaker icon in the top navigation enables a soft mechanical key click on technology-tile hover, or on a touch-screen tap. Sound starts muted, unlocks through the toggle's user gesture, and can be muted immediately from any section. The Web Audio API synthesizes the click locally; no audio files or libraries are downloaded.
- The Selected Works section features Syntax, CacheScope, Tether CMS, Pictura, Luxe Tickers, and HubSpot Integration, plus smaller links to Leave Approval System and Feedback Analyzer. Descriptions and links are grounded in the public repositories.
- Each project has a custom, explicitly labeled illustrated preview built in HTML/CSS/SVG. The previews are visual studies, not captured application screenshots. Project cards and their layered previews change perspective with scrolling and lift slightly on hover or keyboard focus. Reduced motion keeps them static.
- CacheScope links to its PyPI package. The previous Syntax demo URL returned 404 during verification, so the card links to its repository. Add live demo URLs in `src/data/projects.js` when working deployments are available.
- The Contact code symbol assembles on entry.
- Work Experience follows the projects, with three résumé-based roles, contribution summaries, a scroll-progress timeline, and a résumé download. Education lists both qualifications from the supplied PDF.
- Contact links use the résumé's email, WhatsApp number, GitHub, and LinkedIn details. The WhatsApp button uses [Click to Chat](https://faq.whatsapp.com/5913398998672934) with the international number and a URL-encoded greeting. It opens the chat for the visitor to review and send the message. Edit the number and greeting in `src/data/profile.js`.
- The original two-page PDF is served from `public/Dulkar_Saman_Resume.pdf` and is available from Experience and Contact.
- Motion follows native scrolling, including touch, keyboard, and anchor navigation. It does not track the mouse or intercept wheel input.

The technology display uses CSS 3D transforms and Motion, with no WebGL, model downloads, or GPU canvas. Reduced motion keeps the technology display static and disables project tilt and portrait parallax.

## Content

Edit skills in `src/components/About.jsx`, project content in `src/data/projects.js`, the project illustrations in `src/components/ProjectVisual.jsx`, career and education content in `src/data/background.js`, and contact/resume details in `src/data/profile.js`.
