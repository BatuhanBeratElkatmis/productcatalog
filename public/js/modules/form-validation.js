// Form validation module

// HATA 4 DÜZELTMESİ: Fonksiyonu export et
export const initFormValidation = () => {
    initProductFormValidation();
    initCategoryFormValidation();
    initContactFormValidation();

    console.log('✅ Form validation module initialized');
};

// --- Helper Functions ---
function showFieldError(input, message) {
    clearFieldError(input); // Önce eski hatayı temizle

    input.classList.add('is-invalid'); // Bootstrap benzeri bir class ekle
    input.setAttribute('aria-invalid', 'true'); // Erişilebilirlik için

    const formGroup = input.closest('.form-group'); // input'un kapsayıcısını bul
    if (!formGroup) return; // Kapsayıcı yoksa çık

    const errorElement = document.createElement('div');
    errorElement.className = 'invalid-feedback'; // Hata mesajı stili için class
    errorElement.textContent = message;
    errorElement.id = `${input.id}-error`; // Benzersiz ID

    // Stilleri dinamik eklemek yerine CSS'e taşıyalım
    // errorElement.style.cssText = `...`;

    formGroup.appendChild(errorElement);
    input.setAttribute('aria-describedby', errorElement.id); // Hata mesajını input ile ilişkilendir
}

function clearFieldError(input) {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');

    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    const errorElement = formGroup.querySelector('.invalid-feedback');
    if (errorElement) {
        errorElement.remove();
    }
}

function showFormErrors(form, errors) {
    // Remove existing general error display
    const existingErrorDisplay = form.parentElement.querySelector('.form-errors');
    if (existingErrorDisplay) {
        existingErrorDisplay.remove();
    }

    if (errors.length > 0) {
        const errorDisplay = document.createElement('div');
        errorDisplay.className = 'form-errors alert alert-error'; // Mevcut alert stillerini kullan
        errorDisplay.setAttribute('role', 'alert'); // Erişilebilirlik
        errorDisplay.innerHTML = `
            <strong>Formda hatalar var:</strong>
            <ul>
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;

        form.parentNode.insertBefore(errorDisplay, form); // Formun üstüne ekle

        // Scroll to the first error field or the general error message
        const firstInvalidField = form.querySelector('.is-invalid');
        if (firstInvalidField) {
             firstInvalidField.focus();
             firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
             errorDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Format price input (e.g., allow comma as decimal separator, enforce two decimals)
function formatPriceInput(e) {
    const input = e.target;
    let value = input.value.replace(/[^\d,.]/g, ''); // Allow digits, comma, dot
    value = value.replace(',', '.'); // Convert comma to dot for parseFloat

    // Prevent multiple dots
    if ((value.match(/\./g) || []).length > 1) {
        value = value.substring(0, value.lastIndexOf('.'));
    }

    // Limit decimal places on blur or type
     if (value.includes('.') && value.split('.')[1].length > 2) {
         const number = parseFloat(value);
         if (!isNaN(number)) {
            // value = number.toFixed(2); // Don't format while typing, only potentially trim
            value = value.substring(0, value.indexOf('.') + 3);
         }
     }
    input.value = value; // Update input value directly
}

function validatePriceOnBlur(e) {
    const input = e.target;
    let value = input.value.replace(',', '.');
    const number = parseFloat(value);

    if (isNaN(number)) {
        input.value = ''; // Clear if not a valid number
        return;
    }

    // Format to two decimal places on blur
    input.value = number.toFixed(2);

    // Perform validation after formatting
    validatePrice(e); // Call the main validation logic
}


// --- Validation Logic Functions ---
function validateRequired(input, message = 'Bu alan gereklidir') {
    if (!input.value.trim()) {
        showFieldError(input, message);
        return false;
    }
    clearFieldError(input);
    return true;
}

function validateMinLength(input, minLength, message = `En az ${minLength} karakter olmalıdır`) {
     if (input.value.trim().length > 0 && input.value.trim().length < minLength) {
        showFieldError(input, message);
        return false;
    }
    // Don't clear error here, let validateRequired handle empty case
    if (input.value.trim().length >= minLength) clearFieldError(input);
    return true;
}

function validateMaxLength(input, maxLength, message = `En fazla ${maxLength} karakter olabilir`) {
    if (input.value.trim().length > maxLength) {
        showFieldError(input, message);
        return false;
    }
     // Don't clear error here if it fails other validations
     if (input.value.trim().length <= maxLength && !input.classList.contains('is-invalid')) {
         clearFieldError(input);
     }
    return true;
}

function validateNumber(input, allowNegative = false, message = 'Geçerli bir sayı giriniz') {
    const value = input.value.trim().replace(',', '.'); // Handle comma decimal separator
    const number = parseFloat(value);
     if (value === '' || isNaN(number) || (!allowNegative && number < 0)) {
        showFieldError(input, message);
        return false;
    }
    clearFieldError(input);
    return true;
}

function validateInteger(input, allowNegative = false, message = 'Geçerli bir tamsayı giriniz') {
    const value = input.value.trim();
    const number = parseInt(value, 10);
     // Check if it's a number and if it equals its parsed integer value
     if (value === '' || isNaN(number) || number !== parseFloat(value) || (!allowNegative && number < 0)) {
        showFieldError(input, message);
        return false;
    }
    clearFieldError(input);
    return true;
}


function validateRange(input, min, max, message = `${min}-${max} arasında olmalıdır`) {
    const value = input.value.trim().replace(',', '.');
    const number = parseFloat(value);
    if (!isNaN(number) && (number < min || number > max)) {
         showFieldError(input, message);
         return false;
     }
    if(!isNaN(number) && number >= min && number <= max) clearFieldError(input);
    return true;
}

function validateMaxNumber(input, max, message = `En fazla ${max} olabilir`) {
    const value = input.value.trim().replace(',', '.');
    const number = parseFloat(value);
    if (!isNaN(number) && number > max) {
        showFieldError(input, message);
        return false;
    }
    if (!isNaN(number) && number <= max) clearFieldError(input);
    return true;
}


function validateEmailField(input, message = 'Geçerli bir e-posta adresi giriniz') {
    if (input.value.trim() && !isValidEmail(input.value.trim())) {
        showFieldError(input, message);
        return false;
    }
    if(isValidEmail(input.value.trim())) clearFieldError(input);
    return true;
}

// --- Specific Form Initializers ---

// Product form validation
const initProductFormValidation = () => {
    const productForms = document.querySelectorAll('.product-form');

    productForms.forEach(form => {
        const nameInput = form.querySelector('#name');
        const brandInput = form.querySelector('#brand');
        const priceInput = form.querySelector('#price');
        const categorySelect = form.querySelector('#category');
        const stockInput = form.querySelector('#stock');
        const ratingInput = form.querySelector('#rating');
        const descriptionTextarea = form.querySelector('#description');
        // Add image/features textareas if needed

        // Real-time validation on blur (or input for some)
        if (nameInput) nameInput.addEventListener('blur', () => {
             validateRequired(nameInput, 'Ürün adı gereklidir');
             validateMinLength(nameInput, 2, 'Ürün adı en az 2 karakter olmalıdır');
             validateMaxLength(nameInput, 100, 'Ürün adı en fazla 100 karakter olabilir');
        });
        if (brandInput) brandInput.addEventListener('blur', () => validateRequired(brandInput, 'Marka adı gereklidir'));
        if (priceInput) {
            priceInput.addEventListener('input', formatPriceInput);
            priceInput.addEventListener('blur', validatePriceOnBlur); // Format and validate
        }
        if (categorySelect) categorySelect.addEventListener('change', () => validateRequired(categorySelect, 'Kategori seçimi zorunludur'));
        if (stockInput) stockInput.addEventListener('blur', () => {
             validateRequired(stockInput, 'Stok miktarı gereklidir');
             validateInteger(stockInput, false, 'Geçerli bir stok miktarı giriniz (negatif olamaz)');
        });
        if (ratingInput) ratingInput.addEventListener('blur', () => {
            // Rating is optional, so only validate if not empty
            if (ratingInput.value.trim()) {
                 validateNumber(ratingInput, false); // Validate if it's a number first
                 validateRange(ratingInput, 0, 5);
            } else {
                clearFieldError(ratingInput); // Clear error if empty
            }
        });
         if (descriptionTextarea) descriptionTextarea.addEventListener('blur', () => validateRequired(descriptionTextarea, 'Açıklama gereklidir'));


        // Form submission validation
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const errors = [];

            // Trigger blur validation logic for all fields
            if (nameInput) if (!validateRequired(nameInput, 'Ürün adı gereklidir') || !validateMinLength(nameInput, 2) || !validateMaxLength(nameInput, 100)) isValid = false;
            if (brandInput) if (!validateRequired(brandInput, 'Marka adı gereklidir')) isValid = false;
            if (priceInput) if (!validateRequired(priceInput, 'Fiyat gereklidir') || !validateNumber(priceInput, false) || !validateMaxNumber(priceInput, 1000000, 'Fiyat 1.000.000 TL\'den yüksek olamaz')) isValid = false;
            if (categorySelect) if (!validateRequired(categorySelect, 'Kategori seçimi zorunludur')) isValid = false;
            if (stockInput) if (!validateRequired(stockInput, 'Stok miktarı gereklidir') || !validateInteger(stockInput, false)) isValid = false;
            if (ratingInput && ratingInput.value.trim()) if (!validateNumber(ratingInput, false) || !validateRange(ratingInput, 0, 5)) isValid = false;
            if (descriptionTextarea) if (!validateRequired(descriptionTextarea, 'Açıklama gereklidir')) isValid = false;


            // Collect specific error messages for the top summary
             form.querySelectorAll('.invalid-feedback').forEach(el => errors.push(el.textContent));

            if (!isValid) {
                e.preventDefault();
                showFormErrors(form, errors);
            } else {
                 // Optional: Disable button again to prevent double submission
                 const submitBtn = form.querySelector('button[type="submit"]');
                 if (submitBtn) submitBtn.disabled = true;
                 // Loading indicator should already be active from ui.js
            }
        });
    });
};

// Category form validation
const initCategoryFormValidation = () => {
    const categoryForm = document.querySelector('.category-form'); // Assuming only one category form per page

    if (categoryForm) {
        const nameInput = categoryForm.querySelector('#name');
        const descriptionTextarea = categoryForm.querySelector('#description');

        if (nameInput) nameInput.addEventListener('blur', () => {
             validateRequired(nameInput, 'Kategori adı gereklidir');
             validateMinLength(nameInput, 2);
             validateMaxLength(nameInput, 50);
        });
        // Description is optional for category, so no real-time validation needed unless required

        categoryForm.addEventListener('submit', function(e) {
            let isValid = true;
            const errors = [];

             if (nameInput) if (!validateRequired(nameInput, 'Kategori adı gereklidir') || !validateMinLength(nameInput, 2) || !validateMaxLength(nameInput, 50)) isValid = false;
            // Add validation for description if it becomes required

             categoryForm.querySelectorAll('.invalid-feedback').forEach(el => errors.push(el.textContent));

            if (!isValid) {
                e.preventDefault();
                showFormErrors(categoryForm, errors);
            } else {
                 const submitBtn = categoryForm.querySelector('button[type="submit"]');
                 if (submitBtn) submitBtn.disabled = true;
            }
        });
    }
};

// Contact form validation
const initContactFormValidation = () => {
    const contactForm = document.querySelector('.contact-form form'); // Be more specific if needed

    if (contactForm) {
        const nameInput = contactForm.querySelector('#name');
        const emailInput = contactForm.querySelector('#email');
        const subjectInput = contactForm.querySelector('#subject');
        const messageTextarea = contactForm.querySelector('#message');

        if (nameInput) nameInput.addEventListener('blur', () => validateRequired(nameInput, 'Adınız Soyadınız gereklidir'));
        if (emailInput) emailInput.addEventListener('blur', () => {
             validateRequired(emailInput, 'E-posta adresi gereklidir');
             validateEmailField(emailInput);
        });
        if (subjectInput) subjectInput.addEventListener('blur', () => validateRequired(subjectInput, 'Konu gereklidir'));
        if (messageTextarea) messageTextarea.addEventListener('blur', () => validateRequired(messageTextarea, 'Mesajınız gereklidir'));


        contactForm.addEventListener('submit', function(e) {
            let isValid = true;
            const errors = [];

            if (nameInput) if (!validateRequired(nameInput, 'Adınız Soyadınız gereklidir')) isValid = false;
            if (emailInput) if (!validateRequired(emailInput, 'E-posta adresi gereklidir') || !validateEmailField(emailInput)) isValid = false;
            if (subjectInput) if (!validateRequired(subjectInput, 'Konu gereklidir')) isValid = false;
            if (messageTextarea) if (!validateRequired(messageTextarea, 'Mesajınız gereklidir')) isValid = false;


            contactForm.querySelectorAll('.invalid-feedback').forEach(el => errors.push(el.textContent));

            if (!isValid) {
                e.preventDefault();
                showFormErrors(contactForm, errors);
            } else {
                 const submitBtn = contactForm.querySelector('button[type="submit"]');
                 if (submitBtn) submitBtn.disabled = true;
                 // Consider showing a success message via JS instead of full page reload if endpoint returns JSON
            }
        });
    }
};

// CSS for validation states (add this to your main.css or a dedicated forms.css)
/*
.form-input.is-invalid,
.form-select.is-invalid,
.form-textarea.is-invalid {
    border-color: var(--error-color);
    padding-right: calc(1.5em + 0.75rem); // Make space for potential icon
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23ef4444'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23ef4444' stroke='none'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right calc(0.375em + 0.1875rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.form-input.is-invalid:focus,
.form-select.is-invalid:focus,
.form-textarea.is-invalid:focus {
    border-color: var(--error-color);
    box-shadow: 0 0 0 0.25rem rgba(239, 68, 68, 0.25); // Red shadow on focus
}

.invalid-feedback {
    display: block; // Show the error message
    width: 100%;
    margin-top: 0.25rem;
    font-size: var(--font-size-sm);
    color: var(--error-color);
}

.form-errors.alert { // Style the general form error box
    margin-bottom: 1rem;
}
.form-errors ul {
     padding-left: 1.5rem;
     margin-top: 0.5rem;
}
*/


// HATA 4 DÜZELTMESİ: window global ataması kaldırıldı.
// window.initFormValidation = initFormValidation;
