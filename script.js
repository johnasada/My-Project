// script.js

// Sample product data
const products = [
    {
        id: 1,
        name: "Farm Tools Set",
        price: 699.99,
        description: "Reliable Tools",
        image: "images/tools.jpeg",
        category: "garden"
    },
    {
        id: 2,
        name: "Seed Pack",
        price: 999.99,
        description: "Pack of 50 assorted vegetable and flower seeds",
        image: "images/seedbag.jpeg",
        category: "garden"
    },
    // Add more products as needed
];

// State management
let currentUser = null;
let cart = [];
let isLoginMode = true;

// Authentication functions
function toggleAuth() {
    const modal = document.getElementById('auth-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('auth-title');
    const switchText = document.getElementById('auth-switch');
    
    title.textContent = isLoginMode ? 'Login' : 'Sign Up';
    switchText.innerHTML = isLoginMode 
        ? 'Don\'t have an account? <a href="#" onclick="toggleAuthMode()">Sign up</a>'
        : 'Already have an account? <a href="#" onclick="toggleAuthMode()">Login</a>';
}

document.getElementById('auth-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simulate authentication
    currentUser = { email };
    document.getElementById('user-status').textContent = email;
    document.getElementById('auth-button').textContent = 'Logout';
    toggleAuth();
});

// Cart functions
function showCart() {
    const modal = document.getElementById('cart-modal');
    updateCartDisplay();
    modal.style.display = 'block';
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Product display functions
function displayProducts(productsToShow = products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="showProductDetails(${product.id})">View Details</button>
            <button onclick="addToCart(${JSON.stringify(product)})">Add to Cart</button>
        </div>
    `).join('');
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    const detailsSection = document.getElementById('product-details');
    const productsGrid = document.getElementById('products-grid');
    
    detailsSection.classList.remove('hidden');
    productsGrid.classList.add('hidden');
    
    const productInfo = detailsSection.querySelector('.product-info');
    productInfo.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p class="price">$${product.price}</p>
        <button onclick="addToCart(${JSON.stringify(product)})">Add to Cart</button>
        <button onclick="goBack()">Back to Products</button>
    `;

    displaySimilarProducts(product);
}

function displaySimilarProducts(product) {
    const similarProducts = products.filter(p => 
        p.category === product.category && p.id !== product.id
    );
    
    const similarProductsGrid = document.getElementById('similar-products-grid');
    similarProductsGrid.innerHTML = similarProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="showProductDetails(${product.id})">View Details</button>
        </div>
    `).join('');
}

function goBack() {
    document.getElementById('product-details').classList.add('hidden');
    document.getElementById('products-grid').classList.remove('hidden');
}

// Search function
function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}

// Payment functions
function checkout() {
    if (!currentUser) {
        alert('Please login to checkout');
        return;
    }
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('payment-modal').style.display = 'block';
}

document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Simulate payment processing
    alert('Payment successful! Your order has been placed.');
    cart = [];
    updateCart();
    document.getElementById('payment-modal').style.display = 'none';
});

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    loadCartFromLocalStorage();
});

// Handle quantity updates
function updateQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = Math.max(0, cartItem.quantity + change);
        if (cartItem.quantity === 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Error handling
function handleError(error) {
    console.error('An error occurred:', error);
    alert('Something went wrong. Please try again.');
}

// Local storage functions for persistence
function saveCartToLocalStorage() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        handleError(error);
    }
}

function loadCartFromLocalStorage() {
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartCount();
            updateCartDisplay();
        }
    } catch (error) {
        handleError(error);
    }
}

// Update cart and save to local storage
function updateCart() {
    updateCartCount();
    updateCartDisplay();
    saveCartToLocalStorage();
}

// Responsive navigation menu for mobile
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('show');
}

// Add event listeners for responsive design
window.addEventListener('resize', function() {
    const navLinks = document.querySelector('.nav-links');
    if (window.innerWidth > 768) {
        navLinks.classList.remove('show');
    }
});