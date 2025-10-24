// UI interactions and enhancements

// HATA 4 DÜZELTMESİ: Fonksiyonu export et
export const initUI = () => {
    initDropdowns();
    initMobileMenu();
    initImageZoom();
    initSorting();
    initLoaders();
    initModals(); // Modal mantığını başlat

    console.log('✅ UI module initialized');
};

// Dropdown functionality
const initDropdowns = () => {
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

        // Image zoom on hover (desktop) - Basit scale efekti
        if (window.innerWidth > 768) {
             // Not: Daha gelişmiş bir zoom için kütüphane gerekebilir.
             // Şimdilik basit bir scale efekti eklendi.
            mainImage.parentElement.style.overflow = 'hidden'; // Ensure image stays within bounds
            mainImage.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = mainImage.getBoundingClientRect();
                const x = (e.clientX - left) / width * 100;
                const y = (e.clientY - top) / height * 100;
                mainImage.style.transformOrigin = `${x}% ${y}%`;
                mainImage.style.transform = 'scale(1.5)'; // Zoom seviyesi
                mainImage.style.transition = 'transform 0.1s ease';
            });

            mainImage.addEventListener('mouseleave', () => {
                mainImage.style.transformOrigin = `center center`;
                mainImage.style.transform = 'scale(1)';
            });
        }
    }
};

// Sorting functionality
const initSorting = () => {
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

            params.delete('page'); // Sıralama değişince 1. sayfaya dön
            window.location.href = `/products?${params.toString()}`;
        });
    }
};

// Loading states
const initLoaders = () => {
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

                // Add loading spinner styles if not already present
                if (!document.querySelector('#loading-styles')) {
                    const styles = document.createElement('style');
                    styles.id = 'loading-styles';
                    styles.textContent = `
                        .loading-spinner {
                            display: inline-block;
                            width: 1em; /* Use em for relative sizing */
                            height: 1em;
                            border: 2px solid currentColor; /* Use currentColor */
                            border-radius: 50%;
                            border-top-color: transparent;
                            animation: spin 0.8s linear infinite; /* Faster spin */
                            margin-right: 0.5em; /* Use em */
                            vertical-align: middle; /* Align nicely with text */
                        }
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                        button:disabled .loading-spinner {
                             opacity: 0.7; /* Slightly dim spinner when disabled */
                        }
                    `;
                    document.head.appendChild(styles);
                }
            }
        });
    });

    // Product card loading hint on navigation
    const productCards = document.querySelectorAll('.product-card a'); // Target links inside cards
    productCards.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add a visual hint immediately, e.g., slightly dimming the card
             const card = link.closest('.product-card');
             if (card) {
                card.style.opacity = '0.7';
                card.style.transition = 'opacity 0.2s ease';
             }
            // Allow default navigation
        });
    });
};

// Confirmation Modal functionality
const initModals = () => {
    let targetForm = null;

    // Tüm modal tetikleyicilerini (butonları) bul
    const modalToggles = document.querySelectorAll('[data-modal-toggle]');
    modalToggles.forEach(toggleBtn => {
        const modalId = toggleBtn.dataset.modalToggle;
        const modal = document.getElementById(modalId);

        if (!modal) {
            console.warn(`Modal with ID "${modalId}" not found for toggle button.`);
            return;
        }

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent potential parent clicks closing modal immediately
            // Hedef formun ID'sini butonun 'data' özelliğinden al
            const formSelector = toggleBtn.dataset.modalFormTarget;
            targetForm = document.querySelector(formSelector);

            if (targetForm) {
                modal.classList.add('show');
                // Focus the first focusable element (cancel button often) for accessibility
                const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (firstFocusable) firstFocusable.focus();
            } else {
                console.error(`Modal target form "${formSelector}" not found.`);
            }
        });
    });

    // Tüm modalları bul (kapatma ve onay işlemleri için)
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        const modalId = modal.id;
        const closeBtns = modal.querySelectorAll(`[data-modal-close="${modalId}"]`);
        const confirmBtn = document.getElementById(`${modalId}-confirm-btn`);

        // Kapatma butonları
        closeBtns.forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
                targetForm = null; // Form hedefini temizle
            });
        });

        // Onay butonu
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (targetForm) {
                    // Formu submit etmeden önce butona loading state ekle
                    confirmBtn.disabled = true;
                    confirmBtn.innerHTML = `<span class="loading-spinner"></span> ${confirmBtn.textContent}`;
                    targetForm.submit(); // Hedef formu gönder
                } else {
                    console.error('Modal confirm error: Target form is not set.');
                    modal.classList.remove('show'); // Yine de modalı kapat
                }
                // Form submit olacağı için modalı kapatmaya gerek yok, sayfa yenilenecek.
                // targetForm = null; // targetForm zaten submit sonrası geçersiz olacak
            });
        }

        // Overlay'e tıklayarak kapatma
        modal.addEventListener('click', (e) => {
            // Sadece overlay'in kendisine tıklandıysa kapat (içeriğe tıklanınca kapanmasın)
            if (e.target === modal) {
                modal.classList.remove('show');
                targetForm = null;
            }
        });
    });

    // ESC tuşu ile kapatma
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal-overlay.show');
            if (openModal) {
                openModal.classList.remove('show');
                targetForm = null;
            }
        }
    });

    console.log('✅ Modals module initialized');
};


// HATA 4 DÜZELTMESİ: window global ataması kaldırıldı.
// window.initUI = initUI;
