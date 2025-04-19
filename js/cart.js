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
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
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
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItem = cart.find(item => item.id === bookId);
    if (!cartItem) return;
    if (quantity <= 0) {
      cart = cart.filter(item => item.id !== bookId);
    } else {
      cartItem.quantity = quantity;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
  }
  
  function removeFromCart(bookId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => item.id !== bookId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
  }
  
  function checkout() {
    if (!isLoggedIn()) {
      alert('Please log in to checkout.');
      window.location.href = 'login.html';
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }
  
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = {
      id: Date.now().toString(),
      userId: atob(localStorage.getItem('token') || ''), // Link order to user
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
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('cart', '[]');
    alert('Order placed successfully!');
    displayCart(); // Update cart display immediately
    updateCartCount();
    window.location.href = 'orders.html';
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