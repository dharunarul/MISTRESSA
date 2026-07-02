const Cart = {
  STORAGE_KEY: 'mistressa_cart',

  get() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  save(items) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.updateCount();
  },

  add(product) {
    const items = this.get();
    const existing = items.find(item => item.id === product.id);
    if (existing) {
      existing.qty += product.qty || 1;
    } else {
      items.push({ ...product, qty: product.qty || 1 });
    }
    this.save(items);
    this.showToast(`${product.name} added to cart`);
  },

  remove(productId) {
    let items = this.get();
    items = items.filter(item => item.id !== productId);
    this.save(items);
    this.renderCart();
  },

  updateQty(productId, qty) {
    const items = this.get();
    const item = items.find(item => item.id === productId);
    if (item) {
      item.qty = Math.max(1, qty);
    }
    this.save(items);
    this.renderCart();
  },

  getTotal() {
    const items = this.get();
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  },

  getCount() {
    const items = this.get();
    return items.reduce((sum, item) => sum + item.qty, 0);
  },

  updateCount() {
    const count = this.getCount();
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `&#10003; <span class="toast-gold">${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toast._hide);
    toast._hide = setTimeout(() => toast.classList.remove('show'), 2500);
  },

  renderCart() {
    const container = document.querySelector('.cart-items');
    const summary = document.querySelector('.cart-summary');
    const empty = document.querySelector('.cart-empty');

    if (!container) return;

    const items = this.get();

    if (items.length === 0) {
      container.innerHTML = '';
      if (empty) empty.style.display = 'block';
      if (summary) summary.style.display = 'none';
      this.updateCount();
      return;
    }

    if (empty) empty.style.display = 'none';
    if (summary) summary.style.display = 'block';

    container.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="item-info">
          <h3>${item.name}</h3>
          <div class="item-notes">${item.notes}</div>
        </div>
        <div class="item-price">$${item.price.toFixed(2)}</div>
        <div class="quantity-selector">
          <button class="qty-down">−</button>
          <input type="number" value="${item.qty}" min="1" readonly>
          <button class="qty-up">+</button>
        </div>
        <div class="item-subtotal">$${(item.price * item.qty).toFixed(2)}</div>
        <button class="remove-btn" data-id="${item.id}">&times;</button>
      </div>
    `).join('');

    const totalEl = summary ? summary.querySelector('.total-amount') : null;
    if (totalEl) {
      totalEl.textContent = `$${this.getTotal().toFixed(2)}`;
    }

    this.attachCartEvents();
    this.updateCount();
  },

  attachCartEvents() {
    document.querySelectorAll('.qty-down').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = e.target.closest('.cart-item');
        const id = item.dataset.id;
        const input = item.querySelector('input');
        const val = parseInt(input.value, 10) - 1;
        if (val >= 1) this.updateQty(id, val);
      });
    });

    document.querySelectorAll('.qty-up').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = e.target.closest('.cart-item');
        const id = item.dataset.id;
        const input = item.querySelector('input');
        const val = parseInt(input.value, 10) + 1;
        this.updateQty(id, val);
      });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        this.remove(id);
      });
    });
  },

  init() {
    this.updateCount();
    if (document.querySelector('.cart-items')) {
      this.renderCart();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => Cart.init());
