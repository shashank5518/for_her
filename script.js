(function () {
  'use strict';

  // ----- Audio: click sound (generated, no file needed) -----
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function playClickSound() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (_) {}
  }

  // ----- Background music -----
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');

  function initMusic() {
    musicToggle.classList.toggle('playing', !bgMusic.paused);
  }

  musicToggle.addEventListener('click', function () {
    playClickSound();
    if (bgMusic.paused) {
      bgMusic.play().catch(function () {});
      musicToggle.classList.add('playing');
    } else {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
    }
  });

  // Unmute and optionally start on first user interaction (many browsers block autoplay)
  function tryStartMusic() {
    if (bgMusic.paused) {
      bgMusic.play().catch(function () {});
      musicToggle.classList.add('playing');
    }
  }

  document.addEventListener('click', function once() {
    tryStartMusic();
    document.removeEventListener('click', once);
  }, { once: true });

  document.addEventListener('keydown', function once() {
    tryStartMusic();
    document.removeEventListener('keydown', once);
  }, { once: true });

  initMusic();

  // ----- Navigation -----
  const sections = document.querySelectorAll('.section');
  const navPills = document.querySelectorAll('.nav-pill');

  function goToSection(sectionId) {
    playClickSound();
    sections.forEach(function (s) {
      s.classList.toggle('active', s.id === sectionId);
    });
    navPills.forEach(function (p) {
      p.classList.toggle('active', p.getAttribute('data-section') === sectionId);
    });
  }

  navPills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      goToSection(pill.getAttribute('data-section'));
    });
  });

  // ----- Open letter (smooth transition from landing) -----
  const openLetterBtn = document.getElementById('openLetter');
  const closeLetterBtn = document.getElementById('closeLetter');

  openLetterBtn.addEventListener('click', function () {
    playClickSound();
    goToSection('letter');
  });

  closeLetterBtn.addEventListener('click', function () {
    playClickSound();
    goToSection('landing');
  });

  // ----- Lightbox: open photos and videos on tap/click -----
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxVideo = document.getElementById('lightboxVideo');
  var lightboxClose = document.getElementById('lightboxClose');

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.classList.remove('is-visible');
    lightboxImg.removeAttribute('src');
    lightboxVideo.classList.remove('is-visible');
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
  }

  function openLightbox(src, isVideo) {
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    lightboxImg.classList.remove('is-visible');
    lightboxVideo.classList.remove('is-visible');
    if (isVideo) {
      lightboxVideo.setAttribute('src', src);
      lightboxVideo.classList.add('is-visible');
      lightboxVideo.play().catch(function () {});
    } else {
      lightboxImg.setAttribute('src', src);
      lightboxImg.classList.add('is-visible');
    }
  }

  lightboxClose.addEventListener('click', function () {
    playClickSound();
    closeLightbox();
  });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      playClickSound();
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  document.addEventListener('click', function (e) {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
  
    playClickSound();
  
    const img = item.querySelector('img');
    const video = item.querySelector('video');
    const src =
      (video && (video.currentSrc || video.src || video.getAttribute('src'))) ||
      (img && (img.src || img.getAttribute('src')));
  
    if (video && src) {
      openLightbox(src, true);
    } else if (img && src) {
      openLightbox(src, false);
    }
  });
})();