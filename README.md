# Lynxpaq Technologies website

Static marketing site for Lynx HMS Web. No build step.

## Files
- index.html — the whole site (HTML, CSS, JS)
- assets/logo-mark.png — lion logo mark (cropped from the flier)
- assets/favicon.png — browser tab icon
- .nojekyll — GitHub Pages setting (serve files as-is)
- assets/screens/*.webp — product screenshots from the demo property (hotel name shown as "Lynx Demo Hotel")

## Before going live
Edit the CONFIG block near the bottom of index.html:
- formspree: your Formspree form endpoint, e.g. https://formspree.io/f/xyzabcde
  Every demo request is emailed to the address on your Formspree account
  and kept in the Formspree dashboard (Submissions tab).
- whatsapp: number for the WhatsApp chat buttons (international format, no +)

Pricing figures are in the #pricing section (data-m = monthly, data-y = yearly).

## Hosting (GitHub Pages)
Live at https://lynxpaq.github.io/lynxpaq-website/
Every push to master redeploys the site automatically.

When lynxpaq.com is registered: add a file named CNAME containing
www.lynxpaq.com, push it, set the DNS records, then tick Enforce HTTPS
under Settings > Pages.
