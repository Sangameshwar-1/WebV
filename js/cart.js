document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  updateAuthStatus();
  displayCart();
});

function displayCart() {
  const cartContainer = document.querySelector('.cart-container');
  if (!cartContainer) {
      console.error('Cart container not found.');
      return;
  }
  let cart;
  try {
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
  } catch (e) {
      console.error('Failed to parse cart:', e);
      cartContainer.innerHTML = '<p>Error loading cart. Please try again.</p>';
      return;
  }
  cartContainer.innerHTML = '';

  if (cart.length === 0) {
      cartContainer.innerHTML = '<p>Your cart is empty.</p>';
      return;
  }

  let total = 0;
  cart.forEach(item => {
      if (!item.id || !item.title || !item.price) {
          console.warn('Invalid cart item:', item);
          return;
      }
      total += item.price * item.quantity;
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
          <img src="${item.image || 'assets/placeholder.jpg'}" alt="${item.title}">
          <div class="cart-item-details">
              <h3>${item.title}</h3>
              <p>Author: ${item.author || 'Unknown'}</p>
              <p class="price">$${item.price.toFixed(2)}</p>
              <p>Quantity: ${item.quantity}</p>
          </div>
          <div class="cart-item-actions">
              <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
              <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
              <button onclick="removeFromCart('${item.id}')">Remove</button>
          </div>
      `;
      cartContainer.appendChild(cartItem);
  });

  const totalElement = document.getElementById('cart-total');
  if (totalElement) {
      totalElement.textContent = `Total: $${total.toFixed(2)}`;
  } else {
      console.error('Cart total element not found.');
  }
}

function updateQuantity(bookId, quantity) {
  let cart;
  try {
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
  } catch (e) {
      console.error('Failed to parse cart:', e);
      return;
  }
  const cartItem = cart.find(item => item.id === bookId);
  if (!cartItem) return;
  if (quantity <= 0) {
      cart = cart.filter(item => item.id !== bookId);
  } else {
      cartItem.quantity = quantity;
  }
  try {
      localStorage.setItem('cart', JSON.stringify(cart));
  } catch (e) {
      console.error('Failed to save cart:', e);
      alert('Error updating cart. Please try again.');
      return;
  }
  displayCart();
  updateCartCount();
}

function removeFromCart(bookId) {
  let cart;
  try {
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart = cart.filter(item => item.id !== bookId);
      localStorage.setItem('cart', JSON.stringify(cart));
  } catch (e) {
      console.error('Failed to update cart:', e);
      alert('Error removing item. Please try again.');
      return;
  }
  displayCart();
  updateCartCount();
}

function checkout() {
  if (!isLoggedIn()) {
      alert('Please log in to checkout.');
      window.location.href = 'login.html';
      return;
  }
  let cart;
  try {
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
  } catch (e) {
      console.error('Failed to parse cart:', e);
      alert('Error loading cart. Please try again.');
      return;
  }
  if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
  }

  // Validate cart items
  const invalidItem = cart.find(item => !item.id || !item.title || !item.price || !item.quantity);
  if (invalidItem) {
      alert('Invalid item in cart. Please remove it and try again.');
      return;
  }

  let orders;
  try {
      orders = JSON.parse(localStorage.getItem('orders') || '[]');
  } catch (e) {
      console.error('Failed to parse orders:', e);
      alert('Error loading orders. Please try again.');
      return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
      alert('User authentication token is missing. Please log in again.');
      window.location.href = 'login.html';
      return;
  }

  let userId;
  try {
      userId = atob(token).toLowerCase();
  } catch (e) {
      console.error('Failed to decode token:', e);
      alert('Invalid session. Please log in again.');
      return;
  }

  const order = {
      id: Date.now().toString(),
      userId: userId,
      items: cart.map(item => ({
          id: item.id,
          title: item.title,
          author: item.author,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          genre: item.genre
      })),
      date: new Date().toISOString(),
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  };

  orders.push(order);
  try {
      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.setItem('cart', '[]');
  } catch (e) {
      console.error('Failed to save order:', e);
      alert('Error saving order. Please try again.');
      return;
  }

  alert('Order placed successfully!');
  displayCart();
  updateCartCount();
  window.location.href = 'orders.html';
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