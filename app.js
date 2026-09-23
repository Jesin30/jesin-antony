// =========================================================
// MOCK PRODUCTS DATA & REST API SIMULATION (TASK 1 & 3)
// =========================================================

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: "MacBook Pro M3 Max 16\"",
    category: "Laptops",
    price: 249900,
    rating: 4.9,
    icon: "💻",
    description: "Apple M3 Max chip with 16-core CPU, 40-core GPU, 48GB unified memory and Liquid Retina XDR.",
  },
  {
    id: 2,
    name: "Sony WH-1000XM5 ANC Headphones",
    category: "Audio",
    price: 28990,
    rating: 4.8,
    icon: "🎧",
    description: "Industry leading noise canceling with 2 processors, 8 microphones, and up to 30 hours battery.",
  },
  {
    id: 3,
    name: "Apple Watch Ultra 2 GPS + Cellular",
    category: "Wearables",
    price: 89900,
    rating: 4.9,
    icon: "⌚",
    description: "Rugged 49mm titanium case, precision dual-frequency GPS, and up to 36 hours battery life.",
  },
  {
    id: 4,
    name: "Dell XPS 15 OLED Touchscreen",
    category: "Laptops",
    price: 184500,
    rating: 4.7,
    icon: "💻",
    description: "13th Gen Intel Core i9, 32GB DDR5, RTX 4070 GPU, and stunning 3.5K OLED InfinityEdge screen.",
  },
  {
    id: 5,
    name: "Marshall Stanmore III Bluetooth Speaker",
    category: "Audio",
    price: 34999,
    rating: 4.6,
    icon: "🔊",
    description: "Home Bluetooth speaker with re-engineered wider soundstage and iconic vintage aesthetic.",
  },
  {
    id: 6,
    name: "Samsung Galaxy Watch 6 Classic",
    category: "Wearables",
    price: 36999,
    rating: 4.5,
    icon: "⌚",
    description: "Rotating bezel, advanced sleep coaching, ECG tracking, and sapphire crystal glass.",
  },
  {
    id: 7,
    name: "Logitech MX Master 3S Wireless Mouse",
    category: "Accessories",
    price: 9995,
    rating: 4.9,
    icon: "🖱️",
    description: "Quiet clicks, 8K DPI track-on-glass sensor, and ultra-fast MagSpeed electromagnetic scrolling.",
  },
  {
    id: 8,
    name: "Keychron Q1 Pro Wireless Mechanical Keyboard",
    category: "Accessories",
    price: 17499,
    rating: 4.8,
    icon: "⌨️",
    description: "Full aluminum CNC body, hot-swappable mechanical switches, and customizable QMK/VIA firmware.",
  },
  {
    id: 9,
    name: "ASUS ROG Zephyrus G16 Gaming Laptop",
    category: "Laptops",
    price: 219990,
    rating: 4.7,
    icon: "💻",
    description: "Intel Core Ultra 9, NVIDIA RTX 4080, 240Hz OLED ROG Nebula display, and vapor chamber cooling.",
  },
  {
    id: 10,
    name: "Bose QuietComfort Ultra Earbuds",
    category: "Audio",
    price: 25900,
    rating: 4.7,
    icon: "🎵",
    description: "Breakthrough spatialized audio, world-class noise cancellation, and CustomTune technology.",
  },
  {
    id: 11,
    name: "Garmin Fenix 7X Pro Solar",
    category: "Wearables",
    price: 94990,
    rating: 4.9,
    icon: "⌚",
    description: "Solar powered multisport GPS watch with built-in LED flashlight and endurance tracking score.",
  },
  {
    id: 12,
    name: "Anker Prime 20,000mAh 200W Power Bank",
    category: "Accessories",
    price: 11999,
    rating: 4.8,
    icon: "🔋",
    description: "Multi-device ultra-fast charging with smart digital display and compact portable design.",
  }
];

// =========================================================
// STATE MANAGEMENT STORE (TASK 2)
// =========================================================

const state = {
  products: [...SAMPLE_PRODUCTS],
  selectedCategory: "All",
  searchQuery: "",
  sortBy: "featured",
  cart: JSON.parse(localStorage.getItem("electro_cart")) || [],
};

// Elements
const productsGrid = document.getElementById("productsGrid");
const categoryTabs = document.getElementById("categoryTabs");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartOverlay = document.getElementById("cartOverlay");
const cartDrawer = document.getElementById("cartDrawer");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartCountBadge = document.getElementById("cartCountBadge");
const subtotalDisplay = document.getElementById("subtotalDisplay");
const taxDisplay = document.getElementById("taxDisplay");
const totalDisplay = document.getElementById("totalDisplay");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalOrderSummary = document.getElementById("modalOrderSummary");
const toast = document.getElementById("toast");

// =========================================================
// CART ACTIONS & STATE SYNC
// =========================================================

function saveCart() {
  localStorage.setItem("electro_cart", JSON.stringify(state.cart));
  updateCartBadge();
  renderCart();
}

function addToCart(productId) {
  const product = state.products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = state.cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  showToast(`Added "${product.name}" to cart! 🛒`);
}

function updateQuantity(productId, delta) {
  const item = state.cart.find((i) => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter((i) => i.id !== productId);
  }

  saveCart();
}

function updateCartBadge() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountBadge.textContent = count;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// =========================================================
// RENDER CART
// =========================================================

function renderCart() {
  if (state.cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 10px; color: #94a3b8;">
        <span style="font-size: 40px; display: block; margin-bottom: 8px;">🛒</span>
        <h4 style="color: #ffffff; margin-bottom: 4px;">Your cart is empty</h4>
        <p style="font-size: 13px;">Browse items and click "Add to Cart" to start.</p>
      </div>
    `;
    subtotalDisplay.textContent = "₹0";
    taxDisplay.textContent = "₹0";
    totalDisplay.textContent = "₹0";
    return;
  }

  let subtotal = 0;
  cartItemsContainer.innerHTML = state.cart
    .map((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      return `
        <div class="cart-item">
          <div class="cart-item-icon">${item.icon}</div>
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <span>₹${item.price.toLocaleString("en-IN")}</span>
          </div>
          <div class="cart-controls">
            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
            <span style="font-weight: bold; min-width: 16px; text-align: center;">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
      `;
    })
    .join("");

  const tax = Math.round(subtotal * 0.18);
  const finalTotal = subtotal + tax;

  subtotalDisplay.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
  taxDisplay.textContent = `₹${tax.toLocaleString("en-IN")}`;
  totalDisplay.textContent = `₹${finalTotal.toLocaleString("en-IN")}`;
}

// =========================================================
// FILTER & RENDER PRODUCTS
// =========================================================

function getFilteredProducts() {
  let list = [...state.products];

  // Category filter
  if (state.selectedCategory !== "All") {
    list = list.filter((p) => p.category === state.selectedCategory);
  }

  // Search filter
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (state.sortBy === "low-to-high") {
    list.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === "high-to-high") {
    list.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
}

function renderProducts() {
  const filtered = getFilteredProducts();

  if (filtered.length === 0) {
    productsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; color: #94a3b8;">
        <span style="font-size: 45px; display: block; margin-bottom: 10px;">🔍</span>
        <h3 style="color: #ffffff; margin-bottom: 6px;">No matching products found</h3>
        <p>Try searching for a different item or clear the filter.</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = filtered
    .map(
      (p) => `
      <div class="product-card">
        <div class="product-image-box">${p.icon}</div>
        <div class="product-meta">
          <span class="category-tag">${p.category}</span>
          <span class="rating-tag">★ ${p.rating}</span>
        </div>
        <h3 class="product-title">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-bottom">
          <span class="product-price">₹${p.price.toLocaleString("en-IN")}</span>
          <button class="add-cart-btn" onclick="addToCart(${p.id})">+ Add to Cart</button>
        </div>
      </div>
    `
    )
    .join("");
}

// =========================================================
// EVENT LISTENERS
// =========================================================

// Category Tab Click
categoryTabs.addEventListener("click", (e) => {
  if (e.target.classList.contains("tab-btn")) {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    state.selectedCategory = e.target.getAttribute("data-category");
    renderProducts();
  }
});

// Search Input
searchInput.addEventListener("input", (e) => {
  state.searchQuery = e.target.value;
  renderProducts();
});

// Sort Select
sortSelect.addEventListener("change", (e) => {
  state.sortBy = e.target.value;
  renderProducts();
});

// Open / Close Cart Drawer
function toggleCart(open) {
  cartDrawer.classList.toggle("active", open);
  cartOverlay.classList.toggle("active", open);
}

cartBtn.addEventListener("click", () => toggleCart(true));
closeCartBtn.addEventListener("click", () => toggleCart(false));
cartOverlay.addEventListener("click", () => toggleCart(false));

// Checkout Simulation
checkoutBtn.addEventListener("click", () => {
  if (state.cart.length === 0) {
    alert("Your shopping cart is empty!");
    return;
  }

  const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const itemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = totalDisplay.textContent;

  modalOrderSummary.innerHTML = `
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Total Items:</strong> ${itemCount} item(s)</p>
    <p><strong>Grand Total:</strong> <span style="color: #38bdf8; font-weight: 800;">${grandTotal}</span></p>
    <p><strong>Delivery Address:</strong> Sample Tech Campus, Chennai</p>
    <p><strong>Payment Status:</strong> <span style="color: #22c55e;">Paid (Simulated Sandbox)</span></p>
  `;

  toggleCart(false);
  checkoutModal.classList.add("active");

  // Clear cart on successful checkout
  state.cart = [];
  saveCart();
});

closeModalBtn.addEventListener("click", () => {
  checkoutModal.classList.remove("active");
});

// Global functions for inline onclick handlers
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;

// Initial render
updateCartBadge();
renderCart();
renderProducts();
