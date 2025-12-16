// Sample Items Data - Edit this array to add your real products
const items = [
    {
        id: 1,
        name: "OUD CANDLE",
        price: 100,
        image: "images/candle1.jpg" // Replace with your image URL or local path
    },
    {
        id: 2,
        name: "Vanilla Candle",
        price: 100,
        image: "images/candle2.jpg" // Replace with your image URL or local path
    },
    {
        id: 3,
        name: "Rose Candle",
        price: 100,
        image: "images/candle3.jpg" // Replace with your image URL or local path
    },
    {
        id: 4,
        name: "Bubble Candle",
        price: 130,
        image: "images/White hoodie.jpg" // Replace with your image URL or local path
    },
    {
        id: 5,
        name: "Moon",
        price: 200,
        image: "images/Moon.jpg" // Replace with your image URL or local path
    },
    {
        id: 6,
        name: "Red Candle",
        price: 60,
        image: "images/red_candle.jpeg" // Replace with your image URL or local path
    },
    {
        id: 7,
        name: "Flower Scented Candle",
        price: 90,
        image: "images/flower_candle.jpg" // Replace with your image URL or local path
    },
    {
        id: 8,
        name: "Zig Zag Candle",
        price: 60,
        image: "images/cute.jpeg" // Replace with your image URL or local path
    },
    {
        id: 9,
        name: "Wedding Giveaway Packages (50 pcs)",
        price: 1000,
        image: "images/package.jpeg" // Replace with your image URL or local path
    },
    

    // Add more: { id: 4, name: "Your Item", price: 15.99, image: "path/to/image.jpg" }
];

// Load cart and favorites from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Function to render products
function renderProducts() {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';
    items.forEach(item => {
        const isFavorited = favorites.some(fav => fav.id === item.id);
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <div class="price">${item.price.toFixed(2)} EGP</div>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart(${item.id})">Add to Cart</button>
                <i class="fas fa-heart fav-heart ${isFavorited ? '' : 'unfavorited'}" onclick="toggleFavorite(${item.id})" title="${isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}"></i>
            </div>
        `;
        productsContainer.appendChild(productDiv);
    });
    updateCounts();
}

// Add to Cart
function addToCart(id) {
    const item = items.find(i => i.id === id);
    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    saveCart();
    updateCounts();
    alert(`${item.name} added to cart!`);
}

// Remove from Cart
function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveCart();
    renderCart();
    updateCounts();
}

// Update Quantity in Cart
function updateQuantity(id, newQty) {
    const item = cart.find(c => c.id === id);
    if (item) {
        item.quantity = parseInt(newQty) || 1;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            renderCart();
            updateCounts();
        }
    }
}

// Toggle Favorite
function toggleFavorite(id) {
    const index = favorites.findIndex(f => f.id === id);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        const item = items.find(i => i.id === id);
        favorites.push(item);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderProducts(); // Re-render to update hearts
    updateCounts();
}

// Render Cart
function renderCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('cartTotal').textContent = '0.00';
        return;
    }
    cartItemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div>
                <strong>${item.name}</strong><br>
                ${item.price.toFixed(2)} EGP each
            </div>
            <div class="quantity">
                Qty: <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)">
            </div>
            <div>${ (item.price * item.quantity).toFixed(2) } EGP </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = total.toFixed(2);
}

// Render Favorites
function renderFavorites() {
    const favoritesItemsDiv = document.getElementById('favoritesItems');
    if (favorites.length === 0) {
        favoritesItemsDiv.innerHTML = '<p>No favorites yet.</p>';
        return;
    }
    favoritesItemsDiv.innerHTML = favorites.map(item => `
        <div class="product">
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <div class="price">${item.price.toFixed(2)} EGP</div>
            <button class="add-to-cart" onclick="addToCart(${item.id})">Add to Cart</button>
            <i class="fas fa-heart fav-heart" onclick="toggleFavorite(${item.id})"></i>
        </div>
    `).join('');

}

// Update Cart/Favorites Counts
function updateCounts() {
    document.getElementById('cartCount').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('favoritesCount').textContent = favorites.length;
}

// Save Cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Modal Functions
const cartModal = document.getElementById('cartModal');
const favoritesModal = document.getElementById('favoritesModal');
const cartBtn = document.getElementById('cartBtn');
const favoritesBtn = document.getElementById('favoritesBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

// Open Cart
cartBtn.onclick = () => {
    renderCart();
    cartModal.style.display = 'block';
};

// Open Favorites
favoritesBtn.onclick = () => {
    renderFavorites();
    favoritesModal.style.display = 'block';
};

// Close Modals
document.querySelectorAll('.close').forEach(close => {
    close.onclick = () => {
        cartModal.style.display = 'none';
        favoritesModal.style.display = 'none';
    };
});

window.onclick = (event) => {
    if (event.target === cartModal) cartModal.style.display = 'none';
    if (event.target === favoritesModal) favoritesModal.style.display = 'none';
};

// Checkout (Cash Only)
checkoutBtn.onclick = () => {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    alert('Thanks! Contact us via DM or phone to arrange cash payment and pickup/delivery.');
    cart = []; // Optional: Clear cart after "checkout"
    saveCart();
    renderCart();
    cartModal.style.display = 'none';
    updateCounts();
};

// Initialize
renderProducts();