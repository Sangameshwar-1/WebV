function displayRecommendations() {
    if (!isLoggedIn()) {
      document.getElementById('recommended-books').innerHTML = '<p>Log in to see personalized recommendations.</p>';
      return;
    }
  
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userItems = [
      ...cart,
      ...wishlist,
      ...orders.flatMap(order => order.items)
    ];
  
    // Simple content-based filtering: recommend books of the same genre
    const genres = [...new Set(userItems.map(item => item.genre))];
    let recommendations = books.filter(book => genres.includes(book.genre) && !userItems.find(item => item.id === book.id));
  
    // If no user items, recommend popular books
    if (userItems.length === 0) {
      recommendations = books.slice(0, 3); // Top 3 books
    }
  
    // Display recommendations
    const recommendedBooksContainer = document.getElementById('recommended-books');
    recommendedBooksContainer.innerHTML = '';
    recommendations.slice(0, 3).forEach(book => {
      const bookCard = document.createElement('div');
      bookCard.classList.add('book-card');
      bookCard.innerHTML = `
        <img src="${book.image}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p class="price">$${book.price.toFixed(2)}</p>
        <button onclick="addToCart('${book.id}')">Add to Cart</button>
        <button onclick="addToWishlist('${book.id}')">Add to Wishlist</button>
      `;
      recommendedBooksContainer.appendChild(bookCard);
    });
  
    if (recommendations.length === 0) {
      recommendedBooksContainer.innerHTML = '<p>No recommendations available.</p>';
    }
  }