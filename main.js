// Preloader fade-out on window load with 2-second delay
window.addEventListener('load', () => {
    const preloader = document.getElementById('Crome-nest-preloader') || document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 2000); // 2 second delay
    }
});

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. STICKY HEADER & MOBILE NAV MENU
       ========================================================================== */
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Sticky Header Scroll Handler
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Toggle Mobile Menu
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navMenu.classList.contains('active');
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', !isOpen);
    });

    // Close Mobile Menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });


    /* ==========================================================================
       2. SCROLL SPY (ACTIVE NAV LINKS - Home Page Only)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const isHomePage = document.querySelector('.hero') !== null;
    
    function scrollSpy() {
        if (!isHomePage) return;
        
        const scrollPosition = window.scrollY + 120; // offset for header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href === `#${sectionId}` || href === `index.html#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    if (isHomePage) {
        window.addEventListener('scroll', scrollSpy);
        scrollSpy(); // Initial call
    }


    /* ==========================================================================
       3. AMBIENT HERO PARTICLES (CANVAS)
       ========================================================================== */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        let numberOfParticles = 40;

        // Set dimensions
        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5; // Small fine particles
                this.speedX = Math.random() * 0.3 - 0.15; // Slow drift
                this.speedY = Math.random() * -0.4 - 0.1; // Slow upward float
                this.alpha = Math.random() * 0.5 + 0.1;
                this.pulseSpeed = Math.random() * 0.01 + 0.005;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Reset position if particle goes out of bounds
                if (this.y < 0) {
                    this.y = canvas.height;
                    this.x = Math.random() * canvas.width;
                }
                if (this.x < 0 || this.x > canvas.width) {
                    this.x = Math.random() * canvas.width;
                }

                // Pulse alpha for shimmer effect
                this.alpha += this.pulseSpeed;
                if (this.alpha > 0.7 || this.alpha < 0.1) {
                    this.pulseSpeed = -this.pulseSpeed;
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.alpha);
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = '#FFFFFF';
                // Add soft electric blue glow to some particles
                if (this.size > 2) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#1A8FFF';
                }
                ctx.fill();
                ctx.restore();
            }
        }

        function initParticles() {
            particlesArray = [];
            // Scale particle density with canvas width
            numberOfParticles = Math.floor((canvas.width * canvas.height) / 20000);
            numberOfParticles = Math.min(Math.max(numberOfParticles, 25), 80);
            
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animateParticles();
    }


    /* ==========================================================================
       4. INTERACTIVE BEFORE / AFTER SLIDER
       ========================================================================== */
    const splitSlider = document.getElementById('split-slider');
    const afterImg = document.getElementById('after-img');
    const sliderBar = document.getElementById('slider-bar');

    if (splitSlider && afterImg && sliderBar) {
        const updateSlider = () => {
            const val = splitSlider.value;
            // Update the clip path of the after-image
            afterImg.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
            // Update the position of the sliding chrome bar
            sliderBar.style.left = `${val}%`;
        };

        // Trigger on range change
        splitSlider.addEventListener('input', updateSlider);
        
        // Initial call to set 50% split on mount
        updateSlider();
    }


    /* ==========================================================================
       5. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
       ========================================================================== */
    const animatedElements = document.querySelectorAll('.animate-element');

    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Stop observing once animated
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px' // triggers slightly before entering screen
        });

        animatedElements.forEach(el => animationObserver.observe(el));
    } else {
        // Fallback for older browsers
        animatedElements.forEach(el => el.classList.add('animated'));
    }


    /* ==========================================================================
       6. RESERVATION FORM VALIDATION & SUCCESS TOAST WITH WHATSAPP REDIRECT
       ========================================================================== */
    const bookingForm = document.getElementById('booking-form');
    const toast = document.getElementById('toast-notification');
    const formDateInput = document.getElementById('form-date');

    // Prevent past dates in booking form
    if (formDateInput) {
        const today = new Date().toISOString().split('T')[0];
        formDateInput.setAttribute('min', today);
    }

    if (bookingForm && toast) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name');
            const phone = document.getElementById('form-phone');
            const car = document.getElementById('form-car');
            const service = document.getElementById('form-service');
            const date = document.getElementById('form-date');

            let isValid = true;

            // Simple validation highlighting
            [name, car, service, date].forEach(input => {
                if (!input.value || input.value.trim() === '') {
                    input.style.borderColor = '#FF6B6B';
                    isValid = false;
                } else {
                    input.style.borderColor = 'var(--chrome-dark)';
                }
            });

            // Phone number verification (10 digits)
            const cleanPhone = phone.value.replace(/\D/g, '');
            if (cleanPhone.length < 10) {
                phone.style.borderColor = '#FF6B6B';
                isValid = false;
            } else {
                phone.style.borderColor = 'var(--chrome-dark)';
            }

            if (!isValid) {
                return;
            }

            // Build WhatsApp Redirect URL
            const whatsappNumber = "919515666832";
            const serviceLabel = service.options[service.selectedIndex].text;
            const text = `Hi Crome Nest, I'd like to book a detailing session.%0A%0A*Details:*%0A- *Name:* ${encodeURIComponent(name.value)}%0A- *Phone:* ${encodeURIComponent(phone.value)}%0A- *Car:* ${encodeURIComponent(car.value)}%0A- *Service:* ${encodeURIComponent(serviceLabel)}%0A- *Preferred Date:* ${encodeURIComponent(date.value)}`;
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;

            // Mock success action
            const submitBtn = document.getElementById('form-submit-btn');
            submitBtn.textContent = 'Scheduling...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Show Success Toast
                toast.classList.add('show');
                
                // Redirect to WhatsApp in a new tab
                window.open(whatsappUrl, '_blank');
                
                // Reset form fields
                bookingForm.reset();
                [name, phone, car, service, date].forEach(input => {
                    input.style.borderColor = 'var(--chrome-dark)';
                });

                // Restore submit button
                submitBtn.textContent = 'Schedule Appointment';
                submitBtn.disabled = false;

                // Hide Toast after 4 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 4000);
            }, 1200);
        });

        // Dynamic validation reset on input focus
        const inputs = bookingForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = 'var(--accent-blue)';
            });
            input.addEventListener('blur', () => {
                input.style.borderColor = 'var(--chrome-dark)';
            });
        });
    }
});
