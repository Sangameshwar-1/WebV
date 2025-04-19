document.addEventListener('DOMContentLoaded', () => {
    const bookListContainer = document.querySelector('.books-container');
    const cartCountSpan = document.getElementById('cart-count');
  
    // Function to fetch books from the backend
    async function fetchBooks() {
      try {
        const response = await fetch('/api/books');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const books = await response.json();
        displayBooks(books);
      } catch (error) {
        console.error('Failed to fetch books:', error);
        bookListContainer.innerHTML = '<p>Failed to load books.</p>';
      }
    }
  
    // Function to display books
    function displayBooks(books) {
      bookListContainer.innerHTML = '';
      books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML = `
          <img src="${book.image || 'placeholder.jpg'}" alt="${book.title}">
          <h3>${book.title}</h3>
          <p>Author: ${book.author}</p>
          <p class="price">$${book.price.toFixed(2)}</p>
          <button class="add-to-cart" data-id="${book._id}">Add to Cart</button>
        `;
        bookListContainer.appendChild(bookCard);
      });
  
      // Add event listeners to "Add to Cart" buttons
      document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', async () => {
          const bookId = button.getAttribute('data-id');
          await addToCart(bookId);
        });
      });
    }
  
    // Function to add a book to the cart
    async function addToCart(bookId) {
      try {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Example
          },
          body: JSON.stringify({ bookId })
        });
        if (!response.ok) {
          if (response.status === 401) {
            alert('Please log in to add items to your cart.');
            window.location.href = '/login';
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const cart = await response.json();
        updateCartCount(cart.items.length);
        alert('Book added to cart!');
      } catch (error) {
        console.error('Failed to add to cart:', error);
        alert('Failed to add book to cart.');
      }
    }
  
    // Function to update the cart count in the header
    function updateCartCount(count) {
      if (cartCountSpan) {
        cartCountSpan.textContent = count;
      }
      const cartCountHeaderSpans = document.querySelectorAll('#cart-count-header, #cart-count-header-orders');
      cartCountHeaderSpans.forEach(span => {
        if (span) {
          span.textContent = count;
        }
      });
    }
  
    // Function to fetch the initial cart count
    async function fetchCartCount() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('/api/cart/count', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            updateCartCount(data.count);
          }
        } catch (error) {
          console.error('Failed to fetch cart count:', error);
        }
      }
    }
  
    // Initialize the page
    fetchBooks();
    fetchCartCount();
  });


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