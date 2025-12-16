// ==============================
// PRODUCTS DATA
// ==============================
const items = [
  {
    id: 1,
    name: "OUD CANDLE",
    price: 130,
    images: ["images/candle1.jpg"]
  },
  {
    id: 2,
    name: "Vanilla Candle",
    price: 110,
    images: ["images/candle2.jpg"]
  },
  {
    id: 3,
    name: "Rose Candle",
    price: 100,
    images: ["images/candle3.jpg"]
  },
  {
    id: 4,
    name: "Bubble Candle",
    price: 130,
    images: [
      "images/bubble1.jpeg",
      "images/bubble2.jpeg"
    ]
  },
  {
    id: 5,
    name: "Moon",
    price: 200,
    images: ["images/moon.jpg"]
  },
  {
    id: 6,
    name: "Red Candle",
    price: 60,
    images: ["images/red_candle.jpeg"]
  },
  {
    id: 7,
    name: "Flower Scented Candle",
    price: 90,
    images: ["images/flower_candle.jpg"]
  },
  {
    id: 8,
    name: "Zig Zag Candle",
    price: 60,
    images: ["images/cute.jpeg"]
  },
  {
    id: 9,
    name: "Wedding Giveaway Packages (50 pcs)",
    price: 1000,
    images: [
      "images/packge.jpeg",
      "images/package2.jpeg"
    ]
  }
];

// ==============================
// STATE
// ==============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ==============================
// RENDER PRODUCTS
// ==============================
function renderProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  items.forEach(item => {
    const isFavorited = favorites.some(f => f.id === item.id);
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <img
        src="${item.images[0]}"
        alt="${item.name}"
        class="main-image"
        id="main-img-${item.id}"
      >

      <div class="thumbnails">
        ${item.images.map(img => `
          <img
            src="${img}"
            alt="${item.name}"
            onclick="changeImage(${item.id}, '${img}')"
          >
        `).join("")}
      </div>

      <h3>${item.name}</h3>
      <div class="price">${item.price.toFixed(2)} EGP</div>

      <div class="product-actions">
        <button class="add-to-cart" onclick="addToCart(${item.id})">
          Add to Cart
        </button>
        <i class="fas fa-heart fav-heart ${isFavorited ? "" : "unfavorited"}"
           onclick="toggleFavorite(${item.id})"></i>
      </div>
    `;

    container.appendChild(div);
  });

  updateCounts();
}

// ==============================
// IMAGE SWITCH
// ==============================
function changeImage(productId, newImage) {
  const img = document.getElementById(`main-img-${productId}`);
  if (img) img.src = newImage;
}

// ==============================
// CART FUNCTIONS
// ==============================
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

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
  updateCounts();
}

function updateQuantity(id, qty) {
  const item = cart.find(c => c.id === id);
  if (!item) return;

  item.quantity = parseInt(qty) || 1;
  if (item.quantity <= 0) removeFromCart(id);
  saveCart();
  renderCart();
  updateCounts();
}

// ==============================
// FAVORITES
// ==============================
function toggleFavorite(id) {
  const index = favorites.findIndex(f => f.id === id);

  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    const item = items.find(i => i.id === id);
    favorites.push(item);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderProducts();
  updateCounts();
}

// ==============================
// RENDER CART
// ==============================
function renderCart() {
  const div = document.getElementById("cartItems");

  if (cart.length === 0) {
    div.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById("cartTotal").textContent = "0.00";
    return;
  }

  div.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.images[0]}" alt="${item.name}">
      <div>
        <strong>${item.name}</strong><br>
        ${item.price.toFixed(2)} EGP each
      </div>
      <div class="quantity">
        Qty:
        <input type="number" min="1" value="${item.quantity}"
          onchange="updateQuantity(${item.id}, this.value)">
      </div>
      <div>${(item.price * item.quantity).toFixed(2)} EGP</div>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    </div>
  `).join("");

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  document.getElementById("cartTotal").textContent = total.toFixed(2);
}

// ==============================
// RENDER FAVORITES
// ==============================
function renderFavorites() {
  const div = document.getElementById("favoritesItems");

  if (favorites.length === 0) {
    div.innerHTML = "<p>No favorites yet.</p>";
    return;
  }

  div.innerHTML = favorites.map(item => `
    <div class="product">
      <img src="${item.images[0]}" alt="${item.name}">
      <h3>${item.name}</h3>
      <div class="price">${item.price.toFixed(2)} EGP</div>
      <button onclick="addToCart(${item.id})">Add to Cart</button>
      <i class="fas fa-heart fav-heart"
         onclick="toggleFavorite(${item.id})"></i>
    </div>
  `).join("");
}

// ==============================
// COUNTS & STORAGE
// ==============================
function updateCounts() {
  document.getElementById("cartCount").textContent =
    cart.reduce((s, i) => s + i.quantity, 0);
  document.getElementById("favoritesCount").textContent = favorites.length;
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ==============================
// MODALS
// ==============================
const cartModal = document.getElementById("cartModal");
const favoritesModal = document.getElementById("favoritesModal");

document.getElementById("cartBtn").onclick = () => {
  renderCart();
  cartModal.style.display = "block";
};

document.getElementById("favoritesBtn").onclick = () => {
  renderFavorites();
  favoritesModal.style.display = "block";
};

document.querySelectorAll(".close").forEach(btn => {
  btn.onclick = () => {
    cartModal.style.display = "none";
    favoritesModal.style.display = "none";
  };
});

window.onclick = e => {
  if (e.target === cartModal) cartModal.style.display = "none";
  if (e.target === favoritesModal) favoritesModal.style.display = "none";
};

// ==============================
// CHECKOUT
// ==============================
document.getElementById("checkoutBtn").onclick = () => {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  alert("Thank you! Please contact us to arrange cash payment.");
  cart = [];
  saveCart();
  renderCart();
  cartModal.style.display = "none";
  updateCounts();
};

// ==============================
// INIT
// ==============================
renderProducts();
