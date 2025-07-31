class MembersPage {
    constructor() {
        this.usersList = document.getElementById('usersList');
        this.searchInput = document.getElementById('searchUsers');
        this.sortSelect = document.getElementById('sortUsers');
        this.allUsers = [];
        this.apiBaseUrl = 'http://localhost:3000/api';
        
        this.init();
    }

    init() {
        // Search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.handleSearch.bind(this));
        }
        
        // Sort functionality
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', this.handleSort.bind(this));
        }
        
        this.fetchUsers();
    }

    async fetchUsers() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/users`);
            
            if (response.ok) {
                const result = await response.json();
                this.allUsers = result.data || [];
                this.displayUsers(this.allUsers);
            } else {
                console.error('Failed to fetch users');
                this.showError('Failed to load users. Please refresh the page.');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            this.showError('Network error. Please check your connection.');
        }
    }

    displayUsers(users) {
        if (!users || users.length === 0) {
            this.usersList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">👥</div>
                    <h3>No members found</h3>
                    <p>No users match your search criteria or none have registered yet.</p>
                </div>
            `;
            return;
        }

        const usersHTML = users.map(user => `
            <div class="user-card">
                <div class="user-name">${this.escapeHtml(user.name)}</div>
                <div class="user-email">${this.escapeHtml(user.email)}</div>
                ${user.referralCode ? `<span class="user-code">Code: ${this.escapeHtml(user.referralCode)}</span>` : ''}
                ${user.points ? `<span class="user-points">${user.points} points</span>` : '<span class="user-points">0 points</span>'}
                <div class="user-date">Joined: ${this.formatDate(user.createdAt || new Date())}</div>
            </div>
        `).join('');

        this.usersList.innerHTML = usersHTML;
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (!searchTerm) {
            this.displayUsers(this.allUsers);
            return;
        }

        const filteredUsers = this.allUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            (user.referralCode && user.referralCode.toLowerCase().includes(searchTerm))
        );

        this.displayUsers(filteredUsers);
    }

    handleSort(e) {
        const sortType = e.target.value;
        let sortedUsers = [...this.allUsers];

        switch (sortType) {
            case 'newest':
                sortedUsers.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                break;
            case 'oldest':
                sortedUsers.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
                break;
            case 'name':
                sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'points':
                sortedUsers.sort((a, b) => (b.points || 0) - (a.points || 0));
                break;
            default:
                break;
        }

        this.displayUsers(sortedUsers);
    }

    showError(message) {
        this.usersList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <h3>Error</h3>
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
    }

    formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MembersPage();
});
