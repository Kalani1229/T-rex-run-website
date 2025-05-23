// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // Force scroll to top on page load/refresh when in banner section
  ensureTopPositionOnRefresh();
  
  // Initialize animations
  initAnimations();
  
  // Add event listeners
  addEventListeners();
  
  // Setup smooth section scrolling (only on desktop)
  if (window.innerWidth > 768) {
    setupSmoothSectionScroll();
  }
  
  // Setup mobile menu
  setupMobileMenu();
  
  // Check for window resize to enable/disable smooth scrolling
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      // Only setup if it's not already set up
      if (!window.smoothScrollInitialized) {
        setupSmoothSectionScroll();
        window.smoothScrollInitialized = true;
      }
    } else {
      // Disable smooth scrolling on mobile
      window.smoothScrollInitialized = false;
      // Remove wheel event listeners
      window.removeEventListener('wheel', wheelHandler, { passive: false });
      window.removeEventListener('touchstart', touchStartHandler, { passive: true });
      window.removeEventListener('touchmove', touchMoveHandler, { passive: false });
      window.removeEventListener('touchend', touchEndHandler, { passive: true });
      window.removeEventListener('keydown', keyDownHandler);
    }
  });
});

// Global event handler references
let wheelHandler, touchStartHandler, touchMoveHandler, touchEndHandler, keyDownHandler;

// Setup mobile menu functionality
function setupMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-menu a');
  
  if (menuBtn && mobileMenu) {
    // Toggle menu on button click
    menuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      
      // Animate hamburger to X
      const spans = menuBtn.querySelectorAll('span');
      spans.forEach(span => span.classList.toggle('active'));
    });
    
    // Close menu when a link is clicked
    menuLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Reset hamburger animation
        const spans = menuBtn.querySelectorAll('span');
        spans.forEach(span => span.classList.remove('active'));
      });
    });
  }
}

// Ensure page starts at top when refreshed in banner section
function ensureTopPositionOnRefresh() {
  // Get all sections to find where we are
  const sections = document.querySelectorAll('.banner, .video-section, .rules-section, .costume-section, .contact');
  const scrollPosition = window.scrollY + (window.innerHeight / 3);
  
  // Check if we're in the banner section
  if (sections[0] && sections[0].classList.contains('banner')) {
    const bannerTop = sections[0].offsetTop;
    const bannerBottom = bannerTop + sections[0].offsetHeight;
    
    if (scrollPosition >= bannerTop && scrollPosition < bannerBottom) {
      // We're in the banner section, force scroll to absolute top
      window.scrollTo({
        top: 0,
        behavior: 'auto' // Use 'auto' to avoid animation on page load
      });
    }
  }
  
  // Always force scroll to top on initial page load - handles direct page loads
  if (window.scrollY < 300) {
    window.scrollTo(0, 0);
  }
}

// Setup smooth section scrolling
function setupSmoothSectionScroll() {
  const sections = document.querySelectorAll('.banner, .video-section, .rules-section, .costume-section, .contact');
  let isScrolling = false;
  let startY;
  let currentSectionIndex = 0;
  
  // Set flag to indicate smooth scrolling is initialized
  window.smoothScrollInitialized = true;
  
  // Get initial active section on page load
  updateCurrentSectionIndex();
  
  // Update which section we're currently viewing
  function updateCurrentSectionIndex() {
    const scrollPosition = window.scrollY + (window.innerHeight / 2);
    
    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSectionIndex = index;
      }
    });
  }
  
  // Scroll to a specific section
  function scrollToSection(index) {
    if (index < 0) index = 0;
    if (index >= sections.length) index = sections.length - 1;
    
    isScrolling = true;
    
    // Get navbar height for offset calculations
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    
    // Apply different offsets based on section
    let offsetY = 0;
    
    // Set custom offsets for each section type
    if (index === 0) {
      // Banner section - always scroll to absolute top
      gsap.to(window, {
        duration: 0.5,
        scrollTo: {
          y: 0
        },
        ease: 'power2.inOut',
        onComplete: function() {
          isScrolling = false;
        }
      });
      return; // Exit early for banner section
    } else if (sections[index].classList.contains('video-section')) {
      // Video section offset
      offsetY = navbarHeight - 100;
    } else if (sections[index].classList.contains('rules-section')) {
      // Rules section offset
      offsetY = navbarHeight - 20;
    } else if (sections[index].classList.contains('costume-section')) {
      // Costume section offset
      offsetY = navbarHeight - 60;
    } else if (sections[index].classList.contains('contact')) {
      // Contact section offset
      offsetY = navbarHeight - 30;
    } else {
      // Default for any other sections
      offsetY = navbarHeight;
    }
    
    gsap.to(window, {
      duration: 0.7,
      scrollTo: {
        y: sections[index],
        offsetY: offsetY
      },
      ease: 'power2.inOut',
      onComplete: function() {
        isScrolling = false;
      }
    });
  }
  
  // Handle wheel events for smooth scroll
  wheelHandler = function(event) {
    // Don't prevent default if mobile menu is open
    if (document.body.classList.contains('menu-open')) return;
    
    event.preventDefault();
    
    if (isScrolling) return;
    
    const scrollDirection = event.deltaY > 0 ? 1 : -1;
    updateCurrentSectionIndex();
    
    scrollToSection(currentSectionIndex + scrollDirection);
  };
  
  // Add wheel event listener
  window.addEventListener('wheel', wheelHandler, { passive: false }); // Note: passive false is required to preventDefault
  
  // Handle touch events for mobile devices
  touchStartHandler = function(event) {
    // Don't track touch if mobile menu is open
    if (document.body.classList.contains('menu-open')) return;
    
    startY = event.touches[0].clientY;
  };
  
  touchMoveHandler = function(event) {
    // Don't prevent default if mobile menu is open
    if (document.body.classList.contains('menu-open')) return;
    
    if (isScrolling) {
      event.preventDefault();
      return;
    }
  };
  
  touchEndHandler = function(event) {
    // Don't process touch end if mobile menu is open
    if (document.body.classList.contains('menu-open')) return;
    
    if (isScrolling) return;
    
    const endY = event.changedTouches[0].clientY;
    const diffY = endY - startY;
    
    // If the swipe distance is significant enough
    if (Math.abs(diffY) > 50) {
      updateCurrentSectionIndex();
      
      // Scroll down if swipe is up, scroll up if swipe is down
      const scrollDirection = diffY < 0 ? 1 : -1;
      scrollToSection(currentSectionIndex + scrollDirection);
    }
  };
  
  // Add touch event listeners
  window.addEventListener('touchstart', touchStartHandler, { passive: true });
  window.addEventListener('touchmove', touchMoveHandler, { passive: false });
  window.addEventListener('touchend', touchEndHandler, { passive: true });
  
  // Handle keyboard navigation
  keyDownHandler = function(event) {
    // Don't process keyboard if mobile menu is open
    if (document.body.classList.contains('menu-open')) return;
    
    if (isScrolling) return;
    
    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      updateCurrentSectionIndex();
      scrollToSection(currentSectionIndex + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      updateCurrentSectionIndex();
      scrollToSection(currentSectionIndex - 1);
    }
  };
  
  // Add keyboard event listener
  window.addEventListener('keydown', keyDownHandler);
}

// Main animation initialization
function initAnimations() {
  // Header animations
  animateHeader();
  
  // Banner animations
  animateBanner();
  
  // Video section animations
  animateVideoSection();
  
  // Rules section animations
  animateRulesSection();
  
  // Costume section animations
  animateCostumeSection();

  // Initialize scroll animations
  initScrollAnimations();
}

// Header animations
function animateHeader() {
  // We'll animate navbar in banner animation sequence
  
  gsap.from('.nav-links li', {
    opacity: 0,
    y: -20,
    stagger: 0.07,
    duration: 0.56,
    ease: 'power2.out',
    delay: 1.05
  });
  
  gsap.from('.btn-contact-us', {
    scale: 0.8,
    opacity: 0,
    duration: 0.42,
    ease: 'back.out(1.7)',
    delay: 1.26
  });
}

// Banner animations
function animateBanner() {
  // First timeline: navbar + 恐龍賽跑大賽
  const firstTimeline = gsap.timeline();
  
  firstTimeline
    .from('.navbar', {
      y: -50,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out'
    })
    .from('.banner-text_2 h1', {
      y: 50,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out'
    }, '<'); // Make them appear simultaneously
  
  // Second timeline: 清交第一屆 + 釋放你心中的恐龍
  const secondTimeline = gsap.timeline({
    delay: 0.4
  });
  
  secondTimeline
    .from('.banner-text_1 h1', {
      y: 50,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out'
    })
    .from('.banner h2', {
      y: 30,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, '<'); // Make them appear simultaneously
  
  // Final animation: 現在報名 button
  secondTimeline.from('.btn-register', {
    scale: 0,
    opacity: 0,
    duration: 0.3,
    ease: 'back.out(1.7)',
    delay: 0.3
  });
}

// Video section animations
function animateVideoSection() {
  const videoSection = document.querySelector('.video-section');
  
  // Create a scroll trigger for the video section
  ScrollTrigger.create({
    trigger: videoSection,
    start: 'top 80%',
    onEnter: () => {
      gsap.timeline()
        .from('.text-container h1', {
          x: -100,
          opacity: 0,
          duration: 0.56,
          ease: 'power2.out'
        })
        .from('.highlight-text', {
          backgroundColor: 'transparent',
          duration: 0.28,
          ease: 'power1.inOut'
        }, '-=0.14')
        .from('.text-container p', {
          y: 20,
          opacity: 0,
          duration: 0.42,
          ease: 'power2.out'
        }, '-=0.28')
        .from('.overlap', {
          x: 100,
          opacity: 0,
          rotation: 10,
          duration: 0.7,
          ease: 'power2.out'
        }, '-=0.42')
        .from('.video-container', {
          y: 50,
          opacity: 0,
          duration: 0.56,
          ease: 'power2.out'
        }, '-=0.28');
    },
    once: true
  });
}

// Rules section animations
function animateRulesSection() {
  const rulesSection = document.querySelector('.rules-section');
  
  // Create a scroll trigger for the rules section
  ScrollTrigger.create({
    trigger: rulesSection,
    start: 'top 75%',
    onEnter: () => {
      gsap.timeline()
        .from('.rules-title h2', {
          y: -30,
          opacity: 0,
          duration: 0.56,
          ease: 'power2.out'
        })
        .from('.rules-title .highlighted', {
          backgroundColor: 'transparent',
          duration: 0.28,
          ease: 'power1.inOut'
        }, '-=0.28')
        .from('.rules-subtitle', {
          y: 20,
          opacity: 0,
          duration: 0.42,
          ease: 'power2.out'
        }, '-=0.14')
        .from('.rule-box', {
          y: 60,
          opacity: 0,
          stagger: 0.14,
          duration: 0.56,
          ease: 'back.out(1.4)'
        }, '-=0.14')
        .from('.rules-cta', {
          y: 40,
          opacity: 0,
          duration: 0.56,
          ease: 'power2.out'
        }, '-=0.14');
    },
    once: true
  });
  
  // Hover animations for rule boxes
  const ruleBoxes = document.querySelectorAll('.rule-box');
  ruleBoxes.forEach(box => {
    box.addEventListener('mouseenter', () => {
      gsap.to(box.querySelector('img'), {
        y: -5,
        scale: 1.05,
        duration: 0.21,
        ease: 'power2.out'
      });
    });
    
    box.addEventListener('mouseleave', () => {
      gsap.to(box.querySelector('img'), {
        y: 0,
        scale: 1,
        duration: 0.21,
        ease: 'power2.out'
      });
    });
  });
}

// Costume section animations
function animateCostumeSection() {
  const costumeSection = document.querySelector('.costume-section');
  
  // Create a scroll trigger for the costume section
  ScrollTrigger.create({
    trigger: costumeSection,
    start: 'top 75%',
    onEnter: () => {
      gsap.timeline()
        .from('.costume-title h2', {
          y: -30,
          opacity: 0,
          duration: 0.56,
          ease: 'power2.out'
        })
        .from('.costume-subtitle', {
          y: 20,
          opacity: 0,
          duration: 0.42,
          ease: 'power2.out'
        }, '-=0.28')
        .from('.costume-subtitle .highlight-text', {
          backgroundColor: 'transparent',
          duration: 0.28,
          ease: 'power1.inOut'
        }, '-=0.21')
        .from('.option-column', {
          y: 60,
          opacity: 0,
          stagger: 0.105,
          duration: 0.56,
          ease: 'back.out(1.4)'
        }, '-=0.14')
        .from('.checkmark', {
          scale: 0,
          stagger: 0.035,
          duration: 0.28,
          ease: 'back.out(2)'
        }, '-=0.28');
    },
    once: true
  });
  
  // Highlight effect for the center column
  gsap.to('.option-column.highlighted', {
    boxShadow: '0 5px 25px rgba(67, 215, 255, 0.5)',
    repeat: -1,
    yoyo: true,
    duration: 1.05,
    ease: 'sine.inOut'
  });
}

// Initialize scroll-based animations
function initScrollAnimations() {
  // Parallax effect for background elements
  gsap.to('.banner', {
    backgroundPosition: '50% 30%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.banner',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
  
  // Add a subtle parallax to other elements
  const sections = document.querySelectorAll('section:not(.banner)');
  sections.forEach(section => {
    const elements = section.querySelectorAll('img, h2, .highlight-text');
    elements.forEach(element => {
      gsap.to(element, {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  });
}

// Add event listeners for various interactions
function addEventListeners() {
  // Registration button
  const registerBtn = document.querySelector('.btn-register');
  if (registerBtn) {
    registerBtn.addEventListener('click', function() {
      gsap.to(this, {
        scale: 0.95,
        duration: 0.1,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: 1
      });
      
    });
  }
  
  // Rules button
  const rulesBtn = document.querySelector('.btn-rules');
  if (rulesBtn) {
    rulesBtn.addEventListener('click', function() {
      gsap.to(this, {
        scale: 0.95,
        duration: 0.1,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: 1
      });
      
      // Here you would typically redirect to rules page
      // window.location.href = 'rules.html';
      alert('完整規則頁面即將上線！');
    });
  }
  
  // Add smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Only prevent default if it's a hash link
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          gsap.to(window, {
            duration: 1,
            scrollTo: {
              y: targetSection,
              offsetY: 80
            },
            ease: 'power2.inOut'
          });
        }
      }
    });
  });
  
  // Dinosaur animation easter egg
  const dinosaurs = document.querySelectorAll('.rule-box-image img, .overlap');
  dinosaurs.forEach(dino => {
    let clickCount = 0;
    dino.addEventListener('click', function() {
      clickCount++;
      
      if (clickCount >= 3) {
        // Easter egg animation!
        gsap.timeline()
          .to(this, {
            rotation: 360,
            scale: 1.2,
            duration: 0.8,
            ease: 'back.out(1.7)'
          })
          .to(this, {
            rotation: 720,
            scale: 1,
            duration: 0.8,
            ease: 'back.inOut(1.7)'
          });
        
        clickCount = 0;
      } else {
        // Simple animation
        gsap.to(this, {
          rotation: 10,
          duration: 0.2,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: 1
        });
      }
    });
  });
}
