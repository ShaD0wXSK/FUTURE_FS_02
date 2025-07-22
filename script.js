document.addEventListener('DOMContentLoaded', () => {
    // --- Helper function to validate wishlist against current products ---
    const getValidatedWishlist = () => {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (!Array.isArray(storedWishlist)) {
            return [];
        }
        const validProductIds = products.map(p => p.id);
        const validated = storedWishlist.filter(itemId => validProductIds.includes(itemId));
        if (validated.length !== storedWishlist.length) {
            localStorage.setItem('wishlist', JSON.stringify(validated));
        }
        return validated;
    };

    // --- Element Selectors ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const searchIcon = document.getElementById('search-icon');
    const searchBarContainer = document.getElementById('search-bar-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // --- State ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = getValidatedWishlist();

    // --- Core Functions ---
    const updateCartIcon = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-item-count').forEach(el => {
            el.textContent = totalItems;
        });
    };
    
    const updateWishlistIcon = () => {
        const totalItems = wishlist.length;
        document.querySelectorAll('.wishlist-item-count').forEach(el => {
            el.textContent = totalItems;
        });
    };

    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartIcon();
    };

    const saveWishlist = () => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistIcon();
    };

    const addToCart = (productId, quantity = 1) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id: productId, quantity });
        }
        saveCart();
        const button = document.querySelector(`.add-to-cart-btn[data-id='${productId}']`);
        if(button) {
            const originalText = "Add to Cart";
            button.textContent = 'Added!';
            button.classList.add('added');
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('added');
            }, 2000);
        }
    };

    const toggleWishlist = (productId) => {
        const productIndex = wishlist.findIndex(item => item === productId);
        if (productIndex > -1) {
            wishlist.splice(productIndex, 1);
        } else {
            wishlist.push(productId);
        }
        saveWishlist();
        updateAllWishlistStatuses();
    };
    
    const updateAllWishlistStatuses = () => {
        products.forEach(p => updateWishlistStatus(p.id));
    };
    
    const updateWishlistStatus = (productId) => {
        const buttons = document.querySelectorAll(`.add-to-wishlist-btn[data-id='${productId}']`);
        buttons.forEach(button => {
            const isWishlisted = wishlist.includes(productId);
            button.innerHTML = isWishlisted ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
            button.classList.toggle('active', isWishlisted);
        });
    };

    // --- UPDATED to include brand, rating, and new price format ---
    const createProductCardHTML = (product) => {
        const isWishlisted = wishlist.includes(product.id);
        const formattedPrice = new Intl.NumberFormat('en-IN').format(product.price);

        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image-container">
                    <a href="product-detail.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.name}">
                    </a>
                    <div class="product-overlay">
                         <a href="#" class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</a>
                         <a href="#" class="btn buy-now-btn" data-id="${product.id}">Buy Now</a>
                         <a href="#" class="nav-icon add-to-wishlist-btn" data-id="${product.id}">
                             <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
                         </a>
                    </div>
                </div>
                <div class="product-info">
                    <p class="product-brand">${product.brand}</p>
                    <h3><a href="product-detail.html?id=${product.id}">${product.name}</a></h3>
                    <div class="product-meta">
                        <p class="product-price">₹${formattedPrice}</p>
                        <p class="product-rating"><i class="fas fa-star"></i> ${product.rating}</p>
                    </div>
                </div>
            </div>
        `;
    };
    
    // --- Page-Specific Logic ---

    // Homepage (`index.html`)
    if (document.querySelector('.featured-products')) {
        const featuredGrid = document.getElementById('featured-products-grid');
        if(featuredGrid) {
            const featuredProducts = products.slice(0, 16);
            featuredGrid.innerHTML = featuredProducts.map(createProductCardHTML).join('');
            updateAllWishlistStatuses();
        }
    }
    
    // Products Page (`products.html`)
    if (document.body.classList.contains('products-page-body')) {
        const productsGrid = document.getElementById('products-grid');
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        const priceValue = document.getElementById('price-value');
        const sortFilter = document.getElementById('sort-filter');
        const listingTitle = document.getElementById('listing-title');
        const paginationControls = document.getElementById('pagination-controls');

        let allFilteredProducts = [];
        let currentPage = 1;
        const PRODUCTS_PER_PAGE = 28;

        const renderProducts = (productsToRender) => {
            if (productsToRender.length === 0) {
                productsGrid.innerHTML = '<p>No products found matching your criteria.</p>';
                return;
            }
            productsGrid.innerHTML = productsToRender.map(createProductCardHTML).join('');
            updateAllWishlistStatuses();
        };

        const renderPagination = () => {
            const totalPages = Math.ceil(allFilteredProducts.length / PRODUCTS_PER_PAGE);
            paginationControls.innerHTML = '';

            if (totalPages <= 1) return;

            const prevButton = document.createElement('button');
            prevButton.innerHTML = '&laquo; Prev';
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderPaginatedView();
                }
            });
            paginationControls.appendChild(prevButton);

            const pageInfo = document.createElement('span');
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
            paginationControls.appendChild(pageInfo);

            const nextButton = document.createElement('button');
            nextButton.innerHTML = 'Next &raquo;';
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderPaginatedView();
                }
            });
            paginationControls.appendChild(nextButton);
        };
        
        const renderPaginatedView = () => {
            const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
            const endIndex = startIndex + PRODUCTS_PER_PAGE;
            const productsForPage = allFilteredProducts.slice(startIndex, endIndex);
            renderProducts(productsForPage);
            renderPagination();
            window.scrollTo(0, 0);
        };

        const applyFiltersAndSort = () => {
            let filtered = [...products];
            
            const urlParams = new URLSearchParams(window.location.search);
            const searchQuery = urlParams.get('search');
            const categoryQuery = urlParams.get('category');
            
            if (searchQuery) {
                listingTitle.textContent = `Search results for: "${searchQuery}"`;
                filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
            } else if (categoryQuery) {
                 listingTitle.textContent = `Showing: ${categoryQuery}`;
                 categoryFilter.value = categoryQuery;
            } else {
                 listingTitle.textContent = 'All Products';
            }

            const category = categoryFilter.value;
            if (category !== 'all') {
                filtered = filtered.filter(p => p.category === category);
            }

            const maxPrice = products.reduce((max, p) => p.price > max ? p.price : max, 0);
            priceFilter.max = maxPrice;
            const price = parseFloat(priceFilter.value);
            priceValue.textContent = `₹${new Intl.NumberFormat('en-IN').format(price)}`;
            filtered = filtered.filter(p => p.price <= price);

            const sortBy = sortFilter.value;
            if (sortBy === 'price-asc') {
                filtered.sort((a, b) => a.price - b.price);
            } else if (sortBy === 'price-desc') {
                filtered.sort((a, b) => b.price - a.price);
            } else if (sortBy === 'rating-desc') {
                filtered.sort((a, b) => b.rating - a.rating);
            }

            allFilteredProducts = filtered;
            currentPage = 1;
            renderPaginatedView();
        };

        // Set initial max price for the range slider
        const maxPrice = products.reduce((max, p) => p.price > max ? p.price : max, 0);
        priceFilter.max = maxPrice;
        priceFilter.value = maxPrice;

        [categoryFilter, priceFilter, sortFilter].forEach(el => el.addEventListener('change', applyFiltersAndSort));
        applyFiltersAndSort();
    }

    // Cart Page (`cart.html`)
    if (document.body.classList.contains('cart-page-body')) {
        const cartItemsList = document.getElementById('cart-items-list');
        const cartSubtotalEl = document.getElementById('cart-subtotal');
        const cartTaxEl = document.getElementById('cart-tax');
        const cartTotalEl = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        const renderCart = () => {
            updateCartSummary();
            if (cart.length === 0) {
                cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
                checkoutBtn.classList.add('disabled');
                return;
            }
            
            checkoutBtn.classList.remove('disabled');
            cartItemsList.innerHTML = cart.map(item => {
                const product = products.find(p => p.id === item.id);
                return `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="cart-item-info">
                            <h3>${product.brand} ${product.name}</h3>
                            <p>₹${new Intl.NumberFormat('en-IN').format(product.price)}</p>
                        </div>
                        <div class="cart-item-quantity">
                            <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                        </div>
                        <p class="cart-item-total">₹${new Intl.NumberFormat('en-IN').format(product.price * item.quantity)}</p>
                        <button class="cart-item-remove"><i class="fas fa-trash"></i></button>
                    </div>
                `;
            }).join('');
        };

        const updateCartSummary = () => {
            const subtotal = cart.reduce((sum, item) => {
                const product = products.find(p => p.id === item.id);
                return sum + (product.price * item.quantity);
            }, 0);

            const tax = 0; // Tax removed
            const total = subtotal + tax;

            cartSubtotalEl.textContent = `₹${new Intl.NumberFormat('en-IN').format(subtotal)}`;
            if (cartTaxEl) {
                cartTaxEl.textContent = `₹${new Intl.NumberFormat('en-IN').format(tax)}`;
            }
            cartTotalEl.textContent = `₹${new Intl.NumberFormat('en-IN').format(total)}`;
        };

        cartItemsList.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const productId = parseInt(e.target.closest('.cart-item').dataset.id);
                const newQuantity = parseInt(e.target.value);
                const cartItem = cart.find(item => item.id === productId);
                if (cartItem && newQuantity > 0) {
                    cartItem.quantity = newQuantity;
                    saveCart();
                    renderCart();
                }
            }
        });

        cartItemsList.addEventListener('click', (e) => {
            if (e.target.closest('.cart-item-remove')) {
                const productId = parseInt(e.target.closest('.cart-item').dataset.id);
                cart = cart.filter(item => item.id !== productId);
                saveCart();
                renderCart();
            }
        });

        renderCart();
    }
    
    // Wishlist Page (`wishlist.html`)
    if (document.body.classList.contains('wishlist-page-body')) {
        const wishlistItemsList = document.getElementById('wishlist-items-list');

        const renderWishlist = () => {
            if (wishlist.length === 0) {
                wishlistItemsList.innerHTML = '<p>Your wishlist is empty. Start adding some products!</p>';
                return;
            }

            wishlistItemsList.innerHTML = wishlist.map(itemId => {
                const product = products.find(p => p.id === itemId);
                if (!product) return '';
                return `
                    <div class="wishlist-item" data-id="${product.id}">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="wishlist-item-info">
                            <h3><a href="product-detail.html?id=${product.id}">${product.brand} ${product.name}</a></h3>
                            <p class="product-price">₹${new Intl.NumberFormat('en-IN').format(product.price)}</p>
                        </div>
                        <div class="wishlist-item-actions">
                            <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                            <button class="wishlist-item-remove" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `;
            }).join('');
        };

        wishlistItemsList.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.wishlist-item-remove');
            if(removeBtn) {
                const productId = parseInt(removeBtn.dataset.id);
                toggleWishlist(productId);
                renderWishlist();
            }
        });

        renderWishlist();
    }
    
    // Checkout Page (`checkout.html`)
    if (document.body.classList.contains('checkout-page-body')) {
        const checkoutSummaryItems = document.getElementById('checkout-summary-items');
        const checkoutTotalEl = document.getElementById('checkout-total');
        const checkoutForm = document.getElementById('checkout-form-element');

        const renderCheckoutSummary = () => {
            if (cart.length === 0) {
                checkoutSummaryItems.innerHTML = '<p>Your cart is empty.</p>';
                document.querySelector('.place-order-btn').classList.add('disabled');
                return;
            }

            checkoutSummaryItems.innerHTML = cart.map(item => {
                const product = products.find(p => p.id === item.id);
                return `
                    <div class="summary-row">
                        <span>${product.brand} ${product.name} (x${item.quantity})</span>
                        <span>₹${new Intl.NumberFormat('en-IN').format(product.price * item.quantity)}</span>
                    </div>
                `;
            }).join('');

            const subtotal = cart.reduce((sum, item) => {
                const product = products.find(p => p.id === item.id);
                return sum + (product.price * item.quantity);
            }, 0);
            const tax = 0; // Tax removed
            const total = subtotal + tax;
            checkoutTotalEl.textContent = `₹${new Intl.NumberFormat('en-IN').format(total)}`;
        };

        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cart.length > 0) {
                alert('Order placed successfully! (This is a demo)');
                cart = [];
                saveCart();
                window.location.href = 'index.html';
            } else {
                alert('Your cart is empty.');
            }
        });
        
        renderCheckoutSummary();
    }

    // --- Global Event Listeners ---
    if (menuToggle) {
        menuToggle.addEventListener('click', () => mobileNavMenu.classList.toggle('active'));
    }

    window.onscroll = () => {
        if (scrollToTopBtn) {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                scrollToTopBtn.style.display = "block";
            } else {
                scrollToTopBtn.style.display = "none";
            }
        }
    };

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    if (searchIcon) {
        searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            searchBarContainer.classList.toggle('active');
            if (searchBarContainer.classList.contains('active')) {
                searchInput.focus();
            }
        });
    }
    
    const executeSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }
    };

    if(searchButton) {
        searchButton.addEventListener('click', executeSearch);
    }
    if(searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                executeSearch();
            }
        });
    }

    document.body.addEventListener('click', (e) => {
        const addToCartBtn = e.target.closest('.add-to-cart-btn');
        const addToWishlistBtn = e.target.closest('.add-to-wishlist-btn');
        const buyNowBtn = e.target.closest('.buy-now-btn');

        if (addToCartBtn) {
            e.preventDefault();
            const productId = parseInt(addToCartBtn.dataset.id);
            addToCart(productId);
        }

        if (buyNowBtn) {
            e.preventDefault();
            const productId = parseInt(buyNowBtn.dataset.id);
            const product = products.find(p => p.id === productId);
            if (!product) return;
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id: productId, quantity: 1 });
            }
            saveCart();
            window.location.href = 'checkout.html';
        }

        if (addToWishlistBtn) {
            e.preventDefault();
            const productId = parseInt(addToWishlistBtn.dataset.id);
            toggleWishlist(productId);
        }
    });

    // --- Initial Load ---
    updateCartIcon();
    updateWishlistIcon();
});