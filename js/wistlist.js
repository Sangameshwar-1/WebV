document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  updateAuthStatus();
  displayWishlist();
});

function displayWishlist() {
  const wishlistContainer = document.querySelector('.wishlist-container');
  if (!wishlistContainer) {
      console.error('Wishlist container not found. Check wishlist.html for .wishlist-container element.');
      return;
  }
  console.log('Displaying wishlist...'); // Debug: Confirm function runs

  if (!isLoggedIn()) {
      wishlistContainer.innerHTML = '<p>Please log in to view your wishlist.</p>';
      console.log('User not logged in.');
      return;
  }

  let wishlist;
  try {
      wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      console.log('Wishlist contents:', wishlist); // Debug: Inspect wishlist data
  } catch (e) {
      console.error('Failed to parse wishlist:', e);
      wishlistContainer.innerHTML = '<p>Error loading wishlist. Please try again.</p>';
      return;
  }
  wishlistContainer.innerHTML = '';

  if (wishlist.length === 0) {
      wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
      console.log('Wishlist is empty.');
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
      console.log('Added wishlist item:', item.title); // Debug: Confirm item rendering
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
  console.log('Removed item from wishlist, ID:', bookId); // Debug
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
  document.querySelectorAll('#cart-count').forEach(span => span.textContent = count);
  console.log('Updated cart count:', count); // Debug
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