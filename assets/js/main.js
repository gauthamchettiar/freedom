// Dark mode toggle
(function() {
  const THEME_KEY = 'theme-preference';
  
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }
  
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
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
