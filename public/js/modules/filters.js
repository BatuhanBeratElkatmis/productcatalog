// Filter module for product filtering functionality

// HATA 4 DÜZELTMESİ: Fonksiyonu export et
export const initFilters = () => {
    const priceFilterForm = document.getElementById('priceFilterForm'); // ID ile seçmek daha güvenli
    // Diğer filtre formları veya seçenekleri için benzer seçiciler eklenebilir.
    const filterOptions = document.querySelectorAll('.filter-option'); // Kategoriler, rating, stok vb. linkleri
    const clearFiltersBtn = document.querySelector('.clear-filters');
    const filterTags = document.querySelectorAll('.filter-tag-remove');
    const sortSelect = document.querySelector('[data-sort-select]'); // Sıralama için ayrı bir select kullanılıyorsa

    // Price filter form submission
    if (priceFilterForm) {
        priceFilterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const params = new URLSearchParams(window.location.search); // Mevcut URL parametrelerini al

            // Fiyat parametrelerini ayarla veya kaldır
            const minPrice = formData.get('minPrice').trim();
            const maxPrice = formData.get('maxPrice').trim();

            if (minPrice) params.set('minPrice', minPrice); else params.delete('minPrice');
            if (maxPrice) params.set('maxPrice', maxPrice); else params.delete('maxPrice');

            params.delete('page'); // Fiyat filtresi değişince 1. sayfaya dön

            // Navigate to filtered URL
            window.location.href = `/products?${params.toString()}`;
        });
    }

    // Filter options (links) click handling (Category, Rating, Stock, Brand)
    filterOptions.forEach(optionLink => {
        optionLink.addEventListener('click', function(e) {
            // Prevent default link behavior, navigation is handled by href already.
            // We might add loading indicators here if needed in the future.
            // Example: Show a spinner while the page reloads.
        });
    });


    // Real-time search debouncing (Header'daki arama için)
    const searchForm = document.querySelector('.search-form'); // Header'daki form
    const searchInput = searchForm ? searchForm.querySelector('input[name="q"]') : null;

    if (searchForm && searchInput) {
        // Debounce fonksiyonunu ProductCatalog global nesnesinden al (main.js'de tanımlı varsayılır)
        // Eğer main.js'de tanımlı değilse, bu dosyaya kopyalanabilir.
        const debouncedSearch = window.ProductCatalog?.debounce((value) => {
            // Arama sayfasının URL'ini kullan
            const searchURL = new URL('/products/search', window.location.origin);
            const params = searchURL.searchParams;

            if (value.length >= 2) {
                params.set('q', value);
                // Mevcut diğer filtreleri de arama sayfasına taşıyabiliriz (isteğe bağlı)
                // const currentParams = new URLSearchParams(window.location.search);
                // currentParams.forEach((val, key) => {
                //     if (key !== 'q' && key !== 'page') params.set(key, val);
                // });
                window.location.href = searchURL.toString();
            } else if (value.length === 0 && window.location.pathname.includes('/search')) {
                // Arama temizlendiğinde ürünler sayfasına dön
                 window.location.href = '/products';
            }
            // 2 karakterden azsa bir şey yapma (veya bir mesaj göster)

        }, 400); // 400ms bekleme süresi

        // Submit olayını engelle, debounce halledecek
        searchForm.addEventListener('submit', (e) => {
             e.preventDefault();
             // İsteğe bağlı: Enter'a basıldığında debounce'u tetikle veya hemen gönder
             debouncedSearch(searchInput.value.trim());
        });

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value.trim());
        });
    }


    // Clear all filters button
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/products'; // Sadece ürünler sayfasına yönlendir
        });
    }

    // Active filter tags removal
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const filterType = this.dataset.filterType;
            // const filterValue = this.dataset.filterValue; // Değere gerek yok, sadece tipi sil

            const params = new URLSearchParams(window.location.search);
            params.delete(filterType);
            params.delete('page'); // Filtre kaldırılınca 1. sayfaya dön

            window.location.href = `/products?${params.toString()}`;
        });
    });

    // Sıralama (Eğer ui.js yerine burada yönetilecekse)
    if (sortSelect && !window.initUI) { // initUI yoksa veya sıralama buradaysa
         sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const params = new URLSearchParams(window.location.search);

            if (sortValue) params.set('sort', sortValue); else params.delete('sort');
            params.delete('page');
            window.location.href = `/products?${params.toString()}`;
        });
    }


    // Mobile filter toggle (Eğer varsa)
    const mobileFilterToggle = document.querySelector('[data-mobile-filter-toggle]');
    const filterSidebar = document.querySelector('.filter-sidebar');

    if (mobileFilterToggle && filterSidebar) {
        mobileFilterToggle.addEventListener('click', () => {
            filterSidebar.classList.toggle('mobile-open');
             // Body scroll'u engelleme gibi eklemeler yapılabilir
        });
        // Kapatma butonu veya dışarı tıklama eklenebilir
    }

    console.log('✅ Filters module initialized');
};

// HATA 4 DÜZELTMESİ: window global ataması kaldırıldı.
// window.initFilters = initFilters;
