# Lynxpaq Technologies website

Static marketing site for Lynxpaq's two products. No build step needed to deploy.

## Pages
- index.html      — Lynx HMS (single and multi-property). The default page.
- ecommerce.html  — Lynx E-commerce.
Visitors switch between them with the "Products" button in the header
(on phones, the two products are at the top of the menu).

## Shared files
- assets/site.css — styles for both pages
- assets/site.js  — menus, screenshots, video and the demo forms for both pages
- assets/logo-mark.png, assets/favicon.png — logo and browser tab icon
- assets/screens/*.webp — Lynx HMS screenshots (demo property shown as "Lynx Demo Hotel")
- assets/video/ — Lynx HMS product tour video and its poster image
- .nojekyll — GitHub Pages setting (serve files as-is)

## Settings
Edit the CONFIG block at the top of assets/site.js:
- formspree: Formspree endpoint that receives demo requests from BOTH pages.
  Each email's subject starts with the product name, e.g.
  "Lynx HMS demo request: …" or "Lynx E-commerce demo request: …".
- whatsapp: number for the WhatsApp chat buttons (international format, no +)

HMS pricing figures are in the #pricing section of index.html
(data-m = monthly, data-y = yearly).

## Hosting (GitHub Pages)
Live at https://lynxpaq.github.io/lynxpaq-website/
E-commerce page: https://lynxpaq.github.io/lynxpaq-website/ecommerce.html
Every push to master redeploys the site automatically.

When lynxpaq.com is registered: add a file named CNAME containing
www.lynxpaq.com, push it, set the DNS records, then tick Enforce HTTPS
under Settings > Pages.
