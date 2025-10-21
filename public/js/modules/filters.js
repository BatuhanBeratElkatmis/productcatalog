// Filter module for product filtering functionality

const initFilters = () => {
    const filterForms = document.querySelectorAll('.price-filter-form, [data-filter-form]');
    const filterOptions = document.querySelectorAll('.filter-option');
    const clearFiltersBtn = document.querySelector('.clear-filters');

    // Price filter form submission
    filterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const params = new URLSearchParams();
            
            // Add existing filter parameters from URL
            const currentParams = new URLSearchParams(window.location.search);
            currentParams.forEach((value, key) => {
                if (key !== 'page' && key !== 'minPrice' && key !== 'maxPrice') {
                    params.append(key, value);
                }
            });
            
            // Add price filter parameters
            const minPrice = formData.get('minPrice');
            const maxPrice = formData.get('maxPrice');
            
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);
            
            // Navigate to filtered URL
            window.location.href = `/products?${params.toString()}`;
        });
    });

    // Real-time search debouncing
    const searchInput = document.querySelector('input[name="q"]');
    if (searchInput) {
        const debouncedSearch = ProductCatalog.debounce((value) => {
            if (value.length >= 2 || value.length === 0) {
                const params = new URLSearchParams(window.location.search);
                if (value) {
                    params.set('q', value);
                } else {
                    params.delete('q');
                }
                params.delete('page');
                
                window.location.href = `/products/search?${params.toString()}`;
            }
        }, 500);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value.trim());
        });
    }

    // Clear all filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/products';
        });
    }

    // Active filter tags removal
    const filterTags = document.querySelectorAll('.filter-tag-remove');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const filterType = this.dataset.filterType;
            const filterValue = this.dataset.filterValue;
            
            const params = new URLSearchParams(window.location.search);
            params.delete(filterType);
            params.delete('page');
            
            window.location.href = `/products?${params.toString()}`;
        });
    });

    // Mobile filter toggle
    const mobileFilterToggle = document.querySelector('[data-mobile-filter-toggle]');
    const filterSidebar = document.querySelector('.filter-sidebar');
    
    if (mobileFilterToggle && filterSidebar) {
        mobileFilterToggle.addEventListener('click', () => {
            filterSidebar.classList.toggle('mobile-open');
        });
    }

    console.log('✅ Filters module initialized');
};

// Export for use in other modules
window.initFilters = initFilters;