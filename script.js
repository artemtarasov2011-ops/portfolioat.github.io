// Projects Data - Load from localStorage or use default
const STORAGE_KEY_PROJECTS = 'portfolio_projects';

function getDefaultProjects() {
    return [
        {
            "id": 1,
            "title": "Интернет-магазин",
            "description": "Современное e-commerce решение с бесшовным пользовательским опытом и безопасной интеграцией платежей.",
            "category": "web",
            "image": "https://picsum.photos/400/300?random=3",
            "technologies": ["React", "Node.js", "MongoDB"],
            "liveUrl": "#",
            "githubUrl": "#"
        },
        {
            "id": 2,
            "title": "Мобильное банковское приложение",
            "description": "Безопасное и интуитивное мобильное банковское приложение с расширенными финансовыми функциями.",
            "category": "mobile",
            "image": "https://picsum.photos/400/300?random=4",
            "technologies": ["React Native", "Firebase", "Stripe"],
            "liveUrl": "#",
            "githubUrl": "#"
        },
        {
            "id": 3,
            "title": "Сайт-портфолио",
            "description": "Элегантный сайт-портфолио для демонстрации творческих работ с плавными анимациями.",
            "category": "design",
            "image": "https://picsum.photos/400/300?random=5",
            "technologies": ["HTML", "CSS", "JavaScript"],
            "liveUrl": "#",
            "githubUrl": "#"
        },
        {
            "id": 4,
            "title": "Инструмент управления задачами",
            "description": "Платформа для совместного управления задачами с обновлениями в реальном времени и функциями для команд.",
            "category": "web",
            "image": "https://picsum.photos/400/300?random=6",
            "technologies": ["Vue.js", "Express", "PostgreSQL"],
            "liveUrl": "#",
            "githubUrl": "#"
        },
        {
            "id": 5,
            "title": "Погодная панель",
            "description": "Интерактивная погодная панель с красивой визуализацией данных и прогнозами по местоположению.",
            "category": "web",
            "image": "https://picsum.photos/400/300?random=7",
            "technologies": ["JavaScript", "Chart.js", "API Integration"],
            "liveUrl": "#",
            "githubUrl": "#"
        },
        {
            "id": 6,
            "title": "Социальная платформа",
            "description": "Функциональная социальная платформа с обменом сообщениями в реальном времени и возможностью делиться контентом.",
            "category": "web",
            "image": "https://picsum.photos/400/300?random=8",
            "technologies": ["React", "Socket.io", "MongoDB"],
            "liveUrl": "#",
            "githubUrl": "#"
        },
        {
            "id": 7,
            "title": "Приложение для фитнеса",
            "description": "Мобильное приложение для отслеживания тренировок и питания с персонализированными рекомендациями.",
            "category": "mobile",
            "image": "https://picsum.photos/400/300?random=9",
            "technologies": ["Flutter", "Firebase", "Health API"],
            "liveUrl": "#",
            "githubUrl": "#"
        },
        {
            "id": 8,
            "title": "Лендинг для SaaS",
            "description": "Привлекательный лендинг для SaaS-продукта с высокой конверсией и адаптивным дизайном.",
            "category": "design",
            "image": "https://picsum.photos/400/300?random=10",
            "technologies": ["HTML", "Tailwind CSS", "JavaScript"],
            "liveUrl": "#",
            "githubUrl": "#"
        }
    ];
}

function loadProjects() {
    const savedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (savedProjects) {
        try {
            return JSON.parse(savedProjects);
        } catch (e) {
            console.error('Error loading projects from localStorage:', e);
            return getDefaultProjects();
        }
    }
    return getDefaultProjects();
}

// Load projects from localStorage or use defaults
let projects = loadProjects();

// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        this.init();
    }

    init() {
        this.applyTheme(this.theme);
        this.setupEventListeners();
    }

    applyTheme(theme) {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
        this.theme = theme;
    }

    toggle() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    setupEventListeners() {
        const toggleButtons = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => this.toggle());
        });
    }
}

// Navigation
function navigateTo(section) {
    const element = document.getElementById(section);
    if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    
    // Close mobile menu if open
    const mobileMenu = document.getElementById("mobile-menu");
    const menuButton = document.getElementById("mobile-menu-button");
    if (!mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
        menuButton.setAttribute("aria-expanded", "false");
    }
}

// Generate Project Cards
function generateProjectCards(filter = "all", limit = 6) {
    // Reload projects from localStorage to get latest updates
    projects = loadProjects();
    
    const projectsGrid = document.getElementById("projects-grid");
    const loadingIndicator = document.getElementById("projects-loading");
    
    // Show loading
    loadingIndicator.classList.remove("hidden");
    projectsGrid.innerHTML = "";
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        const filteredProjects = filter === "all" 
            ? projects 
            : projects.filter(project => project.category === filter);
        
        const projectsToShow = filteredProjects.slice(0, limit);
        
        projectsToShow.forEach((project, index) => {
            const projectCard = document.createElement("article");
            projectCard.className = "project-card bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden animate-slide-up";
            projectCard.style.animationDelay = `${index * 0.1}s`;
            projectCard.setAttribute("role", "listitem");
            
            projectCard.innerHTML = `
                <div class="relative overflow-hidden">
                    <img 
                        src="${project.image}" 
                        alt="${project.title}" 
                        class="w-full h-48 object-cover"
                        loading="lazy"
                        width="400"
                        height="300"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div class="flex gap-4">
                            <a href="${project.liveUrl}" 
                               class="bg-white text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
                               aria-label="Посмотреть демо ${project.title}">
                                <i class="fas fa-external-link-alt mr-2"></i>Демо
                            </a>
                            <a href="${project.githubUrl}" 
                               class="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                               aria-label="Посмотреть код ${project.title}">
                                <i class="fab fa-github mr-2"></i>Код
                            </a>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <span class="text-primary dark:text-primary-light text-sm font-semibold">${getCategoryName(project.category)}</span>
                    <h3 class="text-xl font-bold text-dark dark:text-light mt-2 mb-3">${project.title}</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">${project.description}</p>
                    <div class="flex flex-wrap gap-2">
                        ${project.technologies.map(tech => 
                            `<span class="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm">${tech}</span>`
                        ).join("")}
                    </div>
                </div>
            `;
            
            projectsGrid.appendChild(projectCard);
        });
        
        // Lazy load images
        lazyLoadImages();
        
        // Hide loading
        loadingIndicator.classList.add("hidden");
        
        // Show/hide load more button
        const loadMoreBtn = document.getElementById("load-more");
        if (filteredProjects.length > limit) {
            loadMoreBtn.classList.remove("hidden");
            loadMoreBtn.setAttribute("data-limit", limit);
            loadMoreBtn.setAttribute("data-filter", filter);
        } else {
            loadMoreBtn.classList.add("hidden");
        }
    }, 300);
}

// Lazy Load Images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => img.classList.add('loaded'));
    }
}

// Get Category Name in Russian
function getCategoryName(category) {
    const categories = {
        "web": "Веб-разработка",
        "mobile": "Мобильные приложения",
        "design": "Дизайн"
    };
    return categories[category] || category;
}

// Form Validation
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = this.form.querySelectorAll('input[required], textarea[required]');
        this.init();
    }

    init() {
        this.fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearError(field));
        });
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validateField(field) {
        const errorElement = field.parentElement.querySelector('.error-message');
        let isValid = true;
        let errorMessage = '';

        // Check if empty
        if (field.value.trim() === '') {
            isValid = false;
            errorMessage = 'Это поле обязательно для заполнения';
        }
        // Email validation
        else if (field.type === 'email' && !this.isValidEmail(field.value)) {
            isValid = false;
            errorMessage = 'Введите корректный email адрес';
        }
        // Message length validation
        else if (field.id === 'message' && field.value.trim().length < 10) {
            isValid = false;
            errorMessage = 'Сообщение должно содержать минимум 10 символов';
        }

        if (!isValid) {
            this.showError(field, errorMessage);
            field.setAttribute('aria-invalid', 'true');
        } else {
            this.clearError(field);
            field.setAttribute('aria-invalid', 'false');
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(field, message) {
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
        field.classList.add('border-red-500');
    }

    clearError(field) {
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
        field.classList.remove('border-red-500');
    }

    validateForm() {
        let isFormValid = true;
        this.fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });
        return isFormValid;
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const submitBtn = document.getElementById('submit-btn');
        const submitText = submitBtn.querySelector('.submit-text');
        const submitLoading = submitBtn.querySelector('.submit-loading');
        const successMessage = document.getElementById('form-success');
        const errorMessage = document.getElementById('form-error');

        // Show loading state
        submitBtn.disabled = true;
        submitText.classList.add('hidden');
        submitLoading.classList.remove('hidden');
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');

        // Simulate form submission
        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value
        };

        try {
            // Here you would typically send the data to a server
            // const response = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            successMessage.classList.remove('hidden');
            this.form.reset();
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        } catch (error) {
            errorMessage.classList.remove('hidden');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitText.classList.remove('hidden');
            submitLoading.classList.add('hidden');
        }
    }
}

// Intersection Observer for Section Animations
function setupIntersectionObserver() {
    const sections = document.querySelectorAll('.section-hidden');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Active Navigation Highlighting
function setupActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active-nav');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active-nav');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Back to Top Button
function setupBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.remove('hidden');
        } else {
            backToTopBtn.classList.add('hidden');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    menuButton.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden');
        menuButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        
        // Change icon
        const icon = menuButton.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            menuButton.setAttribute('aria-expanded', 'false');
            const icon = menuButton.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Update Current Year
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Initialize theme manager
    const themeManager = new ThemeManager();
    
    // Reload projects from localStorage
    projects = loadProjects();
    
    // Generate initial project cards
    generateProjectCards();
    
    // Initialize form validator
    const formValidator = new FormValidator('contact-form');
    
    // Reload projects when page becomes visible (e.g., returning from admin panel)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            projects = loadProjects();
            generateProjectCards();
        }
    });
    
    // Setup filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
            });
            
            this.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
            this.classList.add('bg-primary', 'text-white');
            
            // Filter projects
            const filter = this.getAttribute('data-filter');
            generateProjectCards(filter, 6);
        });
    });
    
    // Load more projects
    document.getElementById('load-more').addEventListener('click', function() {
        const currentLimit = parseInt(this.getAttribute('data-limit')) || 6;
        const filter = this.getAttribute('data-filter') || 'all';
        const newLimit = currentLimit + 3;
        generateProjectCards(filter, newLimit);
    });
    
    // Setup intersection observer
    setupIntersectionObserver();
    
    // Setup active navigation
    setupActiveNav();
    
    // Setup back to top button
    setupBackToTop();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Update current year
    updateCurrentYear();
    
    // Lazy load initial images
    lazyLoadImages();
    
    // Prevent form submission on Enter in textarea (allow Shift+Enter for new line)
    const messageField = document.getElementById('message');
    if (messageField) {
        messageField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
            }
        });
    }
    
    // Setup admin login modal
    setupAdminLogin();
});

// Admin Login Modal
function setupAdminLogin() {
    const ADMIN_PASSWORD = 'Tema36Tar';
    const loginModal = document.getElementById('admin-login-modal');
    const loginForm = document.getElementById('admin-login-form');
    const passwordInput = document.getElementById('admin-password-input');
    const errorDiv = document.getElementById('admin-login-error');
    const closeBtn = document.getElementById('close-admin-modal');
    
    // Open modal buttons
    const openButtons = [
        document.getElementById('admin-login-btn'),
        document.getElementById('admin-login-btn-mobile')
    ];
    
    openButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                loginModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                passwordInput.focus();
            });
        }
    });
    
    // Close modal
    function closeModal() {
        loginModal.classList.add('hidden');
        document.body.style.overflow = '';
        passwordInput.value = '';
        errorDiv.classList.add('hidden');
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close on backdrop click
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            closeModal();
        }
    });
    
    // Handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredPassword = passwordInput.value;
            const savedPassword = localStorage.getItem('admin_password') || ADMIN_PASSWORD;
            
            if (enteredPassword === savedPassword) {
                // Set session
                sessionStorage.setItem('admin_authenticated', 'true');
                // Redirect to admin panel
                window.location.href = 'admin.html';
            } else {
                errorDiv.classList.remove('hidden');
                passwordInput.focus();
                passwordInput.select();
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !loginModal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations or heavy operations
    } else {
        // Resume operations
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { projects, navigateTo, generateProjectCards };
}

