// Main JavaScript file - Product Catalog Application

// HATA 4 DÜZELTMESİ: Modülleri import et
import { initUI } from './modules/ui.js';
import { initFilters } from './modules/filters.js';
import { initFormValidation } from './modules/form-validation.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initUI();
    initFilters();
    initFormValidation();

    console.log('🛒 Product Catalog initialized (using modules)');
});

// Global utility functions (can remain here or move to a separate utility module)
const ProductCatalog = {
    // Format price with Turkish Lira symbol
    formatPrice: (price) => {
        // Handle potential non-numeric input gracefully
        if (price === null || price === undefined || isNaN(price)) {
            return 'N/A'; // Or some other placeholder
        }
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(price);
    },

    // Generate star rating HTML
    generateStarRating: (rating) => {
         // Ensure rating is a number between 0 and 5
         const numRating = parseFloat(rating);
         if (isNaN(numRating) || numRating < 0 || numRating > 5) {
             // Return empty stars or a placeholder if rating is invalid
             return Array(5).fill('<span class="star empty">☆</span>').join(''); // Use empty star symbol
         }

        const fullStars = Math.floor(numRating);
        const halfStar = numRating % 1 >= 0.45; // Adjust threshold slightly if needed
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        let stars = '';

        // Full stars (use filled star symbol)
        stars += Array(fullStars).fill('<span class="star full">★</span>').join('');

        // Half star (use specific symbol or SVG for better visuals if available)
        if (halfStar) {
            // Simple text-based half star - consider CSS or SVG for better rendering
            stars += '<span class="star half">★</span>';
            // Example using SVG (requires adding SVG definition or library):
            // stars += '<span class="star half"><svg>...</svg></span>';
        }

        // Empty stars (use empty star symbol)
        stars += Array(emptyStars).fill('<span class="star empty">☆</span>').join('');


        return stars;
    },

    // Debounce function for search and filters
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args); // Use apply to preserve context
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Show notification (Can be improved with dedicated library or framework component later)
    showNotification: (message, type = 'info') => {
        // Basic implementation - consider replacing with a more robust solution
        console.log(`Notification (${type}): ${message}`); // Simple console log for now

        const notificationArea = document.getElementById('notification-area') || createNotificationArea();
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type}`; // Map to existing alert styles
        notification.setAttribute('role', 'alert');
        notification.style.cssText = `
            position: fixed;
            top: 100px; /* Adjust as needed */
            right: 20px;
            z-index: 1050; /* Ensure it's above most elements */
            min-width: 250px;
            max-width: 400px;
            box-shadow: var(--shadow-lg);
            opacity: 0;
            transform: translateX(100%);
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" aria-label="Kapat" style="float: right; background: none; border: none; font-size: 1.2rem; line-height: 1; opacity: 0.7;">&times;</button>
        `;

        notificationArea.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100); // Short delay to allow CSS transition

        const closeButton = notification.querySelector('.btn-close');
        const removeNotification = () => {
             notification.style.opacity = '0';
             notification.style.transform = 'translateX(100%)';
             setTimeout(() => {
                 if (notification.parentNode) {
                     notification.remove();
                 }
                 // Remove area if empty? Optional.
                 // if (notificationArea.children.length === 0) notificationArea.remove();
             }, 300); // Match transition duration
        };

        closeButton.addEventListener('click', removeNotification);

        // Auto remove after 5 seconds
        setTimeout(removeNotification, 5000);
    }
};

function createNotificationArea() {
    const area = document.createElement('div');
    area.id = 'notification-area';
    area.style.cssText = `
        position: fixed;
        top: 80px; /* Below header */
        right: 20px;
        z-index: 1045; /* Below modals */
        width: auto;
        max-width: 400px; /* Limit width */
    `;
    document.body.appendChild(area);
    return area;
}


// Make utility functions globally available (still useful for EJS helpers)
// Keep this if helpers.js or EJS templates rely on `ProductCatalog.formatPrice` etc.
// If moving fully to modules, these might be imported where needed instead.
window.ProductCatalog = ProductCatalog;
