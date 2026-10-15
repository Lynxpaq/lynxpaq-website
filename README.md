# Lynxpaq Technologies website

Static marketing site for Lynx HMS Web. No build step.

## Files
- index.html — the whole site (HTML, CSS, JS)
- assets/logo-mark.png — lion logo mark (cropped from the flier)
- assets/favicon.png — browser tab icon
- CNAME, .nojekyll — GitHub Pages settings
- assets/screens/*.webp — product screenshots from the demo property (hotel name shown as "Lynx Demo Hotel")

## Before going live
Edit the CONFIG block near the bottom of index.html:
- whatsapp: number for all WhatsApp buttons (international format, no +)
- demoEndpoint: URL that accepts demo requests as JSON POST.
  Leave empty and the form opens WhatsApp with the request pre-filled.

Pricing figures are in the #pricing section (data-m = monthly, data-y = yearly).

## Hosting (GitHub Pages)
- CNAME — tells GitHub Pages to serve the site on www.lynxpaq.com
- .nojekyll — serve files as-is, no Jekyll processing
Every push to master redeploys the site automatically.
