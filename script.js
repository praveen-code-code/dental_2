// Utility functions
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => context.querySelectorAll(selector);

// Configuration object for animation settings
const CONFIG = {
    observer: {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    },
    animation: {
        rippleDuration: 600,
        counterDuration: 2000,
        counterFrame: 16,
        typingSpeed: 100
    },
    scroll: {
        navbarThreshold: 100,
        navbarStyles: {
            above: {
                background: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)'
            },
            below: {
                background: 'rgba(255, 255, 255, 0.98)',
                boxShadow: '0 2px 20px rgba(0, 0, 0, 0.15)'
            }
        }
    }
};

// Throttle function
const throttle = (func, wait) => {
    let timeout;
    return (...args) => {
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                func(...args);
            }, wait);
        }
    };
};

// Ripple effect handler
const createRipple = (element, event) => {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    Object.assign(ripple.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}px`,
        top: `${y}px`
    });
    ripple.classList.add('ripple');
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), CONFIG.animation.rippleDuration);
};

// Mobile menu toggle
const initMobileMenu = () => {
    const toggle = $('#mobile-menu-toggle');
    const menu = $('#nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('active')) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    }
};

// Smooth scrolling
const initSmoothScrolling = () => {
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = $(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
};

// Scroll effects
const initScrollEffects = () => {
    const handleScroll = throttle(() => {
        const navbar = $('.navbar');
        const scrolled = window.pageYOffset;
        
        // Navbar effect
        const styles = scrolled > CONFIG.scroll.navbarThreshold 
            ? CONFIG.scroll.navbarStyles.below 
            : CONFIG.scroll.navbarStyles.above;
        Object.assign(navbar.style, styles);

        // Parallax effect
        $$('.shape, .star').forEach((shape, index) => {
            const speed = 0.5 + (index * 0.2);
            const yPos = -(scrolled * speed);
            shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
        });
    }, 16);

    window.addEventListener('scroll', handleScroll);
};

// Intersection observer for animations
const initAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible', 'animated');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, CONFIG.observer);

    $$('.fade-in, .animate-on-scroll').forEach(el => observer.observe(el));
};

// Counter animation
const initCounterAnimation = () => {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberElement = entry.target.querySelector('.stat-number');
                const target = parseInt(numberElement.getAttribute('data-target'));
                const start = 0;
                const increment = target / (CONFIG.animation.counterDuration / CONFIG.animation.counterFrame);
                let current = start;

                const timer = setInterval(() => {
                    current += increment;
                    numberElement.textContent = Math.floor(current);
                    if (current >= target) {
                        numberElement.textContent = target;
                        clearInterval(timer);
                    }
                }, CONFIG.animation.counterFrame);

                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    $$('.stat-item').forEach(item => statsObserver.observe(item));
};

// Button interactions
const initButtonInteractions = () => {
    $$('.appointment-btn, .cta-btn, .appointment-btn-footer, .read-more-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            createRipple(btn, e);
            console.log(`Button clicked: ${btn.className}`);
        });
    });

    const viewAllBtn = $('.view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Viewing all services...');
        });
    }

    const playVideoBtn = $('.play-video-btn');
    if (playVideoBtn) {
        playVideoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Playing video...');
        });
    }
};

// Service card effects
const initServiceCards = () => {
    $$('.service-card').forEach(card => {
        card.style.transition = 'transform 0.3s ease';
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });

        if ('ontouchstart' in window) {
            card.addEventListener('touchstart', () => {
                card.classList.add('touch-active');
            });
            card.addEventListener('touchend', () => {
                setTimeout(() => card.classList.remove('touch-active'), 300);
            });
        }
    });
};

// Floating elements
const initFloatingElements = () => {
    $$('.floating-tooth, .floating-star').forEach(element => {
        const randomDelay = Math.random() * 2;
        const randomDuration = 3 + Math.random() * 2;
        Object.assign(element.style, {
            animationDelay: `${randomDelay}s`,
            animationDuration: `${randomDuration}s`
        });
    });
};

// Typing effect
const initTypingEffect = () => {
    const heroTitle = $('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;

        const type = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(type, CONFIG.animation.typingSpeed);
            }
        };
        type();
    }
};

// Lazy loading
const initLazyLoading = () => {
    const bannerImage = $('.banner-image img');
    if (bannerImage) {
        bannerImage.addEventListener('load', () => {
            bannerImage.style.opacity = '1';
        });
        bannerImage.addEventListener('error', () => {
            console.error('Banner image failed to load');
            bannerImage.src = 'https://images.pexels.com/photos/287237/pexels-photo-287237.jpeg';
        });
    }
};

// Initialize all features
const init = () => {
    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '1';

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to { transform: scale(4); opacity: 0; }
        }
        .touch-active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
        }
        .fade-in, .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
        .fade-in.visible, .animate-on-scroll.animated {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Initialize features
    initMobileMenu();
    initSmoothScrolling();
    initScrollEffects();
    initAnimations();
    initCounterAnimation();
    initButtonInteractions();
    initServiceCards();
    initFloatingElements();
    initTypingEffect();
    initLazyLoading();
};

// Run initialization
document.addEventListener('DOMContentLoaded', init);





// Testimonial data
const testimonials = [
    {
        quote: "I want to say thank you to my doctor Steve! Vivamus sagittis massa vitae bibendum rhoncus. Duis cursus. Thank you for helping me overcome my fear of the dentist! Vivamus sagittis massa vitae bibendum rhoncus. Duis cursus.",
        name: "Robert Lee",
        role: "software engineer",
        avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100",
        image: "https://images.pexels.com/photos/6812472/pexels-photo-6812472.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
        quote: "Outstanding service and care! The team here is incredibly professional and made me feel comfortable throughout my entire treatment. I couldn't be happier with the results and the overall experience.",
        name: "Sarah Johnson",
        role: "marketing director",
        avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
        image: "https://images.pexels.com/photos/6812465/pexels-photo-6812465.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
        quote: "Exceptional medical care with a personal touch. The staff is knowledgeable, caring, and always goes above and beyond to ensure patient satisfaction. Highly recommend this practice!",
        name: "Michael Chen",
        role: "business analyst",
        avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
        image: "https://images.pexels.com/photos/6812470/pexels-photo-6812470.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
];

let currentTestimonialIndex = 0;

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling and entrance animations
    initializeAnimations();
    
    // Set up testimonial functionality
    updateTestimonial(currentTestimonialIndex);
    
    // Initialize blog card animations
    initializeBlogAnimations();
});

function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
        observer.observe(el);
    });
}

function initializeBlogAnimations() {
    const blogObserverOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const blogObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.style.animationPlayState = 'running';
                }, delay);
            }
        });
    }, blogObserverOptions);

    // Observe blog cards
    document.querySelectorAll('.fade-in-up').forEach(el => {
        blogObserver.observe(el);
    });
}

function updateTestimonial(index) {
    const testimonial = testimonials[index];
    
    // Get elements
    const quoteText = document.querySelector('.quote-text');
    const clientName = document.querySelector('.client-name');
    const clientRole = document.querySelector('.client-role');
    const clientAvatar = document.querySelector('.client-avatar img');
    const testimonialImage = document.querySelector('.testimonial-image');
    
    // Add fade out effect
    const elementsToFade = [quoteText, clientName, clientRole, clientAvatar, testimonialImage];
    
    elementsToFade.forEach(el => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
        }
    });
    
    // Update content after fade out
    setTimeout(() => {
        if (quoteText) quoteText.textContent = `"${testimonial.quote}"`;
        if (clientName) clientName.textContent = testimonial.name;
        if (clientRole) clientRole.textContent = testimonial.role;
        if (clientAvatar) clientAvatar.src = testimonial.avatar;
        if (testimonialImage) testimonialImage.src = testimonial.image;
        
        // Fade in new content
        elementsToFade.forEach((el, i) => {
            if (el) {
                setTimeout(() => {
                    el.style.transition = 'all 0.5s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, i * 100);
            }
        });
    }, 250);
}

function nextTestimonial() {
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
    updateTestimonial(currentTestimonialIndex);
    
    // Add button animation
    animateButton('.next-btn');
}

function previousTestimonial() {
    currentTestimonialIndex = currentTestimonialIndex === 0 ? testimonials.length - 1 : currentTestimonialIndex - 1;
    updateTestimonial(currentTestimonialIndex);
    
    // Add button animation
    animateButton('.prev-btn');
}

function animateButton(selector) {
    const button = document.querySelector(selector);
    if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
}

// Add smooth hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Rating card hover effect
    const ratingCard = document.querySelector('.rating-card');
    if (ratingCard) {
        ratingCard.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        ratingCard.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-3px)';
        });
    }
    
    // Quote container parallax effect
    const quoteContainer = document.querySelector('.quote-container');
    if (quoteContainer) {
        quoteContainer.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });
        
        quoteContainer.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    }

    // Blog card hover effects
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle rotation effect
            this.style.transform = 'translateY(-10px) rotateY(2deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0deg)';
        });
    });
});

// Auto-play functionality (optional)
let autoPlayInterval;

function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        nextTestimonial();
    }, 5000);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
}

// Uncomment to enable auto-play
// startAutoPlay();

// Pause auto-play on hover
document.querySelector('.testimonial-content')?.addEventListener('mouseenter', stopAutoPlay);
document.querySelector('.testimonial-content')?.addEventListener('mouseleave', startAutoPlay);

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity for smooth loading
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        // If image is already loaded (cached)
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
});



// Dental services data
const services = [
    {
        id: 1,
        icon: "fas fa-stethoscope",
        title: "General Dental Care",
        description: "We are excited to meet you and provide the best dental care for your family."
    },
    {
        id: 2,
        icon: "fas fa-tools",
        title: "Dental Implants",
        description: "We are excited to meet you and provide the best dental care for your family."
    },
    {
        id: 3,
        icon: "fas fa-sparkles",
        title: "Cosmetic Dentistry",
        description: "We are excited to meet you and provide the best dental care for your family."
    },
    {
        id: 4,
        icon: "fas fa-shield-alt",
        title: "Teeth Whitening",
        description: "We are excited to meet you and provide the best dental care for your family."
    },
    {
        id: 5,
        icon: "fas fa-heart",
        title: "Pediatric Dental Care",
        description: "We are excited to meet you and provide the best dental care for your family."
    },
    {
        id: 6,
        icon: "fas fa-bolt",
        title: "Advanced Oral Care",
        description: "We are excited to meet you and provide the best dental care for your family."
    },
    {
        id: 7,
        icon: "fas fa-smile",
        title: "Comfort Dentistry",
        description: "We are excited to meet you and provide the best dental care for your family."
    },
    {
        id: 8,
        icon: "fas fa-star",
        title: "Smile Renewal",
        description: "We are excited to meet you and provide the best dental care for your family."
    }
];

// Function to create service card HTML
function createServiceCard(service) {
    return `
        <div class="service-card-services-section" tabindex="0" role="button" aria-label="${service.title} service">
            <div class="icon-container-services-section">
                <i class="service-icon-services-section ${service.icon}"></i>
            </div>
            <h3 class="service-title-services-section">${service.title}</h3>
            <p class="service-description-services-section">${service.description}</p>
            <a href="#" class="read-more-btn-services-section" aria-label="Read more about ${service.title}">
                <span>Read More</span>
                <div class="btn-icon-services-section">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </a>
        </div>
    `;
}

// Function to render all service cards
function renderServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    const servicesHTML = services.map(service => createServiceCard(service)).join('');
    servicesGrid.innerHTML = servicesHTML;
}

// Enhanced hover effects
function addEnhancedInteractions() {
    const cards = document.querySelectorAll('.service-card-services-section');
    
    cards.forEach((card, index) => {
        // Mouse enter effect
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
            
            // Add subtle animation to other cards
            cards.forEach((otherCard, otherIndex) => {
                if (otherIndex !== index) {
                    otherCard.style.opacity = '0.7';
                    otherCard.style.transform = 'scale(0.95)';
                }
            });
        });
        
        // Mouse leave effect
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
            
            // Reset other cards
            cards.forEach(otherCard => {
                otherCard.style.opacity = '1';
                otherCard.style.transform = 'scale(1)';
            });
        });
        
        // Click effect
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'translateY(-8px) scale(0.98)';
            
            setTimeout(() => {
                this.style.transform = 'translateY(-12px) scale(1)';
            }, 150);
            
            // You can add navigation logic here
            console.log(`Clicked on ${services[index].title}`);
        });
        
        // Keyboard navigation
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Intersection Observer for scroll animations
function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const cards = document.querySelectorAll('.service-card-services-section');
    cards.forEach(card => {
        observer.observe(card);
    });
}

// Smooth scroll for read more buttons
function addSmoothScrolling() {
    const readMoreBtns = document.querySelectorAll('.read-more-btn-services-section');
    
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(59, 130, 246, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple animation CSS
function addRippleAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Performance optimization - Debounced resize handler
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

// Handle responsive adjustments
function handleResize() {
    const cards = document.querySelectorAll('.service-card-services-section');
    const isMobile = window.innerWidth <= 768;
    
    cards.forEach(card => {
        if (isMobile) {
            card.style.padding = '2rem';
        } else {
            card.style.padding = '2.5rem';
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    renderServices();
    addEnhancedInteractions();
    addScrollAnimations();
    addSmoothScrolling();
    addRippleAnimation();
    
    // Add resize handler
    const debouncedResize = debounce(handleResize, 250);
    window.addEventListener('resize', debouncedResize);
    
    // Initial resize call
    handleResize();
    
    console.log('Dental Services Cards initialized successfully!');
});

// Add loading animation
window.addEventListener('load', function() {
    document.querySelector('.services-section-body').style.opacity = '1';
    document.querySelector('.services-section-body').style.transition = 'opacity 0.5s ease-in-out';
});



