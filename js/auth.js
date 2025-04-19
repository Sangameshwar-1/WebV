document.addEventListener('DOMContentLoaded', () => {
    updateAuthStatus();
  });
  
  function login(event) {
    event.preventDefault();
    const email = document.querySelector('#login-form input[type="email"]').value;
    const password = document.querySelector('#login-form input[type="password"]').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    const error = document.getElementById('login-error');
  
    if (user) {
      localStorage.setItem('token', btoa(email));
      error.textContent = '';
      window.location.href = 'index.html';
    } else {
      error.textContent = 'Invalid email or password.';
    }
  }
  
  function signup(event) {
    event.preventDefault();
    const username = document.querySelector('#signup-form input[type="text"]').value;
    const email = document.querySelector('#signup-form input[type="email"]').value;
    const password = document.querySelector('#signup-form input[type="password"]').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const error = document.getElementById('signup-error');
  
    if (users.find(u => u.email === email)) {
      error.textContent = 'Email already registered.';
      return;
    }
  
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('token', btoa(email));
    error.textContent = '';
    window.location.href = 'index.html';
  }
  
  function isLoggedIn() {
    return !!localStorage.getItem('token');
  }
  
  function updateAuthStatus() {
    const loginLink = document.getElementById('login-signup');
    const logoutLink = document.getElementById('logout');
    if (loginLink && logoutLink) {
      if (isLoggedIn()) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
      } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
      }
    }
  }
  
  function logout() {
    localStorage.removeItem('token');
    updateAuthStatus();
    window.location.href = 'index.html';
  }