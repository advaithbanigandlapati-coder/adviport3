// ================================================
// CYBERSECURITY PORTFOLIO - MAIN JAVASCRIPT
// Production-grade interactions and animations
// ================================================

// ===== THEME MANAGEMENT =====
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        this.applyTheme(this.theme);
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.theme = theme;
        
        // Reinitialize background with new theme
        if (window.backgroundAnimation) {
            window.backgroundAnimation.destroy();
            window.backgroundAnimation = new BackgroundAnimation();
        }
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }
}

// ===== BACKGROUND ANIMATION =====
class BackgroundAnimation {
    constructor() {
        this.canvas = document.getElementById('background-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.theme = document.documentElement.getAttribute('data-theme') || 'light';
        
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Create particles
        const particleCount = this.theme === 'dark' ? 80 : 60;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
        
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        const isDark = this.theme === 'dark';
        
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * (isDark ? 0.5 : 0.3),
            speedY: (Math.random() - 0.5) * (isDark ? 0.5 : 0.3),
            opacity: Math.random() * 0.5 + 0.2,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            pulsePhase: Math.random() * Math.PI * 2
        };
    }

    drawParticles() {
        const isDark = this.theme === 'dark';
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Pulse effect
            particle.pulsePhase += particle.pulseSpeed;
            const pulseFactor = Math.sin(particle.pulsePhase) * 0.3 + 0.7;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * pulseFactor, 0, Math.PI * 2);
            
            if (isDark) {
                // Dark mode: cyan/blue particles
                const gradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 2
                );
                gradient.addColorStop(0, `rgba(14, 165, 233, ${particle.opacity * pulseFactor})`);
                gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
                this.ctx.fillStyle = gradient;
            } else {
                // Light mode: subtle gray particles
                this.ctx.fillStyle = `rgba(100, 116, 139, ${particle.opacity * pulseFactor * 0.4})`;
            }
            
            this.ctx.fill();
            
            // Draw connections in dark mode
            if (isDark) {
                this.particles.slice(index + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(otherParticle.x, otherParticle.y);
                        const opacity = (1 - distance / 150) * 0.15;
                        this.ctx.strokeStyle = `rgba(14, 165, 233, ${opacity})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.stroke();
                    }
                });
            }
        });
    }

    drawGrid() {
        const isDark = this.theme === 'dark';
        const gridSize = 50;
        const color = isDark ? 'rgba(14, 165, 233, 0.03)' : 'rgba(100, 116, 139, 0.05)';
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw particles
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ===== MOBILE MENU =====
class MobileMenu {
    constructor() {
        this.toggle = document.getElementById('mobile-toggle');
        this.menu = document.querySelector('.nav-menu');
        this.init();
    }

    init() {
        if (!this.toggle || !this.menu) return;
        
        this.toggle.addEventListener('click', () => {
            this.menu.classList.toggle('active');
            this.toggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const links = this.menu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                this.menu.classList.remove('active');
                this.toggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
                this.menu.classList.remove('active');
                this.toggle.classList.remove('active');
            }
        });
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.sections = document.querySelectorAll('.fade-in, .stagger-item');
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        this.sections.forEach(section => {
            this.observer.observe(section);
        });
    }
}

// ===== NAVBAR SCROLL EFFECT =====
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        if (!this.navbar) return;
        
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                this.navbar.style.boxShadow = 'var(--shadow-lg)';
            } else {
                this.navbar.style.boxShadow = 'none';
            }
            
            lastScroll = currentScroll;
        });
    }
}

// ===== SMOOTH SCROLL =====
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== ACTIVE NAV LINK =====
class ActiveNavLink {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        this.init();
    }

    init() {
        if (this.sections.length === 0) return;
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// ===== CODE COPY BUTTONS =====
class CodeCopyButtons {
    constructor() {
        this.copyButtons = document.querySelectorAll('.copy-btn');
        this.init();
    }

    init() {
        this.copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const code = button.getAttribute('data-copy');
                this.copyToClipboard(code, button);
            });
        });
    }

    async copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            this.showCopiedFeedback(button);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }

    showCopiedFeedback(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        `;
        button.style.color = '#10b981';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.color = '';
        }, 2000);
    }
}

// ===== CHECKLIST PROGRESS =====
class ChecklistProgress {
    constructor() {
        this.checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
        this.progressBar = document.getElementById('checklist-progress');
        this.completedCount = document.getElementById('completed-count');
        this.totalCount = document.getElementById('total-count');
        this.init();
    }

    init() {
        if (this.checkboxes.length === 0) return;
        
        // Set total count
        if (this.totalCount) {
            this.totalCount.textContent = this.checkboxes.length;
        }
        
        // Load saved state
        this.loadState();
        
        // Add event listeners
        this.checkboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('change', () => {
                this.updateProgress();
                this.saveState();
            });
        });
        
        // Initial update
        this.updateProgress();
    }

    updateProgress() {
        const completed = Array.from(this.checkboxes).filter(cb => cb.checked).length;
        const total = this.checkboxes.length;
        const percentage = (completed / total) * 100;
        
        if (this.progressBar) {
            this.progressBar.style.width = `${percentage}%`;
        }
        
        if (this.completedCount) {
            this.completedCount.textContent = completed;
        }
    }

    saveState() {
        const state = Array.from(this.checkboxes).map(cb => cb.checked);
        localStorage.setItem('checklist-state', JSON.stringify(state));
    }

    loadState() {
        const savedState = localStorage.getItem('checklist-state');
        if (savedState) {
            const state = JSON.parse(savedState);
            state.forEach((checked, index) => {
                if (this.checkboxes[index]) {
                    this.checkboxes[index].checked = checked;
                }
            });
        }
    }
}

// ===== SKILL BAR ANIMATIONS =====
class SkillBarAnimations {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.width = entry.target.style.width;
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        this.skillBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 100);
            observer.observe(bar);
        });
    }
}

// ===== TERMINAL TYPING EFFECT =====
class TerminalTyping {
    constructor() {
        this.terminal = document.querySelector('.terminal-body');
        if (!this.terminal) return;
        
        // Add typing effect to terminal on page load
        const lines = this.terminal.querySelectorAll('.terminal-line, .terminal-output');
        lines.forEach((line, index) => {
            line.style.opacity = '0';
            setTimeout(() => {
                line.style.transition = 'opacity 0.3s ease';
                line.style.opacity = '1';
            }, index * 200);
        });
    }
}

// ===== GUIDE NAV STICKY BEHAVIOR =====
class GuideNavSticky {
    constructor() {
        this.guideNav = document.querySelector('.guide-nav');
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        if (!this.guideNav || !this.navbar) return;
        
        window.addEventListener('scroll', () => {
            const navbarHeight = this.navbar.offsetHeight;
            if (window.pageYOffset > navbarHeight) {
                this.guideNav.style.top = `${navbarHeight}px`;
            }
        });
    }
}

// ===== LAZY LOAD IMAGES =====
class LazyLoadImages {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) {
            this.loadAllImages();
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        this.images.forEach(img => observer.observe(img));
    }

    loadImage(img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    }

    loadAllImages() {
        this.images.forEach(img => this.loadImage(img));
    }
}

// ===== BACK TO TOP BUTTON =====
class BackToTop {
    constructor() {
        this.createButton();
        this.init();
    }

    createButton() {
        this.button = document.createElement('button');
        this.button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="18 15 12 9 6 15"/>
            </svg>
        `;
        this.button.className = 'back-to-top';
        this.button.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(this.button);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .back-to-top {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 48px;
                height: 48px;
                background: var(--accent-gradient);
                color: white;
                border: none;
                border-radius: var(--radius-md);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all var(--transition-base);
                box-shadow: var(--shadow-lg);
                z-index: 999;
            }
            .back-to-top.visible {
                opacity: 1;
                visibility: visible;
            }
            .back-to-top:hover {
                transform: translateY(-4px);
                box-shadow: var(--shadow-xl);
            }
        `;
        document.head.appendChild(style);
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });
        
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== INITIALIZE ALL =====
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    new ThemeManager();
    window.backgroundAnimation = new BackgroundAnimation();
    new MobileMenu();
    new SmoothScroll();
    new NavbarScroll();
    
    // Animations
    new ScrollAnimations();
    new ActiveNavLink();
    new SkillBarAnimations();
    new TerminalTyping();
    
    // Guide-specific
    new CodeCopyButtons();
    new ChecklistProgress();
    new GuideNavSticky();
    
    // Enhancements
    new LazyLoadImages();
    new BackToTop();
    
    console.log('Portfolio initialized successfully');
});

// Handle page visibility for animations
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        if (window.backgroundAnimation) {
            window.backgroundAnimation.destroy();
        }
    } else {
        // Resume animations when tab becomes visible
        if (window.backgroundAnimation) {
            window.backgroundAnimation = new BackgroundAnimation();
        }
    }
});
