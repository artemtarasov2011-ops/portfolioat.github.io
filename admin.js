// Admin Panel JavaScript

// Storage Keys
const STORAGE_KEY_PROJECTS = 'portfolio_projects';
const STORAGE_KEY_PASSWORD = 'admin_password';
const STORAGE_KEY_PHOTOS = 'portfolio_photos';
const STORAGE_KEY_CONTACTS = 'portfolio_contacts';
const DEFAULT_PASSWORD = 'Tema36Tar';

// State
let projects = [];
let currentEditingId = null;
let deleteProjectId = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadProjects();
    loadPhotos();
    loadContacts();
    setupEventListeners();
});

// Authentication
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
    if (isAuthenticated) {
        showAdminPanel();
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
}

function showAdminPanel() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    loadProjects();
    updateStats();
}

function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Add project buttons
    document.getElementById('add-project-btn').addEventListener('click', () => openProjectModal());
    document.getElementById('add-first-project-btn').addEventListener('click', () => openProjectModal());
    
    // Project form
    document.getElementById('project-form').addEventListener('submit', handleProjectSubmit);
    
    // Modal controls
    document.getElementById('close-modal').addEventListener('click', closeProjectModal);
    document.getElementById('cancel-btn').addEventListener('click', closeProjectModal);
    
    // Delete modal
    document.getElementById('confirm-delete').addEventListener('click', confirmDelete);
    document.getElementById('cancel-delete').addEventListener('click', closeDeleteModal);
    
    // Photo management
    document.getElementById('save-profile-photo').addEventListener('click', () => savePhoto('profile'));
    document.getElementById('save-about-photo').addEventListener('click', () => savePhoto('about'));
    
    // Photo URL input preview
    document.getElementById('profile-photo-url').addEventListener('input', function() {
        updatePhotoPreview('profile', this.value);
    });
    
    document.getElementById('about-photo-url').addEventListener('input', function() {
        updatePhotoPreview('about', this.value);
    });
    
    // Settings
    document.getElementById('save-password').addEventListener('click', savePassword);
    document.getElementById('save-contacts').addEventListener('click', saveContacts);
    
    // Close modals on backdrop click
    document.getElementById('project-modal').addEventListener('click', function(e) {
        if (e.target === this) closeProjectModal();
    });
    
    document.getElementById('delete-modal').addEventListener('click', function(e) {
        if (e.target === this) closeDeleteModal();
    });
}

function handleLogin(e) {
    e.preventDefault();
    const passwordInput = document.getElementById('admin-password');
    const enteredPassword = passwordInput.value;
    const savedPassword = localStorage.getItem(STORAGE_KEY_PASSWORD) || DEFAULT_PASSWORD;
    
    const errorDiv = document.getElementById('login-error');
    
    if (enteredPassword === savedPassword) {
        sessionStorage.setItem('admin_authenticated', 'true');
        passwordInput.value = '';
        errorDiv.classList.add('hidden');
        showAdminPanel();
    } else {
        errorDiv.classList.remove('hidden');
        passwordInput.focus();
    }
}

function handleLogout() {
    sessionStorage.removeItem('admin_authenticated');
    showLoginScreen();
}

// Projects Management
function loadProjects() {
    const savedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
    } else {
        // Load default projects if no saved projects
        projects = getDefaultProjects();
        saveProjects();
    }
    renderProjects();
    updateStats();
}

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
        }
    ];
}

function saveProjects() {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    updateStats();
}

function renderProjects() {
    const projectsList = document.getElementById('projects-list');
    const emptyState = document.getElementById('empty-state');
    
    if (projects.length === 0) {
        projectsList.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    projectsList.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    projectsList.innerHTML = projects.map(project => `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="flex flex-col md:flex-row gap-6">
                <div class="flex-shrink-0">
                    <img 
                        src="${project.image}" 
                        alt="${project.title}"
                        class="w-full md:w-48 h-32 object-cover rounded-lg"
                        onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'"
                    >
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <span class="inline-block px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light rounded-full text-sm font-medium mb-2">
                                ${getCategoryName(project.category)}
                            </span>
                            <h3 class="text-xl font-bold text-dark dark:text-light">${project.title}</h3>
                        </div>
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">${project.description}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${project.technologies.map(tech => 
                            `<span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">${tech}</span>`
                        ).join('')}
                    </div>
                    <div class="flex gap-3">
                        <button 
                            onclick="editProject(${project.id})"
                            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                        >
                            <i class="fas fa-edit mr-2"></i>Редактировать
                        </button>
                        <button 
                            onclick="deleteProject(${project.id})"
                            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            <i class="fas fa-trash mr-2"></i>Удалить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function getCategoryName(category) {
    const categories = {
        "web": "Веб-разработка",
        "mobile": "Мобильные приложения",
        "design": "Дизайн"
    };
    return categories[category] || category;
}

function updateStats() {
    document.getElementById('total-projects').textContent = projects.length;
    document.getElementById('web-projects').textContent = projects.filter(p => p.category === 'web').length;
    document.getElementById('mobile-projects').textContent = projects.filter(p => p.category === 'mobile').length;
}

// Project Modal
function openProjectModal(projectId = null) {
    const modal = document.getElementById('project-modal');
    const form = document.getElementById('project-form');
    const title = document.getElementById('modal-title');
    
    currentEditingId = projectId;
    
    if (projectId) {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            title.textContent = 'Редактировать проект';
            document.getElementById('project-id').value = project.id;
            document.getElementById('project-title').value = project.title;
            document.getElementById('project-category').value = project.category;
            document.getElementById('project-description').value = project.description;
            document.getElementById('project-image').value = project.image;
            document.getElementById('project-technologies').value = project.technologies.join(', ');
            document.getElementById('project-live-url').value = project.liveUrl || '';
            document.getElementById('project-github-url').value = project.githubUrl || '';
        }
    } else {
        title.textContent = 'Добавить проект';
        form.reset();
        document.getElementById('project-id').value = '';
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    document.getElementById('form-error').classList.add('hidden');
    currentEditingId = null;
}

function handleProjectSubmit(e) {
    e.preventDefault();
    
    const errorDiv = document.getElementById('form-error');
    errorDiv.classList.add('hidden');
    
    const formData = {
        id: currentEditingId || Date.now(),
        title: document.getElementById('project-title').value.trim(),
        category: document.getElementById('project-category').value,
        description: document.getElementById('project-description').value.trim(),
        image: document.getElementById('project-image').value.trim(),
        technologies: document.getElementById('project-technologies').value.split(',').map(t => t.trim()).filter(t => t),
        liveUrl: document.getElementById('project-live-url').value.trim() || '#',
        githubUrl: document.getElementById('project-github-url').value.trim() || '#'
    };
    
    // Validation
    if (!formData.title || !formData.category || !formData.description || !formData.image || formData.technologies.length === 0) {
        showError('Заполните все обязательные поля');
        return;
    }
    
    if (currentEditingId) {
        // Update existing project
        const index = projects.findIndex(p => p.id === currentEditingId);
        if (index !== -1) {
            projects[index] = formData;
        }
    } else {
        // Add new project
        projects.push(formData);
    }
    
    saveProjects();
    renderProjects();
    closeProjectModal();
    
    // Show success message
    showNotification('Проект успешно сохранен!', 'success');
}

function showError(message) {
    const errorDiv = document.getElementById('form-error');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorDiv.classList.remove('hidden');
}

// Delete Project
function deleteProject(projectId) {
    deleteProjectId = projectId;
    document.getElementById('delete-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.add('hidden');
    document.body.style.overflow = '';
    deleteProjectId = null;
}

function confirmDelete() {
    if (deleteProjectId) {
        projects = projects.filter(p => p.id !== deleteProjectId);
        saveProjects();
        renderProjects();
        closeDeleteModal();
        showNotification('Проект удален', 'success');
    }
}

// Global functions for onclick handlers
window.editProject = editProject;
window.deleteProject = deleteProject;

function editProject(projectId) {
    openProjectModal(projectId);
}

// Photos Management
function loadPhotos() {
    const savedPhotos = localStorage.getItem(STORAGE_KEY_PHOTOS);
    const photos = savedPhotos ? JSON.parse(savedPhotos) : {
        profile: 'images/photo.jpg',
        about: 'images/photo-about.jpg'
    };
    
    // Update inputs
    const profileInput = document.getElementById('profile-photo-url');
    const aboutInput = document.getElementById('about-photo-url');
    
    if (profileInput) profileInput.value = photos.profile || 'images/photo.jpg';
    if (aboutInput) aboutInput.value = photos.about || 'images/photo-about.jpg';
    
    // Update previews
    updatePhotoPreview('profile', photos.profile || 'images/photo.jpg');
    updatePhotoPreview('about', photos.about || 'images/photo-about.jpg');
}

function savePhoto(type) {
    const urlInput = document.getElementById(`${type}-photo-url`);
    if (!urlInput) return;
    
    const url = urlInput.value.trim();
    
    if (!url) {
        showNotification('Введите URL изображения', 'error');
        return;
    }
    
    // Load existing photos
    const savedPhotos = localStorage.getItem(STORAGE_KEY_PHOTOS);
    const photos = savedPhotos ? JSON.parse(savedPhotos) : {};
    
    // Update photo
    photos[type] = url;
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(photos));
    
    // Update preview
    updatePhotoPreview(type, url);
    
    showNotification('Фото успешно сохранено!', 'success');
}

function updatePhotoPreview(type, url) {
    const preview = document.getElementById(`${type}-photo-preview`);
    if (preview && url) {
        preview.src = url;
        preview.onerror = function() {
            // Fallback to placeholder
            if (type === 'profile') {
                this.src = 'https://picsum.photos/200/200?random=1';
            } else {
                this.src = 'https://picsum.photos/500/400?random=2';
            }
        };
    }
}

// Contacts Management
function loadContacts() {
    const savedContacts = localStorage.getItem(STORAGE_KEY_CONTACTS);
    const contacts = savedContacts ? JSON.parse(savedContacts) : {
        email: 'hello@portfolio.com',
        phone: '8 925 987-15-81'
    };
    
    // Update inputs
    const emailInput = document.getElementById('contact-email');
    const phoneInput = document.getElementById('contact-phone');
    
    if (emailInput) emailInput.value = contacts.email || 'hello@portfolio.com';
    if (phoneInput) phoneInput.value = contacts.phone || '8 925 987-15-81';
}

function saveContacts() {
    const emailInput = document.getElementById('contact-email');
    const phoneInput = document.getElementById('contact-phone');
    
    if (!emailInput || !phoneInput) return;
    
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    
    if (!email || !phone) {
        showNotification('Заполните все поля', 'error');
        return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Введите корректный email адрес', 'error');
        return;
    }
    
    // Save contacts
    const contacts = {
        email: email,
        phone: phone
    };
    
    localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(contacts));
    showNotification('Контактная информация сохранена!', 'success');
}

// Password Management
function savePassword() {
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const errorDiv = document.getElementById('password-error');
    
    if (!currentPasswordInput || !newPasswordInput || !confirmPasswordInput) return;
    
    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Clear previous errors
    errorDiv.classList.add('hidden');
    errorDiv.textContent = '';
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        errorDiv.textContent = 'Заполните все поля';
        errorDiv.classList.remove('hidden');
        return;
    }
    
    // Check current password
    const savedPassword = localStorage.getItem(STORAGE_KEY_PASSWORD) || DEFAULT_PASSWORD;
    if (currentPassword !== savedPassword) {
        errorDiv.textContent = 'Неверный текущий пароль';
        errorDiv.classList.remove('hidden');
        return;
    }
    
    // Check password match
    if (newPassword !== confirmPassword) {
        errorDiv.textContent = 'Пароли не совпадают';
        errorDiv.classList.remove('hidden');
        return;
    }
    
    // Check password length
    if (newPassword.length < 4) {
        errorDiv.textContent = 'Пароль должен содержать минимум 4 символа';
        errorDiv.classList.remove('hidden');
        return;
    }
    
    // Save new password
    localStorage.setItem(STORAGE_KEY_PASSWORD, newPassword);
    
    // Clear inputs
    currentPasswordInput.value = '';
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';
    
    showNotification('Пароль успешно изменен!', 'success');
}

// Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white`;
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Export projects to main portfolio
function exportProjects() {
    return projects;
}

