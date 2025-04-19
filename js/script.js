const books = [
    { id: '1', title: 'Jane Eyre', author: 'Charlotte Brontë', price: 9.99, genre: 'Fiction', image: 'https://teaandinksociety.com/wp-content/uploads/2023/02/Books-with-a-Characters-Name-in-the-Title.jpg' },
    { id: '2', title: 'The Book of Lost Names', author: 'Kristin Harmel', price: 14.99, genre: 'Non-Fiction', image: 'https://m.media-amazon.com/images/I/71L9dmsWQmL._UF1000,1000_QL80_.jpg' },
    { id: '3', title: 'The Name of the Wind', author: 'Patrick Rothfuss', price: 12.99, genre: 'Fantasy', image: 'https://api.time.com/wp-content/uploads/2020/10/The-Name-of-the-Wind-Patrick-Rothfuss-100-best-fantasy-books.jpg' },
    { id: '4', title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 11.99, genre: 'Fantasy', image: 'assets/placeholder.jpg' },
  ];
  
  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateAuthStatus();
    const bookListContainer = document.querySelector('.books-container');
    if (bookListContainer) {
      displayBooks(books);
    }
    if (document.getElementById('recommended-books')) {
      displayRecommendations();
    }
  });
  
  function displayBooks(booksToDisplay) {
    const bookListContainer = document.querySelector('.books-container');
    if (!bookListContainer) {
      console.error('Books container not found.');
      return;
    }
    bookListContainer.innerHTML = '';
    booksToDisplay.forEach(book => {
      if (!book.id || !book.title || !book.price) {
        console.warn('Invalid book data:', book);
        return;
      }
      const bookCard = document.createElement('div');
      bookCard.classList.add('book-card');
      bookCard.innerHTML = `
        <img src="${book.image}" alt="${book.title}" class="book-image">
        <div class="book-card-details">
          <h3>${book.title}</h3>
          <p>Author: ${book.author || 'Unknown'}</p>
          <p class="price">$${book.price.toFixed(2)}</p>
        </div>
        <div class="book-card-actions">
          <button onclick="addToCart('${book.id}')">Add to Cart</button>
          <button onclick="addToWishlist('${book.id}')">Add to Wishlist</button>
        </div>
      `;
      bookListContainer.appendChild(bookCard);
    });
  }
  
  function filterBooks() {
    const genre = document.getElementById('genre-filter')?.value;
    const filteredBooks = genre ? books.filter(book => book.genre === genre) : books;
    displayBooks(filteredBooks);
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