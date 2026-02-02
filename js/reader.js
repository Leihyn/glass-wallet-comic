class ComicReader {
    constructor() {
        this.container = document.querySelector('.reader-container');
        this.pages = document.querySelectorAll('.comic-page');
        this.progressFill = document.getElementById('progressFill');
        this.currentPageEl = document.getElementById('currentPage');
        this.totalPagesEl = document.getElementById('totalPages');
        this.toggleModeBtn = document.getElementById('toggleMode');
        this.toggleFullscreenBtn = document.getElementById('toggleFullscreen');
        this.pageNav = document.getElementById('pageNav');
        this.prevBtn = document.getElementById('prevPage');
        this.nextBtn = document.getElementById('nextPage');
        this.totalPages = this.pages.length;
        this.currentPage = 1;
        this.isPageMode = false;
        this.init();
    }

    init() {
        if (this.totalPagesEl) this.totalPagesEl.textContent = this.totalPages;
        this.loadImages();
        this.initScrollTracking();
        if (this.toggleModeBtn) this.toggleModeBtn.addEventListener('click', () => this.toggleMode());
        if (this.toggleFullscreenBtn) this.toggleFullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevPage());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextPage());
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        this.container.addEventListener('click', (e) => this.handleClick(e));
        this.initShareButtons();
        this.initReadingMode();
    }

    loadImages() {
        this.pages.forEach(page => {
            const img = page.querySelector('img');
            if (img) {
                img.addEventListener('load', () => img.classList.add('loaded'));
                if (img.complete) img.classList.add('loaded');
            }
        });
    }

    initScrollTracking() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking && !this.isPageMode) {
                window.requestAnimationFrame(() => { this.updateProgress(); ticking = false; });
                ticking = true;
            }
        });
        this.updateProgress();
    }

    updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        if (this.progressFill) this.progressFill.style.width = `${Math.min(progress, 100)}%`;
        this.pages.forEach((page, index) => {
            const rect = page.getBoundingClientRect();
            if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                this.currentPage = index + 1;
                if (this.currentPageEl) this.currentPageEl.textContent = this.currentPage;
            }
        });
    }

    toggleMode() {
        this.isPageMode = !this.isPageMode;
        if (this.isPageMode) {
            this.container.classList.add('page-mode');
            this.pageNav.style.display = 'flex';
            this.toggleModeBtn.querySelector('.icon-scroll').style.display = 'none';
            this.toggleModeBtn.querySelector('.icon-page').style.display = 'block';
            this.showPage(this.currentPage);
        } else {
            this.container.classList.remove('page-mode');
            this.pageNav.style.display = 'none';
            this.toggleModeBtn.querySelector('.icon-scroll').style.display = 'block';
            this.toggleModeBtn.querySelector('.icon-page').style.display = 'none';
            this.pages.forEach(page => page.classList.remove('active'));
            const targetPage = this.pages[this.currentPage - 1];
            if (targetPage) targetPage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        this.updatePageNav();
    }

    showPage(pageNum) {
        this.pages.forEach((page, index) => page.classList.toggle('active', index + 1 === pageNum));
        this.currentPage = pageNum;
        if (this.currentPageEl) this.currentPageEl.textContent = this.currentPage;
        if (this.progressFill) this.progressFill.style.width = `${(this.currentPage / this.totalPages) * 100}%`;
        this.updatePageNav();
    }

    updatePageNav() {
        if (this.prevBtn) this.prevBtn.disabled = this.currentPage <= 1;
        if (this.nextBtn) this.nextBtn.disabled = this.currentPage >= this.totalPages;
    }

    prevPage() { if (this.currentPage > 1) this.showPage(this.currentPage - 1); }
    nextPage() { if (this.currentPage < this.totalPages) this.showPage(this.currentPage + 1); }

    handleKeyboard(e) {
        if (this.isPageMode) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); this.prevPage(); }
            else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); this.nextPage(); }
        }
        if (e.key === 'f' || e.key === 'F') this.toggleFullscreen();
        if (e.key === 'm' || e.key === 'M') this.toggleMode();
    }

    handleClick(e) {
        if (!this.isPageMode || e.target.closest('button') || e.target.closest('a')) return;
        const clickX = e.clientX, screenWidth = window.innerWidth;
        if (clickX < screenWidth / 3) this.prevPage();
        else if (clickX > (screenWidth * 2) / 3) this.nextPage();
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) document.body.requestFullscreen().catch(err => console.log(err));
        else document.exitFullscreen();
    }

    initShareButtons() {
        const twitterBtn = document.getElementById('shareTwitter');
        const copyBtn = document.getElementById('shareCopy');
        if (twitterBtn) {
            twitterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const text = encodeURIComponent('Just read "The Glass Wallet" - a comic about privacy in crypto. Privacy isn\'t hiding. It\'s choosing.');
                window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.origin)}`, '_blank');
            });
        }
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(window.location.href).then(() => {
                    copyBtn.style.borderColor = 'var(--color-encrypt)';
                    copyBtn.style.color = 'var(--color-encrypt)';
                    setTimeout(() => { copyBtn.style.borderColor = ''; copyBtn.style.color = ''; }, 2000);
                });
            });
        }
    }

    initReadingMode() {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            document.body.classList.add('reading');
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => document.body.classList.remove('reading'), 2000);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new ComicReader());
