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
    const domainInput = document.querySelector('.domain-input');
    const searchButton = document.querySelector('.search-button');
    
    if (domainInput && searchButton) {
        searchButton.addEventListener('click', function() {
            const domain = domainInput.value.trim();
            if (domain) {
                // Simulate domain search
                console.log('Searching for domain:', domain);
                // In a real implementation, this would make an API call
            }
        });
        
        domainInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
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
            'your startup.'
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
        checkoutButton.addEventListener('click', function() {
            if (cart.length > 0) {
                alert(`Thank you! Your order total is $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}. This is a demo - no actual payment will be processed.`);
                cart = [];
                saveCart();
                updateCartUI();
                closeCart();
            }
        });
    }
    
    // Initialize
    renderProducts();
    updateCartUI();
});

