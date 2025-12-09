// Dark mode toggle
(function() {
  const THEME_KEY = 'theme-preference';
  
  function applyTheme(theme, withAnimation = false) {
    if (withAnimation) {
      // Add animation class
      const toggleButton = document.getElementById('theme-toggle');
      if (toggleButton) {
        toggleButton.classList.add('theme-switching');
        // Remove class after animation completes
        setTimeout(() => {
          toggleButton.classList.remove('theme-switching');
        }, 300);
      }
    }
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }
  
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark', true);
  }
  
  function initTheme() {
    const storedTheme = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(storedTheme);
    
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleTheme);
      toggleButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      });
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();

// Copy code functionality
(function() {
  function initCodeCopy() {
    document.querySelectorAll('.codeblock-copy').forEach(button => {
      button.addEventListener('click', function() {
        const codeblock = this.closest('.codeblock');
        const code = codeblock.querySelector('pre code');
        if (code) {
          navigator.clipboard.writeText(code.textContent).then(() => {
            const originalHTML = this.innerHTML;
            this.innerHTML = '<span class="cl"><svg class="icon-copy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg></span>';
            setTimeout(() => {
              this.innerHTML = originalHTML;
            }, 2000);
          });
        }
      });
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeCopy);
  } else {
    initCodeCopy();
  }
})();

// Sticky Table of Contents
(function() {
  function initStickyToc() {
    const mainToc = document.getElementById('toc-main');
    if (!mainToc || mainToc.getAttribute('data-sticky') !== 'true') return;
    
    const stickyToc = document.getElementById('toc-sticky');
    if (!stickyToc) return;
    
    const position = mainToc.getAttribute('data-sticky-position') || 'right';
    const minWidth = parseInt(mainToc.getAttribute('data-sticky-min-width')) || 1280;
    
    // Add position class for border styling
    stickyToc.classList.add(`position-${position}`);
    
    let ticking = false;
    let scrollTimeout = null;
    
    function checkWideElementsInView() {
      // Check for wide elements (box-width-wide) in viewport
      const wideElements = document.querySelectorAll('.box-width-wide');
      const viewportHeight = window.innerHeight;
      
      for (const element of wideElements) {
        const rect = element.getBoundingClientRect();
        // Check if element is in viewport
        if (rect.top < viewportHeight && rect.bottom > 0) {
          return true;
        }
      }
      return false;
    }
    
    function updateStickyToc() {
      if (window.innerWidth < minWidth) {
        stickyToc.classList.remove('visible');
        return;
      }
      
      // Hide if wide element is in view
      if (checkWideElementsInView()) {
        stickyToc.classList.remove('visible');
        return;
      }
      
      // Show sticky when scrolled past main TOC
      const mainRect = mainToc.getBoundingClientRect();
      const shouldShow = mainRect.bottom < 0;
      
      if (shouldShow) {
        positionStickyToc();
        stickyToc.classList.add('visible');
        updateActiveLink();
        
        // Add scrolling class while scrolling
        stickyToc.classList.add('scrolling');
        
        // Remove scrolling class after scroll ends
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          stickyToc.classList.remove('scrolling');
        }, 1500 );
      } else {
        stickyToc.classList.remove('visible');
      }
    }
    
    function positionStickyToc() {
      const main = document.querySelector('main');
      if (!main) return;
      
      const mainRect = main.getBoundingClientRect();
      const tocWidth = 250;
      const gap = 20;
      
      if (position === 'right') {
        const left = mainRect.right + gap;
        const availableSpace = window.innerWidth - left;
        if (availableSpace >= tocWidth) {
          stickyToc.style.left = `${left}px`;
          stickyToc.style.right = 'auto';
        } else {
          stickyToc.classList.remove('visible');
        }
      } else {
        const availableSpace = mainRect.left - gap;
        if (availableSpace >= tocWidth) {
          const right = window.innerWidth - mainRect.left + gap;
          stickyToc.style.right = `${right}px`;
          stickyToc.style.left = 'auto';
        } else {
          stickyToc.classList.remove('visible');
        }
      }
    }
    
    function updateActiveLink() {
      const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
      let activeId = null;
      
      headings.forEach(heading => {
        if (heading.offsetTop <= window.scrollY + 100) {
          activeId = heading.id;
        }
      });
      
      stickyToc.querySelectorAll('a').forEach(link => {
        link.classList.remove('active');
        if (activeId && link.getAttribute('href') === `#${activeId}`) {
          link.classList.add('active');
          
          // Auto-scroll the active link into view within sticky TOC
          // Position it slightly above center to show context below
          const linkOffsetTop = link.offsetTop;
          const tocScrollTop = stickyToc.scrollTop;
          const tocHeight = stickyToc.clientHeight;
          const linkHeight = link.offsetHeight;
          
          // Calculate if link is outside visible area
          const linkTopInView = linkOffsetTop - tocScrollTop;
          const linkBottomInView = linkTopInView + linkHeight;
          
          if (linkTopInView < 0 || linkBottomInView > tocHeight) {
            // Position the link at 1/3 from top to show more context below
            const targetScroll = linkOffsetTop - (tocHeight / 3);
            stickyToc.scrollTo({ top: targetScroll, behavior: 'smooth' });
          }
        }
      });
    }
    
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateStickyToc();
          ticking = false;
        });
        ticking = true;
      }
    }
    
    function onResize() {
      updateStickyToc();
    }
    
    // Smooth scroll on link click
    stickyToc.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            window.scrollTo({
              top: target.offsetTop - 20,
              behavior: 'smooth'
            });
          }
        }
      });
    });
    
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    
    updateStickyToc();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyToc);
  } else {
    initStickyToc();
  }
})();

// Smooth expand/collapse animations for details elements
(function() {
  function initExpandAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    document.querySelectorAll('details.expand').forEach(details => {
      const summary = details.querySelector('.expand-title');
      const content = details.querySelector('.expand-content');
      
      if (!summary || !content) return;
      
      // If reduced motion is preferred, skip animation setup
      if (prefersReducedMotion) {
        return; // Let browser handle default behavior
      }
      
      // Store animation reference
      let animation = null;
      
      // Prevent default toggle to control it manually
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Stop any ongoing animation
        if (animation) {
          animation.cancel();
        }
        
        // Determine if we're opening or closing
        const isClosing = details.open;
        
        if (isClosing) {
          // Closing animation
          animation = content.animate(
            [
              {
                opacity: 1,
                maxHeight: content.scrollHeight + 'px',
                paddingTop: getComputedStyle(content).paddingTop,
                paddingBottom: getComputedStyle(content).paddingBottom
              },
              {
                opacity: 0,
                maxHeight: '0px',
                paddingTop: '0px',
                paddingBottom: '0px'
              }
            ],
            {
              duration: 400,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }
          );
          
          animation.onfinish = () => {
            details.open = false;
            animation = null;
          };
        } else {
          // Opening animation
          details.open = true;
          
          // Force a reflow to get accurate scrollHeight
          const startHeight = content.scrollHeight;
          
          animation = content.animate(
            [
              {
                opacity: 0,
                maxHeight: '0px',
                paddingTop: '0px',
                paddingBottom: '0px'
              },
              {
                opacity: 1,
                maxHeight: startHeight + 'px',
                paddingTop: getComputedStyle(content).paddingTop,
                paddingBottom: getComputedStyle(content).paddingBottom
              }
            ],
            {
              duration: 400,
              easing: 'cubic-bezier(0, 0, 0.2, 1)'
            }
          );
          
          animation.onfinish = () => {
            animation = null;
          };
        }
      });
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExpandAnimations);
  } else {
    initExpandAnimations();
  }
})();
