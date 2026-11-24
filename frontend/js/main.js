// Campus Swap - Main JavaScript
class CampusSwap {
    constructor() {
        this.products = [];
        this.userListings = [];
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSearchAndFilters();
        this.setupFormSubmission();
        this.loadSampleData();
        this.updateDashboard();
    }

    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.dataset.section;
                
                // Update active nav
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Show target section
                sections.forEach(section => section.classList.remove('active'));
                const targetElement = document.getElementById(targetSection);
                if (targetElement) {
                    targetElement.classList.add('active');
                }
            });
        });

        // Mobile nav toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }

    // Search and Filter Functionality
    setupSearchAndFilters() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterProducts());
        }
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterProducts());
        }
        if (priceFilter) {
            priceFilter.addEventListener('change', () => this.filterProducts());
        }
    }

    filterProducts() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const categoryFilter = document.getElementById('categoryFilter').value;
        const priceFilter = document.getElementById('priceFilter').value;

        let filteredProducts = this.products.filter(product => {
            // Search filter
            const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
                                product.description.toLowerCase().includes(searchTerm) ||
                                product.category.toLowerCase().includes(searchTerm);

            // Category filter
            const matchesCategory = !categoryFilter || product.category === categoryFilter;

            // Price filter
            let matchesPrice = true;
            if (priceFilter) {
                const price = product.price;
                switch (priceFilter) {
                    case '0-25':
                        matchesPrice = price >= 0 && price <= 25;
                        break;
                    case '25-50':
                        matchesPrice = price > 25 && price <= 50;
                        break;
                    case '50-100':
                        matchesPrice = price > 50 && price <= 100;
                        break;
                    case '100+':
                        matchesPrice = price > 100;
                        break;
                }
            }

            return matchesSearch && matchesCategory && matchesPrice;
        });

        this.renderProducts(filteredProducts);
    }

    renderProducts(productsToRender = this.products) {
        const productGrid = document.getElementById('productGrid');
        if (!productGrid) return;

        if (productsToRender.length === 0) {
            productGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No items found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        productGrid.innerHTML = productsToRender.map(product => `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${product.title}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <span class="product-category">${product.category}</span>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">$${product.price}</span>
                        <span class="product-type ${product.type}">${product.type}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click handlers to product cards
        productGrid.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const productId = card.dataset.id;
                this.viewProduct(productId);
            });
        });
    }

    // Form Submission
    setupFormSubmission() {
        const form = document.getElementById('postItemForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const product = {
                id: Date.now().toString(),
                title: formData.get('title'),
                category: formData.get('category'),
                condition: formData.get('condition'),
                description: formData.get('description'),
                price: parseFloat(formData.get('price')),
                type: formData.get('type'),
                contactEmail: formData.get('contactEmail'),
                contactPhone: formData.get('contactPhone'),
                createdAt: new Date().toISOString(),
                views: 0,
                userId: 'current-user' // In a real app, this would be the actual user ID
            };

            try {
                // Add to products array
                this.products.unshift(product);
                this.userListings.unshift(product);
                
                // Update UI
                this.renderProducts();
                this.updateDashboard();
                
                // Show success message
                this.showNotification('Item posted successfully!', 'success');
                
                // Reset form
                form.reset();
                
                // Navigate to marketplace
                document.querySelector('[data-section="marketplace"]').click();
                
            } catch (error) {
                this.showNotification('Error posting item. Please try again.', 'error');
            }
        });
    }

    // Dashboard Updates
    updateDashboard() {
        document.getElementById('activeListings').textContent = this.userListings.length;
        document.getElementById('totalViews').textContent = this.userListings.reduce((sum, item) => sum + (item.views || 0), 0);
        document.getElementById('successfulSwaps').textContent = Math.floor(this.userListings.length * 0.3); // Mock data
        
        this.renderUserListings();
    }

    renderUserListings() {
        const myListings = document.getElementById('myListings');
        if (!myListings) return;

        if (this.userListings.length === 0) {
            myListings.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h3>No active listings</h3>
                    <p>Start by posting your first item!</p>
                    <button class="btn btn-primary" onclick="document.querySelector('[data-section=\"post-item\"]').click()">
                        <i class="fas fa-plus"></i> Post Item
                    </button>
                </div>
            `;
            return;
        }

        myListings.innerHTML = this.userListings.map(listing => `
            <div class="product-card">
                <img src="${listing.image || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${listing.title}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${listing.title}</h3>
                    <span class="product-category">${listing.category}</span>
                    <p class="product-description">${listing.description}</p>
                    <div class="product-footer">
                        <span class="product-price">$${listing.price}</span>
                        <div class="product-actions">
                            <button class="btn btn-sm btn-warning" onclick="campusSwap.editListing('${listing.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-error" onclick="campusSwap.deleteListing('${listing.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Utility Functions
    loadSampleData() {
        // Sample product data
        this.products = [
            {
                id: '1',
                title: 'Calculus Textbook - 8th Edition',
                category: 'textbooks',
                condition: 'good',
                description: 'Used calculus textbook in good condition. Some highlighting but still very readable. Perfect for MATH 101.',
                price: 45.00,
                type: 'sale',
                contactEmail: 'student1@university.edu',
                createdAt: new Date().toISOString(),
                views: 23,
                userId: 'user1'
            },
            {
                id: '2',
                title: 'MacBook Air 2020',
                category: 'electronics',
                condition: 'like-new',
                description: 'MacBook Air 2020 model with M1 chip. 8GB RAM, 256GB SSD. Barely used, selling because I upgraded.',
                price: 750.00,
                type: 'sale',
                contactEmail: 'student2@university.edu',
                createdAt: new Date().toISOString(),
                views: 45,
                userId: 'user2'
            },
            {
                id: '3',
                title: 'Physics Lab Manual',
                category: 'textbooks',
                condition: 'new',
                description: 'Brand new physics lab manual for PHYS 201. Never used, still in plastic wrap.',
                price: 25.00,
                type: 'both',
                contactEmail: 'student3@university.edu',
                createdAt: new Date().toISOString(),
                views: 12,
                userId: 'user3'
            },
            {
                id: '4',
                title: 'iPad Pro 11" 2021',
                category: 'electronics',
                condition: 'good',
                description: 'iPad Pro 11-inch 2021 model. Comes with Apple Pencil and Smart Keyboard. Perfect for note-taking.',
                price: 650.00,
                type: 'swap',
                contactEmail: 'student4@university.edu',
                createdAt: new Date().toISOString(),
                views: 34,
                userId: 'user4'
            },
            {
                id: '5',
                title: 'Chemistry Textbook',
                category: 'textbooks',
                condition: 'fair',
                description: 'General chemistry textbook. Well-used but complete and readable. Some wear on the cover.',
                price: 20.00,
                type: 'sale',
                contactEmail: 'student5@university.edu',
                createdAt: new Date().toISOString(),
                views: 8,
                userId: 'user5'
            },
            {
                id: '6',
                title: 'Sony WH-1000XM4 Headphones',
                category: 'electronics',
                condition: 'like-new',
                description: 'Premium noise-canceling headphones. Used sparingly, includes original case and accessories.',
                price: 200.00,
                type: 'both',
                contactEmail: 'student6@university.edu',
                createdAt: new Date().toISOString(),
                views: 67,
                userId: 'user6'
            }
        ];

        this.renderProducts();
    }

    viewProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            product.views = (product.views || 0) + 1;
            this.showNotification(`Viewing: ${product.title}`, 'info');
        }
    }

    editListing(listingId) {
        const listing = this.userListings.find(l => l.id === listingId);
        if (listing) {
            this.showNotification('Edit functionality coming soon!', 'info');
        }
    }

    deleteListing(listingId) {
        if (confirm('Are you sure you want to delete this listing?')) {
            this.products = this.products.filter(p => p.id !== listingId);
            this.userListings = this.userListings.filter(l => l.id !== listingId);
            this.renderProducts();
            this.updateDashboard();
            this.showNotification('Listing deleted successfully!', 'success');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            z-index: 1000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize the app
let campusSwap;
document.addEventListener('DOMContentLoaded', () => {
    campusSwap = new CampusSwap();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        transition: background-color 0.2s ease;
    }
    
    .notification-close:hover {
        background: rgb(255 255 255 / 0.2);
    }
    
    .product-actions {
        display: flex;
        gap: 0.5rem;
    }
    
    .btn-sm {
        padding: 0.5rem;
        font-size: 0.875rem;
    }
    
    .btn-warning {
        background: var(--warning-color);
        color: white;
    }
    
    .btn-error {
        background: var(--error-color);
        color: white;
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: var(--shadow-md);
        padding: 1rem;
    }
`;
document.head.appendChild(style);