/* 火星桌面 marsDesk — 全站交互（零依赖） */
(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var navToggle = document.querySelector('.nav-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileQuery = window.matchMedia('(max-width: 820px), (pointer: coarse)');

  /* 1. 导航与移动菜单 */
  function updateHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  function setMenu(open) {
    if (!navToggle || !mobileMenu) return;
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    mobileMenu.hidden = !open;
    document.body.classList.toggle('nav-open', open);
    if (open) header.classList.add('is-scrolled');
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
    });
    mobileMenu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('click', function (event) {
      if (!mobileMenu.hidden && header && !header.contains(event.target)) setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820 && !mobileMenu.hidden) setMenu(false);
    });
    window.addEventListener('hashchange', function () { setMenu(false); });
  }

  /* 2. 页脚年份 */
  document.querySelectorAll('[data-year]').forEach(function (element) {
    element.textContent = String(Math.max(new Date().getFullYear(), 2026));
  });

  /* 3. 轻量进入动画；任何异常都会回退为直接显示 */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  function revealAll() {
    revealItems.forEach(function (element) { element.classList.add('is-in'); });
  }

  if (reduceMotionQuery.matches || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    revealItems.forEach(function (element) { revealObserver.observe(element); });
    window.setTimeout(revealAll, 3200);
  }

  /* 4. 灯箱：支持键盘、焦点约束和当前可见列表内切换 */
  var lightbox = document.getElementById('lightbox');
  var lightboxImage = lightbox ? lightbox.querySelector('img') : null;
  var lightboxCaption = lightbox ? lightbox.querySelector('figcaption') : null;
  var lightboxClose = lightbox ? lightbox.querySelector('.lb-close') : null;
  var lightboxPrev = lightbox ? lightbox.querySelector('.lb-prev') : null;
  var lightboxNext = lightbox ? lightbox.querySelector('.lb-next') : null;
  var lightboxTriggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  var lastFocusedElement = null;
  var lightboxIndex = 0;
  var lightboxItems = [];
  var closeTimer = null;

  function visibleLightboxItems() {
    return lightboxTriggers.filter(function (trigger) {
      return !trigger.closest('[hidden]') && trigger.getClientRects().length > 0;
    });
  }

  function renderLightbox() {
    if (!lightboxImage || !lightboxCaption || !lightboxItems.length) return;
    var trigger = lightboxItems[lightboxIndex];
    lightboxImage.src = trigger.getAttribute('data-lightbox');
    lightboxImage.alt = trigger.getAttribute('data-caption') || trigger.getAttribute('aria-label') || '';
    lightboxCaption.textContent = trigger.getAttribute('data-caption') || '';
    if (lightboxPrev) lightboxPrev.hidden = lightboxItems.length < 2;
    if (lightboxNext) lightboxNext.hidden = lightboxItems.length < 2;
  }

  function openLightbox(trigger) {
    if (!lightbox || !lightboxImage) return;
    window.clearTimeout(closeTimer);
    lightboxItems = visibleLightboxItems();
    lightboxIndex = Math.max(0, lightboxItems.indexOf(trigger));
    lastFocusedElement = document.activeElement;
    setMenu(false);
    renderLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(function () {
      lightbox.classList.add('is-open');
      if (lightboxClose) lightboxClose.focus();
    });
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(function () {
      lightbox.hidden = true;
      if (lightboxImage) lightboxImage.removeAttribute('src');
      if (lastFocusedElement && lastFocusedElement.focus) lastFocusedElement.focus();
    }, reduceMotionQuery.matches ? 0 : 190);
  }

  function moveLightbox(direction) {
    if (!lightboxItems.length) return;
    lightboxIndex = (lightboxIndex + direction + lightboxItems.length) % lightboxItems.length;
    renderLightbox();
  }

  lightboxTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () { openLightbox(trigger); });
  });

  if (lightbox) {
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', function () { moveLightbox(-1); });
    if (lightboxNext) lightboxNext.addEventListener('click', function () { moveLightbox(1); });

    document.addEventListener('keydown', function (event) {
      if (lightbox.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveLightbox(-1);
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveLightbox(1);
        return;
      }
      if (event.key === 'Tab') {
        var focusable = [lightboxClose, lightboxPrev, lightboxNext].filter(function (element) {
          return element && !element.hidden;
        });
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* 5. 屏保分类筛选 */
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var catalogCards = Array.prototype.slice.call(document.querySelectorAll('#saver-catalog .catalog-card'));
  var filterStatus = document.getElementById('filter-status');

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var filter = button.getAttribute('data-filter');
      filterButtons.forEach(function (item) {
        var active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      var visibleCount = 0;
      catalogCards.forEach(function (card) {
        var visible = filter === 'all' || card.getAttribute('data-category') === filter;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      if (filterStatus) {
        var label = filter === 'all' ? '全部 ' : button.textContent.replace(/\s*\d+\s*$/, '').trim() + ' ';
        filterStatus.textContent = '显示' + label + visibleCount + '款屏保';
      }
    });
  });

  /* 6. 动态壁纸演示：桌面可视时播放，离屏暂停；移动端/减少动态不自动播放 */
  var wallpaperVideo = document.getElementById('wallpaper-demo');
  var videoControl = document.getElementById('video-control');
  var videoControlText = videoControl ? videoControl.querySelector('.video-control-text') : null;
  var userPausedVideo = reduceMotionQuery.matches || mobileQuery.matches;

  function updateVideoControl() {
    if (!wallpaperVideo || !videoControl) return;
    var playing = !wallpaperVideo.paused && !wallpaperVideo.ended;
    videoControl.classList.toggle('is-playing', playing);
    videoControl.setAttribute('aria-pressed', String(playing));
    videoControl.setAttribute('aria-label', playing ? '暂停动态壁纸演示' : '播放动态壁纸演示');
    if (videoControlText) videoControlText.textContent = playing ? '暂停演示' : '播放演示';
  }

  if (wallpaperVideo && videoControl) {
    wallpaperVideo.addEventListener('play', updateVideoControl);
    wallpaperVideo.addEventListener('pause', updateVideoControl);
    updateVideoControl();

    videoControl.addEventListener('click', function () {
      if (wallpaperVideo.paused) {
        userPausedVideo = false;
        var playPromise = wallpaperVideo.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            userPausedVideo = true;
            updateVideoControl();
          });
        }
      } else {
        userPausedVideo = true;
        wallpaperVideo.pause();
      }
    });

    if ('IntersectionObserver' in window) {
      var videoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
            wallpaperVideo.pause();
            return;
          }
          if (!userPausedVideo && !reduceMotionQuery.matches && !mobileQuery.matches) {
            var playPromise = wallpaperVideo.play();
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch(function () { updateVideoControl(); });
            }
          }
        });
      }, { threshold: [0, 0.2, 0.6] });
      videoObserver.observe(wallpaperVideo);
    }

    function handleMotionPreferenceChange() {
      if (reduceMotionQuery.matches || mobileQuery.matches) {
        userPausedVideo = true;
        wallpaperVideo.pause();
      }
      updateVideoControl();
    }

    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', handleMotionPreferenceChange);
      mobileQuery.addEventListener('change', handleMotionPreferenceChange);
    } else if (typeof reduceMotionQuery.addListener === 'function') {
      reduceMotionQuery.addListener(handleMotionPreferenceChange);
      mobileQuery.addListener(handleMotionPreferenceChange);
    }
  }

  /* 7. 菜单 Escape 收尾（灯箱打开时由灯箱处理） */
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && mobileMenu && !mobileMenu.hidden) {
      setMenu(false);
      if (navToggle) navToggle.focus();
    }
  });
})();
