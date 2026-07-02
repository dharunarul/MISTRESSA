document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav-links');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = y;
  }, { passive: true });

  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeEls.forEach(el => observer.observe(el));
  }

  const hero = document.querySelector('.hero');
  if (hero) {
    const bgLayer = hero.querySelector('.layer-bg');
    const noiseLayer = hero.querySelector('.layer-noise');
    const contentLayer = hero.querySelector('.layer-content');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const rect = hero.getBoundingClientRect();
      const heroH = hero.offsetHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / heroH));

      if (bgLayer) {
        bgLayer.style.transform = `translateY(${scrollY * 0.2}px) scale(1.1)`;
      }

      if (noiseLayer) {
        noiseLayer.style.transform = `translateY(${scrollY * 0.1}px)`;
      }

      if (contentLayer) {
        const tilt = progress * 8;
        const lift = scrollY * 0.04;
        contentLayer.style.transform = `translateY(${lift}px) perspective(800px) rotateX(${tilt}deg)`;
      }
    }, { passive: true });
  }

  const qtyDown = document.querySelector('.qty-down');
  const qtyUp = document.querySelector('.qty-up');
  const qtyInput = document.querySelector('#qty-input');

  if (qtyDown && qtyInput) {
    qtyDown.addEventListener('click', () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });
  }

  if (qtyUp && qtyInput) {
    qtyUp.addEventListener('click', () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      qtyInput.value = val + 1;
    });
  }

  const addToCartBtn = document.querySelector('#add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const id = addToCartBtn.dataset.id;
      const name = addToCartBtn.dataset.name;
      const price = parseFloat(addToCartBtn.dataset.price);
      const notes = addToCartBtn.dataset.notes;
      const image = addToCartBtn.dataset.image;
      const qty = parseInt(document.querySelector('#qty-input')?.value || 1, 10);

      if (!id || !name || !price) return;

      Cart.add({ id, name, price, notes, image, qty });
    });
  }

  /* ---- Product card click routing ---- */
  document.querySelectorAll('.product-card[data-id]').forEach(card => {
    card.addEventListener('click', () => {
      location.href = `product.html?id=${card.dataset.id}`;
    });
  });

  /* ---- Newsletter form ---- */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for subscribing!');
      form.reset();
    });
  });

  /* ---- Contact form ---- */
  document.querySelectorAll('.contact-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your message. We will be in touch soon.');
      form.reset();
    });
  });
});

/* ---- Internal navigation tracking ---- */
document.addEventListener('click', () => {
  sessionStorage.setItem('mistressa_internal', '1');
});

/* ---- Splash screen ---- */
window.addEventListener('load', () => {
  const splash = document.getElementById('splash');
  if (!splash) return;

  if (sessionStorage.getItem('mistressa_internal')) {
    splash.classList.add('hidden');
    sessionStorage.removeItem('mistressa_internal');
    return;
  }

  setTimeout(() => {
    splash.classList.add('hidden');
  }, 2500);
});
