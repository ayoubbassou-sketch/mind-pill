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

### Contact identification & attributes

On waitlist submit and checkout, the site calls `Brevo.identify()`
([docs](https://developers.brevo.com/docs/identify-users-js)) to bind the visitor's cookie
to a real contact and set these attributes:

| Attribute | Type | Set on | Example |
|-----------|------|--------|---------|
| `FIRSTNAME` / `LASTNAME` | Text | both | (default Brevo attrs) |
| `PLAN` | Text | both | `waitlist` / `customer` |
| `SOURCE` | Text | both | `waitlist_page` / `checkout` |
| `LAST_ORDER_ID` | Text | checkout | `MP-MUFBFHVI` |
| `LAST_ORDER_TOTAL` | Number | checkout | `63` |
| `LAST_ORDER_DATE` | Date | checkout | `2026-09-24` |
| `FAV_PRODUCT` | Text | checkout | `Big Pill Energy Tee` |

> The custom attributes (everything except FIRSTNAME/LASTNAME) must be **created in Brevo first** —
> Brevo silently ignores attributes that don't exist in the account.

## Google Tag Manager

GTM container **`GTM-P4Z6LJK8`** is installed on every page (head + `<noscript>`).
Alongside the Brevo events, the site pushes **GA4-style ecommerce events** to `dataLayer`
([GA4 ecommerce schema](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce))
so GTM can forward them to GA4, ads pixels, etc.:

| dataLayer `event` | Fires when |
|-------------------|-----------|
| `view_item` | A product page is viewed |
| `add_to_cart` | Item added (store or checkout +) |
| `remove_from_cart` | Quantity decreased in checkout |
| `begin_checkout` | Checkout page loads with a non-empty cart |
| `purchase` | The demo "Pay" completes (with `transaction_id`, `value`, `shipping`, `items`) |
| `generate_lead` | Waitlist form submitted |

Each ecommerce push is preceded by `dataLayer.push({ ecommerce: null })` to clear the prior object,
per Google's guidance. The GTM container must be **published** (with tags configured) to act on these.

## Local preview

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Disclaimer

MindPill is a fictional product built as a demo. It is not affiliated with Anthropic.
The store and checkout are a demonstration: **no real payment is processed and no card data is stored or transmitted.**
