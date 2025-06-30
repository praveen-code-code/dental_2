   // Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
});

// Counter Animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);

        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Stats counter animation on scroll
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numberElement = entry.target.querySelector('.stat-number');
            const target = parseInt(numberElement.getAttribute('data-target'));
            animateCounter(numberElement, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe stats items
document.addEventListener('DOMContentLoaded', () => {
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => statsObserver.observe(item));
});

// Button interactions
document.addEventListener('DOMContentLoaded', () => {
    // Read More buttons
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            btn.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Simulate navigation
            console.log('Navigating to service details...');
        });
    });

    // View All Services button
    const viewAllBtn = document.querySelector('.view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Viewing all services...');
        });
    }

    // Play Video button
    const playVideoBtn = document.querySelector('.play-video-btn');
    if (playVideoBtn) {
        playVideoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Playing video...');
            // You can integrate with a video player here
        });
    }
});

// Service card hover effects
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Smooth scroll behavior
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button[href^="#"]');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Parallax effect for decorative stars
document.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        const speed = (index + 1) * 0.2;
        star.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Loading state simulation
document.addEventListener('DOMContentLoaded', () => {
    // Simulate loading for demo purposes
    const loadingElements = document.querySelectorAll('.service-card, .stat-item');
    
    loadingElements.forEach((element, index) => {
        element.classList.add('loading');
        setTimeout(() => {
            element.classList.remove('loading');
        }, (index + 1) * 200);
    });
});

// Banner image lazy loading
document.addEventListener('DOMContentLoaded', () => {
    const bannerImage = document.querySelector('.banner-image img');
    
    if (bannerImage) {
        bannerImage.addEventListener('load', () => {
            bannerImage.style.opacity = '1';
        });
        
        bannerImage.addEventListener('error', () => {
            console.log('Banner image failed to load, using fallback');
            bannerImage.src = 'https://images.pexels.com/photos/287237/pexels-photo-287237.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
        });
    }
});

// Mobile menu toggle (if needed for responsive nav)
document.addEventListener('DOMContentLoaded', () => {
    // Add touch events for mobile interaction
    if ('ontouchstart' in window) {
        const cards = document.querySelectorAll('.service-card');
        cards.forEach(card => {
            card.addEventListener('touchstart', () => {
                card.classList.add('touch-active');
            });
            
            card.addEventListener('touchend', () => {
                setTimeout(() => {
                    card.classList.remove('touch-active');
                }, 300);
            });
        });
    }
});

// Add ripple effect CSS dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .touch-active {
        transform: scale(0.98);
        transition: transform 0.1s ease;
    }
`;
document.head.appendChild(rippleStyle);