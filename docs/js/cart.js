// docs/js/cart.js
'use strict';

/* -------------------------------------------------------
   STORAGE HELPERS
------------------------------------------------------- */
function loadCart() {
  const raw = localStorage.getItem('cart');
  return raw ? JSON.parse(raw) : [];
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/* -------------------------------------------------------
   BADGE (navbar)
------------------------------------------------------- */
function updateBadge() {
  const el = document.getElementById('cart-count');
  if (!el) return;
  const count = loadCart().reduce((sum, it) => sum + (it.qty || 0), 0);
  el.textContent = String(count);
}

/* -------------------------------------------------------
   MUTATIONS
------------------------------------------------------- */
function addToCart(item) {
  const cart = loadCart();
  const key = item.sku || item.name; // fallback if sku not provided
  let found = cart.find(p => (p.sku || p.name) === key);
  if (found) {
    found.qty = (found.qty || 0) + 1;
  } else {
    cart.push({
      sku: item.sku || item.name,
      name: item.name,
      price: Number(item.price) || 0,
      img: item.img || '',
      qty: 1
    });
  }
  saveCart(cart);
  updateBadge();
  renderCartPage(); // if we are on the cart page, re-render
  console.log('Added to cart:', item);
}

function incItem(sku) {
  const cart = loadCart().map(it => {
    if ((it.sku || it.name) === sku) it.qty += 1;
    return it;
  });
  saveCart(cart); updateBadge(); renderCartPage();
}
function decItem(sku) {
  let cart = loadCart().map(it => {
    if ((it.sku || it.name) === sku) it.qty = Math.max(0, it.qty - 1);
    return it;
  }).filter(it => it.qty > 0);
  saveCart(cart); updateBadge(); renderCartPage();
}
function removeItem(sku) {
  const cart = loadCart().filter(it => (it.sku || it.name) !== sku);
  saveCart(cart); updateBadge(); renderCartPage();
}
function clearCart() {
  saveCart([]); updateBadge(); renderCartPage();
}

/* -------------------------------------------------------
   MONEY & TOTALS
------------------------------------------------------- */
function fmtISK(n) {
  // e.g. 19990 -> "ISK 19,990"
  return 'ISK ' + Number(n).toLocaleString('en-US');
}
function subtotal(cart) {
  return cart.reduce((sum, it) => sum + it.price * it.qty, 0);
}

/* -------------------------------------------------------
   RENDER CART PAGE (list + totals)
------------------------------------------------------- */
function renderCartPage() {
  const list = document.getElementById('cart-list');
  const itemsCount = document.getElementById('cart-items-count');
  const totalEl = document.getElementById('cart-total');

  if (!list || !itemsCount || !totalEl) return; // Not on cart page

  const cart = loadCart();
  itemsCount.textContent = String(cart.reduce((s, it) => s + it.qty, 0));
  totalEl.textContent = fmtISK(subtotal(cart));

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="text-white/85 text-center py-10">
        Your cart is empty.
      </div>`;
    return;
  }

  list.innerHTML = cart.map(it => {
    const sku = it.sku || it.name;
    return `
      <div class="grid grid-cols-12 gap-4 md:gap-6 p-4 md:p-6 rounded-2xl
                  bg-white/10 border border-white/25 ring-1 ring-white/20
                  hover:bg-white/12 transition">
        <!-- image -->
        <div class="col-span-12 md:col-span-2">
          <img src="${it.img || './images/placeholder.png'}"
               alt="${it.name}"
               class="w-full md:w-[180px] h-[180px] object-cover rounded-xl bg-white/70" />
        </div>

        <!-- details -->
        <div class="col-span-12 md:col-span-10">
          <div class="flex items-start justify-between gap-3 mb-3">
            <h3 class="text-white font-semibold text-xl md:text-2xl">${it.name}</h3>
            <button class="js-remove rounded-full group p-1.5"
                    aria-label="Remove item" data-sku="${sku}">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <circle class="fill-red-50/80 group-hover:fill-red-500 transition"
                        cx="17" cy="17" r="17"></circle>
                <path class="stroke-red-600 group-hover:stroke-white transition"
                      d="M14.2 13.6V12.6c0-.7.6-1.3 1.3-1.3h3.2c.7 0 1.3.6 1.3 1.3v1M12.5 13.6h9v5.3c0 1.8 0 2.7-.6 3.3-.6.6-1.5.6-3.3.6h-1.5c-1.8 0-2.7 0-3.3-.6-.6-.6-.6-1.5-.6-3.3v-5.3Z"
                      stroke-width="1.6" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="flex items-center justify-between">
            <!-- qty controls -->
            <div class="flex items-center gap-3">
              <button class="js-dec rounded-full border border-white/30 bg-white/80 hover:bg-white px-3 py-2"
                      data-sku="${sku}" aria-label="Decrease">
                <svg width="18" height="19" viewBox="0 0 18 19" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 9.5H13.5" class="stroke-slate-900" stroke-width="1.6" stroke-linecap="round" />
                </svg>
              </button>

              <span class="inline-flex items-center justify-center w-10 h-10 rounded-full
                           bg-white/80 text-slate-900 font-semibold">${it.qty}</span>

              <button class="js-inc rounded-full border border-white/30 bg-white/80 hover:bg-white px-3 py-2"
                      data-sku="${sku}" aria-label="Increase">
                <svg width="18" height="19" viewBox="0 0 18 19" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.75 9.5H14.25M9 14.75V4.25" class="stroke-slate-900" stroke-width="1.6"
                        stroke-linecap="round" />
                </svg>
              </button>
            </div>

            <!-- price -->
            <div class="text-white font-bold text-xl md:text-2xl">${fmtISK(it.price)}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* -------------------------------------------------------
   EVENT WIRING (global)
------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  updateBadge();
  renderCartPage();

  // Global "Add" buttons (on store page)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-add');
    if (!btn) return;

    const sku = btn.dataset.sku || btn.dataset.name; // allow missing sku
    const item = {
      sku,
      name: btn.dataset.name || sku,
      price: Number(btn.dataset.price) || 0,
      img: btn.dataset.img || ''
    };
    addToCart(item);
  });

  // Cart page controls
  document.addEventListener('click', (e) => {
    const inc = e.target.closest('.js-inc');
    const dec = e.target.closest('.js-dec');
    const remove = e.target.closest('.js-remove');
    if (inc) incItem(inc.dataset.sku);
    if (dec) decItem(dec.dataset.sku);
    if (remove) removeItem(remove.dataset.sku);
  });

  const clearBtn = document.getElementById('btn-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => clearCart());
  }
});
