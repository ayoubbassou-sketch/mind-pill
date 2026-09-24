# 💊 MindPill

A playful concept storefront for **MindPill** — the fictional magic pill that installs Claude in your mind.

Static multi-page site (HTML + CSS + vanilla JS, no build step), hosted on **GitHub Pages**, with the **Brevo web tracker** wired up for page views and custom events.

## Live site

`https://ayoubbassou-sketch.github.io/mind-pill/`

## Pages

| Page | File | What it does |
|------|------|--------------|
| Landing | [`index.html`](index.html) | Hero, features, how-it-works, FAQ |
| Waitlist | [`waitlist.html`](waitlist.html) | Sign-up form |
| Store | [`store.html`](store.html) | T-shirt catalog, add to cart |
| Checkout | [`checkout.html`](checkout.html) | Cart, contact/shipping, demo payment |

Shared styles live in [`styles.css`](styles.css); cart + tracking logic in [`app.js`](app.js).

## Brevo tracking

Tracker installed on every page (client key initialized via `Brevo.push(["init", ...])`).
Custom events fire via `Brevo.push(["track", event_name, properties, event_data])`
([docs](https://developers.brevo.com/docs/track-custom-events-js)):

| Event | Fires when |
|-------|-----------|
| `page` (automatic) | Any page load |
| `waitlist_clicked` | A "waitlist" CTA is clicked on the landing page |
| `waitlist_joined` | The waitlist form is submitted (with email + name properties) |
| `cart_updated` | An item is added or its quantity changes |
| `order_created` | The demo "Pay" button completes an order |

## Local preview

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Disclaimer

MindPill is a fictional product built as a demo. It is not affiliated with Anthropic.
The store and checkout are a demonstration: **no real payment is processed and no card data is stored or transmitted.**
