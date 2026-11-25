
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
        this.setupImagePreview();
        this.loadProductsFromAPI();
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

                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                sections.forEach(section => section.classList.remove('active'));
                const targetElement = document.getElementById(targetSection);

                if (targetElement) {
                    targetElement.classList.add('active');
                }
            });
        });

        // Mobile navigation
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
            const matchesSearch =
                product.title.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm);

            const matchesCategory =
                !categoryFilter || product.category === categoryFilter;

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

    // Display Products with Contact Seller options
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
            <img src="${product.image || 'https://via.placeholder.com/300x200?text=No+Image'}"
                 alt="${product.title}" class="product-image">

            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>

                <span class="product-category">${product.category}</span>

                <p class="product-description">${product.description}</p>

                <div class="product-footer">
                    <span class="product-price">$${product.price}</span>
                    <span class="product-type ${product.type}">${product.type}</span>
                </div>

                <div class="seller-contact">
                    <p>
                        <strong>Seller:</strong>
                        ${product.sellerName || 'Not provided'}
                    </p>

                    ${product.contactEmail ? `
                        <a href="mailto:${product.contactEmail}"
                           class="btn btn-sm btn-primary contact-link">
                            <i class="fas fa-envelope"></i>
                            Email Seller
                        </a>
                    ` : ''}

                    ${product.contactPhone ? `
                        <a href="tel:${product.contactPhone}"
                           class="btn btn-sm btn-primary contact-link">
                            <i class="fas fa-phone"></i>
                            Call Seller
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');

    productGrid.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {

            // Don't trigger product view when clicking contact links.
            if (e.target.closest('.contact-link')) return;

            const productId = card.dataset.id;
            this.viewProduct(productId);
        });
    });
}
    // Image Preview Functionality
    setupImagePreview() {
        const imageInput = document.getElementById('itemPhotos');
        const imagePreview = document.getElementById('imagePreview');

        if (!imageInput || !imagePreview) return;

        this.previewUrls = [];

        imageInput.addEventListener('change', () => {
            this.clearImagePreview();

            const selectedFiles = Array.from(imageInput.files || []);
            const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));

            if (imageFiles.length === 0) return;

            imageFiles.forEach(file => {
                const imageUrl = URL.createObjectURL(file);
                this.previewUrls.push(imageUrl);

                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';

                const image = document.createElement('img');
                image.src = imageUrl;
                image.alt = file.name;
                image.className = 'image-preview-photo';

                const fileName = document.createElement('p');
                fileName.className = 'image-preview-name';
                fileName.textContent = file.name;

                previewItem.appendChild(image);
                previewItem.appendChild(fileName);
                imagePreview.appendChild(previewItem);
            });
        });
    }

    // Remove displayed previews and release temporary URLs.
    clearImagePreview() {
        const imagePreview = document.getElementById('imagePreview');

        if (imagePreview) {
            imagePreview.innerHTML = '';
        }

        if (this.previewUrls) {
            this.previewUrls.forEach(url => URL.revokeObjectURL(url));
            this.previewUrls = [];
        }
    }

    // GET Products from Backend
    async loadProductsFromAPI() {
        try {
            const response = await fetch(
                'https://open-surreal-darkness.ngrok-free.dev/api/products',
                {
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error('Unexpected API response format');
            }

            this.products = data.map(product => ({
                id: product._id,
                title: product.title,
                description: product.description,
                price: Number(product.price),
                category: product.category,
                image: product.image || "",
                sellerName: product.sellerName,
                contactEmail: product.contactEmail,
                contactPhone: product.contactPhone,
                type: product.type,
                condition: product.condition,
                status: product.status,
                createdAt: product.createdAt,
                views: product.views || 0,
                userId: product.userId ?? null
            }));

            // Display all backend products in Dashboard → My Listings.
            this.userListings = [...this.products];

            this.renderProducts();
            this.updateDashboard();

            console.log('Products loaded successfully:', this.products);

        } catch (error) {
            console.error('GET API Error:', error);

            this.showNotification(
                'Unable to load products. Please check the backend connection.',
                'error'
            );
        }
    }
    // Upload Image to Cloudinary through Backend
async uploadImage(file) {
    if (!file) return "";

    if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file.');
    }

    if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must not exceed 5 MB.');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(
        'https://open-surreal-darkness.ngrok-free.dev/api/products/image',
        {
            method: 'POST',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error(`Image upload failed! Status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.imageUrl) {
        throw new Error('Image URL was not returned by the backend.');
    }

    return result.imageUrl;
}

    // Form Submission (POST API Integration)
setupFormSubmission() {
    const form = document.getElementById('postItemForm');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        try {
            // Upload selected image first
            const selectedImage = document.getElementById('itemPhotos').files[0];

            let imageUrl = "";

            if (selectedImage) {
                this.showNotification('Uploading image...', 'info');
                imageUrl = await this.uploadImage(selectedImage);
            }

            // Prepare product details
            const productData = {
                title: formData.get('title'),
                description: formData.get('description'),
                price: parseFloat(formData.get('price')),
                category: formData.get('category'),
                image: imageUrl,
                sellerName: formData.get('sellerName'),
                contactEmail: formData.get('contactEmail'),
                contactPhone: formData.get('contactPhone'),
                type: formData.get('type'),
                condition: formData.get('condition')
            };

            // Save product in backend
            const response = await fetch(
                'https://open-surreal-darkness.ngrok-free.dev/api/products',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify(productData)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const savedProduct = await response.json();

            const product = {
                id: savedProduct._id,
                title: savedProduct.title,
                description: savedProduct.description,
                price: Number(savedProduct.price),
                category: savedProduct.category,
                image: savedProduct.image || "",
                sellerName: savedProduct.sellerName,
                contactEmail: savedProduct.contactEmail,
                contactPhone: savedProduct.contactPhone,
                type: savedProduct.type,
                condition: savedProduct.condition,
                status: savedProduct.status,
                createdAt: savedProduct.createdAt,
                views: savedProduct.views || 0,
                userId: savedProduct.userId ?? null
            };

            this.products.unshift(product);
            this.userListings.unshift(product);

            this.renderProducts();
            this.updateDashboard();

            this.showNotification(
                'Item posted successfully!',
                'success'
            );

            form.reset();
            this.clearImagePreview();

            document.querySelector(
                '[data-section="marketplace"]'
            ).click();

            console.log('POST API Success:', savedProduct);

        } catch (error) {
            console.error('POST API Error:', error);

            this.showNotification(
                error.message || 'Error posting item. Please check the backend connection.',
                'error'
            );
        }
    });
}
    // Dashboard Updates
    updateDashboard() {
        const activeListings = document.getElementById('activeListings');
        const totalViews = document.getElementById('totalViews');
        const successfulSwaps = document.getElementById('successfulSwaps');

        if (activeListings) {
            activeListings.textContent = this.userListings.length;
        }

        if (totalViews) {
            totalViews.textContent = this.userListings.reduce(
                (sum, item) => sum + (item.views || 0),
                0
            );
        }

        if (successfulSwaps) {
            successfulSwaps.textContent = 0;
        }

        this.renderUserListings();
    }

    // Display User Listings
    renderUserListings() {
        const myListings = document.getElementById('myListings');

        if (!myListings) return;

        if (this.userListings.length === 0) {
            myListings.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h3>No active listings</h3>
                    <p>Start by posting your first item!</p>

                    <button class="btn btn-primary"
                        onclick="document.querySelector('[data-section=&quot;post-item&quot;]').click()">
                        <i class="fas fa-plus"></i> Post Item
                    </button>
                </div>
            `;
            return;
        }

        myListings.innerHTML = this.userListings.map(listing => `
            <div class="product-card">
                <img src="${listing.image || 'https://via.placeholder.com/300x200?text=No+Image'}"
                     alt="${listing.title}" class="product-image">

                <div class="product-info">
                    <h3 class="product-title">${listing.title}</h3>
                    <span class="product-category">${listing.category}</span>
                    <p class="product-description">${listing.description}</p>

                    <div class="product-footer">
                        <span class="product-price">$${listing.price}</span>

                        <div class="product-actions">
                            <button class="btn btn-sm btn-warning"
                                onclick="campusSwap.editListing('${listing.id}')">
                                <i class="fas fa-edit"></i>
                            </button>

                            <button class="btn btn-sm btn-error"
                                onclick="campusSwap.deleteListing('${listing.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Sample Products (kept for reference; no longer called during initialization)
    loadSampleData() {
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

        this.userListings = [];
        this.renderProducts();
    }

    // View Product
    viewProduct(productId) {
        const product = this.products.find(p => p.id === productId);

        if (product) {
            product.views = (product.views || 0) + 1;

            this.showNotification(`Viewing: ${product.title}`, 'info');

            this.updateDashboard();
        }
    }

    
    // Edit Listing (PUT API Integration)
    async editListing(listingId) {
        const listing = this.userListings.find(l => l.id === listingId);

        if (!listing) {
            return;
        }

        const title = prompt("Enter new title:", listing.title);
        if (title === null) return;

        const category = prompt("Enter new category:", listing.category);
        if (category === null) return;

        const condition = prompt("Enter new condition:", listing.condition);
        if (condition === null) return;

        const description = prompt("Enter new description:", listing.description);
        if (description === null) return;

        const price = prompt("Enter new price:", listing.price);
        if (price === null) return;

        if (
            title.trim() === "" ||
            category.trim() === "" ||
            condition.trim() === "" ||
            description.trim() === "" ||
            price.trim() === "" ||
            isNaN(Number(price)) ||
            Number(price) < 0
        ) {
            this.showNotification("Please enter valid details!", "error");
            return;
        }

        const updatedDetails = {
            title: title.trim(),
            category: category.trim(),
            condition: condition.trim(),
            description: description.trim(),
            price: Number(price)
        };

        try {
            const response = await fetch(
                `https://open-surreal-darkness.ngrok-free.dev/api/products/${listingId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify(updatedDetails)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedProduct = await response.json();

            Object.assign(listing, updatedDetails);

            const product = this.products.find(p => p.id === listingId);

            if (product) {
                Object.assign(product, updatedDetails);
            }

            this.renderProducts();
            this.updateDashboard();

            this.showNotification(
                "Listing updated successfully!",
                "success"
            );

            console.log('PUT API Success:', updatedProduct);

        } catch (error) {
            console.error('PUT API Error:', error);

            this.showNotification(
                "Error updating listing. Please check the backend connection.",
                "error"
            );
        }
    }

    
// Delete Listing (DELETE API Integration)
async deleteListing(listingId) {
    if (!confirm('Are you sure you want to delete this listing?')) {
        return;
    }

    try {
        const response = await fetch(
            `https://open-surreal-darkness.ngrok-free.dev/api/products/${listingId}`,
            {
                method: 'DELETE',
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        this.products = this.products.filter(
            p => p.id !== listingId
        );

        this.userListings = this.userListings.filter(
            l => l.id !== listingId
        );

        this.renderProducts();
        this.updateDashboard();

        this.showNotification(
            'Listing deleted successfully!',
            'success'
        );

        console.log('DELETE API Success:', listingId);

    } catch (error) {
        console.error('DELETE API Error:', error);

        this.showNotification(
            'Error deleting item. Please check the backend connection.',
            'error'
        );
    }
}

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');

        notification.className = `notification notification-${type}`;

        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${
                    type === 'success'
                        ? 'check-circle'
                        : type === 'error'
                        ? 'exclamation-circle'
                        : 'info-circle'
                }"></i>

                <span>${message}</span>

                <button class="notification-close"
                    onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${
                type === 'success'
                    ? '#10b981'
                    : type === 'error'
                    ? '#ef4444'
                    : '#3b82f6'
            };
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            z-index: 1000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

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

    .image-preview {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 12px;
    }

    .image-preview-item {
        width: 120px;
        padding: 8px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        background: #ffffff;
        overflow: hidden;
    }

    .image-preview-photo {
        display: block;
        width: 100%;
        height: 90px;
        object-fit: cover;
        border-radius: 5px;
    }

    .image-preview-name {
        margin: 6px 0 0;
        font-size: 12px;
        color: #4b5563;
        overflow-wrap: anywhere;
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
