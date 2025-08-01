class RegistrationPage {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.messageContainer = document.getElementById('messageContainer');
        this.apiBaseUrl = 'https://zynta-fi-task.onrender.com/api';
        
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const userData = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            referralCode: formData.get('referralCode').trim() || undefined
        };

        // Validate form
        if (!this.validateForm(userData)) {
            return;
        }

        this.setLoading(true);
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (response.ok) {
                this.showMessage('Registration successful! 🎉 Redirecting to members page...', 'success');
                this.form.reset();
                
                // Redirect to users page after successful registration
                setTimeout(() => {
                    window.location.href = 'users.html';
                }, 2000);
            } else {
                this.showMessage(result.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showMessage('Network error. Please check your connection and try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    validateForm(userData) {
        if (!userData.name || userData.name.length < 2) {
            this.showMessage('Please enter a valid name (at least 2 characters).', 'error');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return false;
        }

        return true;
    }

    showMessage(message, type) {
        if (!this.messageContainer) return;
        
        this.messageContainer.innerHTML = `
            <div class="message ${type}">
                ${this.escapeHtml(message)}
            </div>
        `;

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.messageContainer.innerHTML = '';
            }, 5000);
        }
    }

    setLoading(isLoading) {
        if (!this.submitBtn) return;
        
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = '<span class="btn-text">Processing...</span><span class="btn-icon">⏳</span>';
            if (this.loadingIndicator) {
                this.loadingIndicator.style.display = 'flex';
            }
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<span class="btn-text">Create Account</span><span class="btn-icon">🚀</span>';
            if (this.loadingIndicator) {
                this.loadingIndicator.style.display = 'none';
            }
        }
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RegistrationPage();
});
