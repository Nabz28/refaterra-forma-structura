# Refaterra Forma Structura

Production marketing site for **PT. Refaterra Forma Structura** — premium 60-ton wide-body dump truck rental for Indonesian mining and construction operations.

Tujuh belas armada wide-body siap operasi di Balikpapan dan Palembang. Tarif per jam, mobilisasi tujuh hari kerja, dispatcher di Jakarta yang selalu angkat telepon.

## Tech

Vanilla HTML + CSS + JS. No framework, no build step, no bundler. Hosted on Vercel as static files.

- **Display type:** Clash Display (Fontshare)
- **Body type:** Switzer / Geist (Fontshare + Google Fonts)
- **Mono type:** Geist Mono
- **Motion:** IntersectionObserver-based reveals, native CSS transitions, no GSAP (kept the bundle tiny)
- **Mobile:** Tailored mobile-first treatment below 900px (hamburger drawer, sticky action bar, horizontal-scroll spec carousel, redesigned section composition)
- **Accessibility:** WCAG AA focus rings, ARIA tabs, reduced-motion honored

## Local dev

```bash
# any static server works; example with Python
python -m http.server 8765
# then open http://127.0.0.1:8765
```

## Deploy

Configured for Vercel zero-config deployment. `vercel.json` sets long-lived caching for `/img/*` assets, short cache for CSS/JS, and adds basic security headers.

## Contact

Refaterra Forma Structura
Alamanda Tower L2/H1, Jl. TB Simatupang Kav 23-24, Cilandak, Jakarta Selatan 12430
+62 812 7768 4939 · partnership@refaterra.id
