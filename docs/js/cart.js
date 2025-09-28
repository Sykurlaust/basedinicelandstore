// docs/js/cart.js
'use strict';

/* ---------------- helpers ---------------- */
function loadCart() {
  const raw = localStorage.getItem('cart');
  return raw ? JSON.parse(raw) : [];
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function moneyISK(n) {
  // simple display (keeps your numbers like 19990 → "ISK 19,990")
  return 'ISK ' + Number(n).toLocaleString('en-IS');
}

/* ------- badge (appears in your nav) ------ */
function updateBadge() {
  const el = document.getElementById('cart-count');
  if (!el) return;                       // not every page has the badge
  const totalQty = loadCart().reduce((sum, i) => sum + i.qty, 0);
  el.textContent = String(totalQty);
}

/* ----------- cart page renderer ----------- */
function renderCart() {
  const list = document.getElementById('cart-list');
  if (!list) return;                     // we’re not on cart.html right now

  const cart = loadCart();
  list.innerHTML = '';

  if (cart.length === 0) {
    list.innerHTML = `<p class="py-4 text-white/80">Your cart is empty.</p>`;
  } else {
    for (const item of cart) {
      const row = document.createElement('div');
      row.className = 'py-3 flex items-center justify-between';
      row.innerHTML = `
        <div class="flex items-center gap-3">
          ${item.img ? `<img src="${item.img}" alt="" class="w-12 h-12 object-cover rounded-xl">` : ''}
          <div>
            <div class="font-semibold">${item.name}</div>
            <div class="text-white/70 text-sm">${moneyISK(item.price)}</div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button class="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25"
                  data-action="dec" data-sku="${item.sku}" aria-label="Decrease">−</button>
          <span class="min-w-[2ch] text-center">${item.qty}</span>
          <button class="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25"
                  data-action="inc" data-sku="${item.sku}" aria-label="Increase">+</button>

          <span class="ml-4 font-semibold">${moneyISK(item.price * item.qty)}</span>

          <button class="ml-4 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80"
                  data-action="remove" data-sku="${item.sku}" aria-label="Remove">Remove</button>
        </div>
      `;
      list.appendChild(row);
    }
  }

  // totals
  const itemsCount = document.getElementById('cart-items-count');
  const totalEl    = document.getElementById('cart-total');
  if (itemsCount) itemsCount.textContent = String(cart.reduce((s, i) => s + i.qty, 0));
  if (totalEl)    totalEl.textContent    = moneyISK(cart.reduce((s, i) => s + i.price * i.qty, 0));
}

/* -------- add / mutate cart helpers ------- */
function addToCart({ sku, name, price, img }) {
  // fallback: allow missing sku by deriving from name (prevents “does nothing”)
  if (!sku) sku = (name || 'item').toLowerCase().replace(/\s+/g, '-');

  const cart = loadCart();
  const found = cart.find(p => p.sku === sku);

  if (found) {
    found.qty += 1;
  } else {
    cart.push({ sku, name, price: Number(price), img: img || '', qty: 1 });
  }
  saveCart(cart);
  updateBadge();
  renderCart();
  console.log('Added to cart:', { sku, name, price });
}

function changeQty(sku, delta) {
  const cart = loadCart();
  const i = cart.findIndex(p => p.sku === sku);
  if (i === -1) return;
  cart[i].qty += delta;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  saveCart(cart);
  updateBadge();
  renderCart();
}

function removeItem(sku) {
  const cart = loadCart().filter(p => p.sku !== sku);
  saveCart(cart);
  updateBadge();
  renderCart();
}

/* --------------- wiring ------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // show current count on any page
  updateBadge();

  // if we’re on cart.html, paint it
  renderCart();

  // delegate “Add” clicks from Store cards
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-add');
    if (btn) {
      addToCart({
        sku:   btn.dataset.sku,                // recommended
        name:  btn.dataset.name,
        price: btn.dataset.price,
        img:   btn.dataset.img || ''
      });
      return; // don’t fall through
    }

    // cart page actions (inc/dec/remove)
    const actionBtn = e.target.closest('[data-action]');
    if (actionBtn) {
      const { action, sku } = actionBtn.dataset;
      if (action === 'inc')      changeQty(sku, +1);
      else if (action === 'dec') changeQty(sku, -1);
      else if (action === 'remove') removeItem(sku);
    }
  });

  // Clear button on cart.html
  const clearBtn = document.getElementById('btn-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      saveCart([]);
      updateBadge();
      renderCart();
    });
  }
});
