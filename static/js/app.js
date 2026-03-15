/**
 * Modern JavaScript Framework for Inventory Management System
 */

class IMSApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.setupAnimations();
        this.setupNavigation();
        this.initTooltips();
        this.initLoadingStates();
        this.initCharts();
    }

    setupEventListeners() {
        // Dropdown toggle for mobile/click interaction
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Dropdown toggle clicked');
                
                const parent = toggle.closest('.dropdown') || toggle.closest('.nav-item.dropdown');
                if (!parent) {
                    console.error('No dropdown parent found');
                    return;
                }
                
                const menu = parent.querySelector('.dropdown-menu');
                if (!menu) {
                    console.error('No dropdown menu found in parent');
                    return;
                }
                
                const isVisible = menu.classList.contains('show');
                
                // Close all other dropdowns and remove z-index from their cards
                document.querySelectorAll('.dropdown-menu').forEach(m => {
                    m.classList.remove('show');
                    const card = m.closest('.card');
                    if (card) card.classList.remove('has-open-dropdown');
                });
                
                // Toggle current
                if (isVisible) {
                    menu.classList.remove('show');
                    const card = parent.closest('.card');
                    if (card) card.classList.remove('has-open-dropdown');
                } else {
                    menu.classList.add('show');
                    const card = parent.closest('.card');
                    if (card) card.classList.add('has-open-dropdown');
                    console.log('Menu is now visible');
                }
            });
        });

        // Close dropdowns on outside click
        window.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown') && !e.target.closest('.nav-item.dropdown')) {
                document.querySelectorAll('.dropdown-menu').forEach(m => {
                    m.classList.remove('show');
                    const card = m.closest('.card');
                    if (card) card.classList.remove('has-open-dropdown');
                });
            }
        });

        // Navigation active state
        this.setupNavigation();
    }

    initializeComponents() {
        // Initialize tooltips
        this.initTooltips();
        
        // Initialize loading states
        this.initLoadingStates();
        
        // Initialize charts if Chart.js is available
        if (typeof Chart !== 'undefined') {
            this.initCharts();
        }
    }

    setupAnimations() {
        // Add fade-in animation to cards
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });

        // Add slide-in animation to tables
        const tables = document.querySelectorAll('.table-container');
        tables.forEach((table, index) => {
            table.style.animationDelay = `${index * 0.2}s`;
            table.classList.add('slide-in');
        });

        // Add scale-in animation to stats cards
        const statsCards = document.querySelectorAll('.stats-card');
        statsCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.15}s`;
            card.classList.add('scale-in');
        });
    }

    setupNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Sanitize the message to prevent XSS and garbled text
        const sanitizedMessage = this.sanitizeMessage(message);
        
        const notification = document.createElement('div');
        notification.className = `notification alert alert-${type === 'error' ? 'danger' : type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
            box-shadow: var(--shadow-lg);
            border-radius: var(--border-radius-lg);
        `;
        
        notification.innerHTML = `
            <div class="d-flex justify-between items-center">
                <span>${sanitizedMessage}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; font-size: 1.2rem; cursor: pointer; margin-left: 1rem; color: inherit;">
                    ×
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    sanitizeMessage(message) {
        // Basic sanitization to prevent XSS and garbled text
        if (typeof message !== 'string') {
            return 'Operation completed';
        }
        
        // Remove any potential script tags and limit length
        return message
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/[<>]/g, '')
            .substring(0, 200);
    }

    initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', this.showTooltip.bind(this));
            element.addEventListener('mouseleave', this.hideTooltip.bind(this));
        });
    }

    showTooltip(event) {
        const element = event.target;
        const tooltipText = element.getAttribute('data-tooltip');
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--gray-900);
            color: var(--white);
            padding: 0.5rem 0.75rem;
            border-radius: var(--border-radius);
            font-size: 0.875rem;
            z-index: 1000;
            pointer-events: none;
            white-space: nowrap;
            box-shadow: var(--shadow-lg);
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        
        element.tooltip = tooltip;
    }

    hideTooltip(event) {
        const element = event.target;
        if (element.tooltip) {
            element.tooltip.remove();
            element.tooltip = null;
        }
    }

    initLoadingStates() {
        const loadingButtons = document.querySelectorAll('[data-loading]');
        loadingButtons.forEach(button => {
            button.addEventListener('click', this.handleLoadingButton.bind(this));
        });
    }

    async handleLoadingButton(event) {
        const button = event.target;
        const originalText = button.innerHTML;
        
        button.innerHTML = '<span class="spinner"></span> Loading...';
        button.disabled = true;
        
        try {
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 2000));
        } finally {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }

    showLoading(element) {
        // Remove any existing loading overlay first
        this.hideLoading(element);
        
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = '<div class="spinner"></div>';
        
        // Ensure element has relative positioning
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        
        element.appendChild(loadingOverlay);
        element.loadingOverlay = loadingOverlay;
        
        // Store original button state if it's a button
        if (element.tagName === 'BUTTON' || element.querySelector('button')) {
            const button = element.tagName === 'BUTTON' ? element : element.querySelector('button');
            if (button) {
                button.originalText = button.innerHTML;
                button.innerHTML = '<span class="spinner"></span> Processing...';
                button.disabled = true;
            }
        }
    }

    hideLoading(element) {
        if (element.loadingOverlay) {
            element.loadingOverlay.remove();
            element.loadingOverlay = null;
        }
        
        // Restore button state if it was modified
        if (element.tagName === 'BUTTON' || element.querySelector('button')) {
            const button = element.tagName === 'BUTTON' ? element : element.querySelector('button');
            if (button && button.originalText) {
                button.innerHTML = button.originalText;
                button.disabled = false;
                delete button.originalText;
            }
        }
    }

    initCharts() {
        // Initialize Chart.js charts if needed
        const chartElements = document.querySelectorAll('[data-chart]');
        chartElements.forEach(element => {
            const chartType = element.getAttribute('data-chart');
            const chartData = JSON.parse(element.getAttribute('data-chart-data') || '{}');
            this.createChart(element, chartType, chartData);
        });
    }

    createChart(element, type, data) {
        const ctx = element.getContext('2d');
        new Chart(ctx, {
            type: type,
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatNumber(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatDateTime(date) {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new IMSApp();
    } catch (error) {
        console.error('Failed to initialize IMS App:', error);
        // Show a fallback notification
        const notification = document.createElement('div');
        notification.className = 'alert alert-danger';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 1rem;
            background: #fef2f2;
            border: 1px solid #dc2626;
            border-radius: 0.5rem;
            color: #dc2626;
        `;
        notification.textContent = 'Application initialization failed. Please refresh the page.';
        document.body.appendChild(notification);
    }
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Don't show notification for every error, just log them
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Don't show notification for every rejection, just log them
});

// Global utility functions
window.IMSApp = IMSApp; 