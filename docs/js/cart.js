// docs/js/cart.js
'use strict';

// ---------- helpers ----------
function loadCart() {
  const raw = localStorage.getItem('cart');
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateBadge() {
  const countEl = document.getElementById('cart-count');
  if (!countEl) return; // page may not have the badge
  const cart = loadCart();
  countEl.textContent = String(cart.reduce((sum, item) => sum + item.qty, 0));
}

function addToCart(item) {
  const cart = loadCart();
  const existing = cart.find(p => p.sku === item.sku);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
  updateBadge();
  console.log('Added to cart:', item);
}

// ---------- wire up buttons ----------
document.addEventListener('DOMContentLoaded', () => {
  updateBadge(); // show count on page load

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-add');
    if (!btn) return;

    const sku = btn.dataset.sku;
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price); // ISK as number of krónur
    const img = btn.dataset.img;

    if (!sku || !name || Number.isNaN(price)) {
      console.warn('Missing data-* on Add button');
      return;
    }

    addToCart({ sku, name, price, img });
  });
});
