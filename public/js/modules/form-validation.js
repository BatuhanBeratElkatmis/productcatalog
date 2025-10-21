// Form validation module

const initFormValidation = () => {
    initProductFormValidation();
    initCategoryFormValidation();
    initContactFormValidation();
    
    console.log('✅ Form validation module initialized');
};

// Product form validation
const initProductFormValidation = () => {
    const productForms = document.querySelectorAll('.product-form');
    
    productForms.forEach(form => {
        const nameInput = form.querySelector('#name');
        const priceInput = form.querySelector('#price');
        const stockInput = form.querySelector('#stock');
        const ratingInput = form.querySelector('#rating');
        
        // Real-time validation
        if (nameInput) {
            nameInput.addEventListener('blur', validateProductName);
        }
        
        if (priceInput) {
            priceInput.addEventListener('blur', validatePrice);
            priceInput.addEventListener('input', formatPriceInput);
        }
        
        if (stockInput) {
            stockInput.addEventListener('blur', validateStock);
        }
        
        if (ratingInput) {
            ratingInput.addEventListener('blur', validateRating);
        }
        
        // Form submission validation
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const errors = [];
            
            // Validate product name
            if (!nameInput.value.trim()) {
                isValid = false;
                errors.push('Ürün adı gereklidir');
                showFieldError(nameInput, 'Ürün adı gereklidir');
            } else if (nameInput.value.trim().length < 2) {
                isValid = false;
                errors.push('Ürün adı en az 2 karakter olmalıdır');
                showFieldError(nameInput, 'Ürün adı en az 2 karakter olmalıdır');
            } else {
                clearFieldError(nameInput);
            }
            
            // Validate price
            if (!priceInput.value || parseFloat(priceInput.value) <= 0) {
                isValid = false;
                errors.push('Geçerli bir fiyat giriniz');
                showFieldError(priceInput, 'Geçerli bir fiyat giriniz');
            } else if (parseFloat(priceInput.value) > 1000000) {
                isValid = false;
                errors.push('Fiyat 1.000.000 TL den yüksek olamaz');
                showFieldError(priceInput, 'Fiyat 1.000.000 TL den yüksek olamaz');
            } else {
                clearFieldError(priceInput);
            }
            
            // Validate stock
            if (!stockInput.value || parseInt(stockInput.value) < 0) {
                isValid = false;
                errors.push('Geçerli bir stok miktarı giriniz');
                showFieldError(stockInput, 'Geçerli bir stok miktarı giriniz');
            } else {
                clearFieldError(stockInput);
            }
            
            // Validate rating
            if (ratingInput.value && (parseFloat(ratingInput.value) < 0 || parseFloat(ratingInput.value) > 5)) {
                isValid = false;
                errors.push('Puan 0-5 arasında olmalıdır');
                showFieldError(ratingInput, 'Puan 0-5 arasında olmalıdır');
            } else {
                clearFieldError(ratingInput);
            }
            
            if (!isValid) {
                e.preventDefault();
                showFormErrors(errors);
            }
        });
    });
};

// Category form validation
const initCategoryFormValidation = () => {
    const categoryForm = document.querySelector('.category-form');
    
    if (categoryForm) {
        const nameInput = categoryForm.querySelector('#name');
        
        categoryForm.addEventListener('submit', function(e) {
            let isValid = true;
            const errors = [];
            
            if (!nameInput.value.trim()) {
                isValid = false;
                errors.push('Kategori adı gereklidir');
                showFieldError(nameInput, 'Kategori adı gereklidir');
            } else if (nameInput.value.trim().length < 2) {
                isValid = false;
                errors.push('Kategori adı en az 2 karakter olmalıdır');
                showFieldError(nameInput, 'Kategori adı en az 2 karakter olmalıdır');
            } else {
                clearFieldError(nameInput);
            }
            
            if (!isValid) {
                e.preventDefault();
                showFormErrors(errors);
            }
        });
    }
};

// Contact form validation
const initContactFormValidation = () => {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        const emailInput = contactForm.querySelector('#email');
        
        if (emailInput) {
            emailInput.addEventListener('blur', validateEmail);
        }
        
        contactForm.addEventListener('submit', function(e) {
            let isValid = true;
            const errors = [];
            
            // Validate email
            if (emailInput && !isValidEmail(emailInput.value)) {
                isValid = false;
                errors.push('Geçerli bir e-posta adresi giriniz');
                showFieldError(emailInput, 'Geçerli bir e-posta adresi giriniz');
            } else if (emailInput) {
                clearFieldError(emailInput);
            }
            
            if (!isValid) {
                e.preventDefault();
                showFormErrors(errors);
            }
        });
    }
};

// Validation functions
function validateProductName(e) {
    const input = e.target;
    const value = input.value.trim();
    
    if (!value) {
        showFieldError(input, 'Ürün adı gereklidir');
    } else if (value.length < 2) {
        showFieldError(input, 'Ürün adı en az 2 karakter olmalıdır');
    } else if (value.length > 100) {
        showFieldError(input, 'Ürün adı 100 karakterden uzun olamaz');
    } else {
        clearFieldError(input);
    }
}

function validatePrice(e) {
    const input = e.target;
    const value = parseFloat(input.value);
    
    if (!value || value <= 0) {
        showFieldError(input, 'Geçerli bir fiyat giriniz');
    } else if (value > 1000000) {
        showFieldError(input, 'Fiyat 1.000.000 TL den yüksek olamaz');
    } else {
        clearFieldError(input);
    }
}

function validateStock(e) {
    const input = e.target;
    const value = parseInt(input.value);
    
    if (!value && value !== 0) {
        showFieldError(input, 'Geçerli bir stok miktarı giriniz');
    } else if (value < 0) {
        showFieldError(input, 'Stok miktarı negatif olamaz');
    } else {
        clearFieldError(input);
    }
}

function validateRating(e) {
    const input = e.target;
    const value = parseFloat(input.value);
    
    if (value && (value < 0 || value > 5)) {
        showFieldError(input, 'Puan 0-5 arasında olmalıdır');
    } else {
        clearFieldError(input);
    }
}

function validateEmail(e) {
    const input = e.target;
    const value = input.value.trim();
    
    if (value && !isValidEmail(value)) {
        showFieldError(input, 'Geçerli bir e-posta adresi giriniz');
    } else {
        clearFieldError(input);
    }
}

// Utility functions
function formatPriceInput(e) {
    const input = e.target;
    let value = input.value.replace(/[^\d.,]/g, '');
    
    // Format as currency
    if (value) {
        const number = parseFloat(value.replace(',', '.'));
        if (!isNaN(number)) {
            input.value = number.toFixed(2);
        }
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(input, message) {
    clearFieldError(input);
    
    input.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    `;
    
    input.parentNode.appendChild(errorElement);
}

function clearFieldError(input) {
    input.classList.remove('error');
    
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showFormErrors(errors) {
    // Remove existing error display
    const existingErrorDisplay = document.querySelector('.form-errors');
    if (existingErrorDisplay) {
        existingErrorDisplay.remove();
    }
    
    if (errors.length > 0) {
        const errorDisplay = document.createElement('div');
        errorDisplay.className = 'form-errors alert alert-error';
        errorDisplay.innerHTML = `
            <strong>Formda hatalar var:</strong>
            <ul>
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;
        
        const form = document.querySelector('form');
        form.parentNode.insertBefore(errorDisplay, form);
        
        // Scroll to errors
        errorDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Export for use in other modules
window.initFormValidation = initFormValidation;