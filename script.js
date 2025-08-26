document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuButton = document.querySelector('[data-mobile-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a[href]') : [];
  let firstFocusableElement = null;
  let lastFocusableElement = null;


  if (mobileMenuButton && mobileMenu) {
    const toggleMenu = () => {
      const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
      mobileMenuButton.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('hidden');
      document.body.classList.toggle('overflow-hidden');

      if (!expanded) {
        // Focus Trap implementation
        firstFocusableElement = mobileMenuLinks.length > 0 ? mobileMenuLinks[0] : mobileMenuButton;
        lastFocusableElement = mobileMenuLinks.length > 0 ? mobileMenuLinks[mobileMenuLinks.length - 1] : mobileMenuButton;

        if (firstFocusableElement) {
          firstFocusableElement.focus();
        }
        document.addEventListener('keydown', trapFocus);

      } else {
        document.removeEventListener('keydown', trapFocus);
        mobileMenuButton.focus();
      }
    };

    const trapFocus = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }

      if (e.key === 'Escape') {
        toggleMenu();
      }
    };

    mobileMenuButton.addEventListener('click', toggleMenu);

    // Close menu on outside click
    document.addEventListener('click', (event) => {
      if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target) && mobileMenuButton.getAttribute('aria-expanded') === 'true') {
        toggleMenu();
      }
    });


  }

  // Smooth Scroll and Back to Top
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  const backToTopButton = document.querySelector('[data-back-to-top]');

  scrollLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });

        // Update URL hash without triggering navigation
        history.pushState(null, null, targetId);
      }
    });
  });

  if (backToTopButton) {
    backToTopButton.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.remove('hidden');
      } else {
        backToTopButton.classList.add('hidden');
      }
    });
  }

  // Testimonial Slider
  const testimonialSlider = document.querySelector('[data-testimonial-slider]');

  if (testimonialSlider) {
    const slides = testimonialSlider.querySelectorAll('[data-testimonial-slide]');
    const prevButton = testimonialSlider.querySelector('[data-testimonial-prev]');
    const nextButton = testimonialSlider.querySelector('[data-testimonial-next]');
    let currentSlide = 0;
    let intervalId;

    const showSlide = (index) => {
      slides.forEach(slide => slide.classList.add('hidden'));
      slides[index].classList.remove('hidden');
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    };

    const startAutoAdvance = () => {
      intervalId = setInterval(nextSlide, 5000);
    };

    const stopAutoAdvance = () => {
      clearInterval(intervalId);
    };

    if (slides.length > 0) {
      showSlide(currentSlide);
      startAutoAdvance();

      testimonialSlider.addEventListener('mouseenter', stopAutoAdvance);
      testimonialSlider.addEventListener('mouseleave', startAutoAdvance);

      if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
          stopAutoAdvance();
          prevSlide();
          startAutoAdvance();
        });
        nextButton.addEventListener('click', () => {
          stopAutoAdvance();
          nextSlide();
          startAutoAdvance();
        });
      }
    } else {
      console.warn('No testimonial slides found.');
    }
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('[data-faq-item]');

  faqItems.forEach(item => {
    const header = item.querySelector('[data-faq-header]');
    const content = item.querySelector('[data-faq-content]');

    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      faqItems.forEach(otherItem => {
        const otherHeader = otherItem.querySelector('[data-faq-header]');
        const otherContent = otherItem.querySelector('[data-faq-content]');

        if (otherItem !== item) {
          otherHeader.setAttribute('aria-expanded', 'false');
          otherContent.classList.add('hidden');
        }
      });

      header.setAttribute('aria-expanded', !isExpanded);
      content.classList.toggle('hidden');
    });
  });

  // Email Capture Validation
  const emailForm = document.querySelector('[data-email-form]');
  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = emailForm.querySelector('[data-email-input]');
      const email = emailInput.value;

      if (isValidEmail(email)) {
        console.log('Email submitted:', email);
        emailInput.value = ''; // Clear the input after submission
      } else {
        alert('Please enter a valid email address.');
      }
    });

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  }


  // UTM-aware CTA Click Logging
  const ctaButtons = document.querySelectorAll('[data-cta-button]');

  ctaButtons.forEach(button => {
    button.addEventListener('click', () => {
      const utmParams = {};
      const urlParams = new URLSearchParams(window.location.search);
      for (const [key, value] of urlParams) {
        if (key.startsWith('utm_')) {
          utmParams[key] = value;
        }
      }

      console.log('CTA Clicked:', {
        buttonText: button.textContent,
        utmParams: utmParams
      });
    });
  });
});