// js/script.js - Optimized version
class PortfolioApp {
    constructor() {
        this.currentLang = 'fr';
        this.data = null;
        this.components = {
            'navigation-container': 'navigation',
            'hero-container': 'hero', 
            'about-container': 'about',
            'skills-container': 'skills',
            'experience-container': 'experience',
            'education-container': 'education',
            'languages-container': 'languages',
            'contact-container': 'contact',
            'footer-container': 'footer'
        };

        this.translations = {
            experience: {
                fr: 'Expérience Professionnelle',
                en: 'Professional Experience'
            },
            responsibilities: {
                fr: 'Responsabilités',
                en: 'Responsibilities'
            },
            results: {
                fr: 'Résultats',
                en: 'Results'
            },
            technologies: {
                fr: 'Technologies',
                en: 'Technologies'
            },
            skills: {
                fr: 'Compétences',
                en: 'Skills'
            },
            technicalSkills: {
                fr: 'Compétences Techniques',
                en: 'Technical Skills'
            },
            frameworks: {
                fr: 'Frameworks',
                en: 'Frameworks'
            },
            languages: {
                fr: 'Langages',
                en: 'Languages'
            },
            databases: {
                fr: 'Bases de données',
                en: 'Databases'
            },
            tools: {
                fr: 'Outils',
                en: 'Tools'
            },
            methodologies: {
                fr: 'Méthodologies',
                en: 'Methodologies'
            },
            contact: {
                fr: 'Me Contacter',
                en: 'Contact Me'
            },
            learnMore: {
                fr: 'En Savoir Plus',
                en: 'Learn More'
            }
        };

        this.bindMethods();
    }

    initMobileMenu() {
        const menuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (!menuButton || !mobileMenu) return;

        menuButton.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                // Change icon to X
                menuButton.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                `;
            } else {
                mobileMenu.classList.add('hidden');
                // Change icon back to hamburger
                menuButton.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                `;
            }
        });

        // Close mobile menu when clicking on links
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuButton.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                `;
            });
        });
    }

    // Update the init() method to call this:
    async init() {
        try {
            this.ensureDarkMode();
            
            // Hide main content but NOT the navbar
            const mainContent = document.querySelector('main') || document.body;
            mainContent.style.visibility = 'hidden';
            mainContent.style.opacity = '0';
            
            await this.loadComponents();
            await this.loadData();

            // Initialize mobile menu
            this.initMobileMenu();

            this.initEventListeners();
            this.initAnimations();
            this.initScrollToTop();

            // Show main content with smooth transition
            mainContent.style.visibility = 'visible';
            mainContent.style.opacity = '0';
            
            setTimeout(() => {
                mainContent.style.transition = 'opacity 0.4s ease-in-out';
                mainContent.style.opacity = '1';
            }, 50);
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            const mainContent = document.querySelector('main') || document.body;
            mainContent.style.visibility = 'visible';
            mainContent.style.opacity = '1';
        }
    }

    handleDocumentClick(e) {
        // Handle both desktop and mobile language toggle buttons
        if (e.target.closest('#language-toggle') || e.target.closest('#language-toggle-mobile')) {
            e.preventDefault();
            this.toggleLanguage();
        }
    }

    // Update the updateLanguageButton method
    updateLanguageButton() {
        const button = document.getElementById('language-toggle');
        const mobileButton = document.getElementById('language-toggle-mobile');
        
        if (button) {
            button.textContent = this.currentLang.toUpperCase();
        }
        if (mobileButton) {
            mobileButton.textContent = this.currentLang.toUpperCase();
        }
    }

    // Make sure toggleLanguage calls updateLanguageButton
    toggleLanguage() {
        this.currentLang = this.currentLang === 'fr' ? 'en' : 'fr';
        this.updateLanguageButton();
        this.renderAll();
    }

    bindMethods() {
        // Bind all methods for consistent context
        Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(prop => typeof this[prop] === 'function' && prop !== 'constructor')
            .forEach(method => {
                this[method] = this[method].bind(this);
            });
    }

    async loadComponents() {
        const loadPromises = Object.entries(this.components).map(async ([containerId, componentName]) => {
            try {
                const response = await fetch(`components/${componentName}.html`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const html = await response.text();
                document.getElementById(containerId).innerHTML = html;
            } catch (error) {
                console.error(`Error loading ${componentName}:`, error);
                this.showError(containerId, componentName);
            }
        });

        await Promise.all(loadPromises);
    }

    async loadData() {
        const endpoints = [
            'data/hero.json', 
            'data/about.json',
            'data/experience.json', 
            'data/education.json',
            'data/languages.json',
            'data/skills.json',
            'data/navigation.json',
            'data/contact.json'
        ];

        try {
            const [hero, about, experience, education, languages, skills, navigation, contact] = await Promise.all(
                endpoints.map(endpoint => this.fetchJSON(endpoint))
            );

            this.data = { hero, about, experience, education, languages, skills, navigation, contact };
            this.renderAll();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    async fetchJSON(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    async fetchJSON(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    initScrollToTop() {
        const goToTopBtn = document.getElementById('go-to-top');
        
        if (!goToTopBtn) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                goToTopBtn.classList.add('visible');
                goToTopBtn.classList.remove('opacity-0', 'scale-90');
            } else {
                goToTopBtn.classList.remove('visible');
                goToTopBtn.classList.add('opacity-0', 'scale-90');
            }
        });

        // Scroll to top when clicked
        goToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    ensureDarkMode() {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        localStorage.removeItem('theme');
        
        this.updateThemeMeta('#111827');
    }

    updateThemeMeta(color) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = color;
    }

    translateText(key) {
        return this.translations[key]?.[this.currentLang] || key;
    }

    getLocalizedData(data, fallbackKey = 'fr') {
        if (!data) return '';
        
        if (typeof data === 'string') return data;
        if (Array.isArray(data)) return data;
        
        return data[this.currentLang] || data[fallbackKey] || '';
    }

    renderAll() {
        this.renderNavigation();
        this.renderHero();
        this.renderAbout(); 
        this.renderExperience();
        this.renderEducation();
        this.renderLanguages();
        this.renderSkills();
        this.renderContact();
    }

    renderHero() {
        if (!this.data?.hero || !this.data?.about) return;

        const { hero } = this.data;
        
        // Name from about.json
        this.updateElementText('#name', this.getLocalizedData(hero.name));
        
        // Role from hero.json
        this.updateElementText('#role', this.getLocalizedData(hero.role));

        // Description from hero.json
        const descContainer = document.getElementById('hero-description');
        if (descContainer && hero.descriptions) {
            descContainer.innerHTML = hero.descriptions
                .map(d => `<p class="text-gray-300 md:text-lg mb-4 leading-relaxed">${this.getLocalizedData(d)}</p>`)
                .join('');
        }

        // Update button texts from hero.json
        this.updateElementText('#contact-btn', this.getLocalizedData(hero.buttons?.contact));
        this.updateElementText('#about-btn', this.getLocalizedData(hero.buttons?.about));
    }

    renderHeroDescription(descriptions) {
        const heroDescEl = document.getElementById('hero-description');
        if (!heroDescEl || !descriptions) return;

        // Vérifier si descriptions est un tableau d'objets ou de strings
        const descriptionTexts = descriptions.map(desc => {
            if (typeof desc === 'string') return desc;
            return this.getLocalizedData(desc);
        });

        heroDescEl.innerHTML = descriptionTexts
            .map(desc => `<p class="text-lg md:text-xl text-gray-400 mb-4 leading-relaxed">${desc}</p>`)
            .join('');
    }

    updateElementText(selector, text) {
        const element = document.querySelector(selector);
        if (element && text) {
            element.textContent = text;
        }
    }

    renderExperience() {
        this.updateElementText('#experience-title', this.translateText('experience'));
        
        const container = document.getElementById('experience-container');
        if (!container || !this.data?.experience) return;

        const experiences = this.data.experience.map(exp => this.createExperienceCard(exp)).join('');
        
        const listElement = container.querySelector('#experience-list');
        if (listElement) {
            listElement.innerHTML = experiences;
        }
    }

    createExperienceCard(exp) {
        const company = this.getLocalizedData(exp.company);
        const role = this.getLocalizedData(exp.role);
        const duration = this.getLocalizedData(exp.duration);
        const context = this.getLocalizedData(exp.context);
        const type = this.getLocalizedData(exp.type);
        const responsibilities = this.getLocalizedData(exp.responsibilities);
        const results = this.getLocalizedData(exp.results);
        const techStack = exp.techStack || [];

        return `
            <div class="p-6 bg-gray-900/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-800/40 backdrop-blur-sm hover:border-indigo-600/30" data-aos="fade-up">
                ${this.createExperienceHeader(company, role, type, duration)}
                ${context ? `<p class="text-gray-300 mb-4">${context}</p>` : ''}
                ${this.createListSection('responsibilities', responsibilities)}
                ${this.createListSection('results', results, 'check', 'green-400')}
                ${this.createTechStack(techStack)}
            </div>
        `;
    }

    createExperienceHeader(company, role, type, duration) {
        return `
            <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                    <h3 class="text-xl font-bold text-gray-100">${company}</h3>
                    <p class="text-indigo-400 font-medium">${role}</p>
                    ${type ? `<span class="text-sm text-gray-400 italic">${type}</span>` : ''}
                </div>
                <span class="text-gray-400 mt-2 md:mt-0 bg-gray-800/50 px-3 py-1 rounded-lg">${duration}</span>
            </div>
        `;
    }

    createListSection(type, items, icon = 'chevron-right', iconColor = 'indigo-400') {
        if (!items || !Array.isArray(items) || items.length === 0) return '';

        return `
            <div class="mb-4">
                <h4 class="text-lg font-semibold text-gray-100 mb-3">${this.translateText(type)}</h4>
                <ul class="space-y-2">
                    ${items.map(item => `
                        <li class="flex items-start text-gray-300">
                            <i class="fas fa-${icon} text-${iconColor} mt-1 mr-2 text-xs"></i>
                            <span>${item}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    createTechStack(techStack) {
        if (!techStack.length) return '';

        return `
            <div>
                <h4 class="text-lg font-semibold text-gray-100 mb-3">${this.translateText('technologies')}</h4>
                <div class="flex flex-wrap gap-2">
                    ${techStack.map(tech => `
                        <span class="px-3 py-1 bg-indigo-900/30 text-indigo-300 rounded-full text-sm border border-indigo-800/40">
                            ${tech}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderNavigation() {
        if (!this.data?.navigation) return;

        // Desktop navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            const section = link.getAttribute('href').replace('#', '');
            if (this.data.navigation[section]) {
                // Add animation delay for staggered effect
                link.style.animationDelay = `${index * 100}ms`;
                link.classList.add('animate-fade-in-up');
                
                link.textContent = this.getLocalizedData(this.data.navigation[section]);
            }
        });

        // Mobile navigation
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');
        mobileNavLinks.forEach((link, index) => {
            const section = link.getAttribute('href').replace('#', '');
            if (this.data.navigation[section]) {
                link.textContent = this.getLocalizedData(this.data.navigation[section]);
            }
        });
    }

    renderAbout() {
        const container = document.getElementById('about');
        if (!container || !this.data?.about) return;

        const about = this.data.about;

        // Title
        const titleEl = container.querySelector('h2');
        if (titleEl) titleEl.textContent = this.getLocalizedData(about.title);

        // Descriptions
        const descriptionElements = container.querySelectorAll('p.text-lg.mb-6');
        if (about.descriptions && Array.isArray(about.descriptions)) {
            about.descriptions.forEach((desc, i) => {
                if (descriptionElements[i]) {
                    descriptionElements[i].textContent = this.getLocalizedData(desc);
                }
            });
        }

        // Stats
        const statsContainer = container.querySelector('.flex.flex-wrap.gap-6');
        if (statsContainer && about.stats) {
            statsContainer.innerHTML = about.stats.map(stat => `
                <div class="flex items-center bg-gray-900/60 light:bg-white/80 rounded-xl p-4 border border-gray-800/40 light:border-gray-300/40 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 shadow-lg light:shadow-sm">
                    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-full mr-3 shadow-lg">
                        <i class="fas fa-${stat.icon} text-white"></i>
                    </div>
                    <div>
                        <p class="font-semibold text-gray-100 light:text-gray-900">${this.getLocalizedData(stat.value)}</p>
                        <p class="text-sm text-gray-500 light:text-gray-600">${this.getLocalizedData(stat.label)}</p>
                    </div>
                </div>
            `).join('');
        }

        // Skills
        const skillsContainer = container.querySelector('.grid.grid-cols-2.gap-4');
        if (skillsContainer && about.skills) {
            skillsContainer.innerHTML = about.skills.map(skill => `
                <div class="bg-gray-900/60 light:bg-white/80 p-6 rounded-xl border border-gray-800/40 light:border-gray-300/40 shadow-xl hover:shadow-2xl light:hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 group backdrop-blur-sm">
                    <div class="text-indigo-400 light:text-indigo-600 text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        <i class="fas fa-${skill.icon}"></i>
                    </div>
                    <h3 class="font-semibold mb-2 text-gray-100 light:text-gray-900">${this.getLocalizedData(skill.title)}</h3>
                    <p class="text-sm text-gray-500 light:text-gray-600">${this.getLocalizedData(skill.description)}</p>
                </div>
            `).join('');
        }
    }

    renderEducation() {
        const container = document.getElementById('education');
        if (!container || !this.data?.education) return;

        // Update section title and subtitle
        this.updateElementText('#education h2', this.getLocalizedData(this.data.education.title));
        this.updateElementText('#education p', this.getLocalizedData(this.data.education.subtitle));

        // Render education items with prominent WES badges
        const education = this.data.education.items.map(edu => `
            <div class="p-6 bg-gray-900/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-800/40 backdrop-blur-sm hover:border-indigo-600/30" data-aos="fade-up">
                <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
                    <div class="flex-1">
                        <h3 class="text-xl font-bold text-gray-100 mb-2">${edu.institution}</h3>
                        <p class="text-indigo-400 font-medium mb-3">${this.getLocalizedData(edu.degree)}</p>
                        <span class="text-gray-400 bg-gray-800/50 px-3 py-1 rounded-lg">${edu.year}</span>
                    </div>
                    ${edu.badges && edu.badges.includes('WES') ? `
                        <div class="lg:text-right">
                            <a href="https://wes.org" target="_blank" class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-green-300 rounded-lg border border-green-700/40 hover:border-green-500/60 hover:bg-green-800/40 transition-all duration-300 group">
                                <i class="fas fa-award mr-2 text-green-400"></i>
                                <span class="font-semibold">WES</span>
                                <i class="fas fa-external-link-alt ml-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                            </a>
                            <p class="text-xs text-gray-500 mt-2">Credential Evaluation</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        const listElement = container.querySelector('#education-list');
        if (listElement) {
            listElement.innerHTML = education;
        }
    }

    renderLanguages() {
    const container = document.getElementById('languages');
    if (!container || !this.data?.languages) return;

    // Update section title and subtitle
    this.updateElementText('#languages h2', this.getLocalizedData(this.data.languages.title));
    this.updateElementText('#languages p', this.getLocalizedData(this.data.languages.subtitle));

    // Render each language dynamically
    const languages = this.data.languages.items.map(lang => `
        <div class="flex justify-between items-center p-4 bg-gray-900/60 rounded-xl shadow-lg border border-gray-800/40 backdrop-blur-sm transition-all duration-300 hover:border-indigo-600/30" data-aos="fade-up">
            <span class="font-medium text-gray-100">${this.getLocalizedData(lang.language)}</span>
            <span class="text-gray-400 bg-gray-800/50 px-3 py-1 rounded-lg">${this.getLocalizedData(lang.level)}</span>
        </div>
    `).join('');

    const listElement = container.querySelector('#languages-list');
    if (listElement) {
        listElement.innerHTML = languages;
    }
    }

    // Helper method for form fields
    updateFormField(container, fieldName, contact) {
        const label = container.querySelector(`label[for="${fieldName}"]`);
        const input = container.querySelector(`#${fieldName}`);
        
        if (label) label.textContent = this.getLocalizedData(contact.form.fields[fieldName]);
        if (input) input.placeholder = this.getLocalizedData(contact.form.placeholders[fieldName]);
    }
    
    renderContact() {
        const container = document.getElementById('contact');
        if (!container || !this.data?.contact) return;

        const contact = this.data.contact;

        // Section title and subtitle
        this.updateElementText('#contact h2', this.getLocalizedData(contact.title));
        this.updateElementText('#contact p.text-center', this.getLocalizedData(contact.subtitle));

        // Contact method labels
        const contactCards = container.querySelectorAll('.grid h3');
        if (contactCards.length >= 4) {
            contactCards[0].textContent = this.getLocalizedData(contact.contactMethods.email);
            contactCards[1].textContent = this.getLocalizedData(contact.contactMethods.whatsapp);
            contactCards[2].textContent = this.getLocalizedData(contact.contactMethods.phone);
            contactCards[3].textContent = this.getLocalizedData(contact.contactMethods.location);
        }

        // Location value
        const locationValue = container.querySelector('.group:last-child p');
        if (locationValue) locationValue.textContent = this.getLocalizedData(contact.location);
    }

    renderSkills() {
        const container = document.getElementById('skills');
        if (!container || !this.data?.skills) return;

        // Update section title
        this.updateElementText('#skills h2', this.getLocalizedData(this.data.skills.title));

        const contentContainer = document.getElementById('skills-content');
        if (contentContainer) {
            const skillsHTML = this.createSkillsHTML();
            contentContainer.innerHTML = skillsHTML;
        }
    }

    createSkillsHTML() {
        const { skills } = this.data;

        return `                    
            <!-- Technical Skills -->
            <div class="mb-12" data-aos="fade-up">
                <h3 class="text-2xl font-semibold mb-6 text-gray-100 dark:text-gray-900">${this.getLocalizedData(skills.technical.title)}</h3>
                <div class="grid md:grid-cols-2 gap-6">
                    ${this.createSkillList(skills.technical.items, 'check', 'green-400')}
                </div>
            </div>

            <!-- Frameworks & Technologies -->
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                ${this.createSkillCategory(skills.frameworks, 'blue')}
                ${this.createSkillCategory(skills.languages, 'green', 100)}
                ${this.createSkillCategory(skills.databases, 'purple', 200)}
                ${this.createSkillCategory(skills.tools, 'orange', 300)}
            </div>

            <!-- Methodologies -->
            <div class="mb-12" data-aos="fade-up">
                <h3 class="text-2xl font-semibold mb-6 text-gray-100 dark:text-gray-900">${this.getLocalizedData(skills.methodologies.title)}</h3>
                <div class="grid md:grid-cols-2 gap-6">
                    ${this.createSkillList(skills.methodologies.items, 'cog', 'indigo-400')}
                </div>
            </div>


        `;
    }

    createSkillCategory(category, color, delay = 0) {
        if (!category || !category.items || !category.items.length) return '';

        return `
            <div data-aos="fade-up" data-aos-delay="${delay}">
                <h4 class="text-xl font-semibold mb-4 text-gray-100 dark:text-gray-900">${this.getLocalizedData(category.title)}</h4>
                <div class="flex flex-wrap gap-2">
                    ${category.items.map(item => `
                        <span class="px-3 py-2 bg-${color}-900/40 text-${color}-300 rounded-lg text-sm border border-${color}-800/30 backdrop-blur-sm">
                            ${typeof item === 'object' ? this.getLocalizedData(item) : item}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    }

    createSkillList(items, icon, iconColor) {
        if (!items || !items.length) return '';

        return items.map(item => `
            <div class="flex items-start space-x-3">
                <i class="fas fa-${icon} text-${iconColor} mt-1"></i>
                <p class="text-gray-400 dark:text-gray-600">${this.getLocalizedData(item)}</p>
            </div>
        `).join('');
    }


    showError(containerId, componentName) {
        document.getElementById(containerId).innerHTML = 
            `<p class="p-4 text-center text-red-500">Error loading ${componentName}</p>`;
    }

    initEventListeners() {
        document.addEventListener('click', this.handleDocumentClick);
    }

    initAnimations() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100,
            });
        }
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp().init();
});