// UI interactions and enhancements

const initUI = () => {
    initDropdowns();
    initMobileMenu();
    initImageZoom();
    initSorting();
    initLoaders();
    initModals(); // YENİ EKLENDİ: Modal mantığını başlat
    
    console.log('✅ UI module initialized');
};

// Dropdown functionality
const initDropdowns = () => {
    // ... (mevcut dropdown kodu) ...
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            // Click outside to close
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    menu.classList.remove('show');
                }
            });
            
            // Toggle dropdown
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.querySelector('.dropdown-menu')?.classList.remove('show');
                    }
                });
                
                menu.classList.toggle('show');
            });
        }
    });
};

// Mobile menu functionality
const initMobileMenu = () => {
    // ... (mevcut mobil menü kodu) ...
    const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('show');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('show');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
};

// Image zoom functionality for product detail
const initImageZoom = () => {
    // ... (mevcut resim zoom kodu) ...
    const mainImage = document.querySelector('.main-image img');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && thumbnails.length > 0) {
        // Thumbnail click event
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const img = thumb.querySelector('img');
                if (img) {
                    // Update main image
                    mainImage.src = img.src;
                    
                    // Update active thumbnail
                    thumbnails.forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                }
            });
        });
        
        // Image zoom on hover (desktop)
        if (window.innerWidth > 768) {
            mainImage.addEventListener('mouseenter', () => {
                mainImage.style.transform = 'scale(1.05)';
                mainImage.style.transition = 'transform 0.3s ease';
            });
            
            mainImage.addEventListener('mouseleave', () => {
                mainImage.style.transform = 'scale(1)';
            });
        }
    }
};

// Sorting functionality
const initSorting = () => {
    // ... (mevcut sıralama kodu) ...
    const sortSelect = document.querySelector('[data-sort-select]');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const params = new URLSearchParams(window.location.search);
            
            if (sortValue) {
                params.set('sort', sortValue);
            } else {
                params.delete('sort');
            }
            
            params.delete('page');
            window.location.href = `/products?${params.toString()}`;
        });
    }
};

// Loading states
const initLoaders = () => {
    // ... (mevcut yüklenme kodu) ...
    // Add loading state to form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <span class="loading-spinner"></span>
                    İşleniyor...
                `;
                
                // Add loading spinner styles
                if (!document.querySelector('#loading-styles')) {
                    const styles = document.createElement('style');
                    styles.id = 'loading-styles';
                    styles.textContent = `
                        .loading-spinner {
                            display: inline-block;
                            width: 16px;
                            height: 16px;
                            border: 2px solid #ffffff;
                            border-radius: 50%;
                            border-top-color: transparent;
                            animation: spin 1s ease-in-out infinite;
                            margin-right: 8px;
                        }
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `;
                    document.head.appendChild(styles);
                }
            }
        });
    });
    
    // Product card loading animation
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                this.style.opacity = '0.7';
                this.style.transition = 'opacity 0.2s ease';
            }
        });
    });
};

// YENİ EKLENDİ: Confirmation Modal functionality
const initModals = () => {
    let targetForm = null;

    // Tüm modal tetikleyicilerini (butonları) bul
    const modalToggles = document.querySelectorAll('[data-modal-toggle]');
    modalToggles.forEach(toggleBtn => {
        const modalId = toggleBtn.dataset.modalToggle;
        const modal = document.getElementById(modalId);
        
        if (!modal) return;

        toggleBtn.addEventListener('click', () => {
            // Hedef formun ID'sini butonun 'data' özelliğinden al
            const formSelector = toggleBtn.dataset.modalFormTarget;
            targetForm = document.querySelector(formSelector);
            
            if (targetForm) {
                modal.classList.add('show');
            } else {
                console.error(`Modal target form "${formSelector}" not found.`);
            }
        });
    });

    // Tüm modal kapatma butonlarını bul
    const modalCloses = document.querySelectorAll('[data-modal-close]');
    modalCloses.forEach(closeBtn => {
        const modalId = closeBtn.dataset.modalClose;
        const modal = document.getElementById(modalId);
        
        if (!modal) return;

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            targetForm = null; // Form hedefini temizle
        });
    });

    // Tüm modal onay butonlarını bul (ID'ye göre)
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        const modalId = modal.id;
        const confirmBtn = document.getElementById(`${modalId}-confirm-btn`);

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (targetForm) {
                    targetForm.submit(); // Hedef formu gönder
                } else {
                    console.error('Modal confirm error: Target form is not set.');
                }
                modal.classList.remove('show');
                targetForm = null;
            });
        }

        // Overlay'e tıklayarak kapatma
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                targetForm = null;
            }
        });
    });

    // ESC tuşu ile kapatma
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                modal.classList.remove('show');
                targetForm = null;
            });
        }
    });

    console.log('✅ Modals module initialized');
};


// Export for use in other modules
window.initUI = initUI;
