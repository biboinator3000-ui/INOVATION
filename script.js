/**
 * FutureTech — Interactive Vanilla JavaScript Engine
 * Features:
 * 1. Interactive Canvas Particle Mesh in Hero
 * 2. Glassmorphic Navigation with Smooth Scroll & Active Indicator
 * 3. Mobile Hamburger Menu Toggle
 * 4. Key Performance Metrics Counter Animation
 * 5. Real-Time Tech Metrics & Interactive Spike Load Simulator
 * 6. 3D Tilt & Cursor Spotlight on Feature Cards
 * 7. Comprehensive Form Validation & Custom Modern Modal Dialog
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Interactive Canvas Particle Animation (Hero Section)
     ========================================================================== */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let width = 0;
    let height = 0;

    // Mouse tracking for particle interaction
    const mouse = {
      x: null,
      y: null,
      radius: 140
    };

    function resizeCanvas() {
      const hero = document.getElementById('hero');
      width = canvas.width = hero ? hero.offsetWidth : window.innerWidth;
      height = canvas.height = hero ? hero.offsetHeight : window.innerHeight;
      initParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.9;
        this.vy = (Math.random() - 0.5) * 0.9;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.4 ? '#00f5ff' : '#7000ff';
        this.alpha = Math.random() * 0.6 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce from walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction: push away gently
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * 3;
            const directionY = forceDirectionY * force * 3;

            this.x -= directionX;
            this.y -= directionY;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }

    function initParticles() {
      particles = [];
      const particleCount = Math.floor((width * height) / 12000);
      const count = Math.max(35, Math.min(particleCount, 95));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const maxDistance = 135;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const opacity = 1 - (dist / maxDistance);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 245, 255, ${opacity * 0.22})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    }

    // Event Listeners for Canvas
    window.addEventListener('resize', debounce(resizeCanvas, 200));

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      } else {
        mouse.x = null;
        mouse.y = null;
      }
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();
    animate();
  }

  /* ==========================================================================
     2. Sticky Glass Navigation & Smooth Active State Tracking
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const mobileToggle = document.getElementById('mobileToggle');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect on navbar
  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // Mobile Menu Toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isActive = mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    // Close menu when any nav link is clicked
    allNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicked outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active Link Highlight based on scroll position
  function highlightActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        allNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', highlightActiveNav, { passive: true });

  /* ==========================================================================
     3. Key Performance Metrics Counter Animation
     ========================================================================== */
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  function runCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic calculation
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = target * easeProgress;

        counter.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
        }
      }

      requestAnimationFrame(update);
    });
  }

  const metricsSection = document.querySelector('.metrics-grid');
  if (metricsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(metricsSection);
  }

  /* ==========================================================================
     4. About Section: Real-Time Tech Metrics & Interactive Simulation
     ========================================================================== */
  const loadBar = document.getElementById('loadBar');
  const loadText = document.getElementById('loadText');
  const bandwidthBar = document.getElementById('bandwidthBar');
  const bandwidthText = document.getElementById('bandwidthText');
  const terminalLogs = document.getElementById('terminalLogs');
  const liveLogTime = document.getElementById('liveLogTime');
  const simulateSpikeBtn = document.getElementById('simulateSpikeBtn');
  const simStatus = document.getElementById('simStatus');

  let isSpiking = false;

  function getFormattedTimestamp() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    return `[${h}:${m}:${s}]`;
  }

  // Periodic subtle fluctuation to simulate live production streaming
  setInterval(() => {
    if (isSpiking) return;

    // Load fluctuates between 72.0% and 78.5%
    const currentLoad = (72 + Math.random() * 6.5).toFixed(1);
    if (loadBar && loadText) {
      loadBar.style.width = `${currentLoad}%`;
      loadText.textContent = `${currentLoad}%`;
    }

    // Bandwidth fluctuates between 8.20 and 8.75 TB/s
    const currentBW = (8.2 + Math.random() * 0.55).toFixed(2);
    if (bandwidthBar && bandwidthText) {
      bandwidthBar.style.width = `${(currentBW / 10) * 100}%`;
      bandwidthText.textContent = `${currentBW} TB/s`;
    }

    if (liveLogTime) {
      liveLogTime.textContent = getFormattedTimestamp();
    }
  }, 2800);

  // Interactive Spike Load Simulation Button
  if (simulateSpikeBtn) {
    simulateSpikeBtn.addEventListener('click', () => {
      if (isSpiking) return;
      isSpiking = true;

      // Spike telemetry metrics
      if (loadBar && loadText) {
        loadBar.style.width = '97.4%';
        loadBar.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
        loadText.textContent = '97.4% (SPIKE)';
        loadText.style.color = '#ef4444';
      }

      if (bandwidthBar && bandwidthText) {
        bandwidthBar.style.width = '98.5%';
        bandwidthText.textContent = '9.85 TB/s';
      }

      if (simStatus) {
        simStatus.textContent = 'Status: Auto-Balancing 240 Edge Pods...';
        simStatus.style.color = '#f59e0b';
      }

      // Add emergency rebalancing log
      if (terminalLogs) {
        const spikeLog = document.createElement('div');
        spikeLog.className = 'log-row';
        spikeLog.innerHTML = `<span class="log-time">${getFormattedTimestamp()}</span> <span class="log-tag tag-sec">WARN</span> Ingress spike detected: 32M ops/s. Re-routing to EU-CENTRAL`;
        terminalLogs.appendChild(spikeLog);
        terminalLogs.scrollTop = terminalLogs.scrollHeight;
      }

      // Reset back to operational normal after 3 seconds
      setTimeout(() => {
        if (loadBar && loadText) {
          loadBar.style.width = '75.2%';
          loadBar.style.background = 'linear-gradient(90deg, #00f5ff, #38bdf8)';
          loadText.textContent = '75.2%';
          loadText.style.color = '';
        }

        if (bandwidthBar && bandwidthText) {
          bandwidthBar.style.width = '84%';
          bandwidthText.textContent = '8.40 TB/s';
        }

        if (simStatus) {
          simStatus.textContent = 'Status: Operational Normal';
          simStatus.style.color = 'var(--accent-emerald)';
        }

        if (terminalLogs) {
          const resolvedLog = document.createElement('div');
          resolvedLog.className = 'log-row active-log';
          resolvedLog.innerHTML = `<span class="log-time">${getFormattedTimestamp()}</span> <span class="log-tag tag-run">AUTO</span> Load absorbed smoothly. Latency maintained &lt; 0.8ms`;
          terminalLogs.appendChild(resolvedLog);
          terminalLogs.scrollTop = terminalLogs.scrollHeight;
        }

        isSpiking = false;
      }, 3200);
    });
  }

  /* ==========================================================================
     5. Features Section: 3D Tilt & Cursor Spotlight Visual Effects
     ========================================================================== */
  const featureCards = document.querySelectorAll('.feature-card[data-tilt]');

  featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update cursor glow position
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Calculate 3D tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  /* ==========================================================================
     6. Contact Section Form Validation & Modern Custom Modal Dialog
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const userNameInput = document.getElementById('userName');
  const userEmailInput = document.getElementById('userEmail');
  const inquiryTypeSelect = document.getElementById('inquiryType');
  const userMessageTextarea = document.getElementById('userMessage');
  const submitBtn = document.getElementById('submitBtn');

  // Error Message Elements
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const categoryError = document.getElementById('categoryError');
  const messageError = document.getElementById('messageError');

  // Groups
  const groupName = document.getElementById('groupName');
  const groupEmail = document.getElementById('groupEmail');
  const groupCategory = document.getElementById('groupCategory');
  const groupMessage = document.getElementById('groupMessage');

  // Modal Elements
  const successModal = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalAcknowledgeBtn = document.getElementById('modalAcknowledgeBtn');
  const modalUserName = document.getElementById('modalUserName');
  const receiptHash = document.getElementById('receiptHash');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function setError(group, errorElem, message) {
    group.classList.add('has-error');
    group.classList.remove('has-success');
    errorElem.textContent = message;
  }

  function clearError(group, errorElem) {
    group.classList.remove('has-error');
    group.classList.add('has-success');
    errorElem.textContent = '';
  }

  // Real-time input clearing on change/input
  userNameInput.addEventListener('input', () => {
    if (userNameInput.value.trim().length >= 2) {
      clearError(groupName, nameError);
    }
  });

  userEmailInput.addEventListener('input', () => {
    if (validateEmail(userEmailInput.value.trim())) {
      clearError(groupEmail, emailError);
    }
  });

  inquiryTypeSelect.addEventListener('change', () => {
    if (inquiryTypeSelect.value !== '') {
      clearError(groupCategory, categoryError);
    }
  });

  userMessageTextarea.addEventListener('input', () => {
    if (userMessageTextarea.value.trim().length >= 10) {
      clearError(groupMessage, messageError);
    }
  });

  // Modal open & close functions
  function openModal(name) {
    modalUserName.textContent = name || 'Architect';

    // Generate pseudo-random cryptographic dispatch hash
    const randomHex = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    receiptHash.textContent = `0x${randomHex}...${Math.floor(Math.random() * 8999 + 1000).toString(16)}`;

    successModal.classList.add('open');
    successModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close or acknowledge button
    setTimeout(() => {
      modalAcknowledgeBtn.focus();
    }, 100);
  }

  function closeModal() {
    successModal.classList.remove('open');
    successModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalAcknowledgeBtn) modalAcknowledgeBtn.addEventListener('click', closeModal);

  // Close modal when clicking backdrop outside card
  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        closeModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('open')) {
      closeModal();
    }
  });

  // Form Submission Handler
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      let firstInvalidInput = null;

      const nameVal = userNameInput.value.trim();
      const emailVal = userEmailInput.value.trim();
      const categoryVal = inquiryTypeSelect.value;
      const messageVal = userMessageTextarea.value.trim();

      // Validate Name
      if (nameVal.length < 2) {
        setError(groupName, nameError, 'Please enter your full name (minimum 2 characters).');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = userNameInput;
      } else {
        clearError(groupName, nameError);
      }

      // Validate Email
      if (!emailVal) {
        setError(groupEmail, emailError, 'Email address is required.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = userEmailInput;
      } else if (!validateEmail(emailVal)) {
        setError(groupEmail, emailError, 'Please enter a valid business email address.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = userEmailInput;
      } else {
        clearError(groupEmail, emailError);
      }

      // Validate Category
      if (!categoryVal) {
        setError(groupCategory, categoryError, 'Please select your desired infrastructure tier.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = inquiryTypeSelect;
      } else {
        clearError(groupCategory, categoryError);
      }

      // Validate Message
      if (messageVal.length < 10) {
        setError(groupMessage, messageError, 'Please provide technical specifications (at least 10 characters).');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = userMessageTextarea;
      } else {
        clearError(groupMessage, messageError);
      }

      if (!isValid) {
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        return;
      }

      // If valid: simulate dispatch with spinner
      submitBtn.classList.add('loading');

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        openModal(nameVal);

        // Reset form
        contactForm.reset();
        [groupName, groupEmail, groupCategory, groupMessage].forEach(grp => {
          grp.classList.remove('has-success', 'has-error');
        });
      }, 700);
    });
  }

  /* ==========================================================================
     7. Footer Current Year Auto-Update
     ========================================================================== */
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Utility Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
});
