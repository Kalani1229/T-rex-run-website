// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // Initialize animations
  initAnimations();
  
  // Add event listeners
  addEventListeners();
  
  // Setup smooth section scrolling
  setupSmoothSectionScroll();
});

// Setup smooth section scrolling
function setupSmoothSectionScroll() {
  const sections = document.querySelectorAll('.banner, .video-section, .rules-section, .costume-section, .contact');
  let isScrolling = false;
  let startY;
  let currentSectionIndex = 0;
  
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
    
    // Special handling for the first section to account for its margin-top
    if (index === 0) {
      offsetY = 0;
    } else if (sections[index].classList.contains('costume-section')) {
      // Special offset for costume section
      offsetY = navbarHeight - 60; // Adding extra 30px offset
    } else {
      // For other sections, account for navbar
      offsetY = navbarHeight;
    }
    
    gsap.to(window, {
      duration: 1,
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
  window.addEventListener('wheel', function(event) {
    event.preventDefault();
    
    if (isScrolling) return;
    
    const scrollDirection = event.deltaY > 0 ? 1 : -1;
    updateCurrentSectionIndex();
    
    scrollToSection(currentSectionIndex + scrollDirection);
  }, { passive: false }); // Note: passive false is required to preventDefault
  
  // Handle touch events for mobile devices
  window.addEventListener('touchstart', function(event) {
    startY = event.touches[0].clientY;
  }, { passive: true });
  
  window.addEventListener('touchmove', function(event) {
    if (isScrolling) {
      event.preventDefault();
      return;
    }
  }, { passive: false });
  
  window.addEventListener('touchend', function(event) {
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
  }, { passive: true });
  
  // Handle keyboard navigation
  window.addEventListener('keydown', function(event) {
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
  });
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
  gsap.from('.navbar', {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });
  
  gsap.from('.nav-links li', {
    opacity: 0,
    y: -20,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power2.out',
    delay: 0.5
  });
  
  gsap.from('.btn-contact-us', {
    scale: 0.8,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.7)',
    delay: 0.8
  });
}

// Banner animations
function animateBanner() {
  const bannerTimeline = gsap.timeline();
  
  bannerTimeline
    .from('.banner-text_1 h1', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
    .from('.banner-text_2', {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.2')
    .from('.banner h2', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.3')
    .from('.btn-register', {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)'
    }, '-=0.2');
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
          duration: 0.8,
          ease: 'power2.out'
        })
        .from('.highlight-text', {
          backgroundColor: 'transparent',
          duration: 0.4,
          ease: 'power1.inOut'
        }, '-=0.2')
        .from('.text-container p', {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.4')
        .from('.overlap', {
          x: 100,
          opacity: 0,
          rotation: 10,
          duration: 1,
          ease: 'power2.out'
        }, '-=0.6')
        .from('.video-container', {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.4');
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
          duration: 0.8,
          ease: 'power2.out'
        })
        .from('.rules-title .highlighted', {
          backgroundColor: 'transparent',
          duration: 0.4,
          ease: 'power1.inOut'
        }, '-=0.4')
        .from('.rules-subtitle', {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.2')
        .from('.rule-box', {
          y: 60,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: 'back.out(1.4)'
        }, '-=0.2')
        .from('.rules-cta', {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.2');
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
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    box.addEventListener('mouseleave', () => {
      gsap.to(box.querySelector('img'), {
        y: 0,
        scale: 1,
        duration: 0.3,
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
          duration: 0.8,
          ease: 'power2.out'
        })
        .from('.costume-subtitle', {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.4')
        .from('.costume-subtitle .highlight-text', {
          backgroundColor: 'transparent',
          duration: 0.4,
          ease: 'power1.inOut'
        }, '-=0.3')
        .from('.option-column', {
          y: 60,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'back.out(1.4)'
        }, '-=0.2')
        .from('.checkmark', {
          scale: 0,
          stagger: 0.05,
          duration: 0.4,
          ease: 'back.out(2)'
        }, '-=0.4');
    },
    once: true
  });
  
  // Highlight effect for the center column
  gsap.to('.option-column.highlighted', {
    boxShadow: '0 5px 25px rgba(67, 215, 255, 0.5)',
    repeat: -1,
    yoyo: true,
    duration: 1.5,
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
      
      // Here you would typically redirect to registration page
      // window.location.href = 'registration.html';
      alert('註冊頁面即將上線！');
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
