// Utility Functions
window.utils = {
    // Show notification toast
    showNotification: function(message, type = 'info') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notificationMessage');
        const notificationIcon = document.getElementById('notificationIcon');
        
        // Set message
        notificationMessage.textContent = message;
        
        // Set icon based on type
        let iconHtml = '';
        switch(type) {
            case 'success':
                iconHtml = '<i class="fas fa-check-circle text-green-500 text-xl"></i>';
                break;
            case 'error':
                iconHtml = '<i class="fas fa-exclamation-circle text-red-500 text-xl"></i>';
                break;
            case 'warning':
                iconHtml = '<i class="fas fa-exclamation-triangle text-yellow-500 text-xl"></i>';
                break;
            case 'info':
            default:
                iconHtml = '<i class="fas fa-info-circle text-blue-500 text-xl"></i>';
                break;
        }
        
        notificationIcon.innerHTML = iconHtml;
        
        // Show notification
        notification.classList.remove('hidden');
        notification.classList.add('fade-in');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.add('hidden');
            notification.classList.remove('fade-in');
        }, 3000);
    },

    // Format date
    formatDate: function(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        
        const finalOptions = { ...defaultOptions, ...options };
        
        if (date && date.toDate) {
            // Firestore Timestamp
            return date.toDate().toLocaleDateString(undefined, finalOptions);
        } else if (date instanceof Date) {
            return date.toLocaleDateString(undefined, finalOptions);
        } else if (typeof date === 'string') {
            return new Date(date).toLocaleDateString(undefined, finalOptions);
        }
        
        return 'Invalid date';
    },

    // Format time
    formatTime: function(date, options = {}) {
        const defaultOptions = {
            hour: '2-digit',
            minute: '2-digit'
        };
        
        const finalOptions = { ...defaultOptions, ...options };
        
        if (date && date.toDate) {
            // Firestore Timestamp
            return date.toDate().toLocaleTimeString(undefined, finalOptions);
        } else if (date instanceof Date) {
            return date.toLocaleTimeString(undefined, finalOptions);
        } else if (typeof date === 'string') {
            return new Date(date).toLocaleTimeString(undefined, finalOptions);
        }
        
        return 'Invalid time';
    },

    // Format date and time
    formatDateTime: function(date, options = {}) {
        return `${this.formatDate(date, options.date)} at ${this.formatTime(date, options.time)}`;
    },

    // Validate email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate phone number
    validatePhone: function(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone);
    },

    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Generate random ID
    generateId: function() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Capitalize first letter
    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // Format currency
    formatCurrency: function(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Get relative time
    getRelativeTime: function(date) {
        const now = new Date();
        const targetDate = date && date.toDate ? date.toDate() : new Date(date);
        const diffInSeconds = Math.floor((now - targetDate) / 1000);
        
        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else {
            return this.formatDate(targetDate);
        }
    },

    // Copy to clipboard
    copyToClipboard: async function(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Copied to clipboard!', 'success');
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            this.showNotification('Failed to copy to clipboard', 'error');
            return false;
        }
    },

    // Download file
    downloadFile: function(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type: type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },

    // Show confirmation dialog
    showConfirmation: function(message, onConfirm, onCancel) {
        const confirmed = confirm(message);
        if (confirmed && onConfirm) {
            onConfirm();
        } else if (!confirmed && onCancel) {
            onCancel();
        }
        return confirmed;
    },

    // Get file extension
    getFileExtension: function(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    },

    // Format file size
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Check if mobile device
    isMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    // Get device type
    getDeviceType: function() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    },

    // Scroll to element
    scrollToElement: function(elementId, offset = 0) {
        const element = document.getElementById(elementId);
        if (element) {
            const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    },

    // Get URL parameters
    getUrlParams: function() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');
        
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        
        return params;
    },

    // Set URL parameter
    setUrlParam: function(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.pushState({}, '', url);
    },

    // Remove URL parameter
    removeUrlParam: function(key) {
        const url = new URL(window.location);
        url.searchParams.delete(key);
        window.history.pushState({}, '', url);
    },

    // Local storage helpers
    storage: {
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Error saving to localStorage:', e);
                return false;
            }
        },
        
        get: function(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Error reading from localStorage:', e);
                return defaultValue;
            }
        },
        
        remove: function(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Error removing from localStorage:', e);
                return false;
            }
        },
        
        clear: function() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('Error clearing localStorage:', e);
                return false;
            }
        }
    },

    // Session storage helpers
    sessionStorage: {
        set: function(key, value) {
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Error saving to sessionStorage:', e);
                return false;
            }
        },
        
        get: function(key, defaultValue = null) {
            try {
                const item = sessionStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Error reading from sessionStorage:', e);
                return defaultValue;
            }
        },
        
        remove: function(key) {
            try {
                sessionStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Error removing from sessionStorage:', e);
                return false;
            }
        },
        
        clear: function() {
            try {
                sessionStorage.clear();
                return true;
            } catch (e) {
                console.error('Error clearing sessionStorage:', e);
                return false;
            }
        }
    },

    // Loading states
    loading: {
        show: function(elementId, text = 'Loading...') {
            const element = document.getElementById(elementId);
            if (element) {
                element.classList.add('loading');
                element.innerHTML = `
                    <div class="text-center py-4">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                        <p class="mt-2 text-gray-600">${text}</p>
                    </div>
                `;
            }
        },
        
        hide: function(elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.classList.remove('loading');
            }
        }
    },

    // Form validation
    validation: {
        validateForm: function(formId, rules) {
            const form = document.getElementById(formId);
            if (!form) return false;
            
            let isValid = true;
            const errors = [];
            
            for (const fieldId in rules) {
                const field = document.getElementById(fieldId);
                const fieldRules = rules[fieldId];
                
                if (field) {
                    const value = field.value.trim();
                    
                    // Required validation
                    if (fieldRules.required && !value) {
                        errors.push(`${fieldRules.name || fieldId} is required`);
                        isValid = false;
                    }
                    
                    // Email validation
                    if (fieldRules.email && value && !this.validateEmail(value)) {
                        errors.push(`${fieldRules.name || fieldId} must be a valid email`);
                        isValid = false;
                    }
                    
                    // Phone validation
                    if (fieldRules.phone && value && !this.validatePhone(value)) {
                        errors.push(`${fieldRules.name || fieldId} must be a valid phone number`);
                        isValid = false;
                    }
                    
                    // Min length validation
                    if (fieldRules.minLength && value.length < fieldRules.minLength) {
                        errors.push(`${fieldRules.name || fieldId} must be at least ${fieldRules.minLength} characters`);
                        isValid = false;
                    }
                    
                    // Max length validation
                    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
                        errors.push(`${fieldRules.name || fieldId} must not exceed ${fieldRules.maxLength} characters`);
                        isValid = false;
                    }
                }
            }
            
            if (!isValid) {
                window.utils.showNotification(errors[0], 'error');
            }
            
            return isValid;
        }
    }
};

// Initialize utilities
console.log('Utilities module loaded');
