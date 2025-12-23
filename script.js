'use strict';

/**
 * add event on element
 */
const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}

/**
 * navbar toggle
 */
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-open");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("nav-open");
}

addEventOnElem(navbarLinks, "click", closeNavbar);

// Close navbar when clicking on overlay
overlay.addEventListener("click", closeNavbar);

/**
 * Product cart functionality
 */
const cartButtons = document.querySelectorAll(".header-action-btn[aria-label='cart item'], .action-btn[aria-label='add to cart']");
const cartBadge = document.querySelector(".header-action-btn[aria-label='cart item'] .btn-badge");
const cartText = document.querySelector(".header-action-btn[aria-label='cart item'] .btn-text");
let cartCount = 0;
let cartTotal = 0;

const updateCart = function () {
  if (cartBadge) {
    cartBadge.textContent = cartCount;
  }
  if (cartText) {
    cartText.textContent = `${cartTotal.toFixed(2)}Birr`;
    cartText.setAttribute("value", cartTotal);
  }
}

cartButtons.forEach(button => {
  button.addEventListener("click", function (e) {
    e.stopPropagation();

    if (this.closest('.shop-card')) {
      // Product card add to cart
      const productCard = this.closest('.shop-card');
      const priceElement = productCard.querySelector('.price .span');
      const productName = productCard.querySelector('.card-title').textContent;

      if (priceElement) {
        const priceText = priceElement.textContent.replace('Birr', '').trim();
        const price = parseFloat(priceText);

        if (!isNaN(price)) {
          cartCount++;
          cartTotal += price;

          // Show feedback animation
          const feedback = document.createElement('div');
          feedback.className = 'cart-feedback';
          feedback.textContent = 'Added to cart!';
          feedback.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: var(--blue);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 9999;
            animation: slideDown 0.3s ease-out;
          `;

          document.body.appendChild(feedback);

          // Remove feedback after animation
          setTimeout(() => {
            feedback.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => feedback.remove(), 300);
          }, 2000);

          updateCart();

          // Button animation
          const icon = this.querySelector('ion-icon');
          if (icon) {
            icon.style.transform = 'scale(1.5)';
            setTimeout(() => {
              icon.style.transform = 'scale(1)';
            }, 300);
          }
        }
      }
    }
  });
});

/**
 * Wishlist functionality
 */
const wishlistButtons = document.querySelectorAll(".header-action-btn[aria-label='favourite item'], .action-btn[aria-label='add to whishlist']");
const wishlistBadge = document.querySelector(".header-action-btn[aria-label='favourite item'] .btn-badge");
let wishlistCount = 0;

wishlistButtons.forEach(button => {
  button.addEventListener("click", function (e) {
    e.stopPropagation();

    if (this.closest('.shop-card')) {
      const icon = this.querySelector('ion-icon');
      const isActive = this.classList.contains('active');

      if (isActive) {
        this.classList.remove('active');
        wishlistCount--;
        if (icon) icon.style.color = '';
      } else {
        this.classList.add('active');
        wishlistCount++;
        if (icon) {
          icon.style.color = 'var(--blue)';
          icon.style.transform = 'scale(1.3)';
          setTimeout(() => {
            icon.style.transform = 'scale(1)';
          }, 300);
        }

        // Show feedback
        const feedback = document.createElement('div');
        feedback.className = 'wishlist-feedback';
        feedback.textContent = 'Added to wishlist!';
        feedback.style.cssText = `
          position: fixed;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          background: var(--hoockers-green);
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          z-index: 9999;
          animation: slideDown 0.3s ease-out;
        `;

        document.body.appendChild(feedback);
        setTimeout(() => {
          feedback.style.animation = 'fadeOut 0.3s ease-out';
          setTimeout(() => feedback.remove(), 300);
        }, 2000);
      }

      if (wishlistBadge) {
        wishlistBadge.textContent = wishlistCount;
      }
    }
  });
});

/**
 * Hero slider functionality
 */
const heroSlider = document.querySelector('.hero .has-scrollbar');
if (heroSlider) {
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;
  let currentIndex = 0;

  heroSlider.addEventListener('mousedown', dragStart);
  heroSlider.addEventListener('touchstart', dragStart);
  heroSlider.addEventListener('mouseup', dragEnd);
  heroSlider.addEventListener('touchend', dragEnd);
  heroSlider.addEventListener('mousemove', drag);
  heroSlider.addEventListener('touchmove', drag);

  // Auto slide
  let autoSlideInterval = setInterval(nextSlide, 5000);

  function dragStart(e) {
    if (e.type === 'touchstart') {
      startPos = e.touches[0].clientX;
    } else {
      startPos = e.clientX;
    }
    isDragging = true;

    // Cancel auto slide during interaction
    clearInterval(autoSlideInterval);

    animationID = requestAnimationFrame(animation);
    heroSlider.classList.add('grabbing');
  }

  function drag(e) {
    if (!isDragging) return;

    e.preventDefault();
    let currentPosition;
    if (e.type === 'touchmove') {
      currentPosition = e.touches[0].clientX;
    } else {
      currentPosition = e.clientX;
    }

    currentTranslate = prevTranslate + currentPosition - startPos;
  }

  function dragEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && currentIndex < heroSlider.children.length - 1) {
      currentIndex++;
    }

    if (movedBy > 100 && currentIndex > 0) {
      currentIndex--;
    }

    setPositionByIndex();
    heroSlider.classList.remove('grabbing');

    // Restart auto slide
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
  }

  function setSliderPosition() {
    heroSlider.style.transform = `translateX(${currentTranslate}px)`;
  }

  function setPositionByIndex() {
    currentTranslate = currentIndex * -window.innerWidth;
    prevTranslate = currentTranslate;
    setSliderPosition();

    // Update indicators
    updateSlideIndicators();
  }

  function nextSlide() {
    if (currentIndex < heroSlider.children.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    setPositionByIndex();
  }

  // Add indicators
  function createIndicators() {
    const indicatorContainer = document.createElement('div');
    indicatorContainer.className = 'slide-indicators';
    indicatorContainer.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 20px;
    `;

    for (let i = 0; i < heroSlider.children.length; i++) {
      const indicator = document.createElement('button');
      indicator.className = 'slide-indicator';
      indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
      indicator.style.cssText = `
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: none;
        background: ${i === 0 ? 'var(--black)' : 'var(--light-gray)'};
        cursor: pointer;
        transition: background 0.3s ease;
      `;

      indicator.addEventListener('click', () => {
        currentIndex = i;
        setPositionByIndex();
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000);
      });

      indicatorContainer.appendChild(indicator);
    }

    heroSlider.parentNode.appendChild(indicatorContainer);
  }

  function updateSlideIndicators() {
    const indicators = document.querySelectorAll('.slide-indicator');
    indicators.forEach((indicator, index) => {
      indicator.style.background = index === currentIndex ? 'var(--black)' : 'var(--light-gray)';
    });
  }

  createIndicators();

  // Pause auto slide on hover
  heroSlider.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
  });

  heroSlider.addEventListener('mouseleave', () => {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 5000);
  });
}

/**
 * Product comparison functionality
 */
const compareButtons = document.querySelectorAll(".action-btn[aria-label='compare']");
const comparedProducts = [];

compareButtons.forEach(button => {
  button.addEventListener("click", function (e) {
    e.stopPropagation();

    const productCard = this.closest('.shop-card');
    const productId = productCard.dataset.productId || Math.random().toString(36).substr(2, 9);
    const productName = productCard.querySelector('.card-title').textContent;

    const existingIndex = comparedProducts.findIndex(p => p.id === productId);

    if (existingIndex > -1) {
      // Remove from comparison
      comparedProducts.splice(existingIndex, 1);
      this.classList.remove('active');
      showNotification(`${productName} removed from comparison`);
    } else if (comparedProducts.length < 3) {
      // Add to comparison
      comparedProducts.push({
        id: productId,
        name: productName,
        element: productCard
      });
      this.classList.add('active');
      showNotification(`${productName} added to comparison`);
    } else {
      showNotification('Maximum 3 products can be compared');
    }

    // Update compare button style
    const icon = this.querySelector('ion-icon');
    if (this.classList.contains('active')) {
      icon.style.color = 'var(--blue)';
    } else {
      icon.style.color = '';
    }
  });
});

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--black);
    color: white;
    padding: 12px 24px;
    border-radius: 5px;
    z-index: 9999;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Search functionality
 */
const searchInput = document.querySelector('.search-field');
const searchButton = document.querySelector('.search-submit');

if (searchInput && searchButton) {
  searchButton.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  function performSearch() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      // Simulate search - in real implementation, this would filter products
      showNotification(`Searching for: ${searchTerm}`);
      // You would add actual search logic here
    }
  }
}

/**
 * header sticky & back top btn active
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const headerActive = function () {
  if (window.scrollY > 150) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", headerActive);

let lastScrolledPos = 0;

const headerSticky = function () {
  if (lastScrolledPos >= window.scrollY) {
    header.classList.remove("header-hide");
  } else {
    header.classList.add("header-hide");
  }

  lastScrolledPos = window.scrollY;
}

addEventOnElem(window, "scroll", headerSticky);

/**
 * scroll reveal effect with enhanced animation
 */
const sections = document.querySelectorAll("[data-section]");

const scrollReveal = function () {
  for (let i = 0; i < sections.length; i++) {
    const sectionTop = sections[i].getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight * 0.85) {
      sections[i].classList.add("active");

      // Animate children with delay
      const children = sections[i].children;
      for (let j = 0; j < children.length; j++) {
        children[j].style.transitionDelay = `${j * 0.1}s`;
      }
    }
  }
}

scrollReveal();

addEventOnElem(window, "scroll", scrollReveal);

/**
 * Price filter for products
 */
function initPriceFilter() {
  const priceFilter = document.createElement('div');
  priceFilter.className = 'price-filter';
  priceFilter.innerHTML = `
    <div class="filter-title">Filter by Price</div>
    <input type="range" min="0" max="1000" value="1000" class="price-slider">
    <div class="price-range">Up to: <span class="max-price">1000 Birr</span></div>
  `;

  priceFilter.style.cssText = `
    margin: 20px 0;
    padding: 20px;
    background: var(--cultured-1);
    border-radius: 5px;
  `;

  const shopSection = document.querySelector('#shop-bestsellers');
  if (shopSection) {
    const container = shopSection.querySelector('.container');
    if (container) {
      container.insertBefore(priceFilter, container.querySelector('.has-scrollbar'));
    }
  }

  const priceSlider = priceFilter.querySelector('.price-slider');
  const maxPriceSpan = priceFilter.querySelector('.max-price');

  priceSlider.addEventListener('input', function () {
    const maxPrice = parseInt(this.value);
    maxPriceSpan.textContent = `${maxPrice} Birr`;

    // Filter products - in real implementation, this would hide/show products
    const products = document.querySelectorAll('.shop-card');
    products.forEach(product => {
      const priceElement = product.querySelector('.price .span');
      if (priceElement) {
        const priceText = priceElement.textContent.replace('Birr', '').trim();
        const price = parseInt(priceText);

        if (price > maxPrice) {
          product.style.opacity = '0.5';
          product.style.pointerEvents = 'none';
        } else {
          product.style.opacity = '1';
          product.style.pointerEvents = 'auto';
        }
      }
    });
  });
}

// Initialize price filter
setTimeout(initPriceFilter, 1000);

/**
 * Quick view modal
 */
function initQuickView() {
  const productCards = document.querySelectorAll('.shop-card');

  productCards.forEach(card => {
    card.addEventListener('dblclick', function () {
      showQuickView(this);
    });

    // Touch for mobile
    let touchTimer;
    card.addEventListener('touchstart', function () {
      touchTimer = setTimeout(() => {
        showQuickView(this);
      }, 500);
    });

    card.addEventListener('touchend', function () {
      clearTimeout(touchTimer);
    });
  });

  function showQuickView(card) {
    const productName = card.querySelector('.card-title').textContent;
    const productPrice = card.querySelector('.price .span').textContent;
    const productImage = card.querySelector('.img-cover').src;
    const productRating = card.querySelector('.rating-text').textContent;

    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" aria-label="Close modal">&times;</button>
        <div class="modal-body">
          <img src="${productImage}" alt="${productName}" class="modal-image">
          <div class="modal-info">
            <h3>${productName}</h3>
            <div class="modal-price">${productPrice}</div>
            <div class="modal-rating">${productRating}</div>
            <p class="modal-description">Experience premium quality with this product. Made from natural ingredients, it's perfect for your daily routine.</p>
            <button class="btn btn-primary add-to-cart-modal">Add to Cart</button>
          </div>
        </div>
      </div>
    `;

    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease-out;
    `;

    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 10px;
      max-width: 800px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      animation: slideUp 0.3s ease-out;
    `;

    document.body.appendChild(modal);

    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      modal.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => modal.remove(), 300);
    });

    // Add to cart from modal
    const addToCartBtn = modal.querySelector('.add-to-cart-modal');
    addToCartBtn.addEventListener('click', () => {
      cartCount++;
      cartTotal += 299; // Example price
      updateCart();
      showNotification('Added to cart from quick view!');
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => modal.remove(), 300);
      }
    });
  }
}

// Initialize quick view
setTimeout(initQuickView, 1500);

/**
 * Add CSS animations
 */
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      transform: translate(-50%, -100%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  .nav-open {
    overflow: hidden;
  }
  
  .hero .has-scrollbar {
    cursor: grab;
    user-select: none;
  }
  
  .hero .has-scrollbar.grabbing {
    cursor: grabbing;
  }
  
  .action-btn.active ion-icon {
    color: var(--blue) !important;
  }
  
  .header-action-btn.active ion-icon {
    color: var(--blue);
  }
  
  .modal-close {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--black);
  }
  
  .modal-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-top: 20px;
  }
  
  .modal-image {
    width: 100%;
    height: auto;
    border-radius: 5px;
  }
  
  @media (max-width: 768px) {
    .modal-body {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(style);

/**
 * Initialize product cards hover effect for desktop
 */
if (window.innerWidth > 768) {
  const productCards = document.querySelectorAll('.shop-card');

  productCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px)';
      this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
      this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '';
    });
  });
}

/**
 * Newsletter form validation
 */
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  const emailField = newsletterForm.querySelector('.email-field');
  const submitBtn = newsletterForm.querySelector('.btn');

  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = emailField.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      showNotification('Please enter your email address');
      emailField.style.borderColor = 'red';
      return;
    }

    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email address');
      emailField.style.borderColor = 'red';
      return;
    }

    // Simulate subscription
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;

    setTimeout(() => {
      showNotification('Thank you for subscribing to our newsletter!');
      emailField.value = '';
      submitBtn.textContent = 'Subscribe';
      submitBtn.disabled = false;
      emailField.style.borderColor = '';
    }, 1500);
  });
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});