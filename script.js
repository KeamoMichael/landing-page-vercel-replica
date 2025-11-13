// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    body.setAttribute('data-theme', initialTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // Domain search functionality
    const domainInput = document.getElementById('domain-input');
    const heroDomainInput = document.getElementById('hero-domain-input');
    const searchButton = document.getElementById('search-button');
    const heroSearchButton = document.getElementById('hero-search-button');
    const searchResultsSection = document.getElementById('search-results-section');
    const resultsGrid = document.getElementById('results-grid');
    
    // Use the active input (navbar or hero)
    function getActiveInput() {
        return domainInput && domainInput.offsetParent !== null ? domainInput : heroDomainInput;
    }
    
    // Sync input values between hero and navbar search
    function syncInputs() {
        if (domainInput && heroDomainInput) {
            const activeInput = getActiveInput();
            const inactiveInput = activeInput === domainInput ? heroDomainInput : domainInput;
            inactiveInput.value = activeInput.value;
        }
    }
    
    // Common TLDs to search
    const commonTLDs = ['.com', '.co', '.io', '.net', '.org', '.dev', '.app', '.xyz', '.tech', '.ai', '.me', '.tv', '.online', '.store', '.shop', '.space', '.cloud', '.studio', '.sh', '.academy', '.agency', '.bike', '.bio', '.builders', '.careers', '.chat', '.accountants', '.actor', '.airforce', '.apartments', '.archi', '.army', '.associates', '.attorney', '.auction', '.band', '.bargains', '.bet', '.bingo', '.black', '.blue', '.boutique', '.broker', '.business', '.cab', '.cafe', '.camera', '.camp', '.capital', '.cards', '.care', '.cash', '.casino', '.catering', '.center', '.cheap'];
    
    // Top TLDs for "Top Results" section
    const topTLDs = ['.com', '.dev', '.app', '.io'];
    
    // Mock pricing data (in a real app, this would come from an API)
    const tldPrices = {
        '.com': 12.99,
        '.co': 24.99,
        '.io': 49.99,
        '.net': 14.99,
        '.org': 12.99,
        '.dev': 19.99,
        '.app': 19.99,
        '.xyz': 1.99,
        '.tech': 29.99,
        '.ai': 79.99,
        '.me': 19.99,
        '.tv': 29.99,
        '.online': 9.99,
        '.store': 49.99,
        '.shop': 29.99,
        '.space': 15.99,
        '.cloud': 29.99,
        '.studio': 24.99,
        '.sh': 19.99,
        '.academy': 34.99,
        '.agency': 29.99,
        '.bike': 19.99,
        '.bio': 19.99,
        '.builders': 24.99,
        '.careers': 29.99,
        '.chat': 19.99,
        '.accountants': 43.99,
        '.actor': 19.99,
        '.airforce': 106.68,
        '.apartments': 19.99,
        '.archi': 24.99,
        '.army': 19.99,
        '.associates': 21.99,
        '.attorney': 58.00,
        '.auction': 4.99,
        '.band': 27.00,
        '.bargains': 21.99,
        '.bet': 14.99,
        '.bingo': 14.99,
        '.black': 29.99,
        '.blue': 21.99,
        '.boutique': 4.99,
        '.broker': 19.99,
        '.business': 3.99,
        '.cab': 19.99,
        '.cafe': 7.99,
        '.camera': 21.99,
        '.camp': 7.99,
        '.capital': 9.99,
        '.cards': 3.99,
        '.care': 29.99,
        '.cash': 11.99,
        '.casino': 17.99,
        '.catering': 34.00,
        '.center': 7.99,
        '.cheap': 9.99
    };
    
    // Function to check if domain is available (mock function)
    function checkDomainAvailability(domain, tld) {
        const fullDomain = domain + tld;
        // Mock availability - in real app, this would be an API call
        // For demo purposes, some domains are unavailable
        const unavailableDomains = ['example.com', 'test.com', 'demo.com', 'god.com', 'god.co'];
        return !unavailableDomains.includes(fullDomain.toLowerCase());
    }
    
    // Function to enter search mode
    function enterSearchMode() {
        const navbar = document.querySelector('.navbar');
        const mainContent = document.querySelector('.main-content');
        if (navbar) {
            navbar.classList.add('search-mode');
        }
        if (mainContent) {
            mainContent.classList.add('search-mode');
        }
        if (searchResultsSection) {
            searchResultsSection.classList.add('active');
        }
        // Sync input value to navbar search
        if (heroDomainInput && domainInput) {
            domainInput.value = heroDomainInput.value;
            domainInput.focus();
        }
    }
    
    // Function to exit search mode
    function exitSearchMode() {
        const navbar = document.querySelector('.navbar');
        const mainContent = document.querySelector('.main-content');
        if (navbar) {
            navbar.classList.remove('search-mode');
        }
        if (mainContent) {
            mainContent.classList.remove('search-mode');
        }
        if (searchResultsSection) {
            searchResultsSection.classList.remove('active');
        }
        if (domainInput) {
            domainInput.value = '';
        }
        if (heroDomainInput) {
            heroDomainInput.value = '';
        }
    }
    
    // Function to create domain card
    function createDomainCard(result) {
        const card = document.createElement('div');
        card.className = `domain-result-card ${result.available ? 'available' : 'unavailable'}`;
        
        if (result.available) {
            card.innerHTML = `
                <div class="domain-info">
                    <span class="domain-name">${result.domain}</span>
                </div>
                <div class="domain-actions">
                    <div class="domain-price">$${result.price.toFixed(2)}</div>
                    <button class="add-domain-btn" data-domain="${result.domain}" data-price="${result.price}">
                        <svg class="cart-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4H12L11 10H5L4 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6 13C6.55228 13 7 12.5523 7 12C7 11.4477 6.55228 11 6 11C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13Z" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M10 13C10.5523 13 11 12.5523 11 12C11 11.4477 10.5523 11 10 11C9.44772 11 9 11.4477 9 12C9 12.5523 9.44772 13 10 13Z" stroke="currentColor" stroke-width="1.5"/>
                        </svg>
                        <svg class="plus-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 2V10M2 6H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        <span class="add-text">Add</span>
                    </button>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="domain-info">
                    <span class="domain-name">${result.domain}</span>
                    <span class="domain-status">Unavailable</span>
                </div>
                <div class="domain-price">—</div>
            `;
        }
        
        // Add click handler for add button
        if (result.available) {
            const addBtn = card.querySelector('.add-domain-btn');
            if (addBtn) {
                addBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const domain = this.getAttribute('data-domain');
                    const price = parseFloat(this.getAttribute('data-price'));
                    addDomainToCart(domain, price);
                    
                    // Visual feedback
                    this.classList.add('added');
                    setTimeout(() => {
                        this.classList.remove('added');
                    }, 1000);
                });
            }
        }
        
        return card;
    }
    
    // Function to search domains
    function searchDomains(query) {
        const topResultsGrid = document.getElementById('top-results-grid');
        if (!searchResultsSection || !resultsGrid || !topResultsGrid) {
            console.error('Search results elements not found');
            return;
        }
        
        if (!query || query.trim() === '') {
            exitSearchMode();
            return;
        }
        
        // Remove any existing TLD from the query
        const cleanQuery = query.replace(/\.(com|co|io|net|org|dev|app|xyz|tech|ai|me|tv|online|store|shop|space|cloud|studio|sh|academy|agency|bike|bio|builders|careers|chat|accountants|actor|airforce|apartments|archi|army|associates|attorney|auction|band|bargains|bet|bingo|black|blue|boutique|broker|business|cab|cafe|camera|camp|capital|cards|care|cash|casino|catering|center|cheap)$/i, '').trim();
        
        if (cleanQuery === '') {
            exitSearchMode();
            return;
        }
        
        // Enter search mode
        enterSearchMode();
        
        // Clear results
        topResultsGrid.innerHTML = '';
        resultsGrid.innerHTML = '';
        
        // Search for each TLD
        const allResults = [];
        commonTLDs.forEach(tld => {
            const isAvailable = checkDomainAvailability(cleanQuery, tld);
            const price = tldPrices[tld] || 9.99;
            allResults.push({
                domain: cleanQuery + tld,
                tld: tld,
                available: isAvailable,
                price: price
            });
        });
        
        // Separate top results and all results
        const topResults = [];
        const otherResults = [];
        
        allResults.forEach(result => {
            if (topTLDs.includes(result.tld)) {
                topResults.push(result);
            } else {
                otherResults.push(result);
            }
        });
        
        // Render top results
        topResults.forEach(result => {
            const card = createDomainCard(result);
            topResultsGrid.appendChild(card);
        });
        
        // Render all other results
        otherResults.forEach(result => {
            const card = createDomainCard(result);
            resultsGrid.appendChild(card);
        });
    }
    
    // Function to add domain to cart
    function addDomainToCart(domain, price) {
        // Access the cart from the outer scope or get from localStorage
        // The cart variable is defined later in the code, so we'll work with localStorage directly
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if domain already exists in cart (by name)
        const existingItem = cart.find(item => item.name === domain);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            // Generate a unique ID for the domain
            const domainId = Date.now(); // Simple ID generation
            cart.push({
                id: domainId,
                name: domain,
                price: price,
                quantity: 1
            });
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart UI - trigger a custom event that the cart system can listen to
        const cartUpdateEvent = new CustomEvent('cartUpdated');
        document.dispatchEvent(cartUpdateEvent);
        
        // Also directly update cart count if element exists
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
    
    // Debounce function for search
    let searchTimeout;
    function debounceSearch(query) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchDomains(query);
        }, 500);
    }
    
    // Function to handle search input
    function handleSearchInput(inputElement) {
        const query = inputElement.value.trim();
        if (query.length > 0) {
            debounceSearch(query);
        } else {
            exitSearchMode();
        }
    }
    
    // Event listeners for navbar search
    if (domainInput && searchButton) {
        searchButton.addEventListener('click', function() {
            const query = domainInput.value.trim();
            if (query) {
                searchDomains(query);
            }
        });
        
        domainInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = domainInput.value.trim();
                if (query) {
                    searchDomains(query);
                }
            }
        });
        
        domainInput.addEventListener('input', function(e) {
            handleSearchInput(e.target);
        });
    }
    
    // Event listeners for hero search
    if (heroDomainInput && heroSearchButton) {
        heroSearchButton.addEventListener('click', function() {
            const query = heroDomainInput.value.trim();
            if (query) {
                searchDomains(query);
            }
        });
        
        heroDomainInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = heroDomainInput.value.trim();
                if (query) {
                    searchDomains(query);
                }
            }
        });
        
        heroDomainInput.addEventListener('input', function(e) {
            handleSearchInput(e.target);
        });
    }
    
    // ESC key to exit search mode
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchResultsSection && searchResultsSection.classList.contains('active')) {
            exitSearchMode();
            const activeInput = getActiveInput();
            if (activeInput) {
                activeInput.blur();
            }
        }
    });
    
    if (!searchResultsSection || !resultsGrid) {
        console.error('Search results elements not found:', {
            searchResultsSection: !!searchResultsSection,
            resultsGrid: !!resultsGrid
        });
    }
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Smooth scroll implementation would go here
        });
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        observer.observe(card);
    });
    
    // Text rotator with per-character blur animation
    const rotatingText = document.getElementById('rotating-text');
    if (rotatingText) {
        const textOptions = [
            'your new identity.',
            'your startup.',
            'your passion project.',
            'your ai agent.'
        ];
        
        let currentIndex = 0;
        let isAnimating = false;
        
        // Function to split text into characters and wrap each in a span
        function wrapCharacters(text) {
            const chars = text.split('');
            return chars.map((char, index) => {
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space
                return span;
            });
        }
        
        // Function to blur out characters (left to right)
        function blurOutChars(chars, callback) {
            chars.forEach((char, index) => {
                setTimeout(() => {
                    char.classList.remove('blur-in');
                    char.classList.add('blur-out');
                }, index * 30); // 30ms delay between each character
            });
            
            setTimeout(() => {
                if (callback) callback();
            }, chars.length * 30 + 400);
        }
        
        // Function to blur in characters (left to right) - slides up from bottom
        function blurInChars(chars) {
            chars.forEach((char, index) => {
                // Start characters blurred and at bottom
                char.classList.remove('blur-in', 'blur-out');
                // Reset any inline styles first
                char.style.transform = '';
                char.style.filter = '';
                char.style.opacity = '';
                
                // Force reflow to ensure clean state
                void char.offsetWidth;
                
                // Set initial state (bottom, blurred) - use inline styles temporarily
                char.style.transform = 'translateY(20px)';
                char.style.filter = 'blur(8px)';
                char.style.opacity = '0';
                char.style.verticalAlign = 'baseline';
                
                // Force another reflow
                void char.offsetWidth;
                
                setTimeout(() => {
                    // Remove inline styles so CSS classes take over smoothly
                    char.style.transform = '';
                    char.style.filter = '';
                    char.style.opacity = '';
                    char.classList.add('blur-in');
                }, index * 30); // 30ms delay between each character
            });
        }
        
        // Initialize with first text
        function initializeText(text) {
            rotatingText.innerHTML = '';
            const chars = wrapCharacters(text);
            chars.forEach(char => {
                rotatingText.appendChild(char);
            });
            // Set a fixed height based on the content to prevent layout shifts
            const height = rotatingText.offsetHeight;
            if (height > 0) {
                rotatingText.style.minHeight = height + 'px';
            }
            // Blur in initial text with a small delay to ensure DOM is ready
            setTimeout(() => {
                blurInChars(chars);
            }, 50);
        }
        
        function rotateText() {
            if (isAnimating) return;
            
            isAnimating = true;
            
            const currentChars = Array.from(rotatingText.querySelectorAll('.char'));
            
            // Preserve current height to prevent layout shifts
            const currentHeight = rotatingText.offsetHeight;
            if (currentHeight > 0) {
                rotatingText.style.minHeight = currentHeight + 'px';
            }
            
            // Get new text immediately
            currentIndex = (currentIndex + 1) % textOptions.length;
            const newText = textOptions[currentIndex];
            const newChars = wrapCharacters(newText);
            
            // Create wrapper for new text and position it absolutely
            const newTextWrapper = document.createElement('span');
            newTextWrapper.className = 'text-wrapper';
            newChars.forEach(char => newTextWrapper.appendChild(char));
            rotatingText.appendChild(newTextWrapper);
            
            // Ensure wrapper matches the line height and positioning of the container
            const computedStyle = window.getComputedStyle(rotatingText);
            newTextWrapper.style.lineHeight = computedStyle.lineHeight;
            
            // Force layout to ensure proper positioning
            void newTextWrapper.offsetWidth;
            
            // Start blurring out old characters and blurring in new characters simultaneously
            blurOutChars(currentChars, () => {
                // Remove old characters after they're gone
                currentChars.forEach(char => {
                    if (char.parentNode && char.parentNode !== newTextWrapper) {
                        char.parentNode.removeChild(char);
                    }
                });
            });
            
            // Start blurring in new characters immediately (at the same time)
            blurInChars(newChars);
            
            // Clean up after animation completes
            setTimeout(() => {
                newChars.forEach(char => {
                    char.classList.remove('blur-out');
                    // Keep blur-in class so text stays visible and in position
                    if (!char.classList.contains('blur-in')) {
                        char.classList.add('blur-in');
                    }
                    char.style.transform = '';
                });
                
                // Move characters out of wrapper and remove wrapper
                // Use requestAnimationFrame to ensure smooth transition
                requestAnimationFrame(() => {
                    newChars.forEach(char => {
                        rotatingText.appendChild(char);
                    });
                    if (newTextWrapper.parentNode) {
                        newTextWrapper.parentNode.removeChild(newTextWrapper);
                    }
                    
                    // Update min-height based on new content to prevent future shifts
                    const newHeight = rotatingText.offsetHeight;
                    if (newHeight > 0) {
                        rotatingText.style.minHeight = newHeight + 'px';
                    }
                });
                
                isAnimating = false;
            }, Math.max(currentChars.length, newChars.length) * 30 + 400);
        }
        
        // Initialize with first text - replace any existing text
        // Clear the initial HTML text and start with first option
        rotatingText.textContent = '';
        initializeText(textOptions[0]);
        
        // Start rotation after initial display
        setTimeout(() => {
            setInterval(rotateText, 3500); // Rotate every 3.5 seconds
        }, 2500);
    }
    
    // Shopping Cart Functionality
    const products = [
        {
            id: 1,
            name: 'example.com',
            price: 12.99,
            description: 'Premium domain with instant DNS setup and privacy protection included.'
        },
        {
            id: 2,
            name: 'techstart.io',
            price: 24.99,
            description: 'Perfect for tech startups. Includes email forwarding and SSL certificate.'
        },
        {
            id: 3,
            name: 'mybrand.app',
            price: 19.99,
            description: 'Modern app domain with free WHOIS privacy and DNS management.'
        },
        {
            id: 4,
            name: 'creativestudio.design',
            price: 29.99,
            description: 'Creative domain for design agencies. Includes custom email and hosting setup.'
        },
        {
            id: 5,
            name: 'shop.store',
            price: 34.99,
            description: 'E-commerce ready domain with payment gateway integration support.'
        },
        {
            id: 6,
            name: 'blog.space',
            price: 15.99,
            description: 'Perfect for bloggers and content creators. Fast and reliable hosting.'
        }
    ];
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Listen for cart updates from domain search
    document.addEventListener('cartUpdated', function() {
        // Reload cart from localStorage to sync
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartUI();
    });
    
    // Cart UI Elements
    const cartToggle = document.getElementById('cart-toggle');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartClose = document.getElementById('cart-close');
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const productsGrid = document.getElementById('products-grid');
    
    // Initialize products
    function renderProducts() {
        if (!productsGrid) return;
        
        productsGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}/year</div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
            `;
            productsGrid.appendChild(productCard);
        });
        
        // Add event listeners to add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-product-id'));
                addToCart(productId);
            });
        });
    }
    
    // Add to cart
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
        
        saveCart();
        updateCartUI();
        
        // Show feedback
        const btn = document.querySelector(`[data-product-id="${productId}"]`);
        const originalText = btn.textContent;
        btn.textContent = 'Added!';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1000);
    }
    
    // Remove from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartUI();
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Update cart UI
    function updateCartUI() {
        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        
        // Update cart items
        if (cartItems) {
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <p class="empty-cart-text">Your cart is empty</p>
                    </div>
                `;
            } else {
                cartItems.innerHTML = '';
                cart.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
                        </div>
                        <button class="cart-item-remove" data-product-id="${item.id}" aria-label="Remove item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    `;
                    cartItems.appendChild(cartItem);
                });
                
                // Add remove event listeners
                document.querySelectorAll('.cart-item-remove').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const productId = parseInt(this.getAttribute('data-product-id'));
                        removeFromCart(productId);
                    });
                });
            }
        }
        
        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotal) {
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }
        
        // Update checkout button
        if (checkoutButton) {
            checkoutButton.disabled = cart.length === 0;
        }
    }
    
    // Open cart
    function openCart() {
        if (cartSidebar) cartSidebar.classList.add('open');
        if (cartOverlay) cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close cart
    function closeCart() {
        if (cartSidebar) cartSidebar.classList.remove('open');
        if (cartOverlay) cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    if (cartToggle) {
        cartToggle.addEventListener('click', openCart);
    }
    
    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }
    
    if (checkoutButton) {
        checkoutButton.addEventListener('click', async function() {
            if (cart.length === 0) return;
            
            // Disable button during processing
            this.disabled = true;
            this.textContent = 'Processing...';
            
            try {
                // Call your API endpoint to create Stripe Checkout session
                const response = await fetch('/api/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        items: cart
                    })
                });
                
                const data = await response.json();
                
                if (data.url) {
                    // Redirect to Stripe Checkout
                    window.location.href = data.url;
                } else if (data.error) {
                    alert('Error: ' + data.error);
                    this.disabled = false;
                    this.textContent = 'Checkout';
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
                this.disabled = false;
                this.textContent = 'Checkout';
            }
        });
    }
    
    // Initialize
    renderProducts();
    updateCartUI();
});

