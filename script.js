// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenu.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.replace('bx-menu', 'bx-x');
        } else {
            icon.classList.replace('bx-x', 'bx-menu');
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenu.querySelector('i').classList.replace('bx-x', 'bx-menu');
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// App Card Hover Effects
const appCards = document.querySelectorAll('.app-card');
appCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const logo = card.querySelector('.app-logo');
        if (logo) {
            logo.style.transform = 'scale(1.1) rotate(5deg)';
            logo.style.transition = 'transform 0.3s ease';
        }
    });
    card.addEventListener('mouseleave', () => {
        const logo = card.querySelector('.app-logo');
        if (logo) {
            logo.style.transform = 'scale(1) rotate(0)';
        }
    });
});

// Contact Form Handling (Using Formspree)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        
        // Formspree requires the form action URL
        const formAction = contactForm.getAttribute('action');
        if (formAction.includes('YOUR_FORMSPREE_ID')) {
            alert('Please set your Formspree ID in contact.html first!');
            return;
        }

        btn.innerText = 'Sending...';
        btn.disabled = true;

        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                btn.innerText = 'Message Sent Successfully!';
                btn.style.background = '#10b981'; // Success Green
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 5000);
            } else {
                throw new Error('Failed to send');
            }
        } catch (error) {
            btn.innerText = 'Error Sending Message';
            btn.style.background = '#ef4444'; // Error Red
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }
    });
}
