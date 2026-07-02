const Wishlist = {
  STORAGE_KEY: 'mistressa_wishlist',

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
    this.updateUI();
  },

  has(id) {
    return this.get().some(item => item.id === id);
  },

  toggle(product) {
    const items = this.get();
    const existing = items.findIndex(item => item.id === product.id);
    if (existing > -1) {
      items.splice(existing, 1);
      Cart.showToast(`${product.name} removed from wishlist`);
    } else {
      items.push({ id: product.id, name: product.name, image: product.image, price: product.price, notes: product.notes });
      Cart.showToast(`<span style="color: #e74c3c;">♥</span> ${product.name} saved to wishlist`);
    }
    this.save(items);
  },

  updateUI() {
    const wishlist = this.get();
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const id = btn.dataset.id;
      if (wishlist.some(item => item.id === id)) {
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Remove from wishlist');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-label', 'Add to wishlist');
      }
    });
  },

  init() {
    this.updateUI();
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const image = btn.dataset.image;
        const price = parseFloat(btn.dataset.price);
        const notes = btn.dataset.notes;
        this.toggle({ id, name, image, price, notes });
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => Wishlist.init());
