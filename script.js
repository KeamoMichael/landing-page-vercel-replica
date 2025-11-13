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
            'the next viral idea.',
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
            // Blur in initial text with a small delay to ensure DOM is ready
            setTimeout(() => {
                blurInChars(chars);
            }, 50);
        }
        
        function rotateText() {
            if (isAnimating) return;
            
            isAnimating = true;
            
            const currentChars = Array.from(rotatingText.querySelectorAll('.char'));
            
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
                newChars.forEach(char => {
                    rotatingText.appendChild(char);
                });
                if (newTextWrapper.parentNode) {
                    newTextWrapper.parentNode.removeChild(newTextWrapper);
                }
                
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
});

