/* MindPill store — cart + Brevo tracking helpers
   Brevo custom events: https://developers.brevo.com/docs/track-custom-events-js
   Brevo.push(["track", event_name, properties, event_data]) */

const CART_KEY = "mindpill_cart";
const EMAIL_KEY = "mindpill_email";

const PRODUCTS = {
  "tee-think":   { name: "\"I Think Therefore I Am (Updated)\" Tee", price: 29, emoji: "🧠" },
  "tee-pill":    { name: "Big Pill Energy Tee",                       price: 29, emoji: "💊" },
  "tee-opus":    { name: "Powered by Opus Tee",                       price: 32, emoji: "⚡" },
  "tee-dream":   { name: "Debugging In My Sleep Tee",                 price: 29, emoji: "🌙" },
  "tee-95":      { name: "Fluent in 95 Languages Tee",               price: 32, emoji: "🗣️" },
  "tee-recall":  { name: "Total Recall Tee",                          price: 29, emoji: "📚" }
};

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch (e) { return {}; }
}
function saveCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
}
function cartCount(cart) {
  cart = cart || getCart();
  return Object.values(cart).reduce((n, q) => n + q, 0);
}
function cartTotal(cart) {
  cart = cart || getCart();
  return Object.entries(cart).reduce((t, [id, q]) => t + (PRODUCTS[id] ? PRODUCTS[id].price * q : 0), 0);
}
function getEmail() { try { return localStorage.getItem(EMAIL_KEY) || ""; } catch (e) { return ""; } }
function setEmail(v) { try { localStorage.setItem(EMAIL_KEY, v); } catch (e) {} }

/* Build the event_data.data.items array Brevo expects */
function cartItems(cart) {
  cart = cart || getCart();
  return Object.entries(cart).map(([id, q]) => ({
    name: PRODUCTS[id] ? PRODUCTS[id].name : id,
    price: PRODUCTS[id] ? PRODUCTS[id].price : 0,
    quantity: q
  }));
}

/* Fire Brevo "cart_updated" */
function trackCartUpdated() {
  const cart = getCart();
  const email = getEmail();
  const properties = email ? { email: email } : {};
  window.Brevo = window.Brevo || [];
  Brevo.push([
    "track",
    "cart_updated",
    properties,
    {
      id: "cart:mindpill",
      data: {
        total: cartTotal(cart),
        currency: "USD",
        item_count: cartCount(cart),
        items: cartItems(cart)
      }
    }
  ]);
}

/* Fire Brevo "order_created" */
function trackOrderCreated(orderId, email, shippingTotal) {
  const cart = getCart();
  window.Brevo = window.Brevo || [];
  Brevo.push([
    "track",
    "order_created",
    email ? { email: email } : {},
    {
      id: "order:" + orderId,
      data: {
        total: cartTotal(cart) + (shippingTotal || 0),
        currency: "USD",
        item_count: cartCount(cart),
        items: cartItems(cart)
      }
    }
  ]);
}

function addToCart(id) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  trackCartUpdated();
  updateCartBadges();
}
function setQty(id, qty) {
  const cart = getCart();
  if (qty <= 0) { delete cart[id]; } else { cart[id] = qty; }
  saveCart(cart);
  trackCartUpdated();
  updateCartBadges();
}

function updateCartBadges() {
  const n = cartCount();
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = n;
    el.style.display = n > 0 ? "inline-flex" : "none";
  });
}

function showToast(msg) {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2200);
}

document.addEventListener("DOMContentLoaded", updateCartBadges);
