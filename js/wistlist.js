document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  updateAuthStatus();
  displayWishlist();
  setupWishlistEventListeners();
});

// Expose displayWishlist globally for script.js
//window.displayWishlist = displayWishlist;

function displayWishlist() {
  const wishlistContainer = document.querySelector('.wishlist-container');
  if (!wishlistContainer) {
    console.error('Wishlist container not found. Ensure wishlist.html contains an element with the class .wishlist-container.');
      return;
  }

  if (!isLoggedIn()) {
      wishlistContainer.innerHTML = '<p>Please log in to view your wishlist.</p>';
      return;
  }

  let wishlist;
  try {
      wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  } catch (e) {
      console.error('Failed to parse wishlist:', e);
      wishlistContainer.innerHTML = '<p>Error loading wishlist. Please try again.</p>';
      return;
  }
  
  wishlistContainer.innerHTML = '<p>Here are the books in your wishlist:</p>';

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
      wishlistItem.dataset.bookId = item.id;
      wishlistItem.innerHTML = `
        <img src="${item.image || './assets/placeholder.jpg'}" alt="${item.title}">
          <div class="wishlist-item-details">
              <h3>${item.title}</h3>
              <p>Author: ${item.author || 'Unknown'}</p>
              <p class="price">$${item.price.toFixed(2)}</p>
          </div>
          <div class="wishlist-item-actions">
              <button class="add-to-cart-btn">Add to Cart</button>
              <button class="remove-wishlist-btn">Remove</button>
          </div>
      `;
      wishlistContainer.appendChild(wishlistItem);
  });
}

function setupWishlistEventListeners() {
  const wishlistContainer = document.querySelector('.wishlist-container');
  if (!wishlistContainer) return;

  wishlistContainer.addEventListener('click', (event) => {
      const target = event.target;
      const wishlistItem = target.closest('.wishlist-item');
      if (!wishlistItem) return;
      const bookId = wishlistItem.dataset.bookId;

      if (target.classList.contains('add-to-cart-btn')) {
          window.addToCart(bookId);
      } else if (target.classList.contains('remove-wishlist-btn')) {
          removeFromWishlist(bookId);
      }
  });
}

function removeFromWishlist(bookId) {
  let wishlist;
  try {
      wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      wishlist = wishlist.filter(item => item.id !== bookId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
  } catch (e) {
      console.error('Failed to update wishlist:', e);
      alert('Error removing item from wishlist. Please try again.');
      return;
  }
  displayWishlist();
}

function updateCartCount() {
  let cart;
  try {
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
  } catch (e) {
      console.error('Failed to parse cart:', e);
      return;
  }
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
document.querySelectorAll('#cart-count').forEach(span => {
    if (span) span.textContent = count;
});
  console.log('Updated cart count:', count); // Debug
}

function isLoggedIn() {
  return !!localStorage.getItem('token');
}
const loginLink = document.querySelector('#login-signup');
const logoutLink = document.querySelector('#logout');
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