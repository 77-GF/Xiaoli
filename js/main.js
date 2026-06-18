/* ========== Shared JS ========== */
(function() {
  'use strict';

  /* ---- Cart (localStorage) ---- */
  window.App = {
    cart: JSON.parse(localStorage.getItem('mi_cart') || '[]'),

    saveCart: function() {
      localStorage.setItem('mi_cart', JSON.stringify(this.cart));
      this.updateCartCount();
    },

    addToCart: function(product, qty) {
      qty = qty || 1;
      var existing = this.cart.find(function(item) { return item.id === product.id && item.spec === product.spec; });
      if (existing) {
        existing.qty += qty;
      } else {
        this.cart.push({ id: product.id, name: product.name, spec: product.spec, price: product.price, img: product.img, qty: qty });
      }
      this.saveCart();
      this.showToast('已添加到购物车');
    },

    removeFromCart: function(index) {
      this.cart.splice(index, 1);
      this.saveCart();
    },

    updateCartQty: function(index, qty) {
      if (qty < 1) return;
      this.cart[index].qty = qty;
      this.saveCart();
    },

    cartTotal: function() {
      return this.cart.reduce(function(sum, item) { return sum + item.price * item.qty; }, 0);
    },

    cartCount: function() {
      return this.cart.reduce(function(sum, item) { return sum + item.qty; }, 0);
    },

    updateCartCount: function() {
      var el = document.getElementById('cartCount');
      if (el) el.textContent = this.cartCount();
    },

    showToast: function(msg) {
      var toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(function() { toast.remove(); }, 2000);
    },

    /* ---- Banner ---- */
    initBanner: function() {
      var slides = document.querySelector('.banner .slides');
      if (!slides) return;
      var dots = document.querySelectorAll('.banner .banner-dots .dot');
      var prev = document.querySelector('.banner .banner-prev');
      var next = document.querySelector('.banner .banner-next');
      var total = slides.children.length;
      var current = 0;
      var timer;

      function goTo(index) {
        current = (index + total) % total;
        slides.style.transform = 'translateX(-' + (current * 100) + '%)';
        dots.forEach(function(d, i) { d.classList.toggle('active', i === current); });
      }

      function autoPlay() {
        timer = setInterval(function() { goTo(current + 1); }, 4000);
      }

      if (prev) prev.addEventListener('click', function() { goTo(current - 1); clearInterval(timer); autoPlay(); });
      if (next) next.addEventListener('click', function() { goTo(current + 1); clearInterval(timer); autoPlay(); });
      dots.forEach(function(dot, i) {
        dot.addEventListener('click', function() { goTo(i); clearInterval(timer); autoPlay(); });
      });
      autoPlay();
    },

    /* ---- Detail tabs ---- */
    initDetailTabs: function() {
      var navs = document.querySelectorAll('.detail-tabs .tab-nav a');
      var contents = document.querySelectorAll('.detail-tabs .tab-content');
      navs.forEach(function(nav, i) {
        nav.addEventListener('click', function(e) {
          e.preventDefault();
          navs.forEach(function(n) { n.classList.remove('active'); });
          contents.forEach(function(c) { c.classList.remove('active'); });
          nav.classList.add('active');
          contents[i].classList.add('active');
        });
      });
    },

    /* ---- Login tabs ---- */
    initLoginTabs: function() {
      var tabs = document.querySelectorAll('.login-tabs a');
      var contents = document.querySelectorAll('.login-tab-content');
      tabs.forEach(function(tab, i) {
        tab.addEventListener('click', function(e) {
          e.preventDefault();
          tabs.forEach(function(t) { t.classList.remove('active'); });
          contents.forEach(function(c) { c.classList.remove('active'); });
          tab.classList.add('active');
          contents[i].classList.add('active');
        });
      });
    },

    /* ---- Quantity controls ---- */
    initQtyControls: function() {
      document.querySelectorAll('.qty-ctrl').forEach(function(ctrl) {
        var input = ctrl.querySelector('input');
        var minus = ctrl.querySelector('.qty-minus');
        var plus = ctrl.querySelector('.qty-plus');
        if (!input || !minus || !plus) return;
        minus.addEventListener('click', function() {
          var v = parseInt(input.value) || 1;
          if (v > 1) { input.value = v - 1; input.dispatchEvent(new Event('change')); }
        });
        plus.addEventListener('click', function() {
          var v = parseInt(input.value) || 1;
          input.value = v + 1;
          input.dispatchEvent(new Event('change'));
        });
      });
    },

    init: function() {
      this.updateCartCount();
      this.initBanner();
      this.initDetailTabs();
      this.initLoginTabs();
      this.initQtyControls();
    }
  };

  document.addEventListener('DOMContentLoaded', function() { App.init(); });
})();
