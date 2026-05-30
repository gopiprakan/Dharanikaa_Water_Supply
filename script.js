document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // MOBILE NAVIGATION MENU
  // ==========================================
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle mobile menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });


  // ==========================================
  // HEADER SCROLL SHADOW STYLING
  // ==========================================
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  // ==========================================
  // WATER DROPS / PARTICLES ENGINE (HERO)
  // ==========================================
  const particlesContainer = document.getElementById('particles-container');
  const particleCount = 20;

  if (particlesContainer) {
    for (let i = 0; i < particleCount; i++) {
      createParticle();
    }
  }

  function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random sizes, speeds, and positions
    const size = Math.random() * 10 + 5; // 5px to 15px
    const speed = Math.random() * 8 + 4; // 4s to 12s
    const delay = Math.random() * 5;     // 0s to 5s delay
    const left = Math.random() * 100;    // 0% to 100% viewport width
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size * 1.5}px`; // drop ratio
    particle.style.left = `${left}%`;
    particle.style.top = `-${size * 2}px`;
    particle.style.animationDuration = `${speed}s`;
    particle.style.animationDelay = `${delay}s`;
    
    particlesContainer.appendChild(particle);
    
    // Regenerate once completed
    particle.addEventListener('animationiteration', () => {
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 8 + 4}s`;
    });
  }


  // ==========================================
  // COUNTER ANIMATION ENGINE (STATS)
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-item h3');
  
  const animateStats = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'), 10);
      let currentValue = 0;
      const increment = target / 100;
      
      const updateCount = () => {
        if (currentValue < target) {
          currentValue += increment;
          if (currentValue >= target) {
            stat.innerText = formatNumber(target) + (target === 24 ? '' : '+');
          } else {
            stat.innerText = formatNumber(Math.ceil(currentValue)) + '+';
            setTimeout(updateCount, 15);
          }
        } else {
          stat.innerText = formatNumber(target) + (target === 24 ? '' : '+');
        }
      };
      
      updateCount();
    });
  };

  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    return num.toLocaleString();
  }

  // Trigger counters when in viewport
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
  }


  // ==========================================
  // GALLERY FILTER SYSTEM
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });


  // ==========================================
  // LIGHTBOX PORTFOLIO ENGINE
  // ==========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  let currentActiveIndex = 0;
  const visibleGalleryItems = () => Array.from(galleryItems).filter(item => {
    const displayStyle = item.style.display;
    return displayStyle === '' || displayStyle === 'block';
  });

  const openLightbox = (index) => {
    const items = visibleGalleryItems();
    if (index < 0 || index >= items.length) return;
    
    currentActiveIndex = index;
    const item = items[index];
    const imgElement = item.querySelector('img');
    const titleElement = item.querySelector('.gallery-overlay h4');
    
    lightboxImg.src = imgElement.src;
    lightboxCaption.innerText = titleElement.innerText;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore background scroll
  };

  // Add click events to gallery items
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const visibleItems = visibleGalleryItems();
      const currentIdx = visibleItems.indexOf(item);
      openLightbox(currentIdx);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  
  lightboxPrev.addEventListener('click', () => {
    const items = visibleGalleryItems();
    let prevIndex = currentActiveIndex - 1;
    if (prevIndex < 0) prevIndex = items.length - 1;
    openLightbox(prevIndex);
  });

  lightboxNext.addEventListener('click', () => {
    const items = visibleGalleryItems();
    let nextIndex = currentActiveIndex + 1;
    if (nextIndex >= items.length) nextIndex = 0;
    openLightbox(nextIndex);
  });

  // Lightbox click outside closes it
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  // Touch/swipe support for mobile lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        lightboxNext.click(); // Swipe left = next
      } else {
        lightboxPrev.click(); // Swipe right = prev
      }
    }
  }, { passive: true });


  // ==========================================
  // TESTIMONIAL STAR PICKER & LOCAL STORAGE SYSTEM
  // ==========================================
  const starOptions = document.querySelectorAll('.star-option');
  const reviewRatingInput = document.getElementById('review-rating');
  const addReviewForm = document.getElementById('add-review-form');
  const reviewsGrid = document.getElementById('reviews-grid');

  // Handle star selection highlight
  starOptions.forEach(star => {
    star.addEventListener('click', () => {
      const selectedRating = parseInt(star.getAttribute('data-value'), 10);
      reviewRatingInput.value = selectedRating;
      
      starOptions.forEach(s => {
        const val = parseInt(s.getAttribute('data-value'), 10);
        if (val <= selectedRating) {
          s.classList.add('selected');
        } else {
          s.classList.remove('selected');
        }
      });
    });
  });

  // Set default rating representation (5 stars)
  starOptions.forEach(s => s.classList.add('selected'));

  // Handle new testimonial submission
  addReviewForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('reviewer-name').value.trim();
    const role = document.getElementById('reviewer-role').value.trim();
    const text = document.getElementById('review-text').value.trim();
    const rating = parseInt(reviewRatingInput.value, 10);

    // Build star strings
    const starString = '★'.repeat(rating) + '☆'.repeat(5 - rating);

    // Create review card element
    const newCard = document.createElement('div');
    newCard.classList.add('review-card');
    newCard.style.opacity = '0';
    newCard.style.transform = 'translateY(20px)';
    newCard.style.transition = 'all 0.5s ease';

    newCard.innerHTML = `
      <div class="review-stars" style="color: #ffb703; margin-bottom: 16px; font-size: 1.1rem;">${starString}</div>
      <p class="review-content">"${text}"</p>
      <div class="review-author">
        <div class="author-avatar">${name.charAt(0).toUpperCase()}</div>
        <div class="author-info">
          <h4>${name}</h4>
          <p>${role}</p>
        </div>
      </div>
    `;

    // Prepend to list
    reviewsGrid.insertBefore(newCard, reviewsGrid.firstChild);

    // Smooth animation trigger
    setTimeout(() => {
      newCard.style.opacity = '1';
      newCard.style.transform = 'translateY(0)';
    }, 50);

    // Reset Form
    addReviewForm.reset();
    starOptions.forEach(s => s.classList.add('selected'));
    reviewRatingInput.value = 5;

    // Sweet dynamic scroll back to highlight review
    newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });


  // ==========================================
  // WHATSAPP TANKER BOOKING ACTION ENGINE
  // ==========================================
  const bookingForm = document.getElementById('booking-form');

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('booking-name').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const tankerSize = document.getElementById('booking-size').value;
    const address = document.getElementById('booking-address').value.trim();
    const notes = document.getElementById('booking-notes').value.trim();

    // Construct elegant pre-filled message text
    let whatsappText = `*Dharanikaa Water Supply Tanker Request*\n`;
    whatsappText += `-----------------------------------------\n`;
    whatsappText += `*Name:* ${name}\n`;
    whatsappText += `*Phone:* ${phone}\n`;
    whatsappText += `*Tanker Size:* ${tankerSize}\n`;
    whatsappText += `*Address:* ${address}\n`;
    
    if (notes) {
      whatsappText += `*Special Instructions:* ${notes}\n`;
    }
    whatsappText += `-----------------------------------------\n`;
    whatsappText += `Please confirm the booking status and delivery slot!`;

    // Encode text for HTTP URL
    const encodedText = encodeURIComponent(whatsappText);
    const targetWhatsAppUrl = `https://wa.me/919500470171?text=${encodedText}`;

    // Dispatch to WhatsApp
    window.open(targetWhatsAppUrl, '_blank');
  });

});
