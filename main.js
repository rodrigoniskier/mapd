// PIMP-JP Academic Platform - Enhanced JavaScript for Professional UI/UX

document.addEventListener("DOMContentLoaded", function() {
    // Initialize all interactive components
    initializeNavigation();
    initializeAccessibility();
    initializeAnimations();
    initializePromptLibrary();
    
    console.log('PIMP-JP Platform initialized successfully');
});

// Navigation and Dropdown Management
function initializeNavigation() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Enhanced dropdown functionality with keyboard support
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        
        // Mouse events
        dropdown.addEventListener('mouseenter', () => {
            dropdownContent.style.display = 'block';
            dropbtn.setAttribute('aria-expanded', 'true');
        });
        
        dropdown.addEventListener('mouseleave', () => {
            dropdownContent.style.display = 'none';
            dropbtn.setAttribute('aria-expanded', 'false');
        });
        
        // Keyboard events for accessibility
        dropbtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isOpen = dropdownContent.style.display === 'block';
                dropdownContent.style.display = isOpen ? 'none' : 'block';
                dropbtn.setAttribute('aria-expanded', !isOpen);
            }
        });
        
        // Focus management for dropdown items
        const dropdownItems = dropdown.querySelectorAll('[role="menuitem"]');
        dropdownItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextItem = dropdownItems[index + 1] || dropdownItems[0];
                    nextItem.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevItem = dropdownItems[index - 1] || dropdownItems[dropdownItems.length - 1];
                    prevItem.focus();
                } else if (e.key === 'Escape') {
                    dropdownContent.style.display = 'none';
                    dropbtn.setAttribute('aria-expanded', 'false');
                    dropbtn.focus();
                }
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                const dropdownContent = dropdown.querySelector('.dropdown-content');
                const dropbtn = dropdown.querySelector('.dropbtn');
                dropdownContent.style.display = 'none';
                dropbtn.setAttribute('aria-expanded', 'false');
            });
        }
    });
}

// Accessibility Enhancements
function initializeAccessibility() {
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-blue);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark if not present
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main';
    }
    
    // Enhance focus indicators for better visibility
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid var(--secondary-blue)';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
        });
    });
}

// Animation and Visual Enhancements
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-item, .category-section, .module-btn');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
    
    // Add loading states for buttons
    const buttons = document.querySelectorAll('.btn, .copy-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });
}

// Prompt Library Functionality
function initializePromptLibrary() {
    // Enhanced search functionality
    const searchInput = document.getElementById('promptSearch');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filterPrompts();
                updateSearchResults();
            }, 300); // Debounce search
        });
        
        // Add search shortcuts
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                filterPrompts();
                updateSearchResults();
            }
        });
    }
    
    // Category filtering
    const categoryButtons = document.querySelectorAll('[data-category]');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            filterByCategory(category);
        });
    });
}

// Enhanced prompt filtering with search highlighting
function filterPrompts() {
    const input = document.getElementById('promptSearch');
    if (!input) return;
    
    const filter = input.value.toLowerCase().trim();
    const promptItems = document.querySelectorAll('.prompt-item');
    const categories = document.querySelectorAll('.category-section');
    let visibleCount = 0;
    
    promptItems.forEach(item => {
        const text = item.querySelector('.prompt-text').textContent.toLowerCase();
        const isVisible = !filter || text.includes(filter);
        
        item.style.display = isVisible ? '' : 'none';
        
        if (isVisible) {
            visibleCount++;
            // Highlight search terms
            if (filter) {
                highlightSearchTerms(item.querySelector('.prompt-text'), filter);
            } else {
                removeHighlights(item.querySelector('.prompt-text'));
            }
        }
    });
    
    // Show/hide categories based on visible prompts
    categories.forEach(category => {
        const visiblePrompts = category.querySelectorAll('.prompt-item:not([style*="display: none"])');
        category.style.display = visiblePrompts.length > 0 ? '' : 'none';
    });
    
    // Update search results count
    updateSearchResultsCount(visibleCount);
}

// Highlight search terms in text
function highlightSearchTerms(element, searchTerm) {
    const originalText = element.dataset.originalText || element.textContent;
    if (!element.dataset.originalText) {
        element.dataset.originalText = originalText;
    }
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const highlightedText = originalText.replace(regex, '<mark>$1</mark>');
    element.innerHTML = highlightedText;
}

// Remove search highlights
function removeHighlights(element) {
    if (element.dataset.originalText) {
        element.textContent = element.dataset.originalText;
    }
}

// Update search results information
function updateSearchResults() {
    const input = document.getElementById('promptSearch');
    if (!input) return;
    
    const filter = input.value.toLowerCase().trim();
    const visiblePrompts = document.querySelectorAll('.prompt-item:not([style*="display: none"])');
    
    // Create or update results info
    let resultsInfo = document.getElementById('search-results-info');
    if (!resultsInfo) {
        resultsInfo = document.createElement('div');
        resultsInfo.id = 'search-results-info';
        resultsInfo.style.cssText = `
            text-align: center;
            margin-top: 1rem;
            color: var(--gray-600);
            font-size: var(--text-sm);
        `;
        input.parentNode.appendChild(resultsInfo);
    }
    
    if (filter) {
        resultsInfo.textContent = `${visiblePrompts.length} prompt(s) encontrado(s) para "${filter}"`;
    } else {
        resultsInfo.textContent = '';
    }
}

// Update search results count
function updateSearchResultsCount(count) {
    const input = document.getElementById('promptSearch');
    if (!input) return;
    
    const filter = input.value.toLowerCase().trim();
    let resultsInfo = document.getElementById('search-results-info');
    
    if (!resultsInfo) {
        resultsInfo = document.createElement('div');
        resultsInfo.id = 'search-results-info';
        resultsInfo.style.cssText = `
            text-align: center;
            margin-top: 1rem;
            color: var(--gray-600);
            font-size: var(--text-sm);
        `;
        input.parentNode.appendChild(resultsInfo);
    }
    
    if (filter) {
        resultsInfo.textContent = `${count} prompt(s) encontrado(s)`;
        resultsInfo.style.display = 'block';
    } else {
        resultsInfo.style.display = 'none';
    }
}

// Enhanced copy prompt functionality with better feedback
function copyPrompt(button) {
    const promptText = button.previousElementSibling.textContent;
    const originalText = button.textContent;
    
    // Disable button during copy operation
    button.disabled = true;
    button.style.opacity = '0.7';
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(promptText).then(() => {
            showCopySuccess(button, originalText);
        }).catch(err => {
            console.error('Erro ao copiar: ', err);
            fallbackCopyTextToClipboard(promptText, button, originalText);
        });
    } else {
        fallbackCopyTextToClipboard(promptText, button, originalText);
    }
}

// Fallback copy method for older browsers
function fallbackCopyTextToClipboard(text, button, originalText) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess(button, originalText);
        } else {
            showCopyError(button, originalText);
        }
    } catch (err) {
        console.error('Fallback: Erro ao copiar', err);
        showCopyError(button, originalText);
    }
    
    document.body.removeChild(textArea);
}

// Show copy success feedback
function showCopySuccess(button, originalText) {
    button.textContent = '✓ Copiado!';
    button.style.backgroundColor = 'var(--accent-green)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
        button.disabled = false;
        button.style.opacity = '';
    }, 2000);
    
    // Show toast notification
    showToast('Prompt copiado para a área de transferência!', 'success');
}

// Show copy error feedback
function showCopyError(button, originalText) {
    button.textContent = '✗ Erro';
    button.style.backgroundColor = 'var(--error-red)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
        button.disabled = false;
        button.style.opacity = '';
    }, 2000);
    
    // Show toast notification
    showToast('Erro ao copiar. Tente novamente.', 'error');
}

// Toast notification system
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.getElementById('toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.textContent = message;
    
    const bgColor = type === 'success' ? 'var(--accent-green)' : 
                   type === 'error' ? 'var(--error-red)' : 
                   'var(--primary-blue)';
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${bgColor};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Filter by category
function filterByCategory(category) {
    const categories = document.querySelectorAll('.category-section');
    
    categories.forEach(section => {
        if (category === 'all' || section.dataset.category === category) {
            section.style.display = '';
        } else {
            section.style.display = 'none';
        }
    });
}

// Performance optimization: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add loading states and error handling for better UX
window.addEventListener('load', function() {
    // Hide any loading indicators
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
        element.style.display = 'none';
    });
    
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
});

// Error handling for failed resource loads
window.addEventListener('error', function(e) {
    console.error('Resource failed to load:', e.target);
    
    // Handle failed image loads
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
    }
}, true);

// Keyboard shortcuts for power users
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('promptSearch');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('promptSearch');
        if (searchInput && document.activeElement === searchInput) {
            searchInput.value = '';
            filterPrompts();
            updateSearchResults();
        }
    }
});

// Add smooth page transitions
function addPageTransitions() {
    const links = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hostname === window.location.hostname) {
                e.preventDefault();
                
                // Add fade out effect
                document.body.style.opacity = '0.7';
                document.body.style.transition = 'opacity 0.3s ease-out';
                
                setTimeout(() => {
                    window.location.href = this.href;
                }, 300);
            }
        });
    });
}

// Initialize page transitions
addPageTransitions();

