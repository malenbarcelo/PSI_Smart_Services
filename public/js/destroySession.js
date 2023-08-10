window.addEventListener('beforeunload', () => {
    fetch('/logout', { method: 'POST' });
  });