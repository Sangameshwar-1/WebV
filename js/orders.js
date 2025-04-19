document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateAuthStatus();
    displayOrders();
  });
  
  function displayOrders() {
    const ordersContainer = document.querySelector('.orders-container');
    if (!ordersContainer) {
      console.error('Orders container not found.');
      return;
    }
  
    if (!isLoggedIn()) {
      ordersContainer.innerHTML = '<p>Please log in to view your orders.</p>';
      return;
    }
  
    const userId = atob(localStorage.getItem('token') || '');
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders = orders.filter(order => order.userId === userId); // Show only user's orders
    ordersContainer.innerHTML = '';
  
    if (orders.length === 0) {
      ordersContainer.innerHTML = '<p>You have no orders.</p>';
      return;
    }
  
    orders.forEach(order => {
      if (!order.items || !order.date || !order.total) {
        console.warn('Invalid order data:', order);
        return;
      }
      const orderItem = document.createElement('div');
      orderItem.classList.add('order-item');
      let itemsHtml = order.items.map(item => `
        <p>${item.title} - $${item.price.toFixed(2)} x ${item.quantity}</p>
      `).join('');
      orderItem.innerHTML = `
        <h4>Order #${order.id}</h4>
        <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
        ${itemsHtml}
        <p>Total: $${order.total.toFixed(2)}</p>
      `;
      ordersContainer.appendChild(orderItem);
    });
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