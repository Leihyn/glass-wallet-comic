document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    const nav = document.querySelector('.nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                nav.style.background = 'rgba(10, 10, 11, 0.95)';
                nav.style.backdropFilter = 'blur(10px)';
            } else {
                nav.style.background = 'linear-gradient(to bottom, var(--color-bg), transparent)';
                nav.style.backdropFilter = 'none';
            }
        });
    }

    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            scrollIndicator.style.opacity = window.scrollY > 50 ? '0' : '1';
        });
    }
});
