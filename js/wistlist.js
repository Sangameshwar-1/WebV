document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateAuthStatus();
    displayWishlist();
  });
  
  function displayWishlist() {
    const wishlistContainer = document.querySelector('.wishlist-container');
    if (!wishlistContainer) {
      console.error('Wishlist container not found.');
      return;
    }
  
    if (!isLoggedIn()) {
      wishlistContainer.innerHTML = '<p>Please log in to view your wishlist.</p>';
      return;
    }
  
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlistContainer.innerHTML = '';
  
    if (wishlist.length === 0) {
      wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
      return;
    }
  
    wishlist.forEach(item => {
      if (!item.id || !item.title || !item.price) {
        console.warn('Invalid wishlist item:', item);
        return;
      }
      const wishlistItem = document.createElement('div');
      wishlistItem.classList.add('wishlist-item');
      wishlistItem.innerHTML = `
        <img src="${item.image || 'assets/placeholder.jpg'}" alt="${item.title}">
        <div class="wishlist-item-details">
          <h3>${item.title}</h3>
          <p>Author: ${item.author || 'Unknown'}</p>
          <p class="price">$${item.price.toFixed(2)}</p>
        </div>
        <div class="wishlist-item-actions">
          <button onclick="addToCart('${item.id}')">Add to Cart</button>
          <button onclick="removeFromWishlist('${item.id}')">Remove</button>
        </div>
      `;
      wishlistContainer.appendChild(wishlistItem);
    });
  }
  
  function addToWishlist(bookId) {
    if (!isLoggedIn()) {
      alert('Please log in to add items to your wishlist.');
      window.location.href = 'login.html';
      return;
    }
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const book = books.find(b => b.id === bookId);
    if (!book) {
      console.error('Book not found:', bookId);
      alert('Book not found.');
      return;
    }
    if (!wishlist.find(item => item.id === bookId)) {
      wishlist.push(book);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      alert('Book added to wishlist!');
    } else {
      alert('Book is already in your wishlist.');
    }
    if (window.location.pathname.includes('wishlist.html')) {
      displayWishlist();
    }
  }
  
  function removeFromWishlist(bookId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter(item => item.id !== bookId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    displayWishlist();
  }
  
  function addToCart(bookId) {
    if (!isLoggedIn()) {
      alert('Please log in to add items to your cart.');
      window.location.href = 'login.html';
      return;
    }
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const book = books.find(b => b.id === bookId);
    if (!book) {
      console.error('Book not found:', bookId);
      alert('Book not found.');
      return;
    }
    const cartItem = cart.find(item => item.id === bookId);
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      cart.push({ ...book, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Book added to cart!');
  }
  
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(span => span.textContent = count);
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