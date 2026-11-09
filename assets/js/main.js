/* 火星桌面 ZkDesk — 官网交互（零依赖） */
(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var toggle = document.querySelector('.nav-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var toast = document.getElementById('toast');
  var toastTimer = null;

  /* 1. 滚动时切换导航样式 */
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* 2. 移动端菜单 */
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      mobileMenu.hidden = open;
      if (!open) nav.classList.add('is-scrolled');
    });
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        toggle.setAttribute('aria-expanded', 'false');
        mobileMenu.hidden = true;
        onScroll();
      }
    });
  }

  /* 3. 「即将发布」提示 */
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('show');
    }, 2600);
  }
  document.querySelectorAll('.btn-soon').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showToast(btn.dataset.toast || '安装包正在准备中，敬请期待。');
    });
  });

  /* 4. 滚动进入动画（带兜底：任何情况下都不会让内容一直不可见） */
  var revealItems = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAll() {
    revealItems.forEach(function (el) { el.classList.add('is-in'); });
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealItems.forEach(function (el) { observer.observe(el); });

    /* 兜底 1：加载后把首屏内的元素直接显示 */
    window.addEventListener('load', function () {
      window.setTimeout(function () {
        revealItems.forEach(function (el) {
          if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
        });
      }, 400);
    });

    /* 兜底 2：3 秒后仍未显示的元素一律显示，避免观察器异常时页面空白 */
    window.setTimeout(revealAll, 3000);
  }

  /* 5. 页脚年份（版权自 2025 年起） */
  var year = document.getElementById('year');
  if (year) {
    var y = new Date().getFullYear();
    year.textContent = String(Math.max(y, 2026));
  }

  /* 6. 锚点跳转后收起移动端菜单 */
  window.addEventListener('hashchange', function () {
    if (mobileMenu && !mobileMenu.hidden) {
      mobileMenu.hidden = true;
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* 7. 截图大图预览 */
  var lightbox = document.getElementById('lightbox');
  var lbImg = lightbox ? lightbox.querySelector('img') : null;
  var lbCap = lightbox ? lightbox.querySelector('figcaption') : null;
  var lbClose = lightbox ? lightbox.querySelector('.lb-close') : null;
  var lastFocus = null;

  function openLightbox(src, caption) {
    if (!lightbox || !lbImg) return;
    lastFocus = document.activeElement;
    lbImg.src = src;
    lbImg.alt = caption || '';
    if (lbCap) lbCap.textContent = caption || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(function () { lightbox.classList.add('is-open'); });
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    window.setTimeout(function () {
      lightbox.hidden = true;
      if (lbImg) lbImg.removeAttribute('src');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }, 220);
  }

  document.querySelectorAll('[data-lightbox]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openLightbox(btn.getAttribute('data-lightbox'), btn.getAttribute('data-caption'));
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }
})();
