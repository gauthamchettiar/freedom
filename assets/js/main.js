// Copy code button functionality
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', () => {
      const codeblock = button.closest('.codeblock');
      const code = codeblock.querySelector('code').textContent;
      
      navigator.clipboard.writeText(code).then(() => {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<span class="copied-text">copied!</span>';
        setTimeout(() => button.innerHTML = originalHTML, 2000);
      });
    });
  });
});

