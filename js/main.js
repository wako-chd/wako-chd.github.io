/**
 * WAKO CHANDIGARH KICKBOXING CHAMPIONSHIP
 * Futuristic UI Application Logic & Multi-Carousel Engine
 * Features: Background Video HUD, Swiper 11 Carousels, 3D Tilt, Live Telemetry,
 * Countdown, Schedule Filters, Athlete Pass Generator, Gallery Lightbox, Toast alerts.
 */

// ===================================================================
// FORM SUBMISSION ENDPOINT
// ===================================================================
const GOOGLE_SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwfvS-vxMzDpS0Y_gH8iiD0kfh6Oy93gOxxr8-2f7F4f6ZYgaL5B2dIldLso7OhgP98RQ/exec';

async function sendFormDataToGoogleSheet(payload) {
  if (!GOOGLE_SHEET_WEBAPP_URL || GOOGLE_SHEET_WEBAPP_URL.includes('PASTE_YOUR_GOOGLE_APPS_SCRIPT')) {
    console.warn('[Google Sheet Integration] Web App URL not configured yet. Form Payload:', payload);
    return { success: false, unconfigured: true };
  }

  try {
    payload.timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Format phone to prevent Google Sheets from interpreting leading '+' as a formula error
    if (payload.phone && String(payload.phone).trim().startsWith('+')) {
      payload.phone = "'" + String(payload.phone).trim();
    }

    // Use mode: 'no-cors' and text/plain to reliably dispatch across origins without CORS preflight block
    await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    console.log('[Google Sheet Integration] Data sent successfully:', payload);
    return { success: true };
  } catch (error) {
    console.error('[Google Sheet Integration] Error sending data:', error);
    return { success: false, error: error };
  }
}


document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize AOS (Animate On Scroll) with robust lifecycle recalibration
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 35,
      delay: 0,
      mirror: false,
      disableMutationObserver: false
    });

    // Auto-refresh AOS after dynamic assets, fonts, videos and carousels expand the DOM
    window.addEventListener('load', () => {
      AOS.refresh();
    });

    [300, 700, 1500, 3000].forEach((delayMs) => {
      setTimeout(() => {
        if (typeof AOS !== 'undefined') AOS.refresh();
      }, delayMs);
    });

    window.addEventListener('resize', () => {
      if (typeof AOS !== 'undefined') AOS.refresh();
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        if (typeof AOS !== 'undefined') AOS.refresh();
      }, 350);
    });
  }

  // 2. Initialize Hero Video Background Controls & Telemetry
  initHeroVideoControls();
  initLiveTelemetry();

  // 3. Initialize 3D Hero Geometric Canvas
  initHeroCanvas();

  // 4. Initialize 3D Card Tilt Effects
  init3DTilt();

  // 5. Initialize Swiper Carousels
  initSwiperCarousels();

  // 6. Initialize Championship Countdown Timer
  initCountdownTimer();

  // 7. Initialize Timings & Schedule Filtering
  initScheduleFilters();

  // 8. Initialize YouTube Podcast Player & Episode Switcher
  initPodcastPlayer();

  // 9. Initialize Athlete Registration & Pass Generator
  initAthleteRegistration();

  // 10. Initialize Gallery Lightbox
  initGalleryLightbox();

  // 11. Initialize Mobile Menu & Sticky Navbar
  initNavigation();

  // 12. Initialize Contact Form & Toast
  initContactForm();

  // 13. Initialize Back to Top
  initBackToTop();

  // 14. Initialize Kinetic Text Animations (Heading/Subheading Typing & Paragraph Word Slide-Up)
  initTextAnimations();

  // 15. Initialize Custom Floating Podcast Cursor (Watch Podcast)
  initPodcastCursor();

  // 16. Initialize Smooth Section Arrival On Scroll
  initSectionArrivals();

  // 17. Initialize Cinematic Showcase Video Lightbox Modal
  initCinematicVideoModal();

  // 18. Initialize Combat Striking Metrics & Biomechanics Lab
  initCombatLab();
});

/* ===================================================================
   1. HERO VIDEO CONTROLS & LIVE TELEMETRY
   =================================================================== */
function initHeroVideoControls() {
  const heroSection = document.getElementById('home');
  const video = document.getElementById('heroBgVideo');
  const contentContainer = document.getElementById('heroContentContainer');

  if (!heroSection || !video) return;

  const MOBILE_VIDEO_SRC = 'assets/WAKO Chandigarh Hero 9x16.mp4';
  const DESKTOP_VIDEO_SRC = 'assets/WAKO Chandigarh Hero.mp4';

  let isActivated = false;
  let currentMode = window.innerWidth <= 768 ? 'mobile' : 'desktop';

  function applyHeroVideoSource() {
    const isMobile = window.innerWidth <= 768;
    const targetSrc = isMobile ? MOBILE_VIDEO_SRC : DESKTOP_VIDEO_SRC;
    const activeSrc = video.getAttribute('data-active-src');

    if (activeSrc !== targetSrc) {
      video.setAttribute('data-active-src', targetSrc);
      video.src = targetSrc;
      video.load();
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    }
  }

  function activateVideoHero() {
    if (isActivated) return;
    if (video.currentTime > 0.05 || (video.readyState >= 3 && !video.paused)) {
      isActivated = true;
      if (contentContainer) {
        contentContainer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        contentContainer.style.opacity = '0';
        contentContainer.style.transform = 'translateY(-15px)';
        setTimeout(() => {
          heroSection.classList.remove('is-loading');
          heroSection.classList.add('video-active');
        }, 500);
      } else {
        heroSection.classList.remove('is-loading');
        heroSection.classList.add('video-active');
      }
    }
  }

  function fallbackToText() {
    if (!isActivated) {
      heroSection.classList.add('is-loading');
      heroSection.classList.remove('video-active');
      if (contentContainer) {
        contentContainer.style.opacity = '1';
        contentContainer.style.transform = 'translateY(0)';
        contentContainer.style.display = '';
      }
    }
  }

  // Monitor video playback events
  video.addEventListener('playing', activateVideoHero);
  video.addEventListener('timeupdate', () => {
    if (video.currentTime > 0.05) {
      activateVideoHero();
    }
  });

  video.addEventListener('waiting', () => {
    if (!isActivated) fallbackToText();
  });

  video.addEventListener('error', fallbackToText);

  // Muted autoplay configuration
  video.muted = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('muted', '');

  // Set initial video according to viewport (Mobile 9x16 vs Desktop)
  applyHeroVideoSource();

  const startPromise = video.play();
  if (startPromise !== undefined) {
    startPromise
      .then(() => {
        // Will activate cleanly on first frame via timeupdate/playing
      })
      .catch(() => {
        fallbackToText();
        // If browser requires user interaction first, unlock on initial user touch/click
        const userUnlock = () => {
          video.muted = true;
          video.play().then(activateVideoHero).catch(() => {});
          window.removeEventListener('click', userUnlock);
          window.removeEventListener('touchstart', userUnlock);
        };
        window.addEventListener('click', userUnlock, { once: true });
        window.addEventListener('touchstart', userUnlock, { once: true });
      });
  }

  // Handle dynamic resize/orientation change between mobile and desktop
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newMode = window.innerWidth <= 768 ? 'mobile' : 'desktop';
      if (newMode !== currentMode) {
        currentMode = newMode;
        isActivated = false;
        applyHeroVideoSource();
      }
    }, 250);
  });
}

function initLiveTelemetry() {
  const velocityEl = document.getElementById('telHeroVelocity');
  const forceEl = document.getElementById('telHeroForce');
  const heartRateEl = document.getElementById('telHeroHeartRate');

  if (!velocityEl && !forceEl && !heartRateEl) return;

  setInterval(() => {
    if (velocityEl) {
      const v = (33 + Math.random() * 2.8).toFixed(1);
      velocityEl.innerText = `${v} m/s`;
    }
    if (forceEl) {
      const f = Math.floor(790 + Math.random() * 45);
      forceEl.innerText = `${f} kgf`;
    }
    if (heartRateEl) {
      const hr = Math.floor(142 + Math.random() * 12);
      heartRateEl.innerText = `${hr} BPM`;
    }
  }, 2200);
}

/* ===================================================================
   2. 3D HERO GEOMETRIC CANVAS
   =================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 38;

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 42, 59, 0.45)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 42, 59, ${0.16 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

/* ===================================================================
   3. 3D TILT EFFECT FOR CARDS
   =================================================================== */
function init3DTilt() {
  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      el.style.transition = 'transform 0.5s ease';
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'none';
    });
  });
}

/* ===================================================================
   4. SWIPER CAROUSELS INITIALIZATION
   =================================================================== */
function initSwiperCarousels() {
  if (typeof Swiper === 'undefined') return;

  // 1. Disciplines Carousel
  if (document.querySelector('.disciplinesSwiper')) {
    new Swiper('.disciplinesSwiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.disc-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.disc-next',
        prevEl: '.disc-prev'
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 28
        }
      }
    });
  }

  // 2. Podcast Episodes Carousel (Matching Reference Studio Card Layout)
  if (document.querySelector('.podcastsSwiper')) {
    new Swiper('.podcastsSwiper', {
      slidesPerView: 1,
      spaceBetween: 22,
      loop: true,
      speed: 650,
      grabCursor: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.pod-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.pod-next',
        prevEl: '.pod-prev'
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 26
        }
      }
    });
  }

  // 3. Champions & Athletes Roster Carousel
  if (document.querySelector('.championsSwiper')) {
    new Swiper('.championsSwiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.champ-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.champ-next',
        prevEl: '.champ-prev'
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 28
        }
      }
    });
  }

  // 4. Curved 3D Cylinder Automatic Carousels (Gallery & Coaches)
  function setupCurvedCylinderSwiper(selector, nextBtnId, prevBtnId, paginationClass) {
    if (!document.querySelector(selector)) return null;

    function updateCurvedTransforms(swiper) {
      if (!swiper || !swiper.slides) return;
      swiper.slides.forEach(slide => {
        const progress = slide.progress;
        if (typeof progress === 'undefined' || isNaN(progress)) return;

        // Concave cylindrical arc:
        const rotateY = progress * -14.5;
        const translateZ = -Math.pow(Math.abs(progress), 1.25) * 32;
        const translateY = Math.pow(Math.abs(progress), 1.55) * 5;
        const scale = Math.max(0.82, 1 - Math.abs(progress) * 0.04);
        const opacity = Math.max(0.35, 1 - Math.abs(progress) * 0.16);

        slide.style.transform = `perspective(1100px) rotateY(${rotateY.toFixed(2)}deg) translateZ(${translateZ.toFixed(2)}px) translateY(${translateY.toFixed(2)}px) scale(${scale.toFixed(3)})`;
        slide.style.zIndex = Math.round(50 - Math.abs(progress) * 10);
        slide.style.opacity = opacity.toFixed(2);
      });
    }

    const swiper = new Swiper(selector, {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 20,
      loop: true,
      speed: 750,
      grabCursor: true,
      watchSlidesProgress: true,
      autoplay: {
        delay: 2600,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: paginationClass,
        clickable: true
      },
      navigation: {
        nextEl: nextBtnId,
        prevEl: prevBtnId
      },
      on: {
        init(s) {
          updateCurvedTransforms(s);
        },
        setTranslate(s) {
          updateCurvedTransforms(s);
        },
        setTransition(s, duration) {
          s.slides.forEach(slide => {
            slide.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${duration}ms ease`;
          });
        }
      }
    });

    setTimeout(() => {
      if (swiper && swiper.update) {
        swiper.update();
        updateCurvedTransforms(swiper);
      }
    }, 150);

    return swiper;
  }

  // Gallery 3D Carousel
  setupCurvedCylinderSwiper('.curvedGallerySwiper', '#galleryNextBtn', '#galleryPrevBtn', '.gallery-curved-pagination');

  // Coaches 3D Carousel (Matching Image Gallery Carousel)
  setupCurvedCylinderSwiper('.curvedCoachesSwiper', '#coachesNextBtn', '#coachesPrevBtn', '.coaches-curved-pagination');

  // Reviews Carousel (Simplified Cards)
  if (document.querySelector('.reviewsSwiper')) {
    new Swiper('.reviewsSwiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      speed: 600,
      grabCursor: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.reviews-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '#reviewsNextBtn',
        prevEl: '#reviewsPrevBtn'
      },
      breakpoints: {
        640: {
          slidesPerView: 1.4,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 24
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 26
        }
      }
    });
  }
}

/* ===================================================================
   5. CHAMPIONSHIP COUNTDOWN TIMER
   =================================================================== */
function initCountdownTimer() {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 42);
  targetDate.setHours(9, 0, 0, 0);

  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl = document.getElementById('cdMins');
  const secsEl = document.getElementById('cdSecs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      daysEl.innerText = '00';
      hoursEl.innerText = '00';
      minsEl.innerText = '00';
      secsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = String(days).padStart(2, '0');
    hoursEl.innerText = String(hours).padStart(2, '0');
    minsEl.innerText = String(minutes).padStart(2, '0');
    secsEl.innerText = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ===================================================================
   6. SCHEDULE & TIMING FILTERING
   =================================================================== */
function initScheduleFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const rows = document.querySelectorAll('.schedule-row');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      rows.forEach(row => {
        const category = row.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   7. YOUTUBE PODCAST PLAYER & EPISODE SWITCHER
   =================================================================== */
function initPodcastPlayer() {
  const playerIframe = document.getElementById('podcastMainPlayer');
  const currentTitle = document.getElementById('currentPodcastTitle');
  const currentDesc = document.getElementById('currentPodcastDesc');
  const currentEpTag = document.getElementById('currentPodcastEp');
  const currentWatchBtn = document.getElementById('currentPodcastWatchBtn');
  const episodeCards = document.querySelectorAll('.podcast-card');

  episodeCards.forEach(card => {
    card.addEventListener('click', () => {
      const platform = card.getAttribute('data-platform') || 'youtube';
      const videoId = card.getAttribute('data-video-id');
      const directUrl = card.getAttribute('data-url');
      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-desc');
      const epNumber = card.getAttribute('data-ep');

      if (playerIframe && videoId) {
        if (platform === 'instagram') {
          playerIframe.src = `https://www.instagram.com/reel/${videoId}/embed/`;
        } else {
          playerIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        }
      }

      if (currentTitle && title) currentTitle.innerText = title;
      if (currentDesc && desc) currentDesc.innerText = desc;
      if (currentEpTag && epNumber) currentEpTag.innerText = `Episode ${epNumber}`;

      if (currentWatchBtn && directUrl) {
        currentWatchBtn.href = directUrl;
        if (platform === 'instagram') {
          currentWatchBtn.innerHTML = `<i class="fa-brands fa-instagram"></i> Watch on Instagram`;
          currentWatchBtn.className = 'btn btn-dark-pill btn-sm';
        } else {
          currentWatchBtn.innerHTML = `<i class="fa-brands fa-youtube"></i> Watch on YouTube`;
          currentWatchBtn.className = 'btn btn-youtube btn-sm';
        }
      }

      const playerContainer = document.getElementById('podcastPlayerSection');
      if (playerContainer) {
        playerContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      showToast(`Now Playing: ${title}`);
    });
  });
}

/* ===================================================================
   8. ATHLETE REGISTRATION & PASS GENERATOR
   =================================================================== */
function initAthleteRegistration() {
  const regForm = document.getElementById('championshipRegForm');
  const modalOverlay = document.getElementById('passModal');
  const closeBtn = document.getElementById('closePassBtn');
  const printBtn = document.getElementById('printPassBtn');

  if (!regForm) return;

  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('regFullName').value.trim();
    const discipline = document.getElementById('regDiscipline').value;
    const category = document.getElementById('regCategory').value;
    const weightClass = document.getElementById('regWeight').value.trim();
    const club = document.getElementById('regClub').value.trim() || 'Chandigarh Kickboxing Academy';
    const phone = document.getElementById('regPhone') ? document.getElementById('regPhone').value.trim() : '';

    if (!fullName || !discipline || !category || !weightClass || !phone) {
      showToast('Please complete all mandatory fields.');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const athleteId = `CHD-WAKO-26-${randomNum}`;

    document.getElementById('passIdVal').innerText = athleteId;
    document.getElementById('passNameVal').innerText = fullName;
    document.getElementById('passDiscVal').innerText = discipline;
    document.getElementById('passCatVal').innerText = category;
    document.getElementById('passWeightVal').innerText = `${weightClass} kg`;
    document.getElementById('passClubVal').innerText = club;
    document.getElementById('passBarcodeVal').innerText = `*${athleteId}*`;

    // Visual button loading state
    const submitBtn = regForm.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting & Generating Pass...';
    }

    // Send data to Google Sheet with form source explicitly mentioned
    const sheetResult = await sendFormDataToGoogleSheet({
      formSource: 'Athlete Registration Form',
      athleteId: athleteId,
      fullName: fullName,
      phone: phone,
      email: '',
      category: category,
      discipline: discipline,
      weight: `${weightClass} kg`,
      club: club,
      subject: 'Championship Athlete Registration',
      message: 'Medical fitness confirmed'
    });

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }

    if (modalOverlay) {
      modalOverlay.classList.add('active');
    }

    if (sheetResult && sheetResult.success) {
      showToast('Athlete Registered! Data Saved to Google Sheet.');
    } else {
      showToast('Athlete Registered! Digital Combat Pass Generated.');
    }
  });

  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ===================================================================
   9. GALLERY LIGHTBOX
   =================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item, .curved-gallery-card, .achieve-poster');
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const closeBtn = document.querySelector('.lightbox-close');

  if (!modal || !modalImg) return;

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const img = item.querySelector('img');
      if (img) {
        modalImg.src = img.src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ===================================================================
   10. MOBILE MENU & STICKY NAVBAR
   =================================================================== */
function initNavigation() {
  const dynamicNav = document.getElementById('dynamicNav');
  const menuWrapper = document.getElementById('islandMenuWrapper');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelectorAll('.island-nav-link');

  if (!dynamicNav) return;

  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  function handleScroll() {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

    // At or near top: always full open
    if (currentScrollY <= 50) {
      dynamicNav.classList.remove('collapsed');
      if (menuWrapper) menuWrapper.classList.remove('mobile-open');
    }
    // Scrolling DOWN past threshold: shrink into Dynamic Island (only Logo at center)
    else if (currentScrollY > lastScrollY && currentScrollY > 90) {
      dynamicNav.classList.add('collapsed');
      if (menuWrapper) menuWrapper.classList.remove('mobile-open');
      if (menuToggle) {
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    }
    // Scrolling UP: open up dynamic island and show all options
    else if (currentScrollY < lastScrollY) {
      dynamicNav.classList.remove('collapsed');
    }

    lastScrollY = Math.max(0, currentScrollY);
  }

  // Click on collapsed Dynamic Island: expand immediately unless clicking contact button
  dynamicNav.addEventListener('click', (e) => {
    if (e.target.closest('#islandContactBtn')) {
      return;
    }
    if (dynamicNav.classList.contains('collapsed')) {
      dynamicNav.classList.remove('collapsed');
    }
  });

  // Active section highlighting on scroll
  const sections = ['about', 'gallery', 'podcasts', 'contact'];
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = (window.pageYOffset || document.documentElement.scrollTop) + 160;

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollPos) {
        current = id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Mobile Menu Toggle
  if (menuToggle && menuWrapper) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuWrapper.classList.toggle('mobile-open');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        if (menuWrapper.classList.contains('mobile-open')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (!dynamicNav.contains(e.target) && !menuWrapper.contains(e.target)) {
        menuWrapper.classList.remove('mobile-open');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuWrapper.classList.remove('mobile-open');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // Get Started Button: smooth scroll to registration form & focus first input
  const getStartedBtn = document.getElementById('whyUsGetStartedBtn');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('registration');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const firstInput = document.getElementById('regFullName');
          if (firstInput) {
            firstInput.focus();
          }
        }, 600);
      }
    });
  }
}

/* ===================================================================
   11. CONTACT FORM & TOAST NOTIFICATION
   =================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject') ? document.getElementById('contactSubject').value : 'General Inquiry';
    const msg = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !msg) {
      showToast('Please fill all required fields.');
      return;
    }

    // Visual button loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting to Google Sheet...';
    }

    // Send data to Google Sheet with form source explicitly mentioned
    const sheetResult = await sendFormDataToGoogleSheet({
      formSource: 'Contact Us Form',
      athleteId: '-',
      fullName: name,
      phone: '-',
      email: email,
      category: '-',
      discipline: '-',
      weight: '-',
      club: '-',
      subject: subject,
      message: msg
    });

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }

    if (sheetResult && sheetResult.success) {
      showToast(`Inquiry Saved to Google Sheet! Thank you ${name}.`);
    } else {
      showToast(`Inquiry Received! Thank you ${name}.`);
    }

    contactForm.reset();
  });
}

function showToast(message) {
  let toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ===================================================================
   12. BACK TO TOP BUTTON
   =================================================================== */
function initBackToTop() {
  const btt = document.getElementById('backToTop');
  if (!btt) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btt.classList.add('visible');
    } else {
      btt.classList.remove('visible');
    }
  });

  btt.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ===================================================================
   14. KINETIC TEXT ANIMATIONS
   - Typing effect for Headings & Subheadings
   - Staggered Word-by-word Slide-Up for Paragraphs
   - Triggered when user appears on that section (AOS / Scroll trigger)
   =================================================================== */
function initTextAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const headingSelectors = [
    '.hero-script-tag',
    '.hero-title-main',
    '.wako-display-title',
    '.coach-display-title',
    '.coach-caption-name',
    '.section-title',
    '.achieve-headline',
    '.pre-footer-title',
    '#about h2',
    '.type-heading'
  ].join(', ');

  const subheadingSelectors = [
    '.section-subtitle',
    '.pre-footer-tagline',
    '.coach-caption-role',
    '.type-subheading'
  ].join(', ');

  const paragraphSelectors = [
    '.hero-desc',
    '.wako-clean-desc',
    '.wako-clean-subtext',
    '.coach-bio-lead',
    '.coach-bio-body',
    '.achieve-subtext',
    '.pre-footer-desc',
    '.podcast-featured-desc',
    '.podcast-card-desc',
    '.pricing-plan-desc',
    '#about p',
    '.para-slide-words'
  ].join(', ');

  const allHeadings = Array.from(document.querySelectorAll(headingSelectors));
  const allSubheadings = Array.from(document.querySelectorAll(subheadingSelectors));
  const allParagraphs = Array.from(document.querySelectorAll(paragraphSelectors));

  // --- Helper: Wrap text nodes in character spans for typing ---
  function wrapCharsInNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      if (!text) return;
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const span = document.createElement('span');
        span.className = 'type-char';
        span.textContent = char;
        fragment.appendChild(span);
      }
      node.parentNode.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (
        node.classList.contains('type-char') ||
        node.classList.contains('type-cursor') ||
        node.tagName === 'SCRIPT' ||
        node.tagName === 'STYLE' ||
        node.tagName === 'BR'
      ) {
        return;
      }
      const children = Array.from(node.childNodes);
      children.forEach(child => wrapCharsInNode(child));
    }
  }

  // --- Helper: Wrap text nodes in word-reveal masks for slide up ---
  function wrapWordsInNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      if (!text || !text.trim()) return;
      const tokens = text.split(/(\s+)/);
      const fragment = document.createDocumentFragment();

      tokens.forEach(token => {
        if (!token) return;
        if (/^\s+$/.test(token)) {
          fragment.appendChild(document.createTextNode(' '));
        } else {
          const mask = document.createElement('span');
          mask.className = 'word-reveal-mask';
          const inner = document.createElement('span');
          inner.className = 'word-reveal-inner';
          inner.textContent = token;
          mask.appendChild(inner);
          fragment.appendChild(mask);
        }
      });

      node.parentNode.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (
        node.classList.contains('word-reveal-mask') ||
        node.tagName === 'SCRIPT' ||
        node.tagName === 'STYLE' ||
        node.tagName === 'I' ||
        node.tagName === 'BR'
      ) {
        return;
      }
      const children = Array.from(node.childNodes);
      children.forEach(child => wrapWordsInNode(child));
    }
  }

  // Prepare DOM structures
  allHeadings.forEach(el => {
    if (!el.dataset.typePrepared) {
      wrapCharsInNode(el);
      el.dataset.typePrepared = 'true';
    }
  });

  allSubheadings.forEach(el => {
    if (!el.dataset.typePrepared) {
      wrapCharsInNode(el);
      el.dataset.typePrepared = 'true';
    }
  });

  allParagraphs.forEach(el => {
    if (!el.dataset.wordPrepared) {
      wrapWordsInNode(el);
      el.dataset.wordPrepared = 'true';
    }
  });

  // --- Execution: Run typing effect ---
  function runTyping(el, speed = 22, onComplete) {
    if (!el || el.dataset.typingDone) {
      if (onComplete) onComplete();
      return;
    }
    el.dataset.typingDone = 'true';

    const chars = el.querySelectorAll('.type-char');
    if (!chars.length) {
      if (onComplete) onComplete();
      return;
    }

    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';
    el.appendChild(cursor);

    let idx = 0;
    function nextChar() {
      if (idx < chars.length) {
        chars[idx].classList.add('is-typed');
        chars[idx].after(cursor);
        idx++;
        setTimeout(nextChar, speed);
      } else {
        setTimeout(() => {
          cursor.style.transition = 'opacity 0.4s ease';
          cursor.style.opacity = '0';
          setTimeout(() => cursor.remove(), 400);
        }, 900);
        if (onComplete) onComplete();
      }
    }
    nextChar();
  }

  // --- Execution: Run paragraph word slide up ---
  function runWordSlide(el) {
    if (!el || el.dataset.wordDone) return;
    el.dataset.wordDone = 'true';

    const masks = el.querySelectorAll('.word-reveal-mask');
    masks.forEach((mask, index) => {
      const delay = Math.min(index * 26, 1300);
      const inner = mask.querySelector('.word-reveal-inner');
      if (inner) {
        inner.style.transitionDelay = `${delay}ms`;
      }
      requestAnimationFrame(() => {
        mask.classList.add('is-revealed');
      });
    });
  }

  // --- Trigger on Section Appearance ---
  const triggerContainers = document.querySelectorAll('section, .pre-footer-banner, .coach-bio-col');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sec = entry.target;
        observer.unobserve(sec);

        const headings = Array.from(sec.querySelectorAll(headingSelectors));
        const subheadings = Array.from(sec.querySelectorAll(subheadingSelectors));
        const paragraphs = Array.from(sec.querySelectorAll(paragraphSelectors));

        // 1. Headings start typing
        headings.forEach(h => runTyping(h, 24));

        // 2. Subheadings start typing with a slight offset
        setTimeout(() => {
          subheadings.forEach(sub => runTyping(sub, 14));
        }, 200);

        // 3. Paragraphs words slide up sequentially
        setTimeout(() => {
          paragraphs.forEach(p => runWordSlide(p));
        }, 150);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  triggerContainers.forEach(sec => observer.observe(sec));

  // Fallback observer for any paragraphs or headings not inside a section
  allParagraphs.forEach(p => {
    if (!p.closest('section') && !p.closest('.pre-footer-banner')) {
      const pObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            pObs.unobserve(e.target);
            runWordSlide(e.target);
          }
        });
      }, { threshold: 0.15 });
      pObs.observe(p);
    }
  });

  allHeadings.forEach(h => {
    if (!h.closest('section') && !h.closest('.pre-footer-banner')) {
      const hObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            hObs.unobserve(e.target);
            runTyping(e.target, 24);
          }
        });
      }, { threshold: 0.15 });
      hObs.observe(h);
    }
  });
}

/* ===================================================================
   15. CUSTOM FLOATING PODCAST CURSOR (Watch Podcast)
   =================================================================== */
function initPodcastCursor() {
  const cursor = document.getElementById('podcastCursor');
  const podcastSection = document.getElementById('podcasts');
  if (!cursor || !podcastSection) return;

  // Don't activate on touch/mobile devices
  if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) return;

  let mouseX = -100;
  let mouseY = -100;
  let targetX = -100;
  let targetY = -100;
  let isHovered = false;
  let rafId = null;

  function updateCursorPos() {
    mouseX += (targetX - mouseX) * 0.28;
    mouseY += (targetY - mouseY) * 0.28;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    if (isHovered) {
      rafId = requestAnimationFrame(updateCursorPos);
    }
  }

  // Active targets: podcast cards, carousel wrapper, featured player
  const activeSelectors = '.podcast-card, .podcast-featured-card, .podcast-video-frame-wrap, .podcastsSwiper';

  podcastSection.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;

    const overTarget = e.target.closest(activeSelectors) !== null;
    const overClickableButton = e.target.closest('.carousel-btn, .btn, a') !== null;

    if (overTarget && !overClickableButton) {
      if (!isHovered) {
        isHovered = true;
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
        cursor.classList.add('is-active');
        rafId = requestAnimationFrame(updateCursorPos);
      } else {
        cursor.classList.add('is-active');
      }
    } else {
      cursor.classList.remove('is-active');
    }
  });

  podcastSection.addEventListener('mouseleave', () => {
    isHovered = false;
    cursor.classList.remove('is-active');
    cursor.classList.remove('is-pressed');
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });

  podcastSection.addEventListener('mousedown', (e) => {
    if (e.target.closest(activeSelectors)) {
      cursor.classList.add('is-pressed');
    }
  });

  window.addEventListener('mouseup', () => {
    cursor.classList.remove('is-pressed');
  });
}

/* ===================================================================
   16. SMOOTH SECTION ARRIVAL ON SCROLL
   =================================================================== */
function initSectionArrivals() {
  const sections = document.querySelectorAll('section:not(.hero-section), footer.site-footer');
  if (!sections.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    sections.forEach(sec => sec.classList.add('section-arrived'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-arrived');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  });

  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50 && rect.bottom > 0) {
      sec.classList.add('section-arrived');
    } else {
      observer.observe(sec);
    }
  });
}

/* ===================================================================
   17. CINEMATIC VIDEO SHOWCASE MODAL
   =================================================================== */
function initCinematicVideoModal() {
  const openBtn = document.getElementById('playCinematicVideoBtn');
  const modal = document.getElementById('videoModal');
  const closeBtn = document.getElementById('closeVideoModal');
  const video = document.getElementById('modalShowcaseVideo');
  const iframe = document.getElementById('modalShowcaseIframe');

  if (!openBtn || !modal) return;

  function openModal() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (iframe) {
      const targetSrc = iframe.getAttribute('data-src');
      if (targetSrc) {
        iframe.src = targetSrc;
      }
    }
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (iframe) {
      iframe.src = '';
    }
    if (video) {
      video.pause();
    }
  }

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* ===================================================================
   18. COMBAT STRIKING METRICS & BIOMECHANICS LAB
   =================================================================== */
function initCombatLab() {
  const strikeButtons = document.querySelectorAll('.strike-btn');
  const simulateBtn = document.getElementById('simulateStrikeBtn');
  const telemetryDisplay = document.getElementById('strikeTelemetryDisplay');

  if (!strikeButtons.length || !telemetryDisplay) return;

  const strikeData = {
    'blitz-punch': {
      discipline: 'Point Fighting (Tatami)',
      name: 'Blitz Lead Punch',
      speed: '0.28',
      speedUnit: 'sec',
      force: '380',
      torque: '265',
      burn: '820',
      velocityPct: '95%',
      velocityLabel: '95% (Elite Speed)',
      torquePct: '68%',
      torqueLabel: '68% (Linear Focus)',
      accuracyPct: '92%',
      accuracyLabel: '92% Scoring Zone',
      chain: 'Push off rear ball-of-foot → pelvic acceleration → scapular extension → instantaneous glove deceleration at impact.'
    },
    'low-kick': {
      discipline: 'Ring Sport / Low Kick',
      name: 'Dutch Low Roundhouse',
      speed: '0.42',
      speedUnit: 'sec',
      force: '850',
      torque: '540',
      burn: '940',
      velocityPct: '88%',
      velocityLabel: '88% Rotational Peak',
      torquePct: '96%',
      torqueLabel: '96% Max Femur Torque',
      accuracyPct: '89%',
      accuracyLabel: '89% Outer Thigh Zone',
      chain: '45° lateral plant step → violent hip turnover → quadriceps extension → devastating tibial bone contact on opposing quadriceps.'
    },
    'flying-knee': {
      discipline: 'K-1 Style Rules',
      name: 'Flying Jumping Knee',
      speed: '0.35',
      speedUnit: 'sec',
      force: '920',
      torque: '610',
      burn: '1,050',
      velocityPct: '91%',
      velocityLabel: '91% Vertical Pop',
      torquePct: '98%',
      torqueLabel: '98% Core Thrust',
      accuracyPct: '85%',
      accuracyLabel: '85% Midsection Target',
      chain: 'Double-foot explosive vertical propulsion → core flexion tuck → rigid patellar spike driving directly through opponent\'s center.'
    },
    'hook-cross': {
      discipline: 'Full Contact Striking',
      name: 'Heavy Hook-Cross Combo',
      speed: '0.50',
      speedUnit: 'sec combo',
      force: '1,100',
      torque: '720',
      burn: '990',
      velocityPct: '90%',
      velocityLabel: '90% Flow Cadence',
      torquePct: '94%',
      torqueLabel: '94% Oblique Power',
      accuracyPct: '94%',
      accuracyLabel: '94% Dual Chin Target',
      chain: 'Rear heel pivot → rotational kinetic transfer through external obliques → lead hook redirection → explosive straight cross finish.'
    }
  };

  const telDiscipline = document.getElementById('telDiscipline');
  const telName = document.getElementById('telName');
  const telSpeed = document.getElementById('telSpeed');
  const telForce = document.getElementById('telForce');
  const telTorque = document.getElementById('telTorque');
  const telBurn = document.getElementById('telBurn');
  const barVelocity = document.getElementById('barVelocity');
  const labelVelocity = document.getElementById('labelVelocity');
  const barTorque = document.getElementById('barTorque');
  const labelTorque = document.getElementById('labelTorque');
  const barAccuracy = document.getElementById('barAccuracy');
  const labelAccuracy = document.getElementById('labelAccuracy');
  const telChain = document.getElementById('telChain');

  function updateTelemetry(key) {
    const data = strikeData[key];
    if (!data) return;

    if (telDiscipline) telDiscipline.textContent = data.discipline;
    if (telName) telName.textContent = data.name;
    if (telSpeed) telSpeed.innerHTML = `${data.speed} <span class="stat-unit">${data.speedUnit}</span>`;
    if (telForce) telForce.innerHTML = `${data.force} <span class="stat-unit">PSI</span>`;
    if (telTorque) telTorque.innerHTML = `${data.torque} <span class="stat-unit">Nm</span>`;
    if (telBurn) telBurn.innerHTML = `${data.burn} <span class="stat-unit">kcal/hr</span>`;

    if (barVelocity) barVelocity.style.width = data.velocityPct;
    if (labelVelocity) labelVelocity.textContent = data.velocityLabel;

    if (barTorque) barTorque.style.width = data.torquePct;
    if (labelTorque) labelTorque.textContent = data.torqueLabel;

    if (barAccuracy) barAccuracy.style.width = data.accuracyPct;
    if (labelAccuracy) labelAccuracy.textContent = data.accuracyLabel;

    if (telChain) telChain.textContent = data.chain;

    telemetryDisplay.classList.remove('telemetry-pulse');
    void telemetryDisplay.offsetWidth;
    telemetryDisplay.classList.add('telemetry-pulse');
    setTimeout(() => {
      telemetryDisplay.classList.remove('telemetry-pulse');
    }, 450);
  }

  strikeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      strikeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const strikeKey = btn.getAttribute('data-strike');
      updateTelemetry(strikeKey);
    });
  });

  if (simulateBtn) {
    simulateBtn.addEventListener('click', () => {
      const activeBtn = document.querySelector('.strike-btn.active');
      const activeKey = activeBtn ? activeBtn.getAttribute('data-strike') : 'blitz-punch';
      
      simulateBtn.disabled = true;
      const originalHTML = simulateBtn.innerHTML;
      simulateBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Calibrating Sensors...</span>`;
      
      setTimeout(() => {
        simulateBtn.disabled = false;
        simulateBtn.innerHTML = originalHTML;
        updateTelemetry(activeKey);
      }, 350);
    });
  }

  // Ensure initial active telemetry is populated accurately
  updateTelemetry('blitz-punch');
}




