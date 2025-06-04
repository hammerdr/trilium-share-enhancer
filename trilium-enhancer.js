// Trilium Enhancer Plugin
// Enhances Trilium public share pages with better navigation, dark mode, and improved UI

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    initDarkMode();
    
    // Clean all links on the page
    cleanAllLinks();
    
    // Enhance navigation
    enhanceNavigation();
    
    // Add smooth scrolling
    addSmoothScrolling();
    
    // Style improvements
    enhanceStyling();
});

// Clean all links on the page
function cleanAllLinks() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.textContent = cleanLinkText(link.textContent.trim());
    });
}

// Dark mode functionality
function initDarkMode() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('trilium-theme') || 'light';
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    
    // Add theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12s7 10 10 10 10-7 10-10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-13a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
        </svg>
    `;
    
    // Add theme toggle to the top-right corner
    const container = document.querySelector('.note-container') || document.body;
    themeToggle.style.position = 'fixed';
    themeToggle.style.top = '10px';
    themeToggle.style.right = '10px';
    themeToggle.style.zIndex = '1000';
    container.appendChild(themeToggle);
    
    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const newTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('trilium-theme', newTheme);
        
        // Update the SVG icon based on theme
        const sunIcon = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12s7 10 10 10 10-7 10-10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-13a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/></svg>';
        
        const moonIcon = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 13H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1zm0 10H4v-8h16v8zM20 3H4c-.55 0-1 .45-1 1v2h18V4c0-.55-.45-1-1-1z"/></svg>';
        
        themeToggle.innerHTML = document.body.classList.contains('dark-mode') ? sunIcon : moonIcon;
    });
}

// Helper function to remove hex codes and .csv extensions from text
function cleanLinkText(text) {
    // Match hex codes that are at least 10 characters long at the end of the text
    // Also match optional .csv extension
    return text
        .replace(/\s+[0-9a-fA-F]{10,}(\.csv)?$/, '')
        .replace(/\s+\([0-9a-fA-F]{10,}(\.csv)?\)$/, '');
}

// Navigation enhancements
function enhanceNavigation() {
    // Clean all navigation links first
    const nav = document.querySelector('nav#menu');
    if (nav) {
        // Clean all links in the navigation
        const links = nav.querySelectorAll('a');
        links.forEach(link => {
            link.textContent = cleanLinkText(link.textContent.trim());
        });
    } else {
        return;
    }

    const navItems = nav.querySelectorAll('li');
    navItems.forEach(item => {
        const children = item.querySelectorAll('li');
        if (children.length > 0) {
            // Add collapsed class to ul containing children
            const childrenContainer = item.querySelector('ul');
            if (childrenContainer) {
                childrenContainer.classList.add('collapsed');
            }

            const toggle = document.createElement('button');
            toggle.className = 'nav-toggle';
            // Start with the collapsed icon
            const isDarkMode = document.body.classList.contains('dark-mode');
            const fill = isDarkMode ? '#ffffff' : 'currentColor';
            toggle.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="${fill}" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
            </svg>`;
            
            // First check for existing paragraph
            const existingP = item.querySelector('p');
            
            // Create a wrapper div for toggle and text
            const wrapper = document.createElement('div');
            wrapper.className = 'nav-item-wrapper';
            
            // Position the wrapper before the ul
            const ul = item.querySelector('ul');
            if (ul) {
                // Insert the wrapper before the ul
                item.insertBefore(wrapper, ul);
            } else {
                // If no ul, append to item
                item.appendChild(wrapper);
            }
            
            // Then add the text content
            if (!existingP) {
                // Clone the item's children to preserve links
                const children = Array.from(item.childNodes).map(node => node.cloneNode(true));
                if (children.length > 0) {
                    const p = document.createElement('p');
                    // Clean text content of each node
                    children.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            node.textContent = cleanLinkText(node.textContent.trim());
                        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'a') {
                            // Clean text content of links
                            node.textContent = cleanLinkText(node.textContent.trim());
                        }
                    });
                    p.append(...children);
                    wrapper.appendChild(p);
                }
            } else {
                // Clean existing text while preserving links
                const children = Array.from(existingP.childNodes);
                children.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.textContent = cleanLinkText(node.textContent.trim());
                    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'a') {
                        node.textContent = cleanLinkText(node.textContent.trim());
                    }
                });
                wrapper.appendChild(existingP);
            }
            
            // Then add the toggle after the text
            wrapper.appendChild(toggle);
            
            toggle.addEventListener('click', () => {
                // Find the ul containing the children
                const childrenContainer = item.querySelector('ul');
                if (childrenContainer) {
                    // Remove display: none and use our CSS transitions
                    childrenContainer.style.display = '';
                    childrenContainer.classList.toggle('collapsed');
                    toggle.innerHTML = childrenContainer.classList.contains('collapsed')
                        ? `<svg viewBox="0 0 24 24" width="16" height="16">
                            <path fill="${fill}" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                          </svg>`
                        : `<svg viewBox="0 0 24 24" width="16" height="16">
                            <path fill="${fill}" d="M16.59 15.41L12 10.83 7.41 15.41 6 14l6-6 6 6z"/>
                          </svg>`;
                }
            });
        }
    });
}

// Add smooth scrolling
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Styling enhancements
// Content cache to store fetched content
const contentCache = new Map();

function fetchPageContent(url) {
    if (contentCache.has(url)) {
        return contentCache.get(url);
    }

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch page content');
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Try to find the main content in various ways
            const mainContent = doc.getElementById('main') || 
                              doc.querySelector('article') || 
                              doc.querySelector('.content') || 
                              doc.querySelector('.main-content') || 
                              doc.querySelector('.main') || 
                              doc.querySelector('.post-content') || 
                              doc.querySelector('.article-content') || 
                              doc.querySelector('.entry-content') || 
                              doc.querySelector('.blog-post') || 
                              doc.querySelector('.article') || 
                              doc.querySelector('.note-content') || 
                              doc.querySelector('.note');

            if (mainContent) {
                // Clone the main content
                const content = mainContent.cloneNode(true);
                
                // Remove script and style tags
                const scripts = content.querySelectorAll('script, style');
                scripts.forEach(script => script.remove());

                // Store HTML content in cache
                const contentHtml = content.outerHTML;
                
                // Find first image
                const img = mainContent.querySelector('img');
                const image = img && img.src ? img.src : null;

                // Get preview text
                const previewText = content.textContent.trim().substring(0, 200) + '...';

                // Store both HTML and preview content
                contentCache.set(url, {
                    html: contentHtml,
                    preview: previewText,
                    image: image
                });
                
                console.log('Found content:', previewText);
                return {
                    text: previewText,
                    image: image
                };
            }

            // If no main content found, use body content
            const bodyContent = doc.body.cloneNode(true);
            const scripts = bodyContent.querySelectorAll('script, style');
            scripts.forEach(script => script.remove());

            // Store HTML content in cache
            const contentHtml = bodyContent.innerHTML;
            
            // Find first image in body
            const bodyImg = doc.body.querySelector('img');
            const image = bodyImg && bodyImg.src ? bodyImg.src : null;

            // Store both HTML and preview content
            contentCache.set(url, {
                html: contentHtml,
                preview: bodyContent.textContent.trim().substring(0, 200) + '...',
                image: image
            });

            console.log('Fallback content:', bodyContent.textContent.trim().substring(0, 200));
            return {
                text: bodyContent.textContent.trim().substring(0, 200),
                image: image
            };
        })
        .catch(error => {
            console.error('Error fetching page content:', error);
            return '';
        });
}

function createCardElement(url, title, content) {
    const card = document.createElement('a');
    card.className = 'content-card';
    card.href = url;
    card.innerHTML = `
        <div class="card-header">
            <h3>${title}</h3>
        </div>
        <div class="card-content">
            ${content.image ? `<img src="${content.image}" class="card-image" alt="Preview image">` : ''}
            <p>${content.text}</p>
        </div>
    `;
    return card;
}

function enhanceStyling() {
    const style = document.createElement('style');
    style.textContent = `
        /* Dark mode styles */
        .dark-mode {
            background-color: #1a1a1a;
            color: #e0e0e0;
        }
        
        .dark-mode .node {
            background-color: #2d2d2d;
            border-color: #404040;
        }
        
        .dark-mode .node:hover {
            background-color: #3d3d3d;
        }
        
        .dark-mode .node-content {
            color: #e0e0e0;
        }
        
        /* Navigation toggle styles */
        .nav-toggle {
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px;
            margin-right: 5px;
            position: relative;
            top: -2px;
            display: inline-block;
        }
        
        .nav-toggle:hover {
            opacity: 0.8;
        }
        
        /* Style for navigation items */
        /* Navigation item wrapper */
        .nav-item-wrapper {
            display: flex;
            align-items: center;
            gap: 5px;
            margin: 0;
        }
        
        nav#menu li {
            margin: 0;
            padding: 5px 0;
        }
        
        nav#menu li p {
            margin: 0;
            flex-grow: 1;
        }
        
        /* Nested list styling */
        nav#menu ul {
            list-style: none;
            padding-left: 0;
            margin: 0;
        }
        
        nav#menu ul ul {
            padding-left: 15px;
            margin: 0;
            height: auto;
            transition: opacity 0.3s ease-in-out, height 0.3s ease-in-out;
        }
        
        /* Remove default bullet points */
        nav#menu ul {
            list-style: none;
            padding-left: 0;
            height: auto;
            transition: opacity 0.3s ease-in-out, height 0.3s ease-in-out;
        }
        
        nav#menu li {
            list-style: none;
            padding-left: 0;
            height: auto;
            transition: opacity 0.3s ease-in-out, height 0.3s ease-in-out;
        }
        
        /* Add some padding for nested lists */
        nav#menu ul ul {
            padding-left: 15px;
            height: auto;
            transition: opacity 0.3s ease-in-out, height 0.3s ease-in-out;
        }
        
        /* Collapsible children styles */
        .collapsed {
            opacity: 0;
            height: 0 !important;
            padding: 0;
            margin: 0;
            overflow: hidden;
        }
        
        .collapsed + ul {
            opacity: 0;
            height: 0;
        }
        
        .collapsed + ul li {
            opacity: 0;
            height: 0;
        }
        
        /* Ensure nested lists collapse properly */
        .collapsed .collapsed {
            opacity: 0;
            height: 0;
        }
        
        /* Theme toggle styles */
        .theme-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            padding: 10px;
            cursor: pointer;
            z-index: 1000;
        }
        
        .theme-toggle:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        /* General improvements */
        .node-content {
            padding: 15px;
            border-radius: 4px;
            margin: 5px 0;
            transition: background-color 0.2s;
        }
        
        .node-content:hover {
            background-color: #f5f5f5;
        }
        
        .node-content h1, .node-content h2, .node-content h3 {
            margin-top: 20px;
            margin-bottom: 15px;
        }
        
        .node-content p {
            line-height: 1.6;
            margin-bottom: 15px;
        }
        
        /* Code block styling */
        .node-content pre {
            background-color: #f8f8f8;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
        }
        
        .dark-mode .node-content pre {
            background-color: #2d2d2d;
            color: #e0e0e0;
        }
        /* Link styles */
        a {
            color: #0056b3;
            text-decoration: none;
            transition: color 0.2s ease;
        }

        a:hover {
            color: #003d82;
            text-decoration: underline;
        }

        a:active {
            color: #002f52;
        }

        .dark-mode a {
            color: #64b5f6;
        }

        .dark-mode a:hover {
            color: #42a5f5;
        }

        .dark-mode a:active {
            color: #2196f3;
        }

        /* Navigation link styles */
        nav#menu a {
            color: inherit;
            text-decoration: none;
        }

        nav#menu a:hover {
            color: #0056b3;
        }

        .dark-mode nav#menu a:hover {
            color: #64b5f6;
        }

        /* Active navigation link */
        nav#menu a.active {
            font-weight: bold;
            color: #0056b3;
        }

        .dark-mode nav#menu a.active {
            color: #64b5f6;
        }

        /* Navigation toggle button */
        .nav-toggle {
            background: none;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-left: 8px;
            transition: all 0.2s ease;
        }

        .dark-mode .nav-toggle {
            border-color: #444;
        }

        .nav-toggle:hover {
            background-color: #f0f0f0;
            transform: scale(1.1);
        }

        .dark-mode .nav-toggle:hover {
            background-color: #333;
        }

        .nav-item-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .nav-item-wrapper p {
            margin: 0;
            flex: 1;
        }

        /* Navigation animation */
        ul {
            opacity: 1;
            height: auto;
            transition: opacity 0.3s ease-in-out, height 0.3s ease-in-out;
        }

        ul.collapsed {
            opacity: 0;
            height: 0;
            padding: 0;
            margin: 0;
            overflow: hidden;
        }

        .dark-mode #main a:hover {
            background: #3d3d3d;
            color: #42a5f5;
            transform: translateY(-2px);
        }

        .content-card {
            background: #fff;
            border-radius: 12px;
            margin: 24px 0;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-decoration: none;
            color: inherit;
            display: block;
            border: 1px solid rgba(0,0,0,0.1);
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .dark-mode .content-card {
            background: #2d2d2d;
            border-color: rgba(255,255,255,0.1);
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .content-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
            border-color: rgba(0,0,0,0.2);
            text-decoration: none;
        }

        .content-card:active {
            transform: translateY(0);
            opacity: 0.95;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            border-color: rgba(0,0,0,0.1);
        }

        .content-card .card-header {
            padding: 16px 24px;
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .dark-mode .content-card .card-header {
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .content-card .card-header h3 {
            margin: 0;
            font-size: 1.1rem;
            font-weight: 600;
            color: #212121;
        }

        .dark-mode .content-card .card-header h3 {
            color: #fff;
        }

        .content-card .card-content {
            padding: 24px;
            color: #fff;
        }

        .content-card .card-content .card-image {
            max-width: 100%;
            height: auto;
            margin-bottom: 16px;
            border-radius: 8px;
            object-fit: cover;
        }

        .content-card .card-content p {
            margin: 0;
            line-height: 1.6;
        }

        .page-content {
            max-width: 800px;
            margin: 0 auto;
            padding: 24px;
        }

        .page-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 16px 0;
        }

        .page-content p {
            margin: 16px 0;
            line-height: 1.6;
        }

        .page-content h1, .page-content h2, .page-content h3 {
            margin: 24px 0 16px;
            font-weight: 600;
        }

        .content-card .card-content p {
            margin: 0;
            line-height: 1.6;
        }

        * {
            box-sizing: border-box;
        }
    `;
    document.head.appendChild(style);

    // Enhance links outside of #childLinks
    const links = document.querySelectorAll('#main a');
    links.forEach(async (link) => {
        if (!link.closest('#childLinks')) {
            const url = link.href;
            const title = link.textContent.trim();
            
            // Fetch the page content
            const content = await fetchPageContent(url);
            
            // Create the card
            const card = createCardElement(url, title, content);
            
            // Add click handler to replace content
            card.addEventListener('click', async (e) => {
                e.preventDefault();
                const main = document.getElementById('main');
                if (main && contentCache.has(url)) {
                    const cachedContent = contentCache.get(url);
                    main.innerHTML = `
                        <div class="page-content">
                            ${cachedContent.html}
                        </div>
                    `;
                }
            });
            
            // Insert the card before the link
            link.parentElement.replaceChildren(card);
            
            // Mark the link as enhanced
            link.classList.add('enhanced-link');
        }
    });
}
