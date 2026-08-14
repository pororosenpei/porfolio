/**
 * ============================================================================
 * PORTFOLIO JAVASCRIPT - Charles Eiric N. Melegrito
 * Pure Vanilla JavaScript (No Frameworks)
 * Handles: Theme Toggle & Persistence, Typing Animation, Navigation,
 * Project Filtering, Modal Details, Stats Counter, Scroll Reveal & Form Logic.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all portfolio modules
  initThemeManager();
  initNavbar();
  initTypewriter();
  initScrollReveal();
  initSkillBars();
  initStatsCounter();
  initProjectFiltering();
  initProjectModals();
  initContactForm();
  initCopyButtons();
  initScrollToTop();
});

/* ============================================================================
   1. THEME MANAGER (Dark Mode / Light Mode with LocalStorage & OS Preference)
   ============================================================================ */
function initThemeManager() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  if (!themeToggleBtn || !themeIcon) return;

  const THEME_STORAGE_KEY = 'charles_portfolio_theme';
  
  // 1. Determine initial theme: LocalStorage -> System Preference -> Default Dark
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let currentTheme = 'dark';
  if (savedTheme) {
    currentTheme = savedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    currentTheme = 'light';
  } else {
    currentTheme = 'dark';
  }

  // Apply theme immediately
  applyTheme(currentTheme);

  // 2. Toggle button event listener
  themeToggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    const newTheme = isLight ? 'dark' : 'light';
    
    // Smooth transition rotation on icon
    themeIcon.style.transform = 'rotate(360deg) scale(0.5)';
    setTimeout(() => {
      applyTheme(newTheme);
      themeIcon.style.transform = 'rotate(0deg) scale(1)';
    }, 150);

    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
  });

  // 3. Listen for OS theme changes if user hasn't explicitly saved a preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      themeIcon.className = 'fa-solid fa-moon';
      themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
      themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
    } else {
      document.body.classList.remove('light-mode');
      themeIcon.className = 'fa-solid fa-sun';
      themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
      themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
    }
  }
}

/* ============================================================================
   2. NAVBAR & MOBILE NAVIGATION
   ============================================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuIcon = document.getElementById('mobile-menu-icon');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect for navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveNavLink();
  });

  // Mobile menu toggle
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      if (isOpen) {
        mobileMenuIcon.className = 'fa-solid fa-xmark';
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
      } else {
        mobileMenuIcon.className = 'fa-solid fa-bars';
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        if (mobileMenuIcon) {
          mobileMenuIcon.className = 'fa-solid fa-bars';
        }
      });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        if (mobileMenuIcon) {
          mobileMenuIcon.className = 'fa-solid fa-bars';
        }
      }
    });
  }

  // Active section observer / scroll spy
  function highlightActiveNavLink() {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 80;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          targetLink.classList.add('active');
        }
      }
    });
  }
}

/* ============================================================================
   3. TYPEWRITER EFFECT (Hero Section)
   ============================================================================ */
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter');
  if (!typewriterElement) return;

  // [EDITABLE]: You can customize the phrases here
  const phrases = [
    'Web Developer',
    'IT Student (BSIT)',
    'PHP & MySQL Specialist',
    'Front-End Enthusiast',
    'Creative Problem Solver'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at end of sentence
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ============================================================================
   4. SCROLL REVEAL ANIMATIONS
   ============================================================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ============================================================================
   5. SKILL BARS ANIMATION
   ============================================================================ */
function initSkillBars() {
  const skillSection = document.getElementById('skills');
  if (!skillSection) return;

  const progressBars = document.querySelectorAll('.progress-bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        progressBars.forEach(bar => {
          const targetWidth = bar.getAttribute('data-percent') || '0%';
          bar.style.width = targetWidth;
        });
      }
    });
  }, { threshold: 0.2 });

  observer.observe(skillSection);
}

/* ============================================================================
   6. STATS COUNTER ANIMATION
   ============================================================================ */
function initStatsCounter() {
  const statsElements = document.querySelectorAll('.stat-count');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statsElements.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
          const duration = 1800; // ms
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent = target;
              clearInterval(timer);
            } else {
              stat.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const aboutSection = document.getElementById('about');
  if (aboutSection) observer.observe(aboutSection);
}

/* ============================================================================
   7. PROJECT FILTERING
   ============================================================================ */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 250);
        }
      });
    });
  });
}

/* ============================================================================
   8. PROJECT DETAILS MODAL
   ============================================================================ */
const projectData = {
  wastewise: {
    title: 'WasteWise E-Commerce Platform',
    category: 'PHP & MySQL Full-Stack',
    duration: '2024 - 2026',
    description: 'A comprehensive web-based e-commerce platform designed for recycled, upcycled, and eco-friendly products. Built to empower sustainable consumerism with full seller-to-buyer transaction handling.',
    features: [
      'Interactive shopping cart, multi-stage checkout, and digital invoice generation',
      'Role-based User Authentication for Buyers, Sellers, and Platform Admins',
      'Seller-Buyer direct messaging & inquiry communication channels',
      'Real-time order tracking with status updates (Pending, Processing, Delivered)',
      'Product catalog browsing with category filters, search, and stock management',
      'Secure MySQL database backend managed via XAMPP with normalized tables'
    ],
    tech: ['PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'XAMPP', 'Apache'],
    demoUrl: '#',
    codeUrl: 'https://github.com/charlesmelegrito'
  },
  portfolio: {
    title: 'Modern Personal Portfolio',
    category: 'Frontend & UI/UX',
    duration: '2026',
    description: 'A responsive, high-performance personal developer portfolio built strictly using vanilla web technologies. Designed with glassmorphism aesthetics, neon accent glows, and smooth transitions.',
    features: [
      'Seamless Dark & Light mode theme toggle with LocalStorage persistence',
      'Automatic operating system color-scheme detection',
      'Dynamic interactive typewriter effect in hero header',
      'Categorized project filtering with animated grid states',
      'Interactive skill progress bars and live animated counters',
      'Zero-framework dependency footprint ensuring ultra-fast load times'
    ],
    tech: ['HTML5', 'CSS3', 'Vanilla JavaScript (ES6+)', 'CSS Variables', 'Font Awesome', 'LocalStorage'],
    demoUrl: '#',
    codeUrl: 'https://github.com/charlesmelegrito'
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-project-title');
  const modalCategory = document.getElementById('modal-project-category');
  const modalDuration = document.getElementById('modal-project-duration');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalFeaturesList = document.getElementById('modal-project-features');
  const modalTechStack = document.getElementById('modal-project-tech');
  const modalDemoBtn = document.getElementById('modal-demo-btn');
  const modalCodeBtn = document.getElementById('modal-code-btn');

  // Open modal buttons
  const viewDetailsBtns = document.querySelectorAll('[data-project-id]');

  viewDetailsBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project-id');
      const data = projectData[projectId];

      if (!data || !modalOverlay) return;

      modalTitle.textContent = data.title;
      modalCategory.textContent = data.category;
      modalDuration.textContent = data.duration;
      modalDesc.textContent = data.description;

      // Populate features
      modalFeaturesList.innerHTML = '';
      data.features.forEach(feat => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${feat}`;
        modalFeaturesList.appendChild(li);
      });

      // Populate tech stack
      modalTechStack.innerHTML = '';
      data.tech.forEach(t => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = t;
        modalTechStack.appendChild(span);
      });

      // Update button links
      if (modalDemoBtn) modalDemoBtn.href = data.demoUrl;
      if (modalCodeBtn) modalCodeBtn.href = data.codeUrl;

      // Show modal
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Resume Modal Handling
  const resumeBtn = document.getElementById('resume-btn');
  const resumeModal = document.getElementById('resume-modal');
  const resumeModalClose = document.getElementById('resume-modal-close');

  if (resumeBtn && resumeModal) {
    resumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resumeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (resumeModalClose && resumeModal) {
    resumeModalClose.addEventListener('click', () => {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
    });
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    if (resumeModal) {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

/* ============================================================================
   9. CONTACT FORM (Validation & Interactive Feedback)
   ============================================================================ */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (!contactForm || !formStatus || !submitBtn) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    // Validation
    if (!name || !email || !subject || !message) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Button loading animation
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';
    submitBtn.disabled = true;

    // Simulate sending (Client-side feedback)
    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
      showStatus(`Thank you, ${name}! Your message has been prepared. You can also reach Charles directly at charlesmelegrito@gmail.com.`, 'success');
      contactForm.reset();
      showToast('Message sent successfully!');

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 3500);
    }, 1000);
  });

  function showStatus(text, type) {
    formStatus.textContent = '';
    formStatus.className = `form-status ${type}`;
    formStatus.innerHTML = type === 'success' 
      ? `<i class="fa-solid fa-circle-check"></i> ${text}`
      : `<i class="fa-solid fa-triangle-exclamation"></i> ${text}`;
    formStatus.style.display = 'flex';
  }
}

/* ============================================================================
   10. COPY TO CLIPBOARD & TOAST NOTIFICATIONS
   ============================================================================ */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: "${textToCopy}"`);
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = 'fa-solid fa-check';
          setTimeout(() => {
            icon.className = 'fa-regular fa-copy';
          }, 2000);
        }
      }).catch(() => {
        showToast('Copied: ' + textToCopy);
      });
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>${message}</span>`;
  toast.classList.add('show');

  clearTimeout(toast.timeoutId);
  toast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ============================================================================
   11. SCROLL TO TOP BUTTON
   ============================================================================ */
function initScrollToTop() {
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (!scrollToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
