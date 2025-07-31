class LandingPage {
    constructor() {
        this.recentUsers = document.getElementById('recentUsers');
        this.openRegistrationModalBtn = document.getElementById('openRegistrationModal');
        this.registrationModal = document.getElementById('registrationModal');
        this.closeRegistrationModalBtn = document.getElementById('closeRegistrationModal');
        this.form = document.getElementById('registrationForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.messageContainer = document.getElementById('messageContainer');
        
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.init();
    }

    init() {
        // Modal event listeners
        if (this.openRegistrationModalBtn) {
            this.openRegistrationModalBtn.addEventListener('click', this.openRegistrationModal.bind(this));
        }
        
        if (this.closeRegistrationModalBtn) {
            this.closeRegistrationModalBtn.addEventListener('click', this.closeRegistrationModal.bind(this));
        }
        
        // Form submission for modal
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.registrationModal) {
                this.closeRegistrationModal();
            }
        });

        this.fetchStats();
        this.fetchRecentUsers();
    }

    // Modal methods
    openRegistrationModal() {
        if (this.registrationModal) {
            this.registrationModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeRegistrationModal() {
        if (this.registrationModal) {
            this.registrationModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Registration handling
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
                this.showMessage('User registered successfully! 🎉', 'success');
                this.form.reset();
                setTimeout(() => {
                    this.closeRegistrationModal();
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

    // Fetch user statistics
    async fetchStats() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            
            const data = await response.json();
            const users = data.data || [];

            // Calculate stats from user data
            const totalUsers = users.length;
            const totalReferrals = users.filter(user => user.points > 0).length;
            const totalPoints = users.reduce((sum, user) => sum + (user.points || 0), 0);

            this.updateStats({ totalUsers, totalReferrals, totalPoints });
        } catch (error) {
            console.error('Error fetching stats:', error);
            // Set default stats if API fails
            this.updateStats({ totalUsers: 0, totalReferrals: 0, totalPoints: 0 });
        }
    }

    updateStats(stats) {
        const totalUsersEl = document.getElementById('totalUsers');
        const totalReferralsEl = document.getElementById('totalReferrals');
        const totalPointsEl = document.getElementById('totalPoints');

        if (totalUsersEl) this.animateNumber(totalUsersEl, stats.totalUsers || 0);
        if (totalReferralsEl) this.animateNumber(totalReferralsEl, stats.totalReferrals || 0);
        if (totalPointsEl) this.animateNumber(totalPointsEl, stats.totalPoints || 0);
    }

    animateNumber(element, targetNumber) {
        const duration = 2000;
        const start = 0;
        const increment = targetNumber / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                current = targetNumber;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    // Recent users for landing page
    async fetchRecentUsers() {
        if (!this.recentUsers) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            const users = data.data || [];
            const recentUsers = users.sort((a, b) => b.id - a.id).slice(0, 3);
            this.displayRecentUsers(recentUsers);
        } catch (error) {
            console.error('Error fetching recent users:', error);
        }
    }

    displayRecentUsers(users) {
        if (!users || users.length === 0) {
            this.recentUsers.innerHTML = '<div class="empty-state"><p>No users yet. Be the first to join!</p></div>';
            return;
        }

        const usersHTML = users.map(user => `
            <div class="user-card">
                <div class="user-name">${this.escapeHtml(user.name)}</div>
                <div class="user-email">${this.escapeHtml(user.email)}</div>
                ${user.referralCode ? `<span class="user-code">Code: ${this.escapeHtml(user.referralCode)}</span>` : ''}
            </div>
        `).join('');

        this.recentUsers.innerHTML = usersHTML;
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
    new LandingPage();
});
