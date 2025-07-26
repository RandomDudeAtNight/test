// Tech Template JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
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

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Copy post link functionality
    document.querySelectorAll('.post-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const url = window.location.origin + window.location.pathname + this.getAttribute('href');
            navigator.clipboard.writeText(url).then(() => {
                // Show temporary notification
                showNotification('Post link copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    });

    // Code block copying
    document.querySelectorAll('pre').forEach(pre => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = 'Copy code';
        
        copyButton.addEventListener('click', function() {
            const code = pre.textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            });
        });
        
        pre.style.position = 'relative';
        pre.appendChild(copyButton);
    });

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.title = 'Back to top';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Theme toggle (if needed)
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }

    // Auto-expand long content
    document.querySelectorAll('.expandable-content').forEach(content => {
        if (content.scrollHeight > content.clientHeight) {
            const expandBtn = document.createElement('button');
            expandBtn.className = 'expand-btn';
            expandBtn.textContent = 'Show more';
            
            expandBtn.addEventListener('click', function() {
                content.classList.toggle('expanded');
                this.textContent = content.classList.contains('expanded') ? 'Show less' : 'Show more';
            });
            
            content.parentNode.appendChild(expandBtn);
        }
    });

    // Initialize tooltips
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            setTimeout(() => tooltip.classList.add('show'), 100);
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Press 'S' to focus search
        if (e.key === 's' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Press 'H' to go home
        if (e.key === 'h' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            window.location.href = '/';
        }
    });

    // Analytics tracking (if needed)
    function trackEvent(category, action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
    }

    // Track clicks on thread links
    document.querySelectorAll('a[href*="/threads/"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('Navigation', 'thread_click', this.textContent);
        });
    });

    // Track search usage
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.length > 2) {
                    trackEvent('Search', 'search_query', this.value);
                }
            }, 1000);
        });
    }
});

// Utility functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (days < 7) {
        return `${days} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Export functions if needed
window.ForumUtils = {
    showNotification,
    formatDate
};

// CSS for dynamic elements
const style = document.createElement('style');
style.textContent = `
    .back-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 18px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    }

    .back-to-top.show {
        opacity: 1;
        visibility: visible;
    }

    .back-to-top:hover {
        background: var(--secondary-color);
        transform: translateY(-2px);
    }

    .copy-code-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 4px;
        padding: 5px 8px;
        font-size: 12px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
    }

    .copy-code-btn:hover {
        opacity: 1;
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 1001;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification.error {
        background: var(--error);
    }

    .notification.warning {
        background: var(--warning);
    }

    .tooltip {
        position: absolute;
        background: var(--text-primary);
        color: var(--background);
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 1002;
        pointer-events: none;
    }

    .tooltip.show {
        opacity: 1;
    }

    .tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border: 5px solid transparent;
        border-top-color: var(--text-primary);
    }

    .expandable-content {
        max-height: 200px;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }

    .expandable-content.expanded {
        max-height: none;
    }

    .expand-btn {
        background: none;
        border: none;
        color: var(--primary-color);
        cursor: pointer;
        font-size: 14px;
        margin-top: 10px;
        padding: 0;
    }

    .expand-btn:hover {
        text-decoration: underline;
    }

    .search-filters {
        display: flex;
        gap: 15px;
        margin-top: 15px;
    }

    .search-filters label {
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        color: var(--text-secondary);
    }

    .search-filters input[type="radio"] {
        margin: 0;
    }

    .search-placeholder {
        text-align: center;
        padding: 60px 20px;
        color: var(--text-light);
    }

    .search-placeholder i {
        font-size: 3rem;
        margin-bottom: 20px;
        opacity: 0.5;
    }

    .result-type {
        background: var(--primary-color);
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 11px;
        text-transform: uppercase;
        margin-right: 10px;
    }

    @media (max-width: 768px) {
        .back-to-top {
            bottom: 15px;
            right: 15px;
            width: 45px;
            height: 45px;
            font-size: 16px;
        }

        .notification {
            right: 15px;
            left: 15px;
            top: 15px;
        }

        .search-filters {
            flex-wrap: wrap;
            gap: 10px;
        }
    }
`;

document.head.appendChild(style);
